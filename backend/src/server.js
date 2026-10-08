const http = require('http');
const { URL } = require('url');
const { handleAuthRoutes } = require('./routes/authRoutes');
const { handleCompetencyRoutes } = require('./routes/competencyRoutes');
const { handleQuestionAnswerRoutes } = require('./routes/questionAnswerRoutes');
const { handleJobSheetAnswerRoutes } = require('./routes/jobSheetAnswerRoutes');
const { handlePerformanceAnswerRoutes } = require('./routes/performanceAnswerRoutes');
const { handleLessonContentProgressRoutes } = require('./routes/lessonContentProgressRoutes');
const { handleLessonContentBookmarkRoutes } = require('./routes/lessonContentBookmarkRoutes');
const { handleSyncRoutes } = require('./routes/syncRoutes');
const { handleStaffRoutes } = require('./routes/staffRoutes');

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '0.0.0.0';

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  const allowedOrigins = String(
    process.env.CORS_ORIGINS || 'https://agrelearn.web.app,http://localhost:8081,http://localhost:19006',
  )
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
}

function sendNotFound(res) {
  res.writeHead(404, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify({ message: 'Route not found.' }));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        const rawBody = Buffer.concat(chunks).toString('utf8');
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Content-Length': '0',
    });
    res.end();
    return;
  }

  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  let body = {};
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    try {
      body = await parseJsonBody(req);
    } catch {
      res.writeHead(400, {
        'Content-Type': 'application/json; charset=utf-8',
      });
      res.end(JSON.stringify({ message: 'Invalid JSON payload.' }));
      return;
    }
  }

  let routeHandled = false;
  try {
    routeHandled = (await handleAuthRoutes(req, res, requestUrl.pathname, body))
      || (await handleCompetencyRoutes(req, res, requestUrl.pathname, body))
      || (await handleQuestionAnswerRoutes(req, res, requestUrl.pathname, body))
      || (await handleJobSheetAnswerRoutes(req, res, requestUrl.pathname, body))
      || (await handlePerformanceAnswerRoutes(req, res, requestUrl.pathname, body))
      || (await handleLessonContentProgressRoutes(req, res, requestUrl.pathname, body))
      || (await handleLessonContentBookmarkRoutes(req, res, requestUrl.pathname, body))
      || (await handleSyncRoutes(req, res, requestUrl.pathname, body))
      || (await handleStaffRoutes(req, res, requestUrl.pathname, body));
  } catch (error) {
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json; charset=utf-8',
      });
      res.end(JSON.stringify({
        message: error instanceof Error ? error.message : 'Internal server error.',
      }));
    }
    return;
  }

  if (routeHandled === false && !res.headersSent) {
    sendNotFound(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Auth API running on http://${HOST}:${PORT}`);
});
