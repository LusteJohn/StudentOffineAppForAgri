let _controller = null;

function getController() {
  if (!_controller) {
    _controller = require('../controllers/lessonContentBookmarkController');
  }
  return _controller;
}

async function handleLessonContentBookmarkRoutes(req, res, pathname, body) {
  const controller = getController();

  if (req.method === 'POST' && pathname === '/api/lesson-content-bookmark') {
    return controller.createLessonContentBookmark(req, res, body);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-bookmark/by-user/')) {
    const userId = pathname.split('/').pop();
    return controller.listLessonContentBookmarkByUser(req, res, userId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-bookmark/by-lesson-content/')) {
    const lessonContentId = pathname.split('/').pop();
    return controller.listLessonContentBookmarkByLessonContent(req, res, lessonContentId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-bookmark/by-user/') && pathname.includes('/by-lesson-content/')) {
    const parts = pathname.split('/').filter(Boolean);
    const byUserIndex = parts.indexOf('by-user');
    const byLessonContentIndex = parts.indexOf('by-lesson-content');
    if (byUserIndex !== -1 && byLessonContentIndex !== -1 && byLessonContentIndex > byUserIndex) {
      const userId = parts[byUserIndex + 1];
      const lessonContentId = parts[byLessonContentIndex + 1];
      return controller.listLessonContentBookmarkByUserAndLessonContent(req, res, userId, lessonContentId);
    }
  }

  if (pathname.startsWith('/api/lesson-content-bookmark/')) {
    const bookmarkId = pathname.split('/').pop();

    if (req.method === 'PUT' || req.method === 'PATCH') {
      return controller.updateLessonContentBookmark(req, res, bookmarkId, body);
    }
  }

  return false;
}

module.exports = {
  handleLessonContentBookmarkRoutes,
};
