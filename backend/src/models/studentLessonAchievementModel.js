const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'student_lesson_achievement.json');

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

async function readLessonAchievement() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLessonAchievement(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonAchievement(payload, lessonAchievementId, existingRecord) {
  const lessonAchievementInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    lesson_achievement_id: lessonAchievementId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...lessonAchievementInput,
  };
}

function validatePayload(payload) {
    const lessonAchievementName = normalizeText(payload?.name);
    const lessonAchievementBadgeImage = normalizeNullableText(payload?.badge_image);

    if (!lessonAchievementName || !lessonAchievementBadgeImage) {
        throw new Error('All fields are required.');
    }

  return {
    name: lessonAchievementName,
    badge_image: lessonAchievementBadgeImage,
  };
}

async function createLessonAchievement(payload) {
    const lessonId = Number(payload?.lesson_id);
    if (!Number.isInteger(lessonId) || lessonId <= 0) {
        throw new Error('Lesson ID is required and must be a positive integer');
    }

    const lessonAchievementInput = await validatePayload(payload);
    const lessonAchievementInfo = await readLessonAchievement();
    const existingRecord = lessonAchievementInfo.find((record) => record.name.toLowetCase() === lessonAchievementInput.name.toLowerCase());
    if (existingRecord) {
        throw new Error(`Module Achievement with name "${lessonAchievementInput.name}" already exists.`);
    }

    const lessonAchievementId = lessonAchievementInfo.length > 0 ? Math.max(...lessonAchievementInfo.map((record) => record.lesson_achievement_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newLessonAchievementInput = {
        lesson_achievement_id: lessonAchievementId,
        lesson_id: lessonId,
        ...lessonAchievementInput,
        created_at: now,
        updated_at: now,  
    };

    lessonAchievementInfo.push(newLessonAchievementInput);
    await writeLessoneAchievement(lessonAchievementInfo);
    return newLessonAchievementInput;
}

async function getLessonAchievementById(lessonAchievementId) {
    const lessonAchievementInfo = await readLessonAchievement();
    const lessonAchievementInfos = lessonAchievementInfos.find((lessonAchievementInfos) => String(lessonAchievementInfos.lesson_achievement_id) === String(lessonAchievementId)) || null;
}

async function getLessonById(lessonId) {
    const lessons = await readLessons();
    return lesson.find((lesson) => String(lesson.lessonId) === String(lessonId)) || null;
}

async function listLessonAchievement() {
    const lessonAchievementInfo = await readLessonAchievement();
    return lessonAchievementInfo.sort((left, right) => Number(left.lesson_achievement_id) - Number(right.lesson_achievement_id));
}

async function updateLessonAchievement(lessonAchievementId, payload) {
    const lessonAchievementInfo = await readLessonAchievement();
    const index = lessonAchievementInfo.find((lessonAchievementInfo) => String(lessonAchievementInfo.lesson_achievement_id) === String(lessonAchievementId));

    if (!existingRecord) {
        throw new Error(`Module Achievement with ID "${lessonAchievementId}" not found.`);
    }

    const lessonAchievementInput = await validatePayload(payload);
    const updatedLesson = {
        ...existingRecord,
        ...lessonAchievementInput,
        updated_at: new Date().toISOString(),
    };

    lessonAchievementInfo[index] = updatedLesson;
    await writeLessonAchievement(lessonAchievementInfo);
    return updatedLesson;
}

module.exports = {
    createLessonAchievement,
    getLessonAchievementById,
    listLessonAchievement,
    updateLessonAchievement,
};