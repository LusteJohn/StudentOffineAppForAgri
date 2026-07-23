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

export type LessonRecord = {
  lesson_id: number;
  module_id: number;
  lesson_name: string;
  order_number: number;
  created_at: string;
  updated_at: string;
};

export type LessonContentRecord = {
  lesson_content_id: number;
  lesson_id: number;
  content_name: string;
  objectives: string;
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

const DEFAULT_LESSONS: Omit<LessonRecord, 'lesson_id' | 'created_at' | 'updated_at'>[] = [
  { module_id: 1, lesson_name: 'LO1:Select Healthy Stocks and Suitable Housing', order_number: 1 },
  { module_id: 1, lesson_name: 'LO2:Set-up Cage Equipment', order_number: 2 },
  { module_id: 1, lesson_name: 'LO3:Feed Chicken', order_number: 3 },
  { module_id: 1, lesson_name: 'LO4:Grow and Harvest Chicken', order_number: 4 },
  { module_id: 2, lesson_name: 'LO1:Establish Nursery', order_number: 1 },
  { module_id: 2, lesson_name: 'LO2:Plant Seedlings', order_number: 2 },
  { module_id: 2, lesson_name: 'LO3:Perform Plant Care and Management', order_number: 3 },
  { module_id: 2, lesson_name: 'LO4:Perform Harvest and Post-Harvest Activities', order_number: 4 },
  { module_id: 3, lesson_name: 'LO1:Prepare Composting Area and Raw Materials', order_number: 1 },
  { module_id: 3, lesson_name: 'LO2:Compost and Harvest Fertilizer', order_number: 2 },
  { module_id: 4, lesson_name: 'LO1:Prepare for the production of various concoctions', order_number: 1 },
  { module_id: 4, lesson_name: 'LO2:Process concoctions', order_number: 2 },
  { module_id: 4, lesson_name: 'LO3:Package concoctions', order_number: 3 },
];

const DEFAULT_LESSON_CONTENTS: Omit<LessonContentRecord, 'lesson_content_id' | 'created_at' | 'updated_at'>[] = [
  { lesson_id: 1, content_name: 'Chicken breeds identification', objectives: 'After reading this information sheet, you should be able to identify chicken breeds.' },
  { lesson_id: 1, content_name: "Healthy chick's selection indicators", objectives: 'After reading this information sheet, you should be able to select healthy chicks' },
  { lesson_id: 1, content_name: 'Determining suitable site for chicken house', objectives: 'After reading this information sheet, you should be able to determine suitable site for chicken house' },
  { lesson_id: 1, content_name: 'Chicken house design preparation', objectives: 'After reading this information sheet, you should be able to prepare design for chicken house.' },
  { lesson_id: 1, content_name: 'House equipment installation design', objectives: 'After reading this information sheet, you should be able to identify chicken breeds.' },
  { lesson_id: 2, content_name: 'House equipment installation', objectives: 'After reading this information sheet, you should be able to appreciate the importance of house equipment installation.' },
  { lesson_id: 2, content_name: 'Preparing and securing bedding materials', objectives: 'After reading this information sheet, you should be able to prepare and secure bedding materials' },
  { lesson_id: 2, content_name: 'Setting up brooding facility', objectives: 'After reading this information sheet, you should be able to set up brooding facility.' },
  { lesson_id: 3, content_name: 'Feed materials selection', objectives: 'After reading this information sheet, you should be able to select materials for feeds' },
  { lesson_id: 3, content_name: 'Feeding materials preparation', objectives: 'After reading this information sheet, you should be able to prepare feeding materials.' },
  { lesson_id: 3, content_name: 'Feeding management program', objectives: 'After reading this information sheet, you should be able to differentiate different feeding program.' },
  { lesson_id: 3, content_name: 'Monitoring feeding', objectives: 'After reading this information sheet, you should be able to monitor feeding.' },
  { lesson_id: 4, content_name: 'Monitor growth rate', objectives: 'After reading this information sheet, you should be able to monitor growth rate of a broiler' },
  { lesson_id: 4, content_name: 'Healthcare program implementation', objectives: 'After reading this information sheet, you should be able to appreciate healthcare program.' },
  { lesson_id: 4, content_name: 'Sanitation and cleanliness program', objectives: 'After reading this information sheet, you should be able to appreciate the importance of sanitation and cleanliness program' },
  { lesson_id: 4, content_name: 'Organic waste collection for fertilizer formulation', objectives: 'After reading this information sheet, you should be able to collect organic waste.' },
  { lesson_id: 4, content_name: 'Suitable chicken for harvest selection', objectives: 'After reading this information sheet, you should be able to select Suitable chicken for harvest.' },
  { lesson_id: 4, content_name: 'Production record', objectives: 'After reading this information sheet, you should be able to appreciate the importance of production record.' },
  { lesson_id: 5, content_name: 'Selection of Seeds', objectives: 'After reading this information sheet, you should be able to select viable seeds.' },
  { lesson_id: 5, content_name: 'Seedbed Preparation', objectives: 'After reading this information sheet, you should be able to prepare seedbed.' },
  { lesson_id: 5, content_name: 'Maintaining Seedling', objectives: 'After reading this information sheet, you should be able to care and maintain seedlings.' },
  { lesson_id: 5, content_name: 'Prepare Growing Media', objectives: 'After reading this information sheet, you should be able prepare the different growing media.' },
  { lesson_id: 6, content_name: 'Land Preparation', objectives: 'After reading this information sheet, you should be able to perform land preparation.' },
  { lesson_id: 6, content_name: 'Beneficial Microorganisms', objectives: 'After reading this information sheet, you should be able to identify the different types beneficial microorganism.' },
  { lesson_id: 6, content_name: 'Planting/Transplanting Seedlings', objectives: 'After reading this information sheet, you should be able to plant/transplant vegetable seedlings.' },
  { lesson_id: 6, content_name: 'Water Seedlings', objectives: 'After reading this information sheet, you should be able to water seedlings.' },
  { lesson_id: 7, content_name: 'Water Management Implementation', objectives: 'After reading this information sheet, you should be able to appreciate the importance of proper water management.' },
  { lesson_id: 7, content_name: 'Pest and Diseases Control Measures', objectives: 'After reading this information sheet, you should be able to apply control measures on pest and diseases.' },
  { lesson_id: 7, content_name: 'Replanting Missing Hills', objectives: 'After reading this information sheet, you should be able to do replanting.' },
  { lesson_id: 7, content_name: 'Plant Rationing (Rejuvenation)', objectives: 'After reading this information sheet, you should be able identify the number of sow to be served per boar.' },
  { lesson_id: 7, content_name: 'Organic Fertilizers Application', objectives: 'After reading this information sheet, you should be able identify organic fertilizers.' },
  { lesson_id: 8, content_name: 'Maturity Indices', objectives: 'After reading this information sheet, you should be able identify the maturity indices of fruits of vegetables.' },
  { lesson_id: 8, content_name: 'Harvest Marketable Products', objectives: 'After reading this information sheet, you should be able to harvest marketable products.' },
  { lesson_id: 8, content_name: 'Classify Marketable Products', objectives: 'After reading this information sheet, you should be able to classify marketable products.' },
  { lesson_id: 8, content_name: 'Harvesting Tools and Materials', objectives: 'After reading this information sheet, you should be able identify the best tools for harvesting.' },
  { lesson_id: 9, content_name: 'Site Selection', objectives: 'After reading this information sheet, you should be able to select composting site.' },
  { lesson_id: 9, content_name: 'Prepare Site Layout', objectives: 'After reading this information sheet, you should be able to prepare composting site layout.' },
  { lesson_id: 9, content_name: 'Prepare Bed', objectives: 'After reading this information sheet, you should be able to prepare bed for composting.' },
  { lesson_id: 9, content_name: 'Gather Materials', objectives: 'After reading this information sheet, you should be able to gather the raw materials for composting.' },
  { lesson_id: 9, content_name: 'Raw Materials', objectives: 'After reading this information sheet, you should be able to identify the raw materials uses for composting.' },
  { lesson_id: 10, content_name: 'Composting Method', objectives: 'After reading this information sheet, you should be able to identify the different types of composting method.' },
  { lesson_id: 10, content_name: 'Monitor Decomposition Process', objectives: 'After reading this information sheet, you should be able to monitor the decomposition process of organic fertilizer.' },
  { lesson_id: 10, content_name: 'Harvest Quality', objectives: 'After reading this information sheet, you should be able to identify the quality of a good harvest.' },
  { lesson_id: 10, content_name: 'Processing of Compost Fertilizer', objectives: 'After reading this information sheet, you should be able to identify processes of composting fertilizer.' },
  { lesson_id: 10, content_name: 'Record Keeping', objectives: 'After reading this information sheet, you should be able to perform record keeping.' },
  { lesson_id: 11, content_name: 'Storage Area', objectives: 'After reading this information sheet, you should be able to secure the Storage Areas.' },
  { lesson_id: 11, content_name: 'Raw materials', objectives: 'After reading this information sheet, you should be able to determine the clean raw materials free from chemicals.' },
  { lesson_id: 11, content_name: 'Tools, Materials and Equipment', objectives: 'After reading this information sheet, you should be able to identify the tools, materials and equipment.' },
  { lesson_id: 11, content_name: 'Personal Hygiene', objectives: 'None' },
  { lesson_id: 12, content_name: 'Prepare Raw Materials', objectives: 'After reading this information sheet, you should be able to prepare raw materials when producing organic concoction and extract.' },
  { lesson_id: 12, content_name: 'Fermentation period', objectives: 'After reading this information sheet, you should be able to determine the period of fermentation process.' },
  { lesson_id: 12, content_name: 'Various concoctions', objectives: 'After reading this information sheet, you should be able to identify various type of concoctions.' },
  { lesson_id: 12, content_name: 'Period of harvest', objectives: 'After reading this information sheet, you should be able to identify harvesting time of concoction.' },
  { lesson_id: 13, content_name: 'Sanitize bottles and containers', objectives: 'After reading this information sheet, you should be able to sanitize the bottles and containers for concoctions.' },
  { lesson_id: 13, content_name: 'Package concoctions', objectives: 'After reading this information sheet, you should be able to appreciate the proper labeling and packaging of concoctions.' },
  { lesson_id: 13, content_name: 'Appropriate place to store', objectives: 'After reading this information sheet, you should be able to determine the appropriate storage for the various concoctionss.' },
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
    `CREATE TABLE IF NOT EXISTS lessons (
      lesson_id INTEGER PRIMARY KEY NOT NULL,
      module_id INTEGER NOT NULL,
      lesson_name TEXT NOT NULL,
      order_number INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (module_id) REFERENCES modules(module_id)
    )`,
    `CREATE TABLE IF NOT EXISTS lesson_content (
      lesson_content_id INTEGER PRIMARY KEY NOT NULL,
      lesson_id INTEGER NOT NULL,
      content_name TEXT NOT NULL,
      objectives TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
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

  try {
    for (let index = 0; index < DEFAULT_LESSONS.length; index += 1) {
      const lessonItem = DEFAULT_LESSONS[index];
      const lessonId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM lessons WHERE lesson_name = ?',
        [lessonItem.lesson_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO lessons
            (lesson_id, module_id, lesson_name, order_number, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
          [
            lessonId,
            lessonItem.module_id,
            lessonItem.lesson_name,
            lessonItem.order_number,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Lesson seeding failed:', error);
  }

  try {
    for (let index = 0; index < DEFAULT_LESSON_CONTENTS.length; index += 1) {
      const contentItem = DEFAULT_LESSON_CONTENTS[index];
      const contentId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM lesson_content WHERE content_name = ?',
        [contentItem.content_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO lesson_content
            (lesson_content_id, lesson_id, content_name, objectives, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
          [
            contentId,
            contentItem.lesson_id,
            contentItem.content_name,
            contentItem.objectives,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Lesson content seeding failed:', error);
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

export async function getUserById(userId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<StoredStudentUser>('SELECT * FROM users WHERE user_id = ?', [userId]);
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

export async function listLessons() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonRecord>('SELECT * FROM lessons ORDER BY module_id ASC, order_number ASC, lesson_id ASC');
}

export async function getLessonsByModuleId(moduleId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonRecord>('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_number ASC, lesson_id ASC', [moduleId]);
}

export async function listLessonContent() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonContentRecord>('SELECT * FROM lesson_content ORDER BY lesson_id ASC, lesson_content_id ASC');
}

export async function listLessonContentByLessonId(lessonId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonContentRecord>('SELECT * FROM lesson_content WHERE lesson_id = ? ORDER BY lesson_content_id ASC', [lessonId]);
}

export async function resetAndSeedLocalData() {
  await ensureDatabase();
  const db = await databasePromise;

  const competencies = await db.getAllAsync<CompetencyRecord>('SELECT * FROM competencies ORDER BY competency_id ASC');
  const modules = await db.getAllAsync<ModuleRecord>('SELECT * FROM modules ORDER BY module_id ASC');
  const lessons = await db.getAllAsync<LessonRecord>('SELECT * FROM lessons ORDER BY lesson_id ASC');
  const lessonContents = await db.getAllAsync<LessonContentRecord>('SELECT * FROM lesson_content ORDER BY lesson_content_id ASC');

  const hasDefaultCompetencies = DEFAULT_COMPETENCIES.every((expected) =>
    competencies.some((c) => c.competency_name.toLowerCase() === expected.competency_name.toLowerCase())
  );
  const hasDefaultModules = DEFAULT_MODULES.every((expected) =>
    modules.some((m) => m.module_name.toLowerCase() === expected.module_name.toLowerCase())
  );
  const hasDefaultLessons = DEFAULT_LESSONS.every((expected) =>
    lessons.some((l) => l.lesson_name.toLowerCase() === expected.lesson_name.toLowerCase())
  );
  const hasDefaultLessonContents = DEFAULT_LESSON_CONTENTS.every((expected) =>
    lessonContents.some((lc) => lc.content_name.toLowerCase() === expected.content_name.toLowerCase())
  );

  if (hasDefaultCompetencies && hasDefaultModules && hasDefaultLessons && hasDefaultLessonContents && competencies.length > 0 && modules.length > 0 && lessons.length > 0 && lessonContents.length > 0) {
    return {
      competencies: competencies.length,
      modules: modules.length,
      lessons: lessons.length,
      lessonContents: lessonContents.length,
      alreadyImported: true,
    };
  }

  const now = new Date().toISOString();

  await db.runAsync('DELETE FROM lesson_content');
  await db.runAsync('DELETE FROM lessons');
  await db.runAsync('DELETE FROM modules');
  await db.runAsync('DELETE FROM competencies');
  try {
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'lesson_content'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'lessons'");
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

  for (let index = 0; index < DEFAULT_LESSONS.length; index += 1) {
    const lessonItem = DEFAULT_LESSONS[index];
    const lessonId = index + 1;

    await db.runAsync(
      `INSERT INTO lessons
        (lesson_id, module_id, lesson_name, order_number, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [lessonId, lessonItem.module_id, lessonItem.lesson_name, lessonItem.order_number, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_LESSON_CONTENTS.length; index += 1) {
    const contentItem = DEFAULT_LESSON_CONTENTS[index];
    const contentId = index + 1;

    await db.runAsync(
      `INSERT INTO lesson_content
        (lesson_content_id, lesson_id, content_name, objectives, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [contentId, contentItem.lesson_id, contentItem.content_name, contentItem.objectives, now, now]
    );
  }

  return {
    competencies: DEFAULT_COMPETENCIES.length,
    modules: DEFAULT_MODULES.length,
    lessons: DEFAULT_LESSONS.length,
    lessonContents: DEFAULT_LESSON_CONTENTS.length,
    alreadyImported: false,
  };
}
