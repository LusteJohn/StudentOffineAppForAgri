const { syncStudentRecords } = require('../services/studentSyncService');
const { sendJson } = require('./authController');

async function syncStudentRecordsHandler(req, res, body) {
  try {
    const userId = Number(body?.user_id);
    const result = await syncStudentRecords(userId, body?.records);
    return sendJson(res, 200, {
      message: 'Student records synchronized successfully.',
      ...result,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to synchronize student records.',
    });
  }
}

module.exports = {
  syncStudentRecordsHandler,
};
