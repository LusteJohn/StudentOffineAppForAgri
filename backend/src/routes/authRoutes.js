const { loginStudent, registerStudent, sendJson } = require('../controllers/authController');
const {
  createStudentInfoHandler,
  deleteStudentInfoHandler,
  getStudentInfoByIdHandler,
  getStudentInfoByUserIdHandler,
  listStudentInfoHandler,
  updateStudentInfoHandler,
} = require('../controllers/studentInfoController');

async function handleAuthRoutes(req, res, pathname, body) {
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok' });
  }

  if (req.method === 'POST' && pathname === '/api/auth/register') {
    return registerStudent(req, res, body);
  }

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    return loginStudent(req, res, body);
  }

  if (req.method === 'GET' && pathname === '/api/student-info') {
    return listStudentInfoHandler(res);
  }

  if (req.method === 'POST' && pathname === '/api/student-info') {
    return createStudentInfoHandler(res, body);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/student-info/by-user/')) {
    const userId = pathname.split('/').pop();
    return getStudentInfoByUserIdHandler(res, userId);
  }

  if (pathname.startsWith('/api/student-info/')) {
    const studentId = pathname.split('/').pop();

    if (req.method === 'GET') {
      return getStudentInfoByIdHandler(res, studentId);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      return updateStudentInfoHandler(res, studentId, body);
    }

    if (req.method === 'DELETE') {
      return deleteStudentInfoHandler(res, studentId);
    }
  }

  return false;
}

module.exports = {
  handleAuthRoutes,
};
