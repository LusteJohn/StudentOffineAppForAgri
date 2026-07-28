const {
    createQuestionInstruct,
    listQuestionInstruct,
    getQuestionInstructById,
    updateQuestionInstruct,
} = require('../models/questionInstructionModel');
const { sendJson } = require('./authController');

function parseQuestionId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listQuestionInstructHandler(res) {
    const instructInfo = await listQuestionInstruct();
    return sendJson(res, 200, { data: instructInfo });
}

async function createQuestionInstructHandler(res, body) {
    try {
        const record = await createQuestion(body);
        return sendJson(res, 201, {
            message: 'Question created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create question instruction.',
        });
    }
}

async function getQuestionInstructByIdHandler(res, instructId) {
    const parsedId = parseQuestionId(instructId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid instruct_id.' });
    }

    const instructInfo = await getQuestionInstructById(parsedId);
    if (!instructInfo) {
        return sendJson(res, 404, { message: 'Question Instruction not found.' });
    }

    return sendJson(res, 200, { data: instructInfo });
}

async function updateQuestionInstructHandler(res, instructId, body) {
    const parsedId = parseQuestionId(instructId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid instruct_id.' });
    }

    try {
        const instructInfo = await updateQuestionInstruct(parsedId, body);
        if (!instructInfo) {
            return sendJson(res, 404, { message: 'Question Instruction not found.' });
        }

        return sendJson(res, 200, { data: instructInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update question instruction.',
        });
    }
}

module.exports = {
    listQuestionInstructHandler,
    createQuestionInstructHandler,
    updateQuestionInstructHandler,
    getQuestionInstructByIdHandler,
}
