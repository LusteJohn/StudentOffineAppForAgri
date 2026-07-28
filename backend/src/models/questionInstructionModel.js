const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'question-instruction.json');

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

async function readQuestionInstruct() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeQuestionInstruct(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildQuestionInstruct(payload, instructId, existingRecord) {
  const instructInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    instruct_id: instructId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...questionInput,
  };
}

async function validatePayload(payload) {
    const questionTitle = normalizeText(payload?.question_title);
    const questionLabel = normalizeText(payload?.question_label);
    const questionInstruct = normalizeText(payload?.question_instruct);

    if (!questionTitle || !questionLabel || !questionInstruct) {
      throw new Error('All are required');
    }

    return {
        questionInstruct: question_instruction,
        questionTitle: question_title,
        questionLabel: question_label,
        
    };
}

async function createQuestionInstruct(payload) {
    const lessonContentId = Number(payload?.lesson_content_id);
    if (!Number.isInteger(lessonContentId) || lessonContentId <= 0) {
        throw new Error('Lesson Content ID is required and must be a positive integer');
    }

    const instructInput = await validatePayload(payload);
    const instructInfo = await readQuestionInstruct();
    const existingRecord = instructInfo.find((record) => normalizeText(record.question).toLowerCase() === normalizeText(questionInput.question).toLowerCase());
    if (existingRecord) {
        throw new Error(`Questions Instruction with label "${instructInput.question}" already exists.`);
    }

    const questionId = instructInfo.length > 0 ? Math.max(...instructInfo.map((record) => record.question_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newInstructInfo = {
        instruct_id: instructId,
        lesson_content_id: lessonContentId,
        ...instructInput,
        created_at: now,
        updated_at: now,  
    };

    instructInfo.push(newInstructInfo);
    await writeQuestionInstruct(instructInfo);
    return newInstructInfo;
}

async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContent();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
    return record;
}

async function getQuestionInstructById(instructInfo) {
    const instructInfo = await readContentQuestion();
    const record = instructInfo.find((record) => String(record.instruct_id) === String(instructInfo)) || null;
    return record;
}

async function listQuestionInstruct() {
    const instructInfo = await readContentQuestion();
    return instructInfo.sort((left, right) => Number(left.instruct_id) - Number(right.instruct_id));
}

async function updateQuestionInstruct(instructId, payload) {
    const instructInfo = await readQuestionInstruct();
    const index = instructInfo.findIndex((record) => String(record.instruct_id) === String(instructId));
  
    if (index === -1) {
        throw new Error(`Question with ID "${instructId}" not found.`);
    }
  
    const instructInput = await validatePayload(payload);
    const existingRecord = instructInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...instructInput,
        updated_at: new Date().toISOString(),
    };
  
    instructInfo[index] = updatedRecord;
    await writeQuestionInstruct(instructInfo);
    return updatedRecord;
}

module.exports = {
    createQuestionInstruct,
    listQuestionInstruct,
    getQuestionInstructById,
    updateQuestionInstruct,
}