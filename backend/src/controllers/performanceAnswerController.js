const {
    createPerformanceAnswer,
    listPerformanceAnswer,
    listPerformanceAnswersByUser,
    listPerformanceAnswersByPerformance,
    listPerformanceAnswersByUserAndPerformance,
    getPerformanceAnswerById,
    updatePerformanceAnswer,
} = require('../models/performanceAnswerModel');

function performanceAnswerId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parsedPerformanceId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listPerformanceAnswerHandler(res) {
  const performanceAnswerInfo = await listPerformanceAnswer();
  return sendJson(res, 200, { data: performanceAnswerInfo });
}

async function listPerformanceAnswersByUserHandler(req, res, userId) {
  const parsedUserId = parseUserId(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  try {
    const answers = await listPerformanceAnswersByUser(parsedUserId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load performance answers.',
    });
  }
}

async function listPerformanceAnswersByPerformanceHandler(req, res, performanceId) {
  const parsed = parsedPerformanceId(performanceId);
  if (!parsed) {
    return sendJson(res, 400, { message: 'Invalid performance_id.' });
  }

  try {
    const answers = await listPerformanceAnswersByPerformance(parsed);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load performance answers.',
    });
  }
}

async function listPerformanceAnswersByUserAndPerformanceHandler(req, res, userId, performanceId) {
  const parsedUserId = parseUserId(userId);
  const parsedPerformanceId = parsedPerformanceId(performanceId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }
  if (!parsedPerformanceId) {
    return sendJson(res, 400, { message: 'Invalid performance_id.' });
  }

  try {
    const answers = await listPerformanceAnswersByUserAndPerformance(parsedUserId, parsedPerformanceId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load performance answers.',
    });
  }
}

async function createPerformanceAnswerHandler(req, res, body) {
  try {
    const record = await createPerformanceAnswer(body);
    return sendJson(res, 201, {
      message: 'performance answer created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit performance answer.',
    });
  }
}

async function getPerformanceAnswerByIdHandler(res, performanceId) {
  const parsedId = parsedPerformanceId(performanceId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid performance_answer_id.' });
  }

  const performanceAnswerInfo = await getPerformanceAnswerById(parsedId);
  if (!performanceAnswerInfo) {
    return sendJson(res, 404, { message: 'Performance answer not found.' });
  }

  return sendJson(res, 200, { data: performanceAnswerInfo });
}

async function updatePerformanceAnswerHandler(res, performanceId, body) {
  const parsedId = parsedPerformanceId(performanceId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid performance_answer_id.' });
  }

  try {
    const performanceAnswerInfo = await updatePerformanceAnswer(parsedId, body);
    if (!performanceAnswerInfo) {
      return sendJson(res, 404, { message: 'Performance answer not found.' });
    }

    return sendJson(res, 200, { data: performanceAnswerInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update performance answer.',
    });
  }
}

module.exports = {
    listPerformanceAnswerHandler,
    listPerformanceAnswersByUserHandler,
    listPerformanceAnswersByPerformanceHandler,
    listPerformanceAnswersByUserAndPerformanceHandler,
    createPerformanceAnswerHandler,
    getPerformanceAnswerByIdHandler,
    updatePerformanceAnswerHandler,
};