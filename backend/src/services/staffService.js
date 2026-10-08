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
  const [
    modules,
    lessons,
    lessonContents,
    questions,
    jobSheets,
    performanceChecks,
    moduleAchievements,
    lessonAchievements,
  ] = await Promise.all([
    supabaseRequest('modules?select=module_id,module_name'),
    supabaseRequest('lessons?select=lesson_id,module_id,lesson_name'),
    supabaseRequest('lesson_content?select=lesson_content_id,lesson_id,content_name'),
    supabaseRequest('question_content?select=question_id,lesson_content_id,question'),
    supabaseRequest('job_sheet?select=job_id,lesson_content_id,job_title'),
    supabaseRequest('performance_checklist?select=performance_id,lesson_content_id,performance_question'),
    supabaseRequest('module_achievement?select=module_achievement_id,module_id,name'),
    supabaseRequest('lesson_achievement?select=lesson_achievement_id,lesson_id,name'),
  ]);
  const moduleById = new Map(modules.map((item) => [String(item.module_id), item]));
  const lessonById = new Map(lessons.map((item) => [String(item.lesson_id), item]));
  const contentById = new Map(lessonContents.map((item) => [String(item.lesson_content_id), item]));
  const questionById = new Map(questions.map((item) => [String(item.question_id), item]));
  const jobSheetById = new Map(jobSheets.map((item) => [String(item.job_id), item]));
  const performanceById = new Map(performanceChecks.map((item) => [String(item.performance_id), item]));
  const moduleAchievementById = new Map(moduleAchievements.map((item) => [String(item.module_achievement_id), item]));
  const lessonAchievementById = new Map(lessonAchievements.map((item) => [String(item.lesson_achievement_id), item]));

  function location(lessonContentId) {
    const content = contentById.get(String(lessonContentId));
    const lesson = content ? lessonById.get(String(content.lesson_id)) : null;
    const module = lesson ? moduleById.get(String(lesson.module_id)) : null;
    return {
      content_name: content?.content_name || null,
      lesson_name: lesson?.lesson_name || null,
      module_name: module?.module_name || null,
    };
  }

  function enrich(table, record) {
    if (table === 'question_answers') {
      const question = questionById.get(String(record.question_id));
      return { ...record, question_text: question?.question || null, ...location(question?.lesson_content_id) };
    }
    if (table === 'job_sheet_answers') {
      const job = jobSheetById.get(String(record.job_id));
      return { ...record, job_title: job?.job_title || null, ...location(job?.lesson_content_id) };
    }
    if (table === 'performance_answer') {
      const performance = performanceById.get(String(record.performance_id));
      return { ...record, performance_question: performance?.performance_question || null, ...location(performance?.lesson_content_id) };
    }
    if (table === 'lesson_content_progress' || table === 'lesson_content_bookmark') {
      return { ...record, ...location(record.lesson_content_id) };
    }
    if (table === 'student_lesson_achievement') {
      const achievement = lessonAchievementById.get(String(record.lesson_achievement_id));
      const lesson = achievement ? lessonById.get(String(achievement.lesson_id)) : null;
      return {
        ...record,
        achievement_name: achievement?.name || null,
        lesson_name: lesson?.lesson_name || null,
        module_name: lesson ? moduleById.get(String(lesson.module_id))?.module_name || null : null,
      };
    }
    if (table === 'student_module_achievement') {
      const achievement = moduleAchievementById.get(String(record.module_achievement_id));
      return {
        ...record,
        achievement_name: achievement?.name || null,
        module_name: achievement ? moduleById.get(String(achievement.module_id))?.module_name || null : null,
      };
    }
    return record;
  }

  await Promise.all(STUDENT_TABLES.map(async (table) => {
    const records = await supabaseRequest(`${table}?select=*&order=created_at.asc`);
    for (const record of records) {
      const student = byUserId.get(String(record.user_id));
      if (student) {
        if (!student.records[table]) student.records[table] = [];
        student.records[table].push(enrich(table, record));
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
