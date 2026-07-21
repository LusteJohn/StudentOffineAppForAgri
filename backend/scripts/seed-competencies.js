const { createCompetency, listCompetencies } = require('../src/models/competencyModel');

const SEED_COMPETENCIES = [
  'Raise Organic Chicken',
  'Produce Organic Vegetables',
  'Produce Organic Fertilizer',
  'Produce Organic Concoction and Extract',
];

async function seedCompetencies() {
  const existingCompetencies = await listCompetencies();
  const existingNames = new Set(existingCompetencies.map((competency) => competency.competency_name));

  let insertedCount = 0;
  for (const competencyName of SEED_COMPETENCIES) {
    if (existingNames.has(competencyName)) {
      continue;
    }

    await createCompetency({
      competency_name: competencyName,
      sector: 'Agriculture, Forestry and Fishery',
      qualification: 'Organic Agriculture Production NC II',
      status: 'Active',
    });
    insertedCount += 1;
  }

  console.log(`Seeded ${insertedCount} competency record(s).`);
}

seedCompetencies().catch((error) => {
  console.error('Failed to seed competencies.', error);
  process.exitCode = 1;
});
