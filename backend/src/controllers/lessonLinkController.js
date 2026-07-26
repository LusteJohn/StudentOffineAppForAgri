const {
    createLessonLink,
    getLessonLinkById,
    listLessonLink,
    updateLessonLink,
} = require('../models/lessonLinkModel');
const { sendJson } = require('./authController');

function parseLessonLinkId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listLessonLessonHandler(res) {
    const lessonLink = await listLessonLink();
    return sendJson(res, 200, { data: lessonLink });
}

async function createLessonLinkHandler(res, body) {
    try {
        const record = await createLessonLink(body);
        return sendJson(res, 201, {
            message: 'Lesson Link created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create lesson link.',
        });
    }
}

async function getLessonLinkByIdHandler(res, lessonLinkId) {
    const parsedId = parseLessonLinkId(lessonLinkId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_link_id.' });
    }

    const lessonLink = await getLessonLinkById(parsedId);
    if (!lessonLink) {
        return sendJson(res, 404, { message: 'Lesson Link not found.' });
    }

    return sendJson(res, 200, { data: lessonLink });
}

async function updateLessonLinkHandler(res, lessonLinkId, body) {
    const parsedId = parseLessonLinkId(lessonLinkId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid lesson_link_id.' });
    }

    try {
        const lessonLink = await updateLessonLink(parsedId, body);
        if (!lessonLink) {
            return sendJson(res, 404, { message: 'Lesson Content not found.' });
        }

        return sendJson(res, 200, { data: lessonLink });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update lesson content.',
        });
    }
}

module.exports = {
    listLessonLessonHandler,
    createLessonLinkHandler,
    getLessonLinkByIdHandler,
    updateLessonLinkHandler,
};