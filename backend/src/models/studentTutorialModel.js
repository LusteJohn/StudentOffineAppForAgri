const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'student-tutorial-record.json');

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

async function readStudentTutorialRecord() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeStudentTutorialRecord(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function validatePayload(payload) {
  const userId = Number(payload?.user_id);
  const completed = Number(payload?.completed) === 1 ? 1 : 0;
  const step1Done = Number(payload?.step1_done) === 1 ? 1 : 0;
  const step2Done = Number(payload?.step2_done) === 1 ? 1 : 0;
  const step3Done = Number(payload?.step3_done) === 1 ? 1 : 0;

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('user_id must be a valid positive integer.');
  }

  return {
    user_id: userId,
    completed,
    step1_done: step1Done,
    step2_done: step2Done,
    step3_done: step3Done,
  };
}

async function createStudentTutorial(payload) {
  const input = validatePayload(payload);
  const records = await readStudentTutorialRecord();
  const existing = records.find((record) => Number(record.user_id) === input.user_id);

  if (existing) {
    throw new Error('A student tutorial record already exists for this user_id.');
  }

  const tutorialId = records.reduce((max, record) => Math.max(max, Number(record.tutorial_id) || 0), 0) + 1;
  const now = new Date().toISOString();

  const record = {
    tutorial_id: tutorialId,
    ...input,
    created_at: now,
    updated_at: now,
  };

  records.push(record);
  await writeStudentTutorialRecord(records);

  return record;
}

async function getStudentTutorialById(tutorialId) {
  const records = await readStudentTutorialRecord();
  return records.find((record) => Number(record.tutorial_id) === Number(tutorialId)) || null;
}

async function getStudentTutorialByUserId(userId) {
  const records = await readStudentTutorialRecord();
  return records.find((record) => Number(record.user_id) === Number(userId)) || null;
}

async function listStudentTutorial() {
  const records = await readStudentTutorialRecord();
  return records.sort((left, right) => Number(left.tutorial_id) - Number(right.tutorial_id));
}

async function listStudentTutorialByUser(userId) {
  const records = await readStudentTutorialRecord();
  return records
    .filter((record) => Number(record.user_id) === Number(userId))
    .sort((left, right) => Number(left.tutorial_id) - Number(right.tutorial_id));
}

async function updateStudentTutorial(tutorialId, payload) {
  const records = await readStudentTutorialRecord();
  const index = records.findIndex((record) => Number(record.tutorial_id) === Number(tutorialId));

  if (index < 0) {
    return null;
  }

  const input = validatePayload(payload);
  const updatedRecord = {
    ...records[index],
    ...input,
    updated_at: new Date().toISOString(),
  };

  records[index] = updatedRecord;
  await writeStudentTutorialRecord(records);

  return updatedRecord;
}

async function deleteStudentTutorial(tutorialId) {
  const records = await readStudentTutorialRecord();
  const index = records.findIndex((record) => Number(record.tutorial_id) === Number(tutorialId));

  if (index < 0) {
    return false;
  }

  records.splice(index, 1);
  await writeStudentTutorialRecord(records);

  return true;
}

module.exports = {
  createStudentTutorial,
  getStudentTutorialById,
  getStudentTutorialByUserId,
  listStudentTutorial,
  listStudentTutorialByUser,
  updateStudentTutorial,
  deleteStudentTutorial,
};
