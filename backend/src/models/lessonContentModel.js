const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'lesson-content.json');

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

async function readLessonContent() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLessonContent(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonContentRecord(payload, lessonContentId, existingRecord) {
  const contentInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    lesson_content_id: lessonContentId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...contentInput,
  };
}

async function validatePayload(payload) {
    const contentName = normalizeText(payload?.content_name);
    const objectives = normalizeNullableText(payload?.objectives);

    if (!contentName || !objectives) {
      throw new Error('Content name and objectives are required');
    }

    return {
        content_name: contentName,
        objectives: objectives,
    };
}

async function createLessonContent(payload) {
    const lessonId = Number(payload?.lesson_id);
    if (!Number.isInteger(lessonId) || lessonId <= 0) {
        throw new Error('Lesson ID is required and must be a positive integer');
    }

    const contentInput = await validatePayload(payload);
    const lessonContent = await readLessonContent();
    const existingRecord = lessonContent.find((record) => record.content_name.toLowetCase() === contentInput.content_name.toLowerCase());
    if (existingRecord) {
        throw new Error(`Lesson Content with name "${contentInput.content_name}" already exists.`);
    }

    const lessonContentId = lessonContent.length > 0 ? Math.max(...lessonContent.map((record) => record.lesson_content_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newLessonContent = {
        lesson_content_id: lessonContentId,
        lesson_id: lessonId,
        ...contentInput,
        created_at: now,
        updated_at: now,  
    };

    lessonContent.push(newLessonContent);
    await writeLessonContent(lessonContent);
    return newLessonContent;
}

async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContent();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
}

async function getLessonById(lessonId) {
    const lessons = await readLessons();
    const lesson = lessons.find((lesson) => String(lesson.lesson_id) === String(lessonId)) || null;
}

async function listLessonContent() {
    const lessonContent = await readLessonContent();
    return lessonContent.sort((left, right) => Number(left.lesson_content_id) - Number(right.lesson_content_id));
}

async function updateLessonContent(lessonContentId, payload) {
    const lessonContent = await readLessonContent();
    const index = lessonContent.findIndex((record) => String(record.lesson_content_id) === String(lessonContentId));

    if (!existingRecord) {
        throw new Error(`Lesson Content with ID "${lessonContentId}" not found.`);
    }

    const contentInput = await validatePayload(payload);
    const updatedRecord = {
        ...existingRecord,
        ...contentInput,
        updated_at: new Date().toISOString(),
    };

    lessonContent[index] = updatedRecord;
    await writeLessonContent(lessonContent);
    return updatedRecord;
}

module.exports = {
    createLessonContent,
    getLessonContentById,
    listLessonContent,
    updateLessonContent,
};