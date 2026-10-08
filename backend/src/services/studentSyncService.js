const SYNC_TABLES = [
  { name: 'users', conflictColumn: 'user_id', requiresUserId: false },
  { name: 'student_info', conflictColumn: 'student_id', requiresUserId: true },
  { name: 'question_answers', conflictColumn: 'answer_id', requiresUserId: true },
  { name: 'job_sheet_answers', conflictColumn: 'answer_id', requiresUserId: true },
  { name: 'performance_answer', conflictColumn: 'performance_answer_id', requiresUserId: true },
  { name: 'lesson_content_progress', conflictColumn: 'progress_lesson_id', requiresUserId: true },
  { name: 'lesson_content_bookmark', conflictColumn: 'lesson_content_bookmark_id', requiresUserId: true },
  { name: 'student_lesson_achievement', conflictColumn: 'stud_lesson_achievement_id', requiresUserId: true },
  { name: 'student_module_achievement', conflictColumn: 'stud_module_achievement_id', requiresUserId: true },
  { name: 'student_tutorials', conflictColumn: 'tutorial_id', requiresUserId: true },
];

function getSupabaseConfig() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');

  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.');
  }

  return { url, serviceRoleKey };
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

    return record;
  });
}

async function upsertTable(config, table, records) {
  if (records.length === 0) {
    return 0;
  }

  const endpoint = `${config.url}/rest/v1/${table.name}?on_conflict=${table.conflictColumn}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(records),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase rejected ${table.name} (${response.status}): ${details.slice(0, 500)}`);
  }

  return records.length;
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

  for (const table of SYNC_TABLES) {
    const records = validateRecords(table, parsedUserId, payload[table.name] || []);
    if (table.name === 'users') {
      if (records.some((record) => Number(record.user_id) !== parsedUserId)) {
        throw new Error('The users sync record must match user_id.');
      }
    }
    synced[table.name] = await upsertTable(config, table, records);
  }

  return { user_id: parsedUserId, synced };
}

module.exports = {
  syncStudentRecords,
};
