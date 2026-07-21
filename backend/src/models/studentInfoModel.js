const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'student_info.json');

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

async function readStudentInfo() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeStudentInfo(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function validatePayload(payload) {
  const firstName = normalizeText(payload?.first_name);
  const middleName = normalizeNullableText(payload?.middle_name);
  const lastName = normalizeText(payload?.last_name);
  const birthdate = normalizeText(payload?.birthdate);
  const homeAddress = normalizeText(payload?.home_address);
  const gradeLevel = normalizeText(payload?.grade_level);

  if (!firstName || !lastName || !birthdate || !homeAddress || !gradeLevel) {
    throw new Error('first_name, last_name, birthdate, home_address, and grade_level are required.');
  }

  return {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    birthdate: birthdate,
    home_address: homeAddress,
    grade_level: gradeLevel,
  };
}

async function createStudentInfo(payload) {
  const userId = Number(payload?.user_id);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('user_id must be a valid positive integer.');
  }

  const profileInput = validatePayload(payload);
  const records = await readStudentInfo();
  const existingByUser = records.find((record) => Number(record.user_id) === userId);

  if (existingByUser) {
    throw new Error('A student profile already exists for this user_id.');
  }

  const studentId = records.reduce((max, record) => Math.max(max, Number(record.student_id) || 0), 0) + 1;
  const now = new Date().toISOString();

  const record = {
    student_id: studentId,
    user_id: userId,
    ...profileInput,
    created_at: now,
    updated_at: now,
  };

  records.push(record);
  await writeStudentInfo(records);

  return record;
}

async function getStudentInfoById(studentId) {
  const records = await readStudentInfo();
  return records.find((record) => Number(record.student_id) === Number(studentId)) || null;
}

async function getStudentInfoByUserId(userId) {
  const records = await readStudentInfo();
  return records.find((record) => Number(record.user_id) === Number(userId)) || null;
}

async function listStudentInfo() {
  return readStudentInfo();
}

async function updateStudentInfo(studentId, payload) {
  const records = await readStudentInfo();
  const index = records.findIndex((record) => Number(record.student_id) === Number(studentId));

  if (index < 0) {
    return null;
  }

  const profileInput = validatePayload(payload);
  const updatedRecord = {
    ...records[index],
    ...profileInput,
    updated_at: new Date().toISOString(),
  };

  records[index] = updatedRecord;
  await writeStudentInfo(records);

  return updatedRecord;
}

async function deleteStudentInfo(studentId) {
  const records = await readStudentInfo();
  const index = records.findIndex((record) => Number(record.student_id) === Number(studentId));

  if (index < 0) {
    return false;
  }

  records.splice(index, 1);
  await writeStudentInfo(records);

  return true;
}

module.exports = {
  createStudentInfo,
  getStudentInfoById,
  getStudentInfoByUserId,
  listStudentInfo,
  updateStudentInfo,
  deleteStudentInfo,
};
