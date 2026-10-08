const {
  staffLogin,
  staffLogout,
  currentStaff,
  registerFaculty,
  students,
  faculty,
} = require('../controllers/staffController');

async function handleStaffRoutes(req, res, pathname, body) {
  if (req.method === 'POST' && pathname === '/api/staff/login') return staffLogin(req, res, body);
  if (req.method === 'POST' && pathname === '/api/staff/logout') return staffLogout(req, res);
  if (req.method === 'GET' && pathname === '/api/staff/me') return currentStaff(req, res);
  if (req.method === 'POST' && pathname === '/api/admin/faculty') return registerFaculty(req, res, body);
  if (req.method === 'GET' && pathname === '/api/admin/faculty') return faculty(req, res);
  if (req.method === 'GET' && pathname === '/api/staff/students') return students(req, res);
  return false;
}

module.exports = { handleStaffRoutes };
