const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'performance-checklist.json');

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

async function readPerformance() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writePerformance(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildPerformance(payload, performanceId, existingRecord) {
  const performanceInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    performance_id: performanceId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...performanceInput,
  };
}

async function validatePayload(payload) {
    const performanceQuestion = normalizeText(payload?.performance_question);
    const performanceOrder = normalizeText(payload?.order);

    if (!performanceQuestion || !performanceOrder ) {
      throw new Error('All are required');
    }

    return {
        performanceQuestion: performanceQuestion,
        performanceOrder: performanceOrder,
    };
}

async function createPerformance(payload) {
    const lessonContentId = Number(payload?.lesson_content_id);
    if (!Number.isInteger(lessonContentId) || lessonContentId <= 0) {
        throw new Error('Lesson Content ID is required and must be a positive integer');
    }

    const performanceInput = await validatePayload(payload);
    const performanceInfo = await readPerformance();
    const existingRecord = performanceInfo.find((record) => normalizeText(record.performance_question).toLowerCase() === normalizeText(performanceInput.performanceQuestion).toLowerCase());
    if (existingRecord) {
        throw new Error(`Performance Check with question "${performanceInput.performanceQuestion}" already exists.`);
    }

    const jobId = performanceInfo.length > 0 ? Math.max(...performanceInfo.map((record) => record.performance_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newperformanceInfo = {
        performance_id: jobId,
        lesson_content_id: lessonContentId,
        ...performanceInput,
        created_at: now,
        updated_at: now,  
    };

    performanceInfo.push(newperformanceInfo);
    await writePerformance(performanceInfo);
    return newperformanceInfo;
}

async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContent();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
    return record;
}

async function getPerformanceById(performanceId) {
    const performanceInfo = await readPerformance();
    const record = performanceInfo.find((record) => String(record.performance_id) === String(performanceId)) || null;
    return record;
}

async function listPerformance() {
    const performanceInfo = await readPerformance();
    return performanceInfo.sort((left, right) => Number(left.performance_id) - Number(right.performance_id));
}

async function updatePerformance(performanceId, payload) {
    const performanceInfo = await readPerformance();
    const index = performanceInfo.findIndex((record) => String(record.performance_id) === String(performanceId));
  
    if (index === -1) {
        throw new Error(`Performance Check with ID "${performanceId}" not found.`);
    }
  
    const performanceInput = await validatePayload(payload);
    const existingRecord = performanceInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...performanceInput,
        updated_at: new Date().toISOString(),
    };
  
    performanceInfo[index] = updatedRecord;
    await writePerformance(performanceInfo);
    return updatedRecord;
}

module.exports = {
    createPerformance,
    listPerformance,
    getPerformanceById,
    updatePerformance,
};