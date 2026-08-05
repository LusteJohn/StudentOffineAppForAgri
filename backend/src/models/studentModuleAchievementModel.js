const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'student_module_achievement.json');

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeNullableText(value) {
  const normalized = normalizeText(value);
  return normalized || null;
}

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readModuleAchievement() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeModuleAchievement(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildModuleAchievement(payload, moduleAchievementId, existingRecord) {
  const moduleAchievementInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    module_achievement_id: moduleAchievementId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...moduleAchievementInput,
  };
}

function validatePayload(payload) {
    const moduleAchievementName = normalizeText(payload?.name);
    const moduleAchievementBadgeImage = normalizeNullableText(payload?.badge_image);

    if (!moduleAchievementName || !moduleAchievementBadgeImage) {
        throw new Error('All fields are required.');
    }

  return {
    name: moduleAchievementName,
    badge_image: moduleAchievementBadgeImage,
  };
}

async function createModuleAchievement(payload) {
    const moduleId = Number(payload?.module_id);
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
        throw new Error('Module ID is required and must be a positive integer');
    }

    const moduleAchievementInput = await validatePayload(payload);
    const moduleAchievementInfo = await readModuleAchievement();
    const existingRecord = moduleAchievementInfo.find((record) => record.name.toLowetCase() === moduleAchievementInput.name.toLowerCase());
    if (existingRecord) {
        throw new Error(`Module Achievement with name "${moduleAchievementInput.name}" already exists.`);
    }

    const moduleAchievementId = moduleAchievementInfo.length > 0 ? Math.max(...moduleAchievementInfo.map((record) => record.module_achievement_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newAchievementInfo = {
        module_achievement_id: moduleAchievementId,
        module_id: moduleId,
        ...moduleAchievementInput,
        created_at: now,
        updated_at: now,  
    };

    moduleAchievementInfo.push(newAchievementInfo);
    await writeModuleAchievement(moduleAchievementInfo);
    return newAchievementInfo;
}

async function getModuleAchievementById(moduleAchievementId) {
    const moduleAchievementInfo = await readModuleAchievement();
    const moduleAchievementInfos = moduleAchievementInfos.find((moduleAchievementInfos) => String(moduleAchievementInfos.module_achievement_id) === String(moduleAchievementId)) || null;
}

async function getModuleById(moduleId) {
    const modules = await readModules();
    return modules.find((module) => String(module.module_id) === String(moduleId)) || null;
}

async function listModuleAchievement() {
    const moduleAchievementInfo = await readModuleAchievement();
    return moduleAchievementInfo.sort((left, right) => Number(left.module_achievement_id) - Number(right.module_achievement_id));
}

async function updateModuleAchievement(moduleAchievementId, payload) {
    const moduleAchievementInfo = await readModuleAchievement();
    const index = moduleAchievementInfo.find((moduleAchievementInfo) => String(moduleAchievementInfo.module_achievement_id) === String(moduleAchievementId));

    if (!existingRecord) {
        throw new Error(`Module Achievement with ID "${moduleAchievementId}" not found.`);
    }

    const moduleAchievementInput = await validatePayload(payload);
    const updatedLesson = {
        ...existingRecord,
        ...moduleAchievementInput,
        updated_at: new Date().toISOString(),
    };

    moduleAchievementInfo[index] = updatedLesson;
    await writeModuleAchievement(moduleAchievementInfo);
    return updatedLesson;
}

module.exports = {
    createModuleAchievement,
    getModuleAchievementById,
    listModuleAchievement,
    updateModuleAchievement,
};