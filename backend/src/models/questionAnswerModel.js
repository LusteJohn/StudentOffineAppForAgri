const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'question-answer.json');

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

async function readQuestionAnswer() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeQuestionAnswer(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildQuestionAnswer(payload, answerId, existingRecord) {
  const answerInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    answer_id: answerId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...answerInput,
  };
}

async function validatePayload(payload) {
    const answerText = normalizeText(payload?.answer_text);

    if (!answerText) {
      throw new Error('All are required');
    }

    return {
        answerText: answer_text,
    };
}

async function createQuestionAnswer(payload) {
    const questionId = Number(payload?.questionId);
    if (!Number.isInteger(questionId) || questionId <= 0) {
        throw new Error('Question ID is required and must be a positive integer');
    }

    const answerInput = await validatePayload(payload);
    const answerInfo = await readQuestionAnswer();
    const existingRecord = answerInfo.find((record) => normalizeText(record.answerText).toLowerCase() === normalizeText(answerInput.answerText).toLowerCase());
    if (existingRecord) {
        throw new Error(`Question Choices with label "${answerInput.answerText}" already exists.`);
    }

    const answerId = answerInfo.length > 0 ? Math.max(...answerInfo.map((record) => record.answer_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newAnswerInfo = {
        answer_id: answerId,
        question_id: questionId,
        ...answerInput,
        created_at: now,
        updated_at: now,  
    };

    answerInfo.push(newAnswerInfo);
    await writeQuestionAnswer(answerInfo);
    return newAnswerInfo;
}

async function getQuestionById(questionInfo) {
    const questionInfo = await readContentQuestion();
    const record = questionInfo.find((record) => String(record.question_id) === String(questionInfo)) || null;
    return record;
}

async function getAnswerById(answerInfo) {
    const answerInfo = await readQuestionAnswer();
    const record = answerInfo.find((record) => String(record.answer_id) === String(answerInfo)) || null;
    return record;
}

async function listQuestionAnswer() {
    const answerInfo = await readQuestionAnswer();
    return answerInfo.sort((left, right) => Number(left.answer_id) - Number(right.answer_id));
}

async function updateQuestionAnswer(answerId, payload) {
    const answerInfo = await readQuestionAnswer();
    const index = answerInfo.findIndex((record) => String(record.answer_id) === String(answerId));
  
    if (index === -1) {
        throw new Error(`Question Answer with ID "${answerId}" not found.`);
    }
  
    const answerInput = await validatePayload(payload);
    const existingRecord = answerInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...answerInput,
        updated_at: new Date().toISOString(),
    };
  
    answerInfo[index] = updatedRecord;
    await writeQuestionAnswer(answerInfo);
    return updatedRecord;
}

module.exports = {
    createQuestionAnswer,
    getQuestionById,
    listQuestionAnswer,
    updateQuestionAnswer,
}