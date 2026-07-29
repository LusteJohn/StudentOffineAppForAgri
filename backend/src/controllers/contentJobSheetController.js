const {
    createJobInstruct,
    listJobInstruct,
    getJobInstructById,
    updateJobInstruct,
} = require('../models/contentJobSheetModel');
const { sendJson } = require('./authController');

function parseJobId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listJobInstructHandler(res) {
    const jobInfo = await listJobInstruct();
    return sendJson(res, 200, { data: jobInfo });
}

async function createJobInstructHandler(res, body) {
    try {
        const record = await createJobInstruct(body);
        return sendJson(res, 201, {
            message: 'Job Instruction created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create job instruction.',
        });
    }
}

async function getJobInstructByIdHandler(res, instructId) {
    const parsedId = parseJobId(instructId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid job_id.' });
    }

    const jobInfo = await getJobInstructById(parsedId);
    if (!jobInfo) {
        return sendJson(res, 404, { message: 'Job Instruction not found.' });
    }

    return sendJson(res, 200, { data: jobInfo });
}

async function updateJobInstructHandler(res, jobId, body) {
    const parsedId = parseJobId(jobId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid job_id.' });
    }

    try {
        const jobInfo = await updateJobInstruct(parsedId, body);
        if (!jobInfo) {
            return sendJson(res, 404, { message: 'Job Instruction not found.' });
        }

        return sendJson(res, 200, { data: jobInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update job instruction.',
        });
    }
}

module.exports = {
    listJobInstructHandler,
    createJobInstructHandler,
    updateJobInstructHandler,
    getJobInstructByIdHandler,
}
