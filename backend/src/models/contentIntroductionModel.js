const fs = require('fs').promises;
const path = require('path');
const { listLessonContent } = require('./lessonContentModel');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'content-information.json');

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

async function readContentInfo() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeContentInfo(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonInfoRecord(payload, contenInfotId, existingContentInfoRecord) {
  const contentInfoInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingContentInfoRecord,
    content_info_id: contenInfotId,
    created_at: existingContentInfoRecord?.created_at || now,
    updated_at: now,
    ...contentInfoInput,
  };
}

async function validatePayload(payload) {
    const contentLabel = normalizeText(payload?.label);
    const contentDesc = normalizeText(payload?.description);
    const contentImages = normalizeText(payload?.images);

    if (!contentLabel || !contentDesc) {
      throw new Error('Content lable, description and images are required');
    }

    return {
        label: contentLabel,
        description: contentDesc,
        images: contentImages
    };
}

async function createContentInfo(payload) {
    const lessonContentId = Number(payload?.lesson_content_id);
    if (!Number.isInteger(lessonContentId) || lessonContentId <= 0) {
        throw new Error('Lesson Content ID is required and must be a positive integer');
    }

    const contentInfoInput = await validatePayload(payload);
    const contentInfo = await readContentInfo();
    const existingContentInfoRecord = contentInfo.find((record) => normalizeText(record.label).toLowerCase() === normalizeText(contentInfoInput.label).toLowerCase());
    if (existingContentInfoRecord) {
        throw new Error(`Content Information with label "${contentInfoInput.label}" already exists.`);
    }

    const contenInfotId = contentInfo.length > 0 ? Math.max(...contentInfo.map((record) => record.content_info_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newContentInfo = {
        content_info_id: contenInfotId,
        lesson_content_id: lessonContentId,
        ...contentInfoInput,
        created_at: now,
        updated_at: now,  
    };

    contentInfo.push(newContentInfo);
    await writeContentInfo(contentInfo);
    return newContentInfo;
  }

  async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContent();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
    return record;
  }

  async function getContentInfoById(contenInfotId) {
    const contentInfo = await readContentInfo();
    const record = contentInfo.find((record) => String(record.content_info_id) === String(contenInfotId)) || null;
    return record;
  }

  async function listContentInfo() {
    const contentInfo = await readContentInfo();
    return contentInfo.sort((left, right) => Number(left.content_info_id) - Number(right.content_info_id));
  }

  async function updateContentInfo(contenInfotId, payload) {
    const contentInfo = await readContentInfo();
    const index = contentInfo.findIndex((record) => String(record.content_info_id) === String(contenInfotId));

    if (index === -1) {
        throw new Error(`Content Info with ID "${contenInfotId}" not found.`);
    }

    const contentInfoInput = await validatePayload(payload);
    const existingContentInfoRecord = contentInfo[index];
    const updatedRecord = {
        ...existingContentInfoRecord,
        ...contentInfoInput,
        updated_at: new Date().toISOString(),
    };

    contentInfo[index] = updatedRecord;
    await writeContentInfo(contentInfo);
    return updatedRecord;
  }

module.exports = {
    createContentInfo,
    getContentInfoById,
    getLessonContentById,
    listContentInfo,
    updateContentInfo,
}