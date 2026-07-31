const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'performance-answer.json');

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

async function readPerformanceAnswer() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writePerformanceAnswer(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildPerformanceAnswer(payload, performanceAnswerId, existingRecord) {
  const performanceAnswerInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    performance_answer_id: performanceAnswerId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...performanceAnswerInput,
  };
}

async function validatePayload(payload) {
    const performanceAnswerText = normalizeText(payload?.performance_answer_text);

    if (!performanceAnswerText) {
      throw new Error('All are required');
    }

    return {
        performanceAnswerText: performance_answer_text,
    };
}

async function createPerformanceAnswer(payload) {
    const performanceId = Number(payload?.performance_id);
    if (!Number.isInteger(performanceId) || performanceId <= 0) {
        throw new Error('Performance check ID is required and must be a positive integer');
    }

    const performanceAnswerInput = await validatePayload(payload);
    const performanceAnswerInfo = await readQuestionAnswer();
    const existingRecord = performanceAnswerInfo.find((record) => normalizeText(record.performanceAnswerText).toLowerCase() === normalizeText(performanceAnswerInput.performanceAnswerText).toLowerCase());
    if (existingRecord) {
        throw new Error(`Question Choices with label "${performanceAnswerInput.performanceAnswerText}" already exists.`);
    }

    const answerId = performanceAnswerInfo.length > 0 ? Math.max(...performanceAnswerInfo.map((record) => record.answer_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newAnswerInfo = {
        performance_answer_id: performanceAnswerId,
        performance_id: performanceId,
        user_id: payload?.userId || null,
        ...performanceAnswerInput,
        created_at: now,
        updated_at: now,  
    };

    performanceAnswerInfo.push(newAnswerInfo);
    await writeQuestionAnswer(performanceAnswerInfo);
    return newAnswerInfo;
}

async function getPerformanceById(performanceId) {
    const performanceInfo = await readPerformance();
    const record = performanceInfo.find((record) => String(record.performance_id) === String(performanceId)) || null;
    return record;
}

async function getPerformanceAnswerById(performanceId) {
    const performanceAnswerInfo = await readPerformanceAnswer();
    const record = performanceAnswerInfo.find((record) => String(record.performance_answer_id) === String(performanceAnswerId)) || null;
    return record;
}

async function listPerformanceAnswer() {
    const performanceAnswerInfo = await readPerformance();
    return performanceAnswerInfo.sort((left, right) => Number(left.performance_answer_id) - Number(right.performance_answer_id));
}

async function listPerformanceAnswersByUser(userId) {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  const performanceAnswerInfo = await readPerformanceAnswer();
  return performanceAnswerInfo
    .filter((record) => Number(record.user_id) === parsedUserId)
    .sort((left, right) => Number(left.performance_answer_id) - Number(right.performance_answer_id));
}

async function listPerformanceAnswersByPerformance(performanceId) {
  const parsedPerformanceId = Number(performanceId);
  if (!Number.isInteger(parsedJobId) || parsedPerformanceId <= 0) {
    throw new Error('Invalid performance_id');
  }
  const performanceAnswerInfo = await readJobSheetAnswer();
  return performanceAnswerInfo
    .filter((record) => Number(record.performance_id) === parsedPerformanceId)
    .sort((left, right) => Number(left.performance_answer_id) - Number(right.performance_answer_id));
}

async function listPerformanceAnswersByUserAndPerformance(userId, performanceId) {
  const parsedUserId = Number(userId);
  const parsedPerformanceId = Number(performanceId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  if (!Number.isInteger(parsedPerformanceId) || parsedPerformanceId <= 0) {
    throw new Error('Invalid performance_id');
  }
  const performanceAnswerInfo = await readPerformanceAnswer();
  return performanceAnswerInfo
    .filter((record) => Number(record.user_id) === parsedUserId && Number(record.performance_id) === parsedPerformanceId)
    .sort((left, right) => Number(left.performance_id) - Number(right.performance_id));
}

async function updatePerformanceAnswer(performanceAnswerId, payload) {
    const performanceAnswerInfo = await readPerformanceAnswer();
    const index = performanceAnswerInfo.findIndex((record) => String(record.performance_id) === String(performanceAnswerId));
  
    if (index === -1) {
        throw new Error(`Job Instruct with ID "${performanceAnswerId}" not found.`);
    }
  
    const performanceAnswerInput = await validatePayload(payload);
    const existingRecord = performanceAnswerInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...performanceAnswerInput,
        updated_at: new Date().toISOString(),
    };
  
    performanceAnswerInfo[index] = updatedRecord;
    await writePerformanceAnswer(performanceAnswerInfo);
    return updatedRecord;
}

module.exports ={
    createPerformanceAnswer,
    listPerformanceAnswer,
    listPerformanceAnswersByUser,
    listPerformanceAnswersByPerformance,
    listPerformanceAnswersByUserAndPerformance,
    getPerformanceAnswerById,
    updatePerformanceAnswer,
};