const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'competencies.json');

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

async function readCompetencies() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeCompetencies(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildCompetencyRecord(payload, competencyId, existingRecord) {
  const competencyInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    competency_id: competencyId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...competencyInput,
  };
}

function validatePayload(payload) {
    const competencyName = normalizeText(payload?.competency_name);
    const sector = normalizeNullableText(payload?.sector);
    const qualification = normalizeNullableText(payload?.qualification);
  const status = normalizeText(payload?.status) || 'Active';

    if (!competencyName || !sector || !qualification || !status) {
        throw new Error('competency_name, sector, qualification, and status are required.');
    }

  return {
    competency_name: competencyName,
    sector: sector,
    qualification: qualification,
    status: status,
  };
}

async function createCompetency(payload) {
    const competencyInput = validatePayload(payload);
    const competencies = await readCompetencies();
  const nextId = competencies.reduce((highest, competency) => Math.max(highest, Number(competency.competency_id) || 0), 0) + 1;
    const newCompetency = {
    competency_id: nextId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
        ...competencyInput,
    };
    competencies.push(newCompetency);
    await writeCompetencies(competencies);
    return newCompetency;
}

async function listCompetencies() {
  const competencies = await readCompetencies();
  return competencies.sort((left, right) => Number(left.competency_id) - Number(right.competency_id));
}

async function getCompetencyById(competencyId) {
    const competencies = await readCompetencies();
  return competencies.find((competency) => String(competency.competency_id) === String(competencyId)) || null;
}

async function updateCompetency(competencyId, payload) {
    const competencies = await readCompetencies();
  const index = competencies.findIndex((competency) => String(competency.competency_id) === String(competencyId));
    if (index === -1) {
        return null;
    }
    const updatedCompetency = {
    ...buildCompetencyRecord(payload, competencies[index].competency_id, competencies[index]),
    };
    competencies[index] = updatedCompetency;
    await writeCompetencies(competencies);
    return updatedCompetency;
}

async function deleteCompetency(competencyId) {
    const competencies = await readCompetencies();
  const index = competencies.findIndex((competency) => String(competency.competency_id) === String(competencyId));
    if (index === -1) {
        return false;
    }
    competencies.splice(index, 1);
    await writeCompetencies(competencies);
    return true;
}

module.exports = {
    readCompetencies,
  listCompetencies,
    createCompetency,
    getCompetencyById,
    updateCompetency,
    deleteCompetency,
};