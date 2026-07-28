const {
    createQuestionAnswer,
    getQuestionById,
    listQuestionAnswer,
    updateQuestionAnswer,
} = require('../models/questionAnswerModel');
const { sendJson } = require('./authController');

function parseQuestionAnswerId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listQuestionAnswerHandler(res) {
    const answerInfo = await listQuestionChoice();
    return sendJson(res, 200, { data: contentInfo });
}

async function createQuestionAnswerHandler(res, body) {
    try {
        const record = await createQuestionAnswer(body);
        return sendJson(res, 201, {
            message: 'Question Answer created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to submit question answer.',
        });
    }
}

async function getQuestionAnswerByIdHandler(res, answerId) {
    const parsedId = parseQuestionAnswereId(answerId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid answer_id.' });
    }

    const answerInfo = await getQuestionById(parsedId);
    if (!answerInfo) {
        return sendJson(res, 404, { message: 'Question answer not found.' });
    }

    return sendJson(res, 200, { data: answerInfo });
}

async function updateQuestionAnswerHandler(res, answerId, body) {
    const parsedId = parseQuestionAnswerId(answerId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid answer_id.' });
    }

    try {
        const answerInfo = await updateQuestionAnswer(parsedId, body);
        if (!answerInfo) {
            return sendJson(res, 404, { message: 'Question answer not found.' });
        }

        return sendJson(res, 200, { data: answerInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update question answer.',
        });
    }
}

module.exports = {
    listQuestionAnswerHandler,
    createQuestionAnswerHandler,
    getQuestionAnswerByIdHandler,
    updateQuestionAnswerHandler,
}
