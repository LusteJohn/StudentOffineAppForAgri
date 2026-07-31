const {
  createLessonContentProgress,
  listLessonContentProgressByUser,
  listLessonContentProgressByLessonContent,
  listLessonContentProgressByUserAndLessonContent,
  updateLessonContentProgress,
} = require('../controllers/progressStudentLessonContentController');

async function handleLessonContentProgressRoutes(req, res, pathname, body) {
  if (req.method === 'POST' && pathname === '/api/lesson-content-progress') {
    return createLessonContentProgress(req, res, body);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-progress/by-user/')) {
    const userId = pathname.split('/').pop();
    return listLessonContentProgressByUser(req, res, userId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-progress/by-lesson-content/')) {
    const lessonContentId = pathname.split('/').pop();
    return listLessonContentProgressByLessonContent(req, res, lessonContentId);
  }

  if (req.method === 'GET' && pathname.startsWith('/api/lesson-content-progress/by-user/') && pathname.includes('/by-lesson-content/')) {
    const parts = pathname.split('/').filter(Boolean);
    const byUserIndex = parts.indexOf('by-user');
    const byLessonContentIndex = parts.indexOf('by-lesson-content');
    if (byUserIndex !== -1 && byLessonContentIndex !== -1 && byLessonContentIndex > byUserIndex) {
      const userId = parts[byUserIndex + 1];
      const lessonContentId = parts[byLessonContentIndex + 1];
      return listLessonContentProgressByUserAndLessonContent(req, res, userId, lessonContentId);
    }
  }

  if (pathname.startsWith('/api/lesson-content-progress/')) {
    const progressId = pathname.split('/').pop();

    if (req.method === 'PUT' || req.method === 'PATCH') {
      return updateLessonContentProgress(res, progressId, body);
    }
  }

  return false;
}

module.exports = {
  handleLessonContentProgressRoutes,
};