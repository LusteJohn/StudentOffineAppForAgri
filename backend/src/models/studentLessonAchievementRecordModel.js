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

async function readStudentLessonAchievement() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeStudentLessonAchievement(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildStudentLessonAchievement(payload, studentLessonAchievementId, existingRecord) {
  const studentLessonAchievementInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    stud_lesson_achievement_id: studentLessonAchievementId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...studentLessonAchievementInput,
  };
}

async function createStudentLessonAchievement(payload) {
    const lessonAchievementId = Number(payload?.lesson_achievement_id);
    const userId = Number(payload?.user_id);
    if (!Number.isInteger(lessonAchievementId) || lessonAchievementId <= 0) {
        throw new Error('Lesson Achievement check ID is required and must be a positive integer');
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('User ID is required and must be a positive integer');
    }

    const studentLessonAchievementInput = await validatePayload(payload);
    const studentLessonAchievementInfo = await readStudentLessonAchievement();
    const existingRecord = studentLessonAchievementInfo.find(
        (record) => Number(record.performance_id) === lessonAchievementId && Number(record.user_id) === userId
    );
    if (existingRecord) {
        throw new Error(`Lesson Achievement for lesson_achievement_id "${lessonAchievementId}" already exists for this user.`);
    }

    const studentLessonAchievementId = studentLessonAchievementInfo.length > 0 ? Math.max(...studentLessonAchievementInfo.map((record) => record.lesson_achievement_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newStudentLessonAchievementInfo = {
        stud_lesson_achievement_id: studentLessonAchievementId,
        lesson_achievement_id: lessonAchievementId,
        user_id: userId,
        created_at: now,
        updated_at: now,
    };

    studentLessonAchievementInfo.push(newStudentLessonAchievementInfo);
    await writePerformanceAnswer(studentLessonAchievementInfo);
    return newStudentLessonAchievementInfo;
}

async function getLessonAchievementById(lessonAchievementId) {
    const lessonAchievementInfo = await readLessonAchievement();
    const lessonAchievementInfos = lessonAchievementInfos.find((lessonAchievementInfos) => String(lessonAchievementInfos.lesson_achievement_id) === String(lessonAchievementId)) || null;
}

async function getStudentLessonAchievementById(studentLessonAchievementId) {
    const studentLessonAchievementInfo = await readLessonAchievement();
    const studentLessonAchievementInfos = studentLessonAchievementInfos.find((studentLessonAchievementInfos) => String(studentLessonAchievementInfos.stud_lesson_achievement_id) === String(studentLessonAchievementId)) || null;
}

async function listStudentLessonAchievement() {
    const studentLessonAchievementInfo = await readStudentLessonAchievement();
    return studentLessonAchievementInfo.sort((left, right) => Number(left.stud_lesson_achievement_id) - Number(right.stud_lesson_achievement_id));
}

async function listStudentLessonAchievementByUser(userId) {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  const studentLessonAchievementInfo = await readPerformanceAnswer();
  return studentLessonAchievementInfo
    .filter((record) => Number(record.user_id) === parsedUserId)
    .sort((left, right) => Number(left.stud_lesson_achievement_id) - Number(right.stud_lesson_achievement_id));
}

async function listStudentLessonAchievementByLessonAchievement(lessonAchievementId) {
    const parsedLessonAchievementId = Number(lessonAchievementId);
    if (!Number.isInteger(parsedLessonAchievementId) || parsedLessonAchievementId <= 0) {
        throw new Error('Invalid lesson_achievement_id');
    }
    const studentLessonAchievementInfo = await readStudentLessonAchievement();
    return studentLessonAchievementInfo
        .filter((record) => Number(record.lesson_achievement_id) === parsedLessonAchievementId)
        .sort((left, right) => Number(left.stud_lesson_achievement_id) - Number(right.stud_lesson_achievement_id));
}

async function listStudentLessonAchievementByUserAndLessonAchievement(userId, lessonAchievementId) {
  const parsedUserId = Number(userId);
  const parsedLessonAchievementId = Number(lessonAchievementId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  if (!Number.isInteger(parsedLessonAchievementId) || parsedLessonAchievementId <= 0) {
    throw new Error('Invalid lesson_achievement_id');
  }
  const studentLessonAchievementInfo = await readPerformanceAnswer();
  return studentLessonAchievementInfo
    .filter((record) => Number(record.user_id) === parsedUserId && Number(record.lesson_achievement_id) === parsedLessonAchievementId)
    .sort((left, right) => Number(left.lesson_achievement_id) - Number(right.lesson_achievement_id));
}

async function updateStudentLessonAchievement(studentLessonAchievementId, payload) {
    const studentLessonAchievementInfo = await readPerformanceAnswer();
    const index = studentLessonAchievementInfo.findIndex((record) => String(record.stud_lesson_achievement_id) === String(studentLessonAchievementId));

    if (index === -1) {
        throw new Error(`Student Lesson Achievement with ID "${studentLessonAchievementId}" not found.`);
    }

    const existingRecord = studentLessonAchievementInfo[index];
    const updatedRecord = {
        ...existingRecord,
        updated_at: new Date().toISOString(),
    };

    studentLessonAchievementInfo[index] = updatedRecord;
    await writeStudentLessonAchievement(studentLessonAchievementInfo);
    return updatedRecord;
}

module.exports = {
    createStudentLessonAchievement,
    listStudentLessonAchievement,
    listStudentLessonAchievementByUser,
    listStudentLessonAchievementByLessonAchievement,
    listStudentLessonAchievementByUserAndPerformance,
    getStudentLessonAchievementById,
    updateStudentLessonAchievement,
};