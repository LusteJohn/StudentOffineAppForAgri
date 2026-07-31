const {
    createPerformance,
    listPerformance,
    getPerformanceById,
    updatePerformance,
} = require('../models/performanceCheckModel');
const { sendJson } = require('./authController');

function parseJobId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listPerformanceHandler(res) {
    const jobInfo = await listPerformance();
    return sendJson(res, 200, { data: jobInfo });
}

async function createPerformanceHandler(res, body) {
    try {
        const record = await createPerformance(body);
        return sendJson(res, 201, {
            message: 'Performance checklist created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create performance checklist.',
        });
    }
}

async function getPerformanceByIdHandler(res, performanceId) {
    const parsedId = parseJobId(performanceId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid performance_id.' });
    }

    const performanceInfo = await getPerformanceById(parsedId);
    if (!performanceInfo) {
        return sendJson(res, 404, { message: 'Performance checklist not found.' });
    }

    return sendJson(res, 200, { data: performanceInfo });
}

async function updatePerformanceHandler(res, performanceId, body) {
    const parsedId = parseJobId(performanceId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid performance_id.' });
    }

    try {
        const performanceInfo = await updatePerformance(parsedId, body);
        if (!performanceInfo) {
            return sendJson(res, 404, { message: 'Performance checklist not found.' });
        }

        return sendJson(res, 200, { data: performanceInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update performance checklist.',
        });
    }
}

module.exports = {
    listPerformanceHandler,
    createPerformanceHandler,
    updatePerformanceHandler,
    getPerformanceByIdHandler,
}
