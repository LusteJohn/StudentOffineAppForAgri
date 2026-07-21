const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readUsers() {
  await ensureStore();
  const fileContent = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileContent || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function writeUsers(users) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return {
    user_id: safeUser.user_id,
    username: safeUser.username,
    email: safeUser.email,
    role: safeUser.role,
    created_at: safeUser.created_at,
  };
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || '').trim();
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    const [salt, hash] = String(storedHash || '').split(':');
    if (!salt || !hash) {
      resolve(false);
      return;
    }

    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      const hashBuffer = Buffer.from(hash, 'hex');
      const keyBuffer = Buffer.from(derivedKey);
      if (hashBuffer.length !== keyBuffer.length) {
        resolve(false);
        return;
      }

      resolve(crypto.timingSafeEqual(hashBuffer, keyBuffer));
    });
  });
}

async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  return users.find((user) => user.email === normalizedEmail) || null;
}

async function createStudentUser({ username, email, password }) {
  const users = await readUsers();
  const passwordHash = await hashPassword(password);
  const nextId = users.reduce((maxId, user) => Math.max(maxId, Number(user.user_id) || 0), 0) + 1;

  const record = {
    user_id: nextId,
    username: normalizeText(username),
    email: normalizeEmail(email),
    password_hash: passwordHash,
    role: 'student',
    created_at: new Date().toISOString(),
  };

  users.push(record);
  await writeUsers(users);

  return sanitizeUser(record);
}

async function authenticateStudent({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const passwordMatches = await verifyPassword(password, user.password_hash);
  if (!passwordMatches) {
    return null;
  }

  return sanitizeUser(user);
}

module.exports = {
  createStudentUser,
  authenticateStudent,
  findUserByEmail,
};
