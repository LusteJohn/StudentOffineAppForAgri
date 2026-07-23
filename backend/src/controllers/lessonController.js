const {
    createLesson,
    getLessonById,
    getModuleById,
    listLessons,
    updateLesson,
} = require('../models/lessonModel');
const { sendJson } = require('./authController');

function parseLessonId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listLessonsHandler(res) {
    const lessons = await listLessons();
    return sendJson(res, 200, { data: lessons });
}

async function createLessonHandler(res, body) {
    try {
        const record = await createLesson(body);
        return sendJson(res, 201, {
            message: 'Lesson created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create lesson.',
        });
    }
}

async function getLessonByIdHandler(res, lessonId) {
    const parsedId = parseLessonId(lessonId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_id.' });
    }

    const lesson = await getLessonById(parsedId);
    if (!lesson) {
        return sendJson(res, 404, { message: 'Lesson not found.' });
    }

    return sendJson(res, 200, { data: lesson });
}

async function updateLessonHandler(res, lessonId, body) {
    const parsedId = parseLessonId(lessonId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_id.' });
    }

    try {
        const lesson = await updateLesson(parsedId, body);
        if (!lesson) {
            return sendJson(res, 404, { message: 'Lesson not found.' });
        }

        return sendJson(res, 200, { data: lesson });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update lesson.',
        });
    }
}

module.exports = {
    listLessonsHandler,
    createLessonHandler,
    getLessonByIdHandler,
    updateLessonHandler,
};