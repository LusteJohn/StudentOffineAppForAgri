const {
    createStudentModuleAchievement,
    listStudentModuleAchievement,
    listStudentModuleAchievementByUser,
    listStudentModuleAchievementByModuleAchievement,
    listStudentModuleAchievementByUserAndModuleAchievement,
    getStudentModuleAchievementById,
    updateStudentModuleAchievement,
} = require('../models/studentModuleAchievementRecordModel');

function studentModuleAchievementId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parsedModuleAchievementId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listStudentModuleAchievementHandler(res) {
  const studentModuleAchievementInfo = await listStudentModuleAchievement();
  return sendJson(res, 200, { data: studentModuleAchievementInfo });
}

async function listStudentModuleAchievementByUserHandler(req, res, userId) {
  const parsedUserId = parseUserId(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  try {
    const studentModuleAchievementInfo = await listStudentModuleAchievementByUser(parsedUserId);
    return sendJson(res, 200, { data: studentModuleAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load student module achievement.',
    });
  }
}

async function listStudentModuleAchievementByModuleAchievementHandler(req, res, moduleAchievementId) {
  const parsed = parsedModuleAchievementId(moduleAchievementId);
  if (!parsed) {
    return sendJson(res, 400, { message: 'Invalid module_achievement_id.' });
  }

  try {
    const studentModuleAchievementInfo = await listStudentModuleAchievementByModuleAchievement(parsed);
    return sendJson(res, 200, { data: studentModuleAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load student module achievement.',
    });
  }
}

async function listStudentModuleAchievementByUserAndModuleAchievementHandler(req, res, userId, moduleAchievementId) {
  const parsedUserId = parseUserId(userId);
  const parsedModuleAchievementId = parsedModuleAchievementId(moduleAchievementId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }
  if (!parsedModuleAchievementId) {
    return sendJson(res, 400, { message: 'Invalid module_achievement_id.' });
  }

  try {
    const studentModuleAchievementInfo = await listStudentModuleAchievementByUserAndModuleAchievement(parsedUserId, parsedModuleAchievementId);
    return sendJson(res, 200, { data: studentModuleAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load student module achievement.',
    });
  }
}

async function createStudentModuleAchievementHandler(req, res, body) {
  try {
    const record = await createStudentModuleAchievement(body);
    return sendJson(res, 201, {
      message: 'student module achievement created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit student module achievement.',
    });
  }
}

async function getStudentModuleAchievementByIdHandler(res, moduleAchievementId) {
  const parsedId = parsedModuleAchievementId(moduleAchievementId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid module_achievement_id.' });
  }

  const studentModuleAchievementInfo = await getStudentModuleAchievementById(parsedId);
  if (!studentModuleAchievementInfo) {
    return sendJson(res, 404, { message: 'Student Module Achievement not found.' });
  }

  return sendJson(res, 200, { data: studentModuleAchievementInfo });
}

async function updateStudentModuleAchievementHandler(res, moduleAchievementId, body) {
  const parsedId = parsedModuleAchievementId(moduleAchievementId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid module_achievement_id.' });
  }

  try {
    const studentModuleAchievementInfo = await updateStudentModuleAchievement(parsedId, body);
    if (!studentModuleAchievementInfo) {
      return sendJson(res, 404, { message: 'Student Module Achievement not found.' });
    }

    return sendJson(res, 200, { data: studentModuleAchievementInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update student module achievement.',
    });
  }
}

module.exports = {
    listStudentModuleAchievementHandler,
    listStudentModuleAchievementByUserHandler,
    listStudentModuleAchievementByModuleAchievementHandler,
    listStudentModuleAchievementByUserAndModuleAchievementHandler,
    createStudentModuleAchievementHandler,
    getStudentModuleAchievementByIdHandler,
    updateStudentModuleAchievementHandler,
};