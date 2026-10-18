const SYNC_TABLES = [
  { name: 'users', conflictColumn: 'user_id', requiresUserId: false, stripFields: ['password', 'password_hash'] },
  { name: 'student_info', conflictColumn: 'user_id', requiresUserId: true, stripPk: true, pkColumn: 'student_id' },
  { name: 'question_answers', conflictColumn: 'answer_id', requiresUserId: true, stripPk: false, pkColumn: 'answer_id' },
  { name: 'job_sheet_answers', conflictColumn: 'answer_id', requiresUserId: true, stripPk: false, pkColumn: 'answer_id' },
  { name: 'performance_answer', conflictColumn: 'performance_answer_id', requiresUserId: true, stripPk: false, pkColumn: 'performance_answer_id' },
  { name: 'lesson_content_progress', conflictColumn: 'progress_lesson_id', requiresUserId: true, stripPk: false, pkColumn: 'progress_lesson_id' },
  { name: 'lesson_content_bookmark', conflictColumn: 'lesson_content_bookmark_id', requiresUserId: true, stripPk: false, pkColumn: 'lesson_content_bookmark_id' },
  { name: 'student_lesson_achievement', conflictColumn: 'stud_lesson_achievement_id', requiresUserId: true, stripPk: false, pkColumn: 'stud_lesson_achievement_id' },
  { name: 'student_module_achievement', conflictColumn: 'stud_module_achievement_id', requiresUserId: true, stripPk: false, pkColumn: 'stud_module_achievement_id' },
  { name: 'student_tutorials', conflictColumn: 'tutorial_id', requiresUserId: true, stripPk: false, pkColumn: 'tutorial_id' },
];

function getSupabaseConfig() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');

  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.');
  }

  return { url, serviceRoleKey };
}

function buildSupabaseHeaders(config) {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  };
}

async function supabaseRequest(config, path, options = {}) {
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...buildSupabaseHeaders(config),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase request failed (${response.status}) on ${path}: ${details.slice(0, 500)}`);
  }

  return response.status === 204 ? null : response.json();
}

function validateRecords(table, userId, records) {
  if (!Array.isArray(records)) {
    throw new Error(`Sync payload for ${table.name} must be an array.`);
  }

  return records.map((record) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error(`Sync payload for ${table.name} contains an invalid record.`);
    }

    if (table.requiresUserId && Number(record.user_id) !== userId) {
      throw new Error(`Sync payload for ${table.name} contains a record for another user.`);
    }

    const stripFields = table.stripFields || [];
    const sanitized = { ...record };
    for (const field of stripFields) {
      delete sanitized[field];
    }

    if (table.stripPk) {
      const { [table.pkColumn]: _stripped, ...rest } = sanitized;
      return rest;
    }

    return sanitized;
  });
}

async function upsertTable(config, table, records) {
  if (records.length === 0) {
    return 0;
  }

  const endpoint = `${config.url}/rest/v1/${table.name}?on_conflict=${table.conflictColumn}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: buildSupabaseHeaders(config),
    body: JSON.stringify(records),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase rejected ${table.name} (${response.status}): ${details.slice(0, 500)}`);
  }

  return records.length;
}

async function checkUserIdConflict(config, userId) {
  const users = await supabaseRequest(
    config,
    `users?user_id=eq.${userId}&select=role`,
  );
  return users && users.length > 0 ? users[0] : null;
}

async function findNextAvailableUserId(config, baseUserId) {
  let candidate = Number(baseUserId);
  const maxAttempts = 100;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const existing = await supabaseRequest(
      config,
      `users?user_id=eq.${candidate}&select=user_id`,
    );
    if (!existing || existing.length === 0) {
      return candidate;
    }
    candidate += 1;
  }
  throw new Error(`Unable to find an available user_id after ${maxAttempts} attempts.`);
}

async function syncStudentRecords(userId, payload) {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('user_id must be a positive integer.');
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Sync payload must be an object.');
  }

  const config = getSupabaseConfig();
  const synced = {};
  let effectiveUserId = parsedUserId;

  const conflictUser = await checkUserIdConflict(config, parsedUserId);

  if (conflictUser && conflictUser.role && conflictUser.role !== 'student') {
    effectiveUserId = await findNextAvailableUserId(config, parsedUserId);
  }

  for (const table of SYNC_TABLES) {
    let tablePayload = payload[table.name] || [];
    if (effectiveUserId !== parsedUserId) {
      tablePayload = tablePayload.map((r) => ({
        ...r,
        user_id: effectiveUserId,
      }));
    }
    const records = validateRecords(table, effectiveUserId, tablePayload);
    synced[table.name] = await upsertTable(config, table, records);
  }

  const result = { user_id: effectiveUserId, synced };
  if (effectiveUserId !== parsedUserId) {
    return { ...result, remapped: true, original_user_id: parsedUserId };
  }
  return result;
}

module.exports = {
  syncStudentRecords,
};
