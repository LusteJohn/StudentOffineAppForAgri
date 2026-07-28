const { createQuestion } = require('../src/models/contentQuestionModel');
const { listQuestion } = require('../src/models/contentQuestionModel');

const SEED_QUESTION_CONTENT = [
    //M1; L1; C1
    {
        question_id: 1,
        lesson_content_id: 1,
        question: 'Which breed of chicken developed in California in the 1930s by James Dryden, a dual purpose hen crossed by a Barred Plymouth Rock rooster with a White Leghorn hen?',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 2,
        lesson_content_id: 1,
        question: 'Which breeds of chicken that are a large from an area spanning between Germany and the Netherlands, have good egg production  and an excellent forager in both free range and confined conditions?',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 3,
        lesson_content_id: 1,
        question: 'These are a dual-purpose breed, but are intended more for the table than for egg production. They prefer to free range and are known to be competitive with the rest of the flock',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 4,
        lesson_content_id: 1,
        question: 'What is the smallest bantams only weighing in at about 15 ounces and is considered as true Bantam breed?',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 5,
        lesson_content_id: 1,
        question: 'Which breed that are a great choice for beginner and are a hardy, dual purpose breed. They are very low maintenance, and can tolerate less than favorable conditions. Hens lay about 5 – 7 eggs per week.',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L1; C2
    {
        question_id: 6,
        lesson_content_id: 2,
        question: '1.	What are the different ways of spotting healthy chicks? Give at least 5.',
        question_type: 'enumeration', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    //M1; L1; C3
    {
        question_id: 7,
        lesson_content_id: 3,
        question: 'Avoid low-lying areas near streams with flooding potential.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 8,
        lesson_content_id: 3,
        question: 'In the free-range system, chickens are free to roam the farm in search of food. Eggs are laid outside in simple nests and are mainly used to maintain chicken numbers.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 9,
        lesson_content_id: 3,
        question: 'The topography will allow the long axis of the poultry house to be located in an east-west direction. This helps to minimize the amount of direct sunlight that would enter through the sidewalls of the houses.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 10,
        lesson_content_id: 3,
        question: 'The spread of infection by parasites in chicken feces can be prevented by using a raised night shelter with an open floor made of chicken-wire, wooden slats or bamboo sticks 5 cm apart.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 11,
        lesson_content_id: 3,
        question: 'In both the intensive and semi-intensive production systems, housing becomes very important for improving working conditions and minimizing risks.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L1; C4
    {
        question_id: 12,
        lesson_content_id: 4,
        question: 'Poorly design chicken coop can expose your poultry flock to weather extremes, lead to overstocking which leads to antisocial behavior and greater stress of your birds, and expose your flock to predators.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 13,
        lesson_content_id: 4,
        question: 'Some predators will try to burrow their way to reach your flock.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 14,
        lesson_content_id: 4,
        question: 'If you have a chicken run that has been fenced with barbed wire, ensure that there are no holes beneath the wire mesh fencing.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 15,
        lesson_content_id: 4,
        question: 'When designing chicken house keep the design simple and easily cleanable.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 16,
        lesson_content_id: 4,
        question: 'In order to encourage egg laying by your hens, it is advisable to provide one nest box for every 4 or 5 chickens.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L2; C1
    {
        question_id: 17,
        lesson_content_id: 6,
        question: 'The poultry house should be equipped with roasts, nests, feed hoppers, water containers and any other items which is essential for satisfactory production.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 18,
        lesson_content_id: 6,
        question: 'Perches help materially to keep the bird’s feet and plumage clean.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 19,
        lesson_content_id: 6,
        question: 'An ample supply of water should be made available at all times or egg production is liable to be affected.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 20,
        lesson_content_id: 6,
        question: 'The water container should contain clean water, kept cool in dry seasons and be easily cleaned because contaminated water tends to spread certain diseases from chicken to chicken.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 21,
        lesson_content_id: 6,
        question: 'Nest is provided with a trap door so that when the poultry attendant releases the hen from the nest, he/she can identify her and mark her leg-band number on the egg.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L2; C2
    {
        question_id: 22,
        lesson_content_id: 7,
        question: 'What absorbs moisture, but takes too long to release it again – resulting in the litter becoming very wet?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 23,
        lesson_content_id: 7,
        question: 'What is either be a farmer’s best friend or worst enemy?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 24,
        lesson_content_id: 7,
        question: 'Which has a huge impact on poultry health and comfort?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 25,
        lesson_content_id: 7,
        question: 'What should be free from harmful toxins and contaminants?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 26,
        lesson_content_id: 7,
        question: 'What should be stored properly before it is spread in the broiler house, to avoid wet-litter problems?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L2; C3
    {
        question_id: 27,
        lesson_content_id: 8,
        question: 'A quality brooder can meet the additional needs of your hatchlings, optimize their growth and ensure good health.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 28,
        lesson_content_id: 8,
        question: 'Common choices for brooding containers are cardboard, wood and plastic.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 29,
        lesson_content_id: 8,
        question: 'There are only two processes involves in cleaning brooder box which includes washing and sanitizing.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 30,
        lesson_content_id: 8,
        question: 'Temperature is one of the most important elements that can affect chick health.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 31,
        lesson_content_id: 8,
        question: 'When constructing your feeder the most important thing to consider is ease of access.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L3; C1
    {
        question_id: 32,
        lesson_content_id: 9,
        question: 'In an organic system, the chicken feed must come from organic sources.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 33,
        lesson_content_id: 9,
        question: 'If part of the feed could be substituted with root crops such as cassava, then part of the maize ration could be freed for human consumption.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 34,
        lesson_content_id: 9,
        question: 'The chicken’s nutrition should include vitamins, mineral, proteins, amino acids, fatty acids, fiber and energy sources.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 35,
        lesson_content_id: 9,
        question: 'Eggshells and oyster shells may be used as a calcium supplement for egg laying chicken.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 36,
        lesson_content_id: 9,
        question: 'Organic chickens have a balanced nutrition based on organic feed, they live in clean housings that provide enough space for movement, have outdoor access and are never treated with antibiotics.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L3; C2
    {
        question_id: 37,
        lesson_content_id: 10,
        question: 'Making your own chicken feed is a great way to save money.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 38,
        lesson_content_id: 10,
        question: 'If you want to feed your chickens organically, use organic ingredients in these recipes.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 39,
        lesson_content_id: 10,
        question: 'The ingredients for laying hen feeds are different from the broiler feeds.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 40,
        lesson_content_id: 10,
        question: 'Store the chicken feed in a covered container for up to 6 months.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 41,
        lesson_content_id: 10,
        question: 'Garages or barns are ideal places to store chicken feed. Check the feed for mice, bugs, and mould before you give it to the chickens.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L3; C3
    {
        question_id: 42,
        lesson_content_id: 11,
        question: 'Chickens are also foragers by nature, so they will happily spend the entire day pecking around for something to eat.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 43,
        lesson_content_id: 11,
        question: 'Chickens enjoy small, frequent meals as opposed to large meals once a day.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 44,
        lesson_content_id: 11,
        question: 'Chickens also need adequate calcium for egg production, and this can be achieved by feeding them dried eggshells that have been crushed or ground into powder.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 45,
        lesson_content_id: 11,
        question: 'Ad libitum feeding means that the diet is available at all times.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 46,
        lesson_content_id: 11,
        question: 'Restricted feeding refers to restricting the amount of food while still ensuring nutritional adequacy.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L3; C4
    {
        question_id: 47,
        lesson_content_id: 12,
        question: 'If you have a chicken that isn’t eating, you can offer things like a mush of commercial feed mixed with warm milk or water.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 48,
        lesson_content_id: 12,
        question: 'Sometimes, all your chicken need is to be handfed for a little while.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 49,
        lesson_content_id: 12,
        question: 'All the poultry activities like filling the water tank, monitoring temperature, time to time feeding of chicken, cleaning the chicken waste and light control in the farm are done manually.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 50,
        lesson_content_id: 12,
        question: 'If your chicken continues to refuse to eat or if you have multiple chickens who are suddenly showing inappetence, you should contact your veterinarian immediately.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 51,
        lesson_content_id: 12,
        question: 'Chicken are prone to lot of diseases which might be a hindrance in the business.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L4; C1
    {
        question_id: 52,
        lesson_content_id: 13,
        question: 'What is an important parameter when growing broilers?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 53,
        lesson_content_id: 13,
        question: 'Which chicken type has the genetic potential for significant weight gain over a very short period of time?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 54,
        lesson_content_id: 13,
        question: 'What can only  confirm how effective different management practices are?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 55,
        lesson_content_id: 13,
        question: 'What can be taken in growing birds only?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 56,
        lesson_content_id: 13,
        question: 'Which  means  average gain in body weight  for prescribed period?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L4; C2
    {
        question_id: 57,
        lesson_content_id: 14,
        question: 'The best fed and housed stock with the best genetic potential will not grow and produce efficiently if they become diseased or infested with parasites.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 58,
        lesson_content_id: 14,
        question: 'Infectious disease causing agents will spread through a flock very quickly.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 59,
        lesson_content_id: 14,
        question: 'Direct transmission occurs when one diseased bird passes the cause of the disease via direct contact to a susceptible healthy bird.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 60,
        lesson_content_id: 14,
        question: 'Indirect transmission occurs when the causal organism is passed from one bird to another via an intermediate host such as insects, earthworms, snails or slugs, wild birds or animals or some other object such as equipment, food or water, vehicles, people, respiratory droplets, litter or faeces.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 61,
        lesson_content_id: 14,
        question: 'Diseases that result from nutrient deficiencies, consumption of toxic substances and physical damage are referred to as non-infectious diseases.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L4; C3
    {
        question_id: 62,
        lesson_content_id: 15,
        question: 'Microbial contamination can be prevented and controlled using proper management practices and modern health products.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 63,
        lesson_content_id: 15,
        question: 'Sterilization - Destroying all infective and reproductive forms of all microorganisms (bacteria, fungi).',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 64,
        lesson_content_id: 15,
        question: 'Proper cleaning removes most germs and is always done before using disinfectants.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 65,
        lesson_content_id: 15,
        question: 'The most important thing to remember when striving for a sanitized environment is that cleanliness is essential.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 66,
        lesson_content_id: 15,
        question: 'Focus on selecting the proper detergent to produce the cleanest environment possible with variations in water hardness, salinity, and pH. A thorough rinsing with enough clean, sanitized water completes the cleaning process and removes most lingering residues of detergents, organic matter, or microbial germs.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L4; C4
    {
        question_id: 67,
        lesson_content_id: 16,
        question: 'Organic waste, or biodegradable waste, is a natural refuse type that comes from plants or animals.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 68,
        lesson_content_id: 16,
        question: 'Cage layer waste – Excreta collected under the cages, spilled feed and feathers.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 69,
        lesson_content_id: 16,
        question: 'Composting reduce and transform organic waste into a useful end product called “compost".',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 70,
        lesson_content_id: 16,
        question: 'Freezing reduces or eliminate pollution and improve conditions on the farm.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 71,
        lesson_content_id: 16,
        question: 'Pit disposal is effective and convenient method for disposal of dead birds.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L4; C5
    {
        question_id: 72,
        lesson_content_id: 17,
        question: 'When your chickens have reached harvest size, plan a day to harvest them.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 73,
        lesson_content_id: 17,
        question: 'Remove feed from the chicken’s coop the evening before you plan on harvesting them.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 74,
        lesson_content_id: 17,
        question: 'A full crop makes the cleaning portion of harvesting more difficult.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 75,
        lesson_content_id: 17,
        question: 'A full crop makes the cleaning portion of harvesting more difficult.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 76,
        lesson_content_id: 17,
        question: 'When all of the feathers are removed, you can cut off the head and feet.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M1; L4; C6
    {
        question_id: 77,
        lesson_content_id: 18,
        question: 'Records usually show the weaknesses as well as strengths of your agribusiness.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 78,
        lesson_content_id: 18,
        question: 'Management records usually include data that is related to management issues.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 79,
        lesson_content_id: 18,
        question: 'Production records are vital in assessing productivity. For example, in broilers, the daily or weekly weight gain indicates productivity.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 80,
        lesson_content_id: 18,
        question: 'A record will help you identify mistakes that can be avoided in the future.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 81,
        lesson_content_id: 18,
        question: 'Records will help you study the production performance and check whether it meets the prescribed standards.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L1; C1
    {
        question_id: 82,
        lesson_content_id: 19,
        question: 'What is the cleanliness of seed from other seeds, debris, inert matter, diseased seed and insect damaged seed?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 83,
        lesson_content_id: 19,
        question: 'What is the actual expression of seed in further generation / multiplication?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 84,
        lesson_content_id: 19,
        question: 'What is a basic input in agriculture?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 85,
        lesson_content_id: 19,
        question: 'What is the true to type nature of the seed. i.e., the seedling / plant / tree from the seed should resemble its mother in all aspects?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 86,
        lesson_content_id: 19,
        question: 'What is the possession of seed with required genetic and physical purity that is accompanied with physiological soundness and health status?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L1; C2
    {
        question_id: 87,
        lesson_content_id: 20,
        question: 'What is the first operation in seedbed preparation?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 88,
        lesson_content_id: 20,
        question: 'What is an important step that can optimize seed germination and survival rate?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 89,
        lesson_content_id: 20,
        question: 'What is a term used to describe the work done by a heavy duty cultivator with special spring or fixed tines; unlike the ordinary plough, it does not move or invert all the soil?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 90,    
        lesson_content_id: 20,
        question: 'What is the local soil environment in which seeds are planted?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 91,
        lesson_content_id: 20,
        question: 'What ploughs are sometimes used for potatoes and some root crops in the wetter areas?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L1; C3
    {
        question_id: 92,
        lesson_content_id: 21,
        question: 'Don’t use clean, sterilized containers.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    }, 
    {
        question_id: 93,
        lesson_content_id: 21,
        question: 'Do thin seedlings to increase air circulation.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    }, 
    {
        question_id: 94,
        lesson_content_id: 21,
        question: 'Seedlings should be watered once a day.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    }, 
    {
        question_id: 95,
        lesson_content_id: 21,
        question: 'The seedling does not need a lot of extra nutrients in it is first few days of life.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    }, 
    {
        question_id: 96,
        lesson_content_id: 21,
        question: 'Damping Off disease thrives in cool or cold, dark or cloudy, wet or damp conditions.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    }, 
    //m2; l1; c4
    {
        question_id: 97,
        lesson_content_id: 22,
        question: 'What is a basic component of soil, ranges in particle size from 0.05mm to 2.0mm in diameter?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    }, 
    {
        question_id: 98,
        lesson_content_id: 22,
        question: 'What is a siliceous mineral of volcanic?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    }, 
    {
        question_id: 99,
        lesson_content_id: 22,
        question: 'What is a micaceous mineral produced by heating to approximately 745oC?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 100,
        lesson_content_id: 22,
        question: 'What is a waste bi-product of the sugar industry. It may be shredded and/or composted to produce a material which can increase the aeration and drainage properties of container media?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 101,
        lesson_content_id: 22,
        question: 'What is the dehydrated remains of acid-bog plants from the genus Sphagnum (i.e. Spapillosum)?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L2; C1
    {
        question_id: 102,
        lesson_content_id: 23,
        question: 'What is otherwise referred to as traditional tillage process?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 103,
        lesson_content_id: 23,
        question: 'What is the sequence of operations traditionally or most generally used given geographic area to produce a given crop?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 104,
        lesson_content_id: 23,
        question: 'It is otherwise called no tillage?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 105,
        lesson_content_id: 23,
        question: 'It is used for any system that leaves the soil surface more or less free of residue.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 106,
        lesson_content_id: 23,
        question: 'What is an important and the main tool for conservation of the land. As per definition, its primary function is to provide a favorable soil environment for the plant growth which is indirectly related to soil conservation?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L2; C2
    {
        question_id: 107,
        lesson_content_id: 24,
        question: 'What are the microscopic worms that live around or inside the plant?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 108,
        lesson_content_id: 24,
        question: 'What are the larger microbes that love to consume and be surrounded by bacteria?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 109,
        lesson_content_id: 24,
        question: 'What is a soil embedded with organic matter and soil microbes that work together to hold onto nutrients in the soil and convert nutrients locked in the soil?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 110,
        lesson_content_id: 24,
        question: 'What fungus that facilitate water and nutrient uptake by the roots and plants to provide sugars, amino acids and other nutrients?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 111,
        lesson_content_id: 24,
        question: 'How many percent of fertilizer we apply actually goes to the plant?',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L2; C3
    {
        question_id: 112,
        lesson_content_id: 25,
        question: 'Seedlings should be hardened-off, well-fed and watered before transplanting.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 113,
        lesson_content_id: 25,
        question: 'Prepare a weed-free surface. Loosen and aerate garden soil by tilling or hoeing.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 114,
        lesson_content_id: 25,
        question: 'Dig a hole large enough for seedling.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 115,
        lesson_content_id: 25,
        question: 'Carefully remove seedling from its container. Try not to disturb the roots.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 116,
        lesson_content_id: 25,
        question: 'Water seedling thoroughly.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L2; C4
    {
        question_id: 117,
        lesson_content_id: 26,
        question: 'Water is one of the vital elements when starting plants from seed.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 118,
        lesson_content_id: 26,
        question: 'Too much water and your seeds will drown or rot.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 119,
        lesson_content_id: 26,
        question: 'Fill small sections of a seed starting tray with a soil mixture and plant the seeds into the mixture about 1 inch deep.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 120,
        lesson_content_id: 26,
        question: 'There are a number of good reasons to start seeds early indoors.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 121,
        lesson_content_id: 26,
        question: 'Make sure that excess water has a way to drain away from the seeds.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L3; C1
    {
        question_id: 122,
        lesson_content_id: 27,
        question: 'The main objectives for irrigation management or irrigation, in general, is to promote the proper growth of plants and maintaining the right levels of moisture for the soil.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 123,
        lesson_content_id: 27,
        question: 'Irrigation water management is the act of timing and regulating irrigation water application in a way that will satisfy the water requirement of the crop without wasting water, energy, and plant nutrients or degrading the soil resource.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 124,
        lesson_content_id: 27,
        question: 'Water irrigation management involves the monitoring of water application for crops or yard.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 125,
        lesson_content_id: 27,
        question: 'Drip irrigation is one of the most efficient types of irrigation systems due to their percentages of applied and lost water ratings in conjunction with meeting crop water need falling between 80-90%.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 126,
        lesson_content_id: 27,
        question: 'Irrigation management is essential for gardeners or farmers in order to promote plant growth.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
     //M2; L3; C2
    {
        question_id: 127,
        lesson_content_id: 28,
        question: 'Rotate crops to reduce the buildup of weeds, disease, and insect pests. Crop rotation is useful for those pests that do not move far from their overwintering sites.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 128,
        lesson_content_id: 28,
        question: 'Remove overwintering sites, such as cull piles, damaged, and volunteer plants, and alternate hosts, to minimize damage by insects and diseases.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 129,
        lesson_content_id: 28,
        question: 'Use pesticides only when monitoring, economic thresholds, or disease forecasts indicate a need and with the appropriate timing, on target, and at the lowest effective rate.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 130,
        lesson_content_id: 28,
        question: 'Arrange fields for the best air drainage and circulation to promote low humidity.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 131,
        lesson_content_id: 28,
        question: 'One of the major goals of IPM is to minimize reliance on pesticides.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L3; C3
    {
        question_id: 132,
        lesson_content_id: 29,
        question: 'Replanting when crop damage and stand reduction occurs early in the growing season can be an economically viable option.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 133,
        lesson_content_id: 29,
        question: 'Evaluating crop injury and estimating potential crop yield is the first step in determining if a crop should be replanted.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 134,
        lesson_content_id: 29,
        question: 'Excessive moisture, poorly drained soils and other factors frequently delay planting beyond the optimum period for yield.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 135,
        lesson_content_id: 29,
        question: 'The decision to replant ultimately must be made by comparing the estimated yield of the injured crop with that of a replanted crop.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 136,
        lesson_content_id: 29,
        question: 'The final decision on replanting should be based on sound agronomic and economic information.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L3; C4
    {
        question_id: 137,
        lesson_content_id: 30,
        question: 'Plant Rejuvenation means restoring vitality and freshness of plants.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 138,
        lesson_content_id: 30,
        question: 'Pruning is very powerful technique of rejuvenating the plants.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 139,
        lesson_content_id: 30,
        question: 'Rejuvenation is attempted to make the plant new.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 140,
        lesson_content_id: 30,
        question: 'Lower the pruning more vigorous is the sprouting.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 141,
        lesson_content_id: 30,
        question: 'While pruning every attempt is made to remove dead, damaged, diseased and inter lacerating branches.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L3; C5
    {
        question_id: 142,
        lesson_content_id: 31,
        question: 'Organic fertilizers are an essential source for plant nutrients and a soil conditioner in agriculture.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 143,
        lesson_content_id: 31,
        question: 'The use of antibiotics by humans and in animal feeds will also end up in the organic fertilizers.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 144,
        lesson_content_id: 31,
        question: 'Exposure of microorganisms to sub lethal concentration of antibiotics in the organic products induces antibiotic resistance.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 145,
        lesson_content_id: 31,
        question: 'The possibilities of recycling food-borne pathogens via agricultural crops to the final end consumers of the crops will additionally be discussed.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 146,
        lesson_content_id: 31,
        question: 'The potential health intricacies linked with organic fertilizers relate to their origin, their treatment and human exposure within a system perspective from origin to use, including products like crop type.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L4; C1
    {
        question_id: 147,
        lesson_content_id: 32,
        question: 'Skin color changes as fruit ripens or mature.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 148,
        lesson_content_id: 32,
        question: 'Changes in the size of a crop while growing are frequently used to determine the time of harvest.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 149,
        lesson_content_id: 32,
        question: 'The shape of fruit can change during maturation and can be used as a characteristic to determine harvest maturity.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 150,
        lesson_content_id: 32,
        question: 'Most fruits synthesize volatile chemicals as they ripen. Such chemicals give fruit its characteristic odor and can be used to determine whether it is ripe or not.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 151,
        lesson_content_id: 32,
        question: 'Maturity Indices – are the sign or indication the readiness of the commodity for harvesting.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L4; C2
    {
        question_id: 152,
        lesson_content_id: 33,
        question: 'Harvest when fruit is the desirable size and/or color, and when the flesh is firm but ripe.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 153,
        lesson_content_id: 33,
        question: 'Early morning is the best time to harvest most greens, since that is the coolest time of day.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 154,
        lesson_content_id: 33,
        question: 'Use scissors or clippers to cut the stems of eggplant, peppers, and squash just above the fruit.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 155,
        lesson_content_id: 33,
        question: 'Pick cabbage when the heads are fully formed and firm. Each head should weigh at least one pound. Time of Day to Harvest.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 156,
        lesson_content_id: 33,
        question: 'Keep fingernails trimmed when harvesting squash to avoid punctures.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L4; C3
    {
        question_id: 157,
        lesson_content_id: 34,
        question: 'Containers used for harvesting should be suitable and clean before use.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 158,
        lesson_content_id: 34,
        question: 'Appropriate maturity indices should be the bases in determining the harvest time.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 159,
        lesson_content_id: 34,
        question: 'Appropriate harvesting technique should be employed in harvesting to optimize the quality and other desired characteristics of produce during harvest or postharvest phases.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 160,
        lesson_content_id: 34,
        question: 'Fresh fruits and vegetables that are unfit for human consumption should be segregated during harvesting.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 161,
        lesson_content_id: 34,
        question: 'Harvested produce should not be placed in direct contact with the soil or floor in the handling, packing or storage areas.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //M2; L4; C4
    {
        question_id: 162,
        lesson_content_id: 35,
        question: 'Having the right set of tools sometimes makes the difference between an enjoyable interlude in the garden or orchard and sweaty hours of backbreaking labor.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 163,
        lesson_content_id: 35,
        question: 'The proper tools make bringing in the harvest easier, faster and simply more fun.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 164,
        lesson_content_id: 35,
        question: 'Carts with pneumatic tires generally push easiest.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 165,
        lesson_content_id: 35,
        question: 'Flat-free carts solid tires are better for jobs like harvesting walnuts in the woods.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 166,
        lesson_content_id: 35,
        question: 'Combination wood and metal carts require indoor storage; metal or plastics usually weather well.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m2; l4; c5
    {
        question_id: 167,
        lesson_content_id: 57,
        question: '1.	Postharvest handling is the stage of crop production immediately following harvest, including cooling, cleaning, sorting and packing.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    {
        question_id: 168,
        lesson_content_id: 57,
        question: 'The most important goals of post-harvest handling are keeping the product cool, to avoid moisture loss and slow down undesirable chemical changes, and avoiding physical damage such as bruising, to delay spoilage.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 169,
        lesson_content_id: 57,
        question: 'Post-harvest physiology is the scientific study of the physiology of living plant tissues after picking.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 170,
        lesson_content_id: 57,
        question: 'Packaging means the wrapping or bottling of products to make them safe from damages during transportation and storage.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 171,
        lesson_content_id: 57,
        question: 'By removing damaged produce from the healthy ones, it reduces losses by preventing secondary contamination.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m2; l4, c6
    {
        question_id: 172,
        lesson_content_id: 58,
        question: 'Financial records, those that relate to the production of the products and sales records.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 173,
        lesson_content_id: 58,
        question: 'Keeping records is an investment of time and money and the benefits must outweigh the costs.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 174,
        lesson_content_id: 58,
        question: 'Records that are kept by storekeepers show which products and materials are transferred into and out of the store-rooms.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 175,
        lesson_content_id: 58,
        question: 'The Profit and Loss Account describes how money comes into and leaves a business over a month (or other suitable period of time.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 176,
        lesson_content_id: 58,
        question: 'The main reasons for production records are to ensure that quality assurance procedures are in place and operating satisfactorily and to record the use of ingredients and amounts of stock for use in financial accounting.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l1; c1
    {
        question_id: 177,
        lesson_content_id: 36,
        question: 'Wind direction and proximity to neighbors should be considered when locating a composting facility.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 178,
        lesson_content_id: 36,
        question: 'Avoid locating composting facilities on steep slopes where runoff may be a problem.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 179,
        lesson_content_id: 36,
        question: 'A roofed compost facility, that is properly managed, should not generate leachate that could contaminate ground water.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 180,
        lesson_content_id: 36,
        question: 'Requirements for each composting method vary. The windrow method requires the most land area.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 181,
        lesson_content_id: 36,
        question: 'Reduce the initial capital cost, existing roofed, concrete, paved, or gravel areas should be use.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m2; l1; c2
    {
        question_id: 182,
        lesson_content_id: 37,
        question: 'A good layout minimizes material handling and helps control outside factors, like moisture, that can impact maturing and cause odors.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 183,
        lesson_content_id: 37,
        question: 'The more efficient place to accept incoming material is closer to the grinding area, so as it’s processed, it can gradually move toward the front and be ready for retail.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 184,
        lesson_content_id: 37,
        question: 'Barriers should be put in place to minimize contaminates, like plastic and paper, from blowing into the retail area.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 185,
        lesson_content_id: 37,
        question: 'Running a pump and sprinkler is a cost-effective way to bring moisture content back to optimal levels.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 186,
        lesson_content_id: 37,
        question: 'Materials should be able to be pushed from the drop-off area to the grinder, and the discharge should be pointed in the direction of the composting area.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l1; c3
    {
        question_id: 187,
        lesson_content_id: 38,
        question: 'assets/module_images/M3/L1/cross_section.png',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 188,
        lesson_content_id: 38,
        question: 'assets/module_images/M3/L1/place_mixture.png',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 189,
        lesson_content_id: 38,
        question: 'assets/module_images/M3/L1/sunken.png',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 190,
        lesson_content_id: 38,
        question: 'assets/module_images/M3/L1/compost.png',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 191,
        lesson_content_id: 38,
        question: 'assets/module_images/M3/L1/triple_compost.png',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l1; c4
    {
        question_id: 192,
        lesson_content_id: 39,
        question: 'The 1st steps in gathering materials in compost is combination of brown and yellow.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 193,
        lesson_content_id: 39,
        question: 'Fallen leaves, shredded tree branches, cardboard, or newspaper; hay or straw and wood shavings are brown materials.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 194,
        lesson_content_id: 39,
        question: 'Green materials are the kitchen scraps and coffee grounds, animal manures and fresh plant.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 195,
        lesson_content_id: 39,
        question: 'Water over the pile regularly so it has the consistency of a damp sponge.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 196,
        lesson_content_id: 39,
        question: 'The best time to turn the compost is when the center of the pile feels warm or when a thermometer reads between 130 and 150°F.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l1; c5
    {
        question_id: 197,
        lesson_content_id: 40,
        question: 'Graminaceous crops materials usually have a high C: N ratio, with a low nitrogen content but fairly high potassium and silica, fibrous materials provide an energy source for soil microorganisms as well as improve and condition soil physical properties.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 198,
        lesson_content_id: 40,
        question: 'Green manure crops are an important source of natural nitrogen. They fix nitrogen from the air and at flowering stage are usually incorporated into the soil, about ten days before planting the main crop.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 199,
        lesson_content_id: 40,
        question: 'The best way to utilize this manure is to mix it with cattle and swine manure, rice straw, rice hull, sawdust, and other fibrous materials, and ferment it thoroughly before use.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 200,
        lesson_content_id: 40,
        question: 'Recommend that used mushroom compost should be combined with a proper amount of high-nitrogen manure such as swine or poultry manure or oil extraction residues and be well fermented to kill the mycelia, before applying to the soil.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 201,
        lesson_content_id: 40,
        question: 'Oyster shell and eggshell are good sources of calcium and bone meal can be a good source of phosphorus.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l2; c1
    {
        question_id: 202,
        lesson_content_id: 41,
        question: 'Trench composting involves digging holes in your garden soil and burying raw compost ingredients.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 203,
        lesson_content_id: 41,
        question: 'Sheet Composting, is also as sheet mulching, can be a great way to add organic matter back into your soils.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 204,
        lesson_content_id: 41,
        question: 'Humus is rich in nutrients and contributes to soil texture and water retention.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 205,
        lesson_content_id: 41,
        question: 'Anaerobic composting describes the biological breakdown of organic materials by living anaerobic organisms.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 206,
        lesson_content_id: 41,
        question: 'Aerobic composting describes the biological breakdown of organic materials by living anaerobic organisms.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m2; l2; c2
    {
        question_id: 207,
        lesson_content_id: 42,
        question: 'For energy the microbial oxidation of carbon produces the heat required for other parts of the composting process. High carbon materials tend to be brown and dry.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 208,
        lesson_content_id: 42,
        question: 'Grow and reproduce more organisms to oxidize the carbon. High nitrogen materials tend to be green and wet. They can also include colorful fruits and vegetables.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 209,
        lesson_content_id: 42,
        question: 'For oxidizing the carbon, the decomposition process.  Aerobic bacteria need oxygen levels >5% to perform the processes needed for composting.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 210,
        lesson_content_id: 42,
        question: 'The right amounts to maintain activity without causing anaerobic conditions.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 211,
        lesson_content_id: 42,
        question: 'Can break down organic matter in compost if provided with the correct mixture of water, oxygen, carbon, and nitrogen.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l2; c3
    {
        question_id: 212,
        lesson_content_id: 43,
        question: 'Compost is ready to be harvested when the finished product is a rich dark red color.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 213,
        lesson_content_id: 43,
        question: 'Compost is ready to be harvested when the finished product is a rich smell like globe.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    }, 
    {
        question_id: 214,
        lesson_content_id: 43,
        question: 'Compost is ready to be harvested when the finished product is a rich crumble in hands.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 215,
        lesson_content_id: 43,
        question: 'Compost can also be used to make a rich liquid fertilizer called compost tea.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 216,
        lesson_content_id: 43,
        question: 'Compost fertilizer can be used to provide nutrients to the plants.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l2; c4
    {
        question_id: 217,
        lesson_content_id: 44,
        question: 'The process of composting. It is primarily a microbiological process of decomposing organic substances, which results in a product that is stable, pathogen-free, and contains readily available nutrients when applied to the soil.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 218,
        lesson_content_id: 44,
        question: 'Moisten the materials then shred to enhance decomposition. Shredding will reduce the size of the materials for easier attack of microorganisms.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 219,
        lesson_content_id: 44,
        question: 'Pile the shredded materials and cover with used plastic to minimize evolution of greenhouse gases and conserve moisture of the pile. Be sure that the plastic cover is perforated to allow aeration in the pile.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 220,
        lesson_content_id: 44,
        question: 'After 2 weeks, open the pile and turn it. Turning can be done by spading the end of the pile and turning it back. Afterward, ensure that compost material is moist and then cover with plastic.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 221,
        lesson_content_id: 44,
        question: 'Air-dry the compost under a shaded place to avoid direct impact of rainfall. Do not over dry the compost. Maintain compost MC at least approximately 30%. Get a handful sample of the compost and squeeze in your palm',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m3; l2; c5
    {
        question_id: 222,
        lesson_content_id: 45,
        question: '1-5. Give 5 reason why record keeping are important in composting.',
        question_type: 'enumeration', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    //m4; l1; c1
    {
        question_id: 223,
        lesson_content_id: 46,
        question: 'Let anyone eat, drink, or smoke in the storage facility',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 224,
        lesson_content_id: 46,
        question: 'Never store pesticides in milk jugs, soft drink bottles, fruit jars, or medicine bottles.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 225,
        lesson_content_id: 46,
        question: 'Do not leave any pesticide container in full sun or next to a heater.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 226,
        lesson_content_id: 46,
        question: 'Keep the storage area neat and clean at all times.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 227,
        lesson_content_id: 46,
        question: 'Do not keep the area free of debris such as waste paper, rags, or used cardboard boxes, which may provide an ignition source.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l1; c2
    {
        question_id: 228,
        lesson_content_id: 47,
        question: 'Do not wash the plant materials.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 229,
        lesson_content_id: 47,
        question: 'Collect the plant materials early in the morning while they are fresh and the microorganisms are still present.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 230,
        lesson_content_id: 47,
        question: 'Make sure that all plant materials are mixed with sugar so that the juice can be extracted easily.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 231,
        lesson_content_id: 47,
        question: 'Put the bagged mixture in a ceramic pot or plastic pail, and put weight to compress the mixture.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 232,
        lesson_content_id: 47,
        question: 'Store the container with the bagged mixture in a cool dry shady place.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l1; c3
    {
        question_id: 233,
        lesson_content_id: 48,
        question: 'Made up of plastic or wood used for slicing or cutting of the raw materials in preparing fermented concoction.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 234,
        lesson_content_id: 48,
        question: 'It is made up of rubber or plastic used to cover the hand to minimize the contamination of the fermented concoction.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 235,
        lesson_content_id: 48,
        question: 'Yellowish paper used to cover the pail with prepared fermented concoction.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 236,
        lesson_content_id: 48,
        question: 'A digital or manual tools used to measure mass of the raw materials in preparing fermented concoction.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 237,
        lesson_content_id: 48,
        question: 'Made up of cloth or thin plastic used to cover the mouth eliminate contamination of the fermented concoction.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l1; c4
    {
        question_id: 238,
        lesson_content_id: 49,
        question: 'Means SORT by removing all unnecessary or not needed in the workplace to avoid accidents.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 239,
        lesson_content_id: 49,
        question: 'Means SET IN ORDER or SYSTEMATIZED by arranging all needed tools and equipment and raw materials to be used and properly labeled for easily identified.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 240,
        lesson_content_id: 49,
        question: 'Means SHINE or SWEEP by keeping or maintain our work area, tools, equipment and raw materials clean to avoid contaminated results.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 241,
        lesson_content_id: 49,
        question: 'Means STANDARDIZE or SANITIZE by creating consistent way that task and procedure are done. Organic Agriculture Production Producing Organic Concoction and Exacts.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 242,
        lesson_content_id: 49,
        question: 'Means SELF-DISCIPLINE or SUSTAIN by making a habit of properly maintaining the correct procedure for this is the pillar of the first 4 S.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l2; c1
    {
        question_id: 243,
        lesson_content_id: 50,
        question: 'A liquid made from fish scrap. Abundant amount of nutrients and various types of amino acids that will constitute a source of Nitrogen for plants.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 244,
        lesson_content_id: 50,
        question: 'Plants that are fast growing like kangkong, legumes and grasses. You can also use bamboo shoots, asparagus shoots, actively growing plant parts.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 245,
        lesson_content_id: 50,
        question: 'Made from sweet ripe fruits, fruit vegetables and root crops.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 246,
        lesson_content_id: 50,
        question: 'Useful in removing bad odors from animal wastes, hastening composting, and contributing to crops’ general health.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 247,
        lesson_content_id: 50,
        question: 'Is a mixture of edible, aromatic herbs extracted with alcohol and fermented with brown sugar. It is used to discourage the growth of anaerobic, potentially pathogenic microbes and encourage beneficial aerobic microbes in the soil and on plants.',
        question_type: 'identification', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l2; c2
    {
        question_id: 248,
        lesson_content_id: 51,
        question: 'Fermentation is the metabolic process by which organic molecules (normally glucose) are converted into acids, gases, or alcohol in the absence of oxygen or any electron transport chain.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 249,
        lesson_content_id: 51,
        question: 'French chemist Louis Pasteur demonstrated that fermentation was caused by yeast?',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 250,
        lesson_content_id: 51,
        question: 'Filter the liquid and keep it in a plastic container (do not close the cap tightly, loosen the cap of approximately 1 complete twist).',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 251,
        lesson_content_id: 51,
        question: 'Lactic acid fermentation is primarily performed by certain types of bacteria and fungi.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 252,
        lesson_content_id: 51,
        question: 'The processes of fermentation are valuable to the food and beverage industries, with the conversion of sugars into ethanol used to produce alcoholic beverages, the release of CO2 by yeast used in the leavening of bread, and with the production of organic acids to preserve and flavor vegetables and dairy products.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l2; c3
    {
        question_id: 253,
        lesson_content_id: 52,
        question: 'They are microorganisms which can be found in any environment rich mainly in carbohydrates.',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 254,
        lesson_content_id: 52,
        question: 'What is the real word for OHN?',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 255,
        lesson_content_id: 52,
        question: 'It occurs abundantly in nature in several forms and are the principal minerals for the production of phosphate fertilizers and for a range of phosphorus compounds',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 256,
        lesson_content_id: 52,
        question: 'It promotes the plant produce more flower and fruits.',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 257,
        lesson_content_id: 52,
        question: 'It is a fermented extract of plants which helps crops to absorb nutrients directly for healthy growth and enabling their potential.',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l2; c4
    {
        question_id: 258,
        lesson_content_id: 53,
        question: 'The following are important task in producing organic fertilizers except one, which of them?',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 259,
        lesson_content_id: 53,
        question: 'The following statement describes the importance of organic concoctions?',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 260,
        lesson_content_id: 53,
        question: 'Which of the following measures the correct dosage in using fermented concoction?',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 261,
        lesson_content_id: 53,
        question: 'It is a nitrogen fertilizer and growth enhancer for plants and animals.',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 262,
        lesson_content_id: 53,
        question: 'It is a potassium fertilizer for plants and taste enhancer to animals.',
        question_type: 'multiple_choice', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l3; c1
    {
        question_id: 263,
        lesson_content_id: 54,
        question: 'Remove all the labels from your bottles before cleaning.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 264,
        lesson_content_id: 54,
        question: 'Unscrew the tops and set them in a container of warm soapy water to avoid losing them down the drain.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 265,
        lesson_content_id: 54,
        question: 'You will want to fully submerge your bottles into the solution for a few minutes to kill any bacteria.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 266,
        lesson_content_id: 54,
        question: 'You can also place the caps on the bottles and shake the water inside to see if soap bubbles appear.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 267,
        lesson_content_id: 54,
        question: 'Stand the bottles upside down on a well-ventilated drying rack. Do not lay them on their sides as they all take longer to dry and may dry unevenly. Allow the bottles to dry overnight. Don’t refill the bottles too soon.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l3; c2
    {
        question_id: 268,
        lesson_content_id: 55,
        question: 'Labelling and packaging can be used by marketers to encourage potential buyers.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 269,
        lesson_content_id: 55,
        question: 'Packages and labels communicate how to use, transport, recycle or dispose of the package or product.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 270,
        lesson_content_id: 55,
        question: 'The name and address of manufacturer, packer or the distributor of the of the food shall be declared in the manufacturer, label. Packer or distributor.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 271,
        lesson_content_id: 55,
        question: 'The product is not manufactured by person or company whose appear in the label, the name must be qualified by manufactured for or packed for or similar expression.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 272,
        lesson_content_id: 55,
        question: 'The date when the product was and manufactured and the date of expiration shall be placed visibly within Date the label.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
    //m4; l3; c3
    {
        question_id: 273,
        lesson_content_id: 56,
        question: 'Fish Amino Acid- Store the container with the mixture for 4 weeks in a cool dry shady place. Make sure that the storage area is not infested with cockroaches or mice because they might feed on the mixture and contaminate the extract',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 1,
    },
    {
        question_id: 274,
        lesson_content_id: 56,
        question: 'Lactic Acid Bacteria Serum (LABS) - Keep the refined LAB serum at cool temperature, so for longer period where there is temperature change (1-15°C). No storage under direct sunlight.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 2,
    },
    {
        question_id: 275,
        lesson_content_id: 56,
        question: 'Indigenous Microorganism- Keep the IMO3 bags in shaded and cool place. Make sure that the air is well circulated by keeping IMO-3 in a ventilated container such as jute / gunny / cloth bags.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 3,
    },
    {
        question_id: 276,
        lesson_content_id: 56,
        question: 'Oriental Herbs Nutrients (OHN)- The jar must cover it with tight lid / vinyl film. Stir the mixture gently clockwise every day morning for a week. Leave it for 4-6 days. Filter the content and keep the extraction in another jar for long-term storage.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 4,
    },
    {
        question_id: 277,
        lesson_content_id: 56,
        question: 'Fermented Fruit Juice- Store the container with the bagged mixture for 7 days in a cool dry shady place. Make sure that the storage area is not infested with cockroaches or mice, because they might feed on the mixture and contaminate the extracts.',
        question_type: 'true_or_false', // multiple_choice, true_or_false, enumeration, identification
        question_order: 5,
    },
];

async function seedQuestionContents() {
    const existingRecords = await listQuestion();
    const existingId = new Set(existingRecords.map((record) =>record.question_id));

    let insertedCount = 0;
    for (const questionInput of SEED_QUESTION_CONTENT) {
        if (existingId.has(questionInput.question_id)) {
            continue;
        }

        await createQuestion(questionInput);
        insertedCount += 1;
    }

    console.log(`Seeded ${insertedCount} questions record(s).`);
}

seedQuestionContents().catch((error) => {
    console.error('Failed to seed question.', error);
    process.exitCode = 1;
});