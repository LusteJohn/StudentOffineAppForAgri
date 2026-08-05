const {
    createLessonAchievement,
    getLessonAchievementById,
    listLessonAchievement,
    updateLessonAchievement,
} = require('../models/studentLessonAchievementModel');
const { sendJson } = require('./authController');

function parseLessonAchievementId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listLessonAchievementHandler(res) {
    const lessonAchievementInfo = await listLessonAchievement();
    return sendJson(res, 200, { data: lessonAchievementInfo });
}

async function createLessonAchievementHandler(res, body) {
    try {
        const record = await createLessonAchievement(body);
        return sendJson(res, 201, {
            message: 'Lesson Achievement created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create lesson achievement.',
        });
    }
}

async function getLessonAchievementByIdHandler(res, lessonAchievementId) {
    const parsedId = parseLessonAchievementId(lessonAchievementId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_achievement_id.' });
    }

    const lessonAchievementInfo = await getLessonAchievementById(parsedId);
    if (!lessonAchievementInfo) {
        return sendJson(res, 404, { message: 'Lesson Achievement not found.' });
    }

    return sendJson(res, 200, { data: lessonAchievementInfo });
}

async function updateLessonAchievementHandler(res, lessonAchievementId, body) {
    const parsedId = parseLessonAchievementId(lessonAchievementId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_achievement_id.' });
    }

    try {
        const lessonAchievementInfo = await updateLessonAchievement(parsedId, body);
        if (!lessonAchievementInfo) {
            return sendJson(res, 404, { message: 'Lesson Achievement not found.' });
        }

        return sendJson(res, 200, { data: lessonAchievementInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update lesson achievement.',
        });
    }
}

module.exports = {
    listLessonAchievementHandler,
    createLessonAchievementHandler,
    getLessonAchievementByIdHandler,
    updateLessonAchievementHandler,
};