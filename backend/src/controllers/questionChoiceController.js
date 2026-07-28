const {
    createQuestionChoice,
    getQuestionById,
    listQuestionChoice,
    updateQuestionChoice,
} = require('../models/questionChoiceModel');
const { sendJson } = require('./authController');

function parseQuestionChoiceId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listQuestionChoiceHandler(res) {
    const choiceInfo = await listQuestionChoice();
    return sendJson(res, 200, { data: contentInfo });
}

async function createQuestionChoiceHandler(res, body) {
    try {
        const record = await createQuestionChoice(body);
        return sendJson(res, 201, {
            message: 'Question Choice created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create question choice information.',
        });
    }
}

async function getQuestionChoiceByIdHandler(res, choiceId) {
    const parsedId = parseQuestionChoiceId(choiceId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid choice_id.' });
    }

    const choiceInfo = await getQuestionById(parsedId);
    if (!choiceInfo) {
        return sendJson(res, 404, { message: 'Question choice not found.' });
    }

    return sendJson(res, 200, { data: choiceInfo });
}

async function updateQuestionChoiceHandler(res, choiceId, body) {
    const parsedId = parseQuestionChoiceId(choiceId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid choice_id.' });
    }

    try {
        const choiceInfo = await updateQuestionChoice(parsedId, body);
        if (!choiceInfo) {
            return sendJson(res, 404, { message: 'Question choice not found.' });
        }

        return sendJson(res, 200, { data: choiceInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update question choice.',
        });
    }
}

module.exports = {
    listQuestionChoiceHandler,
    createQuestionChoiceHandler,
    getQuestionChoiceByIdHandler,
    updateQuestionChoiceHandler,
}
