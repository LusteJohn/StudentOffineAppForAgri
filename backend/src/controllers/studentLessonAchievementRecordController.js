const {
    createStudentLessonAchievement,
    listStudentLessonAchievement,
    listStudentLessonAchievementByUser,
    listStudentLessonAchievementByLessonAchievement,
    listStudentLessonAchievementByUserAndLessonAchievement,
    getStudentLessonAchievementById,
    updateStudentLessonAchievement,
} = require('../models/studentLessonAchievementRecordModel');

function studentLessonAchievementId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parsedLessonAchievementId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listStudentLessonAchievementHandler(res) {
  const studentLessonAchievementInfo = await listStudentLessonAchievement();
  return sendJson(res, 200, { data: studentLessonAchievementInfo });
}

async function listStudentLessonAchievementByUserHandler(req, res, userId) {
  const parsedUserId = parseUserId(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  try {
    const studentLessonAchievementInfo = await listStudentLessonAchievementByUser(parsedUserId);
    return sendJson(res, 200, { data: studentLessonAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load student lesson achievement.',
    });
  }
}

async function listStudentLessonAchievementByLessonAchievementHandler(req, res, lessonAchievementId) {
  const parsed = parsedLessonAchievementId(lessonAchievementId);
  if (!parsed) {
    return sendJson(res, 400, { message: 'Invalid lesson_achievement_id.' });
  }

  try {
    const studentLessonAchievementInfo = await listStudentLessonAchievementByLessonAchievement(parsed);
    return sendJson(res, 200, { data: studentLessonAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load student lesson achievement.',
    });
  }
}

async function listStudentLessonAchievementByUserAndLessonAchievementHandler(req, res, userId, lessonAchievementId) {
  const parsedUserId = parseUserId(userId);
  const parsedLessonAchievementId = parsedLessonAchievementId(lessonAchievementId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }
  if (!parsedLessonAchievementId) {
    return sendJson(res, 400, { message: 'Invalid lesson_achievement_id.' });
  }

  try {
    const studentLessonAchievementInfo = await listStudentLessonAchievementByUserAndLessonAchievement(parsedUserId, parsedLessonAchievementId);
    return sendJson(res, 200, { data: studentLessonAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load student lesson achievement.',
    });
  }
}

async function createStudentLessonAchievementHandler(req, res, body) {
  try {
    const record = await createStudentLessonAchievement(body);
    return sendJson(res, 201, {
      message: 'student lesson achievement created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit student lesson achievement.',
    });
  }
}

async function getStudentLessonAchievementByIdHandler(res, lessonAchievementId) {
  const parsedId = parsedLessonAchievementId(lessonAchievementId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid lesson_achievement_id.' });
  }

  const studentLessonAchievementInfo = await getStudentLessonAchievementById(parsedId);
  if (!studentLessonAchievementInfo) {
    return sendJson(res, 404, { message: 'Student Lesson Achievement not found.' });
  }

  return sendJson(res, 200, { data: studentLessonAchievementInfo });
}

async function updatePerformanceAnswerHandler(res, lessonAchievementId, body) {
  const parsedId = parsedLessonAchievementId(lessonAchievementId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid lesson_achievement_id.' });
  }

  try {
    const studentLessonAchievementInfo = await updatePerformanceAnswerHandler(parsedId, body);
    if (!studentLessonAchievementInfo) {
      return sendJson(res, 404, { message: 'Student Lesson Achievement not found.' });
    }

    return sendJson(res, 200, { data: studentLessonAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update student lesson achievement.',
    });
  }
}

module.exports = {
    listStudentLessonAchievementHandler,
    listStudentLessonAchievementByUserHandler,
    listStudentLessonAchievementByLessonAchievementHandler,
    listStudentLessonAchievementByUserAndLessonAchievementHandler,
    createStudentLessonAchievementHandler,
    getStudentLessonAchievementByIdHandler,
    updatePerformanceAnswerHandler,
};