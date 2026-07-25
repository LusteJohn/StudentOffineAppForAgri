const { createLessonContent } = require('../src/models/lessonContentModel');
const { listLessonContent } = require('../src/models/lessonContentModel');

const SEED_LESSON_CONTENT = [
    // Module 1: Raise Organic Chicken, Lesson 1, Content 1
    {
        lesson_content_id: 1,
        lesson_id: 1,
        content_name: 'Chicken breeds identification',
        objectives: 'After reading this information sheet, you should be able to identify chicken breeds.',
    },
    // Module 1: Raise Organic Chicken, Lesson 1, Content 2
    {
        lesson_content_id: 2,
        lesson_id: 1,
        content_name: 'Healthy chick’s selection indicators',
        objectives: 'After reading this information sheet, you should be able to select healthy chicks',
    },
    // Module 1: Raise Organic Chicken, Lesson 1, Content 3
    {
        lesson_content_id: 3,
        lesson_id: 1,
        content_name: 'Determining suitable site for chicken house',
        objectives: 'After reading this information sheet, you should be able to determine suitable site for chicken house',
    },
    // Module 1: Raise Organic Chicken, Lesson 1, Content 4
    {
        lesson_content_id: 4,
        lesson_id: 1,
        content_name: 'Chicken house design preparation',
        objectives: 'After reading this information sheet, you should be able to prepare design for chicken house.',
    },
    // Module 1: Raise Organic Chicken, Lesson 1, Content 5
    {
        lesson_content_id: 5,
        lesson_id: 1,
        content_name: 'House equipment installation design',
        objectives: 'After reading this information sheet, you should be able to identify chicken breeds.',
    },
    // Module 1: Raise Organic Chicken, Lesson 2, Content 1
    {
        lesson_content_id: 6,
        lesson_id: 2,
        content_name: 'House equipment installation',
        objectives: 'After reading this information sheet, you should be able to appreciate the importance of house equipment installation.',
    },
    // Module 1: Raise Organic Chicken, Lesson 2, Content 2
    {
        lesson_content_id: 7,
        lesson_id: 2,
        content_name: 'Preparing and securing bedding materials',
        objectives: 'After reading this information sheet, you should be able to prepare and secure bedding materials',
    },
    // Module 1: Raise Organic Chicken, Lesson 2, Content 3
    {
        lesson_content_id: 8,
        lesson_id: 2,
        content_name: 'Setting up brooding facility',
        objectives: 'After reading this information sheet, you should be able to set up brooding facility.',
    },
    // Module 1: Raise Organic Chicken, Lesson 3, Content 1
    {
        lesson_content_id: 9,
        lesson_id: 3,
        content_name: 'Feed materials selection',
        objectives: 'After reading this information sheet, you should be able to select materials for feeds',
    },
    // Module 1: Raise Organic Chicken, Lesson 3, Content 2
    {
        lesson_content_id: 10,
        lesson_id: 3,
        content_name: 'Feeding materials preparation',
        objectives: 'After reading this information sheet, you should be able to prepare feeding materials.',
    },
    // Module 1: Raise Organic Chicken, Lesson 3, Content 3
    {
        lesson_content_id: 11,
        lesson_id: 3,
        content_name: 'Feeding management program',
        objectives: 'After reading this information sheet, you should be able to differentiate different feeding program.',
    },
    // Module 1: Raise Organic Chicken, Lesson 3, Content 4
    {
        lesson_content_id: 12,
        lesson_id: 3,
        content_name: 'Monitoring feeding',
        objectives: 'After reading this information sheet, you should be able to monitor feeding.',
    },
    // Module 1: Raise Organic Chicken, Lesson 4, Content 1
    {
        lesson_content_id: 13,
        lesson_id: 4,
        content_name: 'Monitor growth rate',
        objectives: 'After reading this information sheet, you should be able to monitor growth rate of a broiler',
    },
    // Module 1: Raise Organic Chicken, Lesson 4, Content 2
    {
        lesson_content_id: 14,
        lesson_id: 4,
        content_name: 'Healthcare program implementation',
        objectives: 'After reading this information sheet, you should be able to appreciate healthcare program.',
    },
    // Module 1: Raise Organic Chicken, Lesson 4, Content 3
    {
        lesson_content_id: 15,
        lesson_id: 4,
        content_name: 'Sanitation and cleanliness program',
        objectives: 'After reading this information sheet, you should be able to appreciate the importance of sanitation and cleanliness program',
    },
    // Module 1: Raise Organic Chicken, Lesson 4, Content 4
    {
        lesson_content_id: 16,
        lesson_id: 4,
        content_name: 'Organic waste collection for fertilizer formulation',
        objectives: 'After reading this information sheet, you should be able to collect organic waste.',
    },
    // Module 1: Raise Organic Chicken, Lesson 4, Content 5
    {
        lesson_content_id: 17,
        lesson_id: 4,
        content_name: 'Suitable chicken for harvest selection',
        objectives: 'After reading this information sheet, you should be able to select Suitable chicken for harvest.',
    },
    // Module 1: Raise Organic Chicken, Lesson 4, Content 6
    {
        lesson_content_id: 18,
        lesson_id: 4,
        content_name: 'Production record',
        objectives: 'After reading this information sheet, you should be able to appreciate the importance of production record.',
    },
    // Module 2
    // Module 2: Produce Organic Vegetables, Lesson 1, Content 1
    {
        lesson_content_id: 19,
        lesson_id: 5,
        content_name: 'Selection of Seeds',
        objectives: 'After reading this information sheet, you should be able to select viable seeds.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 1, Content 2
    {
        lesson_content_id: 20,
        lesson_id: 5,
        content_name: 'Seedbed Preparation',
        objectives: 'After reading this information sheet, you should be able to prepare seedbed.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 1, Content 3
    {
        lesson_content_id: 21,
        lesson_id: 5,
        content_name: 'Maintaining Seedling',
        objectives: 'After reading this information sheet, you should be able to care and maintain seedlings.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 1, Content 4
    {
        lesson_content_id: 22,
        lesson_id: 5,
        content_name: 'Prepare Growing Media',
        objectives: 'After reading this information sheet, you should be able prepare the different growing media.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 2, Content 1
    {
        lesson_content_id: 23,
        lesson_id: 6,
        content_name: 'Land Preparation',
        objectives: 'After reading this information sheet, you should be able to perform land preparation.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 2, Content 2
    {
        lesson_content_id: 24,
        lesson_id: 6,
        content_name: 'Beneficial Microorganisms',
        objectives: 'After reading this information sheet, you should be able to identify the different types beneficial microorganism.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 2, Content 3
    {
        lesson_content_id: 25,
        lesson_id: 6,
        content_name: 'Planting/Transplanting Seedlings',
        objectives: 'After reading this information sheet, you should be able to plant/transplant vegetable seedlings.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 2, Content 4
    {
        lesson_content_id: 26,
        lesson_id: 6,
        content_name: 'Water Seedlings',
        objectives: 'After reading this information sheet, you should be able to water seedlings.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 3, Content 1
    {
        lesson_content_id: 27,
        lesson_id: 7,
        content_name: 'Water Management Implementation',
        objectives: 'After reading this information sheet, you should be able to appreciate the importance of proper water management.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 3, Content 2
    {
        lesson_content_id: 28,
        lesson_id: 7,
        content_name: 'Pest and Diseases Control Measures',
        objectives: 'After reading this information sheet, you should be able to apply control measures on pest and diseases.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 3, Content 3
    {
        lesson_content_id: 29,
        lesson_id: 7,
        content_name: 'Replanting Missing Hills',
        objectives: 'After reading this information sheet, you should be able to do replanting.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 3, Content 4
    {
        lesson_content_id: 30,
        lesson_id: 7,
        content_name: 'Plant Rationing (Rejuvenation)',
        objectives: 'After reading this information sheet, you should be able identify the number of sow to be served per boar.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 3, Content 5
    {
        lesson_content_id: 31,
        lesson_id: 7,
        content_name: 'Organic Fertilizers Application',
        objectives: 'After reading this information sheet, you should be able identify organic fertilizers.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 4, Content 1
    {
        lesson_content_id: 32,
        lesson_id: 8,
        content_name: 'Maturity Indices',
        objectives: 'After reading this information sheet, you should be able identify the maturity indices of fruits of vegetables.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 4, Content 2
    {
        lesson_content_id: 33,
        lesson_id: 8,
        content_name: 'Harvest Marketable Products',
        objectives: 'After reading this information sheet, you should be able to harvest marketable products.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 4, Content 3
    {
        lesson_content_id: 34,
        lesson_id: 8,
        content_name: 'Classify Marketable Products',
        objectives: 'After reading this information sheet, you should be able to classify marketable products.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 4, Content 4
    {
        lesson_content_id: 35,
        lesson_id: 8,
        content_name: 'Harvesting Tools and Materials',
        objectives: 'After reading this information sheet, you should be able identify the best tools for harvesting.',
    },
    // Module 3: Produce Organic Fertilizer, Lesson 1, Content 1
    {
        lesson_content_id: 36,
        lesson_id: 9,
        content_name: 'Site Selection',
        objectives: 'After reading this information sheet, you should be able to select composting site.',
    },
    {
        lesson_content_id: 37,
        lesson_id: 9,
        content_name: 'Prepare Site Layout',
        objectives: 'After reading this information sheet, you should be able to prepare composting site layout.',
    },
    {
        lesson_content_id: 38,
        lesson_id: 9,
        content_name: 'Prepare Bed',
        objectives: 'After reading this information sheet, you should be able to prepare bed for composting.',
    },
    {
        lesson_content_id: 39,
        lesson_id: 9,
        content_name: 'Gather Materials',
        objectives: 'After reading this information sheet, you should be able to gather the raw materials for composting.',
    },
    {
        lesson_content_id: 40,
        lesson_id: 9,
        content_name: 'Raw Materials',
        objectives: 'After reading this information sheet, you should be able to identify the raw materials uses for composting.',
    },
    // Module 3: Produce Organic Fertilizer, Lesson 2, Content 1
    {
        lesson_content_id: 41,
        lesson_id: 10,
        content_name: 'Composting Method',
        objectives: 'After reading this information sheet, you should be able to identify the different types of composting method.',
    },
    {
        lesson_content_id: 42,
        lesson_id: 10,
        content_name: 'Monitor Decomposition Process',
        objectives: 'After reading this information sheet, you should be able to monitor the decomposition process of organic fertilizer.',
    },
    {
        lesson_content_id: 43,
        lesson_id: 10,
        content_name: 'Harvest Quality',
        objectives: 'After reading this information sheet, you should be able to identify the quality of a good harvest.',
    },
    {
        lesson_content_id: 44,
        lesson_id: 10,
        content_name: 'Processing of Compost Fertilizer',
        objectives: 'After reading this information sheet, you should be able to identify processes of composting fertilizer.',
    },
    {
        lesson_content_id: 45,
        lesson_id: 10,
        content_name: 'Record Keeping',
        objectives: 'After reading this information sheet, you should be able to perform record keeping.',
    },
    // Module 4: Produce Organic Concoction and Extract, Lesson 1, Content 1
    {
        lesson_content_id: 46,
        lesson_id: 11,
        content_name: 'Storage Area',
        objectives: 'After reading this information sheet, you should be able to secure the Storage Areas.',
    },
    {
        lesson_content_id: 47,
        lesson_id: 11,
        content_name: 'Raw materials',
        objectives: 'After reading this information sheet, you should be able to determine the clean raw materials free from chemicals.',
    },
    {
        lesson_content_id: 48,
        lesson_id: 11,
        content_name: 'Tools, Materials and Equipment',
        objectives: 'After reading this information sheet, you should be able to identify the tools, materials and equipment.',
    },
    {
        lesson_content_id: 49,
        lesson_id: 11,
        content_name: 'Personal Hygiene',
        objectives: 'None',
    },
    // Module 4: Produce Organic Concoction and Extract, Lesson 2, Content 1
    {
        lesson_content_id: 50,
        lesson_id: 12,
        content_name: 'Prepare Raw Materials',
        objectives: 'After reading this information sheet, you should be able to prepare raw materials when producing organic concoction and extract.',
    },
    {
        lesson_content_id: 51,
        lesson_id: 12,
        content_name: 'Fermentation period',
        objectives: 'After reading this information sheet, you should be able to determine the period of fermentation process.',
    },
    {
        lesson_content_id: 52,
        lesson_id: 12,
        content_name: 'Various concoctions',
        objectives: 'After reading this information sheet, you should be able to identify various type of concoctions.',
    },
    {
        lesson_content_id: 53,
        lesson_id: 12,
        content_name: 'Period of harvest',
        objectives: 'After reading this information sheet, you should be able to identify harvesting time of concoction.',
    },
    // Module 4: Produce Organic Concoction and Extract, Lesson 3, Content 1
    {
        lesson_content_id: 54,
        lesson_id: 13,
        content_name: 'Sanitize bottles and containers',
        objectives: 'After reading this information sheet, you should be able to sanitize the bottles and containers for concoctions.',
    },
    {
        lesson_content_id: 55,
        lesson_id: 13,
        content_name: 'Package concoctions',
        objectives: 'After reading this information sheet, you should be able to appreciate the proper labeling and packaging of concoctions.',
    },
    {
        lesson_content_id: 56,
        lesson_id: 13,
        content_name: 'Appropriate place to store',
        objectives: 'After reading this information sheet, you should be able to determine the appropriate storage for the various concoctionss.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 4, Content 5
    {
        lesson_content_id: 57,
        lesson_id: 8,
        content_name: 'Post-harvest practices',
        objectives: 'After reading this information sheet, you should be able to learn harvesting practices.',
    },
    // Module 2: Produce Organic Vegetables, Lesson 4, Content 6
    {
        lesson_content_id: 58,
        lesson_id: 8,
        content_name: 'Record Keeping',
        objectives: 'After reading this information sheet, you should be able to learn record keeping of harvest.',
    },
];

async function seedLessonContents() {
    const existingRecords = await listLessonContent();
    const existingId = new Set(existingRecords.map((record) =>record.lesson_content_id));

    let insertedCount = 0;
    for (const contentInput of SEED_LESSON_CONTENT) {
        if (existingId.has(contentInput.lesson_content_id)) {
            continue;
        }

        await createLessonContent(contentInput);
        insertedCount += 1;
    }

    console.log(`Seeded ${insertedCount} lesson content record(s).`);
}

seedLessonContents().catch((error) => {
    console.error('Failed to seed lesson content.', error);
    process.exitCode = 1;
});