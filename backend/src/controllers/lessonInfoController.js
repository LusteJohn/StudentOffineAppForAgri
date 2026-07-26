const {
    createLessonInfo,
    getLessonInfoById,
    listLessonInfo,
    updateLessonInfo,
} = require('../models/lessonInfoModel');
const { sendJson } = require('./authController');

function parseLessonInfoId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listLessonInfoHandler(res) {
    const lessonInfo = await listLessonInfo();
    return sendJson(res, 200, { data: lessonInfo });
}

async function createLessonInfoHandler(res, body) {
    try {
        const record = await createLessonInfo(body);
        return sendJson(res, 201, {
            message: 'Lesson Info created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create lesson info.',
        });
    }
}

async function getLessonInfoByIdHandler(res, lessonInfoId) {
    const parsedId = parseLessonInfoId(lessonInfoId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_info_id.' });
    }

    const lessonInfo = await getLessonContentById(parsedId);
    if (!lessonInfo) {
        return sendJson(res, 404, { message: 'Lesson Info not found.' });
    }

    return sendJson(res, 200, { data: lessonInfo });
}

async function updateLessonInfoHandler(res, lessonInfoId, body) {
    const parsedId = parseLessonInfoId(lessonInfoId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_info_id.' });
    }

    try {
        const lessonInfo = await updateLessonInfo(parsedId, body);
        if (!lessonInfo) {
            return sendJson(res, 404, { message: 'Lesson Info not found.' });
        }

        return sendJson(res, 200, { data: lessonInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update lesson info.',
        });
    }
}

module.exports ={
    listLessonInfoHandler,
    createLessonInfoHandler,
    updateLessonInfoHandler,
    getLessonInfoByIdHandler,
};