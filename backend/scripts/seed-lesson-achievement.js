const { createLesson, createLessonAchievement } = require('../src/models/studentLessonAchievementModel');
const { listLessons } = require('../src/models/studentLessonAchievementModel');

const SEED_LESSON_ACHIEVEMENT = [
    {
        lesson_achievement_id: 1,
        lesson_id: 1,
        name: 'Lesson 1 Master - Module 1',
        badge_image: 'assets/lesson_badges/badge_m1_l1.png',
    },
    {
        lesson_achievement_id: 2,
        lesson_id: 2,
        name: 'Lesson 2 Master - Module 1',
        badge_image: 'assets/lesson_badges/badge_m1_l2.png',
    },
    {
        lesson_achievement_id: 3,
        lesson_id: 3,
        name: 'Lesson 3 Master - Module 1',
        badge_image: 'assets/lesson_badges/badge_m1_l3.png',
    },
    {
        lesson_achievement_id: 4,
        lesson_id: 4,
        name: 'Lesson 4 Master - Module 1',
        badge_image: 'assets/lesson_badges/badge_m1_l4.png',
    },
    {
        lesson_achievement_id: 5,
        lesson_id: 5,
        name: 'Lesson 1 Master - Module 2',
        badge_image: 'assets/lesson_badges/badge_m2_l1.png',
    },
    {
        lesson_achievement_id: 6,
        lesson_id: 6,
        name: 'Lesson 2 Master - Module 2',
        badge_image: 'assets/lesson_badges/badge_m2_l2.png',
    },
    {
        lesson_achievement_id: 7,
        lesson_id: 7,
        name: 'Lesson 3 Master - Module 2',
        badge_image: 'assets/lesson_badges/badge_m2_l3.png',
    },
    {
        lesson_achievement_id: 8,
        lesson_id: 8,
        name: 'Lesson 4 Master - Module 2',
        badge_image: 'assets/lesson_badges/badge_m2_l4.png',
    },
    {
        lesson_achievement_id: 9,
        lesson_id: 9,
        name: 'Lesson 1 Master - Module 3',
        badge_image: 'assets/lesson_badges/badge_m3_l1.png',
    },
    {
        lesson_achievement_id: 10,
        lesson_id: 10,
        name: 'Lesson 2 Master - Module 3',
        badge_image: 'assets/lesson_badges/badge_m3_l2.png',
    },
    {
        lesson_achievement_id: 11,
        lesson_id: 11,
        name: 'Lesson 1 Master - Module 4',
        badge_image: 'assets/lesson_badges/badge_m4_l1.png',
    },
    {
        lesson_achievement_id: 12,
        lesson_id: 12,
        name: 'Lesson 2 Master - Module 4',
        badge_image: 'assets/lesson_badges/badge_m4_l2.png',
    },
    {
        lesson_achievement_id: 13,
        lesson_id: 13,
        name: 'Lesson 3 Master - Module 4',
        badge_image: 'assets/lesson_badges/badge_m4_l3.png',
    },
];

async function seedLessonAchievement() {
  const lessonAchievementInfo = await listLessons();
  const existingIds = new Set(lessonAchievementInfo.map((lessonAchievementInfo) => lessonAchievementInfo.lesson_achievement_id));

  let insertedCount = 0;
  for (const lessonAchievementInput of SEED_LESSONS) {
    if (existingIds.has(lessonAchievementInput.lesson_achievement_id)) {
      continue;
    }

    await createLessonAchievement(lessonAchievementInput);
    insertedCount += 1;
  }

  console.log(`Seeded ${insertedCount} lesson achievement record(s).`);
}

seedLessonAchievement().catch((error) => {
  console.error('Failed to seed lesson achievements.', error);
  process.exitCode = 1;
});