const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'lesson-content-progress.json');

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

async function readLessonContentProgress() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLessonContentProgress(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonContentProgress(payload, progresslessonId, existingRecord) {
  const progressLessonInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    progress_lesson_id: progresslessonId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...progressLessonInput,
  };
}

async function validatePayload(payload) {
    const isRead = normalizeText(payload?.is_read);

    if (!isRead) {
      throw new Error('is_read is required');
    }

    return {
        isRead: isRead === 'true' || isRead === '1',
    };
}

async function createLessonContentProgress(payload) {
  const lessonContentId = Number(payload?.lesson_content_id);
    const userId = Number(payload?.user_id);
    if (!Number.isInteger(lessonContentId) || lessonContentId <= 0) {
        throw new Error('Lesson Content ID is required and must be a positive integer');
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('User ID is required and must be a positive integer');
    }
    
    const progressLessonInput = await validatePayload(payload);
    const progressLessonInfo = await readLessonContentProgress();
    const existingRecord = progressLessonInfo.find(
        (record) => Number(record.lesson_content_id) === lessonContentId && Number(record.user_id) === userId
    );
    if (existingRecord) {
        throw new Error(`Lesson Progress "${progressLessonInput.isRead}" already exists.`);
    }

    const progresslessonId = progressLessonInfo.length > 0 ? Math.max(...progressLessonInfo.map((record) => record.progress_lesson_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newprogressLessonInfo = {
        progress_lesson_id: progresslessonId,
        lesson_content_id: lessonContentId,
        user_id: userId,
        is_read: progressLessonInput.isRead,
        read_at: now,
        created_at: now,
        updated_at: now,
    };

    progressLessonInfo.push(newprogressLessonInfo);
    await writeLessonContentProgress(progressLessonInfo);
    return newprogressLessonInfo;
}

async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContentProgress();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
    return record;
}

async function getLessonContentProgressById(progressLessonId) {
    const progressLessonInfo = await readLessonContentProgress();
    const record = progressLessonInfo.find((record) => String(record.progress_lesson_id) === String(progressLessonId)) || null;
    return record;
}

async function listLessonContentProgress() {
    const progressLessonInfo = await readLessonContentProgress();
    return progressLessonInfo.sort((left, right) => Number(left.progress_lesson_id) - Number(right.progress_lesson_id));
}

async function listLessonContentProgressByUser(userId) {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  const progressLessonInfo = await readLessonContentProgress();
  return progressLessonInfo
    .filter((record) => Number(record.user_id) === parsedUserId)
    .sort((left, right) => Number(left.progress_lesson_id) - Number(right.progress_lesson_id));
}

async function listLessonContentProgressByLessonContent(lessonContentId) {
    const parsedlessonContentId = Number(lessonContentId);
    if (!Number.isInteger(parsedlessonContentId) || parsedlessonContentId <= 0) {
        throw new Error('Invalid lesson_content_id');
    }
    const progressLessonInfo = await readLessonContentProgress();
    return progressLessonInfo
        .filter((record) => Number(record.lesson_content_id) === parsedlessonContentId)
        .sort((left, right) => Number(left.progress_lesson_id) - Number(right.progress_lesson_id));
}

async function listLessonContentProgressByUserAndLessonContent(userId, lessonContentId) {
  const parsedUserId = Number(userId);
  const parsedlessonContentId = Number(lessonContentId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  if (!Number.isInteger(parsedlessonContentId) || parsedlessonContentId <= 0) {
    throw new Error('Invalid lesson_content_id');
  }
  const progressLessonInfo = await readLessonContentProgress();
  return progressLessonInfo
    .filter((record) => Number(record.user_id) === parsedUserId && Number(record.lesson_content_id) === parsedlessonContentId)
    .sort((left, right) => Number(left.lesson_content_id) - Number(right.lesson_content_id));
}

async function updateLessonContentProgress(progresslessonId, payload) {
    const progressLessonInfo = await readLessonContentProgress();
    const index = progressLessonInfo.findIndex((record) => String(record.progress_lesson_id) === String(progresslessonId));

    if (index === -1) {
        throw new Error(`Lesson Content Progress with ID "${progresslessonId}" not found.`);
    }

    const progressLessonInput = await validatePayload(payload);
    const existingRecord = progressLessonInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...progressLessonInput,
        updated_at: new Date().toISOString(),
    };

    progressLessonInfo[index] = updatedRecord;
    await writeLessonContentProgress(progressLessonInfo);
    return updatedRecord;
}

module.exports = {
  createLessonContentProgress,
  listLessonContentProgress,
  listLessonContentProgressByUser,
  listLessonContentProgressByLessonContent,
  listLessonContentProgressByUserAndLessonContent,
  getLessonContentProgressById,
  updateLessonContentProgress,
};