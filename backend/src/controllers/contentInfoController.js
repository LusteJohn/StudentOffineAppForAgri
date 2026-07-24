const {
    createContentInfo,
    getContentInfoById,
    getLessonContentById,
    listContentInfo,
    updateContentInfo,
} = require('../models/contentIntroductionModel');
const { sendJson } = require('./authController');

function parseContentInfoId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listContentInfoHandler(res) {
    const contentInfo = await listContentInfo();
    return sendJson(res, 200, { data: contentInfo });
}

async function createContentInfoHandler(res, body) {
    try {
        const record = await createContentInfo(body);
        return sendJson(res, 201, {
            message: 'Content Info created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create content information.',
        });
    }
}

async function getContentInfoByIdHandler(res, contenInfotId) {
    const parsedId = parseContentInfoId(contenInfotId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid content_info_id.' });
    }

    const contentInfo = await getContentInfoById(parsedId);
    if (!contentInfo) {
        return sendJson(res, 404, { message: 'Content Info not found.' });
    }

    return sendJson(res, 200, { data: contentInfo });
}

async function updateContentInfoHandler(res, contenInfotId, body) {
    const parsedId = parseContentInfoId(contenInfotId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid content_info_id.' });
    }

    try {
        const contentInfo = await updateContentInfo(parsedId, body);
        if (!contentInfo) {
            return sendJson(res, 404, { message: 'Lesson Content not found.' });
        }

        return sendJson(res, 200, { data: contentInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update content info.',
        });
    }
}

module.exports = {
    listContentInfoHandler,
    createContentInfoHandler,
    updateContentInfoHandler,
    getContentInfoByIdHandler
};