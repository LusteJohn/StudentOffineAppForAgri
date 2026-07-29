import * as SQLite from 'expo-sqlite';
import { DEFAULT_CONTENT_INFO } from './content-info-seed';
import { DEFAULT_QUESTION_INSTRUCT } from './question-instruct-seed';
import { DEFAULT_QUESTION_CONTENT } from './question-content-seed';
import { DEFAULT_QUESTION_CHOICE } from './question-choice-seed';

export type StudentUser = {
  user_id: number;
  username: string;
  email: string;
  role: 'student';
  created_at: string;
};

export type AuthResponse = {
  message: string;
  user: StudentUser;
};

export type StudentProfile = {
  student_id: number;
  user_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  birthdate: string;
  home_address: string;
  grade_level: string;
  created_at: string;
  updated_at: string;
};

export type CompetencyRecord = {
  competency_id: number;
  competency_name: string;
  sector: string;
  qualification: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ModuleRecord = {
  module_id: number;
  competency_id: number;
  module_name: string;
  description: string;
  module_pdf: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
};

export type LessonRecord = {
  lesson_id: number;
  module_id: number;
  lesson_name: string;
  order_number: number;
  created_at: string;
  updated_at: string;
};

export type LessonContentRecord = {
  lesson_content_id: number;
  lesson_id: number;
  content_name: string;
  objectives: string;
  created_at: string;
  updated_at: string;
};

export type ContentInfoRecord = {
  content_info_id: number;
  lesson_content_id: number;
  label: string;
  description: string;
  images: string;
};

export type LessonInfoRecord = {
  lesson_info_id: number;
  lesson_id: number;
  label: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type LessonLinkRecord = {
  lesson_link_id: number;
  lesson_id: number;
  link: string;
  created_at: string;
  updated_at: string;
};

export type QuestionInstructionRecord = {
  instruct_id: number;
  lesson_content_id: number;
  question_instruction: string;
  question_title: string;
  question_label: string;
  created_at: string;
  updated_at: string;
};

export type QuestionContentRecord = {
  question_id: number;
  lesson_content_id: number;
  question: string;
  questionType: string;
  questionOrder: number;
  created_at: string;
  updated_at: string;
}
export type QuestionChoiceRecord = {
  choice_id: number;
  question_id: number;
  choice_label: string;
  choice_text: string;
  is_correct: string;
  created_at: string;
  updated_at: string;
}
export type JobSheetRecord = {
  job_id: number;
  lesson_content_id: number;
  job_title: string;
  job_objectives: string;
  job_materials: string;
  job_steps: string;
  job_assesment_method: string;
  created_at: string;
  updated_at: string;
}

export type QuestionAnswerRecord = {
  answer_id: number;
  question_id: number;
  user_id: number;
  answer_text: string;
  created_at: string;
  updated_at: string;
}

type StoredStudentUser = StudentUser & {
  password: string;
}

type StoredCompetency = CompetencyRecord;

const DEFAULT_STUDENT_ACCOUNT: StoredStudentUser = {
  user_id: 1,
  username: 'student1',
  email: 'example@gmail.com',
  password: '12345',
  role: 'student',
  created_at: new Date().toISOString(),
};

const DEFAULT_COMPETENCIES: Omit<StoredCompetency, 'competency_id' | 'created_at' | 'updated_at'>[] = [
  {
    competency_name: 'Raise Organic Chicken',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
  {
    competency_name: 'Produce Organic Vegetables',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
  {
    competency_name: 'Produce Organic Fertilizer',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
  {
    competency_name: 'Produce Organic Concoction and Extract',
    sector: 'Agriculture, Forestry and Fishery',
    qualification: 'Organic Agriculture Production NC II',
    status: 'Active',
  },
];

const DEFAULT_MODULES: Omit<ModuleRecord, 'module_id' | 'created_at' | 'updated_at'>[] = [
  {
    competency_id: 1,
    module_name: 'Raise Organic Chicken',
    description: 'Welcome to the Module on Raising Organic Chicken. This module contains training materials and activities for you to complete. The unit of competency on Raise Organic Chicken contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Raising Organic Chicken.pdf',
    thumbnail: 'assets/learning-materials/module/Raising-chicken/raise.png',
  },
  {
    competency_id: 2,
    module_name: 'Produce Organic Vegetables',
    description: 'Welcome to the Module on Producing Organic Vegetables. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Vegetables contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Producing Organic Vegetables.pdf',
    thumbnail: 'assets/learning-materials/module/Producing-organic-vegetables/vegetables.png',
  },
  {
    competency_id: 3,
    module_name: 'Produce Organic Fertilizer',
    description: 'Welcome to the Module on Producing Organic Fertilizer. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Fertilizer contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Producing Organic Fertilizer.pdf',
    thumbnail: 'assets/learning-materials/module/Producing-organic-fertilizer/fertilizer.jpg',
  },
  {
    competency_id: 4,
    module_name: 'Produce Organic Concoction and Extract',
    description: 'Welcome to the Module on Producing Organic Concoction and Extract. This module contains training materials and activities for you to complete. The unit of competency on Produce Organic Concoction and Extract contains knowledge, skills and attitudes required for an Organic Agriculture Production NC II course. You are required to go through a series of learning activities in order to complete each of the learning outcomes of the module. In each learning outcome there are Information Sheets, Operation Sheets, Job Sheets and Task Sheets. Follow these activities on your own and answer the Self-Check at the end of each learning activity.',
    module_pdf: 'assets/learning-materials/module/Producing Organic Concoction and Extract.pdf',
    thumbnail: 'assets/learning-materials/module/Producing-organic-concoction/concoction.jpg',
  },
];

const DEFAULT_LESSONS: Omit<LessonRecord, 'lesson_id' | 'created_at' | 'updated_at'>[] = [
  { module_id: 1, lesson_name: 'LO1:Select Healthy Stocks and Suitable Housing', order_number: 1 },
  { module_id: 1, lesson_name: 'LO2:Set-up Cage Equipment', order_number: 2 },
  { module_id: 1, lesson_name: 'LO3:Feed Chicken', order_number: 3 },
  { module_id: 1, lesson_name: 'LO4:Grow and Harvest Chicken', order_number: 4 },
  { module_id: 2, lesson_name: 'LO1:Establish Nursery', order_number: 1 },
  { module_id: 2, lesson_name: 'LO2:Plant Seedlings', order_number: 2 },
  { module_id: 2, lesson_name: 'LO3:Perform Plant Care and Management', order_number: 3 },
  { module_id: 2, lesson_name: 'LO4:Perform Harvest and Post-Harvest Activities', order_number: 4 },
  { module_id: 3, lesson_name: 'LO1:Prepare Composting Area and Raw Materials', order_number: 1 },
  { module_id: 3, lesson_name: 'LO2:Compost and Harvest Fertilizer', order_number: 2 },
  { module_id: 4, lesson_name: 'LO1:Prepare for the production of various concoctions', order_number: 1 },
  { module_id: 4, lesson_name: 'LO2:Process concoctions', order_number: 2 },
  { module_id: 4, lesson_name: 'LO3:Package concoctions', order_number: 3 },
];

const DEFAULT_LESSON_CONTENTS: Omit<LessonContentRecord, 'lesson_content_id' | 'created_at' | 'updated_at'>[] = [
  { lesson_id: 1, content_name: 'Chicken breeds identification', objectives: 'After reading this information sheet, you should be able to identify chicken breeds.' },
  { lesson_id: 1, content_name: "Healthy chick's selection indicators", objectives: 'After reading this information sheet, you should be able to select healthy chicks' },
  { lesson_id: 1, content_name: 'Determining suitable site for chicken house', objectives: 'After reading this information sheet, you should be able to determine suitable site for chicken house' },
  { lesson_id: 1, content_name: 'Chicken house design preparation', objectives: 'After reading this information sheet, you should be able to prepare design for chicken house.' },
  { lesson_id: 1, content_name: 'House equipment installation design', objectives: 'After reading this information sheet, you should be able to identify chicken breeds.' },
  { lesson_id: 2, content_name: 'House equipment installation', objectives: 'After reading this information sheet, you should be able to appreciate the importance of house equipment installation.' },
  { lesson_id: 2, content_name: 'Preparing and securing bedding materials', objectives: 'After reading this information sheet, you should be able to prepare and secure bedding materials' },
  { lesson_id: 2, content_name: 'Setting up brooding facility', objectives: 'After reading this information sheet, you should be able to set up brooding facility.' },
  { lesson_id: 3, content_name: 'Feed materials selection', objectives: 'After reading this information sheet, you should be able to select materials for feeds' },
  { lesson_id: 3, content_name: 'Feeding materials preparation', objectives: 'After reading this information sheet, you should be able to prepare feeding materials.' },
  { lesson_id: 3, content_name: 'Feeding management program', objectives: 'After reading this information sheet, you should be able to differentiate different feeding program.' },
  { lesson_id: 3, content_name: 'Monitoring feeding', objectives: 'After reading this information sheet, you should be able to monitor feeding.' },
  { lesson_id: 4, content_name: 'Monitor growth rate', objectives: 'After reading this information sheet, you should be able to monitor growth rate of a broiler' },
  { lesson_id: 4, content_name: 'Healthcare program implementation', objectives: 'After reading this information sheet, you should be able to appreciate healthcare program.' },
  { lesson_id: 4, content_name: 'Sanitation and cleanliness program', objectives: 'After reading this information sheet, you should be able to appreciate the importance of sanitation and cleanliness program' },
  { lesson_id: 4, content_name: 'Organic waste collection for fertilizer formulation', objectives: 'After reading this information sheet, you should be able to collect organic waste.' },
  { lesson_id: 4, content_name: 'Suitable chicken for harvest selection', objectives: 'After reading this information sheet, you should be able to select Suitable chicken for harvest.' },
  { lesson_id: 4, content_name: 'Production record', objectives: 'After reading this information sheet, you should be able to appreciate the importance of production record.' },
  { lesson_id: 5, content_name: 'Selection of Seeds', objectives: 'After reading this information sheet, you should be able to select viable seeds.' },
  { lesson_id: 5, content_name: 'Seedbed Preparation', objectives: 'After reading this information sheet, you should be able to prepare seedbed.' },
  { lesson_id: 5, content_name: 'Maintaining Seedling', objectives: 'After reading this information sheet, you should be able to care and maintain seedlings.' },
  { lesson_id: 5, content_name: 'Prepare Growing Media', objectives: 'After reading this information sheet, you should be able prepare the different growing media.' },
  { lesson_id: 6, content_name: 'Land Preparation', objectives: 'After reading this information sheet, you should be able to perform land preparation.' },
  { lesson_id: 6, content_name: 'Beneficial Microorganisms', objectives: 'After reading this information sheet, you should be able to identify the different types beneficial microorganism.' },
  { lesson_id: 6, content_name: 'Planting/Transplanting Seedlings', objectives: 'After reading this information sheet, you should be able to plant/transplant vegetable seedlings.' },
  { lesson_id: 6, content_name: 'Water Seedlings', objectives: 'After reading this information sheet, you should be able to water seedlings.' },
  { lesson_id: 7, content_name: 'Water Management Implementation', objectives: 'After reading this information sheet, you should be able to appreciate the importance of proper water management.' },
  { lesson_id: 7, content_name: 'Pest and Diseases Control Measures', objectives: 'After reading this information sheet, you should be able to apply control measures on pest and diseases.' },
  { lesson_id: 7, content_name: 'Replanting Missing Hills', objectives: 'After reading this information sheet, you should be able to do replanting.' },
  { lesson_id: 7, content_name: 'Plant Rationing (Rejuvenation)', objectives: 'After reading this information sheet, you should be able identify the number of sow to be served per boar.' },
  { lesson_id: 7, content_name: 'Organic Fertilizers Application', objectives: 'After reading this information sheet, you should be able identify organic fertilizers.' },
  { lesson_id: 8, content_name: 'Maturity Indices', objectives: 'After reading this information sheet, you should be able identify the maturity indices of fruits of vegetables.' },
  { lesson_id: 8, content_name: 'Harvest Marketable Products', objectives: 'After reading this information sheet, you should be able to harvest marketable products.' },
  { lesson_id: 8, content_name: 'Classify Marketable Products', objectives: 'After reading this information sheet, you should be able to classify marketable products.' },
  { lesson_id: 8, content_name: 'Harvesting Tools and Materials', objectives: 'After reading this information sheet, you should be able identify the best tools for harvesting.' },
  { lesson_id: 8, content_name: 'Post-harvest practices', objectives: 'After reading this information sheet, you should be able to learn harvesting practices.' },
  { lesson_id: 8, content_name: 'Record Keeping', objectives: 'After reading this information sheet, you should be able to learn record keeping of harvest.' },
  { lesson_id: 9, content_name: 'Site Selection', objectives: 'After reading this information sheet, you should be able to select composting site.' },
  { lesson_id: 9, content_name: 'Prepare Site Layout', objectives: 'After reading this information sheet, you should be able to prepare composting site layout.' },
  { lesson_id: 9, content_name: 'Prepare Bed', objectives: 'After reading this information sheet, you should be able to prepare bed for composting.' },
  { lesson_id: 9, content_name: 'Gather Materials', objectives: 'After reading this information sheet, you should be able to gather the raw materials for composting.' },
  { lesson_id: 9, content_name: 'Raw Materials', objectives: 'After reading this information sheet, you should be able to identify the raw materials uses for composting.' },
  { lesson_id: 10, content_name: 'Composting Method', objectives: 'After reading this information sheet, you should be able to identify the different types of composting method.' },
  { lesson_id: 10, content_name: 'Monitor Decomposition Process', objectives: 'After reading this information sheet, you should be able to monitor the decomposition process of organic fertilizer.' },
  { lesson_id: 10, content_name: 'Harvest Quality', objectives: 'After reading this information sheet, you should be able to identify the quality of a good harvest.' },
  { lesson_id: 10, content_name: 'Processing of Compost Fertilizer', objectives: 'After reading this information sheet, you should be able to identify processes of composting fertilizer.' },
  { lesson_id: 10, content_name: 'Record Keeping', objectives: 'After reading this information sheet, you should be able to perform record keeping.' },
  { lesson_id: 11, content_name: 'Storage Area', objectives: 'After reading this information sheet, you should be able to secure the Storage Areas.' },
  { lesson_id: 11, content_name: 'Raw materials', objectives: 'After reading this information sheet, you should be able to determine the clean raw materials free from chemicals.' },
  { lesson_id: 11, content_name: 'Tools, Materials and Equipment', objectives: 'After reading this information sheet, you should be able to identify the tools, materials and equipment.' },
  { lesson_id: 11, content_name: 'Personal Hygiene', objectives: 'None' },
  { lesson_id: 12, content_name: 'Prepare Raw Materials', objectives: 'After reading this information sheet, you should be able to prepare raw materials when producing organic concoction and extract.' },
  { lesson_id: 12, content_name: 'Fermentation period', objectives: 'After reading this information sheet, you should be able to determine the period of fermentation process.' },
  { lesson_id: 12, content_name: 'Various concoctions', objectives: 'After reading this information sheet, you should be able to identify various type of concoctions.' },
  { lesson_id: 12, content_name: 'Period of harvest', objectives: 'After reading this information sheet, you should be able to identify harvesting time of concoction.' },
  { lesson_id: 13, content_name: 'Sanitize bottles and containers', objectives: 'After reading this information sheet, you should be able to sanitize the bottles and containers for concoctions.' },
  { lesson_id: 13, content_name: 'Package concoctions', objectives: 'After reading this information sheet, you should be able to appreciate the proper labeling and packaging of concoctions.' },
  { lesson_id: 13, content_name: 'Appropriate place to store', objectives: 'After reading this information sheet, you should be able to determine the appropriate storage for the various concoctionss.' },
];

const DEFAULT_LESSON_INFO: Omit<LessonInfoRecord, 'created_at' | 'updated_at'>[] = [
  { lesson_info_id: 1, lesson_id: 1, label: 'Assessment Criteria', content: 'Breed/strains breeds are identified as per PNS-Organic Agriculture-Livestock and GAHP Guidelines. Healthy chicks are selected based on industry acceptable indicator for healthy chicks. Suitable site for chicken house are determined based on PNS recommendations. Chicken house design is prepared based PNS recommendations. House equipment installation design is prepared in line with PNS recommendation and actual scenario.' },
  { lesson_info_id: 2, lesson_id: 1, label: 'Contents', content: 'Chicken breeds Identification, Healthy chick\'s selection, Determining suitable site for chicken house, Chicken house design preparation, and House equipment installation' },
  { lesson_info_id: 3, lesson_id: 1, label: 'Tools, Materials and Equipment and Facilities', content: 'Farm, Feeding troughs, Waterers, Containers of concoction, Chicken/ chicks, Rice hull, Saw dust, Coco coir, Rice straw, and PPE ( Boots, surgical masks, disposable gloves, overall)' },
  { lesson_info_id: 4, lesson_id: 2, label: 'Assessment Criteria', content: 'House equipment are installed in line with housing equipment installation design. Bedding materials are secured based on availability in the locality. Bedding is prepared in accordance with housing equipment housing design. Brooding facility is set-up in accordance with the housing equipment installation design.' },
  { lesson_info_id: 5, lesson_id: 2, label: 'Contents', content: 'House equipment installation, Prepare and secure bedding materials, and Set-up brooding facility.' },
  { lesson_info_id: 6, lesson_id: 2, label: 'Tools, Materials and Equipment and Facilities', content: 'Farm, Housing, Bedding materials, Brooding facility, PPE (Boots, surgical masks, disposable gloves, overall.' },
  { lesson_info_id: 7, lesson_id: 3, label: 'Assessment Criteria', content: 'Suitable feed materials are selected based on availability in the locality and nutrient requirements of chicken. Feed materials are prepared following enterprise prescribed formulation. Animals are fed based on feeding management program. Feeding is monitored following enterprise procedure.' },
  { lesson_info_id: 8, lesson_id: 3, label: 'Contents', content: 'Feed materials selection. feeding materials preparation. Feeding management program. Monitoring feeding' },
  { lesson_info_id: 9, lesson_id: 3, label: 'Tools, Materials and Equipment and Facilities', content: 'PPE, Feeding trough, Chopping board, Knife, and Plant material' },
  { lesson_info_id: 10, lesson_id: 4, label: 'Assessment Criteria', content: 'Growth rate is monitored based on enterprise procedures. Health care program are implemented based on enterprise procedures. Sanitation and cleanliness program are implemented based on enterprise procedure. Organic waste for fertilizer formulation are collected. Suitable chicken for harvest are selected based on market specifications. Production record is accomplished according to enterprise procedure.' },
  { lesson_info_id: 11, lesson_id: 4, label: 'Contents', content: 'Monitor growth rate, Healthcare program, Sanitation and cleanliness program, Organic waste collection, Suitable chicken for harvest selection, and Production record' },
  { lesson_info_id: 12, lesson_id: 4, label: 'Tools, Materials and Equipment and Facilities', content: 'Poultry farm, Fully grown broilers, Paper, Pen, Calculator, and Weighing scale' },
  { lesson_info_id: 13, lesson_id: 5, label: 'Assessment Criteria', content: 'Seeds are selected in accordance with the PNS, and NSQCS/BPI. Seedbeds are prepared in accordance with planting requirements based on Vegetable Production manual (VPM). Care and maintenance of seedlings are done in accordance with enterprise practice. Potting media are prepared in accordance with enterprise procedure.' },
  { lesson_info_id: 14, lesson_id: 5, label: 'Contents', content: 'Selection of Seeds. Seed bed Preparation. Maintaining Seedling. Prepare growing media' },
  { lesson_info_id: 15, lesson_id: 5, label: 'Tools, Materials and Equipment and Facilities', content: 'Farm, Different vegetable seeds, Seed bed, Carbonized rice hull, Compost, Animal manure, and PPE' },
  { lesson_info_id: 16, lesson_id: 6, label: 'Assessment Criteria', content: 'Land preparation is carried out in accordance with enterprise practice. Beneficial micro-organisms are introduced prior to planting in accordance with enterprise procedure. Seedlings are transplanted/planted based on VPM recommendations. Seedlings are watered based on VPM recommendations' },
  { lesson_info_id: 17, lesson_id: 6, label: 'Contents', content: 'Land Preparation, Beneficial microorganisms, Planting/transplanting seedlings, and Water seedlings' },
  { lesson_info_id: 18, lesson_id: 6, label: 'Tools, Materials and Equipment and Facilities', content: 'Farm/filed, Seedlings, Trowel, Sprinkler, water, andPPE' },
  { lesson_info_id: 19, lesson_id: 7, label: 'Assessment Criteria', content: 'Water management is implemented according to plan. Effective control measures are determined on specific pest and diseases as described under the "pest, disease and weed management" of the PNS. All missing hills are replanted to maintain the desired plant population of the area. Plant rejuvenation/rationing are maintained according to PNS. Organic fertilizers are applied in accordance with fertilization policy of the PNS.' },
  { lesson_info_id: 20, lesson_id: 7, label: 'Contents', content: 'Water management implementation, Pest and diseases control measures, Replanting missing hills, Plant rationing and Organic fertilizer application' },
  { lesson_info_id: 21, lesson_id: 7, label: 'Tools, Materials and Equipment and Facilities', content: 'Seedlings, Organic fertilizer (compost, animal manure), botanical repellants, hose, and water source' },
  { lesson_info_id: 22, lesson_id: 8, label: 'Assessment Criteria', content: 'Products are checked using maturity indices according to PNS, PNS-organic agriculture and enterprise practice. Marketable products are harvested according to PNS, PNSorganic agriculture and enterprise practice. Harvested vegetables are classified according to PNS, PNSorganic agriculture and enterprise practice. Appropriate harvesting tools and materials are used according to PNS. Post-harvest practices are applied according to PNS and GAP recommendation. Production record is accomplished according to enterprise procedures.' },
  { lesson_info_id: 23, lesson_id: 8, label: 'Contents', content: 'maturity indices, harvest marketable products, classify marketable products, harvesting tools and materials, Post-harvest practices, and Record Keeping' },
  { lesson_info_id: 24, lesson_id: 8, label: 'Tools, Materials and Equipment and Facilities', content: 'Ladder, Basket, Scissors, Scythe, and Notebook and pen' },
  { lesson_info_id: 25, lesson_id: 9, label: 'Assessment Criteria', content: 'Site is selected based on compost fertilizer production requirements and Site lay-out is prepared based on location. Bed is prepared in accordance with production requirements. Materials are gather based on production requirements and PNS for organic fertilizer. Prepare raw materials following enterprise procedure and PNS for organic fertilizer.' },
  { lesson_info_id: 26, lesson_id: 9, label: 'Contents', content: 'Site Selection, Prepare site layout, Prepare bed, Gather material, and Prepare raw materials' },
  { lesson_info_id: 27, lesson_id: 9, label: 'Tools, Materials and Equipment and Facilities', content: 'Composting shed using locally available materials, Shredder, Drums for water storage, Flat and pointed shovels, Hoe, Wheelbarrow, Sieve, and Water hose' },
  { lesson_info_id: 28, lesson_id: 10, label: 'Assessment Criteria', content: 'Appropriate composting methods are applied based on production requirements. Compost is monitored based PNS indicators of fully decomposed fertilizer. Quality of harvest is checked based on PNS indicators of fully decomposed fertilizer. Processing of compost fertilizer are carried- out based on production requirement. Record keeping is performed according to enterprise procedure.' },
  { lesson_info_id: 29, lesson_id: 10, label: 'Contents', content: 'Composting methods, Decomposed fertilizer, Quality of harvest, Processing of compost fertilizer, and Record keeping' },
  { lesson_info_id: 30, lesson_id: 10, label: 'Tools, Materials and Equipment and Facilities', content: 'Composting area and PPE (Boots, surgical masks, disposable gloves, overall)' },
  { lesson_info_id: 31, lesson_id: 11, label: 'Assessment Criteria', content: 'Work and storage areas are cleaned, sanitized and secured. Raw materials used are cleaned and freed from synthetic chemicals. Tools, materials and equipment used are cleaned, freed from contaminations and must be of "food grade" quality. Personal hygiene are observed according to OHS procedures.' },
  { lesson_info_id: 32, lesson_id: 11, label: 'Contents', content: 'Storage Areas, Raw materials Tools, materials and equipment, and Personal hygiene' },
  { lesson_info_id: 33, lesson_id: 11, label: 'Tools, Materials and Equipment and Facilities', content: 'kangkong, camote tops, alugbati, malunggay, banana trunks, bamboo shoots and other fast growing green plants, Molasses/mascuvado/ brown sugar Ripe and sweet fruits but not limited to banana, papaya, watermelon, ampalaya , tomato Trash Fish and gills, scales, offal of big fishes, golden kuhol meat Garlic, ginger, Pure coconut vinegar animal bones, egg shell, sea shell, kuhol shell 1 kl. Cooked, cool rice900 ml. fresh milk, 100 ml clear liquid from fermented rice, Plastic pail, Wooden ladle, Manila paper or cheese cloth, String or rubber bands, Weighing scale,  Chopping board,  Knife  Marker,  Strainer or nylon screen,' },
  { lesson_info_id: 34, lesson_id: 12, label: 'Assessment Criteria', content: 'Raw materials are prepared in accordance with enterprise practice. Fermentation period is set based on enterprise practice. Various concoctions are fermented following to organic practices. Concoctions are harvested based on fermentation period of the concoction.' },
  { lesson_info_id: 35, lesson_id: 12, label: 'Contents', content: 'Prepare raw materials, Fermentation period, Various concoctions, and Period of harvest' },
  { lesson_info_id: 36, lesson_id: 12, label: 'Tools Materials and Equipment', content: 'Storage area, kangkong, camote tops, alugbati, malunggay, banana trunks, bamboo shoots and other fast growing green plants, Molasse/mascuvado/ brown sugar Ripe and sweet fruits but not limited to banana, papaya, watermelon, ampalaya , tomato Trash Fish and gills, scales, offal of big fishes, golden kuhol, meat, Garlic, ginger, Pure coconut vinegar animal bones, egg shell, sea shell, kuhol shell 1 kl. Cooked, cool rice900 ml. fresh milk, 100 ml clear liquid from fermented rice, Plastic pail, Wooden ladle, Manila paper or cheese cloth, String or rubber bands, Weighing scale, chopping board,  Knife  Marker,  Strainer or nylon screen.' },
  { lesson_info_id: 37, lesson_id: 13, label: 'Assessment Criteria', content: 'Concoctions are contained in sanitized bottles and containers. Packaged concoctions are labeled and tagged in accordance with enterprise practice. Packaged concoctions are stored in appropriate place and temperature following organic practices. Production of concoctions are recorded using enterprise procedures.' },
  { lesson_info_id: 38, lesson_id: 13, label: 'Contents', content: 'Sanitize bottles and containers, Package concoctions, Appropriate place to store, and Production Record' },
  { lesson_info_id: 39, lesson_id: 13, label: 'Tools materials and equipment', content: 'Various concoctions, Concoction area, sanitized bottles, Labelling, and Storing area' },
];

const DEFAULT_LESSON_LINK: Omit<LessonLinkRecord, 'created_at' | 'updated_at'>[] = [
  { lesson_link_id: 1, lesson_id: 1, link: 'https://starmilling.com/poultry-chicken-breeds, https://www.google.com/search?sxsrf=AOaemvKfBotEpb8oaDfLzaZm4Le020JS1w:1631077568545&q=suitable+site+for+chicken+house&spell=1&sa=X&ved=2ahUKEwjGuMu4ze7yAhXNAogKHQSLCcoQBSgAegQIAhAx&biw=1367&bih=630, https://the-chicken-chick.com/tips-for-choosing-healthy-chicks/, https://poultrymanual.com/philippines-chicken-house-design' },
  { lesson_link_id: 2, lesson_id: 2, link: 'https://www.thepoultrysite.com/articles/putting-down-perfect-bedding-for-your-poultry, https://www.agriculturediary.com/poultry-farming-poultry-housing-equipment, https://www.farmanddairy.com/top-stories/how-to-set-up-a-brooder-for-baby-chicks/469356.html' },
  { lesson_link_id: 3, lesson_id: 3, link: 'https://agronomag.com/organic-chicken-feed-short-guide-on-the-nutrition-of-organic-chickens/, https://thefrugalchicken.com/organic-homemade-chicken-feed/, http://www.fao.org/3/t0207e/T0207E0a.htm, https://www.wikihow.com/Make-Feed-for-Chickens, https://petkeen.com/feeding-chicken-how-much-how-often/, https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/ad-libitum-feeding' },
  { lesson_link_id: 4, lesson_id: 4, link: 'https://www.researchgate.net/post/How-do-I-measure-the-growth-rate-and-feed-conversion-rates-of-poultry-birds, https://www.val-co.com/management-minute-broiler-weight-monitoring/, https://www.poultryhub.org/all-about-poultry/health-management, https://en.engormix.com/poultry-industry/articles/sanitation-cleaning-disinfecting-poultry-t34212.htm, https://www.hazardouswasteexperts.com/what-you-need-to-know-about-organic-waste/, https://thepoultrypunch.com/2020/09/poultry-farm-waste-disposal-management/, https://rapidcityjournal.com/lifestyles/food-and-cooking/raising-chickens-for-meat-know-your-breeds-and-how-to-harvest-humanely/article_b0740f44-11eb-5b20-8233-67e6ece30993.html, https://newsfromthecoop.hoovershatchery.com/harvestingmeatchickens/' },
  { lesson_link_id: 5, lesson_id: 5, link: 'https://www.hortmag.com/weekly-tips/how-to-know-if-garden-seed-is-viable, https://www.gardenersworld.com/how-to/grow-plants/how-to-test-seed-viability/, https://www.nrcs.usda.gov/Internet/FSE_PLANTMATERIALS/publications/idpmctn10748.pdf, https://smartlivingidea.com/how-to-prepare-a-seedbed/, http://www.heirloom-organics.com/guide/seedstartingcare.html, https://askinglot.com/how-do-you-maintain-seedlings, https://avrdc.org/prepare-growing-medium-seedling-production/' },
  { lesson_link_id: 6, lesson_id: 6, link: 'https://www.agrifarming.in/land-preparation-types-methods-objectives-advantages, http://www.knowledgebank.irri.org/step-by-step-production/pre-planting/land-preparation, https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/beneficial-microorganisms, https://knoji.com/article/examples-of-beneficial-microorganisms-and-what-they-do/, https://www.nrcs.usda.gov/Internet/FSE_DOCUMENTS/nrcs144p2_002239.pdf, https://www.bootstrapfarmer.com/blogs/how-to-grow-seedlings/easiest-way-to-water-your-seedlings, https://balconygardenweb.com/how-to-water-seedlings/' },
  { lesson_link_id: 7, lesson_id: 7, link: 'https://www.un.org/waterforlifedecade/iwrm.shtml, https://www.growpittsburgh.org/garden-and-farm-resources/info-hub/pest-disease-management/, https://www.hortweek.com/plant-rationing-comes-sales-fly/ornamentals/article/1710204, https://ph.search.yahoo.com/yhs/search?hspart=trp&hsimp=yhs-001&type=64891_070717&p=organic+fertilizer+application' },
  { lesson_link_id: 8, lesson_id: 8, link: 'https://agriculturistmusa.com/maturity-indices-types-and-determination/, https://morningchores.com/most-profitable-crops/, https://www.indeed.com/career-advice/career-development/classification-of-consumer-products, https://horticulture.ucdavis.edu/postharvest' },
  { lesson_link_id: 9, lesson_id: 9, link: 'https://www.progressivegardening.com/waste-management/siting-and-area-considerations.html' },
  { lesson_link_id: 10, lesson_id: 10, link: 'https://aseq-ehaq.ca/en/composting-101, https://directcompostsolutions.com/8-methods-composting/' },
  { lesson_link_id: 11, lesson_id: 11, link: 'https://www.youtube.com/watch?v=GouWt_DM544, https://www.youtube.com/watch?v=Qr3gZAbnrHM, https://www.youtube.com/watch?v=W58mZaJCArA, https://www.youtube.com/watch?v=peJeyMV2Plc, https://www.youtube.com/watch?v=lspuVsEW3vY, https://www.youtube.com/watch?v=6a1YezkoLjs, https://www.youtube.com/watch?v=A40KLz6fRk8, https://www.youtube.com/watch?v=UXysXSFuME0, https://www.youtube.com/watch?v=vCFkmuUL-S0, https://www.youtube.com/watch?v=XzdeuMz3MZ4, http://organic.da.gov.ph/images/IECs/FPJ.pdf' },
  { lesson_link_id: 12, lesson_id: 12, link: 'https://www.ctahr.hawaii.edu/oc/freepubs/pdf/SA-8.pdf /, Making Culturing Lactic Acid Bacteria (LAB) http://www.cgnfindia.com/lab.html, (3) Lactobacillus Serum http://theunconventionalfarmer.com/recipes/lactobacillus-serum/, https://businessdiary.com.ph/3470/how-to-make-fermented-fruit-juice-or-ff' },
];

const databasePromise = SQLite.openDatabaseAsync('student-offline-auth.db');

function toStudentUser(user: StoredStudentUser): StudentUser {
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: 'student',
    created_at: user.created_at,
  };
}

async function ensureDatabase() {
  const db = await databasePromise;
  await db.execAsync('PRAGMA journal_mode = WAL');

  const createStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS student_info (
      student_id INTEGER PRIMARY KEY NOT NULL,
      user_id INTEGER NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      middle_name TEXT,
      last_name TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      home_address TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS competencies (
      competency_id INTEGER PRIMARY KEY NOT NULL,
      competency_name TEXT NOT NULL,
      sector TEXT NOT NULL,
      qualification TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS modules (
      module_id INTEGER PRIMARY KEY NOT NULL,
      competency_id INTEGER NOT NULL,
      module_name TEXT NOT NULL,
      description TEXT NOT NULL,
      module_pdf TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (competency_id) REFERENCES competencies(competency_id)
    )`,
    `CREATE TABLE IF NOT EXISTS lessons (
      lesson_id INTEGER PRIMARY KEY NOT NULL,
      module_id INTEGER NOT NULL,
      lesson_name TEXT NOT NULL,
      order_number INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (module_id) REFERENCES modules(module_id)
    )`,
    `CREATE TABLE IF NOT EXISTS lesson_content (
      lesson_content_id INTEGER PRIMARY KEY NOT NULL,
      lesson_id INTEGER NOT NULL,
      content_name TEXT NOT NULL,
      objectives TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
    )`,
    (`
      CREATE TABLE IF NOT EXISTS content_info (
        content_info_id INTEGER PRIMARY KEY NOT NULL,
        lesson_content_id INTEGER NOT NULL,
        label TEXT NOT NULL,
        description TEXT NOT NULL,
        images TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
      )  
    `),
    `CREATE TABLE IF NOT EXISTS lesson_info (
      lesson_info_id INTEGER PRIMARY KEY NOT NULL,
      lesson_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      content TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
    )`,
    `CREATE TABLE IF NOT EXISTS lesson_link (
      lesson_link_id INTEGER PRIMARY KEY NOT NULL,
      lesson_id INTEGER NOT NULL,
      link TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
    )`,
    `CREATE TABLE IF NOT EXISTS question_instruct (
        instruct_id INTEGER PRIMARY KEY NOT NULL,
        lesson_content_id INTEGER NOT NULL,
        question_instruction TEXT NOT NULL,
        question_title TEXT NOT NULL,
        question_label TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
    )`,
    `CREATE TABLE IF NOT EXISTS question_content (
        question_id INTEGER PRIMARY KEY NOT NULL,
        lesson_content_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        question_type TEXT NOT NULL,
        question_order INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
    )`,
    `CREATE TABLE IF NOT EXISTS question_choice (
        choice_id INTEGER PRIMARY KEY NOT NULL,
        question_id INTEGER NOT NULL,
        choice_label TEXT NOT NULL,
        choice_text TEXT NOT NULL,
        is_correct TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (question_id) REFERENCES question_content(question_id)
    )`,
    `CREATE TABLE IF NOT EXISTS job_sheet (
        job_id INTEGER PRIMARY KEY NOT NULL,
        lesson_content_id INTEGER NOT NULL,
        job_title TEXT NOT NULL,
        job_objectives TEXT NOT NULL,
        job_materials TEXT NOT NULL,
        job_steps TEXT NOT NULL,
        job_assesment_method TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(lesson_content_id)
    )`,
    `CREATE TABLE IF NOT EXISTS question_answers (
        answer_id INTEGER PRIMARY KEY NOT NULL,
        question_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        answer_text TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (question_id) REFERENCES question_content(question_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`,
  ];

  for (const sql of createStatements) {
    try {
      await db.execAsync(sql);
    } catch (error) {
      console.error('Database table creation failed:', error);
    }
  }

  try {
    await db.execAsync('ALTER TABLE modules ADD COLUMN module_pdf TEXT DEFAULT ""');
  } catch {
    // Column already exists or table not yet created; ignore.
  }

  try {
    const existing = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM users');
    if ((existing?.count ?? 0) === 0) {
      await db.runAsync(
        'INSERT INTO users (user_id, username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          DEFAULT_STUDENT_ACCOUNT.user_id,
          DEFAULT_STUDENT_ACCOUNT.username,
          DEFAULT_STUDENT_ACCOUNT.email,
          DEFAULT_STUDENT_ACCOUNT.password,
          DEFAULT_STUDENT_ACCOUNT.role,
          DEFAULT_STUDENT_ACCOUNT.created_at,
        ]
      );
    }
  } catch (error) {
    console.error('Default student account seeding failed:', error);
  }

  try {
    for (let index = 0; index < DEFAULT_COMPETENCIES.length; index += 1) {
      const competency = DEFAULT_COMPETENCIES[index];
      const competencyId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM competencies WHERE competency_name = ?',
        [competency.competency_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO competencies
            (competency_id, competency_name, sector, qualification, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            competencyId,
            competency.competency_name,
            competency.sector,
            competency.qualification,
            competency.status,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Competency seeding failed:', error);
  }

  try {
    for (let index = 0; index < DEFAULT_MODULES.length; index += 1) {
      const moduleItem = DEFAULT_MODULES[index];
      const moduleId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM modules WHERE module_name = ?',
        [moduleItem.module_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO modules
            (module_id, competency_id, module_name, description, module_pdf, thumbnail, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            moduleId,
            moduleItem.competency_id,
            moduleItem.module_name,
            moduleItem.description,
            moduleItem.module_pdf,
            moduleItem.thumbnail,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Module seeding failed:', error);
  }

  try {
    for (let index = 0; index < DEFAULT_LESSONS.length; index += 1) {
      const lessonItem = DEFAULT_LESSONS[index];
      const lessonId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM lessons WHERE lesson_name = ?',
        [lessonItem.lesson_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO lessons
            (lesson_id, module_id, lesson_name, order_number, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
          [
            lessonId,
            lessonItem.module_id,
            lessonItem.lesson_name,
            lessonItem.order_number,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Lesson seeding failed:', error);
  }

  try {
    for (let index = 0; index < DEFAULT_LESSON_CONTENTS.length; index += 1) {
      const contentItem = DEFAULT_LESSON_CONTENTS[index];
      const contentId = index + 1;
      const now = new Date().toISOString();

      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM lesson_content WHERE content_name = ?',
        [contentItem.content_name]
      );

      if ((existing?.count ?? 0) === 0) {
        await db.runAsync(
          `INSERT INTO lesson_content
            (lesson_content_id, lesson_id, content_name, objectives, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
          [
            contentId,
            contentItem.lesson_id,
            contentItem.content_name,
            contentItem.objectives,
            now,
            now,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Lesson content seeding failed:', error);
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeText(value: string) {
  return value.trim();
}

function normalizeNullableText(value: string | null | undefined) {
  const normalized = String(value ?? '').trim();
  return normalized.length ? normalized : null;
}

async function findUserByEmail(email: string) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<StoredStudentUser>('SELECT * FROM users WHERE email = ?', [normalizeEmail(email)]);
}

export async function registerStudent(payload: { username: string; email: string; password: string }) {
  const username = normalizeText(payload.username);
  const email = normalizeEmail(payload.email);
  const password = normalizeText(payload.password);

  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required.');
  }

  await ensureDatabase();
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('A student account with that email already exists.');
  }

  const db = await databasePromise;
  const highestUser = await db.getFirstAsync<{ user_id: number }>('SELECT COALESCE(MAX(user_id), 0) + 1 AS user_id FROM users');
  const userId = highestUser?.user_id ?? 1;
  const createdAt = new Date().toISOString();

  await db.runAsync(
    'INSERT INTO users (user_id, username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, username, email, password, 'student', createdAt]
  );

  return {
    message: 'Student account created successfully.',
    user: toStudentUser({ user_id: userId, username, email, password, role: 'student', created_at: createdAt }),
  } satisfies AuthResponse;
}

export async function loginStudent(payload: { email: string; password: string }) {
  const email = normalizeEmail(payload.email);
  const password = normalizeText(payload.password);

  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error('Invalid student credentials.');
  }

  return {
    message: 'Student login successful.',
    user: toStudentUser(user),
  } satisfies AuthResponse;
}

function validateProfilePayload(payload: Omit<StudentProfile, 'student_id' | 'created_at' | 'updated_at'>) {
  const normalized = {
    user_id: Number(payload.user_id),
    first_name: normalizeText(payload.first_name || ''),
    middle_name: normalizeNullableText(payload.middle_name),
    last_name: normalizeText(payload.last_name || ''),
    birthdate: normalizeText(payload.birthdate || ''),
    home_address: normalizeText(payload.home_address || ''),
    grade_level: normalizeText(payload.grade_level || ''),
  };

  if (!Number.isInteger(normalized.user_id) || normalized.user_id <= 0) {
    throw new Error('A valid user_id is required.');
  }

  if (
    !normalized.first_name ||
    !normalized.last_name ||
    !normalized.birthdate ||
    !normalized.home_address ||
    !normalized.grade_level
  ) {
    throw new Error('first_name, last_name, birthdate, home_address, and grade_level are required.');
  }

  return normalized;
}

export async function listStudentProfiles() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<StudentProfile>('SELECT * FROM student_info ORDER BY student_id ASC');
}

export async function getStudentProfileByUserId(userId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<StudentProfile>('SELECT * FROM student_info WHERE user_id = ?', [userId]);
}

export async function createStudentProfile(payload: Omit<StudentProfile, 'student_id' | 'created_at' | 'updated_at'>) {
  const normalized = validateProfilePayload(payload);

  await ensureDatabase();
  const db = await databasePromise;

  const existing = await getStudentProfileByUserId(normalized.user_id);
  if (existing) {
    throw new Error('A student profile already exists for this user.');
  }

  const row = await db.getFirstAsync<{ student_id: number }>(
    'SELECT COALESCE(MAX(student_id), 0) + 1 AS student_id FROM student_info'
  );
  const studentId = row?.student_id ?? 1;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO student_info
      (student_id, user_id, first_name, middle_name, last_name, birthdate, home_address, grade_level, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      normalized.user_id,
      normalized.first_name,
      normalized.middle_name,
      normalized.last_name,
      normalized.birthdate,
      normalized.home_address,
      normalized.grade_level,
      now,
      now,
    ]
  );

  return {
    student_id: studentId,
    ...normalized,
    created_at: now,
    updated_at: now,
  } satisfies StudentProfile;
}

export async function updateStudentProfile(
  studentId: number,
  payload: Omit<StudentProfile, 'student_id' | 'created_at' | 'updated_at'>
) {
  const normalized = validateProfilePayload(payload);

  await ensureDatabase();
  const db = await databasePromise;
  const existing = await db.getFirstAsync<StudentProfile>('SELECT * FROM student_info WHERE student_id = ?', [studentId]);

  if (!existing) {
    throw new Error('Student profile not found.');
  }

  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE student_info
      SET first_name = ?, middle_name = ?, last_name = ?, birthdate = ?, home_address = ?, grade_level = ?, updated_at = ?
      WHERE student_id = ?`,
    [
      normalized.first_name,
      normalized.middle_name,
      normalized.last_name,
      normalized.birthdate,
      normalized.home_address,
      normalized.grade_level,
      now,
      studentId,
    ]
  );

  return {
    ...existing,
    ...normalized,
    updated_at: now,
  } satisfies StudentProfile;
}

export async function deleteStudentProfile(studentId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  const result = await db.runAsync('DELETE FROM student_info WHERE student_id = ?', [studentId]);
  return (result.changes ?? 0) > 0;
}

export async function getUserById(userId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<StoredStudentUser>('SELECT * FROM users WHERE user_id = ?', [userId]);
}

export async function listCompetencies() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<CompetencyRecord>('SELECT * FROM competencies ORDER BY competency_id ASC');
}

export async function listModules() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<ModuleRecord>('SELECT * FROM modules ORDER BY module_id ASC');
}

export async function getModuleByCompetencyId(competencyId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getFirstAsync<ModuleRecord>('SELECT * FROM modules WHERE competency_id = ?', [competencyId]);
}

export async function listLessons() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonRecord>('SELECT * FROM lessons ORDER BY module_id ASC, order_number ASC, lesson_id ASC');
}

export async function getLessonsByModuleId(moduleId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonRecord>('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_number ASC, lesson_id ASC', [moduleId]);
}

export async function getLessonById(lessonId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  const rows = await db.getAllAsync<LessonRecord>('SELECT * FROM lessons WHERE lesson_id = ?', [lessonId]);
  return rows[0] ?? null;
}

export async function getModuleById(moduleId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  const rows = await db.getAllAsync<ModuleRecord>('SELECT * FROM modules WHERE module_id = ?', [moduleId]);
  return rows[0] ?? null;
}

export async function listLessonContent() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonContentRecord>('SELECT * FROM lesson_content ORDER BY lesson_id ASC, lesson_content_id ASC');
}

export async function listLessonContentByLessonId(lessonId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonContentRecord>('SELECT * FROM lesson_content WHERE lesson_id = ? ORDER BY lesson_content_id ASC', [lessonId]);
}

export async function listContentInfo() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<ContentInfoRecord>('SELECT * FROM content_info ORDER BY content_info_id ASC');
}

export async function listContentInfoByLessonContentId(lessonContentId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<ContentInfoRecord>('SELECT * FROM content_info WHERE lesson_content_id = ? ORDER BY content_info_id ASC', [lessonContentId]);
}

export async function getContentInfoById(contentInfoId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  const rows = await db.getAllAsync<ContentInfoRecord>('SELECT * FROM content_info WHERE content_info_id = ?', [contentInfoId]);
  return rows[0] ?? null;
}

export async function listLessonInfoByLessonId(lessonId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonInfoRecord>('SELECT * FROM lesson_info WHERE lesson_id = ? ORDER BY lesson_info_id ASC', [lessonId]);
}

export async function listLessonLinkByLessonId(lessonId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<LessonLinkRecord>('SELECT * FROM lesson_link WHERE lesson_id = ? ORDER BY lesson_link_id ASC', [lessonId]);
}

export async function listQuestionInstructByLessonContentId(lessonContentId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<QuestionInstructionRecord>('SELECT * FROM question_instruct WHERE lesson_content_id = ? ORDER BY instruct_id ASC', [lessonContentId]);
}

export async function listQuestionContentByLessonContentId(lessonContentId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<QuestionContentRecord>('SELECT * FROM question_content WHERE lesson_content_id = ? ORDER BY question_order ASC, question_id ASC', [lessonContentId]);
}

export async function listQuestionChoiceByQuestionId(questionId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<QuestionChoiceRecord>('SELECT * FROM question_choice WHERE question_id = ? ORDER BY choice_id ASC', [questionId]);
}

export async function getLessonContentById(lessonContentId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  const rows = await db.getAllAsync<LessonContentRecord>('SELECT * FROM lesson_content WHERE lesson_content_id = ?', [lessonContentId]);
  return rows[0] ?? null;
}

export async function resetAndSeedLocalData() {
  await ensureDatabase();
  const db = await databasePromise;

  const competencies = await db.getAllAsync<CompetencyRecord>('SELECT * FROM competencies ORDER BY competency_id ASC');
  const modules = await db.getAllAsync<ModuleRecord>('SELECT * FROM modules ORDER BY module_id ASC');
  const lessons = await db.getAllAsync<LessonRecord>('SELECT * FROM lessons ORDER BY lesson_id ASC');
  const lessonContents = await db.getAllAsync<LessonContentRecord>('SELECT * FROM lesson_content ORDER BY lesson_content_id ASC');
  const contentInfos = await db.getAllAsync<ContentInfoRecord>('SELECT * FROM content_info ORDER BY content_info_id ASC');
  const lessonInfos = await db.getAllAsync<LessonInfoRecord>('SELECT * FROM lesson_info ORDER BY lesson_info_id ASC');
  const lessonLinks = await db.getAllAsync<LessonLinkRecord>('SELECT * FROM lesson_link ORDER BY lesson_link_id ASC');
  const questionInstructs = await db.getAllAsync<QuestionInstructionRecord>('SELECT * FROM question_instruct ORDER BY instruct_id ASC');
  const questionContents = await db.getAllAsync<QuestionContentRecord>('SELECT * FROM question_content ORDER BY question_id ASC');
  const questionChoices = await db.getAllAsync<QuestionChoiceRecord>('SELECT * FROM question_choice ORDER BY choice_id ASC');

  const hasDefaultCompetencies = DEFAULT_COMPETENCIES.every((expected) =>
    competencies.some((c) => c.competency_name.toLowerCase() === expected.competency_name.toLowerCase())
  );
  const hasDefaultModules = DEFAULT_MODULES.every((expected) =>
    modules.some((m) => m.module_name.toLowerCase() === expected.module_name.toLowerCase())
  );
  const hasDefaultLessons = DEFAULT_LESSONS.every((expected) =>
    lessons.some((l) => l.lesson_name.toLowerCase() === expected.lesson_name.toLowerCase())
  );
  const hasDefaultLessonContents = DEFAULT_LESSON_CONTENTS.every((expected) =>
    lessonContents.some((lc) => lc.content_name.toLowerCase() === expected.content_name.toLowerCase())
  );
  const hasDefaultContentInfo = DEFAULT_CONTENT_INFO.every((expected) =>
    contentInfos.some((ci) => String(ci.content_info_id) === String(expected.content_info_id))
  );
  const hasDefaultLessonInfo = DEFAULT_LESSON_INFO.every((expected) =>
    lessonInfos.some((li) => String(li.lesson_info_id) === String(expected.lesson_info_id))
  );
  const hasDefaultLessonLink = DEFAULT_LESSON_LINK.every((expected) =>
    lessonLinks.some((ll) => String(ll.lesson_link_id) === String(expected.lesson_link_id))
  );
  const hasDefaultQuestionInstruct = DEFAULT_QUESTION_INSTRUCT.every((expected) =>
    questionInstructs.some((qi) => String(qi.instruct_id) === String(expected.instruct_id))
  );
  const hasDefaultQuestionContent = DEFAULT_QUESTION_CONTENT.every((expected) =>
    questionContents.some((qc) => String(qc.question_id) === String(expected.question_id))
  );
  const hasDefaultQuestionChoice = DEFAULT_QUESTION_CHOICE.every((expected) =>
    questionChoices.some((qch) => String(qch.choice_id) === String(expected.choice_id))
  );

  if (hasDefaultCompetencies && hasDefaultModules && hasDefaultLessons && hasDefaultLessonContents && hasDefaultContentInfo && hasDefaultLessonInfo && hasDefaultLessonLink && hasDefaultQuestionInstruct && hasDefaultQuestionContent && hasDefaultQuestionChoice && competencies.length > 0 && modules.length > 0 && lessons.length > 0 && lessonContents.length > 0 && contentInfos.length > 0) {
    return {
      competencies: competencies.length,
      modules: modules.length,
      lessons: lessons.length,
      lessonContents: lessonContents.length,
      contentInfo: contentInfos.length,
      lessonInfo: lessonInfos.length,
      lessonLink: lessonLinks.length,
      questionInstruct: questionInstructs.length,
      questionContent: questionContents.length,
      questionChoice: questionChoices.length,
      alreadyImported: true,
    };
  }

  const now = new Date().toISOString();

  await db.runAsync('DELETE FROM lesson_content');
  await db.runAsync('DELETE FROM lessons');
  await db.runAsync('DELETE FROM modules');
  await db.runAsync('DELETE FROM competencies');
  await db.runAsync('DELETE FROM content_info');
  await db.runAsync('DELETE FROM lesson_info');
  await db.runAsync('DELETE FROM lesson_link');
  await db.runAsync('DELETE FROM question_instruct');
  await db.runAsync('DELETE FROM question_content');
  await db.runAsync('DELETE FROM question_choice');
  try {
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'lesson_content'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'lessons'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'modules'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'competencies'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'content_info'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'lesson_info'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'lesson_link'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'question_instruct'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'question_content'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'question_choice'");
  } catch {
    // sqlite_sequence may not exist in some SQLite versions/environments.
  }

  for (let index = 0; index < DEFAULT_COMPETENCIES.length; index += 1) {
    const competency = DEFAULT_COMPETENCIES[index];
    const competencyId = index + 1;

    await db.runAsync(
      `INSERT INTO competencies
        (competency_id, competency_name, sector, qualification, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [competencyId, competency.competency_name, competency.sector, competency.qualification, competency.status, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_MODULES.length; index += 1) {
    const moduleItem = DEFAULT_MODULES[index];
    const moduleId = index + 1;

    await db.runAsync(
      `INSERT INTO modules
        (module_id, competency_id, module_name, description, module_pdf, thumbnail, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [moduleId, moduleItem.competency_id, moduleItem.module_name, moduleItem.description, moduleItem.module_pdf, moduleItem.thumbnail, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_LESSONS.length; index += 1) {
    const lessonItem = DEFAULT_LESSONS[index];
    const lessonId = index + 1;

    await db.runAsync(
      `INSERT INTO lessons
        (lesson_id, module_id, lesson_name, order_number, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [lessonId, lessonItem.module_id, lessonItem.lesson_name, lessonItem.order_number, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_LESSON_CONTENTS.length; index += 1) {
    const contentItem = DEFAULT_LESSON_CONTENTS[index];
    const contentId = index + 1;

    await db.runAsync(
      `INSERT INTO lesson_content
        (lesson_content_id, lesson_id, content_name, objectives, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [contentId, contentItem.lesson_id, contentItem.content_name, contentItem.objectives, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_CONTENT_INFO.length; index += 1) {
    const infoItem = DEFAULT_CONTENT_INFO[index];

    await db.runAsync(
      `INSERT INTO content_info
        (content_info_id, lesson_content_id, label, description, images, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [infoItem.content_info_id, infoItem.lesson_content_id, infoItem.label, infoItem.description, infoItem.images, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_LESSON_INFO.length; index += 1) {
    const infoItem = DEFAULT_LESSON_INFO[index];

    await db.runAsync(
      `INSERT INTO lesson_info
        (lesson_info_id, lesson_id, label, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [infoItem.lesson_info_id, infoItem.lesson_id, infoItem.label, infoItem.content, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_LESSON_LINK.length; index += 1) {
    const linkItem = DEFAULT_LESSON_LINK[index];

    await db.runAsync(
      `INSERT INTO lesson_link
        (lesson_link_id, lesson_id, link, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)`,
      [linkItem.lesson_link_id, linkItem.lesson_id, linkItem.link, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_QUESTION_INSTRUCT.length; index += 1) {
    const instructItem = DEFAULT_QUESTION_INSTRUCT[index];

    await db.runAsync(
      `INSERT INTO question_instruct
        (instruct_id, lesson_content_id, question_instruction, question_title, question_label, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [instructItem.instruct_id, instructItem.lesson_content_id, instructItem.question_instruction, instructItem.question_title, instructItem.question_label, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_QUESTION_CONTENT.length; index += 1) {
    const questionItem = DEFAULT_QUESTION_CONTENT[index];

    await db.runAsync(
      `INSERT INTO question_content
        (question_id, lesson_content_id, question, question_type, question_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [questionItem.question_id, questionItem.lesson_content_id, questionItem.question, questionItem.question_type, questionItem.question_order, now, now]
    );
  }

  for (let index = 0; index < DEFAULT_QUESTION_CHOICE.length; index += 1) {
    const choiceItem = DEFAULT_QUESTION_CHOICE[index];

    await db.runAsync(
      `INSERT INTO question_choice
        (choice_id, question_id, choice_label, choice_text, is_correct, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [choiceItem.choice_id, choiceItem.question_id, choiceItem.choice_label, choiceItem.choice_text, choiceItem.is_correct, now, now]
    );
  }

  return {
    competencies: DEFAULT_COMPETENCIES.length,
    modules: DEFAULT_MODULES.length,
    lessons: DEFAULT_LESSONS.length,
    lessonContents: DEFAULT_LESSON_CONTENTS.length,
    contentInfo: DEFAULT_CONTENT_INFO.length,
    lessonInfo: DEFAULT_LESSON_INFO.length,
    lessonLink: DEFAULT_LESSON_LINK.length,
    questionInstruct: DEFAULT_QUESTION_INSTRUCT.length,
    questionContent: DEFAULT_QUESTION_CONTENT.length,
    questionChoice: DEFAULT_QUESTION_CHOICE.length,
    questionAnswers: 0,
    alreadyImported: false,
  };
}

export async function listQuestionAnswers() {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<QuestionAnswerRecord>('SELECT * FROM question_answers ORDER BY answer_id ASC');
}

export async function listQuestionAnswersByUser(userId: number) {
  await ensureDatabase();
  const db = await databasePromise;
  return db.getAllAsync<QuestionAnswerRecord>('SELECT * FROM question_answers WHERE user_id = ? ORDER BY answer_id ASC', [userId]);
}

export async function listQuestionAnswersByUserAndQuestions(userId: number, questionIds: number[]) {
  await ensureDatabase();
  const db = await databasePromise;
  const placeholders = questionIds.map(() => '?').join(',');
  const params = [userId, ...questionIds];
  return db.getAllAsync<QuestionAnswerRecord>(
    `SELECT * FROM question_answers WHERE user_id = ? AND question_id IN (${placeholders}) ORDER BY answer_id ASC`,
    params
  );
}

export async function createQuestionAnswer(payload: { question_id: number; user_id: number; answer_text: string }) {
  await ensureDatabase();
  const db = await databasePromise;

  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM question_answers WHERE question_id = ? AND user_id = ?',
    [payload.question_id, payload.user_id]
  );

  if ((existing?.count ?? 0) > 0) {
    const updatedAt = new Date().toISOString();
    await db.runAsync(
      `UPDATE question_answers SET answer_text = ?, updated_at = ? WHERE question_id = ? AND user_id = ?`,
      [payload.answer_text, updatedAt, payload.question_id, payload.user_id]
    );
    const updated = await db.getFirstAsync<QuestionAnswerRecord>(
      'SELECT * FROM question_answers WHERE question_id = ? AND user_id = ?',
      [payload.question_id, payload.user_id]
    );
    return updated ?? null;
  }

  const row = await db.getFirstAsync<{ answer_id: number }>(
    'SELECT COALESCE(MAX(answer_id), 0) + 1 AS answer_id FROM question_answers'
  );
  const answerId = row?.answer_id ?? 1;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO question_answers (answer_id, question_id, user_id, answer_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [answerId, payload.question_id, payload.user_id, payload.answer_text, now, now]
  );

  return {
    answer_id: answerId,
    question_id: payload.question_id,
    user_id: payload.user_id,
    answer_text: payload.answer_text,
    created_at: now,
    updated_at: now,
  } satisfies QuestionAnswerRecord;
}

export async function createQuestionAnswersBatch(payload: { user_id: number; answers: { question_id: number; answer_text: string }[] }) {
  await ensureDatabase();
  const db = await databasePromise;

  const now = new Date().toISOString();
  const created: QuestionAnswerRecord[] = [];

  for (const item of payload.answers) {
    const existing = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM question_answers WHERE question_id = ? AND user_id = ?',
      [item.question_id, payload.user_id]
    );

    if ((existing?.count ?? 0) > 0) {
      await db.runAsync(
        `UPDATE question_answers SET answer_text = ?, updated_at = ? WHERE question_id = ? AND user_id = ?`,
        [item.answer_text, now, item.question_id, payload.user_id]
      );
      const updated = await db.getFirstAsync<QuestionAnswerRecord>(
        'SELECT * FROM question_answers WHERE question_id = ? AND user_id = ?',
        [item.question_id, payload.user_id]
      );
      if (updated) {
        created.push(updated);
      }
      continue;
    }

    const row = await db.getFirstAsync<{ answer_id: number }>(
      'SELECT COALESCE(MAX(answer_id), 0) + 1 AS answer_id FROM question_answers'
    );
    const answerId = row?.answer_id ?? 1;

    await db.runAsync(
      `INSERT INTO question_answers (answer_id, question_id, user_id, answer_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [answerId, item.question_id, payload.user_id, item.answer_text, now, now]
    );

    created.push({
      answer_id: answerId,
      question_id: item.question_id,
      user_id: payload.user_id,
      answer_text: item.answer_text,
      created_at: now,
      updated_at: now,
    });
  }

  return created;
}
