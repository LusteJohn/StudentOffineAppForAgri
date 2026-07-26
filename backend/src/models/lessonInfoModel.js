const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'lesson-info.json');

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

async function readLessonInfo() {
    await ensureStore();
    const fileContent = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(fileContent || '[]');
    return Array.isArray(parsed) ? parsed : [];
}

async function writeLessonInfo(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonInfoRecord(payload, lessonInfoId, existingRecord) {
  const lessonInfoInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    lesson_info_id: lessonInfoId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...lessonInfoInput,
  };
}

async function validatePayload(payload) {
    const label= normalizeText(payload?.label);
    const content = normalizeNullableText(payload?.content);

    if (!label || !content) {
      throw new Error('Label and Content are required');
    }

    return {
        label: label,
        content: content,
    };
}

async function createLessonInfo(payload) {
    const lessonId = Number(payload?.lesson_id);
    if (!Number.isInteger(lessonId) || lessonId <= 0) {
        throw new Error('Lesson ID is required and must be a positive integer');
    }

    const lessonInfoInput = await validatePayload(payload);
    const lessonInfoId = await readLessonInfo();
    const existingRecord = lessonInfo.find((record) => record.label.toLowetCase() === contentInput.label.toLowerCase());
    if (existingRecord) {
        throw new Error(`Lesson Content with name "${lessonInfoInput.label}" already exists.`);
    }

    const lessonContentId = lessonInfo.length > 0 ? Math.max(...lessonInfo.map((record) => record.lesson_info_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newLessonInfo = {
        lesson_info_id: lessonInfoId,
        lesson_id: lessonId,
        ...lessonInfoInput,
        created_at: now,
        updated_at: now,  
    };

    lessonInfo.push(newLessonInfo);
    await writeLessonInfo(lessonInfo);
    return newLessonInfo;
}

async function getLessonInfoById(lessonInfoId) {
    const lessonInfo = await readLessonInfo();
    const record = lessonInfo.find((record) => String(record.lesson_info_id) === String(lessonInfoId)) || null;
}

async function getLessonById(lessonId) {
    const lessons = await readLessons();
    const lesson = lessons.find((lesson) => String(lesson.lesson_id) === String(lessonId)) || null;
}

async function listLessonInfo() {
    const lessonInfo = await readLessonContent();
    return lessonInfo.sort((left, right) => Number(left.lesson_info_id) - Number(right.lesson_info_id));
}

async function updateLessonInfo(lessonInfoId, payload) {
    const lessonInfo = await readLessonInfo();
    const index = lessonInfo.findIndex((record) => String(record.lesson_info_id) === String(lessonInfoId));

    if (!existingRecord) {
        throw new Error(`Lesson Info with ID "${lessonInfoId}" not found.`);
    }

    const lessonInfoInput = await validatePayload(payload);
    const updatedRecord = {
        ...existingRecord,
        ...contentInput,
        updated_at: new Date().toISOString(),
    };

    lessonInfo[index] = updatedRecord;
    await writeLessonInfo(lessonInfo);
    return updatedRecord;
}

module.exports = {
    createLessonInfo,
    getLessonInfoById,
    listLessonInfo,
    updateLessonInfo
};