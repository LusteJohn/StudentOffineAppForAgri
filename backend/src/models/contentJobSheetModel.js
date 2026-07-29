const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'job-sheet-instruct.json');

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

async function readJobInstruct() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeJobInstruct(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildJobInstruct(payload, jobId, existingRecord) {
  const jobInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    job_id: jobId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...jobInput,
  };
}

async function validatePayload(payload) {
    const jobTitle = normalizeText(payload?.job_title);
    const jobObjective = normalizeText(payload?.job_objectives);
    const jobMaterial = normalizeText(payload?.job_materials);
    const jobSteps = normalizeText(payload?.job_steps);
    const jobAssesmentMethod = normalizeText(payload?.job_assesment_method);

    if (!jobTitle || !jobObjective || !jobMaterials || !jobSteps || !jobAssesmentMethod) {
      throw new Error('All are required');
    }

    return {
        jobTitle: job_title,
        jobObjective: job_objectives,
        jobMaterial: job_materials,
        jobSteps: job_steps,
        jobAssesmentMethod: job_assesment_method,
    };
}

async function createJobInstruct(payload) {
    const lessonContentId = Number(payload?.lesson_content_id);
    if (!Number.isInteger(lessonContentId) || lessonContentId <= 0) {
        throw new Error('Lesson Content ID is required and must be a positive integer');
    }

    const jobInput = await validatePayload(payload);
    const jobInfo = await readJobInstruct();
    const existingRecord = jobInfo.find((record) => normalizeText(record.job_title).toLowerCase() === normalizeText(jobInput.job_title).toLowerCase());
    if (existingRecord) {
        throw new Error(`JOb Sheet with label "${jobInput.job_title}" already exists.`);
    }

    const jobId = jobInfo.length > 0 ? Math.max(...jobInfo.map((record) => record.job_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newJobInfo = {
        job_id: jobId,
        lesson_content_id: lessonContentId,
        ...jobInput,
        created_at: now,
        updated_at: now,  
    };

    instructInfo.push(newJobInfo);
    await writeJobInstruct(jobInfo);
    return newJobInfo;
}

async function getLessonContentById(lessonContentId) {
    const lessonContent = await readLessonContent();
    const record = lessonContent.find((record) => String(record.lesson_content_id) === String(lessonContentId)) || null;
    return record;
}

async function getJobInstructById(jobInfo) {
    const jobInfo = await readJobInstruct();
    const record = jobInfo.find((record) => String(record.job_id) === String(jobInfo)) || null;
    return record;
}

async function listJobInstruct() {
    const jobInfo = await readJobInstruct();
    return jobInfo.sort((left, right) => Number(left.job_id) - Number(right.job_id));
}

async function updateJobInstruct(instructId, payload) {
    const jobInfo = await readQuestionInstruct();
    const index = jobInfo.findIndex((record) => String(record.job_id) === String(jobId));
  
    if (index === -1) {
        throw new Error(`Job Instruct with ID "${jobId}" not found.`);
    }
  
    const jobInput = await validatePayload(payload);
    const existingRecord = jobInfo[index];
    const updatedRecord = {
        ...existingRecord,
        ...jobInput,
        updated_at: new Date().toISOString(),
    };
  
    jobInfo[index] = updatedRecord;
    await writeQuestionInstruct(jobInfo);
    return updatedRecord;
}

module.exports = {
    createJobInstruct,
    listJobInstruct,
    getJobInstructById,
    updateJobInstruct,
}