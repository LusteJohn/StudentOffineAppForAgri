const {
    createQuestion,
    getQuestionById,
    listQuestion,
    updateQuestion,
} = require('../models/contentQuestionModel');
const { sendJson } = require('./authController');

function parseQuestionId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listQuestionHandler(res) {
    const contentInfo = await listQuestion();
    return sendJson(res, 200, { data: contentInfo });
}

async function createQuestionHandler(res, body) {
    try {
        const record = await createQuestion(body);
        return sendJson(res, 201, {
            message: 'Question created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create content information.',
        });
    }
}

async function getQuestionByIdHandler(res, questionId) {
    const parsedId = parseQuestionId(questionId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid question_id.' });
    }

    const questionInfo = await getQuestionById(parsedId);
    if (!questionInfo) {
        return sendJson(res, 404, { message: 'Question not found.' });
    }

    return sendJson(res, 200, { data: questionInfo });
}

async function updateQuestionHandler(res, questionId, body) {
    const parsedId = parseQuestionId(questionId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid question_id.' });
    }

    try {
        const questionInfo = await updateQuestion(parsedId, body);
        if (!questionInfo) {
            return sendJson(res, 404, { message: 'Question not found.' });
        }

        return sendJson(res, 200, { data: questionInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update content info.',
        });
    }
}

module.exports = {
    listQuestionHandler,
    createQuestionHandler,
    updateQuestionHandler,
    getQuestionByIdHandler,
}
