const { createLesson } = require('../src/models/lessonModel');
const { listLessons } = require('../src/models/lessonModel');

const SEED_LESSONS = [
    // Module 1: Raise Organic Chicken, Lesson 1
    {
        lesson_id: 1,
        module_id: 1,
        lesson_name: 'LO1:Select Healthy Stocks and Suitable Housing',
        order_number: 1,
    },
    // Module 1: Raise Organic Chicken, Lesson 2
    {
        lesson_id: 2,
        module_id: 1,
        lesson_name: 'LO2:Set-up Cage Equipment',
        order_number: 2,
    },
    // Module 1: Raise Organic Chicken, Lesson 3
    {
        lesson_id: 3,
        module_id: 1,
        lesson_name: 'LO3:Feed Chicken',
        order_number: 3, 
    },
    // Module 1: Raise Organic Chicken, Lesson 4
    {
        lesson_id: 4,
        module_id: 1,
        lesson_name: 'LO4:Grow and Harvest Chicken',
        order_number: 4, 
    },
    // Module 2: Produce Organic Vegetables, Lesson 1
    {
        lesson_id: 5,
        module_id: 2,
        lesson_name: 'LO1:Establish Nursery',
        order_number: 1, 
    },
    // Module 2: Produce Organic Vegetables, Lesson 2
    {
        lesson_id: 6,
        module_id: 2,
        lesson_name: 'LO2:Plant Seedlings',
        order_number: 2, 
    },
    // Module 2: Produce Organic Vegetables, Lesson 3
    {
        lesson_id: 7,
        module_id: 2,
        lesson_name: 'LO3:Perform Plant Care and Management',
        order_number: 3, 
    },
    // Module 2: Produce Organic Vegetables, Lesson 4
    {
        lesson_id: 8,
        module_id: 2,
        lesson_name: 'LO4:Perform Harvest and Post-Harvest Activities',
        order_number: 4, 
    },
    // Module 3: Produce Organic Fertilizer, Lesson 1
    {
        lesson_id: 9,
        module_id: 3,
        lesson_name: 'LO1:Prepare Composting Area and Raw Materials',
        order_number: 1, 
    },
    // Module 3: Produce Organic Fertilizer, Lesson 2
    {
        lesson_id: 10,
        module_id: 3,
        lesson_name: 'LO2:Compost and Harvest Fertilizer',
        order_number: 2, 
    },
    // Module 4: Produce Organic Concoction and Extract, Lesson 1
    {
        lesson_id: 11,
        module_id: 4,
        lesson_name: 'LO1:Prepare for the production of various concoctions',
        order_number: 1, 
    },
    // Module 4: Produce Organic Concoction and Extract, Lesson 2
    {
        lesson_id: 12,
        module_id: 4,
        lesson_name: 'LO2:Process concoctions',
        order_number: 2, 
    },
    // Module 4: Produce Organic Concoction and Extract, Lesson 3
    {
        lesson_id: 13,
        module_id: 4,
        lesson_name: 'LO3:Package concoctions',
        order_number: 3, 
    },
];

async function seedLessons() {
  const existingLessons = await listLessons();
  const existingIds = new Set(existingLessons.map((lesson) => lesson.lesson_id));

  let insertedCount = 0;
  for (const lessonInput of SEED_LESSONS) {
    if (existingIds.has(lessonInput.lesson_id)) {
      continue;
    }

    await createLesson(lessonInput);
    insertedCount += 1;
  }

  console.log(`Seeded ${insertedCount} lesson record(s).`);
}

seedLessons().catch((error) => {
  console.error('Failed to seed lessons.', error);
  process.exitCode = 1;
});