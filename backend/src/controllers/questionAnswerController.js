const {
  createQuestionAnswer,
  createQuestionAnswersBatch,
  getAnswerById,
  listQuestionAnswer,
  listQuestionAnswersByUser,
  updateQuestionAnswer,
} = require('../models/questionAnswerModel');

function parseAnswerId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listQuestionAnswerHandler(res) {
  const answerInfo = await listQuestionAnswer();
  return sendJson(res, 200, { data: answerInfo });
}

async function listQuestionAnswersByUserHandler(req, res, userId) {
  const parsedUserId = parseUserId(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  try {
    const answers = await listQuestionAnswersByUser(parsedUserId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load question answers.',
    });
  }
}

async function createQuestionAnswerHandler(req, res, body) {
  try {
    const record = await createQuestionAnswer(body);
    return sendJson(res, 201, {
      message: 'Question Answer created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit question answer.',
    });
  }
}

async function createQuestionAnswersBatchHandler(req, res, body) {
  try {
    const records = await createQuestionAnswersBatch(body);
    return sendJson(res, 201, {
      message: 'Question answers submitted successfully.',
      data: records,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit question answers.',
    });
  }
}

async function getQuestionAnswerByIdHandler(res, answerId) {
  const parsedId = parseAnswerId(answerId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid answer_id.' });
  }

  const answerInfo = await getAnswerById(parsedId);
  if (!answerInfo) {
    return sendJson(res, 404, { message: 'Question answer not found.' });
  }

  return sendJson(res, 200, { data: answerInfo });
}

async function updateQuestionAnswerHandler(res, answerId, body) {
  const parsedId = parseAnswerId(answerId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid answer_id.' });
  }

  try {
    const answerInfo = await updateQuestionAnswer(parsedId, body);
    if (!answerInfo) {
      return sendJson(res, 404, { message: 'Question answer not found.' });
    }

    return sendJson(res, 200, { data: answerInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update question answer.',
    });
  }
}

module.exports = {
  listQuestionAnswerHandler,
  listQuestionAnswersByUserHandler,
  createQuestionAnswerHandler,
  createQuestionAnswersBatchHandler,
  getQuestionAnswerByIdHandler,
  updateQuestionAnswerHandler,
};
