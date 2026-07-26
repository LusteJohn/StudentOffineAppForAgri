const { createLescreateLessonLinksonInfo } = require('../src/models/lessonLinkModel');
const { listLessonLink } = require('../src/models/lessonLinkModel');

const SEED_LESSON_LINK = [
    {
        lesson_link_id: 1,
        lesson_id: 1,
        link: 'https://starmilling.com/poultry-chicken-breeds, https://www.google.com/search?sxsrf=AOaemvKfBotEpb8oaDfLzaZm4Le020JS1w:1631077568545&q=suitable+site+for+chicken+house&spell=1&sa=X&ved=2ahUKEwjGuMu4ze7yAhXNAogKHQSLCcoQBSgAegQIAhAx&biw=1367&bih=630, https://the-chicken-chick.com/tips-for-choosing-healthy-chicks/, https://poultrymanual.com/philippines-chicken-house-design',
    },
    {
        lesson_link_id: 2,
        lesson_id: 2,
        link: 'https://www.thepoultrysite.com/articles/putting-down-perfect-bedding-for-your-poultry, https://www.agriculturediary.com/poultry-farming-poultry-housing-equipment, https://www.farmanddairy.com/top-stories/how-to-set-up-a-brooder-for-baby-chicks/469356.html',
    },
    {
        lesson_link_id: 3,
        lesson_id: 3,
        link: 'https://agronomag.com/organic-chicken-feed-short-guide-on-the-nutrition-of-organic-chickens/, https://thefrugalchicken.com/organic-homemade-chicken-feed/, http://www.fao.org/3/t0207e/T0207E0a.htm, https://www.wikihow.com/Make-Feed-for-Chickens, https://ph.search.yahoo.com/yhs/search;_ylt=AwrwBpU3KDxhu8EANwffSQx.;_ylc=X1MDMjExNDczNDU1OQRfcgMyBGZyA3locy10cnAtMDAxBGdwcmlkA1VDX19FZjBZU3dHU3R3ZUJBbG5lZUEEbl9yc2x0AzAEbl9zdWdnAzAEb3JpZ2luA3BoLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMwBHFzdHJsAzQyBHF1ZXJ5A29yZ2FuaWMlMjBjaGlja2VuJTIwZmVlZGluZyUyMG1hbmFnZW1lbnQlMjBwcm9ncmFtBHRfc3RtcAMxNjMxMzMyNDg2?p=organic+chicken+feeding+management+program&fr2=sb-top&hspart=trp&hsimp=yhs-001&type=64891_070717, https://petkeen.com/feeding-chicken-how-much-how-often/, https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/ad-libitum-feeding',
    },
    {
        lesson_link_id: 4,
        lesson_id: 4,
        link: 'https://www.researchgate.net/post/How-do-I-measure-the-growth-rate-and-feed-conversion-rates-of-poultry-birds, https://www.val-co.com/management-minute-broiler-weight-monitoring/, https://www.poultryhub.org/all-about-poultry/health-management, https://en.engormix.com/poultry-industry/articles/sanitation-cleaning-disinfecting-poultry-t34212.htm, https://www.hazardouswasteexperts.com/what-you-need-to-know-about-organic-waste/, https://thepoultrypunch.com/2020/09/poultry-farm-waste-disposal-management/, https://rapidcityjournal.com/lifestyles/food-and-cooking/raising-chickens-for-meat-know-your-breeds-and-how-to-harvest-humanely/article_b0740f44-11eb-5b20-8233-67e6ece30993.html, https://newsfromthecoop.hoovershatchery.com/harvestingmeatchickens/',
    },
    {
        lesson_link_id: 5,
        lesson_id: 5,
        link: 'https://www.hortmag.com/weekly-tips/how-to-know-if-garden-seed-is-viable, https://www.gardenersworld.com/how-to/grow-plants/how-to-test-seed-viability/, https://www.nrcs.usda.gov/Internet/FSE_PLANTMATERIALS/publications/idpmctn10748.pdf, https://smartlivingidea.com/how-to-prepare-a-seedbed/, http://www.heirloom-organics.com/guide/seedstartingcare.html, https://askinglot.com/how-do-you-maintain-seedlings, https://avrdc.org/prepare-growing-medium-seedling-production/',
    },
    {
        lesson_link_id: 6,
        lesson_id: 6,
        link: 'https://www.agrifarming.in/land-preparation-types-methods-objectives-advantages, http://www.knowledgebank.irri.org/step-by-step-production/pre-planting/land-preparation, https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/beneficial-microorganisms, https://knoji.com/article/examples-of-beneficial-microorganisms-and-what-they-do/, https://www.nrcs.usda.gov/Internet/FSE_DOCUMENTS/nrcs144p2_002239.pdf, https://www.bootstrapfarmer.com/blogs/how-to-grow-seedlings/easiest-way-to-water-your-seedlings, https://balconygardenweb.com/how-to-water-seedlings/',
    },
    {
        lesson_link_id: 7,
        lesson_id: 7,
        link: 'https://www.un.org/waterforlifedecade/iwrm.shtml, https://www.growpittsburgh.org/garden-and-farm-resources/info-hub/pest-disease-management/, https://www.hortweek.com/plant-rationing-comes-sales-fly/ornamentals/article/1710204, https://ph.search.yahoo.com/yhs/search?hspart=trp&hsimp=yhs-001&type=64891_070717&p=organic+fertilizer+application',
    },
    {
        lesson_link_id: 8,
        lesson_id: 8,
        link: 'https://agriculturistmusa.com/maturity-indices-types-and-determination/, https://morningchores.com/most-profitable-crops/, https://www.indeed.com/career-advice/career-development/classification-of-consumer-products, https://ph.search.yahoo.com/yhs/search?hspart=trp&hsimp=yhs-001&type=64891_070717&p=harvesting+tools+an, https://horticulture.ucdavis.edu/postharvest',
    },
    {
        lesson_link_id: 9,
        lesson_id: 9,
        link: 'https://www.progressivegardening.com/waste-management/siting-and-area-considerations.html',
    },
    {
        lesson_link_id: 10,
        lesson_id: 10,
        link: 'https://aseq-ehaq.ca/en/composting-101, https://directcompostsolutions.com/8-methods-composting/',
    },
    {
        lesson_link_id: 11,
        lesson_id: 11,
        link: 'https://www.youtube.com/watch?v=GouWt_DM544, https://www.youtube.com/watch?v=Qr3gZAbnrHM, https://www.youtube.com/watch?v=W58mZaJCArA, https://www.youtube.com/watch?v=peJeyMV2Plc, https://www.youtube.com/watch?v=lspuVsEW3vY, https://www.youtube.com/watch?v=6a1YezkoLjs, https://www.youtube.com/watch?v=A40KLz6fRk8, https://www.youtube.com/watch?v=UXysXSFuME0, https://www.youtube.com/watch?v=vCFkmuUL-S0, https://www.youtube.com/watch?v=XzdeuMz3MZ4, http://organic.da.gov.ph/images/IECs/FPJ.pdf',
    },
    {
        lesson_link_id: 12,
        lesson_id: 12,
        link: 'https://www.ctahr.hawaii.edu/oc/freepubs/pdf/SA-8.pdf /, Making Culturing Lactic Acid Bacteria (LAB) http://www.cgnfindia.com/lab.html, (3) Lactobacillus Serum http://theunconventionalfarmer.com/recipes/lactobacillus-serum/, https://businessdiary.com.ph/3470/how-to-make-fermented-fruit-juice-or-ff',
    },

];

async function seedLink() {
  const existingLinks = await listLessonLink();
  const existingIds = new Set(existingLinks.map((record) => record.lesson_link_id));

  let insertedCount = 0;
  for (const linkInput of SEED_LESSON_LINK) {
    if (existingIds.has(linkInput.lesson_link_id)) {
      continue;
    }

    await createLessonLink(linkInput);
    insertedCount += 1;
  }

  console.log(`Seeded ${insertedCount} lesson record(s).`);
}

seedLink().catch((error) => {
  console.error('Failed to seed lessons.', error);
  process.exitCode = 1;
});