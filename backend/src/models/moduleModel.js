const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'modules.json');

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

async function readModules() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeModules(records) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function buildModuleRecord(payload, moduleId, existingRecord) {
  const moduleInput = validatePayload(payload);
  const now = new Date().toISOString();

  return {
    ...existingRecord,
    module_id: moduleId,
    created_at: existingRecord?.created_at || now,
    updated_at: now,
    ...moduleInput,
  };
}

async function validatePayload(payload) {
  const moduleName = normalizeText(payload?.module_name);
  const description = normalizeNullableText(payload?.description);
  const modulePdf = normalizeNullableText(payload?.module_pdf);
  const thumbnail = normalizeNullableText(payload?.thumbnail);

    if (!moduleName || !description || !thumbnail) {
      throw new Error('Module name, description, and thumbnail are required');
    }

  return {
    module_name: moduleName,
    description,
    module_pdf,
    thumbnail,
  };
}

async function createModule(payload) {
    const competencyId = Number(payload?.competency_id);
    if (!Number.isInteger(competencyId) || competencyId <= 0) {
        throw new Error('competency_id must be a valid positive integer.');
    }
    const moduleInput = await validatePayload(payload);
    const modules = await readModules();
    const existingModule = modules.find((module) => module.module_name.toLowerCase() === moduleInput.module_name.toLowerCase());
    if (existingModule) {
        throw new Error(`Module with name "${moduleInput.module_name}" already exists.`);
    }

    const moduleId = modules.reduce((max, module) => Math.max(max, Number(module.module_id) || 0), 0) + 1;
    const now = new Date().toISOString();

    const newModule = {
        module_id: moduleId,
        competency_id: competencyId,
        ...moduleInput,
        created_at: now,
        updated_at: now,
    };

    modules.push(newModule);
    await writeModules(modules);

    return newModule;
}

async function getModuleById(moduleId) {
    const modules = await readModules();
    return modules.find((module) => String(module.module_id) === String(moduleId)) || null;
}

async function getCompetencyById(competencyId) {
    const modules = await readModules();
    return modules.find((module) => String(module.competency_id) === String(competencyId)) || null;
}

async function listModules() {
    const modules = await readModules();
    return modules.sort((left, right) => Number(left.module_id) - Number(right.module_id));
}

async function updateModule(moduleId, payload) {
    const modules = await readModules();
    const index = modules.find((module) => String(module.module_id) === String(moduleId));

    if (!existingModule) {
        throw new Error(`Module with ID "${moduleId}" not found.`);
    }

    const moduleInput = await validatePayload(payload);
    const updatedModule = {
        ...existingModule,
        ...moduleInput,
        updated_at: new Date().toISOString(),
    };

    modules[index] = updatedModule;
    await writeModules(modules);

    return updatedModule;
}

module.exports = {
    createModule,
    getModuleById,
    listModules,
    updateModule,
};