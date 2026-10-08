const { syncStudentRecordsHandler } = require('../controllers/syncController');

async function handleSyncRoutes(req, res, pathname, body) {
  if (req.method === 'POST' && pathname === '/api/sync/student-records') {
    return syncStudentRecordsHandler(req, res, body);
  }

  return false;
}

module.exports = {
  handleSyncRoutes,
};
