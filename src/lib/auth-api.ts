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

type StoredStudentUser = StudentUser & {
  password: string;
}

const DEFAULT_STUDENT_ACCOUNT: StoredStudentUser = {
  user_id: 1,
  username: 'student1',
  email: 'example@gmail.com',
  password: '12345',
  role: 'student',
  created_at: new Date().toISOString(),
};

const databasePromise = SQLite.openDatabaseAsync('student-offline-auth.db');
let initializationPromise: Promise<void> | null = null;

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
  if (!initializationPromise) {
    initializationPromise = (async () => {
      const db = await databasePromise;
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS users (
          user_id INTEGER PRIMARY KEY NOT NULL,
          username TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS student_info (
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
        );
      `);

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
    })();
  }

  await initializationPromise;
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
