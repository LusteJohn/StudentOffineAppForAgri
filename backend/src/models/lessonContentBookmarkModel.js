const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'lesson_content_bookmark.json');

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

async function readLessonContentBookmark() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLessonContentBookmark(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildLessonContentBookmark(payload, lessonContentBookmarkId, existingRecord) {
  const lessonContentBookmarkInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    lesson_content_bookmark_id: lessonContentBookmarkId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...lessonContentBookmarkInput,
  };
}

async function validatePayload(payload) {
    const is_bookmark = normalizeText(payload?.is_bookmark);

    if (!is_bookmark) {
      throw new Error('is_bookmark is required');
    }

    return {
        is_bookmark: is_bookmark === 'true' || is_bookmark === '1',
    };
}

async function createLessonContentBookmark(payload) {
    const lessonContentId = Number(payload?.lesson_content_id);
    const userId = Number(payload?.user_id);
    if (!Number.isInteger(lessonContentId) || lessonContentId <= 0) {
        throw new Error('Lesson Content ID is required and must be a positive integer');
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('User ID is required and must be a positive integer');
    }

    const lessonContentBookmarkInput = await validatePayload(payload);
    const lessonContentBookmarkInfo = await readLessonContentBookmark();
    const existingRecord = lessonContentBookmarkInfo.find(
        (record) => Number(record.lesson_content_id) === lessonContentId && Number(record.user_id) === userId
    );
    if (existingRecord) {
        throw new Error(`Lesson Content Bookmark already exists for lesson_content_id "${lessonContentId}" and user_id "${userId}".`);
    }

    const lessonContentBookmarkId = lessonContentBookmarkInfo.length > 0 ? Math.max(...lessonContentBookmarkInfo.map((record) => record.lesson_content_bookmark_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newLessonContentBookmarkInfo = {
        lesson_content_bookmark_id: lessonContentBookmarkId,
        lesson_content_id: lessonContentId,
        user_id: userId,
        is_bookmark: lessonContentBookmarkInput.is_bookmark,
        created_at: now,
        updated_at: now,
    };

    lessonContentBookmarkInfo.push(newLessonContentBookmarkInfo);
    await writeLessonContentBookmark(lessonContentBookmarkInfo);
    return newLessonContentBookmarkInfo;
}

async function getLessonContentBookmarkById(lessonContentBookmarkId) {
    const lessonContentBookmarkInfo = await readLessonContentBookmark();
    const record = lessonContentBookmarkInfo.find((record) => String(record.lesson_content_bookmark_id) === String(lessonContentBookmarkId)) || null;
    return record;
}

async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContent();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
}

async function listLessonContentBookmark() {
    const lessonContentBookmarkInfo = await readLessonContentBookmark();
    return lessonContentBookmarkInfo.sort((left, right) => Number(left.lesson_content_bookmark_id) - Number(right.lesson_content_bookmark_id));
}

async function listLessonContentBookmarkByUser(userId) {
  const parsedUserId = Number(userId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  const lessonContentBookmarkInfo = await readLessonContentBookmark();
  return lessonContentBookmarkInfo
    .filter((record) => Number(record.user_id) === parsedUserId)
    .sort((left, right) => Number(left.lesson_content_bookmark_id) - Number(right.lesson_content_bookmark_id));
}

async function listLessonContentBookmarkByLessonContent(lessonContentId) {
    const parsedLessonContentId = Number(lessonContentId);
    if (!Number.isInteger(parsedLessonContentId) || parsedLessonContentId <= 0) {
        throw new Error('Invalid lesson_content_id');
    }
    const lessonContentBookmarkInfo = await readLessonContentBookmark();
    return lessonContentBookmarkInfo
        .filter((record) => Number(record.lesson_content_id) === parsedLessonContentId)
        .sort((left, right) => Number(left.lesson_content_bookmark_id) - Number(right.lesson_content_bookmark_id));
}

async function listLessonContentBookmarkByUserAndLessonContent(userId, lessonContentId) {
  const parsedUserId = Number(userId);
  const parsedLessonContentId = Number(lessonContentId);
  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error('Invalid user_id');
  }
  if (!Number.isInteger(parsedLessonContentId) || parsedLessonContentId <= 0) {
    throw new Error('Invalid lesson_content_id');
  }
  const lessonContentBookmarkInfo = await readLessonContentBookmark();
  return lessonContentBookmarkInfo
    .filter((record) => Number(record.user_id) === parsedUserId && Number(record.lesson_content_id) === parsedLessonContentId)
    .sort((left, right) => Number(left.lesson_content_id) - Number(right.lesson_content_id));
}

async function updateLessonContentBookmark(lessonContentBookmarkId, payload) {
    const lessonContentBookmarkInfo = await readLessonContentBookmark();
    const index = lessonContentBookmarkInfo.findIndex((record) => String(record.lesson_content_bookmark_id) === String(lessonContentBookmarkId));

    if (index === -1) {
        throw new Error(`Lesson Content Bookmark with ID "${lessonContentBookmarkId}" not found.`);
    }

    const lessonContentBookmarkInput = await validatePayload(payload);
    const existingRecord = lessonContentBookmarkInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...lessonContentBookmarkInput,
        updated_at: new Date().toISOString(),
    };

    lessonContentBookmarkInfo[index] = updatedRecord;
    await writeLessonContentBookmark(lessonContentBookmarkInfo);
    return updatedRecord;
}

module.exports = {
    createLessonContentBookmark,
    listLessonContentBookmark,
    listLessonContentBookmarkByUser,
    listLessonContentBookmarkByLessonContent,
    listLessonContentBookmarkByUserAndLessonContent,
    getLessonContentBookmarkById,
    updateLessonContentBookmark,
};