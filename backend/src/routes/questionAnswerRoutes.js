const {
  listQuestionAnswerHandler,
  listQuestionAnswersByUserHandler,
  createQuestionAnswerHandler,
  createQuestionAnswersBatchHandler,
  getQuestionAnswerByIdHandler,
  updateQuestionAnswerHandler,
} = require('../controllers/questionAnswerController');

async function handleQuestionAnswerRoutes(req, res, pathname, body) {
  if (req.method === 'GET' && pathname === '/api/question-answers') {
    return listQuestionAnswerHandler(res);
  }

  if (req.method === 'POST' && pathname === '/api/question-answers/batch') {
    return createQuestionAnswersBatchHandler(req, res, body);
  }

  if (req.method === 'POST' && pathname === '/api/question-answers') {
    return createQuestionAnswerHandler(req, res, body);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/question-answers/by-user/')) {
    const userId = pathname.split('/').pop();
    return listQuestionAnswersByUserHandler(req, res, userId);
  }

  if (pathname.startsWith('/api/question-answers/')) {
    const answerId = pathname.split('/').pop();

    if (req.method === 'GET') {
      return getQuestionAnswerByIdHandler(res, answerId);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      return updateQuestionAnswerHandler(res, answerId, body);
    }
  }

  return false;
}

module.exports = {
  handleQuestionAnswerRoutes,
};
