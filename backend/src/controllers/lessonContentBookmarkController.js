const {
    createLessonContentBookmark,
    listLessonContentBookmark,
    listLessonContentBookmarkByUser,
    listLessonContentBookmarkByLessonContent,
    listLessonContentBookmarkByUserAndLessonContent,
    getLessonContentBookmarkById,
    updateLessonContentBookmark,
} = require('../models/lessonContentBookmarkModel');
const { sendJson } = require('./authController');

function parselessonContentBookmarkId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseUserId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parsedLessonContentId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listLessonContentBookmarkHandler(res) {
  const lessonContentBookmarkInfo = await listLessonContentBookmark();
  return sendJson(res, 200, { data: lessonContentBookmarkInfo });
}

async function listLessonContentBookmarkByUserHandler(req, res, userId) {
  const parsedUserId = parseUserId(userId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }

  try {
    const answers = await listLessonContentBookmarkByUser(parsedUserId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load lesson content bookmark.',
    });
  }
}

async function listLessonContentBookmarkByLessonContentHandler(req, res, lessonContentId) {
  const parsed = parsedLessonContentId(lessonContentId);
  if (!parsed) {
    return sendJson(res, 400, { message: 'Invalid lesson_content_id.' });
  }

  try {
    const answers = await listLessonContentBookmarkByLessonContent(parsed);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load lesson content bookmark.',
    });
  }
}

async function listLessonContentBookmarkByUserAndLessonContentHandler(req, res, userId, lessonContentId) {
  const parsedUserId = parseUserId(userId);
  const parsedLessonContentId = parsedLessonContentId(lessonContentId);
  if (!parsedUserId) {
    return sendJson(res, 400, { message: 'Invalid user_id.' });
  }
  if (!parsedLessonContentId) {
    return sendJson(res, 400, { message: 'Invalid lesson_content_id.' });
  }

  try {
    const answers = await listLessonContentBookmarkByUserAndLessonContent(parsedUserId, parsedLessonContentId);
    return sendJson(res, 200, { data: answers });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to load lesson content bookmark.',
    });
  }
}

async function createLessonContentBookmarkHandler(req, res, body) {
  try {
    const record = await createLessonContentBookmark(body);
    return sendJson(res, 201, {
      message: 'lesson content bookmark created successfully.',
      data: record,
    });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to submit lesson content bookmark.',
    });
  }
}

async function getLessonContentBookmarkByIdHandler(res, lessonContentBookmarkId) {
  const parsedId = parselessonContentBookmarkId(lessonContentBookmarkId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid lesson_content_bookmark_id.' });
  }

  const lessonContentBookmarkInfo = await getLessonContentBookmarkById(parsedId);
  if (!lessonContentBookmarkInfo) {
    return sendJson(res, 404, { message: 'lesson content bookmark not found.' });
  }

  return sendJson(res, 200, { data: lessonContentBookmarkInfo });
}

async function updateLessonContentBookmarkHandler(res, lessonContentBookmarkId, body) {
  const parsedId = parselessonContentBookmarkId(lessonContentBookmarkId);
  if (!parsedId) {
    return sendJson(res, 400, { message: 'Invalid lesson_content_bookmark_id.' });
  }

  try {
    const lessonContentBookmarkInfo = await updateLessonContentBookmark(parsedId, body);
    if (!lessonContentBookmarkInfo) {
        return sendJson(res, 404, { message: 'Lesson content bookmark not found.' });
    }

    return sendJson(res, 200, { data: lessonContentBookmarkInfo });
  } catch (error) {
    return sendJson(res, 400, {
      message: error instanceof Error ? error.message : 'Unable to update lesson content bookmark.',
    });
  }
}

module.exports = {
    listLessonContentBookmarkHandler,
    listLessonContentBookmarkByUserHandler,
    listLessonContentBookmarkByLessonContentHandler,
    listLessonContentBookmarkByUserAndLessonContentHandler,
    createLessonContentBookmarkHandler,
    getLessonContentBookmarkByIdHandler,
    updateLessonContentBookmarkHandler,
};