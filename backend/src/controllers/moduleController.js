const {
    createModule,
    getModuleById,
    listModules,
    updateModule,
} = require('../models/moduleModel');
const { sendJson } = require('./authController');

function parseModuleId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listModulesHandler(res) {
    const modules = await listModules();
    return sendJson(res, 200, { data: modules });
}

async function createModuleHandler(res, body) {
    try {
        const record = await createModule(body);
        return sendJson(res, 201, {
            message: 'Module created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create module.',
        });
    }
}

async function getModuleByIdHandler(res, moduleId) {
    const parsedId = parseModuleId(moduleId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid module_id.' });
    }

    const module = await getModuleById(parsedId);
    if (!module) {
        return sendJson(res, 404, { message: 'Module not found.' });
    }

    return sendJson(res, 200, { data: module });
}

async function updateModuleHandler(res, moduleId, body) {
    const parsedId = parseModuleId(moduleId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid module_id.' });
    }

    try {
        const module = await updateModule(parsedId, body);
        if (!module) {
            return sendJson(res, 404, { message: 'Module not found.' });
        }

        return sendJson(res, 200, { data: module });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update module.',
        });
    }
}

module.exports = {
    listModulesHandler,
    createModuleHandler,
    getModuleByIdHandler,
    updateModuleHandler,
};
