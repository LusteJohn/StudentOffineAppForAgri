const {
    createCompetency,
    deleteCompetency,
    getCompetencyById,
    listCompetencies,
    updateCompetency,
} = require('../models/competencyModel');
const { sendJson } = require('./authController');

function parseCompetencyId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listCompetenciesHandler(res) {
    const competencies = await listCompetencies();
    return sendJson(res, 200, { data: competencies });
}

async function createCompetencyHandler(res, body) {
    try {
        const record = await createCompetency(body);
        return sendJson(res, 201, {
            message: 'Competency created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create competency.',
        });
    }
}

async function getCompetencyByIdHandler(res, competencyId) {
    const parsedId = parseCompetencyId(competencyId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid competency_id.' });
    }

    const competency = await getCompetencyById(parsedId);
    if (!competency) {
        return sendJson(res, 404, { message: 'Competency not found.' });
    }

    return sendJson(res, 200, { data: competency });
}

async function updateCompetencyHandler(res, competencyId, body) {
    const parsedId = parseCompetencyId(competencyId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid competency_id.' });
    }

    try {
        const competency = await updateCompetency(parsedId, body);
        if (!competency) {
            return sendJson(res, 404, { message: 'Competency not found.' });
        }

        return sendJson(res, 200, {
            message: 'Competency updated successfully.',
            data: competency,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update competency.',
        });
    }
}

async function deleteCompetencyHandler(res, competencyId) {
    const parsedId = parseCompetencyId(competencyId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid competency_id.' });
    }

    const deleted = await deleteCompetency(parsedId);
    if (!deleted) {
        return sendJson(res, 404, { message: 'Competency not found.' });
    }

    return sendJson(res, 200, { message: 'Competency deleted successfully.' });
}

module.exports = {
    listCompetenciesHandler,
    createCompetencyHandler,
    getCompetencyByIdHandler,
    updateCompetencyHandler,
    deleteCompetencyHandler,
};
