const {
  listPerformanceAnswerHandler,
  listPerformanceAnswersByUserHandler,
  listPerformanceAnswersByPerformanceHandler,
  listPerformanceAnswersByUserAndPerformanceHandler,
  createPerformanceAnswerHandler,
  getPerformanceAnswerByIdHandler,
  updatePerformanceAnswerHandler,
} = require('../controllers/performanceAnswerController');

async function handlePerformanceAnswerRoutes(req, res, pathname, body) {
  if (req.method === 'GET' && pathname === '/api/performance-answers') {
    return listPerformanceAnswerHandler(res);
  }

  if (req.method === 'POST' && pathname === '/api/performance-answers') {
    return createPerformanceAnswerHandler(req, res, body);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/performance-answers/by-user/')) {
    const userId = pathname.split('/').pop();
    return listPerformanceAnswersByUserHandler(req, res, userId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/performance-answers/by-performance/')) {
    const performanceId = pathname.split('/').pop();
    return listPerformanceAnswersByPerformanceHandler(req, res, performanceId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/performance-answers/by-user/') && pathname.includes('/by-performance/')) {
    const parts = pathname.split('/').filter(Boolean);
    const byUserIndex = parts.indexOf('by-user');
    const byPerformanceIndex = parts.indexOf('by-performance');
    if (byUserIndex !== -1 && byPerformanceIndex !== -1 && byPerformanceIndex > byUserIndex) {
      const userId = parts[byUserIndex + 1];
      const performanceId = parts[byPerformanceIndex + 1];
      return listPerformanceAnswersByUserAndPerformanceHandler(req, res, userId, performanceId);
    }
  }

  if (pathname.startsWith('/api/performance-answers/')) {
    const answerId = pathname.split('/').pop();

    if (req.method === 'GET') {
      return getPerformanceAnswerByIdHandler(res, answerId);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      return updatePerformanceAnswerHandler(res, answerId, body);
    }
  }

  return false;
}

module.exports = {
  handlePerformanceAnswerRoutes,
};