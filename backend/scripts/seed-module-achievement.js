const { createModuleAchievement } = require('../src/models/studentModuleAchievementModel');
const { listModuleAchievement } = require('../src/models/studentModuleAchievementModel');

const SEED_MODULE_ACHIEVEMENT = [
    {
        module_achievement_id: 1,
        module_id: 1,
        name: 'Module 1 Master',
        badge_image: 'assets/module_badges/badge_m1.png',
    },
    {
        module_achievement_id: 2,
        module_id: 2,
        name: 'Module 2 Master',
        badge_image: 'assets/module_badges/badge_m2.png',
    },
    {
        module_achievement_id: 3,
        module_id: 3,
        name: 'Module 3 Master',
        badge_image: 'assets/module_badges/badge_m3.png',
    },
    {
        module_achievement_id: 4,
        module_id: 4,
        name: 'Module 4 Master',
        badge_image: 'assets/module_badges/badge_m4.png',
    },
    {
        module_achievement_id: 5,
        module_id: 'NULL',
        name: 'Module Master',
        badge_image: 'assets/module_badges/module_complete.png',
    },
];

async function seedModuleAchievement() {
  const moduleAchievementInfo = await listModuleAchievement();
  const existingIds = new Set(moduleAchievementInfo.map((moduleAchievementInfo) => moduleAchievementInfo.module_achievement_id));

  let insertedCount = 0;
  for (const moduleAchievementInput of SEED_MODULE_ACHIEVEMENT) {
    if (existingIds.has(moduleAchievementInput.module_achievement_id)) {
      continue;
    }

    await createModuleAchievement(moduleAchievementInput);
    insertedCount += 1;
  }

  console.log(`Seeded ${insertedCount} module achievement record(s).`);
}

seedModuleAchievement().catch((error) => {
  console.error('Failed to seed module achievement.', error);
  process.exitCode = 1;
});
