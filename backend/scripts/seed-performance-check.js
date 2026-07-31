const { createPerformance } = require('../src/models/performanceCheckModel');
const { listPerformance } = require('../src/models/performanceCheckModel');

const SEED_PERFORMANCE_CHECK = [
    //m1; l1; c1
    {
        performance_id: 1,
        lesson_content_id: 1,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 2,
        lesson_content_id: 1,
        performance_question: 'Observe the physical appearance of chicken?',
        order: 2,
    },
    {
        performance_id: 3,
        lesson_content_id: 1,
        performance_question: 'Look for their differences?',
        order: 3,
    },
    {
        performance_id: 4,
        lesson_content_id: 1,
        performance_question: 'Identify, which is broiler, layer and dual purpose?',
        order: 4,
    },
    {
        performance_id: 5,
        lesson_content_id: 1,
        performance_question: 'Do housekeeping?',
        order: 5,
    },
    //m1; l1; c2
    {
        performance_id: 6,
        lesson_content_id: 2,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 7,
        lesson_content_id: 2,
        performance_question: 'Examine the chicks’ physical appearance?',
        order: 2,
    },
    {
        performance_id: 8,
        lesson_content_id: 2,
        performance_question: 'Describe its eyes, feathers beak and legs?',
        order: 3,
    },
    {
        performance_id: 9,
        lesson_content_id: 2,
        performance_question: 'Look for its uniformity?',
        order: 4,
    },
     {
        performance_id: 10,
        lesson_content_id: 2,
        performance_question: 'Identify if it’s healthy?',
        order: 5,
    },
    {
        performance_id: 11,
        lesson_content_id: 2,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m1; l2; c2
    {
        performance_id: 12,
        lesson_content_id: 7,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 13,
        lesson_content_id: 7,
        performance_question: 'Gather some bedding materials (rice hull, saw dust, coco coir and rice straw',
        order: 2,
    },
    {
        performance_id: 14,
        lesson_content_id: 7,
        performance_question: 'Choose one bedding material which is the best absorbent?',
        order: 3,
    },
    {
        performance_id: 15,
        lesson_content_id: 7,
        performance_question: 'Stored it in a warm and dry place?',
        order: 4,
    },
     {
        performance_id: 16,
        lesson_content_id: 7,
        performance_question: 'Spread it evenly in a poultry house',
        order: 5,
    },
    //m1; l2; c3
    {
        performance_id: 17,
        lesson_content_id: 8,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 18,
        lesson_content_id: 8,
        performance_question: 'Change the bedding materials with the new one?',
        order: 2,
    },
    {
        performance_id: 19,
        lesson_content_id: 8,
        performance_question: 'Wash and sanitize waterer and feeder?',
        order: 3,
    },
    {
        performance_id: 20,
        lesson_content_id: 8,
        performance_question: 'Pour some clean fresh water into the waterer?',
        order: 4,
    },
    {
        performance_id: 21,
        lesson_content_id: 8,
        performance_question: 'Put enough feeds into the feeder?',
        order: 5,
    },
    {
        performance_id: 22,
        lesson_content_id: 8,
        performance_question: 'Arrange them properly inside the brooding box?',
        order: 6,
    },
    {
        performance_id: 23,
        lesson_content_id: 8,
        performance_question: 'Bring chicks inside the brooder box?',
        order: 7,
    },
    {
        performance_id: 24,
        lesson_content_id: 8,
        performance_question: 'Do housekeeping?',
        order: 8,
    },
    //m1; l3; c2
    {
        performance_id: 25,
        lesson_content_id: 10,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 26,
        lesson_content_id: 10,
        performance_question: 'Measure the ingredients into a container',
        order: 2,
    },
    {
        performance_id: 27,
        lesson_content_id: 10,
        performance_question: 'Mix the ingredients until they are thoroughly combined?',
        order: 3,
    },
    {
        performance_id: 28,
        lesson_content_id: 10,
        performance_question: 'Give each chicken 0.28 pounds (0.13 kg) of feed per day?',
        order: 4,
    },
    {
        performance_id: 29,
        lesson_content_id: 10,
        performance_question: 'Store the chicken feed in a cool, dry place for up to 6 months?',
        order: 5,
    },
    {
        performance_id: 30,
        lesson_content_id: 10,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l1; c1
    {
        performance_id: 31,
        lesson_content_id: 19,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 32,
        lesson_content_id: 19,
        performance_question: 'Prepare the different kinds of seeds?',
        order: 2,
    },
    {
        performance_id: 33,
        lesson_content_id: 19,
        performance_question: 'Observe and examine its physical characteristics?',
        order: 3,
    },
    {
        performance_id: 34,
        lesson_content_id: 19,
        performance_question: 'Identify which seeds are viable?',
        order: 4,
    },
    {
        performance_id: 35,
        lesson_content_id: 19,
        performance_question: 'Do housekeeping?',
        order: 5,
    },
    //m2; l1; c2
    {
        performance_id: 36,
        lesson_content_id: 20,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 37,
        lesson_content_id: 20,
        performance_question: 'Gather tools and materials?',
        order: 2,
    },
    {
        performance_id: 38,
        lesson_content_id: 20,
        performance_question: 'Visit the field?',
        order: 3,
    },
    {
        performance_id: 39,
        lesson_content_id: 20,
        performance_question: 'Clearing the field?',
        order: 4,
    },
    {
        performance_id: 40,
        lesson_content_id: 20,
        performance_question: 'Perform ploughing?',
        order: 5,
    },
    {
        performance_id: 41,
        lesson_content_id: 20,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l1; c3
    {
        performance_id: 42,
        lesson_content_id: 21,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 43,
        lesson_content_id: 21,
        performance_question: 'Gather tools and materials?',
        order: 2,
    },
    {
        performance_id: 44,
        lesson_content_id: 21,
        performance_question: 'Check the seedlings, if there’s unhealthy one separate it immediately?',
        order: 3,
    },
    {
        performance_id: 45,
        lesson_content_id: 21,
        performance_question: 'Perform thinning the seedlings?',
        order: 4,
    },
    {
        performance_id: 46,
        lesson_content_id: 21,
        performance_question: 'Water the seedlings?',
        order: 5,
    },
    {
        performance_id: 47,
        lesson_content_id: 21,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l1; c4
    {
        performance_id: 48,
        lesson_content_id: 22,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 49,
        lesson_content_id: 22,
        performance_question: 'Gather tools and materials?',
        order: 2,
    },
    {
        performance_id: 50,
        lesson_content_id: 22,
        performance_question: 'Visit a farm?',
        order: 3,
    },
    {
        performance_id: 51,
        lesson_content_id: 22,
        performance_question: 'Gather all the available growing media?',
        order: 4,
    },
    {
        performance_id: 52,
        lesson_content_id: 22,
        performance_question: 'Mixing all the growing media?',
        order: 5,
    },
    {
        performance_id: 53,
        lesson_content_id: 22,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l2; c1
    {
        performance_id: 54,
        lesson_content_id: 23,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 55,
        lesson_content_id: 23,
        performance_question: 'Gather tools and materials?',
        order: 2,
    },
    {
        performance_id: 56,
        lesson_content_id: 23,
        performance_question: 'Visit a farm?',
        order: 3,
    },
    {
        performance_id: 57,
        lesson_content_id: 23,
        performance_question: 'Gather all the available growing media?',
        order: 4,
    },
    {
        performance_id: 58,
        lesson_content_id: 23,
        performance_question: 'Mixing all the growing media?',
        order: 5,
    },
    {
        performance_id: 59,
        lesson_content_id: 23,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l2; c3
    {
        performance_id: 60,
        lesson_content_id: 25,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 61,
        lesson_content_id: 25,
        performance_question: 'Prepare the tools and materials?',
        order: 2,
    },
    {
        performance_id: 62,
        lesson_content_id: 25,
        performance_question: 'Go to the Field?',
        order: 3,
    },
    {
        performance_id: 63,
        lesson_content_id: 25,
        performance_question: 'Measure the proper planting distance of vegetables?',
        order: 4,
    },
    {
        performance_id: 64,
        lesson_content_id: 25,
        performance_question: 'Make hole for seedling?',
        order: 5,
    },
    {
        performance_id: 65,
        lesson_content_id: 25,
        performance_question: 'Do transplanting of seedlings?',
        order: 6,
    },
    //m2; l2; c4
    {
        performance_id: 66,
        lesson_content_id: 26,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 67,
        lesson_content_id: 26,
        performance_question: 'Prepare the tools and materials?',
        order: 2,
    },
    {
        performance_id: 68,
        lesson_content_id: 26,
        performance_question: 'Go to the Field?',
        order: 3,
    },
    {
        performance_id: 69,
        lesson_content_id: 26,
        performance_question: 'Pitch water from water supply?',
        order: 4,
    },
    {
        performance_id: 70,
        lesson_content_id: 26,
        performance_question: 'Do watering on seedlings?',
        order: 5,
    },
    {
        performance_id: 71,
        lesson_content_id: 26,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l3; c1
    {
        performance_id: 72,
        lesson_content_id: 27,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 73,
        lesson_content_id: 27,
        performance_question: 'Gather the tools and materials?',
        order: 2,
    },
    {
        performance_id: 74,
        lesson_content_id: 27,
        performance_question: 'Go to the Field?',
        order: 3,
    },
    {
        performance_id: 75,
        lesson_content_id: 27,
        performance_question: 'Make canal along the fields?',
        order: 4,
    },
    {
        performance_id: 76,
        lesson_content_id: 27,
        performance_question: 'Install the hose?',
        order: 5,
    },
    {
        performance_id: 77,
        lesson_content_id: 27,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l3; c2
    {
        performance_id: 78,
        lesson_content_id: 28,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 79,
        lesson_content_id: 28,
        performance_question: 'Prepare botanical repellant',
        order: 2,
    },
    {
        performance_id: 80,
        lesson_content_id: 28,
        performance_question: 'Put some botanical repellant into a sprayer of water?',
        order: 3,
    },
    {
        performance_id: 81,
        lesson_content_id: 28,
        performance_question: 'Apply it into the filed?',
        order: 4,
    },
    {
        performance_id: 82,
        lesson_content_id: 28,
        performance_question: 'Do housekeeping?',
        order: 5,
    },
    //m2; l3; c3
    {
        performance_id: 83,
        lesson_content_id: 29,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 84,
        lesson_content_id: 29,
        performance_question: 'Identify missing hills?',
        order: 2,
    },
    {
        performance_id: 85,
        lesson_content_id: 29,
        performance_question: 'Prepare seedling to be used in replanting?',
        order: 3,
    },
    {
        performance_id: 86,
        lesson_content_id: 29,
        performance_question: 'Plant seed prepared seedlings on missing hills?',
        order: 4,
    },
    {
        performance_id: 87,
        lesson_content_id: 29,
        performance_question: 'Do housekeeping?',
        order: 5,
    },
    //m2; l3; c4
    {
        performance_id: 88,
        lesson_content_id: 30,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 89,
        lesson_content_id: 30,
        performance_question: 'Gather tools and materials?',
        order: 2,
    },
    {
        performance_id: 90,
        lesson_content_id: 30,
        performance_question: 'Going to your garden?',
        order: 3,
    },
    {
        performance_id: 91,
        lesson_content_id: 30,
        performance_question: 'Check your crops if it’s infested by pest and diseases?',
        order: 4,
    },
    {
        performance_id: 92,
        lesson_content_id: 30,
        performance_question: 'Do pruning?',
        order: 5,
    },
    {
        performance_id: 93,
        lesson_content_id: 30,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m2; l4; c2
    {
        performance_id: 88,
        lesson_content_id: 33,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 89,
        lesson_content_id: 33,
        performance_question: 'Gather tools and materials?',
        order: 2,
    },
    {
        performance_id: 90,
        lesson_content_id: 33,
        performance_question: 'Going to the field?',
        order: 3,
    },
    {
        performance_id: 91,
        lesson_content_id: 33,
        performance_question: 'Check the appropriate maturity index of your crops?',
        order: 4,
    },
    {
        performance_id: 92,
        lesson_content_id: 33,
        performance_question: 'Perform Harvesting?',
        order: 5,
    },
    {
        performance_id: 93,
        lesson_content_id: 33,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m3; l1; c1
    {
        performance_id: 94,
        lesson_content_id: 36,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 95,
        lesson_content_id: 33,
        performance_question: 'Observe the composting area?',
        order: 2,
    },
    {
        performance_id: 96,
        lesson_content_id: 33,
        performance_question: 'Select the area which is not sloppy?',
        order: 3,
    },
    {
        performance_id: 97,
        lesson_content_id: 33,
        performance_question: 'Do housekeeping?',
        order: 4,
    },
    //m3; l1; c2
    {
        performance_id: 98,
        lesson_content_id: 37,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 99,
        lesson_content_id: 37,
        performance_question: 'Determine good layout minimizes material handling and helps control outside factor?',
        order: 2,
    },
    {
        performance_id: 100,
        lesson_content_id: 37,
        performance_question: 'Barriers should be put in place to minimize contamination?',
        order: 3,
    },
    {
        performance_id: 101,
        lesson_content_id: 37,
        performance_question: 'Running a pump and sprinkler is a cost-effective way to bring moisture content back to optimal levels?',
        order: 4,
    },
    {
        performance_id: 102,
        lesson_content_id: 37,
        performance_question: 'Do housekeeping?',
        order: 5,
    },
    //m3; l1; c3
    {
        performance_id: 103,
        lesson_content_id: 38,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 104,
        lesson_content_id: 38,
        performance_question: 'Identify the raw materials',
        order: 2,
    },
    {
        performance_id: 105,
        lesson_content_id: 38,
        performance_question: 'Prepare bed for composting',
        order: 3,
    },
    {
        performance_id: 106,
        lesson_content_id: 38,
        performance_question: 'Check if the raw materials are mix',
        order: 4,
    },
    {
        performance_id: 107,
        lesson_content_id: 38,
        performance_question: 'Do housekeeping?',
        order: 5,
    },
    //m3; l1; c4
    {
        performance_id: 108,
        lesson_content_id: 39,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 109,
        lesson_content_id: 39,
        performance_question: 'Gather the “green and brown “materials?',
        order: 2,
    },
    {
        performance_id: 110,
        lesson_content_id: 39,
        performance_question: 'Put into the pile or compost pit?',
        order: 3,
    },
    {
        performance_id: 111,
        lesson_content_id: 39,
        performance_question: 'Poured water regularly?',
        order: 4,
    },
    {
        performance_id: 112,
        lesson_content_id: 39,
        performance_question: 'Mix the materials in pile using spading fork?',
        order: 5,
    },
    {
        performance_id: 113,
        lesson_content_id: 39,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m3; l1; c5
    {
        performance_id: 114,
        lesson_content_id: 40,
        performance_question: 'Wear the PPE?',
        order: 1,
    },
    {
        performance_id: 115,
        lesson_content_id: 40,
        performance_question: 'Identify the green and brown raw materials ',
        order: 2,
    },
    {
        performance_id: 116,
        lesson_content_id: 40,
        performance_question: 'utilize the manure animal manure ',
        order: 3,
    },
    {
        performance_id: 117,
        lesson_content_id: 40,
        performance_question: 'Do housekeeping?',
        order: 4,
    },
    //m3; l2; c1
    {
        performance_id: 118,
        lesson_content_id: 41,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 119,
        lesson_content_id: 41,
        performance_question: 'Identify the composting methods?',
        order: 2,
    },
    {
        performance_id: 120,
        lesson_content_id: 41,
        performance_question: 'Apply vermi in the composting area?',
        order: 3,
    },
    {
        performance_id: 121,
        lesson_content_id: 41,
        performance_question: 'Use sack to mulch?',
        order: 4,
    },
    {
        performance_id: 122,
        lesson_content_id: 41,
        performance_question: 'Do not allow the air enter the compost?',
        order: 5,
    },
    {
        performance_id: 123,
        lesson_content_id: 41,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m3; l2; c2
    {
        performance_id: 124,
        lesson_content_id: 42,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 125,
        lesson_content_id: 42,
        performance_question: 'Check the compost pile?',
        order: 2,
    },
    {
        performance_id: 126,
        lesson_content_id: 42,
        performance_question: 'Monitor the raw materials if undergo decomposition process?',
        order: 3,
    },
    {
        performance_id: 127,
        lesson_content_id: 42,
        performance_question: 'Use sack to mulch?',
        order: 4,
    },
    //m3; l2; c3
    {
        performance_id: 128,
        lesson_content_id: 43,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 129,
        lesson_content_id: 43,
        performance_question: 'Identify the good quality time to harvest?',
        order: 2,
    },
    {
        performance_id: 130,
        lesson_content_id: 43,
        performance_question: 'Select the compost ready to harvest?',
        order: 3,
    },
    {
        performance_id: 131,
        lesson_content_id: 43,
        performance_question: 'Collect the compost?',
        order: 4,
    },
    {
        performance_id: 132,
        lesson_content_id: 43,
        performance_question: 'Do housekeeping?',
        order: 5,
    },
    //m3; l2; c4
    {
        performance_id: 133,
        lesson_content_id: 44,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 134,
        lesson_content_id: 44,
        performance_question: 'Check the composting area?',
        order: 2,
    },
    {
        performance_id: 135,
        lesson_content_id: 44,
        performance_question: 'Collect the substrate?',
        order: 3,
    },
    {
        performance_id: 136,
        lesson_content_id: 44,
        performance_question: 'Put the substrate inside the pile?',
        order: 4,
    },
    {
        performance_id: 137,
        lesson_content_id: 44,
        performance_question: 'Check the microorganism attack the substrate?',
        order: 5,
    },
    {
        performance_id: 137,
        lesson_content_id: 44,
        performance_question: 'Monitor the pile regularly',
        order: 6,
    },
    {
        performance_id: 137,
        lesson_content_id: 44,
        performance_question: 'Do housekeeping?',
        order: 7,
    },
    //m3; l2; c5
    {
        performance_id: 138,
        lesson_content_id: 45,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 139,
        lesson_content_id: 45,
        performance_question: 'Prepare the logbook?',
        order: 2,
    },
    {
        performance_id: 140,
        lesson_content_id: 45,
        performance_question: 'Check the composting pile?',
        order: 3,
    },
    {
        performance_id: 141,
        lesson_content_id: 45,
        performance_question: 'Record the inputs',
        order: 4,
    },
    {
        performance_id: 142,
        lesson_content_id: 45,
        performance_question: 'Records the output of composting?',
        order: 5,
    },
    {
        performance_id: 143,
        lesson_content_id: 45,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m4; l1; c1
    {
        performance_id: 144,
        lesson_content_id: 46,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 145,
        lesson_content_id: 46,
        performance_question: 'Install fence around the storage area?',
        order: 2,
    },
    {
        performance_id: 146,
        lesson_content_id: 46,
        performance_question: 'Install security lighting and an alarm system?',
        order: 3,
    },
    {
        performance_id: 147,
        lesson_content_id: 46,
        performance_question: 'Keep pesticide containers properly?',
        order: 4,
    },
    {
        performance_id: 148,
        lesson_content_id: 46,
        performance_question: 'Store pesticides on metal shelves with a lip or on wood shelves covered with plastic?',
        order: 5,
    },
    {
        performance_id: 149,
        lesson_content_id: 46,
        performance_question: 'Keep the storage area neat and clean at all times?',
        order: 6,
    },
    {
        performance_id: 150,
        lesson_content_id: 46,
        performance_question: 'Do housekeeping?',
        order: 7,
    },
    //m4; l1; c2
    {
        performance_id: 144,
        lesson_content_id: 48,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 145,
        lesson_content_id: 48,
        performance_question: 'Identify the tools, materials and equipment?',
        order: 2,
    },
    {
        performance_id: 146,
        lesson_content_id: 48,
        performance_question: 'Check if they have damage?',
        order: 3,
    },
    {
        performance_id: 147,
        lesson_content_id: 48,
        performance_question: 'Clean all the materials, tools and equipment?',
        order: 4,
    },
    {
        performance_id: 148,
        lesson_content_id: 48,
        performance_question: 'Kept into the proper storage area?',
        order: 5,
    },
    {
        performance_id: 149,
        lesson_content_id: 48,
        performance_question: 'Put sign for identification?',
        order: 6,
    },
    {
        performance_id: 150,
        lesson_content_id: 48,
        performance_question: 'Do housekeeping?',
        order: 7,
    },
    //m4; l1; c3
    {
        performance_id: 151,
        lesson_content_id: 49,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 152,
        lesson_content_id: 49,
        performance_question: 'Check the tools, materials in proper area?',
        order: 2,
    },
    {
        performance_id: 153,
        lesson_content_id: 49,
        performance_question: 'Arrange all needed tools and equipment and raw materials to be used and properly label for easily identify?',
        order: 3,
    },
    {
        performance_id: 154,
        lesson_content_id: 49,
        performance_question: 'Keep or maintain the work area, tools, equipment and raw materials clean to avoid contamination results?',
        order: 4,
    },
    {
        performance_id: 155,
        lesson_content_id: 49,
        performance_question: 'Create consistent way that task and procedure are done?',
        order: 5,
    },
    {
        performance_id: 156,
        lesson_content_id: 49,
        performance_question: 'Make a habit of properly maintaining the correct procedure',
        order: 6,
    },
    {
        performance_id: 157,
        lesson_content_id: 49,
        performance_question: 'Do housekeeping?',
        order: 7,
    },
    //m4; l2; c1
    {
        performance_id: 158,
        lesson_content_id: 50,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 159,
        lesson_content_id: 50,
        performance_question: 'Collect all the raw materials?',
        order: 2,
    },
    {
        performance_id: 160,
        lesson_content_id: 50,
        performance_question: 'Eliminate the unnecessary and unwanted one?',
        order: 3,
    },
    {
        performance_id: 161,
        lesson_content_id: 50,
        performance_question: 'Make sure that all raw materials are clean?',
        order: 4,
    },
    {
        performance_id: 162,
        lesson_content_id: 50,
        performance_question: 'Check the raw materials are suited to the types of concoctions?',
        order: 5,
    },
    {
        performance_id: 163,
        lesson_content_id: 50,
        performance_question: 'Do housekeeping?',
        order: 6,
    },
    //m4; l2; c2
    {
        performance_id: 164,
        lesson_content_id: 51,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 165,
        lesson_content_id: 51,
        performance_question: 'Put the label in the fermented concoctions ',
        order: 2,
    },
    {
        performance_id: 166,
        lesson_content_id: 51,
        performance_question: 'Keep the concoction in the shaded are until undergone fermentation process',
        order: 3,
    },
    {
        performance_id: 167,
        lesson_content_id: 51,
        performance_question: 'Do housekeeping?',
        order: 4,
    },
    //m4; l2; c3
    {
        performance_id: 168,
        lesson_content_id: 52,
        performance_question: 'Wear PPE?',
        order: 1,
    },
    {
        performance_id: 169,
        lesson_content_id: 52,
        performance_question: 'Identify the types of concoctions?',
        order: 2,
    },
    {
        performance_id: 170,
        lesson_content_id: 52,
        performance_question: 'Determine the benefits and uses?',
        order: 3,
    },
    {
        performance_id: 171,
        lesson_content_id: 52,
        performance_question: 'Do housekeeping?',
        order: 4,
    },
    //m4; l2; c4
    {
        performance_id: 172,
        lesson_content_id: 53,
        performance_question: 'Do housekeeping?',
        order: 1,
    },
    {
        performance_id: 173,
        lesson_content_id: 53,
        performance_question: 'Identify the types of concoctions?',
        order: 2,
    },
    {
        performance_id: 174,
        lesson_content_id: 53,
        performance_question: 'Determine the benefits and uses?',
        order: 3,
    },
    {
        performance_id: 175,
        lesson_content_id: 53,
        performance_question: 'Do housekeeping?',
        order: 4,
    },
    //m4; l3; c1
    {
        performance_id: 176,
        lesson_content_id: 54,
        performance_question: 'Do housekeeping?',
        order: 1,
    },
    {
        performance_id: 177,
        lesson_content_id: 54,
        performance_question: 'Remove the label before cleaning the plastic bottle?',
        order: 2,
    },
    {
        performance_id: 178,
        lesson_content_id: 54,
        performance_question: 'Unscrew the tops and of a container of warm soapy water to avoid losing down the drain?',
        order: 3,
    },
    {
        performance_id: 179,
        lesson_content_id: 54,
        performance_question: 'Fill a large pot or sink with soap and hot water to fully submerge your bottles into the solution for a few minutes to kill any bacteria?',
        order: 4,
    },
    {
        performance_id: 180,
        lesson_content_id: 54,
        performance_question: 'Rinse the bottles and tops thoroughly. For the bottles, fill them with warm water from the tap until no soap residue is left over?',
        order: 5,
    },
    {
        performance_id: 181,
        lesson_content_id: 54,
        performance_question: 'Allow the bottles to dry overnight. Don’t refill the bottles too soon; they must be completely dry before refilling to avoid bacterial buildup',
        order: 6,
    },
    {
        performance_id: 182,
        lesson_content_id: 54,
        performance_question: 'Do housekeeping?',
        order: 7,
    },
    //m4; l3; c2
    {
        performance_id: 183,
        lesson_content_id: 55,
        performance_question: 'Prepare all the supplies and materials in labelling and tagging?',
        order: 1,
    },
    {
        performance_id: 184,
        lesson_content_id: 55,
        performance_question: 'Get your produce concoctions?',
        order: 2,
    },
    {
        performance_id: 185,
        lesson_content_id: 55,
        performance_question: 'Label the fermented products based on the required information?',
        order: 3,
    },
    {
        performance_id: 186,
        lesson_content_id: 55,
        performance_question: 'Submit your work to your trainer?',
        order: 4,
    },
    {
        performance_id: 187,
        lesson_content_id: 55,
        performance_question: 'Rinse the bottles and tops thoroughly. For the bottles, fill them with warm water from the tap until no soap residue is left over?',
        order: 5,
    },
    //m4; l3; c3
    {
        performance_id: 188,
        lesson_content_id: 56,
        performance_question: 'Prepare the various concoctions?',
        order: 1,
    },
    {
        performance_id: 189,
        lesson_content_id: 56,
        performance_question: 'Determine the right temperature inside the concoction area?',
        order: 2,
    },
    {
        performance_id: 190,
        lesson_content_id: 56,
        performance_question: 'Sealed bottles or other package prevents contamination during storage?',
        order: 3,
    },
    {
        performance_id: 191,
        lesson_content_id: 56,
        performance_question: 'Do housekeeping?',
        order: 4,
    },
];

async function seedPerformanceCheck() {
    const existingRecords = await listPerformance();
    const existingId = new Set(existingRecords.map((record) =>record.job_id));

    let insertedCount = 0;
    for (const jobInput of SEED_PERFORMANCE_CHECK) {
        if (existingId.has(jobInput.job_id)) {
            continue;
        }

        await createPerformance(jobInput);
        insertedCount += 1;
    }

    console.log(`Seeded ${insertedCount} performance checklist record(s).`);
}

seedLessonContents().catch((error) => {
    console.error('Failed to seed performance checklist.', error);
    process.exitCode = 1;
});
