const {
    createLessonContentProgress,
    listLessonContentProgress,
    listLessonContentProgressByUser,
    listLessonContentProgressByLessonContent,
    listLessonContentProgressByUserAndLessonContent,
    getLessonContentProgressById,
    updateLessonContentProgress,
} = require('../models/progressStudentLessonContentModel');

function progressLessonId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parsedProgressLessonId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listProgressLessonHandler(res) {
  const progressLessonInfo = await listLessonContentProgress();
  return sendJson(res, 200, { data: progressLessonInfo });
}

async function listProgressLessonByUserHandler(req, res, userId) {
  const parsedUserId = parseUserId(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  try {
    const progressLessonInfo = await listLessonContentProgressByUser(parsedUserId);
    return sendJson(res, 200, { data: progressLessonInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load lesson content progress.',
    });
  }
}

async function listProgressLessonByLessonContentHandler(req, res, progresslessonId) {
  const parsed = parsedProgressLessonId(progresslessonId);
  if (!parsed) {
    return sendJson(res, 400, { message: 'Invalid progress_lesson_id.' });
  }

  try {
    const progressLessonInfo = await listLessonContentProgressByLessonContent(parsed);
    return sendJson(res, 200, { data: progressLessonInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load lesson content progress.',
    });
  }
}

async function listProgressLessonByUserAndLessonContentHandler(req, res, userId, lessonContentId) {
  const parsedUserId = parseUserId(userId);
  const parsedLessonContentId = parsedProgressLessonId(lessonContentId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }
  if (!parsedLessonContentId) {
    return sendJson(res, 400, { message: 'Invalid lesson_content_id.' });
  }

  try {
    const progressLessonInfo = await listLessonContentProgressByUserAndLessonContent(parsedUserId, parsedLessonContentId);
    return sendJson(res, 200, { data: progressLessonInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load lesson content progress.',
    });
  }
}

async function createProgressLessonHandler(req, res, body) {
  try {
    const record = await createLessonContentProgress(body);
    return sendJson(res, 201, {
      message: 'lesson content progress created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit lesson content progress.',
    });
  }
}

async function getProgressLessonByIdHandler(res, progresslessonId) {
  const parsedId = parsedProgressLessonId(progresslessonId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid progress_lesson_id.' });
  }

  const progressLessonInfo = await getLessonContentProgressById(parsedId);
  if (!progressLessonInfo) {
    return sendJson(res, 404, { message: 'Lesson Content progress not found.' });
  }

  return sendJson(res, 200, { data: progressLessonInfo });
}

async function updateProgressLessonHandler(res, progresslessonId, body) {
  const parsedId = parsedProgressLessonId(progresslessonId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid progress_lesson_id.' });
  }

  try {
    const progressLessonInfo = await updateLessonContentProgress(parsedId, body);
    if (!progressLessonInfo) {
      return sendJson(res, 404, { message: 'Lesson Content progress not found.' });
    }

    return sendJson(res, 200, { data: progressLessonInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update Lesson Content progress.',
    });
  }
}

module.exports = {
    listProgressLessonHandler,
    listProgressLessonByUserHandler,
    listProgressLessonByLessonContentHandler,
    listProgressLessonByUserAndLessonContentHandler,
    createProgressLessonHandler,
    getProgressLessonByIdHandler,
    updateProgressLessonHandler,
};