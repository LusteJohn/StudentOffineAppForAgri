const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'lesson-link.json');

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

async function readLessonLink() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLessonLink(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonLinkRecord(payload, lessonLinkId, existingRecord) {
  const linkInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    lesson_link_id: lessonLinkId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...linkInput,
  };
}

async function validatePayload(payload) {
    const link = normalizeText(payload?.link);

    if (!link) {
      throw new Error('Lesson link are required');
    }

    return {
        link: link,
    };
}

async function createLessonLink(payload) {
    const lessonId = Number(payload?.lesson_id);
    if (!Number.isInteger(lessonId) || lessonId <= 0) {
        throw new Error('Lesson ID is required and must be a positive integer');
    }

    const linkInput = await validatePayload(payload);
    const linkContent = await readLessonLink();
    const existingRecord = linkContent.find((record) => record.link.toLowetCase() === linkInput.link.toLowerCase());
    if (existingRecord) {
        throw new Error(`Lesson Content with name "${linkInput.link}" already exists.`);
    }

    const lessonLinkId = linkContent.length > 0 ? Math.max(...linkContent.map((record) => record.lesson_link_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newLessonLink = {
        lesson_link_id: lessonLinkId,
        lesson_id: lessonId,
        ...linkInput,
        created_at: now,
        updated_at: now,  
    };

    linkContent.push(newLessonLink);
    await writeLessonLink(linkContent);
    return newLessonLink;
}

async function getLessonLinkById(lessonLinkId) {
    const linkContent = await readLessonContent();
    const record = linkContent.find((record) => String(record.lesson_link_id) === String(lessonLinkId)) || null;
}

async function getLessonById(lessonId) {
    const lessons = await readLessons();
    const lesson = lessons.find((lesson) => String(lesson.lesson_id) === String(lessonId)) || null;
}

async function listLessonLink() {
    const linkContent = await readLessonLink();
    return linkContent.sort((left, right) => Number(left.lesson_link_id) - Number(right.lesson_link_id));
}

async function updateLessonLink(lessonLinkId, payload) {
    const linkContent = await readLessonLink();
    const index = linkContent.findIndex((record) => String(record.lesson_link_id) === String(lessonLinkId));

    if (!existingRecord) {
        throw new Error(`Lesson Link with ID "${lessonLinkId}" not found.`);
    }

    const linkInput = await validatePayload(payload);
    const updatedRecord = {
        ...existingRecord,
        ...contentInput,
        updated_at: new Date().toISOString(),
    };

    linkContent[index] = updatedRecord;
    await writeLessonLink(linkContent);
    return updatedRecord;
}

module.exports = {
    createLessonLink,
    getLessonLinkById,
    listLessonLink,
    updateLessonLink,
};