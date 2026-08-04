const {
    createModuleAchievement,
    getModuleAchievementById,
    listModuleAchievement,
    updateModuleAchievement,
} = require('../models/studentModuleAchievementModel');
const { sendJson } = require('./authController');

function parseModuleAchievementId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listModuleAchievementHandler(res) {
    const moduleAchievementInfo = await listModuleAchievement();
    return sendJson(res, 200, { data: moduleAchievementInfo });
}

async function createModuleAchievementHandler(res, body) {
    try {
        const record = await createModuleAchievement(body);
        return sendJson(res, 201, {
            message: 'Module Achievement created successfully.',
            data: record,
        });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to create module achievement.',
        });
    }
}

async function getModuleAchievementByIdHandler(res, moduleAchievementId) {
    const parsedId = parseModuleAchievementId(moduleAchievementId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid module_achievement_id.' });
    }

    const moduleAchievementInfo = await getModuleAchievementById(parsedId);
    if (!moduleAchievementInfo) {
        return sendJson(res, 404, { message: 'Module Achievement not found.' });
    }

    return sendJson(res, 200, { data: moduleAchievementInfo });
}

async function updateModuleAchievementHandler(res, moduleAchievementId, body) {
    const parsedId = parseModuleAchievementId(moduleAchievementId);
    if (!parsedId) {
        return sendJson(res, 400, { message: 'Invalid module_achievement_id.' });
    }

    try {
        const moduleAchievementInfo = await updateModuleAchievement(parsedId, body);
        if (!moduleAchievementInfo) {
            return sendJson(res, 404, { message: 'Module Achievement not found.' });
        }

        return sendJson(res, 200, { data: moduleAchievementInfo });
    } catch (error) {
        return sendJson(res, 400, {
            message: error instanceof Error ? error.message : 'Unable to update module achievement.',
        });
    }
}

module.exports = {
    listModuleAchievementHandler,
    createModuleAchievementHandler,
    getModuleAchievementByIdHandler,
    updateModuleAchievementHandler,
};