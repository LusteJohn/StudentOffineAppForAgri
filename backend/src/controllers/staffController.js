const {
  authenticateStaff,
  createFaculty,
  createSession,
  getSession,
  deleteSession,
  listStudents,
  listFaculty,
} = require('../services/staffService');
const { sendJson } = require('./authController');

function cookieToken(req) {
  const cookies = String(req.headers.cookie || '').split(';');
  const entry = cookies.find((cookie) => cookie.trim().startsWith('staff_session='));
  return entry ? entry.trim().slice('staff_session='.length) : '';
}

function requireStaff(req, res, roles) {
  const token = cookieToken(req);
  const session = getSession(token);
  if (!session || !roles.includes(session.user.role)) {
    sendJson(res, 401, { message: 'A valid staff session is required.' });
    return null;
  }
  return { token, ...session };
}

async function staffLogin(req, res, body) {
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  const user = await authenticateStaff(email, password);
  if (!user) return sendJson(res, 401, { message: 'Invalid staff credentials.' });

  const token = createSession(user);
  res.setHeader(
    'Set-Cookie',
    `staff_session=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=28800`,
  );
  return sendJson(res, 200, { user });
}

function staffLogout(req, res) {
  deleteSession(cookieToken(req));
  res.setHeader('Set-Cookie', 'staff_session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0');
  return sendJson(res, 200, { message: 'Staff session ended.' });
}

function currentStaff(req, res) {
  const session = requireStaff(req, res, ['admin', 'faculty']);
  return session ? sendJson(res, 200, { user: session.user }) : true;
}

async function registerFaculty(req, res, body) {
  if (!requireStaff(req, res, ['admin'])) return true;
  const username = String(body?.username || '').trim();
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  if (!username || !email || !password) {
    return sendJson(res, 400, { message: 'Username, email, and password are required.' });
  }
  try {
    return sendJson(res, 201, { user: await createFaculty({ username, email, password }) });
  } catch (error) {
    return sendJson(res, 400, { message: error instanceof Error ? error.message : 'Unable to register faculty.' });
  }
}

async function students(req, res) {
  if (!requireStaff(req, res, ['admin', 'faculty'])) return true;
  try {
    return sendJson(res, 200, { students: await listStudents() });
  } catch (error) {
    return sendJson(res, 502, { message: error instanceof Error ? error.message : 'Unable to load students.' });
  }
}

async function faculty(req, res) {
  if (!requireStaff(req, res, ['admin'])) return true;
  try {
    return sendJson(res, 200, { faculty: await listFaculty() });
  } catch (error) {
    return sendJson(res, 502, { message: error instanceof Error ? error.message : 'Unable to load faculty.' });
  }
}

module.exports = { staffLogin, staffLogout, currentStaff, registerFaculty, students, faculty };
