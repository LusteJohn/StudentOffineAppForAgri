const SYNC_TABLES = [
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

    const sanitized = { ...record };
    const stripFields = table.stripFields || [];
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

async function createOrFindStudentUser(config, { user_id, email, username, records, ...rest }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedUsername = String(username || '').trim();

  let existingUser = null;

  if (normalizedEmail) {
    const byEmail = await supabaseRequest(
      config,
      `users?select=*&email=eq.${encodeURIComponent(normalizedEmail)}&role=eq.student`,
    );
    if (byEmail && byEmail.length > 0) {
      existingUser = byEmail[0];
    }
  }

  if (!existingUser && normalizedUsername) {
    const byUsername = await supabaseRequest(
      config,
      `users?select=*&username=eq.${encodeURIComponent(normalizedUsername)}&role=eq.student`,
    );
    if (byUsername && byUsername.length > 0) {
      existingUser = byUsername[0];
    }
  }

  if (!existingUser) {
    const stripFields = ['password', 'password_hash'];
    const sanitizedRest = { ...rest };
    for (const field of stripFields) {
      delete sanitizedRest[field];
    }

    const userData = {
      ...sanitizedRest,
      username: normalizedUsername || `student_${Date.now()}`,
      email: normalizedEmail || `student_${Date.now()}@example.com`,
      password: '',
      role: 'student',
      created_at: new Date().toISOString(),
    };
    delete userData.user_id;

    const response = await fetch(`${config.url}/rest/v1/users`, {
      method: 'POST',
      headers: {
        ...buildSupabaseHeaders(config),
        Prefer: 'return=representation',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Failed to create student user (HTTP ${response.status}): ${details.slice(0, 500)}`);
    }

    const result = await response.json();
    existingUser = result && result.length > 0 ? result[0] : null;
  }

  if (!existingUser || !existingUser.user_id) {
    throw new Error('Failed to create or retrieve student user record.');
  }

  return Number(existingUser.user_id);
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

  const supabaseUserId = await createOrFindStudentUser(config, payload);

  let remapped = supabaseUserId !== parsedUserId;

  for (const table of SYNC_TABLES) {
    let tablePayload = payload[table.name] || [];
    if (remapped) {
      tablePayload = tablePayload.map((r) => ({
        ...r,
        user_id: supabaseUserId,
      }));
    }
    const records = validateRecords(table, supabaseUserId, tablePayload);
    synced[table.name] = await upsertTable(config, table, records);
  }

  const result = { user_id: supabaseUserId, synced };
  if (remapped) {
    return { ...result, remapped: true, original_user_id: parsedUserId };
  }
  return result;
}

module.exports = {
  syncStudentRecords,
};
