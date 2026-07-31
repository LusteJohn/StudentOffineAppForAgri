const {
  listJobSheetAnswerHandler,
  listJobSheetAnswersByUserHandler,
  listJobSheetAnswersByJobHandler,
  listJobSheetAnswersByUserAndJobHandler,
  createJobSheetAnswerHandler,
  getJobSheetAnswerByIdHandler,
  updateJobSheetAnswerHandler,
} = require('../controllers/jobSheetAnswerController');

async function handleJobSheetAnswerRoutes(req, res, pathname, body) {
  if (req.method === 'GET' && pathname === '/api/job-sheet-answers') {
    return listJobSheetAnswerHandler(res);
  }

  if (req.method === 'POST' && pathname === '/api/job-sheet-answers') {
    return createJobSheetAnswerHandler(req, res, body);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/job-sheet-answers/by-user/')) {
    const userId = pathname.split('/').pop();
    return listJobSheetAnswersByUserHandler(req, res, userId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/job-sheet-answers/by-job/')) {
    const jobId = pathname.split('/').pop();
    return listJobSheetAnswersByJobHandler(req, res, jobId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/job-sheet-answers/by-user/') && pathname.includes('/by-job/')) {
    const parts = pathname.split('/').filter(Boolean);
    const byUserIndex = parts.indexOf('by-user');
    const byJobIndex = parts.indexOf('by-job');
    if (byUserIndex !== -1 && byJobIndex !== -1 && byJobIndex > byUserIndex) {
      const userId = parts[byUserIndex + 1];
      const jobId = parts[byJobIndex + 1];
      return listJobSheetAnswersByUserAndJobHandler(req, res, userId, jobId);
    }
  }

  if (pathname.startsWith('/api/job-sheet-answers/')) {
    const answerId = pathname.split('/').pop();

    if (req.method === 'GET') {
      return getJobSheetAnswerByIdHandler(res, answerId);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      return updateJobSheetAnswerHandler(res, answerId, body);
    }
  }

  return false;
}

module.exports = {
  handleJobSheetAnswerRoutes,
};
