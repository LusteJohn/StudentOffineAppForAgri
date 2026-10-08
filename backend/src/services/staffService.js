const crypto = require('crypto');

const sessions = new Map();
const STUDENT_TABLES = [
  'student_info',
  'question_answers',
  'job_sheet_answers',
  'performance_answer',
  'lesson_content_progress',
  'lesson_content_bookmark',
  'student_lesson_achievement',
  'student_module_achievement',
  'student_tutorials',
];

function supabaseConfig() {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.');
  }
  return { url, key };
}

async function supabaseRequest(path, options = {}) {
  const config = supabaseConfig();
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${details.slice(0, 500)}`);
  }

  return response.status === 204 ? null : response.json();
}

function sanitizeUser(user) {
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

async function authenticateStaff(email, password) {
  const users = await supabaseRequest(
    `users?select=*&email=eq.${encodeURIComponent(email)}&role=in.(admin,faculty)&limit=1`,
  );
  const user = users?.[0];
  if (!user || user.password !== password) {
    return null;
  }
  return sanitizeUser(user);
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { user, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
  return token;
}

function getSession(token) {
  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    return null;
  }
  return session;
}

function deleteSession(token) {
  sessions.delete(token);
}

async function createFaculty({ username, email, password }) {
  const existing = await supabaseRequest(
    `users?select=user_id&email=eq.${encodeURIComponent(email)}&limit=1`,
  );
  if (existing?.length) {
    throw new Error('A user with that email already exists.');
  }

  const users = await supabaseRequest('users?select=user_id&order=user_id.desc&limit=1');
  const userId = Number(users?.[0]?.user_id || 0) + 1;
  const rows = await supabaseRequest('users', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify([{
      user_id: userId,
      username,
      email,
      password,
      role: 'faculty',
      created_at: new Date().toISOString(),
    }]),
  });
  return sanitizeUser(rows[0]);
}

async function listStudents() {
  const users = await supabaseRequest('users?select=user_id,username,email,role,created_at&role=eq.student&order=user_id.asc');
  const result = users.map((user) => ({ user, records: {} }));
  const byUserId = new Map(result.map((student) => [String(student.user.user_id), student]));

  await Promise.all(STUDENT_TABLES.map(async (table) => {
    const records = await supabaseRequest(`${table}?select=*&order=created_at.asc`);
    for (const record of records) {
      const student = byUserId.get(String(record.user_id));
      if (student) {
        if (!student.records[table]) student.records[table] = [];
        student.records[table].push(record);
      }
    }
  }));

  return result;
}

async function listFaculty() {
  const users = await supabaseRequest(
    'users?select=user_id,username,email,role,created_at&role=eq.faculty&order=user_id.asc',
  );
  return users.map(sanitizeUser);
}

module.exports = {
  authenticateStaff,
  createFaculty,
  createSession,
  getSession,
  deleteSession,
  listStudents,
  listFaculty,
};
