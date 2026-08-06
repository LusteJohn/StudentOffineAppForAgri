const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'student-module-achievement-record.json');

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

async function readStudentModuleAchievement() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeStudentModuleAchievement(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildStudentModuleAchievement(payload, studentModuleAchievementId, existingRecord) {
  const studentModuleAchievementInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    stud_module_achievement_id: studentModuleAchievementId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...studentModuleAchievementInput,
  };
}

async function createStudentModuleAchievement(payload) {
    const moduleAchievementId = Number(payload?.module_achievement_id);
    const userId = Number(payload?.user_id);
    if (!Number.isInteger(moduleAchievementId) || moduleAchievementId <= 0) {
        throw new Error('Module Achievement check ID is required and must be a positive integer');
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('User ID is required and must be a positive integer');
    }

    const studentModuleAchievementInput = await validatePayload(payload);
    const studentModuleAchievementInfo = await readStudentModuleAchievement();
    const existingRecord = studentModuleAchievementInfo.find(
        (record) => Number(record.performance_id) === moduleAchievementId && Number(record.user_id) === userId
    );
    if (existingRecord) {
        throw new Error(`Module Achievement for module_achievement_id "${moduleAchievementId}" already exists for this user.`);
    }

    const studentModuleAchievementId = studentModuleAchievementInfo.length > 0 ? Math.max(...studentModuleAchievementInfo.map((record) => record.module_achievement_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newStudentModuleAchievementInfo = {
        stud_module_achievement_id: studentModuleAchievementId,
        module_achievement_id: moduleAchievementId,
        user_id: userId,
        created_at: now,
        updated_at: now,
    };

    studentModuleAchievementInfo.push(newStudentModuleAchievementInfo);
    await writeStudentModuleAchievement(studentModuleAchievementInfo);
    return newStudentModuleAchievementInfo;
}

async function getModuleAchievementById(moduleAchievementId) {
    const moduleAchievementInfo = await readModuleAchievement();
    const moduleAchievementInfos = moduleAchievementInfos.find((moduleAchievementInfos) => String(moduleAchievementInfos.module_achievement_id) === String(moduleAchievementId)) || null;
}

async function getStudentModuleAchievementById(studentModuleAchievementId) {
    const studentModuleAchievementInfo = await readModuleAchievement();
    const studentModuleAchievementInfos = studentModuleAchievementInfos.find((studentModuleAchievementInfos) => String(studentModuleAchievementInfos.stud_module_achievement_id) === String(studentModuleAchievementId)) || null;
}

async function listStudentModuleAchievement() {
    const studentModuleAchievementInfo = await readStudentModuleAchievement();
    return studentModuleAchievementInfo.sort((left, right) => Number(left.stud_module_achievement_id) - Number(right.stud_module_achievement_id));
}

async function listStudentModuleAchievementByUser(userId) {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  const studentModuleAchievementInfo = await readStudentModuleAchievement();
  return studentModuleAchievementInfo
    .filter((record) => Number(record.user_id) === parsedUserId)
    .sort((left, right) => Number(left.stud_module_achievement_id) - Number(right.stud_module_achievement_id));
}

async function listStudentModuleAchievementByModuleAchievement(moduleAchievementId) {
    const parsedModuleAchievementId = Number(moduleAchievementId);
    if (!Number.isInteger(parsedModuleAchievementId) || parsedModuleAchievementId <= 0) {
        throw new Error('Invalid module_achievement_id');
    }
    const studentModuleAchievementInfo = await readStudentModuleAchievement();
    return studentModuleAchievementInfo
        .filter((record) => Number(record.module_achievement_id) === parsedModuleAchievementId)
        .sort((left, right) => Number(left.stud_module_achievement_id) - Number(right.stud_module_achievement_id));
}

async function listStudentModuleAchievementByUserAndModuleAchievement(userId, moduleAchievementId) {
  const parsedUserId = Number(userId);
  const parsedModuleAchievementId = Number(moduleAchievementId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  if (!Number.isInteger(parsedModuleAchievementId) || parsedModuleAchievementId <= 0) {
    throw new Error('Invalid module_achievement_id');
  }
  const studentModuleAchievementInfo = await readStudentModuleAchievement();
  return studentModuleAchievementInfo
    .filter((record) => Number(record.user_id) === parsedUserId && Number(record.module_achievement_id) === parsedModuleAchievementId)
    .sort((left, right) => Number(left.module_achievement_id) - Number(right.module_achievement_id));
}

async function updateStudentModuleAchievement(studentModuleAchievementId, payload) {
    const studentModuleAchievementInfo = await readStudentModuleAchievement();
    const index = studentModuleAchievementInfo.findIndex((record) => String(record.stud_module_achievement_id) === String(studentModuleAchievementId));

    if (index === -1) {
        throw new Error(`Student Module Achievement with ID "${studentModuleAchievementId}" not found.`);
    }

    const existingRecord = studentModuleAchievementInfo[index];
    const updatedRecord = {
        ...existingRecord,
        updated_at: new Date().toISOString(),
    };

    studentModuleAchievementInfo[index] = updatedRecord;
    await writeStudentModuleAchievement(studentModuleAchievementInfo);
    return updatedRecord;
}

module.exports = {
    createStudentModuleAchievement,
    listStudentModuleAchievement,
    listStudentModuleAchievementByUser,
    listStudentModuleAchievementByModuleAchievement,
    listStudentModuleAchievementByUserAndModuleAchievement,
    getStudentModuleAchievementById,
    updateStudentModuleAchievement,
};