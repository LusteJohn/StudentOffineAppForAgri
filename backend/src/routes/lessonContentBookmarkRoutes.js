const {
  createLessonContentBookmark,
  listLessonContentBookmarkByUser,
  listLessonContentBookmarkByLessonContent,
  listLessonContentBookmarkByUserAndLessonContent,
  updateLessonContentBookmark,
} = require('../controllers/lessonContentBookmarkController');

async function handleLessonContentBookmarkRoutes(req, res, pathname, body) {
  if (req.method === 'POST' && pathname === '/api/lesson-content-bookmark') {
    return createLessonContentBookmark(req, res, body);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-bookmark/by-user/')) {
    const userId = pathname.split('/').pop();
    return listLessonContentBookmarkByUser(req, res, userId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-bookmark/by-lesson-content/')) {
    const lessonContentId = pathname.split('/').pop();
    return listLessonContentBookmarkByLessonContent(req, res, lessonContentId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-bookmark/by-user/') && pathname.includes('/by-lesson-content/')) {
    const parts = pathname.split('/').filter(Boolean);
    const byUserIndex = parts.indexOf('by-user');
    const byLessonContentIndex = parts.indexOf('by-lesson-content');
    if (byUserIndex !== -1 && byLessonContentIndex !== -1 && byLessonContentIndex > byUserIndex) {
      const userId = parts[byUserIndex + 1];
      const lessonContentId = parts[byLessonContentIndex + 1];
      return listLessonContentBookmarkByUserAndLessonContent(req, res, userId, lessonContentId);
    }
  }

  if (pathname.startsWith('/api/lesson-content-bookmark/')) {
    const bookmarkId = pathname.split('/').pop();

    if (req.method === 'PUT' || req.method === 'PATCH') {
      return updateLessonContentBookmark(res, bookmarkId, body);
    }
  }

  return false;
}

module.exports = {
  handleLessonContentBookmarkRoutes,
};
