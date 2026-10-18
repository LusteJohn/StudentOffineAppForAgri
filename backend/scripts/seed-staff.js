const { createStaff, createFaculty } = require('../src/services/staffService');

async function seedStaff() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@agrilearn.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const facultyEmail = process.env.SEED_FACULTY_EMAIL || 'faculty@agrilearn.local';
  const facultyPassword = process.env.SEED_FACULTY_PASSWORD || 'faculty123';

  try {
    await createStaff({
      username: 'admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin user seeded: ${adminEmail}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log(`Admin user already exists: ${adminEmail}`);
    } else {
      console.error('Error seeding admin user:', error instanceof Error ? error.message : error);
    }
  }

  try {
    await createFaculty({
      username: 'faculty',
      email: facultyEmail,
      password: facultyPassword,
    });
    console.log(`Faculty user seeded: ${facultyEmail}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log(`Faculty user already exists: ${facultyEmail}`);
    } else {
      console.error('Error seeding faculty user:', error instanceof Error ? error.message : error);
    }
  }
}

seedStaff().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
