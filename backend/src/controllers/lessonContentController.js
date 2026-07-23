const {
    createLessonContent,
    getLessonContentById,
    listLessonContent,
    updateLessonContent,
} = require('../models/lessonContentModel');
const { sendJson } = require('./authController');

function parseLessonContentId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listLessonContentHandler(res) {
    const lessonContent = await listLessonContent();
    return sendJson(res, 200, { data: lessonContent });
}

async function createLessonContentHandler(res, body) {
    try {
        const record = await createLessonContent(body);
        return sendJson(res, 201, {
            message: 'Lesson Content created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create lesson content.',
        });
    }
}

async function getLessonContentByIdHandler(res, lessonContentId) {
    const parsedId = parseLessonContentId(lessonContentId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_content_id.' });
    }

    const lessonContent = await getLessonContentById(parsedId);
    if (!lessonContent) {
        return sendJson(res, 404, { message: 'Lesson Content not found.' });
    }

    return sendJson(res, 200, { data: lessonContent });
}

async function updateLessonContentHandler(res, lessonContentId, body) {
    const parsedId = parseLessonContentId(lessonContentId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_content_id.' });
    }

    try {
        const lessonContent = await updateLessonContent(parsedId, body);
        if (!lessonContent) {
            return sendJson(res, 404, { message: 'Lesson Content not found.' });
        }

        return sendJson(res, 200, { data: lessonContent });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update lesson content.',
        });
    }
}

module.exports = {
    listLessonContentHandler,
    createLessonContentHandler,
    updateLessonContentHandler,
    getLessonContentByIdHandler,
};