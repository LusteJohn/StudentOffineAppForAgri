import * as SQLite from 'expo-sqlite';

export type StudentUser = {
  user_id: number;
  username: string;
  email: string;
  role: 'student';
  created_at: string;
};

export type AuthResponse = {
  message: string;
  user: StudentUser;
};

export type StudentProfile = {
  student_id: number;
  user_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  birthdate: string;
  home_address: string;
  grade_level: string;
  created_at: string;
  updated_at: string;
};

export type CompetencyRecord = {
  competency_id: number;
  competency_name: string;
  sector: string;
  qualification: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ModuleRecord = {
  module_id: number;
  competency_id: number;
  module_name: string;
  description: string;
  module_pdf: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
};

type StoredStudentUser = StudentUser & {
  password: string;
}

type StoredCompetency = CompetencyRecord;

const DEFAULT_STUDENT_ACCOUNT: StoredStudentUser = {
  user_id: 1,
  username: 'student1',
  email: 'example@gmail.com',
  password: '12345',
  role: 'student',
  created_at: new Date().toISOString(),
};

const DEFAULT_COMPETENCIES: Omit<StoredCompetency, 'competency_id' | 'created_at' | 'updated_at'>[] = [
  {
    competency_name: 'Raise Organic Chicken',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
  {
    competency_name: 'Produce Organic Vegetables',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
  {
    competency_name: 'Produce Organic Fertilizer',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
  {
    competency_name: 'Produce Organic Concoction and Extract',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
];

const DEFAULT_MODULES: Omit<ModuleRecord, 'module_id' | 'created_at' | 'updated_at'>[] = [
  {
    competency_id: 1,
    module_name: 'Raise Organic Chicken',
    description: 'Welcome to the Module on Raising Organic Chicken. This module contains training materials and activities for you to complete. The unit of competency on Raise Organic Chicken contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Raising Organic Chicken.pdf',
    thumbnail: 'assets/learning-materials/module/Raising-chicken/raise.png',
  },
  {
    competency_id: 2,
    module_name: 'Produce Organic Vegetables',
    description: 'Welcome to the Module on Producing Organic Vegetables. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Vegetables contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Producing Organic Vegetables.pdf',
    thumbnail: 'assets/learning-materials/module/Producing-organic-vegetables/vegetables.png',
  },
  {
    competency_id: 3,
    module_name: 'Produce Organic Fertilizer',
    description: 'Welcome to the Module on Producing Organic Fertilizer. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Fertilizer contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Producing Organic Fertilizer.pdf',
    thumbnail: 'assets/learning-materials/module/Producing-organic-fertilizer/fertilizer.jpg',
  },
  {
    competency_id: 4,
    module_name: 'Produce Organic Concoction and Extract',
    description: 'Welcome to the Module on Producing Organic Concoction and Extract. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Concoction and Extract contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Producing Organic Concoction and Extract.pdf',
    thumbnail: 'assets/learning-materials/module/Producing-organic-concoction/concoction.jpg',
  },
];

const databasePromise = SQLite.openDatabaseAsync('student-offline-auth.db');

function toStudentUser(user: StoredStudentUser): StudentUser {
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: 'student',
    created_at: user.created_at,
  };
}

async function ensureDatabase() {
  const db = await databasePromise;
  await db.execAsync('PRAGMA journal_mode = WAL');

  const createStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS student_info (
      student_id INTEGER PRIMARY KEY NOT NULL,
      user_id INTEGER NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      middle_name TEXT,
      last_name TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      home_address TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS competencies (
      competency_id INTEGER PRIMARY KEY NOT NULL,
      competency_name TEXT NOT NULL,
      sector TEXT NOT NULL,
      qualification TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS modules (
      module_id INTEGER PRIMARY KEY NOT NULL,
      competency_id INTEGER NOT NULL,
      module_name TEXT NOT NULL,
      description TEXT NOT NULL,
      module_pdf TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (competency_id) REFERENCES competencies(competency_id)
    )`,
  ];

  for (const sql of createStatements) {
    try {
      await db.execAsync(sql);
    } catch (error) {
      console.error('Database table creation failed:', error);
    }
  }

  try {
    await db.execAsync('ALTER TABLE modules ADD COLUMN module_pdf TEXT DEFAULT ""');
  } catch {
    // Column already exists or table not yet created; ignore.
  }

  try {
    const existing = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM users');
    if ((existing?.count ?? 0) === 0) {
      await db.runAsync(
        'INSERT INTO users (user_id, username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          DEFAULT_STUDENT_ACCOUNT.user_id,
          DEFAULT_STUDENT_ACCOUNT.username,
          DEFAULT_STUDENT_ACCOUNT.email,
          DEFAULT_STUDENT_ACCOUNT.password,
          DEFAULT_STUDENT_ACCOUNT.role,
          DEFAULT_STUDENT_ACCOUNT.created_at,
        ]
      );
    }
  } catch (error) {
    console.error('Default student account seeding failed:', error);
  }

  try {
    for (let index = 0; index < DEFAULT_COMPETENCIES.length; index += 1) {
      const competency = DEFAULT_COMPETENCIES[index];
      const competencyId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM competencies WHERE competency_name = ?',
        [competency.competency_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO competencies
            (competency_id, competency_name, sector, qualification, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            competencyId,
            competency.competency_name,
            competency.sector,
            competency.qualification,
            competency.status,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Competency seeding failed:', error);
  }

  try {
    for (let index = 0; index < DEFAULT_MODULES.length; index += 1) {
      const moduleItem = DEFAULT_MODULES[index];
      const moduleId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM modules WHERE module_name = ?',
        [moduleItem.module_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO modules
            (module_id, competency_id, module_name, description, module_pdf, thumbnail, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            moduleId,
            moduleItem.competency_id,
            moduleItem.module_name,
            moduleItem.description,
            moduleItem.module_pdf,
            moduleItem.thumbnail,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Module seeding failed:', error);
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeText(value: string) {
  return value.trim();
}

function normalizeNullableText(value: string | null | undefined) {
  const normalized = String(value ?? '').trim();
  return normalized.length ? normalized : null;
}

async function findUserByEmail(email: string) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<StoredStudentUser>('SELECT * FROM users WHERE email = ?', [normalizeEmail(email)]);
}

export async function registerStudent(payload: { username: string; email: string; password: string }) {
  const username = normalizeText(payload.username);
  const email = normalizeEmail(payload.email);
  const password = normalizeText(payload.password);

  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required.');
  }

  await ensureDatabase();
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('A student account with that email already exists.');
  }

  const db = await databasePromise;
  const highestUser = await db.getFirstAsync<{ user_id: number }>('SELECT COALESCE(MAX(user_id), 0) + 1 AS user_id FROM users');
  const userId = highestUser?.user_id ?? 1;
  const createdAt = new Date().toISOString();

  await db.runAsync(
    'INSERT INTO users (user_id, username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, username, email, password, 'student', createdAt]
  );

  return {
    message: 'Student account created successfully.',
    user: toStudentUser({ user_id: userId, username, email, password, role: 'student', created_at: createdAt }),
  } satisfies AuthResponse;
}

export async function loginStudent(payload: { email: string; password: string }) {
  const email = normalizeEmail(payload.email);
  const password = normalizeText(payload.password);

  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error('Invalid student credentials.');
  }

  return {
    message: 'Student login successful.',
    user: toStudentUser(user),
  } satisfies AuthResponse;
}

function validateProfilePayload(payload: Omit<StudentProfile, 'student_id' | 'created_at' | 'updated_at'>) {
  const normalized = {
    user_id: Number(payload.user_id),
    first_name: normalizeText(payload.first_name || ''),
    middle_name: normalizeNullableText(payload.middle_name),
    last_name: normalizeText(payload.last_name || ''),
    birthdate: normalizeText(payload.birthdate || ''),
    home_address: normalizeText(payload.home_address || ''),
    grade_level: normalizeText(payload.grade_level || ''),
  };

  if (!Number.isInteger(normalized.user_id) || normalized.user_id <= 0) {
    throw new Error('A valid user_id is required.');
  }

  if (
    !normalized.first_name ||
    !normalized.last_name ||
    !normalized.birthdate ||
    !normalized.home_address ||
    !normalized.grade_level
  ) {
    throw new Error('first_name, last_name, birthdate, home_address, and grade_level are required.');
  }

  return normalized;
}

export async function listStudentProfiles() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<StudentProfile>('SELECT * FROM student_info ORDER BY student_id ASC');
}

export async function getStudentProfileByUserId(userId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<StudentProfile>('SELECT * FROM student_info WHERE user_id = ?', [userId]);
}

export async function createStudentProfile(payload: Omit<StudentProfile, 'student_id' | 'created_at' | 'updated_at'>) {
  const normalized = validateProfilePayload(payload);

  await ensureDatabase();
  const db = await databasePromise;

  const existing = await getStudentProfileByUserId(normalized.user_id);
  if (existing) {
    throw new Error('A student profile already exists for this user.');
  }

  const row = await db.getFirstAsync<{ student_id: number }>(
    'SELECT COALESCE(MAX(student_id), 0) + 1 AS student_id FROM student_info'
  );
  const studentId = row?.student_id ?? 1;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO student_info
      (student_id, user_id, first_name, middle_name, last_name, birthdate, home_address, grade_level, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      normalized.user_id,
      normalized.first_name,
      normalized.middle_name,
      normalized.last_name,
      normalized.birthdate,
      normalized.home_address,
      normalized.grade_level,
      now,
      now,
    ]
  );

  return {
    student_id: studentId,
    ...normalized,
    created_at: now,
    updated_at: now,
  } satisfies StudentProfile;
}

export async function updateStudentProfile(
  studentId: number,
  payload: Omit<StudentProfile, 'student_id' | 'created_at' | 'updated_at'>
) {
  const normalized = validateProfilePayload(payload);

  await ensureDatabase();
  const db = await databasePromise;
  const existing = await db.getFirstAsync<StudentProfile>('SELECT * FROM student_info WHERE student_id = ?', [studentId]);

  if (!existing) {
    throw new Error('Student profile not found.');
  }

  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE student_info
      SET first_name = ?, middle_name = ?, last_name = ?, birthdate = ?, home_address = ?, grade_level = ?, updated_at = ?
      WHERE student_id = ?`,
    [
      normalized.first_name,
      normalized.middle_name,
      normalized.last_name,
      normalized.birthdate,
      normalized.home_address,
      normalized.grade_level,
      now,
      studentId,
    ]
  );

  return {
    ...existing,
    ...normalized,
    updated_at: now,
  } satisfies StudentProfile;
}

export async function deleteStudentProfile(studentId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  const result = await db.runAsync('DELETE FROM student_info WHERE student_id = ?', [studentId]);
  return (result.changes ?? 0) > 0;
}

export async function listCompetencies() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<CompetencyRecord>('SELECT * FROM competencies ORDER BY competency_id ASC');
}

export async function listModules() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<ModuleRecord>('SELECT * FROM modules ORDER BY module_id ASC');
}

export async function getModuleByCompetencyId(competencyId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<ModuleRecord>('SELECT * FROM modules WHERE competency_id = ?', [competencyId]);
}

export async function resetAndSeedLocalData() {
  await ensureDatabase();
  const db = await databasePromise;

  const competencies = await db.getAllAsync<CompetencyRecord>('SELECT * FROM competencies ORDER BY competency_id ASC');
  const modules = await db.getAllAsync<ModuleRecord>('SELECT * FROM modules ORDER BY module_id ASC');

  const hasDefaultCompetencies = DEFAULT_COMPETENCIES.every((expected) =>
    competencies.some((c) => c.competency_name.toLowerCase() === expected.competency_name.toLowerCase())
  );
  const hasDefaultModules = DEFAULT_MODULES.every((expected) =>
    modules.some((m) => m.module_name.toLowerCase() === expected.module_name.toLowerCase())
  );

  if (hasDefaultCompetencies && hasDefaultModules && competencies.length > 0 && modules.length > 0) {
    return {
      competencies: competencies.length,
      modules: modules.length,
      alreadyImported: true,
    };
  }

  const now = new Date().toISOString();

  await db.runAsync('DELETE FROM modules');
  await db.runAsync('DELETE FROM competencies');
  try {
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'modules'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'competencies'");
  } catch {
    // sqlite_sequence may not exist in some SQLite versions/environments.
  }

  for (let index = 0; index < DEFAULT_COMPETENCIES.length; index += 1) {
    const competency = DEFAULT_COMPETENCIES[index];
    const competencyId = index + 1;

    await db.runAsync(
      `INSERT INTO competencies
        (competency_id, competency_name, sector, qualification, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [competencyId, competency.competency_name, competency.sector, competency.qualification, competency.status, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_MODULES.length; index += 1) {
    const moduleItem = DEFAULT_MODULES[index];
    const moduleId = index + 1;

    await db.runAsync(
      `INSERT INTO modules
        (module_id, competency_id, module_name, description, module_pdf, thumbnail, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [moduleId, moduleItem.competency_id, moduleItem.module_name, moduleItem.description, moduleItem.module_pdf, moduleItem.thumbnail, now, now]
    );
  }

  return {
    competencies: DEFAULT_COMPETENCIES.length,
    modules: DEFAULT_MODULES.length,
    alreadyImported: false,
  };
}
