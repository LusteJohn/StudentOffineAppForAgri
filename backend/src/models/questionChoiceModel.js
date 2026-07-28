const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'question-choice.json');

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

async function readQuestionChoice() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeQuestionChoice(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildQuestionChoice(payload, choiceId, existingRecord) {
  const choiceInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    choice_id: questionId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...choiceInput,
  };
}

async function validatePayload(payload) {
    const choiceLabel = normalizeText(payload?.choice_label);
    const choiceText = normalizeText(payload?.choice_text);
    const isCorrect = normalizeText(payload?.is_correct) || '';

    if (!choiceLabel || !choiceText || !isCorrect) {
      throw new Error('All are required');
    }

    return {
        choiceLabel: choice_label,
        choiceText: choice_text,
        isCorrect: is_correct,
    };
}

async function createQuestionChoice(payload) {
    const questionId = Number(payload?.questionId);
    if (!Number.isInteger(questionId) || questionId <= 0) {
        throw new Error('Question ID is required and must be a positive integer');
    }

    const choiceInput = await validatePayload(payload);
    const choiceInfo = await readQuestionChoice();
    const existingRecord = choiceInfo.find((record) => normalizeText(record.choiceLabel).toLowerCase() === normalizeText(choiceInput.choiceLabel).toLowerCase());
    if (existingRecord) {
        throw new Error(`Question Choices with label "${choiceInput.choiceLabel}" already exists.`);
    }

    const choiceId = choiceInfo.length > 0 ? Math.max(...choiceInfo.map((record) => record.choice_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newChoiceInfo = {
        choice_id: choiceId,
        question_id: questionId,
        ...choiceInput,
        created_at: now,
        updated_at: now,  
    };

    choiceInfo.push(newChoiceInfo);
    await writeQuestionChoice(choiceInfo);
    return newChoiceInfo;
}

async function getQuestionById(questionInfo) {
    const questionInfo = await readContentQuestion();
    const record = questionInfo.find((record) => String(record.question_id) === String(questionInfo)) || null;
    return record;
}

async function getQuestionChoice(choiceInfo) {
    const choiceInfo = await readQuestionChoice();
    const record = choiceInfo.find((record) => String(record.choice_id) === String(choiceInfo)) || null;
    return record;
}

async function listQuestionChoice() {
    const choiceInfo = await readQuestionChoice();
    return choiceInfo.sort((left, right) => Number(left.choice_id) - Number(right.choice_id));
}

async function updateQuestionChoice(choiceId, payload) {
    const choiceInfo = await readQuestionChoice();
    const index = choiceInfo.findIndex((record) => String(record.choice_id) === String(choiceId));
  
    if (index === -1) {
        throw new Error(`Question Choice with ID "${choiceId}" not found.`);
    }
  
    const choiceInput = await validatePayload(payload);
    const existingRecord = choiceInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...choiceInput,
        updated_at: new Date().toISOString(),
    };
  
    choiceInfo[index] = updatedRecord;
    await writeQuestionChoice(choiceInfo);
    return updatedRecord;
}

module.exports = {
    createQuestionChoice,
    getQuestionById,
    listQuestionChoice,
    updateQuestionChoice,
}