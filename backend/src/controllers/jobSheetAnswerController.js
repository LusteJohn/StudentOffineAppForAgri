const {
  createJobSheetAnswer,
  getAnswerById,
  listJobSheetAnswer,
  listJobSheetAnswersByUser,
  listJobSheetAnswersByJob,
  listJobSheetAnswersByUserAndJob,
  updateJobSheetAnswer,
} = require('../models/jobSheetAnswerModel');

function parseAnswerId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseJobId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listJobSheetAnswerHandler(res) {
  const answerInfo = await listJobSheetAnswer();
  return sendJson(res, 200, { data: answerInfo });
}

async function listJobSheetAnswersByUserHandler(req, res, userId) {
  const parsedUserId = parseUserId(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  try {
    const answers = await listJobSheetAnswersByUser(parsedUserId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load job sheet answers.',
    });
  }
}

async function listJobSheetAnswersByJobHandler(req, res, jobId) {
  const parsedJobId = parseJobId(jobId);
  if (!parsedJobId) {
    return sendJson(res, 400, { message: 'Invalid job_id.' });
  }

  try {
    const answers = await listJobSheetAnswersByJob(parsedJobId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load job sheet answers.',
    });
  }
}

async function listJobSheetAnswersByUserAndJobHandler(req, res, userId, jobId) {
  const parsedUserId = parseUserId(userId);
  const parsedJobId = parseJobId(jobId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }
  if (!parsedJobId) {
    return sendJson(res, 400, { message: 'Invalid job_id.' });
  }

  try {
    const answers = await listJobSheetAnswersByUserAndJob(parsedUserId, parsedJobId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load job sheet answers.',
    });
  }
}

async function createJobSheetAnswerHandler(req, res, body) {
  try {
    const record = await createJobSheetAnswer(body);
    return sendJson(res, 201, {
      message: 'Job sheet answer created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit job sheet answer.',
    });
  }
}

async function getJobSheetAnswerByIdHandler(res, answerId) {
  const parsedId = parseAnswerId(answerId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid answer_id.' });
  }

  const answerInfo = await getAnswerById(parsedId);
  if (!answerInfo) {
    return sendJson(res, 404, { message: 'Job sheet answer not found.' });
  }

  return sendJson(res, 200, { data: answerInfo });
}

async function updateJobSheetAnswerHandler(res, answerId, body) {
  const parsedId = parseAnswerId(answerId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid answer_id.' });
  }

  try {
    const answerInfo = await updateJobSheetAnswer(parsedId, body);
    if (!answerInfo) {
      return sendJson(res, 404, { message: 'Job sheet answer not found.' });
    }

    return sendJson(res, 200, { data: answerInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update job sheet answer.',
    });
  }
}

module.exports = {
  listJobSheetAnswerHandler,
  listJobSheetAnswersByUserHandler,
  listJobSheetAnswersByJobHandler,
  listJobSheetAnswersByUserAndJobHandler,
  createJobSheetAnswerHandler,
  getJobSheetAnswerByIdHandler,
  updateJobSheetAnswerHandler,
};
