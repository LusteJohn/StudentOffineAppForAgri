const http = require('http');
const { URL } = require('url');
const { handleAuthRoutes } = require('./routes/authRoutes');
const { handleCompetencyRoutes } = require('./routes/competencyRoutes');
const { handleQuestionAnswerRoutes } = require('./routes/questionAnswerRoutes');
const { handleJobSheetAnswerRoutes } = require('./routes/jobSheetAnswerRoutes');
const { handlePerformanceAnswerRoutes } = require('./routes/performanceAnswerRoutes');
const { handleLessonContentProgressRoutes } = require('./routes/lessonContentProgressRoutes');
const { handlePerformanceAnswerRoutes } = require('./routes/performanceAnswerRoutes');

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '0.0.0.0';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
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

  const routeHandled = (await handleAuthRoutes(req, res, requestUrl.pathname, body))
    || (await handleCompetencyRoutes(req, res, requestUrl.pathname, body))
    || (await handleQuestionAnswerRoutes(req, res, requestUrl.pathname, body))
    || (await handleJobSheetAnswerRoutes(req, res, requestUrl.pathname, body))
    || (await handlePerformanceAnswerRoutes(req, res, requestUrl.pathname, body))
    || (await handleLessonContentProgressRoutes(req, res, requestUrl.pathname, body));

  if (routeHandled === false) {
    sendNotFound(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Auth API running on http://${HOST}:${PORT}`);
});
