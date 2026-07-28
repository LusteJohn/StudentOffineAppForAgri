const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'content-questions.json');

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

async function readContentQuestion() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeContentQuestion(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildContentQuestion(payload, questionId, existingRecord) {
  const questionInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    question_id: questionId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...questionInput,
  };
}

async function validatePayload(payload) {
    const question = normalizeText(payload?.question);
    const questionType = normalizeText(payload?.question_type);
    const questionOrder = Number(payload?.question_order);

    if (!question || !questionType || !questionOrder) {
      throw new Error('All are required');
    }

    return {
        question: question,
        questionType = question_type,
        questionOrder: question_order,
    };
}

async function createQuestion(payload) {
    const lessonContentId = Number(payload?.lesson_content_id);
    if (!Number.isInteger(lessonContentId) || lessonContentId <= 0) {
        throw new Error('Lesson Content ID is required and must be a positive integer');
    }

    const questionInput = await validatePayload(payload);
    const questionInfo = await readContentQuestion();
    const existingRecord = questionInfo.find((record) => normalizeText(record.question).toLowerCase() === normalizeText(questionInput.question).toLowerCase());
    if (existingRecord) {
        throw new Error(`Questions with label "${questionInput.question}" already exists.`);
    }

    const questionId = questionInfo.length > 0 ? Math.max(...questionInfo.map((record) => record.question_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newQuestionInfo = {
        question_id: questionId,
        lesson_content_id: lessonContentId,
        ...questionInput,
        created_at: now,
        updated_at: now,  
    };

    questionInfo.push(newQuestionInfo);
    await writeContentQuestion(questionInfo);
    return newQuestionInfo;
}

async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContent();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
    return record;
}

async function getQuestionById(questionInfo) {
    const questionInfo = await readContentQuestion();
    const record = questionInfo.find((record) => String(record.question_id) === String(questionInfo)) || null;
    return record;
}

async function listQuestion() {
    const questionInfo = await readContentQuestion();
    return questionInfo.sort((left, right) => Number(left.question_id) - Number(right.question_id));
}

async function updateQuestion(questionId, payload) {
    const questionInfo = await readContentQuestion();
    const index = questionInfo.findIndex((record) => String(record.question_id) === String(questionId));
  
    if (index === -1) {
        throw new Error(`Question with ID "${questionId}" not found.`);
    }
  
    const questionInput = await validatePayload(payload);
    const existingRecord = questionInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...questionInput,
        updated_at: new Date().toISOString(),
    };
  
    questionInfo[index] = updatedRecord;
    await writeContentQuestion(questionInfo);
    return updatedRecord;
}

module.exports = {
    createQuestion,
    getQuestionById,
    listQuestion,
    updateQuestion,
}