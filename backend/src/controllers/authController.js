const { authenticateStudent, createStudentUser, findUserByEmail } = require('../models/userModel');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(payload));
}

function getRequestBody(body) {
  return {
    username: String(body?.username || '').trim(),
    email: String(body?.email || '').trim(),
    password: String(body?.password || '').trim(),
  };
}

async function registerStudent(req, res, body) {
  const { username, email, password } = getRequestBody(body);

  if (!username || !email || !password) {
    return sendJson(res, 400, {
      message: 'Username, email, and password are required.',
    });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return sendJson(res, 409, {
      message: 'A student account with that email already exists.',
    });
  }

  const user = await createStudentUser({ username, email, password });
  return sendJson(res, 201, {
    message: 'Student account created successfully.',
    user,
  });
}

async function loginStudent(req, res, body) {
  const { email, password } = getRequestBody(body);

  if (!email || !password) {
    return sendJson(res, 400, {
      message: 'Email and password are required.',
    });
  }

  const user = await authenticateStudent({ email, password });
  if (!user) {
    return sendJson(res, 401, {
      message: 'Invalid student credentials.',
    });
  }

  return sendJson(res, 200, {
    message: 'Student login successful.',
    user,
  });
}

module.exports = {
  registerStudent,
  loginStudent,
  sendJson,
};
