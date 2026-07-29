const { createJobInstruct } = require('../src/models/contentJobSheetModel');
const { listJobInstruct } = require('../src/models/contentJobSheetModel');

const SEED_JOB_SHEET = [
    //m1; l1; c1
    {
        job_id: 1,
        lesson_content_id: 1,
        job_title: 'Identifying breeds of Chicken',
        job_objectives: 'At the end of this module the student should be able to identify breeds of chicken.',
        job_materials: 'PPE, broiler, layer, dual purpose',
        job_steps: 'Wear the PPE, Observe the physical appearance of chicken, Look for their differences, Identify, which is broiler, layer and dual purpose, Do housekeeping.',
        job_assesment_method: '',
    },
    //m1; l1; c2
    {
        job_id: 2,
        lesson_content_id: 2,
        job_title: 'Selecting Healthy Chicks',
        job_objectives: 'At the end of this module the student should be able to select and identify healthy chicks.',
        job_materials: 'PPE, chicks',
        job_steps: 'Wear the PPE, Examine the chicks’ physical appearance, Describe its eyes, feathers beak and legs, Look for its uniformity, Identify if it’s healthy, and Do housekeeping.',
        job_assesment_method: '',
    },
    //m1; l2; c2
    {
        job_id: 3,
        lesson_content_id: 7,
        job_title: 'Preparing and securing bedding materials',
        job_objectives: 'At the end of this module the student should be able to prepare and secure chosen bedding materials.',
        job_materials: 'PPE, Rice hull, Saw dust , Coco coir and Rice straw',
        job_steps: 'Wear the PPE. Gather some bedding materials (rice hull, saw dust, coco coir and rice straw. Choose one bedding material which is the best absorbent. Stored it in a warm and dry place. Spread it evenly in a poultry house. Do housekeeping.',
        job_assesment_method: '',
    },
    //m1; l2; c3
    {
        job_id: 4,
        lesson_content_id: 8,
        job_title: 'Setting-up brooding facility',
        job_objectives: 'At the end of this module the student should be able to set-up brooding facility',
        job_materials: 'PPE, waterer, water, feeder, feeds, chicks, bedding material.',
        job_steps: 'Wear the PPE. Change the bedding materials. Wash and sanitize waterer and feeder. Pour some clean fresh water into the waterer. Put enough feeds into the feeder. Arrange them properly inside the brooding box. Bring chicks inside the brooder box. Do housekeeping.',
        job_assesment_method: '',
    },
    //m1; l3; c2
    {
        job_id: 5,
        lesson_content_id: 10,
        job_title: 'Preparing feeding materials',
        job_objectives: 'At the end of this module you should be able to  prepare feeding materials.',
        job_materials: 'PPE, whole maize meal soya fish meal maize bran limestone powder',
        job_steps: 'wear the PPE. Measure the ingredients into a container. Mix the ingredients until they are thoroughly combined. Give each chicken 0.28 pounds (0.13 kg) of feed per day. Store the chicken feed in a cool, dry place for up to 6 months. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l1; c1
    {
        job_id: 6,
        lesson_content_id: 19,
        job_title: 'Selecting viable seeds',
        job_objectives: 'At the end of this module the student should be able to identify  and select viable seeds.',
        job_materials: 'PPE, different kind of vegetable seeds',
        job_steps: 'Wear the PPE. Prepare the different kinds of vegetable seeds. Observe and Examine its physical characteristics. Identify which seeds are viable. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l1; c2
    {
        job_id: 7,
        lesson_content_id: 20,
        job_title: 'Preparing Seedbed',
        job_objectives: 'At the end of this module the student should be able to prepare seedbed.',
        job_materials: 'PPE, harrow, field',
        job_steps: 'Wear the PPE. Gather tools and materials. Visit the field. Clearing the field. Perform Ploughing. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l1; c3
    {
        job_id: 8,
        lesson_content_id: 21,
        job_title: 'Maintaining Seedlings',
        job_objectives: 'At the end of this module the student should be able to maintain of seedlings.',
        job_materials: 'PPE, Trowel, Sprinkler, Container, water, seedlings',
        job_steps: 'Wear the PPE.',
        job_assesment_method: '',
    },
    //m2; l1; c4
    {
        job_id: 9,
        lesson_content_id: 22,
        job_title: 'Preparing the growing media',
        job_objectives: 'At the end of this module you should be able to prepare the different kinds  of growing media.',
        job_materials: 'PPE, farm, stocks, different growing media ( carbonized rice hull, animal manure, compost).',
        job_steps: 'Wear the PPE. Gather the tools and materials. Visit a farm. Gather the available growing media. Mixing all the growing media. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l2; c1
    {
        job_id: 10,
        lesson_content_id: 23,
        job_title: 'Performing Land Preparation',
        job_objectives: 'At the end of this module the student should be able to perform land preparation.',
        job_materials: 'PPE, trowel, shovel, plow, rake, farm',
        job_steps: 'Wear PPE. Gather the tools and Materials. Visit a Farm. Do clearing the area. Perform Ploughing. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l2; c3
    {
        job_id: 11,
        lesson_content_id: 25,
        job_title: 'Planting/Transplanting Vegetable Seedlings',
        job_objectives: 'At the end of this module the student should be able to transplant vegetable seedlings.',
        job_materials: 'PPE, Trowel, Seedlings, field',
        job_steps: 'Wear the PPE. Prepare the tools and materials. Go to the Field. Measure the proper planting distance of vegetables. Make hole for seedlings. Do transplanting of seedlings.',
        job_assesment_method: '',
    },
    //m2; l2; c4
    {
        job_id: 12,
        lesson_content_id: 26,
        job_title: 'Watering Seedlings',
        job_objectives: 'At the end of this module the student should be able to water seedlings.',
        job_materials: 'PPE, container, sprinkler, field, newly planted seedlings',
        job_steps: 'Wear the PPE. Prepare the tools and materials. Go to the Field. Pitch water from the water supply. Do watering on seedlings. Do house keeping.',
        job_assesment_method: '',
    },
    //m2; l3; c1
    {
        job_id: 13,
        lesson_content_id: 27,
        job_title: 'Implementing water management',
        job_objectives: 'At the end of this module you should be able to implement water management.',
        job_materials: 'Sufficient Water source , hose, shovel',
        job_steps: 'Wear the PPE. Gather the tools and materials. Go to the Field. Make a drainage canal along the plot. Install the hose. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l3; c2
    {
        job_id: 14,
        lesson_content_id: 28,
        job_title: 'Controlling pest and diseases',
        job_objectives: 'At the end of this module you should be able to control pest and diseases.',
        job_materials: 'PPE, botanical repellant, sprayer and water, field',
        job_steps: 'Wear the PPE. Prepare botanical repellant. Put some botanical repellant into a sprayer of water. Apply it into the filed. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l3; c3
    {
        job_id: 15,
        lesson_content_id: 29,
        job_title: 'Replanting',
        job_objectives: 'At the end of this module you should be able to replant missing hills.',
        job_materials: 'PPE, seedlings, trowel, garden plot',
        job_steps: 'Wear the PPE. Identify missing hills. Prepare seedling to be used in replanting. Plant seed prepared seedlings on missing hills. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l3; c4
    {
        job_id: 16,
        lesson_content_id: 30,
        job_title: 'Rejuvenating/ rationing plants',
        job_objectives: 'At the end of this module you should be able to perform the techniques on rationing plants.',
        job_materials: 'PPE, Pruning shear, container, crops',
        job_steps: 'Wear the PPE. Gather the tools and materials. Go to your garden. Check your crops if it’s infested by pest and diseases. Do pruning. Do housekeeping.',
        job_assesment_method: '',
    },
    //m2; l4; c2
    {
        job_id: 17,
        lesson_content_id: 33,
        job_title: 'Performing harvesting vegetables',
        job_objectives: 'At the end of this module you should be able to perform proper harvesting in vegetables.',
        job_materials: 'PPE, harvesting tools, containers',
        job_steps: 'Wear the PPE. Gather the tools and materials. Going to the field. Check the appropriate maturity index of your crops. Perform Harvesting. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l1; c1
    {
        job_id: 18,
        lesson_content_id: 36,
        job_title: 'Select composting Site',
        job_objectives: 'At the end of this module the student should be able to select composting site.',
        job_materials: 'PPE, composting area',
        job_steps: 'Wear the PPE. Observe the composting area. Select the area which is not sloppy. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l1; c2
    {
        job_id: 19,
        lesson_content_id: 37,
        job_title: 'Preparing site layout',
        job_objectives: 'At the end of this module the student should be able to perform and preparing composting site layout.',
        job_materials: 'PPE, composting area, Tools and Materials in lay outing',
        job_steps: 'Wear the PPE. Determine good layout minimizes material handling and helps control outside factor. Barriers should be put in place to minimize contamination. Running a pump and sprinkler is a cost-effective way to bring moisture content back to optimal levels. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l1; c3
    {
        job_id: 20,
        lesson_content_id: 38,
        job_title: 'Preparing composting bed',
        job_objectives: 'At the end of this module the student should be able to Preparing composting bed',
        job_materials: 'PPE, composting area, bamboo, shovel, raw material (animal manure, weeds, kitchens waste and crop residues).',
        job_steps: 'Wear the PPE. Identify the raw materials. Prepare bed for composting. Check if the raw materials are mix. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l1; c4
    {
        job_id: 21,
        lesson_content_id: 39,
        job_title: 'Gathering raw materials in composting',
        job_objectives: 'At the end of this module you should be able to to gather the raw materials for composting.',
        job_materials: 'PPE, raw materials, water, spading fork.',
        job_steps: 'Wear the PPE. Gather the “green and brown “materials. Put into the pile or compost pit. Poured water regularly. Mix the materials in pile using spading fork. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l1; c5
    {
        job_id: 22,
        lesson_content_id: 40,
        job_title: 'Identifying raw materials for composting',
        job_objectives: 'At the end of this module you should be able to identify the raw materials uses for composting.',
        job_materials: 'PPE, dried leaves, rice straw, crop residues animal manure, oyster shell and egg shell.',
        job_steps: 'Wear the PPE. Identify the green and brown raw materials. Utilize the manure animal manure. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l2; c1
    {
        job_id: 23,
        lesson_content_id: 41,
        job_title: 'Identifying  different types of composting method',
        job_objectives: 'At the end of this module the student should be able to Identify the different types of composting method.',
        job_materials: 'composting area, vermi. Container, sacks and water.',
        job_steps: 'Wear PPE. Check the area. Identify the composting methods. Apply vermi in the composting area. Use sack to mulch. Do not allow the air enter the compost. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l2; c2
    {
        job_id: 24,
        lesson_content_id: 42,
        job_title: 'Monitoring Decomposition process',
        job_objectives: 'At the end of this module the student should be able to monitor decomposition process.',
        job_materials: 'PPE, composting area',
        job_steps: 'Wear PPE. Check the area. Identify the composting methods. Apply vermi in the composting area. Use sack to mulch. Do not allow the air enter the compost. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l2; c3
    {
        job_id: 25,
        lesson_content_id: 43,
        job_title: 'Harvesting time',
        job_objectives: 'At the end of this module the student should be able to identify the good quality time of harvest.',
        job_materials: 'PPE, Compost',
        job_steps: 'Wear the PPE. Identify the good quality time of harvest. Select the compost ready to harvest. Collect the compost. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l2; c4
    {
        job_id: 26,
        lesson_content_id: 44,
        job_title: 'Composting Process',
        job_objectives: 'At the end of this module you should be able to appreciate the importance of composting process.',
        job_materials: 'PPE, composting area, substrates, plastic and water',
        job_steps: 'Wear the PPE. Check the composting area. Collect the substrate. Put in the pile. Check the microorganism attack the substrate. Monitor the pile regularly. Do housekeeping.',
        job_assesment_method: '',
    },
    //m3; l2; c5
    {
        job_id: 27,
        lesson_content_id: 45,
        job_title: 'Record Keeping',
        job_objectives: 'At the end of this module you should be able to keep record.',
        job_materials: 'PPE, composting area,  logbook, ball pens',
        job_steps: 'Wear the PPE. Prepare the logbook. Check the composting pile. Record the inputs. Records the output of composting. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l1; c1
    {
        job_id: 28,
        lesson_content_id: 46,
        job_title: 'Securing the Storage Area',
        job_objectives: 'At the end of this module the student should be able to secure the storage area.',
        job_materials: 'PPE, Storage Facility',
        job_steps: 'Wear the PPE. Install fence around the storage area. Install security lighting and an alarm system. Keep  pesticide container properly. Store pesticides on metal shelves with a lip or on wood shelves covered with plastic. Keep the storage area neat and clean at all times. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l1; c3
    {
        job_id: 29,
        lesson_content_id: 48,
        job_title: 'Using tools, material and equipment in concoction process',
        job_objectives: 'At the end of this module the student should be able to use clean tools, materials and equipment in concoction process.',
        job_materials: 'Alugbati - Bamboo Shoots ,Banana Trunks ,Kamote Tops Kangkong.,Molasses, Mascuvado, Brown sugar, Banana, Squash, Papaya, Ampalaya Tomato, Fish, Golden Kuhol Meat ,Garlic Ginger ,Makabuhay ,Animal bones,Egg Shell ,Kuhol Shell , Sea Shell , Cooked Rice ,Fresh Milk - , Powdered Rice, Chopping Board , Knife, Manila paper, Marker Pen, Masking Tape. Plastic Pail , Scissors/ cutter , Stone,Strainer / Screen, Weighing Scale.',
        job_steps: 'Wear the PPE. Install fence around the storage area. Install security lighting and an alarm system. Keep  pesticide container properly. Store pesticides on metal shelves with a lip or on wood shelves covered with plastic. Keep the storage area neat and clean at all times. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l1; c4
    {
        job_id: 30,
        lesson_content_id: 49,
        job_title: 'Observing Personal Hygiene',
        job_objectives: 'At the end of this module you should be able to observe personal hygiene.',
        job_materials: 'PPE, materials. Tools, sanitize container and bottles. Concoction area',
        job_steps: 'Wear the PPE. Check the tools, materials in proper area. Arrange all needed tools and equipment and raw materials to be used and properly label for easily identify. Keep or maintain the work area, tools, equipment and raw materials clean to avoid contamination results. Create consistent way that task and procedure are done. Make a habit of properly maintaining the correct procedure. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l2; c1
    {
        job_id: 31,
        lesson_content_id: 50,
        job_title: 'Preparing raw materials for producing organic concoction and extract',
        job_objectives: 'At the end of this module the student should be able to prepare raw materials when producing organic concoction and extract.',
        job_materials: 'kankong, Camote tops, banana trunk and molasses, banana papaya kalabasa, garlic, ginger,  Mascuvado, sugar pure ,coconut vinegar, Clay pot/Bamboo trough, Manila paper, Basin, Cooked rice, Rice wash, Fresh milk (skimmed or powdered milk can be used), pork, fish and beef bones, eggshells and kuhol and/or any shells.',
        job_steps: 'Wear PPE. Collect all the raw materials. Eliminate the unnecessary and unwanted one. Make sure that all raw materials are clean. Check the raw materials are suited to the types of concoctions. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l2; c2
    {
        job_id: 32,
        lesson_content_id: 51,
        job_title: 'Determining period of fermentation process',
        job_objectives: 'At the end of this module the student should be able to determine the period of fermentation process.',
        job_materials: 'PPE, Various concoctions (FPJ, FFJ, IMO, FAA, LABS, CALPHOS)',
        job_steps: 'Wear the PPE. Put the label in the fermented concoctions. Keep the concoction in the shaded area until undergone fermentation process. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l2; c3
    {
        job_id: 33,
        lesson_content_id: 52,
        job_title: 'The various concoctions',
        job_objectives: 'At the end of this module the student should be able to identify the different types of concoctions.',
        job_materials: 'PPE, Various concoctions',
        job_steps: 'Wear the PPE. Identify the types of concoctions. Determine the benefits and uses. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l2; c4
    {
        job_id: 34,
        lesson_content_id: 53,
        job_title: 'Determine the harvesting  period of concoctions',
        job_objectives: 'At the end of this module you should be able to determine the harvesting period of concoction.',
        job_materials: 'PPE, various concoction, 1 liter plastic bottle',
        job_steps: 'Wear the PPE. Harvest the concoction. Put in a sanitized and cleaned plastic bottle. Correct the measure dosage of using concoction. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l3; c1
    {
        job_id: 35,
        lesson_content_id: 54,
        job_title: 'Sanitizing the bottles and containers',
        job_objectives: 'At the end of this module the student should be able to sanitize bottles and containers.',
        job_materials: 'PPE, Concoction area, sanitized bottles and plastic bottle',
        job_steps: 'Wear PPE. Remove the label before cleaning the plastic bottle. Unscrew the tops and of  a container of warm soapy water to avoid losing them down the drain. Fill a large pot or sink with soap and hot water  to fully submerge your bottles into the solution for a few minutes to kill any bacteria. Rinse the bottles and tops thoroughly. For the bottles, fill them with warm water from the tap until no soap residue is left over. Allow the bottles to dry overnight. Don’t refill the bottles too soon; they must be completely dry before refilling to avoid bacterial buildup. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l3; c2
    {
        job_id: 36,
        lesson_content_id: 55,
        job_title: 'Proper labeling and packaging of concoctions',
        job_objectives: 'At the end of this module the student should be able to proper labeling and packaging of concoctions.',
        job_materials: 'Concoction area, various concoction, papers, ballpeen',
        job_steps: 'Prepare all the supplies and materials in labelling and tagging. Get your produce concoctions. Label the fermented products based on the required information. Submit your work to your trainer. Do housekeeping.',
        job_assesment_method: '',
    },
    //m4; l3; c3
    {
        job_id: 37,
        lesson_content_id: 56,
        job_title: ' Appropriate place to store',
        job_objectives: 'At the end of this module the student should be able to appropriate storage for the various concoctions.',
        job_materials: 'Concoction area, various concoction',
        job_steps: 'Prepare the various concoctions. Determine the right temperature inside the concoction area. Sealed bottles or other package prevents contamination during storage. Do housekeeping.',
        job_assesment_method: '',
    },
];

async function seedJobInstruct() {
    const existingRecords = await listJobInstruct();
    const existingId = new Set(existingRecords.map((record) =>record.job_id));

    let insertedCount = 0;
    for (const jobInput of SEED_JOB_SHEET) {
        if (existingId.has(jobInput.job_id)) {
            continue;
        }

        await createJobInstruct(jobInput);
        insertedCount += 1;
    }

    console.log(`Seeded ${insertedCount} job sheet record(s).`);
}

seedJobInstruct().catch((error) => {
    console.error('Failed to seed job sheet.', error);
    process.exitCode = 1;
});
