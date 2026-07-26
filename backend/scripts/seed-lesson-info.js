const { createLessonInfo } = require('../src/models/lessonInfoModel');
const { listLessonInfo } = require('../src/models/lessonInfoModel');

const SEED_LESSON_INFO = [
    // M1; L1
    {
        lesson_info_id: 1,
        lesson_id: 1,
        label: 'Assessment Criteria',
        content: 'Breed/strains breeds are identified as per PNS-Organic Agriculture-Livestock and GAHP Guidelines. Healthy chicks are selected based on industry acceptable indicator for healthy chicks. Suitable site for chicken house are determined based on PNS recommendations. Chicken house design is prepared based PNS recommendations. House equipment installation design is prepared in line with PNS recommendation and actual scenario.',
    },
    {
        lesson_info_id: 2,
        lesson_id: 1,
        label: 'Contents',
        content: 'Chicken breeds Identification, Healthy chick’s selection, Determining suitable site for chicken house, Chicken house design preparation, and House equipment installation',
    },
    {
        lesson_info_id: 3,
        lesson_id: 1,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Farm, Feeding troughs, Waterers, Containers of concoction, Chicken/ chicks, Rice hull, Saw dust, Coco coir, Rice straw, and PPE ( Boots, surgical masks, disposable gloves, overall)',
    },
    // M1; L2
    {
        lesson_info_id: 4,
        lesson_id: 2,
        label: 'Assessment Criteria',
        content: 'House equipment are installed in line with housing equipment installation design. Bedding materials are secured based on availability in the locality. Bedding is prepared in accordance with housing equipment housing design. Brooding facility is set-up in accordance with the housing equipment installation design.',
    },
    {
        lesson_info_id: 5,
        lesson_id: 2,
        label: 'Contents',
        content: 'House equipment installation, Prepare and secure bedding materials, and Set-up brooding facility.',
    },
    {
        lesson_info_id: 6,
        lesson_id: 2,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Farm, Housing, Bedding materials, Brooding facility, PPE (Boots, surgical masks, disposable gloves, overall.',
    },
    //M1; L3
    {
        lesson_info_id: 7,
        lesson_id: 3,
        label: 'Assessment Criteria',
        content: 'Suitable feed materials are selected based on availability in the locality and nutrient requirements of chicken. Feed materials are prepared following enterprise prescribed formulation. Animals are fed based on feeding management program. Feeding is monitored following enterprise procedure.',
    },
    {
        lesson_info_id: 8,
        lesson_id: 3,
        label: 'Contents',
        content: 'Feed materials selection. feeding materials preparation. Feeding management program. Monitoring feeding',
    },
    {
        lesson_info_id: 9,
        lesson_id: 3,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'PPE, Feeding trough, Chopping board, Knife, and Plant material',
    },
    //M1; L4
    {
        lesson_info_id: 10,
        lesson_id: 4,
        label: 'Assessment Criteria',
        content: 'Growth rate is monitored based on enterprise procedures. Health care program are implemented based on enterprise procedures. Sanitation and cleanliness program are implemented based on enterprise procedure. Organic waste for fertilizer formulation are collected. Suitable chicken for harvest are selected based on market specifications. Production record is accomplished according to enterprise procedure.',
    },
    {
        lesson_info_id: 11,
        lesson_id: 4,
        label: 'Contents',
        content: 'Monitor growth rate, Healthcare program, Sanitation and cleanliness program, Organic waste collection, Suitable chicken for harvest selection, and Production record',
    },
    {
        lesson_info_id: 12,
        lesson_id: 4,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Poultry farm, Fully grown broilers, Paper, Pen, Calculator, and Weighing scale',
    },
    //M2; L1
    {
        lesson_info_id: 13,
        lesson_id: 5,
        label: 'Assessment Criteria',
        content: 'Seeds are selected in accordance with the PNS, and NSQCS/BPI. Seedbeds are prepared in accordance with planting requirements based on Vegetable Production manual (VPM). Care and maintenance of seedlings are done in accordance with enterprise practice. Potting media are prepared in accordance with enterprise procedure.',
    },
    {
        lesson_info_id: 14,
        lesson_id: 5,
        label: 'Contents',
        content: 'Selection of Seeds. Seed bed Preparation. Maintaining Seedling. Prepare growing media',
    },
    {
        lesson_info_id: 15,
        lesson_id: 5,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Farm, Different vegetable seeds, Seed bed, Carbonized rice hull, Compost, Animal manure, and PPE',
    },
    //M2; L2
    {
        lesson_info_id: 16,
        lesson_id: 6,
        label: 'Assessment Criteria',
        content: 'Land preparation is carried out in accordance with enterprise practice. Beneficial micro-organisms are introduced prior to planting in accordance with enterprise procedure. Seedlings are transplanted/planted based on VPM recommendations. Seedlings are watered based on VPM recommendations',
    },
    {
        lesson_info_id: 17,
        lesson_id: 6,
        label: 'Contents',
        content: 'Land Preparation, Beneficial microorganisms, Planting/transplanting seedlings, and Water seedlings',
    },
    {
        lesson_info_id: 18,
        lesson_id: 6,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Farm/filed, Seedlings, Trowel, Sprinkler, water, andPPE',
    },
    // M2; L3
    {
        lesson_info_id: 19,
        lesson_id: 7,
        label: 'Assessment Criteria',
        content: 'Water management is implemented according to plan. Effective control measures are determined on specific pest and diseases as described under the “pest, disease and weed management” of the PNS. All missing hills are replanted to maintain the desired plant population of the area. Plant rejuvenation/rationing are maintained according to PNS. Organic fertilizers are applied in accordance with fertilization policy of the PNS.'
    },
    {
        lesson_info_id: 20,
        lesson_id: 7,
        label: 'Contents',
        content: 'Water management implementation, Pest and diseases control measures, Replanting missing hills, Plant rationing and Organic fertilizer application',
    },
    {
        lesson_info_id: 21,
        lesson_id: 7,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Seedlings, Organic fertilizer (compost, animal manure), botanical repellants, hose, and water source',
    },
    //M2; L4
    {
        lesson_info_id: 22,
        lesson_id: 8,
        label: 'Assessment Criteria',
        content: 'Products are checked using maturity indices according to PNS, PNS-organic agriculture and enterprise practice. Marketable products are harvested according to PNS, PNSorganic agriculture and enterprise practice. Harvested vegetables are classified according to PNS, PNSorganic agriculture and enterprise practice. Appropriate harvesting tools and materials are used according to PNS. Post-harvest practices are applied according to PNS and GAP recommendation. Production record is accomplished according to enterprise procedures.',
    },
    {
        lesson_info_id: 23,
        lesson_id: 8,
        label: 'Contents',
        content: 'maturity indices, harvest marketable products, classify marketable products, harvesting tools and materials, Post-harvest practices, and Record Keeping',
    },
    {
        lesson_info_id: 24,
        lesson_id: 8,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Ladder, Basket, Scissors, Scythe, and Notebook and pen',
    },
    //M3; L1
    {
        lesson_info_id: 25,
        lesson_id: 9,
        label: 'Assessment Criteria',
        content: 'Site is selected based on compost fertilizer production requirements and Site lay-out is prepared based on location. Bed is prepared in accordance with production requirements. Materials are gather based on production requirements and PNS for organic fertilizer. Prepare raw materials following enterprise procedure and PNS for organic fertilizer.',
    },
    {
        lesson_info_id: 26,
        lesson_id: 9,
        label: 'Contents',
        content: 'Site Selection, Prepare site layout, Prepare bed, Gather material, and Prepare raw materials',
    },
    {
        lesson_info_id: 27,
        lesson_id: 9,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Composting shed using locally available materials, Shredder, Drums for water storage, Flat and pointed shovels, Hoe, Wheelbarrow, Sieve, and Water hose',
    },
    //M3; L2
    {
        lesson_info_id: 28,
        lesson_id: 10,
        label: 'Assessment Criteria',
        content: 'Appropriate composting methods are applied based on production requirements. Compost is monitored based PNS indicators of fully decomposed fertilizer. Quality of harvest is checked based on PNS indicators of fully decomposed fertilizer. Processing of compost fertilizer are carried- out based on production requirement. Record keeping is performed according to enterprise procedure.',
    },
    {
        lesson_info_id: 29,
        lesson_id: 10,
        label: 'Contents',
        content: 'Composting methods, Decomposed fertilizer, Quality of harvest, Processing of compost fertilizer, and Record keeping'
    },
    {
        lesson_info_id: 30,
        lesson_id: 10,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'Composting area and PPE (Boots, surgical masks, disposable gloves, overall)',
    },
    //M4; L1
    {
        lesson_info_id: 31,
        lesson_id: 11,
        label: 'Assessment Criteria',
        content: 'Work and storage areas are cleaned, sanitized and secured. Raw materials used are cleaned and freed from synthetic chemicals. Tools, materials and equipment used are cleaned, freed from contaminations and must be of “food grade” quality. Personal hygiene are observed according to OHS procedures.',
    },
    {
        lesson_info_id: 32,
        lesson_id: 11,
        label: 'Contents',
        content: 'Storage Areas, Raw materials Tools, materials and equipment, and Personal hygiene',
    },
    {
        lesson_info_id: 33,
        lesson_id: 11,
        label: 'Tools, Materials and Equipment and Facilities',
        content: 'kangkong, camote tops, alugbati, malunggay, banana trunks, bamboo shoots and other fast growing green plants, Molasses/mascuvado/ brown sugar Ripe and sweet fruits but not limited to banana, papaya, watermelon, ampalaya , tomato Trash Fish and gills, scales, offal of big fishes, golden kuhol meat Garlic, ginger, Pure coconut vinegar animal bones, egg shell, sea shell, kuhol shell 1 kl. Cooked, cool rice900 ml. fresh milk, 100 ml clear liquid from fermented rice, Plastic pail, Wooden ladle, Manila paper or cheese cloth, String or rubber bands, Weighing scale,  Chopping board,  Knife  Marker,  Strainer or nylon screen,',
    },
    //M4; L2
    {
        lesson_info_id: 34,
        lesson_id: 12,
        label: 'Assessment Criteria',
        content: 'Raw materials are prepared in accordance with enterprise practice. Fermentation period is set based on enterprise practice. Various concoctions are fermented following to organic practices. Concoctions are harvested based on fermentation period of the concoction.',
    },
    {
        lesson_info_id: 35,
        lesson_id: 12,
        label: 'Contents',
        content: 'Prepare raw materials, Fermentation period, Various concoctions, and Period of harvest',
    },
    {
        lesson_info_id: 36,
        lesson_id: 12,
        label: 'Tools Materials and Equipment',
        content: 'Storage area, kangkong, camote tops, alugbati, malunggay, banana trunks, bamboo shoots and other fast growing green plants, Molasse/mascuvado/ brown sugar Ripe and sweet fruits but not limited to banana, papaya, watermelon, ampalaya , tomato Trash Fish and gills, scales, offal of big fishes, golden kuhol, meat, Garlic, ginger, Pure coconut vinegar animal bones, egg shell, sea shell, kuhol shell 1 kl. Cooked, cool rice900 ml. fresh milk, 100 ml clear liquid from fermented rice, Plastic pail, Wooden ladle, Manila paper or cheese cloth, String or rubber bands, Weighing scale, chopping board,  Knife  Marker,  Strainer or nylon screen.'
    },
    // M4; L3
    {
        lesson_info_id: 37,
        lesson_id: 13,
        label: 'Assessment Criteria',
        content: 'Concoctions are contained in sanitized bottles and containers. Packaged concoctions are labeled and tagged in accordance with enterprise practice. Packaged concoctions are stored in appropriate place and temperature following organic practices. Production of concoctions are recorded using enterprise procedures.'
    },
    {
        lesson_info_id: 38,
        lesson_id: 13,
        label: 'Contents',
        content: 'Sanitize bottles and containers, Package concoctions, Appropriate place to store, and Production Record'
    },
    {
        lesson_info_id: 39,
        lesson_id: 13,
        label: 'Tools materials and equipment',
        content: 'Various concoctions, Concoction area, sanitized bottles, Labelling, and Storing area'
    },
];

async function seedLessonInfo() {
  const existingLessonInfo = await listLessonInfo();
  const existingIds = new Set(existingLessonInfo.map((lessonInfo) => lessonInfo.lesson_info_id));

  let insertedCount = 0;
  for (const lessonInfoInput of SEED_LESSON_INFO) {
    if (existingIds.has(lessonInfoInput.lesson_info_id)) {
      continue;
    }

    await createLesson(lessonInfoInput);
    insertedCount += 1;
  }

  console.log(`Seeded ${insertedCount} lesson record(s).`);
}

seedLessonInfo().catch((error) => {
  console.error('Failed to seed lessons.', error);
  process.exitCode = 1;
});
