const {
  createStudentInfo,
  deleteStudentInfo,
  getStudentInfoById,
  getStudentInfoByUserId,
  listStudentInfo,
  updateStudentInfo,
} = require('../models/studentInfoModel');
const { sendJson } = require('./authController');

function parsePositiveInt(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

async function createStudentInfoHandler(res, body) {
  try {
    const record = await createStudentInfo(body);
    return sendJson(res, 201, {
      message: 'Student profile created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to create student profile.',
    });
  }
}

async function getStudentInfoByIdHandler(res, studentId) {
  const parsedId = parsePositiveInt(studentId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid student_id.' });
  }

  const record = await getStudentInfoById(parsedId);
  if (!record) {
    return sendJson(res, 404, { message: 'Student profile not found.' });
  }

  return sendJson(res, 200, { data: record });
}

async function getStudentInfoByUserIdHandler(res, userId) {
  const parsedId = parsePositiveInt(userId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  const record = await getStudentInfoByUserId(parsedId);
  if (!record) {
    return sendJson(res, 404, { message: 'Student profile not found for this user_id.' });
  }

  return sendJson(res, 200, { data: record });
}

async function listStudentInfoHandler(res) {
  const records = await listStudentInfo();
  return sendJson(res, 200, { data: records });
}

async function updateStudentInfoHandler(res, studentId, body) {
  const parsedId = parsePositiveInt(studentId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid student_id.' });
  }

  try {
    const record = await updateStudentInfo(parsedId, body);
    if (!record) {
      return sendJson(res, 404, { message: 'Student profile not found.' });
    }

    return sendJson(res, 200, {
      message: 'Student profile updated successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update student profile.',
    });
  }
}

async function deleteStudentInfoHandler(res, studentId) {
  const parsedId = parsePositiveInt(studentId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid student_id.' });
  }

  const deleted = await deleteStudentInfo(parsedId);
  if (!deleted) {
    return sendJson(res, 404, { message: 'Student profile not found.' });
  }

  return sendJson(res, 200, { message: 'Student profile deleted successfully.' });
}

module.exports = {
  createStudentInfoHandler,
  getStudentInfoByIdHandler,
  getStudentInfoByUserIdHandler,
  listStudentInfoHandler,
  updateStudentInfoHandler,
  deleteStudentInfoHandler,
};
