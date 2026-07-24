const { createModule, listModules } = require('../src/models/moduleModel');

const SEED_MODULES = [
  {
    module_name: 'Raise Organic Chicken',
    competency_id: 1,
    description: 'Welcome to the Module on Raising Organic Chicken. This module contains training materials and activities for you to complete. The unit of competency on Raise Organic Chicken contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learing-materials/modules/Raising-chicken/raise-organic-chicken.pdf',
    thumbnail: 'assets/learing-materials/modules/Raising-chicken/raise.png',

  },
  {
    module_name: 'Produce Organic Vegetables',
    competency_id: 2,
    description: 'Welcome to the Module on Producing Organic Vegetables. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Vegetables contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learing-materials/modules/Produce-organic-vegetables/produce-organic-vegetables.pdf',
    thumbnail: 'assets/learing-materials/modules/Produce-organic-vegetables/vegetables.png',
  },
  {
    module_name: 'Produce Organic Fertilizer',
    competency_id: 3,
    description: 'Welcome to the Module on Producing Organic Fertilizer. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Fertilizer contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learing-materials/modules/Produce-organic-fertilizer/produce-organic-fertilizer.pdf',
    thumbnail: 'assets/learing-materials/modules/Produce-organic-fertilizer/fertilizer.jpg',
  },
  {
    module_name: 'Producing Organic Concoction and Extract',
    competency_id: 4,
    description: 'Welcome to the Module on Producing Organic Concoction and Extract. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Concoction and Extract contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learing-materials/modules/Produce-organic-concoction/produce-organic-concoction.pdf',
    thumbnail: 'assets/learing-materials/modules/Produce-organic-concoction/concoction.jpg',
  },
];

async function seedModules() {
  const existingModules = await listModules();
  const existingNames = new Set(existingModules.map((module) => module.module_name.toLowerCase()));

  let insertedCount = 0;
  for (const moduleInput of SEED_MODULES) {
    if (existingNames.has(moduleInput.module_name.toLowerCase())) {
      continue;
    }

    await createModule(moduleInput);
    insertedCount += 1;
  }

  console.log(`Seeded ${insertedCount} module record(s).`);
}

seedModules().catch((error) => {
  console.error('Failed to seed modules.', error);
  process.exitCode = 1;
});