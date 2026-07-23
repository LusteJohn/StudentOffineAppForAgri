const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'lessons.json');

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

async function readLessons() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLessons(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonRecord(payload, lessonId, existingRecord) {
  const lessonInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    lesson_id: lessonId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...lessonInput,
  };
}

async function validatePayload(payload) {
    const lessonName = normalizeText(payload?.lesson_name);
    const order_number = Number(payload?.order_number);

    if (!lessonName || isNaN(order_number)) {
      throw new Error('Lesson name, and order number are required');
    }

    return {
        lesson_name: lessonName,
        order_number,
    };
}

async function createLesson(payload) {
    const moduleId = Number(payload?.module_id);
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
        throw new Error('Module ID is required and must be a positive integer');
    }

    const lessonInput = await validatePayload(payload);
    const lessons = await readLessons();
    const existingLesson = lessons.find((lesson) => lesson.lesson_name.toLowerCase() === lessonInput.lesson_name.toLowerCase());
    if (existingLesson) {
        throw new Error(`Lesson with name "${lessonInput.lesson_name}" already exists.`);
    }

    const lessonId = lessons.length > 0 ? Math.max(...lessons.map((lesson) => lesson.lesson_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newLesson = {
        lesson_id: lessonId,
        module_id: moduleId,
        ...lessonInput,
        created_at: now,
        updated_at: now,
    };

    lessons.push(newLesson);
    await writeLessons(lessons);
    return newLesson;
}

async function getLessonById(lessonId) {
    const lessons = await readLessons();
    const lesson = lessons.find((lesson) => String(lesson.lesson_id) === String(lessonId)) || null;
}

async function getModuleById(moduleId) {
    const modules = await readModules();
    return modules.find((module) => String(module.module_id) === String(moduleId)) || null;
}

async function listLessons() {
    const lessons = await readModules();
    return lessons.sort((left, right) => Number(left.lesson_id) - Number(right.lesson_id));
}

async function updateLesson(lessonId, payload) {
    const lessons = await readLessons();
    const index = lessons.find((lesson) => String(lesson.lesson_id) === String(lessonId));

    if (!existingLesson) {
        throw new Error(`Lesson with ID "${lessonId}" not found.`);
    }

    const lessonInput = await validatePayload(payload);
    const updatedLesson = {
        ...existingLesson,
        ...lessonInput,
        updated_at: new Date().toISOString(),
    };

    lessons[index] = updatedLesson;
    await writeLessons(lessons);
    return updatedLesson;
}

module.exports = {
    createLesson,
    getLessonById,
    getModuleById,
    listLessons,
    updateLesson,
};