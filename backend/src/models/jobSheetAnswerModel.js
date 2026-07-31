const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'job-sheet-answer.json');

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

async function readJobSheetAnswer() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeJobSheetAnswer(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildJobSheetAnswer(payload, answerId, existingRecord) {
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    answer_id: answerId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
  };
}

async function validatePayload(payload) {
  const answerText = normalizeText(payload?.answer_text);
  const userId = Number(payload?.user_id);
  const jobId = Number(payload?.job_id);

  if (!Number.isInteger(jobId) || jobId <= 0) {
    throw new Error('job_id is required and must be a positive integer');
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('user_id is required and must be a positive integer');
  }

  if (!answerText) {
    throw new Error('answer_text is required');
  }

  return {
    answer_text: answerText,
    user_id: userId,
    job_id: jobId,
  };
}

async function createJobSheetAnswer(payload) {
  const answerInput = await validatePayload(payload);
  const answerInfo = await readJobSheetAnswer();

  const existingIndex = answerInfo.findIndex(
    (record) => Number(record.job_id) === answerInput.job_id && Number(record.user_id) === answerInput.user_id
  );
  if (existingIndex !== -1) {
    throw new Error(`Answer for job sheet ${answerInput.job_id} already exists for this user.`);
  }

  const answerId = answerInfo.length > 0 ? Math.max(...answerInfo.map((record) => record.answer_id)) + 1 : 1;
  const now = new Date().toISOString();

  const newAnswerInfo = {
    answer_id: answerId,
    job_id: answerInput.job_id,
    user_id: answerInput.user_id,
    answer_text: answerInput.answer_text,
    created_at: now,
    updated_at: now,
  };

  answerInfo.push(newAnswerInfo);
  await writeJobSheetAnswer(answerInfo);
  return newAnswerInfo;
}

async function getAnswerById(answerId) {
  const answerInfo = await readJobSheetAnswer();
  const record = answerInfo.find((record) => String(record.answer_id) === String(answerId)) || null;
  return record;
}

async function listJobSheetAnswer() {
  const answerInfo = await readJobSheetAnswer();
  return answerInfo.sort((left, right) => Number(left.answer_id) - Number(right.answer_id));
}

async function listJobSheetAnswersByUser(userId) {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  const answerInfo = await readJobSheetAnswer();
  return answerInfo
    .filter((record) => Number(record.user_id) === parsedUserId)
    .sort((left, right) => Number(left.answer_id) - Number(right.answer_id));
}

async function listJobSheetAnswersByJob(jobId) {
  const parsedJobId = Number(jobId);
  if (!Number.isInteger(parsedJobId) || parsedJobId <= 0) {
    throw new Error('Invalid job_id');
  }
  const answerInfo = await readJobSheetAnswer();
  return answerInfo
    .filter((record) => Number(record.job_id) === parsedJobId)
    .sort((left, right) => Number(left.answer_id) - Number(right.answer_id));
}

async function listJobSheetAnswersByUserAndJob(userId, jobId) {
  const parsedUserId = Number(userId);
  const parsedJobId = Number(jobId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  if (!Number.isInteger(parsedJobId) || parsedJobId <= 0) {
    throw new Error('Invalid job_id');
  }
  const answerInfo = await readJobSheetAnswer();
  return answerInfo
    .filter((record) => Number(record.user_id) === parsedUserId && Number(record.job_id) === parsedJobId)
    .sort((left, right) => Number(left.answer_id) - Number(right.answer_id));
}

async function updateJobSheetAnswer(answerId, payload) {
  const answerInfo = await readJobSheetAnswer();
  const index = answerInfo.findIndex((record) => String(record.answer_id) === String(answerId));

  if (index === -1) {
    throw new Error(`Job Sheet Answer with ID "${answerId}" not found.`);
  }

  const answerInput = await validatePayload(payload);
  const existingRecord = answerInfo[index];
  const updatedRecord = {
    ...existingRecord,
    ...answerInput,
    updated_at: new Date().toISOString(),
  };

  answerInfo[index] = updatedRecord;
  await writeJobSheetAnswer(answerInfo);
  return updatedRecord;
}

module.exports = {
  createJobSheetAnswer,
  getAnswerById,
  listJobSheetAnswer,
  listJobSheetAnswersByUser,
  listJobSheetAnswersByJob,
  listJobSheetAnswersByUserAndJob,
  updateJobSheetAnswer,
};
