const { createContentInfo } = require('../src/models/contentIntroductionModel');
const { listContentInfo } = require('../src/models/contentIntroductionModel');

const SEED_CONTENT_INFORMATION = [
    // M1; L1; C1 info
    {
        content_info_id: 1,
        lesson_content_id: 1,
        label: 'Australorp',
        description: 'Around the same time that Orpingtons were being developed as a breed, Australorps were as well. Australians liked the black Orpingtons that were being brought over from England, and valued them for their egg laying ability. With maximum egg production in mind, Australians continued to develop their own distrinct breed. The breed went by many names, struggling to distinguish itself from Orpingtons, and finally settled on Australorp in the 1920s. These birds are known for their excellent egg production. You’ll easily get 250 light brown eggs per year. The record holding hen laid 364 eggs in a 365 day period, without assistance of artificial lighting!',
        images: 'assets/module_images/M1/L1/Australorp.jpg',
    },
    {
        content_info_id: 2,
        lesson_content_id: 1,
        label: 'Bielefelder',
        description: 'The Bielefelder is a modern breed, developed in the early 1970s in Bielefeld, Germany. Poultry breeder Gerd Roth used genetics from a number of breeds including the Cuckoo Malines, Amrock, Wyandotte, and New Hampshire. The Bielefelder managed to retain the best qualities of all these breeds. Consider this breed another example of extraordinary German engineering. They check off all the boxes on your “perfect chicken” wish list. This dual-purpose breed is autosexing so males and females can be identified immediately upon hatching. Females have a chipmunk strip on their backs, while males are lighter in color and have a yellow spot on their heads. They mature to have a complex feather pattern which is best described as cuckoo red partridge. Birds are very friendly and seek human interaction. They have a large frame that holds plenty of meat. Roosters can weigh 10 – 12 pounds! Their size and camouflaging feather pattern makes them perfect for free-range conditions. Hens can produce upwards of 230 large eggs per year. Their eggs are a unique shade of brown with pink undertones that you won’t find anywhere else.',
        images: 'assets/module_images/M1/L1/Bielefelder.png',
    },
    {
        content_info_id: 3,
        lesson_content_id: 1,
        label: 'Black Star / Red Star',
        description: 'Red Stars and Black Stars are hybrids that have been bred to have their color at hatching linked to the sex of the chicken (pullet or cockerel). This makes chick sexing an easier process, and you as the purchaser are less likely to be surprised! Ever had a pullet start to crow one day? Not with these birds! They’ve also been developed to be extremely good egg layers. Don’t be surprised if you see 300 eggs in a year! Egg color and size will vary, depending on the cross-breeding. Black Stars are a cross between a Rhode Island Red rooster and a Barred Rock hen. Red Star’s are a cross between a Rhode Island Red rooster and either a White Rock, Silver Laced Wyandotte, Rhode Island White or Delaware hen.',
        images: 'assets/module_images/M1/L1/Black_Star_Red_Star.png'
    },
    {
        content_info_id: 4,
        lesson_content_id: 1,
        label: 'Java',
        description: 'The Java is the 2nd oldest chicken breed developed in America, going back to 1835. Its ancestors come from the island of Java in the Far East. Javas are an excellent breed for free-ranging homesteads and are known for their egg production and table qualities. Javas come in white, black, mottled, and auburn. The Black Java is known for the brilliant beetle-green sheen of its feathers.',
        images: 'assets/module_images/M1/L1/Java.jpg'
    },
    {
        content_info_id: 5,
        lesson_content_id: 1,
        label: 'Jersey Giant',
        description: 'The Jersey Giant chicken was developed between 1870 and 1890 in New Jersey. You can probably guess that these birds are pretty big! Roosters weight in at 13 pounds, and hens can easily grow up to 10 pounds! They are the largest purebred chicken breed. They are known to be fairly good layers compared to other large breeds, and are good winter layers. Expect about 260 large brown eggs per year.',
        images: 'assets/module_images/M1/L1/Jersey_Giant.jpg'
    },
    {
        content_info_id: 6,
        lesson_content_id: 1,
        label: 'Maran',
        description: 'Marans originated in western France and were imported in the 1930s. There are 9 recognized colors: Cuckoo, Golden Cuckoo, Black, Birchen, Black Copper, Wheaten, Black-tailed Buff, White and Columbian. If you find Marans chicks at a feed store, they will most likely be the Black Copper or Cuckoo variety. Hens are active and enjoy free ranging, and also have friendly, outgoing personalities. Marans are renowned for their dark chocolate brown eggs. If you’re looking for unique eggs, these are quite the conversation peace! You’ll get about 150-200 each year in your nesting boxes.',
        images: 'assets/module_images/M1/L1/Maran.jpg'
    },
    {
        content_info_id: 7,
        lesson_content_id: 1,
        label: 'Naked Neck',
        description: 'The Naked Neck is a breed of chicken that is naturally devoid of feathers on its neck and vent. The breed is also called the Transylvanian Naked Neck, as well as the Turken. The name “Turken” arose from the mistaken idea that the bird was a hybrid of a chicken and the domestic turkey. They make for a good dual-purpose utility chicken. They only have about half the feathers of other chickens, so they are easier to pluck if raised for meat. They also lay a respectable number of eggs. They are very good foragers and are immune to most diseases, plus they are pretty fun to look at!',
        images: 'assets/module_images/M1/L1/Naked_Neck.jpg'
    },
    {
        content_info_id: 8,
        lesson_content_id: 1,
        label: 'Orpington',
        description: 'Orpington chickens were developed in the town of Orpington, England of all places! During the late 1800s, William Cook wanted to create a new breed that was dual purpose, but had white skin, which the British preferred for meat. Within 10 years, Orpingtons were a favorite in both England and America, and came in a variety of colors – black, white, buff, jubilee, and spangled. Orpingtons lay about 200 eggs per year. If you’re thinking about adding some to your flock, we suggest the Buff Orpington. They are known for being very docile – they make great pets!',
        images: 'assets/module_images/M1/L1/Orpington.jpg'
    },
    {
        content_info_id: 9,
        lesson_content_id: 1,
        label: 'Plymouth Rock',
        description: 'Developed in America in the middle of the 19th century, this breed of chicken is historically the most popular in the United States. Up until WWII, no other breed was kept as extensively as the Plymouth Rock. The original birds were all of the Barred variety – with black and white stripped plumage – and other color varieties were developed later. The popularity of this duel-purpose breed came from its qualities as an outstanding farm chicken: hardiness, docility, broodiness, and excellent production of brown eggs.',
        images: 'assets/module_images/M1/L1/Plymouth_Rock.jpg'
    },
    {
        content_info_id: 10,
        lesson_content_id: 1,
        label: 'Rhode Island Red',
        description: 'Rhode Island Reds are a great choice for beginner chicken-keepers, or expert small flock keepers alike! Developed in Massachusetts and Rhode Island in the late 1800s, these birds are a hardy, dual purpose breed. They are very low maintenance, and can tolerate less than favorable conditions. Hens lay about 5 – 7 eggs per week',
        images: 'assets/module_images/M1/L1/Rhode_Island_Red.jpg'
    },
    {
        content_info_id: 11,
        lesson_content_id: 1,
        label: 'Speckledy aka Speckled Ranger',
        description: 'The Speckledy is a modern hybrid, resulting from a cross between a Rhode Island Red rooster and a Marans hen. They are elegant in build, with feathering that resembles a Cuckoo Marans. The feathers are silky, soft to the touch, and quite abundant and fluffy. They have pale bay eyes, pale legs, a medium-sized single comb, and small earlobes and wattles. They are a docile, easy to tame, and easy to handle bird. They are good foragers and well suited to a free-range environment. Speckledys are very good layers. Hens will lay 250-270 chestnut brown eggs per year, which are often speckled. Their eggshells are particularly strong and the yolks are a deep yellow.',
        images: 'assets/module_images/M1/L1/Speckledy.jpg'
    },
    {
        content_info_id: 12,
        lesson_content_id: 1,
        label: 'Sussex',
        description: 'This breed has ancient connections going all the way back to 43 A.D., when the Romans invaded Britain. They grew a reputation of being the finest poultry in Britain, and reached America in 1912. They are a dual-purpose breed and will put on fat very easily, so be careful in feeding them too many treats! If they become too overweight, you will see a decline in egg production. Sussex chickens are a wonderful breed for a small farm or homestead, being active and all-around an excellent breed for meat and eggs. Hens lay an average of 250 light brown eggs each year, and come in three recognized color varieties: Speckled, Red, and Light.',
        images: 'assets/module_images/M1/L1/Sussex.jpg'
    },
    {
        content_info_id: 13,
        lesson_content_id: 1,
        label: 'Welsummer',
        description: 'Welsummers are a Dutch breed of domestic chicken, developed in the 1920s. It is a light, friendly, and intelligent breed, with rustic-red and orange color. Hens lay large eggs, that are a dark, terracotta brown, and often speckled. Roosters are considered to have the “classic rooster” look, and often used in media',
        images: 'assets/module_images/M1/L1/Welsummer.jpg'
    },
    {
        content_info_id: 14,
        lesson_content_id: 1,
        label: 'Wyandotte',
        description: 'Developed in the 1880s, Wyandottes are named after a Native American tribe prevalent in parts of upstate New York and Ontario, Canada. They are thought to be developed from the Dark Brahma and Spangled Hamburgs. The Silver Laced Wyandotte was the original color recognized, but since then black, blue, buff, buff Columbian, Columbian, golden laced, partridge, and silver pencilled have been added as recognized color varieties. Wyandottes are friendly, calm, and cold hardy. Hens lay on average 200 light brown eggs per year. They make excellent setters and mothers.',
        images: 'assets/module_images/M1/L1/Wyandotte.jpg'
    },
    {
        content_info_id: 15,
        lesson_content_id: 1,
        label: 'Ancona',
        description: 'Ancona chickens originated in Italy and are named after the capitol of the Marche region. Anconas were developed in to their present form in England in the 19th century. They were bred to have very consistent plumage. About 1 out of every 3 beetle black feathers has a V-shaped white tip on the end. Hens are good layers of white eggs and lay about 220 per year. This breed is typical in personality of Mediterranean breeds: rustic, lively, hardy, and ranging.',
        images: 'assets/module_images/M1/L1/Ancona.jpg'
    },
    {
        content_info_id: 16,
        lesson_content_id: 1,
        label: 'Andalusian',
        description: 'Andalusian chickens are indigenous to Spain. Also called Blue Andalusians, they commonly have slate-blue colored plumage, but depending upon genetics, they can also be off-white or even black. Like other Mediterranean breeds, they have white earlobes. Their light body shape and their large pointed combs make them well-suited for warmer climates. Andalusians are very active foragers, so think twice if you keep your poultry in a coop and run. They do not do well in confinement, and thrive in a free-range environment. Hens lay about 165 white eggs per year.',
        images: 'assets/module_images/M1/L1/Andalusian.jpg'
    },
    {
        content_info_id: 17,
        lesson_content_id: 1,
        label: 'Cinnamon Queen',
        description: 'The Cinnamon Queen is a modern day production breed that lays brown eggs. They are a cross between a Rhode Island Red rooster and a Rhode Island White hen. At hatching, cockerels are a different color than the pullets so you can be sure of what you are getting—no surprise roosters! They are also known as Golden Comets. Cinnamon Queens were developed specifically for their prolific egg laying ability. Pullets will lay 250-300 eggs per year and start much sooner than heritage breeds. ',
        images: 'assets/module_images/M1/L1/Cinnamon_Queen.jpg'
    },
    {
        content_info_id: 18,
        lesson_content_id: 1,
        label: 'Holland',
        description: 'In 1934, white eggs brought premium prices at market because it was believed that they had a better, more delicate flavor. Most of America’s eggs were produced by small farms at the time. Small farmers prefer dual-purpose chickens because they provide a source of meat as well as eggs. Because dual-purpose chicken breeds tend to lay brown eggs and white egg-laying breeds available at the time were light-weight and not well fleshed, this prompted Rutgers Breeding Farms to set about producing a dual-purpose breed that would lay white eggs. Thus, the Holland was created.',
        images: 'assets/module_images/M1/L1/Holland.jpg'
    },
    {
        content_info_id: 19,
        lesson_content_id: 1,
        label: 'Leghorn',
        description: 'Is it pronounced “Leghorn” or “Leghern” ? Either way, these birds are great! This breed was developed simultaneously in England and the U.S. in the 1850s, with ancestry tracing back to birds in Northern Italy. Leghorns are very active birds – scratching and foraging the day away. They are hardy and easy breeders, but are mostly known for their egg production. You could easily get 280 eggs in a year, even up to 300! Many of the white eggs you see in grocery stores are produced by this breed of chicken.',
        images: 'assets/module_images/M1/L1/Leghorn.jpg'
    },
    {
        content_info_id: 20,
        lesson_content_id: 1,
        label: 'Minorca',
        description: 'Minorcas are a Mediterranean breed of domestic chicken, and are in fact the largest fowl from this region. They have a greenish-black glossy plumage, and very large, bright red combs and wattles. These help with dissipating heat. They also have very large, almond shaped, white earlobes, common to other Mediterranean fowl. Minorcas are not broody, but excellent layers of large, white eggs. They are very hardy and rugged, taking well to free range conditions.',
        images: 'assets/module_images/M1/L1/Minorca.jpg'
    },
    {
        content_info_id: 21,
        lesson_content_id: 1,
        label: 'Dutch Bantam',
        description: 'Originating in the Netherlands, the Dutch Bantam is a true bantam breed. They are one of the smallest bantams, only weighing in at about 15 ounces. They can fly rather well because they are small but have large wings. Dutch Bantams are especially hardy and good layers for their size. Hens lay about 160 cream colored eggs per year, although they are small. They have friendly temperaments and make great family pets!',
        images: 'assets/module_images/M1/L1/Dutch_Bantam.jpg'
    },
    {
        content_info_id: 22,
        lesson_content_id: 1,
        label: 'Pekin Bantam',
        description: 'Pekin Bantams are of Chinese origin and are alleged to have been looted by British soldiers from the private collection of the Emperor of China. They are round birds and have so many feathers that you practically can’t see their feet and legs! Roosters weigh around 23 ounces and hens weigh around 20 ounces. There is some debate over whether Pekins are a true bantam breed or are just miniature Cochins.',
        images: 'assets/module_images/M1/L1/Pekin_Bantam.jpg'
    },
    {
        content_info_id: 23,
        lesson_content_id: 1,
        label: 'Rosecomb Bantam',
        description: 'The Rosecomb Bantam is a true bantam breed, meaning it does not have a larger counterpart. It is one of the oldest bantam breeds, developed in England during the 14th century. Roosters weigh about 26 ounces and hens weigh about 22 ounces. They are kept mainly for exhibition and are generally bred for their appearance. Officially recognized colors include black, white, and blue. Unofficially, there are many more feather varieties. They have a very large comb and earlobes for their body size. They stand tall, alert, and proud, and have an “aristocratic” way about them. Hens lay one tiny cream-colored egg each week.',
        images: 'assets/module_images/M1/L1/Rosecomb_Bantam.jpg'
    },
    {
        content_info_id: 24,
        lesson_content_id: 1,
        label: 'Scots Dumpy',
        description: 'Scots Dumpies are an ancient Scottish breed of chicken. Evidence suggests they existed 700 years ago. The “Dumpy” in the name refers to a dwarfing gene that causes them to have very short legs and waddle as they walk. Because of their shorter legs, the Scots Dumpy can’t scratch up your landscaping! They are also excellent egg producers, broody, and good mothers. They are docile and the roosters make very timely alarm clocks!',
        images: 'assets/module_images/M1/L1/Scots_Dumpy.jpg'
    },
    {
        content_info_id: 25,
        lesson_content_id: 1,
        label: 'Barbezieux',
        description: 'The Barbezieux originated in France during the Middle Ages. These birds are impressive in the coop and on the table! Adult birds weigh 9 to 12 pounds, and roosters can grow up to 2 feet tall. They are considered the tallest chicken in Europe. They have iridescent, beetle black feathers, and an oversized comb and wattles. They have white skin and blue legs. Hens lay a good amount of white eggs, should you want to keep some in your flock as layers. Their meat is ultra-premium. ',
        images: 'assets/module_images/M1/L1/Barbezieux.jpg'
    },
    {
        content_info_id: 26,
        lesson_content_id: 1,
        label: 'Basque Chicken',
        description: 'The Basque region of Spain and France has a rich history and culture that has endured thousands of years in the harsh and rugged terrain. The Basque people view themselves as independent and apart from the countries where they reside. Just like the people of the region, native chickens thrive under conditions that their less hardy cousins would struggle with. The legs, feet, and skin of these birds are yellow. They have a bright red single comb and narrow, pointed red earlobes. They are found in five color varieties: Beltza (black), Gorria (red), Lepasoila (naked-necked, red-brown), Marraduna (golden cuckoo) and Zilarra (black-tailed white).',
        images: 'assets/module_images/M1/L1/Basque_Chicken.jpg'
    },
    {
        content_info_id: 27,
        lesson_content_id: 1,
        label: 'Bresse',
        description: 'The Bresse is hailed as the best tasting chicken in the world. Similar to French Champagne, birds must be raised within the legally defined area of the historic region of Bresse, in eastern France. To maintain the strictest quality standards, the raising and selling of Bresse chickens is rigidly controlled by the French government. There are rules about how much land they must have access to, what they must be fed, and how they must be processed. There are only about 200 breeders that producing 1.2 million birds annually.',
        images: 'assets/module_images/M1/L1/Bresse.jpg'
    },
    {
        content_info_id: 28,
        lesson_content_id: 1,
        label: 'Cornish',
        description: 'The Cornish was an epic fail in terms of serving its original purpose. Sir Walter Raleigh Gilbert of England developed the breed, originally naming it the “Indian Game.” He intended to combine the power of an Aseel gamebird with the speed of an English gamebird. What he got was a bird with neither of those qualities. Cornishes were (misleadingly) marketing in the 1800s as an excellent all around bird, despite being “nearly the worst domestic fowls for ordinary use.” In the early 1900s, breeders renamed it the “Cornish” and found two niche markets.',
        images: 'assets/module_images/M1/L1/Bresse.jpg'
    },
    {
        content_info_id: 29,
        lesson_content_id: 1,
        label: 'Gallina di Saluzzo',
        description: 'The Gallina di Saluzzo, Italian for “the white hen of Saluzzo,” is from the Piedmont in Italy. It is a rustic breed and was once widespread throughout the region. Small family farms are common in the area, and the animals traditionally raised there were intended for family consumption. With the increase of intensive and commercial agriculture, this breed almost disappeared completely, along with other pasture-raised breeds in the area. Recovery efforts began in 1999 to revive the breed because of it’s historical significance to the region.',
        images: 'assets/module_images/M1/L1/Gallina_di_Saluzzo.jpg'
    },
    {
        content_info_id: 30,
        lesson_content_id: 1,
        label: 'Gournay',
        description: '“Le Poule de Gournay,” or the Gournay chicken, is from the upper Normandy region of France. It has ancient ancestry that may date back to the age of Vikings. These birds weigh 4 – 7 pounds and have a round body and small head. Their feathers are evenly mottled black and white. They have orange eyes and a thick beak, and a well-developed breast with delicate and flavorful meat. Hens are sweet but will go broody. They lay around 3 white, extra-large eggs per week.',
        images: 'assets/module_images/M1/L1/Gournay.jpg'
    },
    {
        content_info_id: 31,
        lesson_content_id: 1,
        label: 'Ixworth',
        description: 'The Ixworth was created in the 1930s England, by Reginald Appleyard. Appleyard is better known for developing the Silver Appleyard Duck. In the Ixworth, he envisioned the ideal dual-purpose breed that would be an active forager, produce eggs, and make a hearty meal. Both hens and roosters have a stocky body, pure white feathers, white skin, and pea comb. While they are better designed for the table, hens also lay a decent number of tinted eggs.',
        images: 'assets/module_images/M1/L1/Ixworth.jpg'
    },
    {
        content_info_id: 32,
        lesson_content_id: 1,
        label: 'New Hampshire',
        description: 'New Hampshire chickens have only been around since the 1930s and are closely related to the classic Rhode Island Red (RIR). Starting with RIRs, breeders were very selective and intensified traits of early maturity, rapid full feathering, and production of large brown eggs. These birds are a rich chestnut color, slightly lighter in shade than RIRs. New Hampshires are a dual-purpose breed, but are intended more for the table than for egg production.',
        images: 'assets/module_images/M1/L1/New_Hampshire.jpg'
    },
    {
        content_info_id: 33,
        lesson_content_id: 1,
        label: 'Norfolk Grey',
        description: 'The Norfolk Grey is a utility breed developed in England in 1910, by Frederick Myhill. Originally, the breed was called “Black Maria”. During World War I, Myhill had to leave his flock to free range while he left for military service. When he returned home, he discovered that his birds had cross bred with other breeds, and he had to start over again. While he successfully did so, Black Marias did not gain in popularity, so Myhill had the name changed to Norfolk Grey. This breed all but died out in the 1970s. A private flock of only 4 birds was able to revive it!',
        images: 'assets/module_images/M1/L1/Norfolk_Grey.jpg'
    },
    {
        content_info_id: 34,
        lesson_content_id: 1,
        label: 'Red Cap',
        description: 'The RedCap is an egg-laying breed from England named after their very large rose comb. It is one of the older English breeds, but exact time is unclear. The RedCap was bred so much for utility that they are lacking in appeal. Their coloring, wild temperament, and generally unrefined quality led them to fall out of favor by 1900. The breed has red plumage tipped with a blue-black, half-moon shaped spangle and leaden blue colored legs.',
        images: 'assets/module_images/M1/L1/Red_Cap.jpg'
    },
    {
        content_info_id: 35,
        lesson_content_id: 1,
        label: 'Red Shaver',
        description: 'The Red Shaver is a sex-linked breed from Canada. Female chicks are a reddish-brown color with white underfeathers, while male chicks are white with a few red markings on the feathers. They are a dual purpose breed with a reputation for being quiet and calm. Hens lay up to 300 large brown eggs per year! Because they are Canadian, they are very well adapted to cold.',
        images: 'assets/module_images/M1/L1/Red_Shaver.jpg'
    },
    {
        content_info_id: 36,
        lesson_content_id: 1,
        label: 'Vorwerk',
        description: 'The Vorwerk was developed in 1900 by Oskar Vorwerk in Hamburg, Germany. His goal was to create a medium-sized, dual-purpose breed with the same feather pattern as the Lakenvelder. Vorwerks are hardy, adaptable, alert, and active. They mature quickly, are pretty good at flying for a chicken! This makes them great candidates for free range flocks. Birds are typically 4 – 8 pounds and hens lay about 170 large cream eggs per year. They are a golden buff color, with solid black head, neck, and tail. They are often confused with Golden Lakenvelders, but are a separate breed. This is perhaps the reason why Vorwerks never gained popularity, therefore they are rare outside of Europe.',
        images: 'assets/module_images/M1/L1/Vorwerk.jpg'
    },
    {
        content_info_id: 37,
        lesson_content_id: 1,
        label: 'Old English Game',
        description: 'The Old English Game breed is one of the oldest breeds of fowl, having been introduced to England by Romans in the 1st century! Although their origins were in the fighting ring, today they are raised for their exotic appearance and only for show. They have compact, muscular bodies with feathers that are hard, glossy, and sit tight along the body. They are known to have fearless eyes and an indomitable spirit. Old English Games come in a variety of colors. Both hens and roosters have large and distinctive tail feathers. Hens make excellent brooders, although they can be overly aggressive as mothers. They can tolerate extreme climates, are good foragers, and do well in free range situations.',
        images: 'assets/module_images/M1/L1/Old_English_Game.jpg'
    },
    {
        content_info_id: 38,
        lesson_content_id: 1,
        label: 'Brussbar',
        description: 'The Brussbar is a dual purpose breed, developed by Professor Punnett and Mr. Pease at Cambridge in the first half of the 20th century. They were looking to create an autosexing breed with the characteristics of a Light Sussex, the most popular breed at the time. Brown Sussex and Barred Rocks were used initially to create the autosexing plumage with utility strains of Light Sussex added to improve productivity. The breed was officially standardized in 1952. Birds are large and well-built, similar to a Sussex. They have a distinctive crele plumage, a copper and gold body color with barring patterns throughout. Originally, the Brussbar came in both a gold and silver variety, though now only the gold variety can be found.',
        images: 'assets/module_images/M1/L1/Brussbar.jpg'
    },
    {
        content_info_id: 39,
        lesson_content_id: 1,
        label: 'California Grey',
        description: 'Developed in California in the 1930s by James Dryden, professor of poultry science. He wanted a dual-purpose hen laying large white eggs that remained in her egg-laying prime for longer than 2 years. He crossed a Barred Plymouth Rock rooster with a White Leghorn hen, which resulted in a naturally autosexing breed with grey barred plumage. Birds are between 4 – 6 pounds, which makes them too large to appeal to commercial egg producers. They were also never recognized by the American Poultry Association. This means they never enjoyed popularity and today are a rare find.',
        images: 'assets/module_images/M1/L1/California_Grey.jpg'
    },
    {
        content_info_id: 40,
        lesson_content_id: 1,
        label: 'Catalana',
        description: 'Catalanas were developed near Barcelona in the district of Catalonia, Spain. It was introduced to the rest of the world at the 1902 World’s Fair held in Madrid. They are a hardy, dual-purpose breed, with the style, alertness, and forage abilities typical of Mediterranean breeds. They lay large white eggs and rarely are broody. Catalanas are noted for being very heat tolerant.',
        images: 'assets/module_images/M1/L1/Catalana.jpg'
    },
    {
        content_info_id: 41,
        lesson_content_id: 1,
        label: 'Dorking',
        description: 'The history of the Dorking is similar to that of the Sussex. An ancient breed with ties to the Roman Empire, the Dorking was developed to be a superior table bird. As a backyard poultry keeper, this breed would make an excellent dual-purpose bird! Hens make excellent winter layers, and are exceptional mothers. They welcome chicks from other hens and tend to look after chicks far longer than other hens.',
        images: 'assets/module_images/M1/L1/Dorking.jpg'
    },
    {
        content_info_id: 42,
        lesson_content_id: 1,
        label: 'Langshan',
        description: 'Langshans originated in China near the Yangtszekiang River and made its way to England in 1872. The breed is valued for being a large bird, with quality meat, that lays a high volume of dark brown, purplish eggs. Langshans are hearty birds and good foragers. They have tight feathering and can fly better than most other chickens. Hens are not dependable sitters but make excellent mothers once the chicks have hatched.',
        images: 'assets/module_images/M1/L1/Langshan.jpg'
    },
    {
        content_info_id: 43,
        lesson_content_id: 1,
        label: 'Marsh Daisy',
        description: 'The Marsh Daisy is a very rare breed originating in Lancashire, England, and has not made a name for itself in other countries. It’s a bird with a fancy name and a practical nature. These birds are slow to mature, but once grown, are very hardy and excellent foragers. They flourish in free range environments. Hens lay about 200 cream colored eggs each year. The Marsh Daisy chicken may be one of the rarest chicken breeds worldwide. It never achieved popularity abroad, was never recognized by the American Poultry Association and is little known or seen outside the UK.',
        images: 'assets/module_images/M1/L1/Marsh_Daisy.jpg'
    },
    {
        content_info_id: 44,
        lesson_content_id: 1,
        label: 'Norwegian Jaehorn',
        description: 'The Jaehorn is the only breed of domestic chicken indigenous to Norway. They were developed in 1920 near the town of Stavenger. They have only recently made their way to North America and are still a rare find in the U.S. They come in two colors: dark brown and light brown. Hens can lay an impressive 215 white eggs per year. Jaehorns are small, hardy, and active birds. They are great flyers due to their size.',
        images: 'assets/module_images/M1/L1/Norwegian_Jaehorn.jpg'
    },
    {
        content_info_id: 45,
        lesson_content_id: 1,
        label: 'Penedesenca',
        description: 'The Penedesenca originated in the region of Catalonia, in Spain. They are named after the town Vilafranca del Penedes and were developed from native backyard birds. This breed is known for the very dark brown eggs that the hens produce. They are said to be the darkest brown of any breed. They come is a few color varieties: Black, Crele, Partridge, and Wheaten. They have white earlobes, red wattles, and an unusual carnation comb. This breed is extremely rare. In fact, they almost went extinct! In the 1980s, some breeders dedicated themselves to reviving the Penedesenca.',
        images: 'assets/module_images/M1/L1/Penedesenca.jpg'
    },
    {
        content_info_id: 46,
        lesson_content_id: 1,
        label: 'Rhodebar',
        description: 'The Rhodebar is a breed that we wish wasn’t quite so rare! Hailed as “an absolute gift for the small poultry enthusiast”, these birds have so many great qualities. Originally created at the University of British Columbia in the 1940s, during the autosexing breed development craze, the Rhodebar involves a cross of Rhode Island Reds and Plymouth Barred Rocks. A version of the breed was also created in the U.K. by crossing a Danish strain of Rhode Island Red with Golden Brussbars. Rhodebars are autosexing, meaning males and females have different coloring at the time of hatch. Males are yellow, and females have dark stripes of barring down their backs. This makes them easy to differentiate, so you stand an excellent chance of knowing if you’ve got future hens or roosters in the bunch. This is a dual-purpose breed. Hens are great layers of brown tinted eggs. You can expect about 180-200 eggs per year. Birds weigh between 6 – 9 pounds and dress out nicely for the table.',
        images: 'assets/module_images/M1/L1/Rhodebar.jpg'
    },
    {
        content_info_id: 47,
        lesson_content_id: 1,
        label: 'Twentse',
        description: 'Twentses (Dutch), also known as Kraienkoppes (German), are a large breed of chicken from an area spanning between Germany and the Netherlands. They are rumored to be the result of Leghorn and Malay crosses and are sporty, ornamental birds that also have good egg production. Hens lay about 200 off-white eggs per year. They have small wattles, earlobes, and walnut comb—all bright red in color. This rare breed is an excellent forager in both free range and confined conditions.',
        images: 'assets/module_images/M1/L1/Twentse.jpg'
    },
    {
        content_info_id: 48,
        lesson_content_id: 1,
        label: 'Cubalaya',
        description: 'The Cubalaya is the only breed developed in Cuba. It is descended from Sumatra and Malay birds brought to Cuba from the Philippines. They were selectively bred to be impressive in appearance, with a courageous expression. Roosters have flowing hackle feathers and a “lobster tail” – a downward angled tail with lavish feathering. Their look is truly unique to the breed. These birds are very tame, with a friendly and curious disposition. They very heat tolerant, for those of you with long hot summers! The hens are reliable layers, lay small eggs and are good brooders.',
        images: 'assets/module_images/M1/L1/Cubalaya.jpg'
    },
    // M1; L1; C2 info
    {
        content_info_id: 49,
        lesson_content_id: 2,
        label: 'How to Pick a Healthy Chick',
        description: 'Chick Days are in full swing and if you walk into any farm and ranch store, chances are good that you’ll be greeted with fuzzy, adorable peeping chicks. Who can resist?! But before you scoop up your chicks, you’ll want to make sure you’re choosing the healthiest of the flock.',
        images: ''
    },
    {
        content_info_id: 50,
        lesson_content_id: 2,
        label: 'Here are ways to spot a healthy chick:',
        description: 'They’re alert and active – may be cheeping softly, looking for food, and will move away from you when approached. Chicks that aren’t well will appear lethargic and constantly sleepy, and may not try to move away when approached. If chicks are happy, healthy and warm, they won’t huddle together when awake. Bright-eyed – chicks with a blank stare, crusted eyes or always sleepy may not be healthy. Look for a beak that is not crossed over or broken – birds with beak issues will have problems eating and drinking. •	Healthy feathers – unless you’re buying an older chicken during molt, chickens and chicks shouldn’t be missing feathers. Straight legs, feet and toes – an unhealthy chick may have difficulty walking or have poor posture with its neck retracted into its body. If a bird is acting dull, withdrawn or hunched over, it could indicate a serious problem. You don’t always have to buy your birds from a store, sometimes you can purchase them directly from a breeder, or a friend, or someone looking to re-home their hen. These tips apply to both chicks and full-grown chickens and the key is to make sure you purchase your birds from a reputable source to avoid serious health problems with your flock. If you’re going to buy from a breeder, here is a list of the best breeds for beginners.',
        images: 'assets/module_images/M1/L1/chick.jpg'
    },
    // M1; L1; C3 info
    {
        content_info_id: 51,
        lesson_content_id: 3,
        label: '',
        description: 'Avoid low-lying areas near streams with flooding potential. Preferably, the topography will allow the long axis of the poultry house to be located in an east-west direction. This helps to minimize the amount of direct sunlight that would enter through the sidewalls of the houses.',
        images: ''
    },
    {
        content_info_id: 52,
        lesson_content_id: 3,
        label: 'Housing',
        description: 'We distinguish three forms of chicken farming: extensive farming, intensive farming and semi-intensive farming. When chickens are free to roam and scavenge, we talk about extensive, free-range chicken farms. The level of capital and labor investment is low. Housing is not important. Intensive systems, developed for specialized breeds, are estimated to be in use for about 30% of the poultry population. These are mainly found in and around urban areas with good markets for eggs and chicken meat. Intensive chicken farms require more investment of both capital and labor, e.g. special poultry houses with runs or roaming space. Flock sizes in intensive production are normally in the thousands. This has been made possible by research developments in artificial incubation, nutritional requirements and disease control. In the semi-intensive production system, also known as backyard production flocks range from 50 to 200 birds. A lot of techniques and expertise developed in intensive systems can be applied in semi-intensive poultry raising systems, adapted to the adequate scale. In both the semi-intensive and intensive production systems, housing is very important for optimal production levels.',
        images: ''
    },
    {
        content_info_id: 53,
        lesson_content_id: 3,
        label: 'Free-range chickens',
        description: 'In the free-range system, chickens are free to roam the farm in search of food. Eggs are laid outside in simple nests and are mainly used to maintain chicken numbers. In many cases, up to 75% of the eggs have to be hatched because the mortality rate among baby chicks is high. Few eggs remain for consumption and the chickens themselves do not give much meat. The advantages of this system are that little labour is needed and waste food can be used efficiently. Very low costs can offset low production levels so that keeping chickens around the house can be profitable if certain improvements are made. The free-range system is most suitable if you have a lot of space, preferably covered with grass. At night, the chickens can be kept in any kind of shelter, as long as it is roomy, airy and clean. This will minimize the loss of chickens to illness or theft. If you have enough space for the chickens to roam freely, a mobile chicken house is best.',
        images: ''
    },
    {
        content_info_id: 54,
        lesson_content_id: 3,
        label: 'Figure 3.1: A simple mobile chicken house',
        description: 'The spread of infection by parasites in chicken feces can be prevented by using a raised night shelter with an open floor made of chicken-wire, wooden slats or bamboo sticks 5 cm apart. This will also keep the chickens safe from predators. If you want to maximize the number of eggs, train mature layers to use laying nests in the chicken house early in the laying period. Place the laying nests in the chicken house before the chickens start laying, and keep them in a bit longer in the morning. Remember to provide fresh drinking water. To limit mortality among baby chicks in the free-range system, take steps to protect the mother hen and the chicks from predators, thieves and rain. Put them in a simple, separate shelter that is roomy and airy and can be closed securely. Draughts and low temperatures during the first few days are particularly dangerous for the baby chicks. Although a run is handy, it is also risky, due to possible worm infections. It is important to move the run regularly, especially in wet weather. Fold units are very suitable mobile housing units for young chicks. These cages can house 20 young hens, and contain feeders, drinkers and a perch. Obviously, you will need enough space to move the fold units around regularly.',
        images: 'assets/module_images/M1/L1/chicken_house.png'
    },
    {
        content_info_id: 55,
        lesson_content_id: 3,
        label: 'Figure 3.2: Fold unit for housing young chicks.',
        description: '1. boarded section, 2. wooden framework, 3. wire mesh, 4. wired floor. In areas where dogs or predators are a problem, it might be worth building a shelter well above ground level (e.g. 1.20 m high). Tin rat baffles around the supporting poles will keep out rats and other small animals. The baffle must fit tightly to keep even the smallest rodent from climbing between the baffle and the pole. Always ensure a steady supply of clean, fresh drinking water. Give your chicks extra feed, including greens which are rich in vitamins. If possible, vaccinate the chicks against the most common contagious viruses, such as Newcastle Disease.',
        images: 'assets/module_images/M1/L1/chicken_house.png'
    },
    {
        content_info_id: 56,
        lesson_content_id: 3,
        label: 'Figure 3.3: Systematic daily movement of fold units',
        description: 'Advantages of the free-range system: Exercise in the open air keeps chickens healthy. Feed, even if it is not well balanced, presents few problems. Parasitic infections can be kept to a minimum if there is enough space. Little or no labor input is needed. The chickens help limit the amount of rubbish in a productive way. The direct costs of the system are low.',
        images: 'assets/module_images/M1/L1/unit.png'
    },
    {
        content_info_id: 57,
        lesson_content_id: 3,
        label: '',
        description: 'Disadvantages of the free-range system: Free-range chickens are difficult to control. The chickens, especially young chicks, are easy prey for predators. Chickens may eat sown seed when looking for food. A large percentage of the eggs can be lost if the laying hens are not accustomed to laying nests. Mortality rates are usually high.',
        images: ''
    },
    {
        content_info_id: 58,
        lesson_content_id: 3,
        label: 'Figure 3.4: Examples of rat baffles',
        description: 'A. metal collar B. metal can upside down C. metal band around post',
        images: 'assets/module_images/M1/L1/rat.png'
    },
    {
        content_info_id: 59,
        lesson_content_id: 3,
        label: 'Small-scale housing',
        description: 'In both the intensive and semi-intensive production systems, housing becomes very important for improving working conditions and minimizing risks. Adequate housing facilitates the feeding and egg laying and thus is a primary condition for optimal production levels. If you decide to keep your chickens in a special poultry house, consider the following: You will certainly incur extra costs. Make sure that necessary materials are locally available. Should your chicken have a run? If you opt for a run, check that there is enough space to change its position regularly. Decide whether to continue to breed own chicken stock or to buy new stock. If you breed your own stock, you need to build more houses for separating chicks of different ages.',
        images: ''
    },
    {
        content_info_id: 60,
        lesson_content_id: 3,
        label: 'Optimizing climate in the house',
        description: 'Chickens can tolerate high temperatures but react negatively if they are too warm. Try the following as guideline when designing the poultry house. Build the house in an east-west direction, so the chickens are less exposed to direct sunlight. Place the house where there is grass, herbs or other vegetation. Plant trees around it to keep its roof shaded. Make sure that the roof has a large overhang of 90 cm or more to limit direct sunlight and keep out the rain. Build the roof as high as possible above the floor. The chicken house will then be cooler and better ventilated. Keep the bottom 50 cm of the side walls closed and the rest open to allow enough fresh air into the house. Close the top part of the sidewalls with chicken wire or some other suitable material. A chicken house can have a corrugated metal roof, but in a sunny place, this will certainly overheat the house. In this case cover the roof with leaves or some other material. A disadvantage of this is that rodents like rats and mice can nestle in the covering. Do not keep too many chickens in the chicken house. Doing so can make the house too warm and help to spread parasitic infections. In hard-floor housing, there should be no more than 3 chickens per square meter. In houses with wire netting or slatted floors, a higher chicken density is possible. Finally, to stimulate feeding in cooler weather, turn on a light in the house before sunrise and after sunset. This also helps to keep a steady level of egg production.',
        images: ''
    },
    // M1; L1; C4 info
    {
        content_info_id: 61,
        lesson_content_id: 4,
        label: '',
        description: 'One of the main factors of whether your chicken farming venture in the Philippines will succeed or not is going to be the quality of your chicken coop or chicken house. It is so because a poorly design chicken coop can expose your poultry flock to weather extremes, lead to overstocking which leads to antisocial behavior and greater stress of your birds, and expose your flock to predators.',
        images: ''
    },
    {
        content_info_id: 62,
        lesson_content_id: 4,
        label: 'Make Sure the Chicken Coop Is Predator-Proof',
        description: 'The very first thing to keep in mind is to keep your chicken house completely predator-proof. This means that not only the sides and the roof should be completely protected, but also the ground since some predators will try to burrow their way to reach your flock. If you have a chicken run that has been fenced with barbed wire, ensure that there are no holes beneath the wire mesh fencing. Also, as standard fencing wires generally have large holes that can allow various predators to get it, it is advisable to reinforce them with a chicken wire with smaller holes that will not allow any dangerous animal through them. Additionally, you can also position the chicken coop or chicken house among tall trees so as to protect the birds from flying predators especially if they are still young.',
        images: ''
    },
    {
        content_info_id: 63,
        lesson_content_id: 4,
        label: 'Protect Your Chicken House from Rodents',
        description: 'While predators are a threat to the chicken directly, rats and rodents burrow their way into chicken houses to access chicken feed and other leftover food. On top of that, they also spread diseases, and as such, it is best to keep them as far from your flock as possible. Some of the things you can do to make your chicken coop rat-proof, include cementing the flooring or installing a small mesh fence on the ground below the coop.',
        images: ''
    },
    {
        content_info_id: 64,
        lesson_content_id: 4,
        label: 'Chicken Houses in the Philippines Need to be Breezy',
        description: 'The Philippines is generally a hot country, and chickens are birds with plumage designed to protect them from excessive cold. Because of this, your chicken house must be well ventilated and a little breezy. Have low air pressure coming into your chicken house in the Philippines. However, don’t make it too draughty. Draught is simply too much cold air coming into the chicken coop which makes it uncomfortable for the birds during the cold months. And, as long as the conditions are not too draughty, the chickens will be able to withstand the cold.',
        images: ''
    },
    {
        content_info_id: 65,
        lesson_content_id: 4,
        label: 'Design the House for Easy Cleaning',
        description: 'It is easy to get carried away and build a fancy chicken house with many nook-and-crannies. However, when designing your coop, keep in mind the fact that you will have to clean it regularly to avoid pestering of bacteria and bugs. As such, to the maximum extent possible, keep the design simple and easily cleanable. Separately, also pick equipment that is easy to clean. For example, where possible, have removable droppings trays as they are easier to clean than having to clean the house itself. One of the places you can place them is under the perching poles so as to capture most of the droppings.',
        images: ''
    },
    {
        content_info_id: 66,
        lesson_content_id: 4,
        label: 'Provide Your Chickens with Roosting Poles',
        description: 'No matter what farming system you use, but especially in free range chicken farming and native Philippines chicken farming, it is important to set up roosting poles in your chicken house to allow for proper rest of your birds. The roosting poles or perching poles should be about 2 inches wide with rounded edges. It is advisable to allow for about 10 inches between each of the poles, and about 5 to 10 inches of sideway-space per bird. Also, the poles should be positioned in the corners of the chicken coop to allow for easy movement of the birds within the chicken house. If you are space constrained, you can arrange the perching poles in a ladder-like set-up.',
        images: ''
    },
    {
        content_info_id: 67,
        lesson_content_id: 4,
        label: 'Provide Nest Boxes in the House',
        description: 'In order to encourage egg laying by your hens, it is advisable to provide one nest box for every 4 or 5 chickens. For maximum efficiency, the nest boxes should be dark and out of the way in a quiet area. The reason to keep the boxes in the least trafficked place of your chicken house is that hens generally have the instinct to lay their eggs in the safest and quietest possible place they can find.',
        images: ''
    },
    {
        content_info_id: 68,
        lesson_content_id: 4,
        label: 'Make Sure the Chicken House Is Roomy Enough',
        description: 'The last thing I will mention here is that you should make sure to build your chicken house roomy enough. It should be able to accommodate the feeders and drinkers at a safe distance so as to avoid congestion and allow the birds to feed freely without fighting or contaminating the food.',
        images: ''
    },
    // M1; L2; C1 info
    {
        content_info_id: 69,
        lesson_content_id: 6,
        label: '',
        description: 'The need for a Poultry Housing a) Protection from other climatic extremes such as direct sun, wind, rain and even against theft and attack from natural enemies of the birds such as, fox, dog, cat, kite, snake, etc. The birds also should be protected against external parasites like ticks, lice, mice, etc. b) Comfort: The best egg production is secured from birds that are comfortable and happy. To be comfortable, a house must provide adequate accommodation, be reasonably cool in the hot weather, free from drafts and sufficiently warm during the cool weather. Above all, provide adequate supply of fresh air and sunshine; and remain dry always. c)       Provision of dry condition which are hygienic and do not predispose the birds to diseases and parasites. d)      Allowing, as far as possible, for inherent behavior patterns of the birds, and minimizing the effect of social dominance. e)      Convenience: The house should be located at a convenient place, and the equipment so arranged as to allow cleaning and other necessary operation as required. f)       Provision of accessible food and clean water and for effective disposal of waste. g)      Providing condition so that good stockmanship can be practiced.',
        images: ''
    },
    {
        content_info_id: 70,
        lesson_content_id: 6,
        label: 'Location of Poultry Housing',
        description: 'In planning a poultry house, the location should be taken into consideration. In selecting site for poultry houses, the following factors should be considered:',
        images: ''
    },
    {
        content_info_id: 71,
        lesson_content_id: 6,
        label: '1. Relation to other Buildings',
        description: 'The poultry house should not be close to the home as too create unsanitary condition. On the other hand, it should not be too far away either because this will require more time in going to and fro in caring for the birds. In general, at least three trips should be made daily to the poultry house in feeding, watering and gathering the eggs.',
        images: ''
    },
    {
        content_info_id: 72,
        lesson_content_id: 6,
        label: '2. Exposure',
        description: 'The poultry house should face south or east in most localities. A southern exposure permits more sunlight in the house than any of the other possible exposures. An eastern exposure is almost as good as a southern one. Birds prefer morning sunlight to that of the afternoon. The birds are more active in the morning and will spend more time in the sunlight.',
        images: ''
    },
    {
        content_info_id: 73,
        lesson_content_id: 6,
        label: '3. Soil and Drainage',
        description: 'If possible, the poultry house should be placed on a sloping hillside rather than a hilltop or in the bottom of a valley. A sloping hillside provides good drainage and affords some protection.',
        images: ''
    },
    {
        content_info_id: 74,
        lesson_content_id: 6,
        label: 'Poultry Farming: Poultry Housing and Equipment',
        description: 'The type of soil is also very important if the birds are to be given a range. A fertile well drained soil is desired. This will be a sandy loam rather than a heavy clay soil. A fertile soil will grow good vegetation which is one of the main reason for providing range. If poultry house is located on flat poorly drained soil, the yards should be tiled, otherwise, the birds should be kept in total confinement.',
        images: ''
    },
    {
        content_info_id: 75,
        lesson_content_id: 6,
        label: '1.	Shade and Protection',
        description: 'Shade and protection of the poultry house are just as desirable as for the house. Trees serve as a Windbreak in the rainy season and for shade in the dry season. They should be tall, and not very close to the soil. Dwarf tree can become contaminated, makes the soil damp and prevent sunlight from reaching the soil to destroy the germs. One thing a farmer should note is that plenty of sunshine should be available at the site.',
        images: ''
    },
    {
        content_info_id: 76,
        lesson_content_id: 6,
        label: 'Housing Requirements',
        description: 'Floor Space: The smaller the house, the more square feet are required for each hen. Bigger pens have more actual usable floor space per bird than smaller pens. The recommendations suggested below might be useful regarding floor, feeders and watering space. For economic production of laying hens, it is always better to keep them in small unit of 15-25 birds. This number can go up to a maximum limit of 250 or so are advisable. When there is a long house, partitioning at every unit should be made to eliminate drafts etc.',
        images: 'assets/module_images/M1/L2/table1.png'
    },
    {
        content_info_id: 77,
        lesson_content_id: 6,
        label: 'Ventilation',
        description: 'Ventilation in the poultry house is necessary to provide the birds with fresh air and to carry off moisture. Since the fowl is a small animal with a rapid metabolism, its air requirements per unit of the body is high in comparison with that of other animals. A hen weighing 2kg and on full feed, produces about 52 litres of CO2 every 24 hours. Since CO2 content of expired air is about 3.5%, total air breathed amounts to 0.5 litre per kg live weight per minute. A house that is well tall enough for the attendant to move around comfortably will supply far more air space than will be required by the birds that can be accommodated in the given floor space.',
        images: ''
    },
    {
        content_info_id: 78,
        lesson_content_id: 6,
        label: 'Poultry Farming: Poultry Housing and Equipment',
        description: '',
        images: ''
    },
    {
        content_info_id: 79,
        lesson_content_id: 6,
        label: 'Temperature',
        description: 'Hens needs a moderate temperature of 50-70oF. Birds need a warmer temperature at night, then they are inactive, than during the day. The use of insulation with straw pack or other materials not only keeps the house warmer during the rainy seasons, but also cooler during the dry seasons. Cross ventilation also aids in keeping the house comfortable during hot weather.',
        images: ''
    },
    {
        content_info_id: 80,
        lesson_content_id: 6,
        label: 'Dryness',
        description: 'Absolute dry conditions inside a poultry house is always an ideal condition. Dampness causes discomfort to the birds and also gives rise to diseases like colds, pneumonia. Dampness in poultry house is caused by:- (a) Moisture rising through the floor, (b) leaky roofs or wall, (c) Rain or snow entering through the windows, (d) leaky water containers, (e) Exhalation of birds',
        images: ''
    },
    {
        content_info_id: 81,
        lesson_content_id: 6,
        label: 'Light',
        description: 'Daylight in the house is desirable for the comfort of the birds. They seem more contented on bright sunny days than in dark, cloudy weather. Sunlight in the poultry house is desirable not only because of the destruction of disease and germs, it also for supplying vitamin D; but also because, it brightens the house and makes the birds happy. Birds do fairly well when kept under artificial light.',
        images: ''
    },
    {
        content_info_id: 82,
        lesson_content_id: 6,
        label: 'Sanitation',
        description: 'The worst enemies of the birds, i.e. lice, ticks, fleas, and mites are abundant in poultry houses. They do not only transmit diseases, but also retard growth and laying capacity. The design of the house should be such which admits easy cleaning and spraying. There should be minimum cracks and crevices. Angle irons for the frames and cement asbestos or metal sheets for the roof and walls are ideal construction materials, as they permit effective disinfection of the house. When the wood is to be used, every piece should be treated with coaltar, creosote or any other similar insecticides before being fitted. Used engine oil mixed with wood treatment chemicals can also serve as a good alternative.',
        images: ''
    },
    {
        content_info_id: 83,
        lesson_content_id: 6,
        label: 'Types of Roofs for a Poultry House',
        description: 'There are several styles of poultry house with reference to types of roofs:',
        images: ''
    },
    {
        content_info_id: 84,
        lesson_content_id: 6,
        label: 'SHED Types',
        description: 'This is the simplest type of poultry house and by far the most useful and practical type of house that can be used under different climatic conditions and for different systems of poultry keeping. The slope of the roof needs only be slight in the plains, while in heavy rainfall, it ought to be sufficiently steep. The shed-roof types of houses may be either portable or stationary. The portable house in generally a small one, not exceeding 8×6 inches while the stationary types can be made of any dimensions.',
        images: ''
    },
    {
        content_info_id: 85,
        lesson_content_id: 6,
        label: 'GABLE ROOF TYPE',
        description: 'This type requires more material and labour for construction. Some poultry farmers put a ceiling floor in gable roof houses and use the space in the gable for storage. The type is more suitable in rainfall areas. Here, again, gable type may be stationary or portable.',
        images: ''
    },
    {
        content_info_id: 86,
        lesson_content_id: 6,
        label: 'Combination',
        description: 'Such houses have double pitch roofs  in which the ridge between the two slopes is not mid-way from front to back. Most of the gable type, the combination roof requires more materials and labor than the shed roof.',
        images: ''
    },
    {
        content_info_id: 87,
        lesson_content_id: 6,
        label: 'House Construction',
        description: '',
        images: ''
    },
    {
        content_info_id: 88,
        lesson_content_id: 6,
        label: '1. Roofs',
        description: 'In most African countries, cement- asbestos sheeting although, very satisfactory and durable is expensive, yet, it is still recommended if the farmer has the capital. Conjugated iron and zinc sheets are equally satisfactory, but the cost is lower than cement asbestos. You can ceil the house with zinc sheets.',
        images: ''
    },
    {
        content_info_id: 89,
        lesson_content_id: 6,
        label: '2.	Door',
        description: 'The door of the poultry house must be on the south, and made of an angle iron frame covered with ½ “ mesh Wire netting. The size of the room should be always large enough to allow a man to conveniently pass through.',
        images: ''
    },
    {
        content_info_id: 90,
        lesson_content_id: 6,
        label: '3. Windows',
        description: 'About one meter block work is recommended as the normal height and the remaining upper part of the wall would be walls to the pillar post. Remember to make the roof overhang at least 18-36 inches out from the wall to cut down radiation through the window opening.',
        images: ''
    },
    {
        content_info_id: 91,
        lesson_content_id: 6,
        label: 'Poultry Farming: Poultry Housing and Equipment Poultry House Equipment',
        description: 'The poultry house should be equipped with roasts, nests, feed hoppers, water containers and any other items which is essential for satisfactory production: It should be simple in construction, Cheap, Movable, Easily Cleaned, and Easily disinfected whenever necessary.',
        images: ''
    },
    {
        content_info_id: 92,
        lesson_content_id: 6,
        label: '1.	Perches or Roosts',
        description: 'Chickens start roosting when they are 8weeks old. Apart from catering for the natural instinct or desire of the chickens to get above the ground at night, perches help materially to keep the bird’s feet and plumage clean. Perches can be made from long wooden bars of two squares inches about rounded at the top and flat at the bottom. Fix these parches about 16 inches above the ground and near the walls in such a way that they can be removed for disinfection. Allow a space of 12-inches between two perches. Each bird will need about 8-inches of the perch to roost. The rear perches should rest a little higher than those at the front if they are arranged to be horizontal with the length of the house. This will encourage some of the birds that like to roost high to go to the back perches. Paint the perches occasionally with creosote to prevent insects.',
        images: ''
    },
    {
        content_info_id: 93,
        lesson_content_id: 6,
        label: '2.	NEST BOXES',
        description: 'Each pen of laying birds should be provided with nest boxes for laying eggs. It should be roomy, movable, cool and well ventilated, dark and conveniently located. Nests are usually constructed 14 inches square, 6 inches deep and about 15 inches head allowance. All metal nests are preferred to wood nests because of easy cleaning and less chance of becoming infested with mites. Empty kerosene tins make excellent boxes. One nest should be provided for every 4 or 5 hens. Dark nests are desirable because they result in less scratching in the nest, less egg breakage and less egg eating. A wooden packing case 18 inches square or a wide mouthed earthen pot can be a suitable nest. Place some sand or soft hay or straw inside. Nests sometimes are also placed inside a run but in that case, care should be taken to prevent crows and other predators by covering the top of the run with wire netting.',
        images: ''
    },
    {
        content_info_id: 94,
        lesson_content_id: 6,
        label: '3.	TRAP NESTS',
        description: 'Each nest is provided with a trap door so that when the poultry attendant releases the hen from the nest, he/she can identify her and mark her leg-band number on the egg. There should be one nest for every three or four birds. Trap nests differ from regular nests in that they are provided with trap doors by which birds shout themselves in when they enter. For the convenience of the poultry attendant, the nests should be placed 18-20 inches above the floor. Trap nests are needed in the poultry houses (Deep litter houses) interested in knowing the performance or breeding of the hens.',
        images: ''
    },
    {
        content_info_id: 95,
        lesson_content_id: 6,
        label: '4.	FEED HOPPERS',
        description: 'The essential features of satisfactory feed hoppers are that they; Avoid wastage of feed. Prevent the birds from getting their feet into the feed and from roosting on the hopper. Are easy to clean. Make it easy for the birds to eat from the bottom of the hopper Troughs, pots and pans used for feeding should be of suitable size depending on the age and size of the birds.',
        images: ''
    },
    {
        content_info_id: 96,
        lesson_content_id: 6,
        label: '1.	Watering Devices',
        description: 'An ample supply of water should be made available at all times or egg production is liable to be affected. The water container should contain clean water, kept cool in dry seasons and be easily cleaned because contaminated water tends to spread certain diseases from chicken to chicken. Different designs of water containers (mostly plastic containers) satisfying the above needs can be provided.',
        images: ''
    },
    {
        content_info_id: 97,
        lesson_content_id: 6,
        label: '2.	HOVERS',
        description: 'This is a heat providing unit. It is made up of pan or Tarpaulin. Brooder unit are maintained with a range of temperature selections for hatchlings. At the warmest, usually the center of the unit, the temperature is maintained at or above 90oF. At the outer edges, the temperature may be as low as 60oF. As the young birds grow; the peak temperature is gradually reduced to about 70oF. Hovers are often used until the birds have reached 4-6weeks of age.',
        images: ''
    },
    // M1; L2; C2 info
    {
        content_info_id: 98,
        lesson_content_id: 7,
        label: 'Introduction',
        description: 'Litter management has a huge impact on poultry health and comfort. Glenneis Kriel asked Jan Grobbelaar, an independent poultry consultant, for advice on how producers can make the most of poultry bedding. Poultry litter can either be a farmer’s best friend or worst enemy. When managed properly, it will help to prevent diseases and boost farm income by creating a favorable production environment. When managed poorly, it will not only have a negative impact on animal health, welfare and carcass quality, but also on the feed conversion ratio and growth of birds.',
        images: 'assets/module_images/M1/L2/chicks.jpg'
    },
    {
        content_info_id: 99,
        lesson_content_id: 7,
        label: '',
        description: 'Making the most of poultry litter starts with choosing the right kind of bedding material. According to Jan Grobbelaar, training director at Dumela Poultry Solutions in Pretoria, South Africa, bedding material should be light, so that it is easy to manage. It should also be suited for use in compost or animal feed, so that it can be easily be disposed of after use. For health reasons, however, opt for a material that’s soft and compressible, with a medium particle size. “Birds might have trouble walking on material with particles that are larger than 30mm, such as crushed maize cobs, wood chips and wheat straw,” says Grobbelaar. “Material with such large particle sizes could hurt their feet and cause conditions such as bumblefoot (ulcerative pododermatitis) or breast lesions. These may have a decimating impact on farm bottom lines, by resulting in carcass downgrades and rejections.”',
        images: ''
    },
    {
        content_info_id: 100,
        lesson_content_id: 7,
        label: '',
        description: 'But there are also problems associated with materials that have particle sizes smaller than 2mm – such as sawdust, fine-ground or finely chopped wheat, straw or hay – or that might produce dust, such as wood bark. As Grobbelaar explains, poultry dust – airborne particles of feed and bedding mixed with organic matter from droppings, feathers and dead skin – can affect bird and human health, because, aside from poultry waste, it contains bacteria, viruses and fragments of fungi and spores. “In the past, it was thought that poultry dust did not have a negative impact on human health, but today we know that it causes respiratory problems in birds and humans,” he says, adding that the material used as litter, the age of the litter and climatic conditions all exert an influence on dust levels in a grower house.',
        images: ''
    },
    {
        content_info_id: 101,
        lesson_content_id: 7,
        label: 'An absorbing problem',
        description: 'Another essential quality for material used as bedding is that it should be highly absorbent and quick to dry, to reduce contact between birds and manure. Grobbelaar says pine shavings are still the most popular bedding material in South Africa. Peanut and sunflower hulls are also good, but they have to be turned every week or two to prevent them from caking and to maintain friable conditions. “Fungi that could be damaging to broiler health, will develop if sunflower or peanut hulls become wet,” explains Grobbelaar. Paper and sawdust are not ideal when it comes to moisture absorption, according to Grobbelaar, since paper tends to harden when it gets wet. Sawdust absorbs moisture, but takes too long to release it again – resulting in the litter becoming very wet. Excess moisture in bedding material is a real problem as it will increase the incidence of breast blisters, skin burns, bruising, condemnations and downgrades. It will also promote bacterial and fungal growth and can cause excessive ammonia emissions. Grobbelaar points out that ammonia levels of about 25 parts per million (ppm) have been associated with poor growth rates, birds’ increased susceptibility to Newcastle disease and a build-up of E. coli. Prolonged exposure to ammonia levels of 50 to 100 ppm has also been found to cause keratoconjunctivitis and blindness.',
        images: ''
    },
    {
        content_info_id: 102,
        lesson_content_id: 7,
        label: '',
        description: 'The ideal is to maintain litter moisture levels at between 21 and 25 per cent. When the litter exceeds 30 percent, ammonia production will increase as temperatures go up. “To estimate the moisture content of your litter, squeeze a handful of it into a ball,” advises Grobbelaar. “If it sticks together in a ball, it is too wet. If it only adheres slightly it will have the proper moisture content. If it doesn’t adhere at all, it may be too dry, which is also a problem.” When it comes to the detection of ammonia levels, Grobbelaar said that levels of 10 to 15 ppm can usually be detected by smell. At 25 to 35 ppm it will burn your eyes; at 50 ppm, it could result in broilers exhibiting watery and inflamed eyes, and at 75 ppm, broilers will start showing discomfort and might start jerking their heads. New bedding material should be stored properly before it is spread in the broiler house, to avoid wet-litter problems. Broiler houses should be managed properly in terms of humidity, ventilation and stocking density and the bedding should be between 70mm and 100mm deep, depending on the type of material used and conditions in the broiler house. Birds should also receive a high-quality diet to prevent a built up of high moisture levels. Grobbelaar explains that certain dietary ingredients, especially salts, and some drugs cause birds to drink and excrete large amounts of water, which exacerbates wet-litter conditions. In South Africa bedding is renewed after every production cycle.',
        images: ''
    },
    {
        content_info_id: 103,
        lesson_content_id: 7,
        label: 'Keep the heat in',
        description: 'In addition, the ideal bedding material will have low thermal conductivity to retain warmth and act as insulation – it should help to protect broilers from the cold floor. Grobbelaar says this is one of the reasons he does not like sand that much: it has poor thermal conductivity and therefore stays cold. Birds might also struggle to move in sand, if it is spread too deeply. Finally, your chosen bedding should be free from harmful toxins and contaminants. Grobbelaar says it is best for growers to avoid hardwoods, for example, as these might contain fungi that could be harmful to the broilers. Cost is usually the biggest driver when it comes to selecting bedding material. But Grobbelaar warns that buying cheap material could actually cost you more in the long run: “While many producers only look at the initial cost, the long-term benefits of using better quality material on animal health and production might make up for the initial difference in price.”',
        images: ''
    },
    // M1; L2; C3 info
    {
        content_info_id: 103,
        lesson_content_id: 8,
        label: 'How to set up a brooder for baby chicks',
        description: 'Until they are fully feathered, baby chicks require special care. A quality brooder can meet the additional needs of your hatchlings, optimize their growth and ensure good health.',
        images: 'assets/module_images/M1/L2/baby_chick.jpg'
    },
    {
        content_info_id: 104,
        lesson_content_id: 8,
        label: 'Setting up your brooder',
        description: 'There’s a lot to consider when setting up a brooder for your baby chicks, but it’s worth the effort. Creating a nurturing environment is the difference between a productive flock and birds that never reach their full potential.',
        images: ''
    },
    {
        content_info_id: 105,
        lesson_content_id: 8,
        label: 'Container and location',
        description: 'A few common choices for brooding containers are cardboard, wood and plastic. A cardboard box is the simplest container choice but can be difficult to keep clean and dry. Wooden brooders are more durable but difficult to disinfect after the chicks move outside. Plastic brooding boxes are the easiest to keep clean, but not ideal for air circulation. If you are able to provide supplemental heat in a location free of drafts, building an enclosure in an outbuilding is your best option. No matter where you choose to locate your brooder, it must be able to maintain a temperature of 90 F for the first week.',
        images: ''
    },
    {
        content_info_id: 106,
        lesson_content_id: 8,
        label: 'Brooder guards',
        description: 'If you’re able to construct an enclosure for your baby chicks, you’ll need a brooder guard to keep them from wandering away from the heat source in the center. You can build yours using cardboard, tar paper or wire. Make it about one foot high and about 18 feet and 10 inches long to form a large circle. These measurements will give you about 3 feet between the brooder and edge of the guard.',
        images: ''
    },
    {
        content_info_id: 107,
        lesson_content_id: 8,
        label: 'Bedding',
        description: 'Once you’ve chosen a container or built an enclosure, you need to cover the floor of your pen with litter. Use a dry, clean material with good absorption qualities. Wood shavings are most commonly used. However, you need to make sure to select course shavings. Sawdust and fine shavings can lead to litter picking by chicks, which can cause gizzard impaction and lead to death. Chopped wheat straw is another commonly used bedding. It’s preferred to other varieties of straws such as rye, oat or barely because they contain oil that reduces their ability to absorb moisture. Other materials to choose from are sugar cane and peanut shells. No matter which material you chose, you should spread it over the bottom of your brooder so that it is at least 4 inches thick. Bedding should be changed at least weekly, but possibly daily depending on the number of chicks you have. The frequency of cleaning will also increase as your chicks grow.',
        images: ''
    },
    {
        content_info_id: 108,
        lesson_content_id: 8,
        label: 'Feeders',
        description: 'When constructing your feeder the most important thing to consider is ease of access. You want to ensure that there is adequate space for each of your chicks to get to the feeder(s) and that the location you’ve selected is comfortable (not too hot or too cold for the chick). For the first four weeks, you will need to reserve a space measuring 1 inch across and 2 to 3 inches deep per bird at the feeder. From four to eight weeks, your chicks will require a space measuring 2 inches across and 4 inches deep per bird. After eight weeks, they will need a space measuring four inches across and 5 to 6 inches deep per bird.',
        images: ''
    },
    {
        content_info_id: 109,
        lesson_content_id: 8,
        label: 'Waterers',
        description: 'Water is an invaluable part of a chick’s nutrition. It’s important to make sure water is available for your hatchlings at all times. A 1-quart waterer can serve up to 25 chicks for the first two weeks, but a gallon-sized waterer will be required after that. Placing marbles in the drinking area will attract your chicks to it, prevent them from wading in it and reduce their odds of drowning.',
        images: ''
    },
    {
        content_info_id: 110,
        lesson_content_id: 8,
        label: 'Heat sources',
        description: 'Temperature is one of the most important elements that can affect chick health. Your brooder must be able to maintain a temperature of 90 F through the first week. For every week after, the temperature should be dropped by 5 F until 70 F is reached. Make sure to preheat your brooding area to 90 F a couple days before putting hatchlings in it. There are many ways you can heat your brooder. Some commonly used heat sources for small flocks are electric brooder lamps and liquid propane gas or natural gas brooder stoves.',
        images: ''
    },
    {
        content_info_id: 111,
        lesson_content_id: 8,
        label: 'Lighting',
        description: 'Light intensity should be no less than 20 lux — roughly the amount given off by a street lamp — for the first three days of life. After that just make sure there is enough light for food and water intake, as well as, normal activity. Too much light can cause aggressive behaviors like feather picking or cannibalism.',
        images: ''
    },
    {
        content_info_id: 112,
        lesson_content_id: 8,
        label: 'Cleaning your brooder',
        description: 'You want to make sure you clean your brooder box or area between each set of chicks you raise in it. The process is simple.',
        images: ''
    },
    {
        content_info_id: 113,
        lesson_content_id: 8,
        label: '1. Wash',
        description: 'Use warm, soapy water to wash out your broader box/area and allow it to dry thoroughly.',
        images: ''
    },
    {
        content_info_id: 114,
        lesson_content_id: 8,
        label: '2. Sanitize',
        description: 'Using 1 teaspoon of bleach to every gallon of water, mix a sanitizer to soak your brooder in for 10 minutes. Then rinse and dry.',
        images: ''
    },
    {
        content_info_id: 115,
        lesson_content_id: 8,
        label: '3. Repeat',
        description: 'Follow steps one and two to clean and disinfect feeders, waterers and any other equipment you used in your brooder.',
        images: ''
    },
    // M1; L3; C1 info
    {
        content_info_id: 116,
        lesson_content_id: 9,
        label: 'Introduction',
        description: 'The chickens raised in an organic system can eat all the food waste and scraps from your cooking including vegetable peels and stalks, as well as grains. They can also help clean out the pasture in your backyard by eating bugs, grubs, snails, and so on. In an organic farming system, it is a relationship of give-and-take with your chickens. The chicken feed must come from organic sources, for example from certified farms. Organic chicken feed must be grown without using pesticides, antibiotics, herbicides and synthetic fertilizers and without using genetically modified cereals or plants. According to the EU legislation, organic chickens must be born and raised on organic farms and their food must also come from 100% organic sources.Since the number of these farms is not high enough yet, many farmers who make the decision to invest in an organic chicken farm also choose to cultivate their own cereals and forage plants. As feed costs have increased, animal products have become very expensive. If part of the feed could be substituted with root crops such as cassava, then part of the maize ration could be freed for human consumption. The low protein and fibre and high content of soluble carbohydrates (high digestibility) are notable features of the cassava root. Cassava tops, stems and leaves are also available as animal feed and are comparatively high in utilizable protein.',
        images: ''
    },
    {
        content_info_id: 117,
        lesson_content_id: 9,
        label: 'Introduction',
        description: 'The chickens raised in an organic system can eat all the food waste and scraps from your cooking including vegetable peels and stalks, as well as grains. They can also help clean out the pasture in your backyard by eating bugs, grubs, snails, and so on. In an organic farming system, it is a relationship of give-and-take with your chickens. The chicken feed must come from organic sources, for example from certified farms. Organic chicken feed must be grown without using pesticides, antibiotics, herbicides and synthetic fertilizers and without using genetically modified cereals or plants. According to the EU legislation, organic chickens must be born and raised on organic farms and their food must also come from 100% organic sources.Since the number of these farms is not high enough yet, many farmers who make the decision to invest in an organic chicken farm also choose to cultivate their own cereals and forage plants. As feed costs have increased, animal products have become very expensive. If part of the feed could be substituted with root crops such as cassava, then part of the maize ration could be freed for human consumption. The low protein and fibre and high content of soluble carbohydrates (high digestibility) are notable features of the cassava root. Cassava tops, stems and leaves are also available as animal feed and are comparatively high in utilizable protein.',
        images: 'assets/module_images/M1/L2/chickens.jpg'
    },
    {
        content_info_id: 118,
        lesson_content_id: 9,
        label: 'Nutrition requirements for organic chickens',
        description: 'Chickens and other poultry can qualify as organic only if they are raised under these conditions throughout their entire life cycle. Organic chickens have a balanced nutrition based on organic feed, they live in clean housings that provide enough space for movement, have outdoor access and are never treated with antibiotics. Organic chicken farms are inspected by the competent authorities on regular basis to maintain their organic certification. Agricultural ingredients used to feed organic chickens must come from certified organic farms. The chicken’s nutrition should include vitamins, mineral, proteins, amino acids, fatty acids, fiber and energy sources. Some ingredient may be used to replace supplements or additives in foods, for example eggshells and oyster shells may be used as a calcium supplement for egg laying chickens. The first question is to address the ingredients for homemade chicken feed.  Ingredients needed that will provide the right protein, vitamin, and mineral content for the flock are the following.',
        images: 'assets/module_images/M1/L2/chickens.jpg'
    },
    {
        content_info_id: 119,
        lesson_content_id: 9,
        label: 'For basic homemade chicken feed recipe:',
        description: 'Wheat (hard or soft, winter or spring – it doesn’t matter), Peas, Mealworms (live or freeze dried), Oats, and Sesame seeds or sunflower seeds. when combined, this recipe yields between 16 – 18% protein – for a growing pullet and a layer, that’s the optimum amount of protein. Both wheat and peas are great for protein (wheat has about 17% protein while the peas are about 24%). The oats are an excellent source of fiber in a homemade recipe, while the sesame and sunflower seeds are great for fat. There’s some controversy about the amount of mealworms a chicken should eat. Given the ability to forage, hens will consume large quantities of bugs – which are almost pure protein. However: If a chicken eats too much protein, she can develop kidney and other problems. When it comes to mealworms, add a 1/2 cup to their daily ration to start with, and let your chicken tell you if she needs more. If they seem like they need a protein bump, add another 1/2 cup or so of the meal worms. While I believe it’s best to offer live mealworms, not everyone has the time or energy to raise them for a homemade recipe (or the desire, they’re bugs after all!). That’s okay – Freeze dried ones provide a nice protein bump to your homemade grain too, and they’re easier to store.',
        images: ''
    },
    {
        content_info_id: 120,
        lesson_content_id: 9,
        label: 'Sprout Your Seeds',
        description: 'This is where the real savings comes in. When you sprout your wheat into fodder, you automatically unlock nutrients, and create a homemade chicken feed that’s easier for your flock to digest. In other words, more of the nutrients become bioavailable. For homemade chicken feed, soak the grains (also known as berries) for 24 hours, then allowing them 3 days to sprout.  You can sprout them longer than 3 days, but you might run into issues with mold. After 3 days, they’ve started to sprout and unlock the grass, but they haven’t turned into a moldy mess that might make your chickens sick. Once your grain has turned into fodder, you can feed the same weight or volume amount – which ends up being less seed overall. And the berries have turned into something more nutritious that it could ever be as just a seed. Depending on the type of peas you purchase, you can sprout your peas as well. (Note, if you purchase split peas, you won’t be able to sprout fodder).',
        images: ''
    },
    {
        content_info_id: 121,
        lesson_content_id: 9,
        label: 'Create a daily ration',
        description: 'For 5 chickens, however, in my experience, the following recipe works well for each meal: Sprouted seeds (5 cups), Peas (2.5 cups), Oats (2.5 cups), Sesame Seeds (2 tablespoons) and Mealworms (1/2 cup). While this homemade recipe usually works well, you might need to scale up or down a bit depending on your flock’s needs, and whether you allow them to forage.',
        images: 'assets/module_images/M1/L2/sprout.jpg'
    },
    {
        content_info_id: 122,
        lesson_content_id: 9,
        label: 'A note about fermenting',
        description: 'If you want to ferment your homemade chicken feed, you can leave the wheat soaking for another day or so. You will get bubbles what let you know the fermenting is taking place, and the berries will still sprout while submerged. As with anything fermented, let your nose be your guide – if it smells funny or rancid, toss it. Wheat that’s properly fermented will smell something like fresh bread or slightly like beer. I don’t recommend letting it soak for longer than an additional 2 days. You will unlock a lot of nutrients as it ferments, but if you wait too long, you can run into other issues. Make sure you keep your fermenting vessel covered and completely under water. You can ferment the peas as well, following the same steps. Here is my guide to fermenting chicken feed which works for my organic homemade chicken feed recipe or commercial feed.',
        images: ''
    },
    {
        content_info_id: 123,
        lesson_content_id: 9,
        label: 'Adding supplementary ingredients',
        description: 'You can add your supplementary ingredients to your homemade chicken feed, such as kelp, garlic, or oregano right before you feed your hens. Just mix them in as you normally would. I’m a big supporter of giving all three of those supplements to your chickens in a homemade recipe – kelp especially will help ensure your flock gets an iron boost, and the garlic and oregano are great for their antiseptic and immune boosting properties. This homemade organic chicken feed recipe has been successful for me – I hope it is for you, too! What to Feed Your Chickens:',
        images: ''
    },
    {
        content_info_id: 124,
        lesson_content_id: 9,
        label: 'Commercial Feed:',
        description: 'Commercial poultry pellets should make up the base of your chickens’ diet. These pellets are formulated to meet the nutritional needs of chickens and will ensure they’re getting everything they need without having to forage. This is especially important for chickens that can’t free roam in a large area since food may be limited in a condensed area. Commercial feeds are usually made with foods like sunflower seeds, oats, and wheat.',
        images: ''
    },
    {
        content_info_id: 125,
        lesson_content_id: 9,
        label: 'Grasses:',
        description: 'Chickens will eat broad-leaved weeds, like dandelions, and they will eat grasses like clover and Kentucky bluegrass.',
        images: ''
    },
    {
        content_info_id: 126,
        lesson_content_id: 9,
        label: 'Insects:',
        description: 'Chickens love to eat bugs and are very effective at helping to control populations of ticks. They will also eat earthworms, beetles, and crickets.',
        images: ''
    },
    {
        content_info_id: 127,
        lesson_content_id: 9,
        label: 'Seeds and Grains:',
        description: 'Chickens will eat pumpkin seeds, oats and oatmeal, corn, and cooked rice are all good options to feed your chickens. Just feed these in moderation as they tend to be very nutrient-dense.',
        images: ''
    },
    {
        content_info_id: 128,
        lesson_content_id: 9,
        label: 'Grit:',
        description: 'To help digest their food, chickens need to eat grit like sand or coarse dirt. The grit will help the gizzard grind up the food, making it easier to digest and to pull nutrients from.',
        images: ''
    },
    {
        content_info_id: 129,
        lesson_content_id: 9,
        label: 'Grit:',
        description: 'To help digest their food, chickens need to eat grit like sand or coarse dirt. The grit will help the gizzard grind up the food, making it easier to digest and to pull nutrients from.',
        images: 'assets/module_images/M1/L2/list_chicken.jpg'
    },
    {
        content_info_id: 130,
        lesson_content_id: 9,
        label: 'Treats for Chickens:',
        description: '',
        images: ''
    },
    {
        content_info_id: 131,
        lesson_content_id: 9,
        label: 'Vegetables:',
        description: 'Chickens love veggies and will gladly accept whole veggies as well as vegetable peels. Broccoli, cauliflower, zucchini, bell peppers, and tons of other veggies are chicken-safe. Avoid feeding raw potatoes and potato peels, as well as other nightshades, as these can make your chickens sick. Veggies can be fed on a daily basis.',
        images: ''
    },
    {
        content_info_id: 132,
        lesson_content_id: 9,
        label: 'Fruits:',
        description: 'Bananas, apple cores and peels, melons, and grapes are good options, as well as other non-citrus fruits. It’s best to remove seeds from apple cores prior to feeding since apple seeds contain small amounts of cyanide.',
        images: ''
    },
    {
        content_info_id: 133,
        lesson_content_id: 9,
        label: 'Mealworms:',
        description: 'Mealworms are available in freeze-dried and live forms, so you will be able to choose which to feed your chickens. They will happily eat either one, though!',
        images: ''
    },
    {
        content_info_id: 133,
        lesson_content_id: 9,
        label: 'Table Scraps:',
        description: 'Chickens will eat just about anything you offer to them. Pancakes, pasta, leftover oatmeal, and unusable scraps from produce like cores and peels. Feed table scraps in moderation and make sure to cut everything up into bite-sized pieces before feeding it to your chickens.',
        images: ''
    },
    {
        content_info_id: 134,
        lesson_content_id: 9,
        label: 'Protein:',
        description: 'Chickens are omnivorous, so feeding them meat can be beneficial to their diet. They don’t need a lot of meat but will often catch frogs and other small animals when possible as a snack. Chickens also can have some dairy, like cottage cheese, in small quantities. Meat and dairy proteins should be fed in moderation.',
        images: ''
    },
    {
        content_info_id: 135,
        lesson_content_id: 9,
        label: 'What Not to Feed Your Chickens:',
        description: 'Beans, Raw Potatoes, Onions, Citrus, Candy, Rhubarb, Avocado, and Ginger',
        images: ''
    },
    // M1; L3; C2 info
    {
        content_info_id: 136,
        lesson_content_id: 10,
        label: 'Introduction',
        description: 'Making your own chicken feed is a great way to save money and allows you to know exactly what you’re feeding your chickens. If you want to feed your chickens organically, use organic ingredients in these recipes. Try the chicken feed recipe for laying hens, or make the broiler feed if you are raising broiler hens. Both recipes are rich in protein and nutrients and will help to nourish your chickens.',
        images: ''
    },
    {
        content_info_id: 137,
        lesson_content_id: 10,
        label: 'Making Chicken Feed for Laying Hens',
        description: '107 pounds (49 kg) of whole maize meal, 41 pounds (19 kg) of soya, 28 pounds (13 kg) of fish meal, 31 pounds (14 kg) of maize bran, 13 pounds (5.9 kg) of limestone powder, and Makes 220 pounds (100 kg) of chicken feed',
        images: ''
    },
    {
        content_info_id: 138,
        lesson_content_id: 10,
        label: 'Creating Feed for Broilers',
        description: '250 pounds (110 kg) of cracked corn, 150 pounds (68 kg) of ground roasted soybeans, 25 pounds (11 kg) of rolled oats, 25 pounds (11 kg) of alfalfa meal, 25 pounds (11 kg) of fish or bone meal, 10 pounds (4.5 kg) of aragonite (calcium powder), 15 pounds (6.8 kg) of poultry nutri-balancer, and Makes 500 pounds (230 kg) of chicken feed',
        images: ''
    },
    {
        content_info_id: 139,
        lesson_content_id: 10,
        label: 'Making Chicken Feed for Laying Hens: 1. Measure the ingredients into a container',
        description: 'Add 107 pounds (49 kg) of whole maize meal, 41 pounds (19 kg) of soya, 28 pounds (13 kg) of fish meal, 31 pounds (14 kg) of maize bran, and 13 pounds (5.9 kg) of limestone powder into a container. This recipe makes 220 pounds (100 kg) of chicken feed, so you will need a large bucket or barrel to mix and store the feed in.[1] Use organic ingredients if you want to make the chicken feed organic. Purchase the ingredients from a bulk goods store or a farm shop.',
        images: ''
    },
    {
        content_info_id: 140,
        lesson_content_id: 10,
        label: '2. Mix the ingredients until they are thoroughly combined',
        description: 'Stir the feed with a shovel until all the ingredients are evenly dispersed throughout the container. This ensures that the chickens will receive the nutrients from the different ingredients when they are fed.[2] Make sure that you mix the ingredients that are in the bottom of the container. This may take a few minutes if you have made a large batch. Allow 2-3 minutes to mix a large bucket. If you have made a very large batch of chicken feed, use a spade to mix the ingredients.',
        images: ''
    },
    {
        content_info_id: 141,
        lesson_content_id: 10,
        label: '3. Give each chicken 0.28 pounds (0.13 kg) of feed per day',
        description: 'Multiply the feed needed per chicken by the number of chickens that you have. For example, 6 chickens x 0.28 pounds (0.13 kg) = 1.68 pounds (0.76 kg) of feed in total. Place the food into a feeder or sprinkle it on the ground in front of them. If you are using a feeder, simply pour the feed into the hole at the top and let it trickle down into the feeding plate. Purchase a feeder from a farm store or make your own chicken feeder.',
        images: ''
    },
    {
        content_info_id: 142,
        lesson_content_id: 10,
        label: '4. Store the chicken feed in a cool, dry place for up to 6 months',
        description: 'Garages or barns are ideal places to store chicken feed. Check the feed for mice, bugs, and mould before you give it to the chickens. If the feed has been contaminated, it is safest to throw it away.[3] If you don’t have a shed to store the feed in, put a lid on the container and keep it out of direct sunlight.',
        images: ''
    },
    {
        content_info_id: 143,
        lesson_content_id: 10,
        label: 'Creating Feed for Broilers: 1. Mix the cracked corn and ground roasted soybeans in a container',
        description: 'Measure 250 pounds (110 kg) of cracked corn and 150 pounds (68 kg) of ground roasted soybeans into a large container, such as a barrel or feed container. Mix the ingredients with a shovel until they are thoroughly combined.[4] Choose a container that has a lid. This will make it easier to store the feed. If you don’t have a big enough container, halve the recipe. This feed works well for broiler chickens as it has lots of protein to help the chickens grow. Use organic ingredients if you want to make organic feed.',
        images: ''
    },
    {
        content_info_id: 144,
        lesson_content_id: 10,
        label: '2. Stir the rolled oats, alfalfa meal, and fish or bone meal into the mixture',
        description: 'Measure 25 pounds (11 kg) of rolled oats, 25 pounds (11 kg) of alfalfa meal, and 25 pounds (11 kg) of fish or bone meal into the container. Mix the ingredients into the cracked corn and soybeans until all the ingredients are evenly distributed in the container.[5] Purchase the ingredients from a farm store or a bulk foods shop.',
        images: ''
    },
    {
        content_info_id: 145,
        lesson_content_id: 10,
        label: '3. Add the aragonite and poultry nutri-balancer to the container',
        description: 'Measure 10 pounds (4.5 kg) of aragonite (calcium powder) and 15 pounds (6.8 kg) of poultry nutri-balancer into the feed. Mix the ingredients thoroughly so that the powders are thoroughly distributed through the feed. The poultry nutri-balancer is an important addition to the feed, as it ensures that the chickens receive the nutrients that they need to grow quickly.[6] If you can’t find these ingredients at your local farm shop, look online or ask your vet to recommend a distributor. Aragonite is mineral found in limestone and is a great source of calcium.',
        images: ''
    },
    {
        content_info_id: 146,
        lesson_content_id: 10,
        label: '4. Feed each chicken 0.6 pounds (0.27 kg) of the mixture each day',
        description: 'Multiply the amount of feed per chicken by the number of chickens in the coop. Place the feed into a feeder or throw it on the ground once per day. Use 3 pounds (1.4 kg) of feed for every 5 chickens. It is important not to over-feed this mixture to cornish boilers as this can cause fatal heart attacks. This is uncommon as the chickens do not tend to eat more food than they need.',
        images: ''
    },
    {
        content_info_id: 147,
        lesson_content_id: 10,
        label: '5. Store the chicken feed in a covered container for up to 6 months',
        description: 'Multiply the amount of feed per chicken by the number of chickens in the coop. Place the feed into a feeder or throw it on the ground once per day. Use 3 pounds (1.4 kg) of feed for every 5 chickens. It is important not to over-feed this mixture to cornish boilers as this can cause fatal heart attacks. This is uncommon as the chickens do not tend to eat more food than they need.',
        images: ''
    },
    // M1; L3; C3 info
    {
        content_info_id: 148,
        lesson_content_id: 11,
        label: 'Introduction',
        description: 'Chickens are great additions to both traditional and urban farms. They help with pest control and produce enough eggs that many people sell them or give them away. Chickens are also foragers by nature, so they will happily spend the entire day pecking around for something to eat. There are a ton of food options for chickens, allowing you to provide them with a healthy diet and fun treats as well. Here are the things you need to know about feeding your chickens!',
        images: ''
    },
    {
        content_info_id: 149,
        lesson_content_id: 11,
        label: 'How Often to Feed Chickens',
        description: 'Ideally, you should split your chicken’s feed into two servings daily. If you’re home during the day, you can even make this 3-4 small feedings. Chickens enjoy small, frequent meals as opposed to large meals once a day. It’s best to feed your chickens their pellets in a feed trough of some sort for easy cleaning but treats and scraps can be tossed on the ground to provide an enriching hide-and-seek game for your chickens. Just make sure you’re not overfeeding or you may end up with leftover rotting food. A major benefit of feeding small meals twice daily is that it decreases the risk of attracting pests from food left sitting in the feed trough. Pick up any unfinished food at night to avoid attracting mice, possums, and other pest animals.',
        images: ''
    },
    {
        content_info_id: 150,
        lesson_content_id: 11,
        label: 'The Importance of Water in a Chicken’s Diet',
        description: 'Basically, all living things require water in some form for survival, and chickens are no different. They should always have access to clean water to prevent dehydration. A single chicken can drink up to a liter of water daily, and sometimes will drink even more during hot weather. Take this into account when you’re filling up your chickens’ waterer, and make sure to account for environmental factors like evaporation.',
        images: ''
    },
    {
        content_info_id: 151,
        lesson_content_id: 11,
        label: 'What Additional Supplements Do Chickens Need?',
        description: 'Sometimes, chickens are not able to fully absorb and make use of the nutrients in their food, so supplementation may be necessary. Not all supplements are needed all the time, but here are some supplementation ideas for you to keep your chickens healthy. They should be provided with a source of grit, especially if they are not free range. Free range chickens often pick up gravel and dirt as they roam, fulfilling their grit needs. Chickens also need adequate calcium for egg production, and this can be achieved by feeding them dried eggshells that have been crushed or ground into powder. There are also oyster shell supplements available at most feed stores. During the summer, adding electrolyte supplements into the water may be necessary and powdered electrolytes are usually available at feed stores. Powdered probiotics can be added to your chickens’ food to maintain digestive health. Apple cider vinegar may help thin mucus and garlic’s antibacterial properties can help reduce the risk of illness, although it may alter the taste of your eggs.',
        images: ''
    },
    {
        content_info_id: 152,
        lesson_content_id: 11,
        label: 'Ad libitum feeding versus food restriction',
        description: 'Ad libitum feeding means that the diet is available at all times. Restricted feeding refers to restricting the amount of food while still ensuring nutritional adequacy.',
        images: ''
    },
    // M1; L3; C4 info
    {
        content_info_id: 153,
        lesson_content_id: 12,
        label: 'Introduction',
        description: 'Most of the businessmen and farmers use traditional poultry farming methods. The traditional poultry farms lack proper and effective management to maintain health and growth of chicken. All the poultry activities like filling the water tank, monitoring temperature, time to time feeding of chicken, cleaning the chicken waste and light control in the farm are done manually. Hence, a large manpower is required. So without automation it requires manual work to take care of poultry (chickens) and what if the care taker/owner is not present in farm and due to some environmental conditions, the poultry birds get harms or may die, that may affect the business. Many problems arise while taking good care of the poultry birds as itis a very tedious and intricate task which demands lot of alertness and minimum errors. These sensitive creatures are prone to lot of diseases which might be a hindrance in the business',
        images: ''
    },
    {
        content_info_id: 154,
        lesson_content_id: 12,
        label: 'What to Do if Your Chicken Isn’t Eating',
        description: 'If you have a chicken that isn’t eating, you can offer things like a mush of commercial feed mixed with warm milk or water. Sometimes, all your chicken need is to be handfed for a little while, so you can try this as well as attempting feeding via syringe or spoon. If your chicken continues to refuse to eat or if you have multiple chickens who are suddenly showing inappetence, you should contact your veterinarian immediately. It’s possible your chickens may have encountered toxins or poisons and need veterinary care. When in doubt, contact your vet! Veterinarians are happy to answer questions, and many would rather see your chicken before they are very ill. This gives your chicken the best chance of regaining health.',
        images: ''
    },
    // M1; L4; C1 info
    {
        content_info_id: 155,
        lesson_content_id: 13,
        label: 'Management Minute – Broiler Weight Monitoring',
        description: 'Broiler weight is an important parameter when growing broilers.  After all, the end goal of raising broilers is to get as many birds to market as possible, using the least amount of feed, and producing the greatest amount of meat. With pressures on the industry to reduce antibiotic usage, there is a greater focus on finding new ways to maximize birds’ growth, health, and well being from the earliest stages. It has long been known that the better start a broiler bird gets the better chance for that bird to reach its genetic potential.  Broiler chickens have the genetic potential for significant weight gain over a very short period of time.  During the first 7 days, 80% of the bird’s energy is used for growth and only 20% for maintenance, indicating the importance of this period in the chicken’s life.  Weighing around 42g at hatch, broilers can achieve a weight of 2,800g (6 lbs.) within the next 42 days – an average daily growth rate of 66g (.146 lbs.). This growth rate is particularly significant within the first seven days, as the bird has the potential to increase its body weight by 450% from day zero to day seven.  Furthermore, according to management guidelines for the modern broiler, the birds are supposed to increase their live weight 4.25 times during the first 7 days, from approximately 40g to 180g.  Seven-day weight of the Cobb 500 in comparison with hatch weight has increased by 300% over the last 20 years.',
        images: 'assets/module_images/M1/L3/house_chick.jpg'
    },
    {
        content_info_id: 156,
        lesson_content_id: 13,
        label: '',
        description: 'Good early development of the chick reaching high 7-day weights will have a significant positive impact on the bird for the rest of its life.  It will improve the nutritional maturity of the bird and accelerate development of the gastro- intestinal tract.  Muscle growth and development of muscle morphology improves, as will long-term positive metabolic effects.  Below are performance numbers published by Ross and Cobb as to what should be expected for weight gains on their straight run broilers.',
        images: 'assets/module_images/M1/L3/table.jpg'
    },
    {
        content_info_id: 157,
        lesson_content_id: 13,
        label: '',
        description: 'As important as bird weight is in the broiler industry, it has never been a common practice to routinely weigh broilers, mainly due to the physical time it takes to weigh birds on a multiple barn farm. With the development of accurate automatic scales that can have multiple platforms in a single barn, collecting weights on a broiler farm has become easier, whether you raise straight run birds or sexed birds.  Actively weighing your birds gives vital data to help better manage birds to reach their genetic potential.  Weighing broilers can confirm how effective different management practices are.  Why spend time and energy doing something that does not give a payback in performance? Every management technique implemented should be to maximize performance of the flock.  There are weighing systems available with computer software that will collect and calculate important data such as average daily weight gains, daily actual weight, coefficient of variation, uniformity, and number of birds weighed.  Some programs have built in breed weight curves to be able to easily compare gains with documented weight curves for specific breeds.   These programs can have mortality inputted to be able to track total mortality easily.  Some of these programs will create graphs, email information, and send information to Excel spreadsheets which allows past flocks to be stored for easy comparison.',
        images: ''
    },
    {
        content_info_id: 158,
        lesson_content_id: 13,
        label: '',
        description: 'One of the best technological advancements for these weighing systems is the ability to be monitored through a controller or the internet.  These systems allow the user to access their information from an offsite location over the internet or just view and collect the data at a central location on the farm.  A production data analysis can help determine which flocks are meeting their genetic potential and which flocks are not, as well as which management practices are beneficial. As weights are collected, if the weights of the flock are not following the recommended breed guidelines, an investigation can begin to determine the cause, instead of waiting until the flock ships only to learn the flock has below average weight gain. Some of the problems that could be discovered to cause poor weight gain include disease challenges, temperature or air quality issues, inadequate feed space for all birds to eat (birds not evenly spaced throughout barn), slow feed delivery or distribution, and feed formulation or quality problems.  By catching a problem early, it is possible to get the birds back on track, maybe not completely recover but at least work to get the birds back on their growth curve and maximize remaining growth days. The success of any poultry program must be driven with data.  Good decision-making is dependent upon the quality of data and ensuring that the numbers are accurate and complete.  The level of uniformity largely contributes to the final result, and as with any business, increasing profits with positive final results is what one is after.  The broiler industry is no different. Invest in a tool to maximize performance and profits.',
        images: ''
    },
    {
        content_info_id: 159,
        lesson_content_id: 13,
        label: '1. Overall',
        description: 'In this case you need to weigh the Day Old Chick and record the feed eaten since day 1. Say you harvested at 50 days. Then the growth rate is the weight increase in the 50 days minus the weight of the day old chick. Then the growth rate is the increase in weight over the 50 days divided by 50 days.',
        images: ''
    },
    {
        content_info_id: 160,
        lesson_content_id: 13,
        label: '2. Specific',
        description: 'Say you want to know the data from 31 days to 50 days. Record the weight of your poultry at 31 days. Start recording the feed consumed from day 30 until day 50.Total feed consumed is the cumulative feed from day 31 to day 50, say this is X. The weight increase of the poultry is the weight at 50 days minus the weight at 31 day, say Y. FCR = X divided by Y. Growth rate from 31 days to 50 days is the weight increase divided by 20 days!',
        images: ''
    },
    {
        content_info_id: 161,
        lesson_content_id: 13,
        label: '',
        description: 'Growth rate means  average gain in body weight  for prescribed period. Feed conversion efficiency or  Feed conversion  ratio means total feed consumed divided by total gain in weight for a particular periods. It is very easy Growth can be taken in growing birds only. It can be calculated that total weight of eggs production per kg of feed during particular period of time. This is the feed conversion efficiency. do all calculation on daily bases. so you have a history of the flock (Broilers) then calculate FCR, and the Gain also on Daily bases then fit an equation to the data you have for the whole period. this will help you estimate what you need if you are using a simulation model, or comparing data between to flocks. the important thing is you need also to record the Temperature inside the shed and relative humidity as well. because this may effect data form season to season. also Note that CO2 will be higher at the beginning of the run comparing to at the end of the run NH3 on the other hand will act oppositely, because of accumulated manure on the litter. you need to have all these parameters in the acceptable range or level to be sure your data representing the flock. and to do that you need to measure the ventilation rate to control CO2 and NH3 as well as Temperature.',
        images: ''
    },
    // M1; L4; C2 info
    {
        content_info_id: 162,
        lesson_content_id: 14,
        label: 'Health Management',
        description: 'The best fed and housed stock with the best genetic potential will not grow and produce efficiently if they become diseased or infested with parasites. Therefore good poultry health management is an important component of poultry production. Infectious disease causing agents will spread through a flock very quickly because of the high stocking densities of commercially housed poultry. For poultry health management to be effective a primary aim must be to prevent the onset of disease or parasites, to recognise at an early stage the presence of disease or parasites, and to treat all flocks that are diseased or infested with parasites as soon as possible and before they develop into a serious condition or spread to other flocks. To be able to do this it is necessary to know how to recognise that the birds are diseased, the action required for preventing or minimising disease and how to monitor for signs that the prevention program is working.',
        images: ''
    },
    {
        content_info_id: 163,
        lesson_content_id: 14,
        label: 'Principles Of Health Management',
        description: 'The key principles of poultry health management are: 1.Prevention of disease, 2.Early recognition of disease, 3.Early treatment of disease. As much as is possible disease should be prevented. It is easier and less damaging to prevent disease than it is to treat it. However, it must not be assumed that all disease can be prevented. Inevitably, some will get past the defences, in which case it becomes imperative that the condition is recognised as early as possible to allow treatment or other appropriate action to be implemented as soon as possible to bring the situation under control to limit damage to the flock.',
        images: ''
    },
    {
        content_info_id: 164,
        lesson_content_id: 14,
        label: 'Disease',
        description: 'A disease is any condition that interferes with the normal functioning of the cells, tissues, organs and the whole body systems. Diseases of poultry have many causes and include: 1.Deficiencies of essential nutrients such as vitamins, minerals or other nutrients. 2.The consumption of toxic substances such as poisons. 3.Physical damage e.g. environmental extremes and injury. 4.Internal and external parasite infestations such as lice and worms. 5.Infectious disease caused by micro-organisms such as bacteria and viruses. Diseases that result from nutrient deficiencies, consumption of toxic substances and physical damage are referred to as non-infectious diseases. These diseases cannot be passed from bird to bird and members of the flock must share a common experience for individuals to contract these non-infectious diseases. In the widest sense, infectious diseases are caused by microorganisms that include parasites, fungi, protozoa, bacteria, mycoplasmas, chlamydia and viruses. These diseases are often also called contagious diseases meaning that they can be passed from one bird to another either directly or indirectly.',
        images: 'assets/module_images/M1/L4/chicken_disease.jpg'
    },
    {
        content_info_id: 165,
        lesson_content_id: 14,
        label: 'Direct transmission:',
        description: 'occurs when one diseased bird passes the cause of the disease via direct contact to a susceptible healthy bird. Such passage may be horizontal transmission (from one bird to another) or vertical transmission (from parent to offspring) via the egg or sperm either inside the egg or on the shell.',
        images: ''
    },
    {
        content_info_id: 166,
        lesson_content_id: 14,
        label: 'Indirect transmission:',
        description: 'occurs when the causal organism is passed from one bird to another via an intermediate host such as insects, earthworms, snails or slugs, wild birds or animals or some other object such as equipment, food or water, vehicles, people, respiratory droplets, litter or faeces.',
        images: ''
    },
    {
        content_info_id: 167,
        lesson_content_id: 14,
        label: 'Causes Of Infectious Disease',
        description: 'Organisms and microorganisms that have the potential to cause harm, such as disease in animals, are called pathogens or disease vectors. There are many different types of pathogens that may be transferred from one bird to another or from one flock to another by many different means. These pathogen types include: Viruses, Bacteria, Fungi, Protozoa, Internal parasites, and External parasites',
        images: ''
    },
    // M1; L4; C3 info
    {
        content_info_id: 168,
        lesson_content_id: 15,
        label: 'Sanitation, Cleaning, and Disinfecting Poultry Facilities',
        description: 'Diseases and infections have always been a major concern to the poultry industry. Fortunately, microbial contamination can be prevented and controlled using proper management practices and modern health products. Microorganisms are everywhere! Some are relatively harmless, while others can cause disease. Some pose a lethal threat to one species of animal while remaining harmless to another species. Some organisms are easily destroyed, while others are very difficult to eliminate. The moral is, “Treat all microorganisms as if they are a severe threat to the chick’s livelihood.” Three terms are commonly used to describe microbial control:',
        images: ''
    },
    {
        content_info_id: 169,
        lesson_content_id: 15,
        label: 'Sterilization',
        description: 'Destroying all infective and reproductive forms of all microorganisms (bacteria, fungi, virus, and the like)',
        images: ''
    },
    {
        content_info_id: 170,
        lesson_content_id: 15,
        label: 'Disinfection',
        description: 'Destroying all vegetative forms of microorganisms. Spores are not destroyed.',
        images: ''
    },
    {
        content_info_id: 171,
        lesson_content_id: 15,
        label: 'Sanitation',
        description: 'Pathogenic organisms are present but are not a threat to the birds’ health.',
        images: ''
    },
    {
        content_info_id: 172,
        lesson_content_id: 15,
        label: 'cleanliness is essential',
        description: 'Many producers have the impression that they create a “sterile” condition because they use disinfectants, when they may only achieve a sanitized condition at the very best. The most important thing to remember when striving for a sanitized environment is that cleanliness is essential. Proper cleaning removes most germs and is always done before using disinfectants. This applies to all areas, including floors, walls, equipment, and personnel. It is extremely important to remove as much organic matter as possible from surfaces being disinfected. After removing dust, chick down, droppings, tissue residues, and such, thoroughly clean surfaces, using warm water and appropriate cleaning aids. Focus on selecting the proper detergent to produce the cleanest environment possible with variations in water hardness, salinity, and pH. A thorough rinsing with enough clean, sanitized water completes the cleaning process and removes most lingering residues of detergents, organic matter, or microbial germs. Only after facilities are thoroughly clean do you treat surfaces with an appropriate disinfectant solution. Not all disinfectants are suited for every situation.',
        images: ''
    },
    {
        content_info_id: 173,
        lesson_content_id: 15,
        label: 'When selecting the disinfectant, carefully consider these:',
        description: 'The type of surface being treated; The cleanliness of the surface; The type of organisms being treated; The durability of the equipment/surface material; Time limitations on treatment duration; Residual activity requirements.',
        images: ''
    },
    {
        content_info_id: 174,
        lesson_content_id: 15,
        label: '',
        description: 'If the surface is free of organic matter and residual activity is not required, quaternary ammonium compounds or halogen compounds can be used effectively. However, if surfaces are difficult to clean, residual activity is required, or the contaminating organisms are difficult to destroy, then multiple phenols or coal tar distillates may be needed. Be careful that the disinfectant, when used as directed, meets your requirements. Be reasonable and don’t expect the product to produce impossible results.Otherwise, select a different product or change disease control practices. Although many disinfectants are available, the disinfectant you select must be effective for the conditions being used.',
        images: ''
    },
    {
        content_info_id: 175,
        lesson_content_id: 15,
        label: 'Here are several considerations for getting the best results from a disinfectant:',
        description: 'Consider the disinfectant’s effectiveness on organisms of greatest concern. Not all disinfectants are effective against all organisms. Clean and disinfect in separate operations. Disinfectant solutions are more effective when applied as warm solutions rather than cold solutions. Hot solutions can reduce disinfectant efficiency. Few disinfectants are effective instantaneously; allow enough contact time (usually 30 minutes is sufficient). Embryos are very sensitive and severely affected by chemical vapors. Use disinfectants having least effect on embryo development. Allow all surfaces to dry thoroughly before reuse. Dryness reduces reproduction and spread and transport of germs. Improper use of disinfectants can damage or hinder the function of equipment. Some disinfectants are corrosive or clog spray nozzles of water systems. Always follow label directions for their safe use. Never sacrifice personal safety for cost savings or productive efficiency.',
        images: ''
    },
    {
        content_info_id: 176,
        lesson_content_id: 15,
        label: '',
        description: 'Disease-free surfaces can be compromised if you do not properly maintain facilities. You can unknowingly act as a germ carrier and become a major source of infection. Provisions must be available for frequent washing of hands and footwear. Freshly laundered clothing and caps can significantly reduce the spread of germs. Restricted movement of personnel within specific areas also reduces the distribution of organisms. The risk posed by disease causing organisms is a constant challenge. Use effective control measures rather than trusting visual cleanliness as an indicator of sanitation. A surface that looks clean is not necessarily disease-free. Assuming so may be fatal to the birds and management program.',
        images: ''
    },
    {
        content_info_id: 177,
        lesson_content_id: 15,
        label: 'Disinfectant Classifications',
        description: '',
        images: 'assets/module_images/M1/L4/table_content.jpg'
    },
    // M1; L4; C4 info
    {
        content_info_id: 178,
        lesson_content_id: 16,
        label: 'Introduction',
        description: 'Organic waste, or biodegradable waste, is a natural refuse type that comes from plants or animals. It comes in manifold forms – biodegradable plastics, food waste, green waste, paper waste, manure.',
        images: ''
    },
    {
        content_info_id: 179,
        lesson_content_id: 16,
        label: 'Organic Waste Recycling',
        description: 'Thankfully, a landfill doesn’t have to be the end of the road for organic materials. For a disposal solution that is advantageous and eco-friendly (rather than wasteful and damaging), we can borrow one of nature’s simplest solutions: composting. With time, all organic refuse will decompose. Composting is the controlled, accelerated process of recycling those decomposed organic materials into a nutrient-rich soil. Small amounts of organic waste can be composted in your backward. It has been estimated that you could remove as much as 500 lbs of organic material from your home each year. On a larger scale, businesses also have the option of sending their organic waste to special facilities, where it will be recycled into usable resources. If your business generates this waste type and would benefit from a more efficient management program.',
        images: ''
    },
    {
        content_info_id: 180,
        lesson_content_id: 16,
        label: 'Types of poultry waste',
        description: '1.Poultry manure, 2.Hatchery waste, 3.Slaughter house and processing plant waste, 4.Dead bird',
        images: ''
    },
    {
        content_info_id: 181,
        lesson_content_id: 16,
        label: '1. POULTRY MANURE',
        description: 'Two main types of waste are produced by poultry enterprises depending on the rearing system adopted on the farm: Poultry litter – Waste from deep litter systems and Cage layer waste – Excreta collected under the cages, spilled feed and feathers.',
        images: ''
    },
    {
        content_info_id: 182,
        lesson_content_id: 16,
        label: 'a. Drying',
        description: 'Oldest, cheapest and feasible method. Dried under sunlight and depends on lengths of time, climate and humidity. Drying the manure with heat results in loss of energy and nitrogen. Thin bed drying prevents the breeding of flies, reduces obnoxious odours and maintains the nutrient value of the manure particles. The faster the manure is dried, the higher is the nitrogen value.',
        images: ''
    },
    {
        content_info_id: 183,
        lesson_content_id: 16,
        label: 'b. Heaping',
        description: 'Deep stacking of poultry waste produces considerable heat and had been shown to destroy coliforms. The maximum temperature was reportedly attained in 4-8 days.',
        images: ''
    },
    {
        content_info_id: 184,
        lesson_content_id: 16,
        label: 'c. Poultry manure as organic fertilizer',
        description: 'Poultry manure applications increase the moisture holding capacity of the soil. Improve lateral water movement, improves irrigation efficiency and decreases drought. Improve soil retention and uptake of plant nutrients. Increase the number and diversity of soil microorganisms.',
        images: ''
    },
    {
        content_info_id: 185,
        lesson_content_id: 16,
        label: 'd. Biogas / Electricity generation from poultry litter',
        description: 'Poultry litter has a good calorific value for power generation by combustion under controlled conditions. The technology for anaerobic conversion of poultry manure to biogas (methane) has been developed. Electricity production facilities estimated assuming poultry litter utilization rates of 1000 tons/year, 10,000 tons/year, and 50,000 tons/year for various technologies range from 34–70 kW, 340–700 kW, and 1.7–3.5 MW, respectively. Economic analysis accounting for capital expenditures, operation and maintenance costs, litter cleanout and transportation, and recoverable sludge/ash value reveal that gasification at a small scale (100 kW) and medium scale (1 MW) is potentially economically viable compared to anaerobic digestion and combustion.',
        images: ''
    },
    {
        content_info_id: 186,
        lesson_content_id: 16,
        label: 'e. Composting',
        description: 'Can be stored for long time. Aerobic bacterial action occurs The top foot is composed of fresh manure, the bottom foot is in an anaerobic condition and the central portion is undergoing composting. The essential requirement in managing the deep pit is that the fresh, wet material be adequately aerated to remove the moisture. To further the composting process and to prevent odours the pit must be watertight so that seepage water cannot enter. Little or no odour arising from the pits and manure removal may be delayed for years.',
        images: ''
    },
    {
        content_info_id: 187,
        lesson_content_id: 16,
        label: 'f. Pond disposal',
        description: 'Fresh poultry manure may be flushed into an open, shallow pond. Bacterial action reduces the waste material to a smaller volume. Bacterial growth occurs only during the warm months, the use of ponds is seasonal. The resulting solution may be spread in its liquid state on farmland. Aerobic action produces little odour as the sludge builds up, anaerobic activity takes place and odours may be pronounced.',
        images: ''
    },
    {
        content_info_id: 188,
        lesson_content_id: 16,
        label: 'g. Aeration',
        description: 'Water is poured into the trough to keep the manure fluid and pumps keep the sludge circulating. The effluent is aerated by paddles. The addition of oxygen by the paddles increases the activity of aerobic bacteria, greatly reducing the incidence of any odours. The material is removed in liquid form and usually spread on the land. The material is practically odourless.',
        images: ''
    },
    {
        content_info_id: 189,
        lesson_content_id: 16,
        label: '2. HATCHERY WASTE DISPOSAL',
        description: 'Solid hatchery waste comprises empty shells, infertile eggs, dead embryos, late hatchings and dead chickens and a viscous liquid from eggs and decaying tissue. Wastewater comes from water used to wash down incubators, hatchers and chick handling areas. Traditional disposal methods for solid hatchery waste include land fill, composting, rendering, and incineration.',
        images: ''
    },
    {
        content_info_id: 190,
        lesson_content_id: 16,
        label: 'a. Power generation',
        description: 'The hatchery waste can be automatically fed by conveyor belts into a furnace which is equipped with a rotating shredder unit for chopping and grinding solid waste. An incinerator system can be used as a furnace to heat the solid and liquid waste to produce steam. The steam can power a turbine generator to produce electricity.',
        images: ''
    },
    {
        content_info_id: 191,
        lesson_content_id: 16,
        label: 'b. Rendering',
        description: 'Simultaneously dries the material and separates the fat from the protein and yields fat and a protein meal should be pathogen free.',
        images: ''
    },
    {
        content_info_id: 192,
        lesson_content_id: 16,
        label: 'c. Autoclaved and extruded',
        description: 'Extruded or autoclaved hatchery waste could be used as livestock feed.',
        images: ''
    },
    {
        content_info_id: 193,
        lesson_content_id: 16,
        label: 'd. Boiling',
        description: 'Hatchery waste should be boiled at 100ºC with a pressure of 2.2 kg/cm2 for 15 min; then boiled again at 100ºC for 5 hours, followed by boiling at 130ºC for 1 h then cooled to ambient temperature. Dead embryos could be boiled for 100ºC for 30 min, soaked in cold water for 20 min to remove shells, sun dried for 4d and used in poultry feed.',
        images: ''
    },
    {
        content_info_id: 194,
        lesson_content_id: 16,
        label: 'e. Ensiling',
        description: 'The eggs were mixed in a 1:1 ratio with formic and propionic acids for 8 weeks at room temperature. The acids act by intervening specifically in the metabolism of the microorganisms involved in spoilage. The reduction in the pH creates an environment which is unfavourable for microorganisms. The rapid reduction in the pH diminishes the growth of bacteria which produce butyric acid and ammonia and promotes the growth of lactic acid-producing bacteria. The lactic acid is responsible for the low pH necessary for storage of the by-product before being used in animal feed.',
        images: ''
    },
    {
        content_info_id: 195,
        lesson_content_id: 16,
        label: 'f. Composting',
        description: 'Composting is a common method for solid organic waste disposal. The decomposition of organic waste is performed by aerobic bacteria, yeasts and fungi. The composting process kills pathogens, converts ammonia nitrogen to organic nitrogen. The product can be used as a fertilizer. Disadvantages of composting are loss of some nutrients including nitrogen. Composting with litter eliminates Salmonella. The hatchery waste can be mixed with wood shavings to reduce the moisture then composted. The composter turns manure, litter, sour feed stuffs and carcasses into compost in 4 days with minimal labour and mechanical devices.',
        images: ''
    },
    {
        content_info_id: 196,
        lesson_content_id: 16,
        label: 'g. Anaerobic digestion systems',
        description: 'High efficiency process. Produces biogas for power generation or heating. The bio-solids may be used as a high quality fertilizer and generation of electricity. Anaerobic digestion of organic waste by microbial organisms to produce methane and inorganic products.',
        images: ''
    },
    {
        content_info_id: 197,
        lesson_content_id: 16,
        label: '3. SLAUGHTER HOUSE WASTE DISPOSAL',
        description: 'Rendering is a process of cooking and sterilizing non-edible waste. Best options for treatment of non-edible wastes by converting waste into meat meal. Poultry bye-product hydrolyzed feather meal (or PBHFM) or simply Meat Meal.',
        images: ''
    },
    {
        content_info_id: 198,
        lesson_content_id: 16,
        label: 'Advantages of rendering:',
        description: 'Rendering is more effective and profitable. Converts entire poultry waste into high protein sterilized meat meal. Prevents environment pollution by disposing of all biological waste. Meat meal is used for making animal feed.',
        images: ''
    },
    {
        content_info_id: 199,
        lesson_content_id: 16,
        label: '4. DEAD BIRD DISPOSAL',
        description: '',
        images: ''
    },
    {
        content_info_id: 200,
        lesson_content_id: 16,
        label: 'a. Burying',
        description: 'Disposal of birds for small farms that cannot construct an incinerator. Deep hole may be dug and carcasses buried deeply to prevent worms from carrying infections from the carcass to the surface of the ground. Deep narrow trench can also be used.',
        images: ''
    },
    {
        content_info_id: 201,
        lesson_content_id: 16,
        label: 'b. Pit disposal',
        description: 'Effective and convenient method for disposal of dead birds. 150 feet from the poultry houses and water supply. Flies and insects should not enter the pit. The pit should be covered with tar paper or plastic. The pit should be near the post mortem room. Practical size for pit is about 1.8 m square by 2.4 m deep with drop tube. Tight fitting lid on the upper end of the tube to prevent the escape of foul odours and the entrance of flies.',
        images: ''
    },
    {
        content_info_id: 202,
        lesson_content_id: 16,
        label: 'c. Incineration',
        description: 'Burning of the carcass. An incinerator is a furnace used for burning. Incineration process uses electricity, firewood or oil. Electrical or oil-fired incineration is the best available technology. Rapid destruction of disease-producing organisms, leaving only a small amount of. Ash which can be distributed on the land. Smokeless and odourless burning with minimal air pollution.',
        images: ''
    },
    {
        content_info_id: 203,
        lesson_content_id: 16,
        label: 'd. Septic tank disposal',
        description: 'Breaking down the carcasses and waste products in an electrically heated septic tank by the action of mesophilic bacteria. Heat is applied at 37.8ºC and requires 2-3 kwh per day of electricity to maintain this temperature for the two weeks needed for destruction of all but the bones of the carcasses. The bacterial action and speed of decomposition can be accelerated by adding lime and hot water at intervals. Usually a tank of 2000 litre capacity is required for a flock of 10000 birds.',
        images: ''
    },
    {
        content_info_id: 204,
        lesson_content_id: 16,
        label: 'e. Composting',
        description: 'Composting reduce and transform organic waste into a useful end product called “compost”. Alternate layers of litter and paddy straw and dead birds and water. Finally, the carcasses are covered with a layer of manure. Once full, a final cover of litter is placed over the carcasses. The temperature of the compost increases rapidly to 60-70ºC within 10 days. Decomposition starts and kills micro-organisms. Temperature decreases after 14-21 days later. At this point, the material is moved to the secondary bins. Aerated and allowed for a second rise in temperature. The compost material can be safety stored. 10 m3 of bin space is required for every 1000 kg of carcass.',
        images: ''
    },
    {
        content_info_id: 205,
        lesson_content_id: 16,
        label: 'f. Rendering',
        description: 'Rendering is a heating process that extracts usable ingredients, such as protein meals and fats. Rendering converts the inedible results from the slaughtering process into meat meal, bone meal, and feather meal',
        images: ''
    },
    {
        content_info_id: 206,
        lesson_content_id: 16,
        label: 'The following methods may be followed as pre-treatment or method for rendering',
        description: '',
        images: ''
    },
    {
        content_info_id: 207,
        lesson_content_id: 16,
        label: '1. Daily pickup',
        description: 'Daily pickup of poultry carcasses leads to disease transmission. Biosecurity should be practiced. Central carcass disposal sites should be used for commercial conditions.',
        images: ''
    },
    {
        content_info_id: 208,
        lesson_content_id: 16,
        label: '2. Freezing',
        description: 'Dead birds can be stored on the farm in freezing condition until they can be rendered. Freezing reduces or eliminate pollution and improve conditions on the farm.',
        images: ''
    },
    {
        content_info_id: 209,
        lesson_content_id: 16,
        label: '3. Fermentation',
        description: 'Mixes dead birds (which have been ground into 1-inch particles) with a fermentable carbohydrate source, such as sugar, whey, ground corn, or molasses. Reduces the pH level so that pathogenic microorganisms are inactivated and the organic materials are preserved. Biologically safe, pathogen free safely transported to a rendering plant, recovery of nutrients and recycled into usable foodstuffs or animal feed.',
        images: ''
    },
    {
        content_info_id: 210,
        lesson_content_id: 16,
        label: '4. Acid Preservation',
        description: 'Propionic, phosphoric, or sulfuric acid is added to carcasses. Stored in airtight, plastic containers. Eliminate the potential for transmitting pathogenic microorganisms.',
        images: ''
    },
    {
        content_info_id: 211,
        lesson_content_id: 16,
        label: 'Advantages of rendering',
        description: 'Removal of all mortalities from the farm. Eliminates environmental pollution. Nutrient losses, water quality, and recycling for profit increase.',
        images: ''
    },
    // M1; L4; C5 Info
    {
        content_info_id: 212,
        lesson_content_id: 17,
        label: 'Introduction',
        description: 'The most commonly raised meat chicken is the Cornish cross.  These chickens reach harvest weight in as little as 6-8 weeks.  Other breeds, like the Rudd Ranger, are bred to be raised on forage and take a little bit longer.  Breeds like these may not reach harvest size until they are 12 weeks old.  When your chickens have reached harvest size, plan a day to harvest them.  It’s easier to plan ahead and make sure that you have help, even if you’re only harvesting a handful of chickens. Remove feed from the chicken’s coop the evening before you plan on harvesting them.  Chickens will consume feed and fill their crop up.  A full crop makes the cleaning portion of harvesting more difficult.  It’s much easier to clean up a chicken that had an empty crop than one with a full crop. You’ll need kill cones, a sharp boning knife, a pot of scalding water and shrink wrap bags made for chickens.  If you don’t have kill cones, you can clean up old milk jugs and cut the bottoms out of them.  Hang them upside down on a tree in place of a kill cone.',
        images: ''
    },
    {
        content_info_id: 213,
        lesson_content_id: 17,
        label: '',
        description: 'Put the chickens head first into the kill cone and pull the head gently through the end.  On the side of the chicken’s neck, locate the vein.  Use the sharp boning knife to sever the vein.  Be careful not to cut the windpipe.  The goal is to bleed the chicken out completely.  If you cut the windpipe, the chicken may die before all of the blood has left the chicken.  It will take a few minutes for the chicken to die.  Once the chicken has stopped bleeding and moving, it’s ready for the scalding water. Scalding water is used to loosen the feathers on the chicken so that plucking is easier.  We use a large crawfish pot or turkey cooker over a propane flame as a scalding pot.  Fill it with water before you start killing chickens and get it heating up.  The water should be steaming and just before boiling, around 190 degrees.  Grab the chicken by the feet and completely submerge it into the water for 3-5 seconds.  Pull it back out of the water and try to remove some of the feathers.  If they slip right out, start plucking it.  If the feathers still resist, then dip it back into the water again.',
        images: ''
    },
    {
        content_info_id: 214,
        lesson_content_id: 17,
        label: '',
        description: 'When all of the feathers are removed, you can cut off the head and feet.  If you want to save the feet, dip them into the scalding tank and rub off the yellow layer of skin.  Carefully cut around the cloaca, making a hole large enough to remove the innards.  Be careful not to cut any of the intestines in the process.  Take the boning knife and cut around the esophagus and trachea to loosen them.  When you pull the intestines and other innards out, they should come out with it. Clean up the carcass and place them into the shrink wrap bags.  You can seal the bags now or later.  Shrink wrap bags are dipped into hot water and shrink up around the chicken.  Put the chicken in the refrigerator for 24-48 hours.  This allows the chicken’s muscles to relax and helps it not be tough.  After time in the fridge, they can go into the freezer.',
        images: ''
    },
    {
        content_info_id: 215,
        lesson_content_id: 17,
        label: 'Meat bird types',
        description: 'Butchering an old laying hen will produce a stewing chicken that can be used for a tasty soup or casserole, as well as for making chicken stock for general use. Meat chicken breeds raised exclusively for butchering are best if you want to fry or roast the meat.',
        images: ''
    },
    // M1; L4; C6 Info
    {
        content_info_id: 216,
        lesson_content_id: 18,
        label: 'Introduction',
        description: 'Put in mind that for you to succeed, income and expenses have to be factored in so that you can know if your business venture is sustainable or not. Records usually show the weaknesses as well as strengths of your agribusiness. As a business owner, you will be able to tell where your business has been and the direction it is heading.',
        images: ''
    },
    {
        content_info_id: 217,
        lesson_content_id: 18,
        label: 'Why Record Keeping is Vital',
        description: 'For you to make critical financial decisions as well as create a budget, you will need to analyze your records. For you to make feeding decisions especially on the number of feed rations, types of feed rations and the effectiveness of the specific feed ration you will need to look at your records. A record will help you identify mistakes that can be avoided in the future. You should keep records on the productivity of your chicken such as kilos of meat, reproduction, eggs that will be used when culling your flock. When you need to breed your birds, you will need to analyze your records to be able to identify the most productive ones. Records will help you study the production performance and check whether it meets the prescribed standards. Most banks will look at your records before giving you any loan.',
        images: ''
    },
    {
        content_info_id: 218,
        lesson_content_id: 18,
        label: 'Methods of Record Keeping',
        description: 'Hand recording systems',
        images: ''
    },
    {
        content_info_id: 219,
        lesson_content_id: 18,
        label: 'Advantages of hand recording system',
        description: 'Easy to start. Low initial out of pocket expense. Only requires paper and pencil.',
        images: ''
    },
    {
        content_info_id: 220,
        lesson_content_id: 18,
        label: 'Computer recording system: Advantages of a computer recording system',
        description: 'Easier to create analysis. Accurate and faster. Tax deductible as an expense.',
        images: ''
    },
    {
        content_info_id: 221,
        lesson_content_id: 18,
        label: 'Chicken farming records classification',
        description: 'Records should be simple, easy to understand, with no repetition and have all the necessary information. Chicken records can be divided into three categories. They include;',
        images: ''
    },
    {
        content_info_id: 222,
        lesson_content_id: 18,
        label: 'Management records',
        description: 'Management records usually include data that is related to management issues. They include number, date, and type of vaccination or medication administered, type and amount of feed given, death or loss of chicken, date of chick placement as well as workers shift. In layers, it should include management practices such as beak trimming, de-worming dates, culled birds, disease incidence and the steps taken. Management records will help you when assessing the levels of production of your chicken. You can promptly go back in time and know where things started going wrong. You will also be able to know if you are on the right track.',
        images: ''
    },
    {
        content_info_id: 223,
        lesson_content_id: 18,
        label: 'Financial records',
        description: 'Financial records are supposed to contain all the financial transactions in your chicken farming ventures. You, therefore, should be very keen when entering records of huge expenditures such as those of feeds and purchase of day-old chicks. Ensure that you also keep any financial records of any items sold or bought including supplies, veterinary costs, and equipment. Remember not to overlook any production cost. It usually adds up to a lot of money in the end. For example, in broiler production, you can easily ignore the cost of slaughtering and transporting the meat to the market. In the end, your financial records will not give you an accurate production cost.',
        images: ''
    },
    {
        content_info_id: 224,
        lesson_content_id: 18,
        label: 'Production records',
        description: 'Production records are vital in assessing productivity. For example, in broilers, the daily or weekly weight gain indicates productivity. You can use that to compare the records to the standard chart. You can then make changes in the feeding program if you see the need to. Many farmers usually weigh their chicken right before slaughter. However, the best way is to weigh weekly to identify any negative deviations. You will be in a position to minimize losses because you can make changes as soon as you notice a deficiency. In layers, your record should include dates, eggs produced, opening balance, and eggs sold as well as the closing balance of the eggs. Ensure to include daily day to day sales of your eggs. Never forget to maintain a record of the number and sale price of breakable saleable eggs as well as those of the pullet eggs.',
        images: ''
    },
    // M2; L1; C1 info
    {
        content_info_id: 225,
        lesson_content_id: 19,
        label: 'Introduction',
        description: 'Seed is a basic input in agriculture. Strictly speaking seed is an embryo, a living organism embedded in the supporting or the food storage tissue. In seed, the importance is given to the biological existence whereas; in grain the importance is given to the supporting tissue the economic produce. As per Seed Act (1966) seed includes: Seed of food crops including edible oil seeds and seeds of fruits & vegetables. Cotton seeds. Seeds of cattle fodder. Jute seeds. Seedlings, tubers, bulbs, rhizomes, roots, cuttings, all types of grafts and other vegetative propagated material for food crops (or) cattle fodder.',
        images: ''
    },
    {
        content_info_id: 226,
        lesson_content_id: 19,
        label: 'Physical Characteristics of a Good Seeds',
        description: '1. No insect damage, 2. No physical damage (cracks, bruises, etc.), 3. No deformities, and 4. No disease damage',
        images: ''
    },
    {
        content_info_id: 227,
        lesson_content_id: 19,
        label: 'Importance of quality seed',
        description: 'Ensures genetic and physical purity of the crops. Gives desired plant population. Capacity to withstand the adverse conditions. Seedlings produced will be more vigorous, fast growing and can resist pest and disease incidence to certain extent. Ensures uniform growth and maturity. Development of root system will be more efficient that aids absorption of nutrients efficiently and result in higher yield. It will respond well to added fertilizer and other inputs. Good quality seeds of improved varieties ensure higher yield at least 10 – 12 %.',
        images: ''
    },
    {
        content_info_id: 228,
        lesson_content_id: 19,
        label: 'Major seed quality characters',
        description: 'Seed quality is the possession of seed with required genetic and physical purity that is accompanied with physiological soundness and health status. The major seed quality characters are summarized as below.',
        images: ''
    },
    {
        content_info_id: 229,
        lesson_content_id: 19,
        label: '1.Physical Quality',
        description: 'It is the cleanliness of seed from other seeds, debris, inert matter, diseased seed and insect damaged seed. The seed with physical quality should have uniform size, weight, and color and should be free from stones, debris, and dust, leafs, twigs, stems, flowers, fruit well without other crop seeds and inert material. It also should be devoid of shriveled, diseased mottled, molded, discolored, damaged and empty seeds. The seed should be easily identifiable as a species of specific category of specific species. Lack of this quality character will indirectly influence the field establishment and planting value of seed. This quality character could be obtained with seed lots by proper cleaning and grading of seed (processing) after collection and before sowing / storage.',
        images: ''
    },
    {
        content_info_id: 230,
        lesson_content_id: 19,
        label: '2.Genetic purity',
        description: 'It is the true to type nature of the seed. i.e., the seedling / plant / tree from the seed should resemble its mother in all aspects. This quality character is important for achieving the desired goal of raising the crop either yield or for resistance or for desired quality factors.',
        images: ''
    },
    {
        content_info_id: 231,
        lesson_content_id: 19,
        label: '3.Physiological Quality',
        description: 'It is the actual expression of seed in further generation / multiplication. Physiological quality characters of seed comprises of seed germination and seed vigor. The liveliness of a seed is known as viability. The extent of liveliness for production of good seedling or the ability of seed for production of seedling with normal root and shoot under favorable condition is known as germinability. Seed vigor is the energy or stamina of the seed in producing elite seedling. It is the sum total of all seed attributes that enables its regeneration of under any given conditions. Seed vigor determines the level of performance of seed or seed lot during germination and seedling emergence. Seed which perform well at sowing are termed as quality seed and based on the degree of performance in production of elite seedling it is classified as high, medium and low vigor seed. The difference in seed vigor is the differential manifestation of the deteriorative process occurring in the seed before the ultimate loss of ability to germinate. Difference in seed vigor will be expressed in rate of emergence, uniformity of emergence and loss of seed germination. Hence it is understood that all viable seeds need not be germinable but all germinable seed will be viable. Similarly, all vigorous seeds will be germinable but all germinable seed need not be vigorous. Physiological quality of seed could be achieved through proper selection of seed (matured seed) used for sowing and by caring for quality characters during extraction, drying and storage. Seed with good vigor is preferable for raising a good plantation as the fruits, the economic come out are to be realized after several years. Hence selection of seed based on seed vigor is important for raising perfect finalize plantation.',
        images: ''
    },
    {
        content_info_id: 232,
        lesson_content_id: 19,
        label: '4.Seed Health ',
        description: 'Health status of seed is nothing but the absence of insect infestation and fungal infection, in or on the seed. Seed should not be infected with fungi or infested with insect pests as these will reduce the physiological quality of the seed and also the physical quality of the seed in long term storage. The health status of seed also includes the deterioration status of seed which also expressed through low vigor status of seed. The health status of seed influences the seed quality characters directly and warrants their soundness in seed for the production of elite seedlings at nursery / field.',
        images: ''
    },
    {
        content_info_id: 233,
        lesson_content_id: 19,
        label: 'Hence the quality seed should have',
        description: 'High genetic purity. High pure seed percentage (physical purity). High germinability. High vigor. Higher field establishment. Free from pest and disease. Good shape, size, color etc., according to the specification of variety. High longevity / shelf life. Optimum moisture content for storage. High market value',
        images: ''
    },
    {
        content_info_id: 234,
        lesson_content_id: 19,
        label: 'Characteristics of good quality seed',
        description: '',
        images: ''
    },
    {
        content_info_id: 235,
        lesson_content_id: 19,
        label: 'Higher genetically purity:',
        description: 'Breeder /Nucleus - 100%, Foundation seed - 99.5% and Certified seed - 99.0%',
        images: ''
    },
    {
        content_info_id: 236,
        lesson_content_id: 19,
        label: 'Higher physical purity for certification:',
        description: 'Breeder /Nucleus - 100%, Foundation seed - 99.5% and Certified seed - 99.0%',
        images: ''
    },
    {
        content_info_id: 237,
        lesson_content_id: 19,
        label: '',
        description: 'Possession of good shape, size, color, etc., according to specifications of variety. Higher physical soundness and weight. Higher germination ( 90 to 35 % depending on the crop). Higher physiological vigor and stamina. Higher storage capacity. Free from other crop seeds (Expressed in number /kg) - Other crop seeds are the plants of cultivated crops found in the seed field and whose seed are so similar to crop seed that is difficult to separate them economically by mechanical means. Eg. Mixtures of Wheat, oats seeds in barley.',
        images: ''
    },
    {
        content_info_id: 238,
        lesson_content_id: 19,
        label: 'It should be free from objectionable weed seeds -These are plants of weed species which are harmful in one or more of the following ways.',
        description: 'The size and shape of their seeds are so similar to that of the crop seed that is difficult to remove their seed economically by mechanical means. Their growth habit is detrimental to the growing seed crop due to competing effect. Their plant parts are poisonous or injurious to human and animal beings. They serve as alternate hosts for crop pests and diseases.',
        images: ''
    },
    {
        content_info_id: 239,
        lesson_content_id: 19,
        label: '',
        description: 'It should be free from designated diseases - It refers to the diseases specified for the certification of seeds and for which certification standards are to be met with. These diseases would cause contamination, when they are present in the seed field or with in the specified isolation distance ( eg. loose smut of wheat). For this the certification distance has been prescribed as 180 meters.',
        images: 'assets/module_images/M2/L1/table_crops.png'
    },
    // M2; L1; C2 info
    {
        content_info_id: 240,
        lesson_content_id: 20,
        label: 'Seedbed Preparation',
        description: 'Seedbed – or seedling bed is the local soil environment in which seeds are planted. ',
        images: ''
    },
    {
        content_info_id: 241,
        lesson_content_id: 20,
        label: 'Seedbed preparation',
        description: 'is an important step that can optimize seed germination and survival rate. Final seedbeds can be prepared by disk, harrow, or chisel plowing. The means of preparation will vary with the species selected and the availability of equipment. Unlike standard agricultural settings, reconstructed soils produce greater yields when disked or chisel plowed (Powell, 1988). These treatments are presumed to improve water infiltration rates and reduce the bulk density of the rooting media following soil reconstruction. Similarly, single disking was demonstrated to produce greater yields than multiple diskings (Powell, 1988).',
        images: ''
    },
    {
        content_info_id: 242,
        lesson_content_id: 20,
        label: 'Proper seedbed preparation',
        description: 'Is vital to successful forage stand establishment. The soil and the planting technique must assure that good soil-seed contact is achieved. If plowed, then the soil should be disked and compacted with a corregated roller before seeding occurs. If no-till planting is practiced, the tilling operation and compaction are applied in a limited area during the planting operation. Precipitation or irrigation of plowed, disked, and harrowed soils may negate the need for compaction prior to planting. In either case, the seedbed must be firm and compact to assure optimum seed-soil contact. A rule-of-thumb for soil surface firmness is to have the soil sufficiently firm that when a person stands on it, the indentation caused by the weight is about 1 cm (approximately 3/8 in.) deep.',
        images: ''
    },
    {
        content_info_id: 243,
        lesson_content_id: 20,
        label: 'Land/seedbed preparation',
        description: 'The method of seedbed preparation differs for conservation (reduced or zero-till) and conventional-till systems. But, for both, the seedbed should be free of weeds and precisely leveled at the time of sowing. For conventional-till dry drill seeding (CT-dry-DSR), the soil should be well pulverized to maintain good soil moisture for drilling and good soil-to-seed contact. In sandy or silt loam, an excellent seedbed can be prepared with reduced or minimum tillage, thereby conserving soil, and reducing cost. In zero-till dry drill seeding (ZT-dry-DSR), it is important to first knock down the existing vegetation (annual and perennial weeds) with a burn down herbicide such as paraquat (0.5 kg ai ha− 1) or glyphosate (1.0 kg ai ha− 1).',
        images: ''
    },
    {
        content_info_id: 244,
        lesson_content_id: 20,
        label: 'Tillage and Cultivation',
        description: 'Tillage, for seedbed preparation, and cultivation, for weed control, can affect established plants and reproductive structures. Tillage practices can range from nearly complete soil inversion, with mold-board plowing, to minimal soil disruption, with the use of zero-tillage (direct drilling) techniques. In addition to determining characteristics of soil disturbance and residue incorporation, tillage practices can have important effects on weed density and species composition (Buhler, 1995; Froud-Williams, 1988). Factors determining tillage effects on weeds include (i) depth of seed burial, (ii) seed survival at different soil depths, (iii) seed dormancy responses to burial, (iv) seedling ability to emerge from different burial depths, and (v) the quantity of new seeds added to the soil seedbank (Mohler, 1993). Because weed species may differ in these factors, responses to tillage are often species specific. For example, in a study comparing moldboard plow, chisel plow, and no-tillage systems for soybean production, Buhler and Oplinger (1990) observed that lambsquarters densities were not greatly influenced by tillage systems, whereas redroot pigweed densities were generally highest in the chisel plow system.',
        images: ''
    },
    {
        content_info_id: 245,
        lesson_content_id: 20,
        label: '',
        description: 'Giant foxtail (Setaria faberi Herrm.), an annual grass species, was most abundant in the no-tillage system and least abundant in the moldboard plow system. In contrast, velvetleaf, an annual broadleaf species, was most abundant in the moldboard plow system and least abundant in the no-tillage system. Similarly, in corn production systems, Buhler (1992) observed that density responses to tillage differed among weed species. Derksen et al. (1993) have suggested that changes in weed communities are influenced more by location and year than by tillage systems, but it appears that tillage is potentially useful for reducing weed density if choice among tillage practices is based on knowledge of the full spectrum of ecological sensitivities of different weed species. Because seeds of many weed species require exposure to light to germinate, attention has been directed recently toward the possibility of preparing crop seedbeds at night or during the day using tillage equipment covered with light-excluding hoods. In field trials Ascard (1994) observed that, compared to daylight tillage, both of the aforementioned dark-tillage techniques reduced weed density.',
        images: ''
    },
    {
        content_info_id: 246,
        lesson_content_id: 20,
        label: '',
        description: 'In some farming areas, germination of common weed species may occur in predictable flushes that are driven by accumulated heat units and rainfall (e.g., Harvey and Forcella, 1993). Because weed seedlings are extremely vulnerable to tillage operations, Forcella et al. (1993) conducted experiments in the north central United States to determine whether synchronic-ity in weed emergence could be exploited for management purposes. Delaying final tillage operations—the so-called stale seedbed strategy—allowed the investigators to kill a very high percentage of weed seedlings before planting corn and soybean and, consequently, to reduce weed competition against the crops. Following planting, cultivation can be used before and after crop emergence to reduce weed densities between and within crop rows (Terpstra and Kouwenhoven, 1981; Buhler et al, 1992; Rasmussen, 1992; Rydberg, 1993; Mulder and Doll, 1994; Rasmussen and Svenningsen, 1995; Vangessel et al, 1995). Increased interest in alternatives to herbicides has resulted in a number of new cultivation implements, some of which are capable of working under high residue conditions and therefore are compatible with soil conservation objectives (Eadie et al, 1992). Interest has also increased in machinery for flame weeding, which kills weed seedlings through cell rupture rather than incineration (Daar, 1987). Flame weeding can be used to destroy weeds emerging before crop emergence (Ascard, 1995a,b); post-emergence flaming, long practiced in cotton (Gossypium hirsutum L.), is also possible in certain other crops such as onion (Allium cepa L.) and corn (Daar, 1987).',
        images: ''
    },
    {
        content_info_id: 247,
        lesson_content_id: 20,
        label: '',
        description: 'Ploughing is the first operation in seedbed preparation on most farms and is likely to remain so for some time yet. However, many farmers are now using rotary cultivators, heavy cultivators with fixed or spring tines, and mechanically-driven digging or pulverizing machines, as alternatives to the plough. Good ploughing is still the best method of burying weeds and the remains of previous crops. It can also set up the soil so that good frost penetration is possible. Fast ploughing produces a more broken furrow slice than slow steady work. The mounted or semi-mounted plough has replaced the trailed type on most farms because of ease of handling. General-purpose moldboards are commonly used. The shorter digger types (concave moldboards) break the furrow slices better and are often used on the lighter soils. Deep digger ploughs are used where deep ploughing is required, e.g. for roots or potatoes. The one way (reversible) type of plough has become popular for crops such as roots and peas. It has right-hand and left-hand moldboards and so no openings or finishes have to be made when ploughing; the seedbed should therefore be at least slightly more level. Round-and-round ploughing with the ordinary plough has almost the same effect, although this is not a suitable method on all fields.',
        images: ''
    },
    {
        content_info_id: 248,
        lesson_content_id: 20,
        label: '',
        description: 'The proper use of skim and disc coulters and careful setting of the plough for depth, width and pitch can greatly improve the quality of the ploughing. The furrow slice can only be turned over satisfactorily if the depth is less than about two-thirds the width. The usual widths of ordinary plough bodies vary from 20 to 35 cm. If possible, it is desirable to vary the depth of ploughing from year to year to avoid the formation of a plough pan. Very deep ploughing, which brings up several centimetres of poorly weathered subsoil, should only be undertaken with care: the long-term effects will probably be worthwhile but, for a few years afterwards, the soil may be rather sticky and difficult to work. Buried weed seeds, such as wild oats which have fallen down cracks, may be brought to the surface and may spoil the following crops. ‘Chisel ploughing’ is a term used to describe the work done by a heavy duty cultivator with special spring or fixed tines; unlike the ordinary plough, it does not move or invert all the soil. Disc ploughs have large saucer-shaped discs instead of shares and moldboards. Compared with the ordinary moldboard plough, they do not cut all the ground or invert the soil so well, but they can work in harder and stickier soil conditions. They are more popular in dry countries. Double moldboard ridging ploughs are sometimes used for potatoes and some root crops in the wetter areas.',
        images: ''
    },
    // M2; L2; C3 info
    {
        content_info_id: 249,
        lesson_content_id: 21,
        label: 'Maintaining your seedling',
        description: 'As your seedling emerges from the soil, most grower breath a big sigh of relief. Close your eyes and you can almost see the plant grow and flourish into its full beauty, producing an enviable profusion of flowers or vegetables. As you open your eyes, you will immediately begin a new set of worries, over-nurturing the newborn indoors for a short time while the outdoor weather catches up with your dreams.',
        images: ''
    },
    {
        content_info_id: 250,
        lesson_content_id: 21,
        label: 'Thin Seedlings as needed',
        description: 'Plants in your garden do not like to be crowded. Ditto with your seedlings, who need all the sun and nutrients that they can get you may want to leave a few extras for a while as mortality rate of seedlings can be high.',
        images: ''
    },
    {
        content_info_id: 251,
        lesson_content_id: 21,
        label: 'Give them plenty of light',
        description: 'As soon as the new born seedling begins to emerge, it seeks light. Your new born needs as much and as direct a light source as possible. Placing it by a window with a southern exposure is the first step. But this alone may not prove to be enough for the seedling to grow healthy and strong. First, the sun is not up as long in the spring as it is in the summer. Second, there are many rainy spring days with little or no direct sun. You should also acquire an artificial Grow Light and place the seedlings under it on cloudy days and at night.',
        images: ''
    },
    {
        content_info_id: 252,
        lesson_content_id: 21,
        label: 'Keep the seedlings moist',
        description: 'Provide water to your seedling every couple of days. Do not soak the soil each night. Overly wet soil encourages the development of damping off disease. Let the soil dry out a little on the top, then water thoroughly. Watering from the bottom is preferred. If you have a seed tray, add water to the bottom of the tray . The soil will absorb it through the bottom holes in your container...your container does have holes in the bottom, does not it?',
        images: ''
    },
    {
        content_info_id: 253,
        lesson_content_id: 21,
        label: 'Feed the seedlings',
        description: 'The seedling does not need a lot of extra nutrients in its first few days of life. Your soil starting mix usually comes with a balanced formula of nutrients that the seedlings need. After several days, adding a little liquid fertilizer to the water is helpful, but you do not need to give it full strength. If the roots begin to come out the bottom of the pot, it is time to plant your seedling outdoors, weather permitting. If it is still too cool, keep the bottom of the tray moist, or put some extra soil in the bottom of the tray. Or, transplant seedlings to a larger pot. Most plants do not like to be root bound.',
        images: ''
    },
    {
        content_info_id: 254,
        lesson_content_id: 21,
        label: 'Guard against Leggy Plants',
        description: 'Seedlings are leggy when their main stem or stalk grows tall and thin and can hardly support the leaf structure. It is caused by insufficient sunlight and a sheltered environment. Indoors, they do not experience the effect of wind, and do not need to develop structure to defend against it. Most seedlings do not even experience a slight breeze. When transplanted outdoors, "leggy" plants can be damaged or broken by the wind. TIP: Take your hand,or a couple sheets of newspaper and fan the plants a few times a day. You can even lightly brush the tops of the plants, brushing back and forth in varying directions. You may notice the plants seem to slow down for a period. What they are really doing is building a stronger stem or stalk.',
        images: ''
    },
    {
        content_info_id: 255,
        lesson_content_id: 21,
        label: 'Protect Against Damping Off Disease',
        description: 'Those of us who have grown seedling indoors for any number of years know what "Damping Off" disease. This is a white mold that forms in the top of the soil. Damping Off disease flourishes in cold, wet damp weather along with little sunshine. It quickly spreads across the soil and wilts the seedling. Take its habitat away, and the disease cannot survive. Plants on the other hand, love just the opposite conditions. The more you make conditions ideal for your plants, the more likely you will avoid Damping Off Disease and other fungal problems.',
        images: ''
    },
    {
        content_info_id: 256,
        lesson_content_id: 21,
        label: 'If you do experience problems, do not give up hope. Here are some things you can do to minimize or eliminate disease problems:',
        description: 'First, get the plant in direct sunlight if at all possible. Stop watering until the surface is very dry. Water only from the bottom. Scrape as much of the mold off the soil as possible. Stir the top of the soil without disturbing the roots. It will also speed drying. Add some soil, although this may or may not produce results. Increase room air circulation. You can gently blow air on your plant trays with a small fan.',
        images: ''
    },
    {
        content_info_id: 257,
        lesson_content_id: 21,
        label: '',
        description: 'Avoid sowing your seeds in the basement and leaving them there for a couple of days. While the trays are conveniently out of the way, this is a perfect breeding ground for Damping Off Disease.',
        images: ''
    },
    {
        content_info_id: 258,
        lesson_content_id: 21,
        label: 'What exactly is Damping Off Disease?',
        description: 'Somewhere lurking in the air in your house is the fungus spores of the most dreaded of plant disease for those of us who start plants indoors for transplanting outdoors later in the season. Damping off Disease is very common plant disease problem. We fear it, because it is fatal to our young seedlings, and is quite harmful to our soaring spring spirits. To lose seedlings so early in the new gardening year is just heart breaking, especially if it is a special seed. It leads to replanting, and gets our young gardening season off to a late start. If you grow indoor transplants early in the spring, you likely have experienced it at some point. We usually think of Damping Off Disease as an indoor plant problem. But, it also occurs outdoors, too. We are less likely to recognize it outdoors, as the loss of plants in the spring can be attributed to a number of things. Now for the good news.... Damping Off Disease as a threat to your seedlings can be minimized. We have lots of tips and ideas to help fight off this enemy of the state.',
        images: ''
    },
    {
        content_info_id: 259,
        lesson_content_id: 21,
        label: 'Causes of Disease',
        description: 'Damping Off disease thrives in cool or cold, dark or cloudy, wet or damp conditions. The disease is airborne, and can spread very quickly from one seed tray to another. The fungal spores take root in your soil and quickly spreads across the seed tray, jumping to other trays with ease. It is fatal to young seedlings, nipping them off at the soil level.',
        images: ''
    },
    {
        content_info_id: 260,
        lesson_content_id: 21,
        label: 'Treatmentet',
        description: 'As with other plants diseases, prevention is the best means of treatment. Follow the dos and donts listed below. If Damping Off disease does take hold in your seed trays, act immediately. Remove diseased sections to minimize the spread. If it has affected a significant number of plants, replant in new soil and clean containers. Do not reuse the soil. Either use new containers, or sterilize the ones you were using. We recommend new containers.',
        images: ''
    },
    {
        content_info_id: 261,
        lesson_content_id: 21,
        label: 'Controlling the Disease',
        description: 'Controlling the disease is a matter of removing the environment that Damping Off disease thrives in. Here are the basic dos and donts:',
        images: 'assets/module_images/M2/L1/do_and_dont.png'
    },
    {
        content_info_id: 262,
        lesson_content_id: 21,
        label: 'Other Tips and Suggestions',
        description: 'It is believed that soaking seeds in a small amount of water and a clove of crushed garlic will prevent the disease. Some people suggest misting the plant with Chamomile tea as a preventative. Some people suggest fireplace ash on the top of the soil. Cinnamon also acts as a fungicide. Sphagnum moss spread thinly on the surface of the soil.',
        images: ''
    },
    // M2; L1; C4 info
    {
        content_info_id: 263,
        lesson_content_id: 22,
        label: 'Prepare Growing Media',
        description: 'The production of greenhouse crops involves a number of cultural inputs. Among these, perhaps the most important is the type of growing medium used. Due to the relatively shallow depth and limited volume of a container, growing media must be amended to provide the appropriate physical and chemical properties necessary for plant growth. Field soils are generally unsatisfactory for the production of plants in containers. This is primarily because soils do not provide the aeration, drainage and water holding capacity required. To improve this situation several “soilless” growing media have been developed. The following is a description of some of the most commonly used amendments for the production of greenhouse crops.',
        images: ''
    },
    {
        content_info_id: 264,
        lesson_content_id: 22,
        label: 'Peat and Peat-Like Materials',
        description: 'Peat moss is formed by the accumulation of plant materials in poorly drained areas. The type of plant material and degree of decomposition largely determine its value for use in a growing medium. Although the composition of different peat deposits vary widely, four distinct categories may be identified:',
        images: ''
    },
    {
        content_info_id: 265,
        lesson_content_id: 22,
        label: 'Hypnaceous moss',
        description: 'This type of peat consists of the partially decomposed remains of hyprum, polytrichum and other mosses of the Hypanaceae family. Although it decomposes more rapidly than some other peat types, it is suitable for media use. Many of the peat deposits in the Northern United States are Hypnaceous.',
        images: ''
    },
    {
        content_info_id: 266,
        lesson_content_id: 22,
        label: 'Reed and Sedge',
        description: 'Are peats derived from the moderately decomposed remains of rushes, coarse grasses, sedges, reeds and similar plants. These fine textured materials are generally less acid and contain relatively few fibrous particles. The rapid rate of decomposition, fine particle size and insufficient fiber content make reed and sedge peats unsatisfactory for media use.',
        images: ''
    },
    {
        content_info_id: 267,
        lesson_content_id: 22,
        label: 'Humus or Muck',
        description: 'Consists of the decomposed debris of finely divided plant materials of unknown origin. Humus often contains large quantities of silt and clay particles, and when mixed with soil does not improve drainage or aeration. Due to its rapid rate of decomposition and particle size, humus is considered to be undesirable for growing media use.',
        images: ''
    },
    {
        content_info_id: 268,
        lesson_content_id: 22,
        label: 'Sphagnum moss',
        description: 'Is the dehydrated remains of acid-bog plants from the genus Sphagnum (i.e. Spapillosum). It is light in weight and has the ability to absorb 10 to 20 times its weight in water. This is attributed to the large groups of water holding cells, characteristic of the genus. Sphagnum moss contains specific fungistatic substances which accounts for its ability to inhibit damping-off of seedlings. Sphagnum moss is perhaps the most desirable form of organic matter for the preparation of growing media. Drainage and aeration are improved in heavier soils while moisture and nutrient retention are increased in lighter soils. Germany, Canada and Ireland are the principle regions of Sphagnum moss production.',
        images: ''
    },
    {
        content_info_id: 269,
        lesson_content_id: 22,
        label: 'Wood Residues',
        description: 'Wood residues constitute a significant source of soilless growing media. These materials are generally bi-products of the lumber industry and are readily available in large quantities. Nitrogen depletion by soil microorganisms, during the decomposition process, is one of the primary problems associated with these materials. However, supplemental applications of N to the growing media can make most wood residues valuable amendments.',
        images: ''
    },
    {
        content_info_id: 270,
        lesson_content_id: 22,
        label: 'Leaf Mold',
        description: 'maple, oak, and sycamore are among the principle leaf types suitable for the preparation of leaf mold. Layers of leaves and soil are composted together with small amounts of nitrogenous compounds for approximately 12 to 18 months. The use of leaf mold can effectively improve the aeration, drainage and water holding properties of a growing media. Although these materials are readily available at low cost, leaf mold is not extensively used in container production.',
        images: ''
    },
    {
        content_info_id: 271,
        lesson_content_id: 22,
        label: 'Sawdust',
        description: 'The species of tree from which sawdust is derived largely determines its quality and value for use in a growing media. Several sawdusts, such as walnut and non-composted redwood, are known to have direct phytotoxic effects. However, the C:N of sawdust is such that it is not readily decomposed. The high cellulose and lignin content along with insufficient N supplies creates depletion problems which can severely restrict plant growth. However supplemental appli-cations of nitrogen can reduce this problem. Barks – are primarily a bi-product of the pulp, paper and plywood industries. Suitable particle size is obtained by hammer milling and screening. This produces a material which is suitable for use in container media. Physical properties obtained from tree barks are similar to those of Sphagnum moss.',
        images: ''
    },
    {
        content_info_id: 272,
        lesson_content_id: 22,
        label: 'Bagasse',
        description: 'Bagasse is a waste bi-product of the sugar industry. It may be shredded and/or composted to produce a material which can increase the aeration and drainage properties of container media. Because of its high sugar content, rapid microbial activity results after the incorporation of bagasse into a media. This decreases the durability and longevity of bagasse and influences N levels. Although bagasse is readily available at low cost, (usually transportation), its use is limited.',
        images: ''
    },
    {
        content_info_id: 273,
        lesson_content_id: 22,
        label: 'Rice Hulls',
        description: 'Rice hulls are a biproduct of the rice milling industry. Although they are extremely light in weight, rice hulls are very effective at improving drainage. The particle size and resistance to decomposition of rice hulls and sawdust are very similar. However N depletion is not as serious of a problem in media amended with rice hulls. Several other organic materials are suitable for use with container media. Included are: manures; corn cobs; straw; peanut and pecan shells. However these do not constitute major commercial sources of organic amendments.',
        images: ''
    },
    {
        content_info_id: 274,
        lesson_content_id: 22,
        label: 'Sand',
        description: 'Sand, a basic component of soil, ranges in particle size from 0.05mm to 2.0mm in diameter. Fine sands (0.05mm – 0.25mm) do little to improve the physical properties of a growing media and may result in reduced drainage and aeration. Medium and coarse sand particles are those which provide optimum adjustments in media texture. Although sand is generally the least expensive of all inorganic amendments it is also the heaviest. This may result in prohibitive transportation costs. Sand is a valuable amendment for both potting and propagation media.',
        images: ''
    },
    {
        content_info_id: 275,
        lesson_content_id: 22,
        label: 'Perlite',
        description: 'Perlite is a silicous mineral of volcanic origin. The grades used in container media are first crushed and then heated until the vaporization of combined water expands it to a light powdery substance. Lightness and uniformity make perlite very useful for increasing aeration and drainage. Perlite is very dusty when dry and has a tendency to float to the top of a container during irrigation. It has also been shown that perlite contains potentially toxic levels of fluorine. Although costs are moderate, perlite is an effective amendment for growing media.',
        images: ''
    },
    {
        content_info_id: 276,
        lesson_content_id: 22,
        label: 'Vermiculite',
        description: 'Vermiculite is a micacious mineral produced by heating to approximately 745oC. The expanded, plate-like particles which are formed have a very high water holding capacity and aid in aeration and drainage. Vermiculite has excellent ex-change and buffering capacities as well as the ability to supply potassium and magnesium. Although vermiculite is less du-rable than sand and perlite, its chemical and physical properties are very desirable for container media.',
        images: ''
    },
    {
        content_info_id: 277,
        lesson_content_id: 22,
        label: 'Calcined Clays',
        description: 'Calcined clays are formed by heating montmorrillonitic clay minerals to aproximately 690oC. The pottery-like particles formed are six times as heavy as perlite. Calcined clays have a relatively high cation exchange as well as water holding capacity. This material is a very durable and useful amendment. These inorganic soil amendments are generally utilized to increase the number of large pores, decrease water holding capacity and improve drainage and aeration. Other materials such as: pumice; cinders; and pea-gravel are also suitable for this use. Several synthetic soil amendments are bi-products of various plastic manufacturing companies. Others are designed specifically for use in container media. These materials are frequently used in place of sand and perlite and have much the same influence on media properties.',
        images: ''
    },
    {
        content_info_id: 278,
        lesson_content_id: 22,
        label: 'Expanded Polystyrene',
        description: 'Polystyrene flakes, a bi-product of polystyrene processing, are highly resistant to decomposition, increase aeration and drainage,and decrease bulk density. Polystyrene may be broken down by high temperatures and by certain chemical disinfecting agents.',
        images: ''
    },
    {
        content_info_id: 279,
        lesson_content_id: 22,
        label: 'Urea Formaldehydes',
        description: 'This material is prepared by mixing air with a liquid resin and allowing to cool. Urea formaldehyde foams have a greater water holding capacity than polystyrene but are similar in their influence on aeration and drainage. Raw materials are easily transported and are very effective amendments.',
        images: ''
    },
    {
        content_info_id: 280,
        lesson_content_id: 22,
        label: 'Preparing Soilless Growing Media',
        description: 'Although amendment combinations may vary, basic objectives in the preparation of a growing media are alike. An effective program should produce a growing media that is: 1.	porus and well drained, yet retentive of sufficient moisture to meet the water requirements of plants between irrigations; 2.relatively low in soluble salts, but with an adequate exchange capacity to retain and supply the elements necessary for plant growth; 3.standardized and uniform with each batch to permit the use of standardized fertilization and irrigation programs for each successive crop; 4.free from harmful soil pests; pathogenic organisms, soil insects, nematodes and weed seeds; 5.biologically and chemically stable following pasteurization; primarily free from organic matter that releases ammonia when it is subjected to heat or chemical treatments.',
        images: ''
    },
    {
        content_info_id: 281,
        lesson_content_id: 22,
        label: '',
        description: 'Since innumerable amendment combinations can produce a growing medium with these characteristics, it is important to consider both the economic as well as cultural optimums. Factors that determine the cost of a growing medium include: transportation, labor, equipment, materials and handling. In many cases the cost of mixing a “custom” growing medium exceeds that of the commercially prepared materials. These factors should be studied carefully before making a decision.',
        images: ''
    },
    {
        content_info_id: 282,
        lesson_content_id: 22,
        label: 'Recommended Growing Media',
        description: 'The composition of a growing medium should be largely determined by the crop being produced. However there are some media formulations which may be used as a base. The following is a list of several of the most commonly used soilless mixtures:',
        images: 'assets/module_images/M2/L1/soil.png'
    },
    //M2; L2; C1 info
    {
        content_info_id: 283,
        lesson_content_id: 23,
        label: 'Introduction',
        description: 'Land Preparation or Tillage Practice is a very important practice to enhance good yield from crops grown. It is one of the measures used to control crop diseases and pest invasion. The purpose of land preparation is to provide the best soil conditions which will enhance the successful establishment of the tissue culture plants. It is one of the measures used to control crop disease and pest invasion. Land preparation is also called as tillage practice.',
        images: ''
    },
    {
        content_info_id: 284,
        lesson_content_id: 23,
        label: 'Tillage practice',
        description: 'Is the mechanical pulverization or manipulation of the soil to take about favorable conditions for the growth of crops. Tillage practices include all operations used for the function of modifying the soil characteristics. It costs about 30 % of the total cost of cultivation. The objective of land preparation is to develop potential tree growth, survival, and uniformity of a crop about to be established (planted). Through proper land preparation, factors that limit tree growth are reduced. These factors will be the included: You should be aware of land preparation types for proper implementation.',
        images: ''
    },
    {
        content_info_id: 285,
        lesson_content_id: 23,
        label: 'Tillage for Soil Conversation: Tillage',
        description: 'Is an important and the main tool for conservation of the land. As per definition, its primary function is to provide a favorable soil environment for the plant growth which is indirectly related to soil conservation. The effect of tillage on soil erosion is the purpose of its several effects on soil such as aggregation surface sealing infiltration and resistant to erosion, destruction of soil structure either by excessive tillage or tillage operation at improper soil moisture condition tends to raise the soil erosion, causing significant soil loss. To achieve a better result for soil conservation the following points must be considered for tillage operations.',
        images: ''
    },
    {
        content_info_id: 286,
        lesson_content_id: 23,
        label: 'Tillage for Soil Conversation: Tillage Depth',
        description: 'A plowing depth in the 15-20 cm range is generally adequate , and there is seldom any advantage in going deeper. In fact, shallower plowing is often suggested for low rainfall areas like the Sahel to conserve moisture. In som areas, tractor-drawn sub-soilers (long, narrow shanks that penetrate down to 60 cm )are used in an effort to break up deep hardpans (compacted layers.)Results are fair to poor, depending on the kind of hardpan, those consisting of a dense clay coat oftten re-cement themselves within a short time.',
        images: ''
    },
    {
        content_info_id: 287,
        lesson_content_id: 23,
        label: 'Zero Tillage Practice',
        description: 'Zero Tillage Practice otherwise called no tillage is a simplified form of minimum tillage. It involves only opening a narrow strip about 2 to 3 cm wide or hole in the ground for seed or seedling placement. Zero tillage is no pre- planting seedbed preparation. Weeds are taken care of with the use of herbicides and cutlass without disturbing the land. The crop is then planted directly without tilling or ploughing the soil, tis process is highly effective under lands where soil and water erosion are heavy.',
        images: ''
    },
    {
        content_info_id: 288,
        lesson_content_id: 23,
        label: 'Conventional Tillage',
        description: 'It is the sequence of operations traditionally or most generally used given geographic area to produce a given crop. The operations used vary considerably for different crops and in different regions. In the past, conventional tillage included moldboard plowing, usually in the fall. Spring action included one or more passes with a disk harrow or field cultivator before planting. More recently, conventional tillage has changed to contain the use of a chisel plow instead of a moldboard plow, and newer combination tools are replacing chisel plows. These implements leave additional residue than moldboard plows, but often not enough to qualify as conservation tillage. Soil surface following conventional tillage as practiced in the past was effectively free of plant residue. This was helpful with older planting equipment that had limited capability to plant into the residue. It also buried weed seed and disease- bearing crop and weed residue, thereby helping to reduce problems with weeds and plant disease before the advent of modern chemeicla control.',
        images: ''
    },
    {
        content_info_id: 289,
        lesson_content_id: 23,
        label: 'Clean Tillage',
        description: 'The name clean tillage is used for any system that leaves the soil surface more or less free of residue. A soil surface essentially free of rsidues can be achieved with other implements, especially following a crop such as a soybean that produces fragile, easy-to-cover residue.Removing all residues from the soil surfaces and disturbing the soil surface greatly increase the potential for soil erosion. The potential for water erosion is fewer in flat fields, but the potential fow wind erosion is high.Improved planters, seed quality, and herbicides have largely eliminated the want to practice clean tillage.',
        images: ''
    },
    {
        content_info_id: 290,
        lesson_content_id: 23,
        label: 'Minimum Tillage',
        description: 'It is the small manipulation of the soil. It is otherwise referred to as traditional tillage process. It is not as sophisticated and technical tillage. It involves the use of the cutlass to slash weeds and vegetation regrowth on the farm, the less manipulation is done with the how and rake. Farmers with access to tractor or animal drawn tiilage equipment may overdo tillage, particularly through repeated harrowing to control sprouting weeds or break up clods.Killing one crop of weeds by stirring the soil stimulates another by moving other weed seeds closer to the soil surface. Excessive tillage stimulates the microbial breakdown of humus and may further destroy good soil physical condition by over- pulverizing the soil, the machinery , animal, and foot traffic compact the soil, impairing root growth and drainage. Tillage is seldom excessive when hand tools are used to arrange ground for the reference crops, because of the amount of labor it involve. Slash and burn and slash and mulch methods fall under zero tillage, as do method using particularly adapted mechanical planters to sow seed into the unplowed ground. The plow or plant system described above or plowing and planting in one tractor pass are examples of minimum tillage. The savings on equipment wear and fuel are benefits where tractors are used.',
        images: ''
    },
    //M2; L2; C2 info
    {
        content_info_id: 291,
        lesson_content_id: 24,
        label: 'Soil Microbes And What They Do For Plants',
        description: 'Did you know that only 40 to 60% of the fertilizer we apply actually goes to the plant, the remaining is lost to run off into our waterways, volatilization to the air or is tied up in the soils. This is why soil health is such an imperative piece of plant health. Functional soil is a soil embedded with organic matter and soil microbes that work together to hold onto nutrients in the soil and convert nutrients locked in the soil. Beneficial soil microbes form symbiotic relationships with the plant. In fact, the plant will exert as much as 30% of its energy to the root zone to make food for microbes. In return those microbes not only protect the plant from stress, but also feed the plant by converting and holding nutrients in the soil.',
        images: ''
    },
    {
        content_info_id: 292,
        lesson_content_id: 24,
        label: 'What are the Different types of Soil Microbes?',
        description: 'There are five different types of soil microbes: bacteria, actinomycetes, fungi, protozoa and nematodes. Each of these microbe types has a different job to boost soil and plant health.',
        images: ''
    },
    {
        content_info_id: 293,
        lesson_content_id: 24,
        label: 'Bacteria',
        description: 'Bacteria is the crucial workforce of soils. They are the final stage of breaking down nutrients and releasing them to the root zone for the plant. In fact, the Food and Agriculture Organization once said “Bacteria may well be the most valuable of life forms in the soil.”',
        images: ''
    },
    {
        content_info_id: 294,
        lesson_content_id: 24,
        label: 'Actinomycetes',
        description: 'Actinomycetes were once classified as fungi, and act similarly in the soil. However, some actinomycetes are predators and will harm the plant while others living in the soil can act as antibiotics for the plant.',
        images: ''
    },
    {
        content_info_id: 295,
        lesson_content_id: 24,
        label: 'Fungi',
        description: 'Like bacteria, fungi also lives in the rootzone and helps make nutrients available to plants. For example, Mycorrhizae is a fungi that facilitate water and nutrient uptake by the roots and plants to provide sugars, amino acids and other nutrients.',
        images: ''
    },
    {
        content_info_id: 296,
        lesson_content_id: 24,
        label: 'Protozoa',
        description: 'Protozoa are larger microbes that love to consume and be surrounded by bacteria. In fact, nutrients that are eaten by bacteria are released when protozoa in turn eat the bacteria.',
        images: ''
    },
    {
        content_info_id: 297,
        lesson_content_id: 24,
        label: 'Nematodes',
        description: 'Nematodes are microscopic worms that live around or inside the plant. Some nematodes are predators while others are beneficial, eating pathogenic nematodes and secreting nutrients to the plant.',
        images: ''
    },
    //M2; L2; C3 info
    {
        content_info_id: 298,
        lesson_content_id: 25,
        label: 'Introduction',
        description: 'Whether you started seeds yourself or purchased vegetable seedlings at the store, now is the time to transplant seedlings in your garden.',
        images: ''
    },
    {
        content_info_id: 299,
        lesson_content_id: 25,
        label: '10 simple steps to transplant',
        description: '1. Seedlings should be hardened-off, well-fed and watered before transplanting. 2. Prepare a weed-free surface. Loosen and aerate garden soil by tilling or hoeing. 3. Dig a hole large enough for seedling. 4. Carefully remove seedling from its container. Try not to disturb the roots. 5. Set seedling in hole level with soil surface. The exception is tomato seedlings, which can be transplanted a bit deeper. 6. Feed seedling to kick start growth. I transplant each seedling with a hefty handful of compost. If you don’t make compost, purchase specially formulated fertilizer for transplanting. 7. Surround seedling with displaced soil. 8. Water seedling thoroughly. 9. Mulch seedling to maintain soil moisture and regulate temperature. 10.	Keep area weed-free.',
        images: ''
    },
    {
        content_info_id: 300,
        lesson_content_id: 25,
        label: 'Top 3 tips for successful transplanting',
        description: '',
        images: ''
    },
    {
        content_info_id: 301,
        lesson_content_id: 25,
        label: 'Start with strong seedlings',
        description: 'If you start your own seeds, make sure your seedlings have plenty of light, adequate water and drainage. A good growing medium is critical for root establishment. If you buy seedlings remember biggest doesn’t always mean best. Look for healthy and consistent leaf color. The roots should be deep, long, white and fibrous. The stem should be thick and strong. The growing medium should be held together by tight tangled roots. Do not choose leggy seedlings; too long of stem means the seedling was starved for light.',
        images: 'assets/module_images/M2/L2/plants.jpg'
    },
    {
        content_info_id: 302,
        lesson_content_id: 25,
        label: 'Hardening off is important',
        description: 'Don’t skip this step. Store bought seedlings are typically hardened off in the garden center, but seedlings you start need to be acclimated to the natural environment before transplanting. Hardening takes 1-2 weeks. You can move seedlings to a cold frame for a week and then set in the garden an additional week. Or set seedlings out during warm daytime temps and bring them in at night.',
        images: ''
    },
    {
        content_info_id: 303,
        lesson_content_id: 25,
        label: 'Timing is everything',
        description: 'Frost-free dates and warm and cool weather crop temperature requirements for your growing zone are good guidelines. I also consider last season’s planting dates and the weather forecast. Overcast days are great days to plant because cloud coverage reduces the probability of sun-scorching tender plants.',
        images: ''
    },
    // M2; L2; C4 info
    {
        content_info_id: 304,
        lesson_content_id: 26,
        label: 'Introduction',
        description: 'Water is one of the vital elements when starting plants from seed. Too much water and your seeds will drown or rot. Too little and they will either fail to germinate or die once they do. If you are starting your vegetable garden from seed, you have two choices. One, you can start your seeds indoors and then plant them outside as seedlings several weeks later, or you can direct seed into your garden. There are a number of good reasons to start seeds early indoors. Most importantly, you get ahead of the growing season. This is especially important if you live in a place with a short growing season. Another advantage is that you can tightly control the ideal growing conditions: temperature, moisture, sunlight, etc. A third advantage is cooling that early spring itch to get outside and get something in the ground!s ad will end. The best candidates for early starts are things like broccoli, cabbage, cauliflower, celery, eggplant, leeks, onions, parsley, peppers, and tomatoes. Root crops, like beets and carrots do not like to be transplanted and are best sown directly into the garden. Corn and peas are other things that do not take well to a transplanting.',
        images: ''
    },
    {
        content_info_id: 305,
        lesson_content_id: 26,
        label: 'To germinate seeds you can do one of two things:',
        description: '1. You can moisten a paper towel, place the seeds in the middle of the paper towel and place it on the window sill in the sunlight. 2. Alternately, you can fill small sections of a seed starting tray with a soil mixture and plant the seeds into the mixture about 1 inch deep. Then water lightly.',
        images: ''
    },
    {
        content_info_id: 306,
        lesson_content_id: 26,
        label: '',
        description: 'Either way, you don’t want the seeds sitting in water. You want to have the soil or paper towel moist but not soaked. Let the soil mix dry out just a bit, but not completely, before wetting again. I use a spray bottle to keep my starting mixture moist. The key is good drainage. Make sure that excess water has a way to drain away from the seeds. There are seed starting systems available that work via a capillary system. This keeps your soil at the right moisture level with no work from you but I find the spray bottle method pretty simple. If you cover your seeds with some loose plastic, you will create a mini-greenhouse environment that will hold in both heat and moisture. You will need to get air to the seeds so remove the plastic every once in a while so that you don’t get mold formation that can ruin your seeds. After a few days, two small leaves will appear once your seedlings begin poking through the soil and unfurling. Again, keep the soil moist as the seedling begins to take off.',
        images: ''
    },
    {
        content_info_id: 307,
        lesson_content_id: 26,
        label: '',
        description: 'If you cover your seeds with some loose plastic, you will create a mini-greenhouse environment that will hold in both heat and moisture. You will need to get air to the seeds so remove the plastic every once in a while so that you don’t get mold formation that can ruin your seeds. After a few days, two small leaves will appear once your seedlings begin poking through the soil and unfurling. Again, keep the soil moist as the seedling begins to take off. As the days warm and lengthen you will begin taking your seedlings outdoors to “harden off”. That is, to get them used to being outside by putting them out for portions of the day (you will still be bringing them inside at night). Be careful here. The sun and spring winds can dry out that delicate soil in a heartbeat. When the day comes that you are ready to plant your seedlings into the garden, water them well before the transplant. Once they are in the garden, water them again very well. Finally, to avoid drying out your seedlings try not to transplant during the hottest, sunniest part of the day.',
        images: ''
    },
    // M2; L3; C1 info
    {
        content_info_id: 308,
        lesson_content_id: 27,
        label: 'Why Is Irrigation Water Management Important?',
        description: 'Irrigation water management is the act of timing and regulating irrigation water application in a way that will satisfy the water requirement of the crop without wasting water, energy, and plant nutrients or degrading the soil resource. This involves applying water according to crop needs in amounts that can be held in the soil and at rates consistent with the intake characteristics of the soil. A primary objective in the field of irrigation water management is to give irrigators an understanding of conservation irrigation principles. This is done by showing them how they can judge the effectiveness of their own irrigation practices, make good water management decisions, or recognize the need to make adjustments in existing systems or to install new systems.',
        images: ''
    },
    {
        content_info_id: 309,
        lesson_content_id: 27,
        label: 'The net result of proper irrigation water management typically:',
        description: 'Prevents excessive use of water. Minimizes pumping costs. Prevents excessive soil erosion. Reduces labour. Maintains or improves quality of groundwater and downstream surface water. Increases crop biomass yield and product quality',
        images: ''
    },
    {
        content_info_id: 310,
        lesson_content_id: 27,
        label: '',
        description: 'Irrigation scheduling is the part of proper irrigation water management that involves the decision of when to irrigate and how much water to apply. Scheduling tools provide information that irrigation decision makers can use to develop irrigation strategies for each field on the farm. Such strategies may be based on long-term data that represents average conditions or may be developed as the season progresses, using real-time information and short-time predictions. In both cases, information about the crop, soil, climate, irrigation system, water deliveries, and management objectives must be considered to tailor irrigation scheduling procedures to a specific irrigation decision maker and field condition. An irrigation scheduling tool needs only be accurate enough to make the decision when and how much to irrigate. Modern scheduling is based on soil-water balance or crop-water balance for one or more points in the field. By measuring existing and estimating future soil-water content or by monitoring crop-water stress level, irrigation water can be applied before damaging crop stress occurs. Scheduling irrigation involves forecasting of crop water use rates to anticipate future water needs.',
        images: ''
    },
    {
        content_info_id: 311,
        lesson_content_id: 27,
        label: '',
        description: 'Computerized irrigation scheduling allows the storage and transfer of data, easy access to data, and calculations using the most advanced and complex methods for predicting crop evapotranspiration. Many computer software programs are available to assist in scheduling irrigations. In Kansas, software available from the Kansas State Research and Extension is typically used. The software (called KanSched) is used by the Natural Resources Conservation Service (NRCS) to document irrigation water management under the Environmental Quality Incentives Program. When you are a farmer, gardener or work in an industry that requires landscape maintenance it’s important to implement a system of irrigation management. In order to produce proper crops or fields of flowers, healthy soil and plants must be watered routinely at the appropriate times and rates. What’s more, proper rates of water and timing are essential for properly yielded results. Oftentimes systems are too extensive or the size of properties to vast to water areas manually which is why automatic systems are used more readily for convenience and ease of use. Be sure to get in touch with professional irrigation management services whenever you are curious as to how to go about securing a system. If you’re in need of landscaping services or whole house water treatment be sure to read the following before you get in touch with a professional.',
        images: ''
    },
    {
        content_info_id: 312,
        lesson_content_id: 27,
        label: 'Why do we use irrigation?',
        description: 'Irrigation management is essential for gardeners or farmers in order to promote plant growth. In turn, stock farmers can use them in order to make sure their animals have available food sources for healthier systems. Since crops and plants need routine moisture the use of irrigation systems has risen in their essential need.',
        images: ''
    },
    {
        content_info_id: 313,
        lesson_content_id: 27,
        label: 'What is irrigation water management?',
        description: 'Water irrigation management involves the monitoring of water application for crops or yard. It usually will be used for more extensive properties that need a system to help manage the volume, rate, and timing of water application in order to match with water holding capacities and soil intake. In order to promote optimum crop yields, it’s especially important to monitor soil moisture without runoff or deep percolation losses. With your irrigation management, you’ll be able to properly adjust your water with tools that can, later on, be adjusted to ensure properly yielded results. Flow meters are great at recording instantaneous flow rates as well as the total volume of water used. With soil moisture sensors and meters soil water deficit may be monitored. A checkbook method, in turn, may be able to balance soil moisture through its monitoring of leveling an irrigated cropland. Finally, with data loggers, you can record soil moisture history through the growing season of a field or area.',
        images: ''
    },
    {
        content_info_id: 314,
        lesson_content_id: 27,
        label: 'What are the objectives of irrigation?',
        description: 'The main objectives for irrigation management or irrigation, in general, is to promote the proper growth of plants and maintaining the right levels of moisture for the soil. Another objective can be seen as making sure there is backup insurance when there is a short duration of drought as this can sustain the field enough when water levels are low. Another reason is to cool the atmosphere and soil which is an ideal environment for plants. What’s more, with regular irrigation you’ll be able to dilute any harsh chemicals in soil or even washout harmful salts. Finally, with irrigation you can lower the dangers of soil piping which can increase subsurface erosion from the unnatural underground water flow. Soil piping is an alternate method from irrigation yet it can threaten farming results as well as threaten the stability of any surrounding buildings with movement when soil moisture levels are too high and cause the building to shift.',
        images: ''
    },
    {
        content_info_id: 315,
        lesson_content_id: 27,
        label: 'What are the methods of irrigation?',
        description: 'There are various methods that can be applied to your irrigation management system. Irrigation management methods will be dependent on what your irrigation is being used for or its goals.',
        images: ''
    },
    {
        content_info_id: 316,
        lesson_content_id: 27,
        label: 'The Different Irrigation Methods Used:',
        description: 'Center Pivot Irrigation, Drip Irrigation, Lateral Move Irrigation, Localized Irrigation, Manual Irrigation, Sprinkler Irrigation, Sub-Irrigation, and Surface Irrigation',
        images: ''
    },
    {
        content_info_id: 317,
        lesson_content_id: 27,
        label: 'What is the best method of irrigation?',
        description: 'The best typed of irrigation management for you may depend on the specifics of what is needed as well as the characteristics of your property. In general, however, it seems that drip irrigation is one of the most efficient types of irrigation systems due to their percentages of applied and lost water ratings in conjunction with meeting crop water need falling between 80-90%. It’s important to take into consideration irrigation management and problems that may befall your particular property with a professional in order to ensure the right method is applied for you.',
        images: ''
    },
    //M2; L3; C2 info
    {
        content_info_id: 318,
        lesson_content_id: 28,
        label: 'Introduction',
        description: 'Once a pest has reached either an economic threshold or an intolerable level, action should be taken. Pesticides are used as a control measure when other strategies will not bring the pest population under the threshold, when other strategies are too expensive or time-consuming, or when the quality or yield effects are unacceptable to the grower.  In fact, the success of waiting until a pest reaches the threshold usually hinges on the availability of a pesticide that will bring the pest populations down quickly.',
        images: ''
    },
    {
        content_info_id: 319,
        lesson_content_id: 28,
        label: 'Management tactics',
        description: 'Management tactics can be preventative, curative, or both and are sometimes combined to provide the best possible program. Preventative measures, taken before planting, or before the pest appears, can result in fewer rescue treatments. Each crop and situation will require management options tailored to that situation. A general list of actions is provided below.',
        images: ''
    },
    {
        content_info_id: 320,
        lesson_content_id: 28,
        label: 'Cultural Controls',
        description: 'Are those that disrupt the environment of the pest, and/or prevent its movement.  Plowing, crop rotation, removal of infected plant material, cleaning of greenhouse and tillage equipment, and effective manure management are all cultural practices that are employed to deprive pests of a comfortable habitat or prevent their spread.  The management of urban and industrial pests has improved with proper sanitation and elimination of pest harborages, more frequent garbage pickup, or installation of lights that do not attract insects.',
        images: ''
    },
    {
        content_info_id: 321,
        lesson_content_id: 28,
        label: '',
        description: 'Rotate crops to reduce the buildup of weeds, disease, and insect pests. Crop rotation is useful for those pests that do not move far from their overwintering sites. Remove overwintering sites, such as cull piles, damaged, and volunteer plants, and alternate hosts, to minimize damage by insects and diseases. Use techniques that expose pests to natural enemies or environmental stress, or that make the crop less susceptible to insects or diseases. Adjust planting times to avoid periods of peak pest abundance. Plant disease-free seeds and transplants. Promote vigorous crop growth with proper nutrition and weed removal to avoid stress that may weaken crops and make them more susceptible to attack by insects, diseases, or physiological disorders. Manage irrigation schedules to avoid long periods of high relative humidity. Wet, highly humid conditions encourage disease pests to develop. When possible only irrigate the root system and not the foliage. Arrange fields for the best air drainage and circulation to promote low humidity. Where crops are planted in rows use cultivation, where practical, in combination with banding of herbicides over the row for weed control. This could reduce herbicide costs while achieving good weed control. Keep woody plants thinned to improve air circulation within the plant foliage. Use a no-till system to reduce weed seed germination. Plant cover crops to prevent weeds from germinating after harvest.',
        images: ''
    },
    {
        content_info_id: 322,
        lesson_content_id: 28,
        label: 'Physical Barriers',
        description: 'Such as netting over small fruits and screening in greenhouses can prevent insects that cause crop loss, and mulch can inhibit weed germination beneath desirable plants.  Physical barriers are important in termite, house fly, and rodent control. Paint or seal porous wood.',
        images: ''
    },
    {
        content_info_id: 323,
        lesson_content_id: 28,
        label: 'Biological Controls',
        description: 'Conserving or releasing natural enemies (biological control agents) can prevent the rise of certain pests. Examples of biological control agents are beneficial mites that feed on mite pests in orchards, the Hb nematodes that kill harmful soil grubs, and Encarsia formosa, a wasp that parasitizes the greenhouse whitefly.',
        images: ''
    },
    {
        content_info_id: 324,
        lesson_content_id: 28,
        label: 'Many biological control agents are commercially available:',
        description: 'Purchasing and releasing predators and parasites of pests, if available, can be effective in reducing pest populations especially in greenhouses or other enclosed structures. Develop refuges for natural enemies of the pest by establishing areas of flowering plants and shrubs to supply nectar, alternative hosts, and shelter. Choose and use pesticides wisely so you can conserve indigenous or released natural enemies of insect and mite pests.',
        images: ''
    },
    {
        content_info_id: 325,
        lesson_content_id: 28,
        label: 'Pest-resistant cultivars',
        description: 'Are less susceptible than other varieties to certain insects and diseases. Planting, disease-resistant crops is one of the simplest methods of reducing disease management actions during the growing season.  The use of resistant varieties often means that growers need not apply as many pesticides as with susceptible varieties.  Potato growers control the golden nematode by planting resistant cultivars.  Apple growers can save up to eight fungicide applications a year by growing certain cultivars that resist diseases. Farmers growing alfalfa and wheat keep several pests at bay by planting resistant varieties. Many ornamental plant cultivars have been bred to resist diseases and insects. American elm and American chestnut may return to our forests in the future as the result of genetically modified cultivars.',
        images: ''
    },
    {
        content_info_id: 326,
        lesson_content_id: 28,
        label: 'Pesticides',
        description: 'One of the major goals of IPM is to minimize reliance on pesticides. Use pesticides only when monitoring, economic thresholds, or disease forecasts indicate a need and with the appropriate timing, on target, and at the lowest effective rate. Select pesticides that are registered by both the state and EPA and labeled for use on the intended crop or site. Also select according to efficacy, previous use patterns, the potential for and incidence of resistance, and the possible impact on the environment and natural enemies. Be certain to achieve uniform coverage with your equipment, applying recommended application rates with accurately calibrated equipment that targets the pest, or crop surfaces to be protected.',
        images: ''
    },
    {
        content_info_id: 327,
        lesson_content_id: 28,
        label: 'Structural Modifications',
        description: 'Such as preventing support timbers from contacting soil, can help prevent damage from several different wood-destroying pests. Wood absorbs moisture and is more susceptible to attack by carpenter ants and termites when in direct contact with the soil. Paints, sealants, or other barrier applications can also prevent pest intrusion into structural materials.',
        images: ''
    },
    {
        content_info_id: 328,
        lesson_content_id: 28,
        label: 'Construction Site Sanitation',
        description: 'Such as removing tree stumps and lumber scraps from construction sites, which are prime food sources for subterranean termites, can prevent problems in the future.',
        images: ''
    },
    //M2; L3; C3 info
    {
        content_info_id: 329,
        lesson_content_id: 29,
        label: 'Introduction',
        description: 'Replanting when crop damage and stand reduction occurs early in the growing season can be an economically viable option. Replanting decisions, however, are complicated by not knowing what future seasonal growing conditions will occur. Decisions should be based on historic weather trends plus current environmental and economic conditions. The decision to replant should be made only after evaluating the following questions: Will the economic returns exceed the cost of replanting? What is the most viable crop to plant? Furthermore, carefully consider how current soil moisture, previous herbicide use and the date of replanting might influence the crop or crops to be replanted. The final decision on replanting should be based on sound agronomic and economic information. Injury to the original stand, as well as crop uniformity and overall plant health, must be determined accurately. The initial critical question is whether keeping the original stand or replanting will result in greater net income.',
        images: ''
    },
    {
        content_info_id: 330,
        lesson_content_id: 29,
        label: 'Late Planting',
        description: 'Excessive moisture, poorly drained soils and other factors frequently delay planting beyond the optimum period for yield in North Dakota. Since many of the factors that impact the decision on replanting also impact the decision on how to deal with late planting, this publication also provides relevant information on delayed crop planting.',
        images: ''
    },
    {
        content_info_id: 331,
        lesson_content_id: 29,
        label: 'Appraising Crop Injury, Stand Reduction and Yield Potential',
        description: 'Evaluating crop injury and estimating potential crop yield is the first step in determining if a crop should be replanted. The best possible evaluation of the surviving stand is needed because the critical yield comparison ultimately will be between the suboptimal stand from the original planting date versus a full stand from a later than optimum planting date. During the seedling stage, injury that results in stand reduction will cause the greatest yield reductions. Leaf loss or leaf burn during early stages has a minimal effect on yield; however, as the crop approaches reproductive developmental stages, leaf damage or loss is more detrimental to yield. An assessment of potential plant stand soon after crop injury occurs is critical to avoid delays if replanting is necessary. An accurate determination of the existing stand must be made. Stand counts should be taken at random from several areas in damaged portions of the field. Determining stand level may be more complicated than simply counting plants. If seedling emergence is uneven, an evaluation of potential late-emerging plants should be made. If areas in a field are not damaged, they do not need to be considered for replanting. However damage in fields often is distributed randomly throughout a field and this complicates decision making.',
        images: ''
    },
    {
        content_info_id: 332,
        lesson_content_id: 29,
        label: 'Figure 1 for key structures',
        description: 'In early plant development, a few key structures are indicators of potential plant survival. A healthy root system and seedling emergence tissue are needed during plant establishment (see Figure 1 for key structures). If these structures appear normal and the depth of the seed is not excessive, emergence likely will occur when soil moisture is adequate. Destruction of leaf area on young plants is seldom as detrimental to subsequent plant growth and yield as the initial appearance may suggest. If the growing point of the small grain is not damaged and the stem is not broken below the cotyledonary node of broadleaf crops, the plants likely will recover.',
        images: 'assets/module_images/M2/L3/crops.png'
    },
    {
        content_info_id: 333,
        lesson_content_id: 29,
        label: '',
        description: 'During early growth stages, most North Dakota crops can sustain some stand loss without experiencing significant yield reduction. Crops compensate for stand reduction through tillering, secondary branching or increased head number, and increased ear, head or seed size. Comparison of the estimated yield of the injured crop with expected yield of an alternative crop minus reseeding costs must be considered. Often this calculation will reveal that the present crop stand will be more viable economically than a later replanted crop.',
        images: ''
    },
    {
        content_info_id: 334,
        lesson_content_id: 29,
        label: '',
        description: 'During early growth stages, most North Dakota crops can sustain some stand loss without experiencing significant yield reduction. Crops compensate for stand reduction through tillering, secondary branching or increased head number, and increased ear, head or seed size. Comparison of the estimated yield of the injured crop with expected yield of an alternative crop minus reseeding costs must be considered. Often this calculation will reveal that the present crop stand will be more viable economically than a later replanted crop.',
        images: ''
    },
    {
        content_info_id: 335,
        lesson_content_id: 29,
        label: '',
        description: 'Table 1 shows the population levels of several crops that should be considered minimum stands when deciding whether to replant, assuming the plant population is relatively uniform in distribution. As the season progresses, the yield potential of a newly planted crop is reduced (Tables 2 and 3); therefore, the lower minimum stand values from Table 1 should be utilized as the season progresses. During early development, the growing point of cereal crops is below the soil surface, making them less susceptible to injury. With this protection, plants can suffer the loss of above-ground foliage without dying. The growing point should be white or cream-colored. Darkening or softening of the growing point usually precedes plant death. When the growing point moves above the soil surface at jointing in small grains and the sixth-leaf stage in corn, it becomes more vulnerable to physical damage.',
        images: 'assets/module_images/M2/L3/table_1_2_3.png'
    },
    {
        content_info_id: 336,
        lesson_content_id: 29,
        label: 'BrodLeaf Crops',
        description: 'During early development, the growing point of cereal crops is below the soil surface, making them less susceptible to injury. With this protection, plants can suffer the loss of above-ground foliage without dying. When hail, frost or similar types of injury cause severe foliar damage, waiting several days after the injury occurs to make an accurate determination of stand reduction is advisable. After this period, new growth on plants with uninjured growing points can be observed as in Figure 1. If no regrowth is observed, the stem of the plant may be cut in half to inspect the growing point.',
        images: 'assets/module_images/M2/L3/brodledf.png'
    },
    {
        content_info_id: 337,
        lesson_content_id: 29,
        label: 'Cereal Crops',
        description: 'When hail severely injures small-grain cereal crops after jointing, plants still have potential for recovery by initiating new tillers. Precipitation that usually accompanies hail storms will help stimulate tillering. Potentially, tillering can restore yield potential to acceptable levels. The number of head-bearing tillers is determined before heading of the main stem, so injury that occurs after heading of the main stem in small grains is the most damaging to yield.',
        images: ''
    },
    {
        content_info_id: 338,
        lesson_content_id: 29,
        label: 'Broadleaf Crops',
        description: 'The initial growing point on most broadleaf crops is at the plant’s tip, which increases susceptibility to injury early in the season. Stem breakage or damage below the cotyledons (Figure 1) will result in plant death. However, buds form in the leaf axils later in the development of broadleaf plants, unlike small grains. After the loss of the main stem from injury, these buds can begin growth with secondary branching replacing the loss of the main stem. When this occurs, yield reduction will result from leaf loss only, rather than a combination of stand and leaf loss. The cotyledons of field pea and lentil remain under ground and the secondary growing points near the cotyledons can be activated if damage occurs to the top of the plant. In sunflower, secondary stems developed from buds in the leaf axils will not compensate for loss of the main stem. These secondary stems will not produce viable seed heads, so loss of the main stem growing point results in the loss of the plant’s yield potential. In addition, injured plants with secondary stems compete with healthy plants, further reducing yield.',
        images: ''
    },
    {
        content_info_id: 339,
        lesson_content_id: 29,
        label: 'Indirect Effects of Injury',
        description: 'In addition to the direct effect of leaf loss or stand reduction, indirect effects of crop injury, such as increased weed competition and increased disease potential, should be considered. Damaged crops usually grow slowly until they have recovered, which provides the potential for greater weed competition. Loss of leaf canopy allows additional sunlight to reach previously shaded weeds and may result in additional weed flushes. Wounds from hail, insect or wind injury provide opportunities for pathogens to infect the plant. Resulting diseases may reduce yields or grain quality directly. Previously applied herbicides may have little remaining activity to control new flushes of weeds. Use of postemergence herbicides (particularly those that normally stress the crop) to control new weed flushes should be delayed on visibly weakened crops until the crop has an opportunity to recover. Otherwise, herbicides that are relatively safe on the crop should be used to control new weed flushes when weeds are likely to become too large to control once the crop has fully recovered. Areas with no vegetative cover are in danger of soil erosion and stay wet longer because no plant transpiration is taking place.',
        images: ''
    },
    {
        content_info_id: 340,
        lesson_content_id: 29,
        label: 'Replanting Decision',
        description: 'The decision to replant ultimately must be made by comparing the estimated yield of the injured crop with that of a replanted crop. This is quite subjective and each case must be considered individually in terms of time of year, alternate crop choices, previous herbicide use, crop economics and insurance, and other related factors. Crops replanted late in the season almost always will yield less than those planted at an optimum time. Table 2 shows approximate yield reductions that may be expected from late-planted cool-season crops. Table 3 shows approximate yield reductions that may be expected from late-planted corn, soybean and sunflower. The remaining growing season may be too short for some crops. Table 4 shows options for replanting and the dates by which most North Dakota crops can be planted safely and still produce a useful or marketable product. These dates will vary somewhat depending on the region of the state. Residues from previously applied herbicides may restrict some crops from being used as a replant crop. The decision to replant is both an agronomic and economic one that requires careful assessment of crop injury, yield potential, alternate crop choices and cultural practices related to crop growth and development. Each case of injury must be considered thoroughly and individually.',
        images: 'assets/module_images/M2/L3/field_crops.png'
    },
    //M2; L3; C4 info
    {
        content_info_id: 341,
        lesson_content_id: 30,
        label: 'Plant Rejuvenation',
        description: 'Means restoring vitality and freshness of plants. It is another Name for renewal. Rejuvenation is attempted to make the plant new. In India many existing orchards are not as productive as their potential. Selection of poor planting material, improper plantation and upkeep make orchards uneconomic. These situations necessitate need for rejuvenation. Various factors which make the plant susceptible to rejuvenations are as under:',
        images: ''
    },
    {
        content_info_id: 342,
        lesson_content_id: 30,
        label: 'Techniques of Rejuvenation: Pruning',
        description: 'Pruning -is very powerful technique of rejuvenating the plants. It brings juvenility. While pruning every attempt is made to remove dead, damaged, diseased and inter lacerating branches. Generally pruning very is resorted at breast height at about 2m height from ground level. Lower the pruning more vigorous is the sprouting. It is the physiological age not chronological age that is most important for rejuvenility and in turn the ability of the plant to sprout. Futher after long bearing age, trees itself enter into senility. Pruning helps in invigorating such trees.',
        images: ''
    },
    //M2; L3; C5 info
    {
        content_info_id: 343,
        lesson_content_id: 31,
        label: 'Organic fertilizers',
        description: 'Are an essential source for plant nutrients and a soil conditioner in agriculture. Due to its sources and the composition of the organic inputs as well as the type, functionality and failures of the applied treatment process, the organic fertilizer may contain various amounts of infectious agents and toxic chemicals, especially the antibiotics that can be introduced to the subsequent food chain. A range of human and animal pathogens of bacterial, viral and parasitic origin have been the cause of food-borne epidemics due to unintended contamination from organic fertilizers. The use of antibiotics by humans and in animal feeds will also end up in the organic fertilizers. These antibiotics and other chemicals, depending on the sources of the organics, will enhance the likelihood of occurrence of resistant and multi-resistant strains of microorganisms in society and have been reported to cause ecotoxicological environmental effects and disruption of the ecological balance. Exposure of microorganisms to sublethal concentration of antibiotics in the organic products induces antibiotic resistance. WHO guidelines for the reuse of excreta and other organic matters identify the risk for the exposed groups to the reuse of the excreta and are applicable in the use of organic fertilizers in agriculture.',
        images: ''
    },
    {
        content_info_id: 344,
        lesson_content_id: 31,
        label: '',
        description: 'The potential health intricacies linked with organic fertilizers relate to their origin, their treatment and human exposure within a system perspective from origin to use, including products like crop type. Since organic fertilizers mainly are “faecal material/manure and urine from different animals and/or humans, with the addition of plant materials (organic solid wastes), or in special situations waste materials [1] from food or plant processing industries”, the origin of the different fractions and their amounts partly defines the risk. Usually the risk is outbalanced by a wide range of benefits that the use of organic fertilizer exerts in agriculture as nutritional fertilizers and for soil conditioning. It has been further implied as more environmental friendly than the inorganic fertilizers [1] and its effect more tender on biotic components of the ecosystem without much shift in the ecological balance [2]. This is partly reflected by organisms like earthworms which may be negatively affected by inorganic fertilizers but promoted by the use of organic fertilizers and also incorporated as decomposers in aerobic composting processes [3, 4].',
        images: ''
    },
    {
        content_info_id: 345,
        lesson_content_id: 31,
        label: 'As this chapter deals with the public health aspects and risks involved, we define the organic materials utilized by its sources and thus relate to the following:',
        description: 'Human faecal materials (also sludge from domestic treatment plants and from on-site sanitation, e.g. pit latrine emptying). Human urine (if separated). Animal manure (some risk differences depending on the species of animals/birds). Animal urine (often collected/spread separately, but impacted by the animal faeces). Other types of organic solid wastes (plant materials, domestic, industrial from organic food/fodder processing industries).',
        images: ''
    },
    {
        content_info_id: 346,
        lesson_content_id: 31,
        label: 'Additionally, the risk may relate to some storage-specific factors like',
        description: 'Regrowth of specific bacterial pathogens or opportunistic ones (occurs when the material that, for example should be/are composted, are not well stabilized or broken down. During these circumstances, for example Escherichia coli, Salmonella sp., Listeria sp. and spore formers will regrow in the material if present). When the collected/stored/kept organic fractions or mixture thereof (see above) function as a breeding site for flies and mosquitoes that serve as vectors of parasitic diseases. Development of spore-forming thermophilic fungi and Actinomycetes in composting processes, where the spores can cause diseases in both immune-competent and immune-compromised individuals upon inhalation. An example of such an organism is Aspergillus fumigatus.',
        images: ''
    },
    {
        content_info_id: 347,
        lesson_content_id: 31,
        label: '',
        description: 'Based on source, the risk will vary to a great extent, depending on the health of the animals/humans that primarily defines the microbial concentration and partly occurrence of antibiotics and chemical components in the organic wastes (from domestic or animal sludge fractions) that may be conveyed to the agricultural sites and crops fertilized. Additional components may apply if organic industrial wastes are utilized. An indirect organic fertilization may occur through irrigation using wastewater effluent, where the nutrient load serves as an advantage. This is widely applied in developing countries [5]. However, this may result in additional inputs of antibiotics, toxic organic and inorganic compounds and pathogens. All these concepts are further deliberated in this chapter. The possibilities of recycling food-borne pathogens via agricultural crops to the final end consumers of the crops will additionally be discussed. Food-borne pathogens are especially important for animal faecal-based fertilizers used on fruits and vegetables farms meant to supply salads in restaurants. Other dynamics are residual antibiotics which are sometimes locked in the components of the organic fertilizers with attending public health implications to be further enumerated in this chapter.',
        images: ''
    },
    //M2; L4; C1 info
    {
        content_info_id: 348,
        lesson_content_id: 32,
        label: 'Maturity Indices – are the sign or indication the readiness of the commodity for harvesting',
        description: 'The principles dictating at which stage of maturity a fruit or vegetable should be harvested are crucial to its subsequent storage and marketable life and quality. Post-harvest physiologists distinguish three stages in the life span of fruits and vegetables: maturation, ripening, and senescence. Maturation is indicative of the fruit being ready for harvest. At this point, the edible part of the fruit or vegetable is fully developed in size, although it may not be ready for immediate consumption. Ripening follows or overlaps maturation, rendering the produce edible, as indicated by taste. Senescence is the last stage, characterized by natural degradation of the fruit or vegetable, as in loss of texture, flavour, etc. (senescence ends at the death of the tissue of the fruit). Some typical maturity indexes are described in following sections.',
        images: ''
    },
    {
        content_info_id: 349,
        lesson_content_id: 32,
        label: 'Skin colour',
        description: 'This factor is commonly applied to fruits, since skin color changes as fruit ripens or matures. Some fruits exhibit no perceptible colour change during maturation, depending on the type of fruit or vegetable. Assessment of harvest maturity by skin colour depends on the judgment of the harvester, but colour charts are available for cultivars, such as apples, tomatoes, peaches, chilli peppers, etc.',
        images: ''
    },
    {
        content_info_id: 350,
        lesson_content_id: 32,
        label: 'Optical methods',
        description: 'Light transmission properties can be used to measure the degree of maturity of fruits. These methods are based on the chlorophyll content of the fruit, which is reduced during maturation. The fruit is exposed to a bright light, which is then switched off so that the fruit is in total darkness. Next, a sensor measures the amount of light emitted from the fruit, which is proportional to its chlorophyll content and thus its maturity.',
        images: ''
    },
    {
        content_info_id: 351,
        lesson_content_id: 32,
        label: 'Shape',
        description: 'The shape of fruit can change during maturation and can be used as a characteristic to determine harvest maturity. For instance, a banana becomes more rounded in cross-sections and less angular as it develops on the plant. Mangoes also change shape during maturation. As the mango matures on the tree the relationship between the shoulders of the fruit and the point at which the stalk is attached may change. The shoulders of immature mangoes slope away from the fruit stalk; however, on more mature mangoes the shoulders become level with the point of attachment, and with even more maturity the shoulders may be raised above this point.',
        images: ''
    },
    {
        content_info_id: 352,
        lesson_content_id: 32,
        label: 'Size',
        description: 'Changes in the size of a crop while growing are frequently used to determine the time of harvest. For example, partially mature cobs of Zea mays saccharata are marketed as sweet corn, while even less mature and thus smaller cobs are marketed as baby corn. For bananas, the width of individual fingers can be used to determine harvest maturity. Usually a finger is placed midway along the bunch and its maximum width is measured with callipers; this is referred to as the calliper grade.',
        images: ''
    },
    {
        content_info_id: 353,
        lesson_content_id: 32,
        label: 'Aroma',
        description: 'Most fruits synthesize volatile chemicals as they ripen. Such chemicals give fruit its characteristic odor and can be used to determine whether it is ripe or not. These doors may only be detectable by humans when a fruit is completely ripe, and therefore has limited use in commercial situations.',
        images: ''
    },
    {
        content_info_id: 354,
        lesson_content_id: 32,
        label: 'Fruit opening',
        description: 'Some fruits may develop toxic compounds during ripening, such as ackee tree fruit, which contains toxic levels of hypoglycine. The fruit splits when it is fully mature, revealing black seeds on yellow arils. At this stage, it has been shown to contain minimal amounts of hypoglycine or none at all. This creates a problem in marketing; because the fruit is so mature, it will have a very short post-harvest life. Analysis of hypoglycine ‘A’ (hyp.) in ackee tree fruit revealed that the seed contained appreciable hyp. at all stages of maturity, at approximately 1000 ppm, while levels in the membrane mirrored those in the arils. This analysis supports earlier observations that unopened or partially opened ackee fruit should not be consumed, whereas fruit that opens naturally to over 15 mm of lobe separation poses little health hazard, provided the seed and membrane portions are removed. These observations agree with those of Brown et al. (1992) who stated that bright red, full sized ackee should never be forced open for human consumption.',
        images: ''
    },
    {
        content_info_id: 355,
        lesson_content_id: 32,
        label: 'Leaf changes',
        description: 'Leaf quality often determines when fruits and vegetables should be harvested. In root crops, the condition of the leaves can likewise indicate the condition of the crop below ground. For example, if potatoes are to be stored, then the optimum harvest time is soon after the leaves and stems have died. If harvested earlier, the skins will be less resistant to harvesting and handling damage and more prone to storage diseases.',
        images: ''
    },
    {
        content_info_id: 356,
        lesson_content_id: 32,
        label: 'Abscissions',
        description: 'As part of the natural development of a fruit an abscission layer is formed in the pedicel. For example, in cantaloupe melons, harvesting before the abscission layer is fully developed results in inferior flavoured fruit, compared to those left on the vine for the full period.',
        images: ''
    },
    {
        content_info_id: 357,
        lesson_content_id: 32,
        label: 'Firmness',
        description: 'A fruit may change in texture during maturation, especially during ripening when it may become rapidly softer. Excessive loss of moisture may also affect the texture of crops. These textural changes are detected by touch, and the harvester may simply be able to gently squeeze the fruit and judge whether the crop can be harvested. Today sophisticated devices have been developed to measure texture in fruits and vegetables, for example, texture analyzers and pressure testers; they are currently available for fruits and vegetables in various forms. A force is applied to the surface of the fruit, allowing the probe of the penetrometer or texturometer to penetrate the fruit flesh, which then gives a reading on firmness. Hand held pressure testers could give variable results because the basis on which they are used to measure firmness is affected by the angle at which the force is applied. Two commonly used pressure testers to measure the firmness of fruits and vegetables are the Magness-Taylor and UC Fruit Firmness testers (Figure 2.1). A more elaborate test, but not necessarily more effective, uses instruments like the Instron Universal Testing Machine. It is necessary to specify the instrument and all settings used when reporting test pressure values or attempting to set standards.',
        images: ''
    },
    //M2; L4; C2 info
    {
        content_info_id: 358,
        lesson_content_id: 33,
        label: 'When to Harvest/Maturity Guidelines:',
        description: 'Harvest before the plant flowers or sends up a flower spike. Leaves should be tender, not tough. For arugula and salad mix, cut when leaves are small and very tender (3-4 inches high); be sure weeds or grasses have been removed from harvest area. For pea tendrils, snap off tips of plants where stem is still succulent and soft; harvest before stems turn stiff or woody. Time of Day to Harvest: Early morning is the best time to harvest most greens, since that is the coolest time of day. If morning is not possible, try to harvest in the evening after the heat of the day has passed.',
        images: ''
    },
    {
        content_info_id: 359,
        lesson_content_id: 33,
        label: 'Fruit and Melons',
        description: 'Asian Cucumbers Bitter Melon Cucumbers Eggplant, all varieties Kittely Peppers, all varieties Summer Squash Tomatillos Tomatoes Zucchini.',
        images: ''
    },
    {
        content_info_id: 360,
        lesson_content_id: 33,
        label: 'When to Harvest/Maturity Guidelines:',
        description: 'Harvest when fruit is the desirable size and/or color, and when the flesh is firm but ripe. For cucumbers, eggplant, melon, and squash, do not harvest too late, or fruit can become bitter and/or seedy. Time of Day to Harvest. Early morning is the best time to harvest, while it is still cool but after dew has dried from the fruit. 7:00am-9:00am Harvesting and Post-Harvest Handling.',
        images: ''
    },
    {
        content_info_id: 361,
        lesson_content_id: 33,
        label: 'Instructions:',
        description: 'Cucumbers, melons, and tomatoes can be picked by turning the fruit parallel to the stem and quickly snipping it off. Use scissors or clippers to cut the stems of eggplant, peppers, and squash just above the fruit. Keep fingernails trimmed when harvesting squash to avoid punctures. These crops are delicate - be careful not to puncture or bruise during harvest. • Do not stack too many fruits in one bin or those at the bottom will be crushed. • Keep vegetables in the shade and cool as soon as possible. No need to rinse or wash unless dirt has adhered to the vegetables.',
        images: ''
    },
    {
        content_info_id: 362,
        lesson_content_id: 33,
        label: 'Cruciferous Vegetables',
        description: 'Baby Bok Choy Broccoli Broccoli Raab Chinese Broccoli Cabbage Pac Choy',
        images: ''
    },
    {
        content_info_id: 363,
        lesson_content_id: 33,
        label: 'When to Harvest/Maturity Guidelines:',
        description: 'Harvest baby bok choy or pac choy when the leaves are about 6-10 inches heigh. Cut just above the root so the head stays together. Broccoli should be harvested when the heads are fully formed but still tight and compact - before flowering. If you leave the plant in the ground more baby broccoli heads will grow off the main stalk that you can keep harvesting. Broccoli raab and Chinese broccoli should be harvested when the leaves are still tender and flower heads are formed. Chinese broccoli may be starting to flower at time of harvest. Pick cabbage when the heads are fully formed and firm. Each head should weigh at least one pound. Time of Day to Harvest: Cooler times of day, if possible (mornings & evenings).',
        images: ''
    },
    {
        content_info_id: 364,
        lesson_content_id: 33,
        label: 'Harvesting and Post-Harvest Handling Instructions:',
        description: 'Baby bok choy and pac choy should be cut just above the roots at ground level. Trim off any yellow leaves. Bunch 2-4 heads together and fasten with a rubber band. Cut broccoli raab and Chinese broccoli stems about 8 inches long. Cut broccoli about 4-6 inches below the head. Do not leave a very long stem. Remove large leaves from the stem. Cut cabbages closely below the head. Remove large outer leaves, but do not peel off too many leaves or the cabbage will spoil more quickly.',
        images: ''
    },
    {
        content_info_id: 365,
        lesson_content_id: 33,
        label: 'Roots and Tubers',
        description: 'Beets Carrots Potatoes Sweet Potatoes Radishes Turnips',
        images: ''
    },
    {
        content_info_id: 366,
        lesson_content_id: 33,
        label: 'When to Harvest/Maturity Guidelines:',
        description: 'Harvest carrots based on the particular variety’s size guidelines (read the seed packet), usually when they are 5-10 inches long and about 1 inch wide. Lift the soil to loosen the carrots to pull them up with greens attached. Potatoes are usually harvested in the fall when the tops die and turn brown. Some potatoes, however, are harvested when they are small, about the size of a golf ball, and before the plant flowers. These are called ‘new’ potatoes. Sweet potatoes should be harvested in the fall before the first freeze. Radishes can be harvested when they are between 3/4 and 1 1/4 inches across. The radish should be crisp and the skin should not be cracked or split. Do not allow to grow too large or it may become hollow or “pithy” inside. Storage Turnips should be harvested when they are more than 1inch across. For young turnips (salad turnips or Hakurei variety), harvest beginning when turnips are the size of a small radish up to 1 inch across. Leave the stems and edible leaves attached to the turnip. Harvesting and Post-Harvest Handling Instructions: • Be careful not to slice root crops if you use a shovel or fork to loosen the soil. Carrots and radishes should be sprayed with a hose or rinsed to remove all dirt then tied into bunches with twist ties. Turnips and beets can be sold with or without their edible tops. If you are leaving the tops on, remove yellow or damaged leaves. Rinse or spray with a hose to remove dirt, then tie into bunches with twist ties. You may want to sell the bunched top greens separately. Potatoes should be harvested and left in a cool, dry place for several days to cure. After they are cured, you can brush or wash off the dirt. Potatoes store best when not pre-washed. Sweet potatoes should be harvested and left in a warm, humid place for a few days to cure. After they are cured, you can brush or wash off the dirt.',
        images: ''
    },
    //M2; L4; C3 info
    {
        content_info_id: 367,
        lesson_content_id: 34,
        label: 'Introduction',
        description: 'Practices that are critical to managing produce safety and quality during production, harvesting and postharvest handling are identified for the crop grown. Appropriate maturity indices should be the bases in determining the harvest time. Appropriate harvesting technique should be employed in harvesting to optimize the quality and other desired characteristics of produce during harvest or postharvest phases. Harvesting time should be done in accordance to commodity requirements. Harvesting under the rain should be avoided. Fresh fruits and vegetables that are unfit for human consumption should be segregated during harvesting. Those which cannot be made safe by further processing should be disposed properly to avoid contamination of the uncontaminated produce. Containers used for harvesting should be suitable and clean before use. Liners are preferably used to protect the produce, particularly when containers have rough surfaces. 4.7.6 If the containers are recycled, these should be properly cleaned or discarded accordingly if found unfit for use.',
        images: ''
    },
    {
        content_info_id: 368,
        lesson_content_id: 34,
        label: '',
        description: 'Harvested produce should not be placed in direct contact with the soil or floor in the handling, packing or storage areas. Packaging 4.7.8 Produce should be graded and packed according to market requirements. 4.7.9 When packing of fresh fruits and vegetables is done in the field, contaminated containers or bins exposed to the sources of contaminants (i.e. manure) should be avoided. 4.7.10 Protective materials should be used whenever appropriate to protect the produce from rough surfaces of containers and exposure to sunlight leading to excessive moisture loss.',
        images: ''
    },
    //M2; L4; C4 info
    {
        content_info_id: 369,
        lesson_content_id: 35,
        label: 'Introduction',
        description: 'Having the right set of tools sometimes makes the difference between an enjoyable interlude in the garden or orchard and sweaty hours of backbreaking labor. The proper tools make bringing in the harvest easier, faster and simply more fun. Here are some items to consider to help you get the job done.',
        images: ''
    },
    {
        content_info_id: 370,
        lesson_content_id: 35,
        label: 'Garden Scissors',
        description: 'If you, like me, harvest your own herbs, garden scissors could be your new best friend. Also known as flower shears, most garden scissors feature narrow, sharply pointed anvil blades that make snipping between tight stems a breeze. Things to look for include comfortable handles (soft plastics are especially easy on the hands) and durable, stay-sharp stainless-steel blades. Joyce Chen Unlimited Garden Scissors are typical of this breed. They feature soft-grip handles; tapered points for precision cutting; and finely honed blades of chrome molybdenum stainless steel. Their design makes them ideal for either right- or left-handed use and many retail outlets stock them. Fiskars markets a slightly different, but-just-as-efficient, design. Fiskars Garden Shears have extra-sharp, serrated, hardened stainless steel blades that grip and hold plant material for clean cuts; comfortable, ergo-dynamic handles; and come with a lifetime warranty!',
        images: ''
    },
    {
        content_info_id: 371,
        lesson_content_id: 35,
        label: 'Digging Tools',
        description: 'You’ll never appreciate a precision digging tool more than you do at harvest time—especially the classic Spear and Jackson County Trowel for hand-digging bulbs and roots. Skillfully crafted, perfectly balanced and ruggedly dependable, this heirloom-quality trowel has a carbon-steel head and a weatherproofed, hardwood handle for greater durability. I once dug a large garden plot of potatoes with a pitchfork—never again! The right tool for the right job, I say after that ordeal—and that tool is a proper digging fork. Spear and Jackson make especially fine ones; their Neverbend Professional Potato Fork has extra-wide, forged carbon-steel tines specifically designed for lifting potatoes. Its entire head is epoxy-coated for improved resistance to rust and scratches; a traditional hardwood shaft completes this pretty picture.',
        images: ''
    },
    {
        content_info_id: 372,
        lesson_content_id: 35,
        label: 'Garden Carry-all',
        description: 'You can carry goodies in from the garden and orchard in less picturesque containers, but why? Patterned after traditional New England clam baskets, Pike’s Original Maine Garden Hods, manufactured by Maine Garden Products, are a cut way above a bucket or sack. Pike’s carry-alls are crafted of pine and steam-bent oak, with birch side rods and a food-grade, PVC-coated wire mesh body that makes it easy to rinse your crops right in the hod. They come in two handy sizes, the 16-quart Original Hod and the 8-quart L’il Hod in logo-branded, plain and painted models.',
        images: ''
    },
    {
        content_info_id: 373,
        lesson_content_id: 35,
        label: 'Scythe',
        description: 'If you’d like to hand-harvest hay for your goats, horses or rabbits, here is your tool. According to  Scythe Supply—one of America’s leading authorities on European-style scythes—you can easily scythe enough grass over the summer to put up hay for eight to 10 goats. The trick is buying a quality scythe and learning to maintain and use it. They say the scythe isn’t that difficult to master and their informative website (www.scythesupply.com) is loaded with resources to teach you how to do it.',
        images: ''
    },
    {
        content_info_id: 374,
        lesson_content_id: 35,
        label: 'Nut and Dropped-fruit Harvester',
        description: 'If you’ve ever wanted to harvest dropped fruit or nuts that litter your yard each fall, but dread hours of bending over to pick them up, the Nut Wizard is the tool for you. The Nut Wizard, originally invented for harvesting pecans and walnuts, is a revolving, spring-wire cage on a handle. Capable of picking up most any object between 3/8-inch and 4 inches in diameter, the 41⁄2-foot-long, 3- to 5-pound tool (depending on the size) requires very little pressure to operate and comes in three sizes, the  better to handle the precise sorts of dropped nuts and fruits in your own yard.',
        images: ''
    },
    {
        content_info_id: 376,
        lesson_content_id: 35,
        label: 'Fruit Pickers',
        description: 'An innovative design is the Twister Picker, a lightweight (8 ounces), aluminum-and-plastic picker tool designed to be mounted on a pole, such as a standard broom handle. To use it, the operator clamps the aluminum fruit holders on a single piece of fruit and twists it off by rotating the pole in her hands. Fruit is picked undamaged with this device and it almost makes fruit picking fun! Ames’ lightweight, basket-style Fruit Picker’s bent-wire fingers are designed to coax apples, oranges, plums, peaches, avocadoes and more from trees. Its picker head comes fitted with a two-piece, wooden handle; Ames applies an enamel finish to protect the picker’s wire basket from rust and corrosion, and adds a foam pad inside the basket to minimize bruising of valuable fruit. The German company, Wolf-Garten, is known for its quality tools, among them the Wolf-Garten RG-M Fruit Picker. Its adjustable picker head’s strong, nylon fingers grip each fruit without bruising it; then a concealed cutting blade near the front of the basket cuts it off the tree; finally it tumbles into the unit’s soft, four-apple capacity canvas bag. The picker head is used with the buyer’s choice of Wolf-Garten interchangeable Interlocken System expandable handles, sold separately; Wolf-Garten has over 50 different attachments that work with the Interlocken System.',
        images: ''
    },
    {
        content_info_id: 377,
        lesson_content_id: 35,
        label: 'Orchard Ladders',
        description: 'Orchard ladders come in several designs, including four-legged, double-step ladders, straight ladders designed to lean against a tree and the créme de la créme of orchard ladders: the three-legged, traditional tripod orchard ladder. Which-ever you choose, opt for a sturdy, lightweight, tempered aluminum ladder with each step braced for maximum security and one tall enough to do the job you have in mind (you must never stand above the third rung from the top of an orchard ladder, so plan accordingly). Keep in mind that tripod ladders are designed for use on soil or grassy surfaces only, so don’t choose this style to use for any type of indoor application. Ladder King manufactures a full line of  aluminum orchard ladders, including the Ladder King 1400 Series Double Step Ladders designed for two-person use in 3- to 10-foot heights. Three-inch-wide steps with raised ribbing to prevent slippage; heavy-duty bracing to minimize twisting; strong spreader hinges to hold the  ladder steady during use; and sure-grip rubber feet are all features of the line. Tallman, a manufacturer of orchard ladders, features a  tripod orchard ladder safety video at www.tallmanladders.com Tallman’s elegant tripod ladders come in 4- to 16-foot lengths with slip-resistant steps and rigid steel hinges for strength and durability.',
        images: ''
    },
    {
        content_info_id: 378,
        lesson_content_id: 35,
        label: 'Garden Carts',
        description: 'I’ve saved my most indispensable harvest tool for last: a sturdy, easy-to-push- (or pull) and-maneuver garden cart. I simply couldn’t farm without one. There are scores of styles ideal for every need.',
        images: ''
    },
    {
        content_info_id: 379,
        lesson_content_id: 35,
        label: 'When choosing a garden cart, remember these points:',
        description: 'Some carts push and maneuver infinitely easier than others; it’s always best to try before you buy. The more you plan to use your cart, the  sturdier it must be. If you’ll need to maneuver the cart through a doorway or gate, measure to make certain it will fit. Combination wood and metal carts require indoor storage; metal or plastics usually weather well. Carts with pneumatic tires generally push easiest, but flat-free, solid tires are better for jobs like harvesting walnuts in the woods.',
        images: ''
    },
    //M2; L4; C5 info
    {
        content_info_id: 380,
        lesson_content_id: 57,
        label: 'Introduction',
        description: 'Postharvest handling is the stage of crop production immediately following harvest, including cooling, cleaning, sorting and packing. The instant a crop is removed from the ground, or separated from its parent plant, it begins to deteriorate. Postharvest treatment largely determines final quality, whether a crop is sold for fresh consumption, or used as an ingredient in a processed food product. The most important goals of post-harvest handling are keeping the product cool, to avoid moisture loss and slow down undesirable chemical changes, and avoiding physical damage such as bruising, to delay spoilage.[1] Sanitation is also an important factor, to reduce the possibility of pathogens that could be carried by fresh produce, for example, as residue from contaminated washing water.',
        images: ''
    },
    {
        content_info_id: 381,
        lesson_content_id: 57,
        label: '',
        description: 'After the field, post-harvest processing is usually continued in a packing house. This can be a simple shed, providing shade and running water, or a large-scale, sophisticated, mechanised facility, with conveyor belts, automated sorting and packing stations, walk-in coolers and the like. In mechanised harvesting, processing may also begin as part of the actual harvest process, with initial cleaning and sorting performed by the harvesting machinery. Initial post-harvest storage conditions are critical to maintaining quality. Each crop has an optimum range of storage temperature and humidity. Also, certain crops cannot be effectively stored together, as unwanted chemical interactions can result. Various methods of high-speed cooling, and sophisticated refrigerated and atmosphere-controlled environments, are employed to prolong freshness, particularly in large-scale operations.',
        images: ''
    },
    {
        content_info_id: 382,
        lesson_content_id: 57,
        label: 'Post-harvest shelf life',
        description: 'Once harvested, vegetables and fruits are subject to the active process of degradation. Numerous biochemical processes continuously change the original composition of the crop until it becomes unmarketable. The period during which consumption is considered acceptable is defined as the time of "postharvest shelf life". Postharvest shelf life is typically determined by objective methods that determine the overall appearance, taste, flavor, and texture of the commodity. These methods usually include a combination of sensorial, biochemical, mechanical, and colorimetric (optical) measurements. A recent study attempted (and failed) to discover a biochemical marker and fingerprint methods as indices for freshness.',
        images: ''
    },
    {
        content_info_id: 383,
        lesson_content_id: 57,
        label: 'Post-harvest physiology',
        description: 'Post-harvest physiology is the scientific study of the physiology of living plant tissues after picking. It has direct applications to postharvest handling in establishing the storage and transport conditions that best prolong shelf life. An example of the importance of the field to post-harvest handling is the discovery that ripening of fruit can be delayed, and thus their storage prolonged, by preventing fruit tissue respiration. This insight allowed scientists to bring to bear their knowledge of the fundamental principles and mechanisms of respiration, leading to post-harvest storage techniques such as cold storage, gaseous storage, and waxy skin coatings.',
        images: ''
    },
    {
        content_info_id: 384,
        lesson_content_id: 57,
        label: 'STEPS IN POST HARVEST PRACTICES',
        description: 'Trimming, Washing, Sorting, Weighing, Packaging, Labeling & Delivery',
        images: ''
    },
    {
        content_info_id: 385,
        lesson_content_id: 57,
        label: 'Washing',
        description: 'Fruits and vegetables fresh from the field in a properly equipped dunk tank or hydrocooler can be of tremendous benefit, both in extending the shelf life of the produce and improving its safety to the consumer. If not properly managed, washing produce can amplify a small problem into a big one. There are a few points to consider for proper washing of fresh produce.',
        images: ''
    },
    {
        content_info_id: 386,
        lesson_content_id: 57,
        label: 'Sorting',
        description: 'Is done by hand to remove the fruits and vegetables which are unsuitable to market or storage due to damage by mechanical injuries, insects, diseases, immature, over-mature, misshapen etc. This is usually carried out manually and done before washing. By removing damaged produce from the healthy ones, it reduces losses by preventing secondary contamination. Sorting is done either at farm level or in the pack-houses. In sorting, only sensory quality parameters are taken into consideration.',
        images: ''
    },
    {
        content_info_id: 387,
        lesson_content_id: 57,
        label: 'Weighing & Packaging',
        description: 'Means the wrapping or bottling of products to make them safe from damages during transportation and storage. It keeps a product safe and marketable and helps in identifying, describing, and promoting the product.',
        images: ''
    },
    //M2; L4; C6 info
    {
        content_info_id: 388,
        lesson_content_id: 58,
        label: 'Introduction',
        description: 'There are three sets of basic records that should be kept by the owner of a small fruit and vegetable processing unit: financial records, those that relate to the production of the products and sales records. The uses of these records are inter-related and are described in more detail in Sections 2.3 and 2.7. In this Section, the format of the records and the likely ways in which information will be obtained are summarized. As with all other inputs to a business, keeping records is an investment of time and money and the benefits must outweigh the costs. There is no point in recording information for its own sake and records must be used if they are to have any value. This means that the owner or manager must understand why the information is collected and what it can be used for. Similarly, the time and effort spent in keeping records must be related to the scale and profitability of the business. While it is true that some successful entrepreneurs keep all of the information in their head and do not keep records, no-one else can help run the business during times of illness or absence. Some examples of the value and costs of keeping records are shown below:',
        images: ''
    },
    {
        content_info_id: 389,
        lesson_content_id: 58,
        label: 'Value of record keeping:',
        description: '',
        images: 'assets/module_images/M2/L4/record_keep.png'
    },
    {
        content_info_id: 390,
        lesson_content_id: 58,
        label: 'Costs of record keeping:',
        description: '',
        images: 'assets/module_images/M2/L4/cost_keep.png'
    },
    {
        content_info_id: 391,
        lesson_content_id: 58,
        label: '',
        description: 'Accurate information is essential and this means that staff who are required to collect information should know its value and why it is being collected. This should be part of the induction and training when new staff learn their job. The entrepreneur should employ people who have the skills and aptitude to do the work, but should also put in place a system of checks to ensure that one person does not have responsibility for a whole area of business activity. For example the person responsible for keeping records of purchases should be different from the person who records use of materials or levels of stocks. The owner or manager should also ensure that all records are kept up to date and where appropriate, the arithmetic is checked for accuracy. There is no single correct way to keep records and individual owners should devise systems that suit their way of working. The examples given below have been found to be successful in small food processing enterprises in Africa and Asia.',
        images: ''
    },
    {
        content_info_id: 392,
        lesson_content_id: 58,
        label: 'Financial and sales records',
        description: 'A separate record of the cash that comes into a business and the cash that is used to buy daily items is usefully prepared using a Cash Book (Figure 62). Additionally, when entrepreneurs have a bank account, they will require a Bank Book to record cheques that have been received and paid, using the same headings as those shown in Figure 62.',
        images: 'assets/module_images/M2/L4/cash_book.png'
    },
    {
        content_info_id: 393,
        lesson_content_id: 58,
        label: 'Accounts Receivable and Payable Book',
        description: 'It is important to know how much money the business is owed by debtors at any given time but also how much is owed to creditors. This is particularly important if for example, retailers expect a period of credit before they pay for goods received. The amount of money owed by an enterprise and the amount owing to it can be combined in a single ledger so that a weekly comparison of the difference can be made. Invoices and receipts should be kept together in date order. An example of this type of ledger is an Accounts Receivable and Payable Book (Figure 63).',
        images: 'assets/module_images/M2/L4/pay_book.png'
    },
    {
        content_info_id: 394,
        lesson_content_id: 58,
        label: 'Sales Book',
        description: 'Other books can be used but these are the basic requirement for collecting all financial information needed to prepare monthly profit and loss statements, balance sheets and to check cashflow forecasts. The other information needed to prepare profit and loss statements are records of sales and stock in the storerooms (Figures 64 and 65).',
        images: 'assets/module_images/M2/L4/pay_book.png'
    },
    {
        content_info_id: 395,
        lesson_content_id: 58,
        label: 'Sales Book',
        description: 'Other books can be used but these are the basic requirement for collecting all financial information needed to prepare monthly profit and loss statements, balance sheets and to check cashflow forecasts. The other information needed to prepare profit and loss statements are records of sales and stock in the storerooms (Figures 64 and 65).',
        images: 'assets/module_images/M2/L4/sale_book.png'
    },
    {
        content_info_id: 396,
        lesson_content_id: 58,
        label: 'Stores Keeper Book',
        description: 'Records that are kept by storekeepers show which products and materials are transferred into and out of the store-rooms. The balance is used to indicate when reordering is needed and can also be used to highlight pilferage or other losses that are not accounted for. ',
        images: 'assets/module_images/M2/L4/store_keeper_book.png'
    },
    {
        content_info_id: 397,
        lesson_content_id: 58,
        label: 'Profit and Loss Account',
        description: 'As shown in Figure 66, data from the sales book is totalled to give monthly income. The costs of ingredients, packaging etc., that were used during the month are recorded in the storekeepers book and other expenses are totalled from the cash book and bank book to calculate the monthly Profit and Loss Account. The Profit and Loss Account describes how money comes into and leaves a business over a month (or other suitable period of time). This allows the owner to plot the progress of the business and compare the results to those expected in the Business Plan (Section 2.3.4).',
        images: 'assets/module_images/M2/L4/profit_loss_account.png'
    },
    {
        content_info_id: 398,
        lesson_content_id: 58,
        label: 'Balance Sheet',
        description: 'However, to obtain a snapshot of the performance of the business at a given moment, a balance sheet is a strong management tool which can help to understand where money came from, how it is used in a business and how it could be better used. An example of a balance sheet from a small wine-making business is shown in Figure 67. The balance sheet is therefore a statement about the money in a business at a particular time, which shows how the money is being used (the assets) and where it came from (the liabilities). In the above example, the money that remains in the business as unclaimed profits is a main source of working capital. It is important to note that the owner has already taken a salary from the business and that the remaining profit belongs to the business to be used for reinvestment.',
        images: 'assets/module_images/M2/L4/balance_sheet.png'
    },
    {
        content_info_id: 399,
        lesson_content_id: 58,
        label: 'Production records',
        description: 'The main reasons for production records are to ensure that quality assurance procedures are in place and operating satisfactorily and to record the use of ingredients and amounts of stock for use in financial accounting. When raw materials are processed, each batch should be recorded in an Incoming Materials Test Book (Figure 68). The same layout can be used for recording incoming batches of ingredients and packaging materials, some of which also require inspection on arrival (see Section 2.7.2). Records should also be kept of the amount and type of raw materials and ingredients that are used and the important processing conditions (e.g. drying times, heating times and temperatures etc.) to ensure that operators mix together the same ingredients in every batch and process them in the same way each time (Figure 69).',
        images: ''
    },
    {
        content_info_id: 400,
        lesson_content_id: 58,
        label: 'Incoming Materials Test Book',
        description: '',
        images: 'assets/module_images/M2/L4/materials.png'
    },
    {
        content_info_id: 401,
        lesson_content_id: 58,
        label: 'Process Logbook',
        description: '',
        images: 'assets/module_images/M2/L4/logbook.png'
    },
    //M3; L1; C1 info
    {
        content_info_id: 402,
        lesson_content_id: 36,
        label: 'Introduction',
        description: 'The location of the composting facility is a very important factor in a successful compost operation. To minimize material handling, the composting facility should be located as close as possible to the source of organic waste. If land application is the preferred method of utilization, the facility should also be located with convenient access to the land application sites. Several other important considerations when locating a compost facility are discussed below.',
        images: ''
    },
    {
        content_info_id: 403,
        lesson_content_id: 36,
        label: '1. Wind direction',
        description: 'Improperly managed compost facilities may generate offensive odors until corrective actions are taken. Wind direction and proximity to neighbors should be considered when locating a composting facility.',
        images: ''
    },
    {
        content_info_id: 404,
        lesson_content_id: 36,
        label: '2. Topography',
        description: 'Avoid locating composting facilities on steep slopes where runoff may be a problem and in areas where the composting facility will be subject to inundation.',
        images: ''
    },
    {
        content_info_id: 405,
        lesson_content_id: 36,
        label: '3. Ground water protection',
        description: 'The composting facility should be located downgradient and at a safe distance from any wellhead. A roofed compost facility, that is properly managed, should not generate leachate that could contaminate ground water. If a compost facility is not protected from the weather, it should be sited to minimize the risk to ground water.',
        images: ''
    },
    {
        content_info_id: 406,
        lesson_content_id: 36,
        label: '4. Area requirements',
        description: 'The area requirements for each composting method vary. The windrow method requires the most land area. The static pile method requires less land area than the windrow method, but more than the in-vessel method. The pile dimensions also affect the amount of land area necessary for composting. A large pile that has a low surface area to total volume ratio requires less composting area for a given volume of manure, but it is also harder to manage. The size and type equipment used to mix, load, and turn the compost should also be considered when sizing a compost area. Enough room must be provided in and around the composting facility to operate equipment. In addition, a buffer area around the compost site should be considered if a visual barrier is needed or desired. In general, given the pile dimensions, a compost bulk density of 35 to 45 pounds per cubit feet can be used to estimate the surface area necessary for stacking the initial compost mix. To this area, add the amount of area necessary for equipment operation, pile turning, and buffer.',
        images: ''
    },
    {
        content_info_id: 407,
        lesson_content_id: 36,
        label: '5. Existing areas',
        description: 'To reduce the initial capital cost, existing roofed, concrete, paved, or gravel areas should be used if possible as a composting site.',
        images: ''
    },
    //M3; L1; C2 info
    {
        content_info_id: 408,
        lesson_content_id: 37,
        label: 'Introduction',
        description: 'A composting facility is a structure or device that uses controlled aerobic decomposition to transform waste organic material into a biologically stable product that can be used as a soil amendment. Layout determines how efficiently material is handled and can significantly impact the quality of the end products. A good layout minimizes material handling and helps control outside factors, like moisture, that can impact maturing and cause odors. And while the overview of how a composting facility is constructed can seem pretty basic, it’s the little details that matter.',
        images: 'assets/module_images/M3/L1/site.png'
    },
    {
        content_info_id: 409,
        lesson_content_id: 37,
        label: '1: Drop-off Area',
        description: 'How and where incoming organic waste is accepted is a critical detail. Because composting facilities typically charge tip fees, the first thought is how to make tipping more convenient for people to dump and leave. So they put the drop-off area just beyond the weigh station. And if the site has a retail yard to sell compost and/or mulch, it also wants to have that area near the entrance of the facility. Having both raw feedstocks and finished products up front requires a lot of movement, and extra time spent moving material can have a significant impact on fixed operating expenses, reducing profit margins. The more efficient place to accept incoming material is closer to the grinding area, so as it’s processed, it can gradually move toward the front and be ready for retail. Controlling the flow from where the material is received can significantly reduce the number of times it’s moved with loaders, helping to save on equipment costs, fuel and labor. The other advantage of having the drop-off area away from the front of the facility is to reduce the possibility of incoming material accidentally getting mixed in with finished material waiting to be sold.',
        images: ''
    },
    {
        content_info_id: 410,
        lesson_content_id: 37,
        label: '2: Incoming Material and Grinding Area',
        description: 'Separate from the drop-off area, but right alongside it, is where stacked raw material is staged to be run through a grinder. Only trained employees should have access to this area of the operation. What is important at Stop #2 is material flow and efficient handling. Grinding is one of the highest cost functions of any operation so it’s essential to fully use the grinder throughput potential. Materials should be able to be pushed from the drop-off area to the grinder, and the discharge should be pointed in the direction of the composting area.',
        images: ''
    },
    {
        content_info_id: 411,
        lesson_content_id: 37,
        label: '3: Composting Area',
        description: 'In the composting area, look at operations from the ground up, starting with the base and then looking at how the area drains storm water runoff. A dirt pad may be the most economical option, but it’s not going to be the most efficient or create a higher quality compost. For example, when dealing with wet material, like food waste, mulch and rain, dirt pads can quickly get sloppy and potentially give off an odor. Concrete or asphalt pads often offer the best surface for quality compost production. Another critical detail is to optimize drainage in the composting area by having a slope so there are places for water to go after a heavy rain, for example. To keep water from becoming trapped between compost rows, windrows should run parallel with the slope of the pad. Spacing of windrows should be kept to a minimum to help maximize usage of the composting pad.',
        images: ''
    },
    {
        content_info_id: 412,
        lesson_content_id: 37,
        label: '4: Screening and Finishing Area',
        description: 'Finished product screening should be positioned between the composting area and retail space to help minimize the material handling involved. Position trommel screen so overs are coming off the conveyor near the composting side of the yard and fines are near the retail space. Simple steps like this help reduce cross contamination of material, which in turn results in a higher quality end product.',
        images: ''
    },
    {
        content_info_id: 413,
        lesson_content_id: 37,
        label: '5: Retail Area',
        description: 'Setup and layout of the retail space depends on the customer base. If you’re selling in bulk, piles are okay. If products are being bagged, position bulk material as close as possible to help minimize cycle times. Barriers should be put in place to minimize contaminates, like plastic and paper, from blowing into the retail area. Drainage and coverage should also be considered to keep materials dry and to maintain good quality.',
        images: ''
    },
    {
        content_info_id: 414,
        lesson_content_id: 37,
        label: '6: Drainage Pond and Perimeter',
        description: 'Constructing a series of drainage ponds on the low side of the property near the composting rows serves to catch runoff and clean it. The first pond collects runoff while each additional pond helps slow the flow and give sediments a chance to separate. These ponds are also a good resource when the compost’s moisture levels are low. Running a pump and sprinkler is a cost-effective way to bring moisture content back to optimal levels. Establishing a barrier of trees or fencing to catch light plastic contaminates can be a good idea and is often required by state and local officials. Fencing is almost always required, but trees can offer an additional barrier of protection. As your operation grows and evolves, the site layout and flow of material needs to be questioned and changes will likely be necessary. Operating on the basis of continuous improvement will guide you to a more efficient composting facility layout.',
        images: ''
    },
    //M3; L1; C3 info
    {
        content_info_id: 415,
        lesson_content_id: 38,
        label: 'Introduction',
        description: 'Composting is a straight forward process that can be accomplished by anyone with a small patch of outdoor space. Composting allows you to divert your kitchen scraps and yard waste from a landfill, instead of turning them into a rich soil amendment. You only need a few tools, a little bit of time, and some basic information to begin composting and ensure the success of your setup. This guide will help you to create a compost bed (or compost "pile") from scratch and maintain it properly.',
        images: ''
    },
    {
        content_info_id: 416,
        lesson_content_id: 38,
        label: 'Method of compost preparation',
        description: '1. Choose a spot that is at least partially protected from rain. 2. Gather the crop residues, animal manures and other wastes and bring them to the preparation site. 3. Pile the crop and other plant residues (15 cm thick) first. For the next layer, spread the animal manure to a thickness of about 8 cm, followed by about 3 cm of good soil. Pile another layer of the materials in the same sequence and repeat until a height of about 1.5 meters of the compost pile is attained. 4. Water the pile until it is sufficiently moist. Water regularly. 5. Turn over or mix the pile with spading fork after 3 weeks, then again after five weeks. 6. Harvest the compost in three to four months.',
        images: 'assets/module_images/M3/L1/site.jpg',
    },
    {
        content_info_id: 417,
        lesson_content_id: 38,
        label: 'The 14-day method of composting',
        description: '1. Chop the vegetative materials/plant wastes (dry or green or both). 2. Thoroughly mix these with an equal amount of fresh manure. 3. Pile the mixture into a heap measuring at least 1 m × 1 m × 1 m. (However, 1 m is the maximum height.) 4. Cover the heap with banana leaves or damaged burlap sacks. 5. By the third or fourth day, the inside of the heap should be heated up. If not, mix more manure into it. 6. On the same day (3rd or 4th), turn the heap inside out so that the materials from the center will appear outside and vice versa. 7. Turn the heap every two days thereafter. 8. In 14 - 18 days, the compost should be ready for use.',
        images: 'assets/module_images/M3/L1/site_prep.png',
    },
    {
        content_info_id: 418,
        lesson_content_id: 38,
        label: 'Composting in triple-compost bin',
        description: 'Making three compartments permits us to keep adding to our compost pile. The compartment at left is ready for the fields while the others are still rotting. 1. Fill compartment one with composting materials. 2. Add a small amount of soil or animal manure. 3. Continue in this way till the compartment is full. 4. After a month, empty the contents of compartment one into compartment two, mixing, watering and breaking up the compost in the process 5. Cover the second compartment with a layer of soil, which has to be kept humid and loose. 6. Once compartment one is empty, the process of filling it should begin again as before. 7. After another month, fill compartment three with the contents of compartment two, airing the contents well without turning over. 8. Cover the third compartment with a layer of soil. 9. Fill compartment two with the contents of compartment one and cover with soil. 10. Fill compartment one with refuse and the cycle goes on.',
        images: 'assets/module_images/M3/L1/triple_compost.png',
    },
    {
        content_info_id: 419,
        lesson_content_id: 38,
        label: 'Deep bed composting',
        description: '',
        images: 'assets/module_images/M3/L1/deep_bed.png',
    },
    {
        content_info_id: 420,
        lesson_content_id: 38,
        label: 'Cross-section of Composting Bed',
        description: 'Lay out garden beds at least 12 cm wide. Dig trench 8 cm wide and 5 cm deep along center line of bed. Place spoil (dirt from trench) on both sides of trench.',
        images: 'assets/module_images/M3/L1/cross_section.png',
    },
    {
        content_info_id: 421,
        lesson_content_id: 38,
        label: 'Bed Construction',
        description: '',
        images: 'assets/module_images/M3/L1/bed_construct.png',
    },
    {
        content_info_id: 422,
        lesson_content_id: 38,
        label: 'Addition of Organic Materials',
        description: 'Place 15 - 30 cm layer of leguminous leaves and other vegetative materials. Spread layer of animal wastes over vegetative materials. Cover with layer of soil. Use ½ of spoil pile alongside of trench. Pile another layer of the materials in the same sequence, returning all of spoils in or on trench. Shape bed by raking.',
        images: '',
    },
    {
        content_info_id: 423,
        lesson_content_id: 38,
        label: 'Planting',
        description: 'Soak bed thoroughly with water. Plant seeds or transplant seedlings around the trench. After harvesting, remove the contents of the trench and work the compost into the soil around the trench. Place new compost materials in the trench for the next crop.',
        images: '',
    },
    {
        content_info_id: 424,
        lesson_content_id: 38,
        label: 'Semi-sunken composting',
        description: '1. Clean the area selected for building the compost pile. Dig a hole one-half meter deep.',
        images: 'assets/module_images/M3/L1/sunken.png',
    },
    {
        content_info_id: 425,
        lesson_content_id: 38,
        label: 'Clean the area',
        description: '2. Cut composting materials into small pieces. Mix them with manure at 5:1 ratio.',
        images: 'assets/module_images/M3/L1/clean.png',
    },
    {
        content_info_id: 426,
        lesson_content_id: 38,
        label: 'Cut composting materials into small pieces',
        description: '3. Place the mixture in the hole until it reaches one to two meters above the ground. Use a shovel or your hands to keep the edges square.',
        images: 'assets/module_images/M3/L1/cut.png',
    },
    {
        content_info_id: 427,
        lesson_content_id: 38,
        label: 'Place the mixture in the hole',
        description: '4. Cover the pile with straw or smear it with mud to protect it. Add a layer of soil on top of the pile and make a series of holes on top of the finished pile. The compost should be ready is 1 to 2 months.',
        images: 'assets/module_images/M3/L1/place_mixture.png',
    },
    {
        content_info_id: 428,
        lesson_content_id: 38,
        label: 'Basket composting',
        description: 'Basket composting is the process by which decomposable home garbage, garden and farm waste and leguminous leaves are allowed to rot in baskets half-buried in garden plots as a method of producing organic fertilizer.',
        images: '',
    },
    {
        content_info_id: 429,
        lesson_content_id: 38,
        label: 'Benefits',
        description: '1. Basket compost can be used immediately without waiting for the usual 34 month period as is necessary in other methods of composting. 2. Baskets hold the composting materials in place, hence minimizing nutrient depletion by runoff. 3. Stray animals and fowls are prevented from scattering the compost materials. 4. Since garbage and wastes are collected and utilized, home and surroundings will become cleaner. 5. It serves as reservoir and collector of the moisture and nutrients. 6. More nutritious vegetables can be produced at less cost.',
        images: '',
    },
    {
        content_info_id: 430,
        lesson_content_id: 38,
        label: 'Preparation of Materials',
        description: 'Long bamboo strips, 2-3 cm in width. Bamboo stakes at least 30 cm in length. Home organic garbage, farm and garden wastes, leguminous leaves. Manure.',
        images: 'assets/module_images/M3/L1/prep_materials.png',
    },
    {
        content_info_id: 431,
        lesson_content_id: 38,
        label: 'Preparation of Garden Plots',
        description: 'Clean garden site, save weeds and grasses for composting. Dig at least 30 cm deep and raise the bed. Dig holes along the center of the plots at least 15 cm in depth and 30 cm in diameter. Space them 1 m apart.',
        images: '',
    },
    {
        content_info_id: 432,
        lesson_content_id: 38,
        label: 'Construction of Baskets',
        description: 'Drive 7 stakes around the holes; uneven number of stakes (5, 7 or 9) makes perfect brace for weaving. Weave the long strips of bamboo around the stakes to form a basket. Without bamboo strips, closely space the stakes (about 1 cm apart).',
        images: 'assets/module_images/M3/L1/basket_construct.png',
    },
    {
        content_info_id: 433,
        lesson_content_id: 38,
        label: 'Addition of Organic Wastes',
        description: 'Place the most decomposed garbage and manure into the basket first. Place the undecomposed materials like leguminous leaves, grasses and weeds next. Fill to the brim with other organic wastes. Earthworms maybe added to speed up decomposition.',
        images: 'assets/module_images/M3/L1/organic_waste.png',
    },
    {
        content_info_id: 434,
        lesson_content_id: 38,
        label: 'Planting and Care and Maintenance',
        description: 'Plant seeds or transplant seedlings around the basket. The distance from the basket should be 15 - 20 cm to prevent the decomposing materials from "burning" the plants. Water the seedlings while young. Eventually just water the basket. The plant roots will later move toward it.',
        images: 'assets/module_images/M3/L1/plant_maintenance.png',
    },
    {
        content_info_id: 435,
        lesson_content_id: 38,
        label: 'Incorporation of Decomposed Materials into the Soil',
        description: 'After harvesting, composts are already used up. Remove the decomposed materials from the basket and incorporate them into the soil while cultivating. Add new composting materials to the basket for the next plants.',
        images: 'assets/module_images/M3/L1/decompost_incorporate.png',
    },
    // M3; L1; C4 info
    {
        content_info_id: 436,
        lesson_content_id: 39,
        label: 'Introduction ',
        description: 'Composting is a great way to use the things in your refrigerator that are a little past their prime, which helps reduce food waste. You can also compost certain kinds of yard waste rather than send them to the dump. Collect these materials to start off your compost pile right:',
        images: '',
    },
    {
        content_info_id: 437,
        lesson_content_id: 39,
        label: 'Step on gathering the materials',
        description: '',
        images: '',
    },
    {
        content_info_id: 438,
        lesson_content_id: 39,
        label: 'Step 1: Combine Green and Brown Materials',
        description: 'To make your own hot-compost heap, wait until you have enough materials to make a pile at least 3 feet deep. You are going to want to combine your wet, green items with your dry, brown items. "Brown" materials include dried plant materials; fallen leaves; shredded tree branches, cardboard, or newspaper; hay or straw; and wood shavings, which add carbon. "Green" materials include kitchen scraps and coffee grounds, animal manures (not from dogs or cats), and fresh plant and grass trimmings, which add nitrogen. For best results, start building your compost pile by mixing three parts brown with one part green materials.  If your compost pile looks too wet and smells, add more brown items or aerate more often. If you see it looks extremely brown and dry, add green items and water to make it slightly moist.',
        images: '',
    },
    {
        content_info_id: 439,
        lesson_content_id: 39,
        label: 'Step 2: Water Your Pile',
        description: 'Sprinkle water over the pile regularly so it has the consistency of a damp sponge. Do not add too much water, otherwise, the microorganisms in your pile will become waterlogged and drown. If this happens, your pile will rot instead of compost.',
        images: '',
    },
    {
        content_info_id: 440,
        lesson_content_id: 39,
        label: 'Step 3: Stir Up Your Pile',
        description: 'During the growing season, you should provide the pile with oxygen by turning it once a week with a garden fork. The best time to turn the compost is when the center of the pile feels warm or when a thermometer reads between 130 and 150°F. Stirring up the pile will help it cook faster and prevents material from becoming matted down and developing an odor. At this point, the layers have served their purpose of creating equal amounts of green and brown materials throughout the pile, so stir thoroughly.',
        images: '',
    },
    {
        content_info_id: 441,
        lesson_content_id: 39,
        label: 'Step 4: Feed Your Garden',
        description: 'When the compost no longer gives off heat and becomes dry, brown, and crumbly, it is fully cooked and ready to feed to the garden. Add about 4 to 6 inches of compost to your flower beds and into your pots at the beginning of each planting season. Some gardeners make what is known as compost tea with finished compost. This involves allowing fully formed compost to "steep" in water for several days, then straining it to use as a homemade liquid fertilizer. Every gardener is different, so it is up to you to decide which composting method best fits your lifestyle. Fortunately, no matter which route you choose, compost is incredibly easy to make and environmentally friendly. Plus, its a treat for your garden. With just a few kitchen scraps and some patience, you all have the happiest garden possible.',
        images: '',
    },
    // M3; L1; C5 info
    {
        content_info_id: 442,
        lesson_content_id: 40,
        label: 'Introduction',
        description: 'Some carbonaceous organic materials such as rice straw, corn stalk, rice hull, and sawdust are very useful in improving the physical and biological properties of soil, but they are very slow in releasing nutrients like nitrogen, phosphorus, and potassium.',
        images: '',
    },
    {
        content_info_id: 443,
        lesson_content_id: 40,
        label: 'Crop residues',
        description: 'Rice straw, rice hull, and other straws of graminaceous crops with abundant fibrous materials usually have a high C: N ratio, with a low nitrogen content but fairly high potassium and silica Potassium and silica help improve the resistance of crops to disease and lodging, and fibrous materials provide an energy source for soil microorganisms as well as improve and condition soil physical properties. Crop residues are used as mulches to cover the surface of the soil and help maintain favorable soil moisture content and temperature as well as prevent the accumulation of salts or the multiplication of weeds on the soil surface. These materials can well be combined with swine or poultry manure that has a high nitrogen content to make better compost for crops (Lin et al.)',
        images: '',
    },
    {
        content_info_id: 444,
        lesson_content_id: 40,
        label: 'Green Manure',
        description: 'Leguminous green manure crops are an important source of natural nitrogen. They fix nitrogen from the air and at flowering stage are usually incorporated into the soil, about ten days before planting the main crop. In extensively cropped areas, green manure crops are of great value to farmers since they reduce fertilizer costs. In intensively cropped areas, they may compete with the main crop for land. These green manure crops that have low C: N ratio (lower than 20 at vegetative stage) can be considered primary sources of nitrogen.',
        images: '',
    },
    {
        content_info_id: 445,
        lesson_content_id: 40,
        label: 'Animal Manure (Cattle, Goat, Swine, Chicken)',
        description: 'The nutrient content of swine manure is slightly higher than that of cattle manure, but with a higher copper content and lower content of fibrous material, discouraging repeated, long-term applications of this manure. It is best to dilute this manure by mixing it with rice hull, sawdust, rice straw, and similar fibrous materials and fermenting it before use. The nutrient content of chicken manure is much higher than that of swine manure However, its higher content of zinc and antibiotics and lower content of fibrous material discourage direct applications of fresh poultry manure to the soil. The best way to utilize this manure is to mix it with cattle and swine manure, rice straw, rice hull, sawdust, and other fibrous materials, and ferment it thoroughly before use.',
        images: '',
    },
    {
        content_info_id: 446,
        lesson_content_id: 40,
        label: 'Cattle manure',
        description: 'Has a reasonably high content of nitrogen, potassium, and fibrous materials. It is good animal manure because it does not have heavy metals and antibiotics in it Repeated applications of this manure to the soil can be recommended, but phosphorus should be supplied from other sources to make up for its shortage in this manure. Nutrient content of goat manure is slightly higher than that of cattle manure.',
        images: '',
    },
    {
        content_info_id: 447,
        lesson_content_id: 40,
        label: 'Residues from oil extraction',
        description: 'Compost consists mainly of sawdust and added with materials such as limestone and rice bran. Used mushroom compost has low potassium content as a result of leaching losses during mushroom culture, but the phosphorus, calcium, and C: N ratio and organic matter contents remain high and also, used mushroom compost has a high fibrous material content which improves soil physical properties and biological activity. However, the remnant mycelia in these materials may sometimes have a harmful effect on the roots of some crops. Therefore, it is recommended that used mushroom compost should be combined with a proper amount of high-nitrogen manure such as swine or poultry manure or oil extraction residues and be well fermented to kill the mycelia, before applying to the soil.',
        images: '',
    },
    {
        content_info_id: 448,
        lesson_content_id: 40,
        label: 'Residues from processing animal Product',
        description: 'The nutrient contents of animal residues differ greatly according to the type of residue. Animal blood, meat, horn, feet, wool, and feathers can all be used as a source of nitrogen fertilizer since they all have very high nitrogen content. Oyster shell and eggshell are good sources of calcium and bone meal can be a good source of phosphorus. However, all of them are very low in potassium. Fur should not be used in composting because of its high chromium content that can easily accumulate in the soil, causing toxicity in crops.',
        images: '',
    },
    // M3; L2; C1 info
    {
        content_info_id: 449,
        lesson_content_id: 41,
        label: 'Composting Method',
        description: 'Transforms raw organic residues into humus-like material through the activity of soil microorganisms. Mature compost stores well and is biologically stable, free of unpleasant odors, and easier to handle and less bulky than raw organic wastes. In agronomic and horticultural operations, compost can be used as a soil amendment, seed starter, mulch, container mix ingredient, or natural fertilizer, depending on its characteristics. Composting can also reduce or eliminate weed seeds and plant pathogens in organic residues.',
        images: '',
    },
    {
        content_info_id: 450,
        lesson_content_id: 41,
        label: '1. Sheet Composting',
        description: '“Sheet Composting, is also known as sheet mulching, can be a great way to add organic matter back into your soils. Essentially, this composting technique entails spreading thin layers of organic materials. (i. e. compost ingredients) on top of the soil surface. Some also consider this technique to be “composting in place.” Using green manure is another means of sheets composting. This technique is often used on the large scale; however, it can also be done successfully in your backyard”.',
        images: '',
    },
    {
        content_info_id: 451,
        lesson_content_id: 41,
        label: '2. In – Vessel Composting',
        description: '“In – vessel composting is becoming more and more popular with large – scale compost producers. This method involves composting within an enclosed containment system, often a large cylindrical – shape container. The equipment involved in setting up an in – vessel composting system is typically quite expensive, and therefore usually limits it’s usage to industrial – sized composting operation. There are numerous benefits of in-vessel composting, such as an increased processing speed, year – round composting, and a highly controlled environment.',
        images: '',
    },
    {
        content_info_id: 452,
        lesson_content_id: 41,
        label: '3. Anaerobic Composting',
        description: '“Anaerobic composting describes the biological breakdown of organic materials by living anaerobic organisms. This may not be the most odor- rific composting method, but it can be quite effective. Some of the benefits of composting anaerobically include the following: it is one of the most basic means of producing compost; it can be done on a small scale; and typically produces more humus per unit of starting materials than most other composting methods.”',
        images: '',
    },
    {
        content_info_id: 453,
        lesson_content_id: 41,
        label: '4. Trench Composting',
        description: '“Trench composting involves digging holes in your garden soil and burying raw compost ingredients. Some people swear by this method, whereas others want nothing to do with it. Similar to anaerobic composting, this method of 6 decomposition is quite simple; however, the materials tend to take longer to breakdown than when using other composting techniques.”',
        images: '',
    },
    {
        content_info_id: 454,
        lesson_content_id: 41,
        label: '5. Bokashi Composting',
        description: '“Bokashi is a Japanese term meaning fermented organic matter. Therefore, bokashi composting describes the making of compost via fermentation. To achieve optimal results, your compost materials are inoculated with a microbial starter culture, and placed inside a sealed container. These starter cultures consist of several different species of microorganisms, all of which thrive in anaerobic conditions. One of the most popular microbial inoculants is called Effective Microorganisms of EM.”',
        images: '',
    },
    {
        content_info_id: 455,
        lesson_content_id: 41,
        label: '6. Composting Barrels',
        description: '“Composting Barrels, or compost tumblers, are a great composting technique for backyard growers. They are self – contained, clean, and if big enough, can produce a fair amount of compost in a short period.” “You can buy composting barrels from a commercial supplier or you save your money and make one yourself.”',
        images: '',
    },
    {
        content_info_id: 456,
        lesson_content_id: 41,
        label: '7. Vermicomposting',
        description: 'Composting is the process of converting organic materials like leaves and animal manure into “humus” an organic matter through decomposition by the action of microbes and other organisms. Humus is rich in nutrients and contributes to soil texture and water retention.',
        images: '',
    },
    // M3; L2; C2 info
    {
        content_info_id: 457,
        lesson_content_id: 42,
        label: 'Introduction',
        description: 'Composting is an aerobic method (meaning it requires air) of decomposing organic solid wastes. It can therefore be used to recycle organic material. The process involves decomposing organic material into a humus-like material, known as compost, which is a good fertilizer for plants. Composting organisms require four equally important ingredients to work effectively:',
        images: '',
    },
    {
        content_info_id: 458,
        lesson_content_id: 42,
        label: 'Carbon',
        description: 'For energy; the microbial oxidation of carbon produces the heat required for other parts of the composting process.] High carbon materials tend to be brown and dry.',
        images: '',
    },
    {
        content_info_id: 459,
        lesson_content_id: 42,
        label: 'Nitrogen ',
        description: 'To grow and reproduce more organisms to oxidize the carbon. High nitrogen materials tend to be green and wet. They can also include colorful fruits and vegetables.',
        images: '',
    },
    {
        content_info_id: 460,
        lesson_content_id: 42,
        label: 'Oxygen',
        description: 'For oxidizing the carbon, the decomposition process.  Aerobic bacteria needs oxygen levels >5% to perform the processes needed for composting.',
        images: '',
    },
    {
        content_info_id: 461,
        lesson_content_id: 42,
        label: 'Water',
        description: 'In the right amounts to maintain activity without causing anaerobic conditions.',
        images: '',
    },
    {
        content_info_id: 462,
        lesson_content_id: 42,
        label: '',
        description: 'Certain ratios of these materials will allow microorganisms to work at a rate that will heat up the compost pile. Active management of the pile (e.g., turning) is needed to maintain sufficient oxygen and the right moisture level. The air/water balance is critical to maintaining high temperatures 130–160 °F (54–71 °C) until the materials are broken down. Composting is most efficient with a carbon: nitrogen ratio of about 25:1. Hot container composting focuses on retaining heat in order to increase the decomposition rate thus producing compost more quickly. Rapid composting is favored by having a carbon: nitrogen ratio of ~30 or less. Above 30 the substrate is nitrogen starved. Below 15 it is likely to outgas a portion of nitrogen as ammonia. Nearly all dead plant and animal materials have both carbon and nitrogen in different amounts. Fresh grass clippings have an average ratio of about 15:1 and dry autumn leaves about 50:1 depending upon species. Composting is an ongoing and dynamic process, adding new sources of carbon and nitrogen consistently as well as active management is important.',
        images: '',
    },
    {
        content_info_id: 463,
        lesson_content_id: 42,
        label: 'Organisms',
        description: 'Organisms can break down organic matter in compost if provided with the correct mixture of water, oxygen, carbon, and nitrogen. They fall into two broad categories: chemical decomposers which perform chemical processes on the organic waste, and physical decomposers which process the waste into smaller pieces through methods such as grinding, tearing, chewing, and digesting.',
        images: '',
    },
    {
        content_info_id: 464,
        lesson_content_id: 42,
        label: 'Chemical decomposers',
        description: 'Bacteria - The most abundant and important of all the microorganisms found in compost. Bacteria process carbon and nitrogen and excrete plant available nutrients such as nitrogen, phosphorus, and magnesium. Depending on the phase of composting, mesophilic or thermophilic bacteria may be the most prominent.',
        images: '',
    },
    {
        content_info_id: 465,
        lesson_content_id: 42,
        label: 'Mesophilic bacteria',
        description: 'Get compost to the thermophilic stage through oxidation of organic material. Afterwards, they cure it which makes the fresh compost more bio-available for plants.',
        images: '',
    },
    {
        content_info_id: 466,
        lesson_content_id: 42,
        label: 'Thermophilic bacteria',
        description: 'Do not reproduce and are not active between −5 to 25 °C yet are found throughout soil. They activate once the mesophilic bacteria have begun to breakdown organic matter and increase the temperature to their optimal range. They have been shown to enter soils via rainwater. They are present so broadly because of many factors including their spores being resilient. Thermophilic bacteria thrive from (40-60 °C), and only large-scale composting - such as windrow composting - operations generally exceed (60-65 °C), beyond which point many beneficial microorganisms will die.',
        images: '',
    },
    {
        content_info_id: 467,
        lesson_content_id: 42,
        label: 'Actinobacteria',
        description: 'Are needed to break down paper products such as newspaper, bark, etc and other large molecules such as lignin and cellulose that are more difficult to decompose. The "pleasant earthy smell of compost" is attributed to actinobacteria. They make carbon, ammonia, and nitrogen nutrients available to plants.',
        images: '',
    },
    {
        content_info_id: 468,
        lesson_content_id: 42,
        label: 'Fungi',
        description: 'Such as mold and yeast help break down materials that bacteria cannot, especially cellulose and lignin in woody material.',
        images: '',
    },
    {
        content_info_id: 469,
        lesson_content_id: 42,
        label: 'Protozoa',
        description: 'Contribute to biodegradation of organic matter as well as consuming non-active bacteria, fungi, and micro-organic particulates.',
        images: '',
    },
    {
        content_info_id: 470,
        lesson_content_id: 42,
        label: 'Physical decomposers Ants',
        description: 'Create nests, making the soil more porous and transporting nutrients to different areas of the compost. Beetles - grubs feed on decaying vegetables.',
        images: '',
    },
    {
        content_info_id: 471,
        lesson_content_id: 42,
        label: 'Earthworms',
        description: 'Ingest partly composted material and excrete worm castings, making nitrogen, calcium, phosphorus, and magnesium available to plants.  The tunnels they create as they move through the compost also increase aeration and drainage.',
        images: '',
    },
    {
        content_info_id: 472,
        lesson_content_id: 42,
        label: 'Flies',
        description: 'Feed on almost all organic material and input bacteria into the compost. Their population is kept in check by mites and the thermophilic temperatures that are unsuitable for fly larvae.',
        images: '',
    },
    {
        content_info_id: 473,
        lesson_content_id: 42,
        label: 'Millipedes',
        description: 'Break down plant material.',
        images: '',
    },
    {
        content_info_id: 474,
        lesson_content_id: 42,
        label: 'Rotifers',
        description: 'Feed on plant particles.',
        images: '',
    },
    {
        content_info_id: 475,
        lesson_content_id: 42,
        label: 'Snails and Slugs',
        description: 'Feed on living or fresh plant material. They should be removed from compost before use as they can damage plants and crops.',
        images: '',
    },
    {
        content_info_id: 476,
        lesson_content_id: 42,
        label: 'Sow Bugs',
        description: 'Feed on rotting wood, and decaying vegetation.',
        images: '',
    },
    {
        content_info_id: 477,
        lesson_content_id: 42,
        label: 'Springtails',
        description: 'Feed on fungi, mold, and decomposing plants.',
        images: '',
    },
    {
        content_info_id: 478,
        lesson_content_id: 42,
        label: 'Phases of composting',
        description: '',
        images: '',
    },
    {
        content_info_id: 479,
        lesson_content_id: 42,
        label: '1. Mesophilic phase',
        description: 'An initial, mesophilic phase, in which the decomposition is carried out under moderate temperatures by mesophilic microorganisms.',
        images: '',
    },
    {
        content_info_id: 480,
        lesson_content_id: 42,
        label: '2. Thermophilic phase',
        description: 'As the temperature rises, a second, thermophilic phase starts, in which various thermophilic bacteria carry out the decomposition under higher temperatures (50 to 60 °C (122 to 140 °F).)',
        images: '',
    },
    {
        content_info_id: 481,
        lesson_content_id: 42,
        label: '3. Maturation phase',
        description: 'As the supply of high-energy compounds dwindles, the temperature starts to decrease, and the mesophilic bacteria once again predominate in the maturation phase.',
        images: '',
    },
    // M2; L2, C3 info
    {
        content_info_id: 482,
        lesson_content_id: 43,
        label: 'Introduction',
        description: 'Compost is ready or finished when it looks, feels and smells like rich, dark earth rather than rotting vegetables. In other words, it should be dark brown, crumbly and smell like earth. The decomposition of kitchen and yard waste into finished compost can take anywhere from a few months to a few years depending on how well you manage the balancing the food (greens and browns), water, and air.',
        images: '',
    },
    {
        content_info_id: 483,
        lesson_content_id: 43,
        label: 'How to Harvest',
        description: 'How you harvest your mature compost will be dependent on what style of compost bin you use. If you have a single compost bin, you will likely have to remove the top portion of the pile to get to the material that is ready for harvesting (it falls to the bottom). If you have several bins, or a multi-bin system, you can use one section or bin to let compost fully mature, and add new materials to the other(s). That way you can simply empty out the entire bin when its contents are mature! With a single bin you will either have to: Move your bin over adjacent to its current location and transfer the unfinished material back into the bin. You can then harvest the remaining material. Remove the top portion of the pile. Once you have harvested the finished compost from below, you can then shovel the contents back into the bin and start adding new material on top.',
        images: '',
    },
    {
        content_info_id: 484,
        lesson_content_id: 43,
        label: 'When to Harvest',
        description: 'Generally compost is ready to be harvested when the finished product is a rich dark brown color, smells like earth, and crumbles in your hand. Some signs that it may not be ready include: Recognizable food content still visible. The pile is still warm. This means that it is still working. There are still lots of large lumps in the pile. If any of the above are noticeable, give it a few more weeks and check it again. If it looks ready but you still have twigs and other hard materials like fruit pits it can still be considered finished. You may however need to screen it before using it, depending on what you intend to use it for. Screened compost makes a great top dressing for your lawn. Many people ask us is it better to harvest compost in the spring or the fall? Generally, we recommend harvesting in the fall because if compost is used before it has fully mature, the microorganisms may rob the soil and plants of nitrogen in order to finish the process. Spreading your compost in the fall will ensure that by spring any issues related to compost maturity will be eliminated.',
        images: 'assets/module_images/M3/L2/harvest.png',
    },
    {
        content_info_id: 485,
        lesson_content_id: 43,
        label: 'How to use finished compost',
        description: 'Finished compost can be used both outdoors and indoors as a natural fertilizer for plants. Mix it in the soil before planting, or use it to top dress your indoor and outdoor plants, including your lawn and shrubs. Compost can also be used to make a rich liquid fertilizer called compost tea which can not only be used to provide nutrients for your plants, it can also suppress leaf disease when sprayed directly on the plant leaves.',
        images: 'assets/module_images/M3/L2/finish_compost.png',
    },
    // M3; L2; C4 info
    {
        content_info_id: 486,
        lesson_content_id: 44,
        label: 'Introduction',
        description: 'Composting process it is important to understand the process of composting. It is primarily a microbiological process of decomposing organic substances, which results in a product that is stable, pathogen-free, and contains readily available nutrients when applied to the soil. In the early stages of composting, the first to decompose are the proteins, sugars and starches then the cellulose and hemicelluloses, and lastly the lignin.',
        images: '',
    },
    {
        content_info_id: 487,
        lesson_content_id: 44,
        label: '',
        description: '1. Collect substrates. In collecting substrate, a hand tractor with trailer may be needed. Collect crop residues separately from animal manures and rice hull ash or carbonized rice hull. Bring them to the composting area. Composting area should have a shade to avoid direct rainfall that could leach out nutrients from the decomposing organic materials.',
        images: '',
    },
    {
        content_info_id: 488,
        lesson_content_id: 44,
        label: '',
        description: '2. Mix the materials at a ratio of 3:1:1(3 solid wastes, 1 farm manure, and 1 rice hull ash or CRH.',
        images: '',
    },
    {
        content_info_id: 489,
        lesson_content_id: 44,
        label: '',
        description: '3. Moisten the materials then shred to enhance decomposition. Shredding will reduce the size of the materials for easier attack of microorganisms.',
        images: '',
    },
    {
        content_info_id: 490,
        lesson_content_id: 44,
        label: '',
        description: '4. In the absence of shredding machine, use microbial enhancers, which are available in the market. Follow the procedure listed in the packet of the microbial enhancers.',
        images: '',
    },
    {
        content_info_id: 491,
        lesson_content_id: 44,
        label: '',
        description: '5. Pile the shredded materials and cover with used plastic to minimize evolution of greenhouse gases and conserve moisture of the pile. Be sure that the plastic cover is perforated to allow aeration in the pile.',
        images: '',
    },
    {
        content_info_id: 492,
        lesson_content_id: 44,
        label: '',
        description: '6. Monitor the MC and temperature of the pile every 2 days. In monitoring the pile temperature, insert soil thermometer in each of the sides of the pile as well as on top of the pile. Record the temperature. In the absence of soil thermometer, insert your hand on the sides of the pile and feel the heat of the pile. Presence of heat indicates active composting process. If the pile is dry, add water. Be sure that enough water is added to the pile to maintain moist condition. Get sample of the materials and hold it in your hands. If water drips from your hand, there is much water in your pile.',
        images: '',
    },
    {
        content_info_id: 493,
        lesson_content_id: 44,
        label: '',
        description: '7. After 2 weeks, open the pile and turn it. Turning can be done by spading the end of the pile and turning it back. Afterward, ensure that compost material is moist and then cover with plastic.',
        images: '',
    },
    {
        content_info_id: 494,
        lesson_content_id: 44,
        label: '',
        description: '8. After another 2 weeks, the compost is more or less mature already. Mature compost is indicated by black/dark colored material absence of foul odor, no heat dissipated, and unrecognizable original compost materials.',
        images: '',
    },
    {
        content_info_id: 495,
        lesson_content_id: 44,
        label: '',
        description: '9. Air-dry the compost under a shaded place to avoid direct impact of rainfall. Do not over dry the compost. Maintain compost MC at least approximately 30%. Get a handful sample of the compost and squeeze in your palm. If no water drips and you can form a ball, then MC of the compost is approximately 30%.',
        images: '',
    },
    {
        content_info_id: 496,
        lesson_content_id: 44,
        label: '',
        description: '10. Shred the compost to have a uniform size of the material, sieve, and place in a sack with plastic sack inside. An ordinary sack will contain 50kg of the compost material. Sew the sack and store in a cool dry place. Below is the average nutrient composition of composted agricultural wastes.',
        images: '',
    },
    // M3; L2; C5 info
    {
        content_info_id: 497,
        lesson_content_id: 45,
        label: 'Introduction',
        description: 'Keeping accurate and detailed records is an important aspect of managing a compost system. Accurate records provide crucial feedback about how the system is working and information upon which to base decisions or take action. Everyone on the compost team should have an understanding of why these records are important and how to make accurate measurements. Good record keeping also ensures that if site issues develop or the compost team encounters neighbor complaints, the issues and any actions taken are documented. The ability to make good compost starts with a good recipe and with your ability to monitor the compost and respond to changes as they occur. Many operators suggest there is "an art to composting". Good records can help you to improve your compost quality. It is important to keep records of the feedstock materials being composted, C: N ratios and approximate moisture content at the start of the composting process.',
        images: '',
    },
    {
        content_info_id: 498,
        lesson_content_id: 45,
        label: '',
        description: 'Records should also include when the compost was turned and the conditions of the compost at that time. Temperatures need to be monitored regularly. Some standard operating procedures require daily temperature recording during the active phase, to ensure that the required temperatures have been achieved. It is recommended that the thermometer has a one meter (or three-foot stem) with a 0-80 °C temperature range, and be inserted into the center of the pile in several locations at each monitoring event. Make notes of moisture condition and any odors. Foul odors may indicate anaerobic conditions or lack of oxygen. Ammonia smells may indicate high nitrogen content (C: N imbalance) and a need for more carbon material. Additional records and sampling may be required when composting permits are required, such as when off-farm materials are added, or when selling compost as a soil amendment or fertilizers.',
        images: '',
    },
    {
        content_info_id: 499,
        lesson_content_id: 45,
        label: '',
        description: 'Record keeping provides valuable information concerning what worked and what did not and possibly, the reasons why something did not turn out as planned. As we all know, the best production methods and hybrids can fail due to weather conditions. Keeping daily records of precipitation and high and low temperatures is easy to accomplish and you can have a fairly accurate weather station for as little. A high/low thermometer, rain gauge, something to record them on, and about ten minutes a day is all that is needed. One set of accurate records should be enough to satisfy all of your needs. If you keep good records of production, expenses, income, and weather, you should have all of the required information for any purpose, from crop insurance to lenders to your own needs you should be able to make informed conclusions regarding the past and to plan for the future.',
        images: '',
    },
    // M4; L1; C1 info
    {
        content_info_id: 500,
        lesson_content_id: 46,
        label: 'Introduction',
        description: 'Secure the building and storage site, only you and your authorized employees should have access to the storage area. Keep the storage unit locked at all times, except when it is under the direct supervision of a person authorized for entry. For extra security, install a fence around the storage area and lock the gate. Consider installing security lighting and an alarm system.',
        images: '',
    },
    {
        content_info_id: 501,
        lesson_content_id: 46,
        label: 'Basic Safety Guidelines',
        description: 'Never let anyone eat, drink, or smoke in the storage facility. Store pesticides in their original labeled containers. Never store pesticides in milk jugs, soft drink bottles, fruit jars, or medicine bottles. Do not store pesticides with or near food, medicine, cleaning supplies, fertilizers, seed, or animal feed. Do not keep gasoline, kerosene, or other combustible materials with pesticides. Make sure pesticides are not kept near operations that present a fire hazard, such as burning and welding. Do not leave any pesticide container in full sun or next to a heater. Store pesticides on metal shelves with a lip or on wood shelves covered with plastic or chemically-resistant epoxy paint. Leak-proof plastic trays on shelves work well. Do not store pesticides on the floor. Use pallets under large containers/bags. Keep the storage area neat and clean at all times. Keep the area free of debris such as waste paper, rags, or used cardboard boxes, which may provide an ignition source. Clean up any spills immediately. Store dry formulations on the highest shelves. Store liquids and glass containers on the lowest level. This will prevent contamination in case a liquid container leaks.',
        images: '',
    },
    {
        content_info_id: 502,
        lesson_content_id: 46,
        label: 'Warning/Emergency response signs',
        description: 'Place signs indicating “Danger Pesticides – Keep Out – No Smoking” at all storage entries. Consider posting signs in Spanish as well as English. Some state laws require additional signage indicating who is responsible for the pesticide storage and who to call for emergencies. This type of sign should have at least two emergency phone numbers – the owner should not be the sole contact in an accident. The National Fire Protection Association (NFPA) 704 standard provides a way to communicate the potential hazards of storing hazardous chemicals through the posting of a diamond shape or square-on-point shape sign. The sign addresses the health, flammability, instability, and related hazards associated with short-term exposures that are most likely to occur as a result of fire, spill, or similar emergency. The 704 standard is applicable to industrial, commercial, and institutional facilities that manufacture, handle, or store hazardous materials. For more details on this standard, refer to the National Fire Protection Association web.',
        images: '',
    },
    // M4; L1; C2 info
    {
        content_info_id: 503,
        lesson_content_id: 47,
        label: 'Introduction',
        description: 'All  raw materials are cleaned before processing. The purpose is obviously to remove contaminants, which range from innocuous to dangerous. It is important to note that removal of contaminants is essential for protection of process equipment as well as the final consumer.',
        images: '',
    },
    {
        content_info_id: 504,
        lesson_content_id: 47,
        label: 'Choosing the raw materials for FPJ. You choose materials that are:',
        description: 'Young and fresh, Free from insect pests and diseases, Abundant in the production area, and Free from chemical containments.',
        images: '',
    },
    {
        content_info_id: 505,
        lesson_content_id: 47,
        label: 'Materials needed in making FPJ',
        description: 'Local plants that are fast growing like kangkong, legumes and grasses. You can also use bamboo shoots, asparagus shoots, actively growing plant parts and young fruits of cucumber, squash, melon, watermelon, ampalaya and other cucurbits. Weed species that are found growing in the production area, young leaves of trees, banana trunks, young leaves and fruits of stress tolerant crops are also good materials for FPJ. You can use either crude sugar or molasses or whichever is available and can be bought at a lower price. You will need basin, ceramic pot or plastic pail, net bag or cloth bag, paper or cloth for cover, string, stone as weight, bolo, chopping board, marking pen and glass jars.',
        images: '',
    },
    {
        content_info_id: 506,
        lesson_content_id: 47,
        label: 'Steps in preparing raw materials for concoction',
        description: '1. Collect the plant materials early in the morning while they are fresh and the microorganisms are still present. Do not wash the plant materials. 2. Cut the plant materials into small pieces so that the juice can be easily extracted. 3. Put 3 kg chopped plant materials in a basin, add 1 kg crude sugar or molasses, then mix thoroughly with your hands. Make sure that all plant materials are mixed with sugar so that the juice can be extracted easily. 4. Put the mixture in a net bag or cloth bag. This is done so that the extracted juice will ooze from all sides of the bag. 5. Put the bagged mixture in a ceramic pot or plastic pail, and put weight to compress the mixture. Stone is a good material used to weigh down the mixture. 6. Cover the pot or pail with paper or cloth, and secure with a string or rubber band. Paper or cloth is used as cover to allow some air to get inside the pot and for the gas that is being produced during the fermentation process to escape. On the cover, write the date of processing and the expected date of harvest. 7. Store the container with the bagged mixture in a cool dry shady place. Make sure that the storage area is not infested with cockroaches or mice, because they might feed on the mixture and contaminate the extract. In 7 days, plant juice is extracted and fermented. The plant extract will change its color from green to yellow, then to brown and will smell sweet and alcoholic. 8. After 7 days, lift the bagged mixture and squeeze hard to get the remaining extracts. 9. Collect the fermented extracts and preserve in dark colored glass jar. To cover the jar, use paper or cloth to allow the gas to escape during further fermentation, then, store in a cool, shady place. You may add the plant residue to the compost pile to hasten decomposition or you can apply it to the garden plots as source of organic matter. Use your FPJ more effectively if it is stored for another one week after completion.',
        images: '',
    },
    // M4; L1; C3 info
    {
        content_info_id: 507,
        lesson_content_id: 48,
        label: 'Introduction',
        description: 'PERSONAL PROTECTIVE EQUIPMENT (PPE) Apron - made of cloth or plastic used as protection from any liquid materials and dirt when doing the fermentation procedure.',
        images: '',
    },
    {
        content_info_id: 508,
        lesson_content_id: 48,
        label: 'Hair Net',
        description: 'Made of nets to cover the head to eliminate contamination of the fermented concoction.',
        images: '',
    },
    {
        content_info_id: 509,
        lesson_content_id: 48,
        label: 'Gloves',
        description: 'It is made up of rubber or plastic used to cover the hand to minimize the contamination of the fermented concoction.',
        images: '',
    },
    {
        content_info_id: 510,
        lesson_content_id: 48,
        label: 'Face Mask',
        description: 'Made up of cloth or thin plastic used to cover the mouth eliminate contamination of the fermented concoction.',
        images: '',
    },
    {
        content_info_id: 511,
        lesson_content_id: 48,
        label: 'Rubber Boots',
        description: 'It is used to protect the feet from any clutter around the work place.',
        images: '',
    },
    {
        content_info_id: 512,
        lesson_content_id: 48,
        label: 'MATERIALS',
        description: 'Fermented Plant Juice (FPJ)',
        images: '',
    },
    {
        content_info_id: 513,
        lesson_content_id: 48,
        label: 'Alugbati',
        description: 'A plant that bears fruit that ranges in color from dark green to red.',
        images: '',
    },
    {
        content_info_id: 514,
        lesson_content_id: 48,
        label: 'Bamboo Shoots',
        description: 'New cane culms that come out of the ground - also known as bamboo sprouts.',
        images: '',
    },
    {
        content_info_id: 515,
        lesson_content_id: 48,
        label: 'Banana Trunks',
        description: 'An inner part of the banana plant stems edible, healthy and rich in fibers.',
        images: '',
    },
    {
        content_info_id: 516,
        lesson_content_id: 48,
        label: 'Kamote Tops',
        description: 'A good source of protein, minerals, dietary fiber and nutrients such as calcium, magnesium, sodium, phosphorous, sulfur, iron and zinc.',
        images: '',
    },
    {
        content_info_id: 517,
        lesson_content_id: 48,
        label: 'Kangkong',
        description: 'A plant known in English as water spinach, river spinach, water morning glory and water convolvulus that gives a lot of health benefits.',
        images: '',
    },
    {
        content_info_id: 518,
        lesson_content_id: 48,
        label: 'Molasses',
        description: 'A dark color liquid and about two thirds as sweet as regular sugar used in fermentation process.',
        images: '',
    },
    {
        content_info_id: 519,
        lesson_content_id: 48,
        label: 'Mascuvado',
        description: 'A natural sugar from sugar cane and alternative raw material in fermentation process.',
        images: '',
    },
    {
        content_info_id: 520,
        lesson_content_id: 48,
        label: 'Brown sugar',
        description: 'A natural material also from sugar cane and alternative raw material in fermentation process.',
        images: '',
    },
    {
        content_info_id: 521,
        lesson_content_id: 48,
        label: 'Fermented Fruit Juice (FFJ) at least three kinds of ripe fruits Banana',
        description: 'Fruit that rich in potassium that provides instant energy.',
        images: '',
    },
    {
        content_info_id: 522,
        lesson_content_id: 48,
        label: 'Papaya',
        description: 'A contains enzyme called papain that aids digestion, high in fiber and water content, which help to prevent constipation and promote regularity and a healthy digestive tract. Watermelon - a delicious and refreshing fruit that contain 46 calories per cup, high in vitamin C and vitamin A.',
        images: '',
    },
    {
        content_info_id: 523,
        lesson_content_id: 48,
        label: 'Ampalaya',
        description: 'Known as bitter melon for diabetes, stomach and intestinal problems, promote menstruation, and many other conditions.',
        images: '',
    },
    {
        content_info_id: 524,
        lesson_content_id: 48,
        label: 'Tomato',
        description: 'A fruit that contains a chemical called lycopene, which is believed to play a role in preventing cancer.',
        images: '',
    },
    {
        content_info_id: 525,
        lesson_content_id: 48,
        label: 'Fish Amino Acid (FAA) Golden Kuhol Meal',
        description: 'Known as Golden Apple Snail that highly invasive and cause damage to rice crops wihc can be a source of nitrogen fertilizer for plants and protein supplement to animals.',
        images: '',
    },
    {
        content_info_id: 526,
        lesson_content_id: 48,
        label: 'Scales of all of big fishes',
        description: 'These are the outer covering of fish which can be used in producing Amino Acid for plants and animals.',
        images: '',
    },
    {
        content_info_id: 527,
        lesson_content_id: 48,
        label: 'Trash fish',
        description: 'These are marine fish having little or no market value as human food but used sometimes in the production of fish meal simply waste of fish like head, bone, intestines, scales, gills, etc.',
        images: '',
    },
    {
        content_info_id: 528,
        lesson_content_id: 48,
        label: 'Oriental Herbal Nutrient (OHN) Chili',
        description: 'A small hot-tasting pod of a variety of capsicum, used chopped (and often dried) in sauces, relishes, and spice powders.',
        images: '',
    },
    {
        content_info_id: 529,
        lesson_content_id: 48,
        label: 'Garlic',
        description: 'A strong-smelling pungent-tasting bulb, used as a flavoring in cooking and in herbal medicine.',
        images: '',
    },
    {
        content_info_id: 530,
        lesson_content_id: 48,
        label: 'Ginger',
        description: 'A hot fragrant spice made from the rhizome of a plant. It is chopped or powdered for cooking, preserved in syrup, or candied.',
        images: '',
    },
    {
        content_info_id: 531,
        lesson_content_id: 48,
        label: 'Makabuhay',
        description: 'A primary ingredient used to concoct preparations that would prevent spread of malaria, and may be used as cleanser for skin ulcer and skin wounds. Pure coconut vinegar - produced from the sap and water of coconut trees that is fermented and aged to and processed into a mildly sweet vinegar.',
        images: '',
    },
    {
        content_info_id: 532,
        lesson_content_id: 48,
        label: 'Calcium Phosphate (CALPHOS) Animal bones (ruminants)',
        description: 'The remain parts of the animals specifically the bone.',
        images: '',
    },
    {
        content_info_id: 533,
        lesson_content_id: 48,
        label: 'Egg Shell',
        description: 'The thin, hard outer layer of an egg, especially a hens egg',
        images: '',
    },
    {
        content_info_id: 534,
        lesson_content_id: 48,
        label: 'Kuhol Shell',
        description: 'Serves for muscle attachment and calcium storage.',
        images: '',
    },
    {
        content_info_id: 535,
        lesson_content_id: 48,
        label: 'Sea Shell',
        description: 'The outer covering of a marine mollusk.',
        images: '',
    },
    {
        content_info_id: 536,
        lesson_content_id: 48,
        label: 'Beneficial Microorganism (BMO)/ Indigenous Microorganism (IMO) Cooked Rice',
        description: 'Grains from palay that heated and serve as food.',
        images: '',
    },
    {
        content_info_id: 537,
        lesson_content_id: 48,
        label: 'Lactic Acid Bacteria Serum (LABS) Fresh Milk',
        description: 'An extract from ruminants.',
        images: '',
    },
    {
        content_info_id: 538,
        lesson_content_id: 48,
        label: 'Powdered Rice',
        description: 'A pulverized material out of rice.',
        images: '',
    },
    {
        content_info_id: 539,
        lesson_content_id: 48,
        label: 'COMMON TOOLS & EQUIPMENT',
        description: '',
        images: '',
    },
    {
        content_info_id: 540,
        lesson_content_id: 48,
        label: 'Chopping Board',
        description: 'Made up of plastic or wood used for slicing or cutting of the raw materials in preparing fermented concoction.',
        images: '',
    },
    {
        content_info_id: 541,
        lesson_content_id: 48,
        label: 'Knife',
        description: 'An aluminum metal used to cut or slice the raw materials in preparing fermented concoction.',
        images: '',
    },
    {
        content_info_id: 542,
        lesson_content_id: 48,
        label: 'Manila paper',
        description: 'A yellowish paper used to cover the pail with prepared fermented concoction.',
        images: '',
    },
    {
        content_info_id: 543,
        lesson_content_id: 48,
        label: 'Marker Pen',
        description: 'Used in marking or labeling the output.',
        images: '',
    },
    {
        content_info_id: 544,
        lesson_content_id: 48,
        label: 'Masking Tape',
        description: 'Used in fastening the Manila paper into the pail with prepared fermented concoction.',
        images: '',
    },
    {
        content_info_id: 545,
        lesson_content_id: 48,
        label: 'Plastic Pail',
        description: 'Used as container of the prepared fermented concoction.',
        images: '',
    },
    {
        content_info_id: 546,
        lesson_content_id: 48,
        label: 'Scissors/ cutter',
        description: 'Used n cutting the Manila paper and masking tape to make a presentable out-put.',
        images: '',
    },
    {
        content_info_id: 547,
        lesson_content_id: 48,
        label: 'Stone',
        description: 'A solid materials weighing at least 0.5 kg serve as stopper of the screen inside the pail.',
        images: '',
    },
    {
        content_info_id: 548,
        lesson_content_id: 48,
        label: 'Strainer / Screen',
        description: 'Made up of nylon or plastic that serve as filter inside the pail with prepared concoction.',
        images: '',
    },
    {
        content_info_id: 549,
        lesson_content_id: 48,
        label: 'Weighing Scale',
        description: 'A digital or manual tools used to measure mass of the raw materials in preparing fermented concoction.',
        images: '',
    },
    // M4; L1; C4 info
    {
        content_info_id: 550,
        lesson_content_id: 49,
        label: 'Introduction',
        description: 'Organic Agriculture is an ecological production management system that promotes and enhances biodiversity, biological cycles, and soil biological activity. It is based on minimal use of off-farm inputs and on management practices that restore, maintain, or enhance ecological harmony. Preparing tools and equipment must be in accordance with enterprise procedure and/ or aligned in the Philippine National Standard.',
        images: '',
    },
    {
        content_info_id: 551,
        lesson_content_id: 49,
        label: 'The following must be observed:',
        description: '1. Use of PPE or Personal Protective Equipment; 2. Use and proper handling of the appropriate tools, equipment and raw materials; and 3. Application of the 5 S of housekeeping. Unnecessary accident cause by hazardous activity in relation to preparation of organic concoction may lessen if not totally eliminated through the proper use of PPE. Appropriate handling of raw materials like; cleaning, sanitizing and securing work and storage areas needs the application of the 5 S of housekeeping.',
        images: '',
    },
    {
        content_info_id: 552,
        lesson_content_id: 49,
        label: '1. SEIRI',
        description: 'Means SORT by removing all unnecessary or not needed in the workplace to avoid accidents.',
        images: '',
    },
    {
        content_info_id: 553,
        lesson_content_id: 49,
        label: '2. SEITON',
        description: 'Means SET IN ORDER or SYSTEMATIZED by arranging all needed tools and equipment and raw materials to be used and properly labeled for easily identified.',
        images: '',
    },
    {
        content_info_id: 554,
        lesson_content_id: 49,
        label: '3. SEISO',
        description: 'Means SHINE or SWEEP by keeping or maintain our work area, tools, equipment and raw materials clean to avoid contaminated results.',
        images: '',
    },
    {
        content_info_id: 555,
        lesson_content_id: 49,
        label: '4. SEIKETSU',
        description: 'Means STANDARDIZE or SANITIZE by creating consistent way that task and procedure are done. Organic Agriculture Production Producing Organic Concoction and Exacts.',
        images: '',
    },
    {
        content_info_id: 556,
        lesson_content_id: 49,
        label: '5. SHITSUKE',
        description: 'Means SELF-DISCIPLINE or SUSTAIN by making a habit of properly maintaining the correct procedure for this is the pillar of the first 4 S.',
        images: '',
    },
    // M4; L2; C1 info
    {
        content_info_id: 556,
        lesson_content_id: 50,
        label: 'Introduction',
        description: 'Preparation of raw materials is the process of preparing raw materials and chemicals. This is an important part because such preparation determines the basic constituents of paper. We manufacture products with various functions using our raw material preparation technologies, such as combination of different types of raw materials and blending of composite materials.',
        images: '',
    },
    {
        content_info_id: 557,
        lesson_content_id: 50,
        label: 'Preparing raw materials',
        description: 'FERMENTED PLANT JUICE (FPJ) Natural Growth Enhancer, is an artificial honey. It is a nutritional activation enzyme and is very effective in natural farming.',
        images: '',
    },
    {
        content_info_id: 558,
        lesson_content_id: 50,
        label: 'Materials:',
        description: 'kankong, Camote tops, banana trunk and molasses.',
        images: '',
    },
    {
        content_info_id: 559,
        lesson_content_id: 50,
        label: 'Choosing the raw materials for Fermented Plant Juice',
        description: 'You choose materials that are: Young and fresh, Free from insect pests and diseases, Abundant in the production area, and Free from chemical containments',
        images: '',
    },
    {
        content_info_id: 560,
        lesson_content_id: 50,
        label: 'Materials needed in making Fermented Plant Juice',
        description: 'Local plants that are fast growing like kangkong, legumes and grasses. You can also use bamboo shoots, asparagus shoots, actively growing plant parts and young fruits of cucumber, squash, melon, watermelon, ampalaya and other cucurbits. Weed species that are found growing in the production area, young leaves of trees, banana trunks, young leaves and fruits of stress tolerant crops are also good materials for Fermented Plant Juice. You can use either crude sugar or molasses or whichever is available and can be bought at a lower price. You will need basin, ceramic pot or plastic pail, net bag or cloth bag, paper or cloth for cover, string, stone as weight, bolo, chopping board, marking pen and glass jars.',
        images: '',
    },
    {
        content_info_id: 561,
        lesson_content_id: 50,
        label: 'Steps in Making Fermented Plant Juice',
        description: 'Collect the plant materials early in the morning while they are fresh and the microorganisms are still present. Do not wash the plant materials. 2. cut the plant materials into small pieces so that the juice can be easily extracted. 3. Put 3 kg chopped plant materials in a basin, add 1 kg crude sugar or molasses, then mix thoroughly with your hands. Make sure that all plant materials are mixed with sugar so that the juice can be extracted easily. 4. Put the mixture in a net bag or cloth bag. This is done so that the extracted juice will ooze from all sides of the bag. 5. Put the bagged mixture in a ceramic pot or plastic pail, and put weight to compress the mixture. Stone is a good material used to weigh down the mixture. 6. Cover the pot or pail with paper or cloth, and secure with a string or rubber band. Paper or cloth is used as cover to allow some air to get inside the pot and for the gas that is being produced during the fermentation process to escape. On the cover, write the date of processing and the expected date of harvest. 7. Store the container with the bagged mixture in a cool dry shady place. Make sure that the storage area is not infested with cockroaches or mice, because they might feed on the mixture and contaminate the extract. In 7 days, plant juice is extracted and fermented. The plant extract will change its color from green to yellow, then to brown and will smell sweet and alcoholic. 8. After 7 days, lift the bagged mixture and squeeze hard to get the remaining extracts. 9. Collect the fermented extracts and preserve in dark colored glass jar. To cover the jar, use paper or cloth to allow the gas to escape during further fermentation, then, store in a cool, shady place. You may add the plant residue to the compost pile to hasten decomposition or you can apply it to the garden plots as source of organic matter. Use your Fermented Plant Juice more effectively if it is stored for another one week after completion.',
        images: '',
    },
    {
        content_info_id: 562,
        lesson_content_id: 50,
        label: 'Fermented Fruit Juice (FFJ)',
        description: 'Natural Taste Enhancer - is made from sweet ripe fruits, fruit vegetables and root crops. Thoroughly blended with crude sugar or molasses and stored for a short period of time, the fermented extract is applied to the plants to promote flowering and fruit setting.',
        images: '',
    },
    {
        content_info_id: 563,
        lesson_content_id: 50,
        label: 'Materials:',
        description: 'banana papaya kalabasa and Molasses',
        images: '',
    },
    {
        content_info_id: 564,
        lesson_content_id: 50,
        label: 'Choosing the materials for Fermented Fruit Juice',
        description: 'You must choose materials that are: locally produced, free from insect pests and diseases, and not fit for human consumption.',
        images: '',
    },
    {
        content_info_id: 565,
        lesson_content_id: 50,
        label: 'Materials needed in making Fermented Fruit Juice',
        description: 'Locally produced sweet ripe fruits like mango, banana, papaya, strawberry and chico; ripe squash fruit and matured carrot; and root crops particularly camote, cassava and gabi. Citrus fruits are not recommended. You can make Fermented Fruit Juice from single material or a combination of materials. The extract from the combination of banana, papaya, and squash have been proven to be effective in flower induction and fruit setting by many organic farmers. You can use either crude sugar or molasses or whichever is available or can be purchased at lower cost. You will also need ceramic pots or plastic pail, basin, net bag or cloth bag, paper or cloth for cover, string, stone as weight, bolo, chopping board, marking pen, and glass jars for storage.',
        images: '',
    },
    {
        content_info_id: 567,
        lesson_content_id: 50,
        label: 'Procedure',
        description: 'Collect ripe fruits or vegetables that are already available or in season, for example, if squash is available, then make fermented squash juice. There are plenty of materials to be used so you can make different kinds of Fermented Fruit Juice. Use any materials that are free from insect pests and diseases. 2. Chop the materials into small pieces so that the juice can be easily extracted. 3. Put 1 kg chopped materials in a basin, add 1 kg crude sugar or molasses, and then mix thoroughly with your bare hands. You must make sure that all chopped materials are coated with sugar or molasses so that the juice can be extracted easily. 4. Put the mixture in a net bag or cloth bag. This is done so that the extracted juice will ooze from all sides of the bag. Put the bagged mixture in a ceramic pot or plastic pail, and put weight to compress the mixture. Stone is a good material used to weigh down the mixture. 5. Cover the pot or pail with paper or cloth and secure with a string or rubber band. Paper or cloth is used as cover to allow some air to get inside the pot or pail and for the gas that is being produced during the fermentation process to escape. On the cover, write the date of processing and the expected date of harvest. 6. Store the container with the bagged mixture for 7 days in a cool dry shady place. Make sure that the storage area is not infested with cockroaches or mice, because they might feed on the mixture and contaminate the extract. In 7 days, plant juice is extracted and fermented. The fruit extract will change its color from yellow orange to brown, and will smell sweet and alcoholic. After 7 days, lift the bagged mixture and squeeze hard to get the remaining extracts. 7. Collect the fermented extracts and preserve in dark colored glass jar. To cover the jar, use paper or cloth to allow the gas to escape during further fermentation, then, store in a cool, shady place. You may add the fruit residue to compost pile to hasten decomposition or you can apply it to the garden plots as source of organic matter. You can use your Fermented Fruit Juice more effectively if it is stored for another one week after completion.',
        images: '',
    },
    {
        content_info_id: 568,
        lesson_content_id: 50,
        label: 'Oriental Herbal Nutrients (OHN) Natural Pesticides',
        description: 'OHN is a mixture of edible, aromatic herbs extracted with alcohol and fermented with brown sugar. It is used to discourage the growth of anaerobic, potentially pathogenic microbes and encourage beneficial aerobic microbes in the soil and on plants. Herbs long recognized by many ancient cultures as having such prebiotic properties include fresh ginger root (Zingiber officinale).',
        images: '',
    },
    {
        content_info_id: 569,
        lesson_content_id: 50,
        label: 'Materials:',
        description: ': 1 garlic 1 kg. Ginger 200 grms. Mascuvado sugar 2.2 liters pure coconut vinegar.',
        images: '',
    },
    {
        content_info_id: 570,
        lesson_content_id: 50,
        label: 'A. Preparation of Fresh Herb Extracts (when using fresh ginger or turmeric root and garlic cloves)',
        description: '1. Slice or crush fresh ginger OR turmeric root, weigh, and place in a clean glass jar to fill 2/3 full. Slice or crush garlic cloves. 2. Add an equal amount of brown sugar by weight to each jar. Cover the jars with muslin or a paper towel and secure with a rubber band or threaded ring portion of a Mason jar and let sit for 5 to 7 days at room temperature out of direct sunlight. 3. Fill each jar with vodka (or other liquor that is 40% proof). 4. Replace the jar’s cover. Let sit at room temperature, stirring clockwise with a wooden spoon every morning for 14 days. 5. Strain 1 /3 of the liquid from each jar into separate, labeled glass jars (“Ginger OR Turmeric Extract” and “Garlic Extract,” respectively). 6. Repeat Steps 3 through 5, adding to the respective extract jars. 7. This extraction process (Steps 3 through 6) can be repeated up to 5 times before discarding the herb, brown sugar, and liquor mixtures (which can be composted or made into tea).',
        images: '',
    },
    {
        content_info_id: 571,
        lesson_content_id: 50,
        label: 'Indigenous Microorganisms',
        description: '(IMO) Beneficial Microorganisms Indigenous Microorganism (IMO) In natural farming, Indigenous Microorganism (IMO) is becoming popular among farmers. This Indigenous microorganism (IMO) has been successfully tried by government agriculturists, academic researchers, non-profit organizations and farmers alike. They have found that IMO is useful in removing bad odors from animal wastes, hastening composting, and contributing to crops’ general health.',
        images: '',
    },
    {
        content_info_id: 572,
        lesson_content_id: 50,
        label: 'Materials',
        description: 'Clay pot/Bamboo trough 2. Manila paper (unprinted) 3. Basin 4. Cooked rice 5. Muscovado sugar (generic or crude sugar) 6 Clean water (no chlorine or other chemicals)',
        images: '',
    },
    {
        content_info_id: 573,
        lesson_content_id: 50,
        label: 'How to Make Your Own Indigenous Microorganism (IMO)',
        description: 'Cook a kilo of rice, preferably organic. After cooling, put the cooked rice in a wooden, earthen or ceramic container. Avoid plastic or aluminum. 2. Cover the mouth of the container completely with cloth or paper, fixed in place with a rubber band, to prevent water or small insects from getting in. 3. Put the covered container, protected from possible rain, under the trees, in a bamboo grove, a forest floor, or wherever a thick mat of leaves has formed. Leave it there for three days. 4. After whitish moldy filaments have formed, transfer the entire contents of the container to a larger glass or earthen jar and add one kilo of brown sugar or molasses, preferably organic. 5. Cover the jar with clean cloth or paper, fixed with a rubber band. Keep the jar in a dark, cool place. Let it ferment for seven days, until it appears muddy. This is your IMO concoction.',
        images: '',
    },
    {
        content_info_id: 574,
        lesson_content_id: 50,
        label: 'Procedure: 1. Collecting IMO',
        description: 'a. Place cooked rice into pot or bamboo trough. Let it cool first before placing into the trough. b. Cover container with fine wire screen to avoid rat disturbances and tie up using any tying material. c. Place container face down or slant position in an area where decomposed crops such as corn, rice straw, etc. or in banana/bamboo plantation areas. Cover container with any material to protect from rain. d. Collect container after 5-7 days when presence of molds can be seen.',
        images: '',
    },
    {
        content_info_id: 575,
        lesson_content_id: 50,
        label: 'Procedure: 2. Culture and production',
        description: 'a. Transfer the molded rice with collected microbes into a basin. For every kilo of cooked rice add 1 kilo of muscovado sugar and 1 liter clean water (no chlorine). Mix well. b. Transfer the mixture into an old pail or clay jar. Cover with unprinted Manila paper and tie up using any tying materials. Fill the pail up to 75% only, leaving 25% air space.  c. Place the container in a cool place away from the heat of the sun. d. Leave pail or jar for 7 days then collect by straining the liquid extract, leaving the substrate to the compost area.',
        images: '',
    },
    {
        content_info_id: 576,
        lesson_content_id: 50,
        label: 'Lactic Acid Bacteria Serum (LABS)',
        description: 'It can convert waste into organic matter and basic minerals, good digestion for animals Deodorizer. Lactic acid bacteria can be collected in the air.',
        images: '',
    },
    {
        content_info_id: 577,
        lesson_content_id: 50,
        label: 'Materials',
        description: '1. Rice wash 2. Fresh milk (skimmed or powdered milk can be used) 3. Used or old pail or plastic container 4. Manila paper (unprinted) 5. Muscovado sugar (crude or generic sugar)',
        images: '',
    },
    {
        content_info_id: 578,
        lesson_content_id: 50,
        label: 'Procedure',
        description: 'Pour rice wash (solution generated when you wash the rice with water) into a container. 2. Allow 50-75% air space in the container. 3. Cover container loosely (not vacuum tight, allowing air to move into the container). Put container in a cool area with no direct sunlight. 4. Allow rice wash to ferment for 5-7 days at a temperature of 20-25 degrees centigrade. 5. The rice bran will be separated and float like a thin film on the liquid smelling sour. 6. Strain the liquid with a cheese cloth or wheat flour bag cloth. Put liquid in a bigger container. 7. Pour ten parts milk (the original liquid has already been infected with different types of microorganisms including Lactobacilli. Saturation of milk will eliminate the other microorganisms and pure Lactobacilli will remain.) 8. Ferment in 5-7 days. Carbohydrates, protein and fat will',
        images: '',
    },
    {
        content_info_id: 579,
        lesson_content_id: 50,
        label: 'Calphos Natural calphos',
        description: 'Micronutrients flower inducer, prevent overgrowth',
        images: '',
    },
    {
        content_info_id: 580,
        lesson_content_id: 50,
        label: 'Materials',
        description: '1. Any of the following: pork, fish and beef bones, eggshells and kuhol and/or any shells 2. Clay pot or cross-cut bamboo trough 3. Manila paper (unprinted) 4. Plastic straw (for tying) 5. Coconut vinegar 6. Griller',
        images: '',
    },
    {
        content_info_id: 581,
        lesson_content_id: 50,
        label: 'Procedure',
        description: '1. Broil bones. Roast eggshells until they turned into ashes 2. Pulverize bones. Transfer in a container pulverized bones or shells and add equal volume of vinegar. 3. Transfer the mixture into a bamboo trough or clay jar, cover with Manila paper and tie up with plastic straw. 4. for bones: Allow to sit for one month or until bones soften or dissolve completely. For eggshells: Allow to sit for 2 weeks (14 days) or until dissolved completely. 5. Harvest, strain the preparation and bottle after a month or until when bones are completely dissolved.',
        images: '',
    },
    {
        content_info_id: 582,
        lesson_content_id: 50,
        label: 'Fish Amino Acid (FAA)',
        description: 'Is a liquid made from fish scrap. FAA is of great value to both plants and microorganisms in their growth, because it contains and abundant amount of nutrients and various types of amino acids that will constitute a source of Nitrogen for plants.',
        images: '',
    },
    {
        content_info_id: 583,
        lesson_content_id: 50,
        label: 'Materials',
        description: '1. Chopped fish or fish trash such as gills, entrails, golden snail (shell removed) or meat scrap and rejects. 2. Old or used pail 3. Manila paper (unprinted) 4. Muscovado sugar 5. Plastic straw 6. Clean water (no chlorine or other chemical compound)',
        images: '',
    },
    {
        content_info_id: 584,
        lesson_content_id: 50,
        label: 'Procedure',
        description: '1. Mix properly the following ingredients at a ratio of 1:1:1 3 kilos chopped fish, snail or meat scraps and rejects 3 kilos muscovado suga. 2. Plants that are fast growing like kangkong, legumes and grasses. You can also use bamboo shoots, asparagus shoots, actively growing plant parts.',
        images: '',
    },
    // M4; L2; C2 info
    {
        content_info_id: 585,
        lesson_content_id: 51,
        label: 'Introduction',
        description: 'Fermentation refers to the metabolic process by which organic molecules (normally glucose) are converted into acids, gases, or alcohol in the absence of oxygen or any electron transport chain. Fermentation pathways regenerate the coenzyme nicotinamide adenine dinucleotide (NAD+), which is used in glycolysis to release energy in the form of adenosine triphosphate (ATP). Fermentation only yields a net of 2 ATP per glucose molecule (through glycolysis), while aerobic respiration yields as many as 32 molecules of ATP per glucose molecule with the aid of the electron transport chain. The study of fermentation and its practical uses is named zymology and originated in 1856 when French chemist Louis Pasteur demonstrated that fermentation was caused by yeast. Fermentation occurs in certain types of bacteria and fungi that require an oxygen-free environment to live (known as obligate anaerobes), in facultative anaerobes such as yeast, and also in muscle cells when oxygen is in short supply (as in strenuous exercise). The processes of fermentation are valuable to the food and beverage industries, with the conversion of sugars into ethanol used to produce alcoholic beverages, the release of CO2 by yeast used in the leavening of bread, and with the production of organic acids to preserve and flavor vegetables and dairy products.',
        images: '',
    },
    {
        content_info_id: 586,
        lesson_content_id: 51,
        label: 'Function of Fermentation',
        description: 'The main function of fermentation is to convert NADH back into the coenzyme NAD+ so that it can be used again for glycolysis. During fermentation, an organic electron acceptor (such as pyruvate or acetaldehyde) reacts with NADH to form NAD+, generating products such as carbon dioxide and ethanol (ethanol fermentation) or lactate (lactic acid fermentation) in the process.',
        images: '',
    },
    {
        content_info_id: 587,
        lesson_content_id: 51,
        label: 'Types of Fermentation',
        description: 'There are many types of fermentation that are distinguished by the end products formed from pyruvate or its derivatives. The two fermentations most commonly used by humans to produce commercial foods are ethanol fermentation (used in beer and bread) and lactic acid fermentation (used to flavor and preserve dairy and vegetables).',
        images: '',
    },
    {
        content_info_id: 588,
        lesson_content_id: 51,
        label: 'Ethanol Fermentation',
        description: 'This figure depicts the processes of glycolysis and ethanol fermentation. In ethanol fermentation, the pyruvate produced through glycolysis is converted to ethanol and carbon dioxide in two steps. First, the pyruvate releases carbon dioxide to form a two-carbon compound called acetaldehyde. Next, acetaldehyde is reduced by NADH to ethanol, hereby regenerating the NAD+ for use in glycolysis. Overall, one molecule of glucose is converted into two molecules of carbon dioxide and two molecules of ethanol. Ethanol fermentation is typically performed by yeast, which is a unicellular fungus.',
        images: '',
    },
    {
        content_info_id: 589,
        lesson_content_id: 51,
        label: 'Lactic Acid Fermentation',
        description: 'This figure depicts the processes of glycolysis and homolactic fermentation. There are two main types of lactic acid fermentation: homolactic and heterolactic. Inhomolactic acid fermentation, NADH reduces pyruvate directly to form lactate. This process does not release gas. Overall, one molecule of glucose is converted into two molecules of lactate. In heterolactic fermentation, some lactate is further metabolized, resulting in ethanol and carbon dioxide via the phosphoketolase pathway. Lactic acid fermentation is primarily performed by certain types of bacteria and fungi. However, this type of fermentation also occurs in muscle cells to produce ATP when the oxygen supply has been depleted during strenuous exercise and aerobic respiration is not possible.',
        images: '',
    },
    {
        content_info_id: 590,
        lesson_content_id: 51,
        label: '1. Fermented Plant Juice',
        description: 'Materials: 1 kg kankong;1 kg Camote tops; 1 kg banana trunk; and 1.5 kgs molasse',
        images: '',
    },
    {
        content_info_id: 591,
        lesson_content_id: 51,
        label: 'Steps on to ferment:',
        description: '1. Clean and wash vegetable materials. 2. Drain for 5 minutes. 3. Slice to an inc size. 4. Mix all vegetable thoroughly in a plastic pail(20 li. Capacity). 5. Mix with 1.5 kgs of molasses thoroughly. 6. Put nylon screen on top of the mixture. 7. Put 5-8 pieces 25-30 grams stone on top of the nylon screen. 8. 8. Wipe the mouth of the plastic pail. 9. Cover with two layered manila paper. 10. Tie with rubber band. 11. Put marking on the masking tape bearing the name and date of fermentation and paste it on top of the manila paper. 12. Keep in dark cool room for 7 days. 13. Open the mixture and extract the liquid. 14. Filter the liquid and keep it in a plastic container (do not close the cap tightly, loosen the cap of approximately 1 complete twist). 15. Completely close cap after a week or when there are no bubbles going up. 16. The concoction is ready to use after extraction.',
        images: '',
    },
    {
        content_info_id: 592,
        lesson_content_id: 51,
        label: '2. Fermented Fruit Juice (FFJ) Extracts',
        description: 'Materials: 1 kg banana fruit; 1kg papaya; 1kg watermelon; and 3 kgs molasses',
        images: '',
    },
    {
        content_info_id: 593,
        lesson_content_id: 51,
        label: 'Steps on how to ferment:',
        description: '1. Clean and wash fruits. 2. Drain for 5 minutes. 3. Slice to an inch size. 4. Mix all fruits thoroughly in a plastic pail ( 20 liters capacity). 5. Mix with 3 kgs. Of molasses thoroughly. 6. Put nylon screen on top of the mixture. 7. Put 5-8 pieces 25-30 grams stone on top of the nylon screen. 8. Wipe the mouth of the plastic pail. 9. Cover with two layered manila paper. 10. Tie with rubber band. 11. Put marking on the masking tape bearing the name and date of fermentation and paste it on top of the manila paper. 12. Keep in dark cool room for 7 days. 13. Open the mixture and extract the liquid. 14. Filter the liquid and keep it in a plastic container ( do not close the cap tightly, loosen the cap of approximately 1 complete twist). 15. Completely close cap after a week or when there are no bubbles going up. 16. The concoction is ready to use after extraction',
        images: '',
    },
    {
        content_info_id: 594,
        lesson_content_id: 51,
        label: '4. Fish Amino Acid ( FAA)',
        description: 'Materials : 1 kg Trash fish and gills, scales, offals, of big fish; and 1 kg molasses',
        images: '',
    },
    {
        content_info_id: 595,
        lesson_content_id: 51,
        label: 'Steps on how to ferment:',
        description: '1. Clean and wash vegetable materials. 2. Drain for 5 minutes. 3. Slice to an inch size. 4. Mix all parts thoroughly in a plastic pail ( 20 liters capacity). 5. Mix with 1 kgs of molasses thoroughly. 6. Put nylon screen on top of the mixture. 7. Put 5-8 pieces 25-30 grams stone on top of the nylon screen. 8. Wipe the mouth of the plastic pail. 9. Cover with two layered manila paper. 10. Tie with rubber band. 11. Put marking on the masking tape bearing the name and date of fermentation and paste it on top of the manila paper. 12. Keep in dark cool room for 15 days. 13. Open the mixture and extract the liquid. 14. Filter the liquid and keep it in a plastic container (do not close the cap tightly, loosen the cap of approximately 1 complete twist). 15. Completely close cap after a week or when there are no bubbles going up. 16. The concoction is ready to use after extraction',
        images: '',
    },
    {
        content_info_id: 596,
        lesson_content_id: 51,
        label: '5. Oriental Herbs Nutrients (OHN)',
        description: 'Materials: 1 kg garlic; 1kg. Ginger, 200 grams muscuvado, and 2.2 liters pure coconut vinegar',
        images: '',
    },
    {
        content_info_id: 597,
        lesson_content_id: 51,
        label: 'Steps on how to ferment:',
        description: '1. Skinned the garlic and ginger. 2. Cut garlic in halves and slice ginger into quarter of an inch. 3. Mix garlic and ginger with 200 grams muscuvado sugar in a plastic pail. 4. Wipe the mouth of the plastic pail. 5. Close cover tightly and seal it with masking tape at the side. 6. Mark the name and date of fermentation (First stage fermentation). 7. Open the cover and add 2.2 liters of pure coconut vinegar (1:1 solution) 3 days after. 8. Wipe the mouth of the plastic pail. 9. Close cover tightly and seal it again with masking tape. 10. Open the cover tightly and decant the liquid to another container 10 days after (second stage fermentation). 11. Close tightly the cover and do the markings ( first extraction). 12. The concoction is now ready to use for animals. 13. Add the same amount of liquid extracted ( 2.2 liters of pure coco vinegar) then add 200 grams of hot pepper and 100 grams of panyawan, soak for 10 days ( secondextraction). 14. Repeat number 13 procedure for the third extraction',
        images: '',
    },
    {
        content_info_id: 598,
        lesson_content_id: 51,
        label: '6. Indigenous Micro-organism (IMO)',
        description: 'Materials: 1 kg commercial rice; and 2 kgs molasses',
        images: '',
    },
    {
        content_info_id: 599,
        lesson_content_id: 51,
        label: 'Steps on how to ferment:',
        description: '1. Wash the rice properly. (Keep the first wash liquid for the LABS). 2. Cook it normally (not too wet or too dry). 3. Cool the cooked rice naturally. 4. Transfer the cooked rice to a tray. 5. Use wooden ladle to transfer rice. 6. Put some cooked rice inside the bamboo pole (1/4 full of rice). 7. Cover it with a two layered manila paper then tie with rubber bands. 8. Wrap the bamboo pole with a clean cellophane then tie with rubber bands. 9. Write markings on the masking tape bearing the name and date of fermentation and paste it on top of the cellophane then tie with rubber bands. 10. Keep it under the bamboo forest for 3 to 5 days. 11. Open the bamboo pole and inspect the growing molds, black colored molds discard, white colored molds collect. 12. Weigh the recovered rice and molds, and add molasses in equal weight. 13. Put the mixture in a plastic container, wipe the mouth, cover with a double layered manila paper and put the proper markings. 14. Drain the Liquid from the mixture, filter and place it in another container (do not close the cap tightly; loosen the cap of approximately 1 complete twist). 15. Completely close cap after a week or when there are no bubbles going up. 16. The concoction is ready to use after extraction.',
        images: '',
    },
    {
        content_info_id: 600,
        lesson_content_id: 51,
        label: '7. Lactic Acid Bacteria Serum (LABS)',
        description: 'Materials: 900 ml. Cow’s milk; 100 ml. Clear liquid from fermented rice; and 1 liter molasses',
        images: '',
    },
    {
        content_info_id: 601,
        lesson_content_id: 51,
        label: 'Steps on how to ferment:',
        description: '1. Use the first wash liquid from the cooked rice. 2. Put liquid inside the plastic container (3/4 full) and wipe excess water. 3. Cover the container with a double layered manila paper. 4. Mark the name and date of fermentation. 5. Ferment it for 7 days (first stage fermentation). 6. Use 1 liter cow’s milk pack and remove 100 ml (10%). 7. Extract 100ml from the fermented first wash liquid of the cooked rice. 8. Take the liquid between the bottom and top layers of the fermentation and add to the 1 liter milk pack. 9. Return the cover of the pack and seal it with a masking tape. 10. Mark it with the name and date of fermentation. 11. Keep it for 5 days in a dark cool room, do nt disturb. 12. Drain the liquid (whey) and filter, separate the sludge from the liquid. 13. Measure the liquid and add the same amount of molasses. 14. Keep it in a plastic container (do not close the cap0 tightly, loosen the cap of approximately 1 complete twist). 15. Completely close cap after a week or when there are no bubbles going up. 16. The concoction is ready to use after extraction.',
        images: '',
    },
    {
        content_info_id: 602,
        lesson_content_id: 51,
        label: '8. Calphos Micro Nutrients (CALPHOS)',
        description: 'Materials: 3 kgs. Cow bones/eggshell and 27 liters of pure coco vinegar',
        images: '',
    },
    {
        content_info_id: 603,
        lesson_content_id: 51,
        label: 'Steps on how to ferment:',
        description: '1. Clean and wash cow bones properly. 2. Cook bones with some flesh and spices. 3. Remove all meat and fats thoroughly (eat the meat and fats). 4. Wash and clean the bones. 5. Put the bones above fired charcoal. 6. Wait until the remaining fats are drained. 7. Remove the bones when it became brownish in color (do not make it black, it’s over cooked) . 8. Cool it off for 10 to 20 minutes. 9. Wash again to remove excess oil, if necessary. 10. Drain excess water. 11. Put the bones inside the plastic pail. 12. Add 27 liters of pure coconut vinegar without coloring. 13. Wipe the mouth of the plastic pail, cover with two layered manila paper and write the markings (name and date of fermentation). 14. Open the container after 30 days of soaking, filter the liquid and keep it in another plastic container (do not close the cap tightly, loosen the cap of approximately 1 complete twist). 15. Completely close cap after a week or when there are no bubbles going up. Write the proper markings. It is ready to use',
        images: '',
    },
    {
        content_info_id: 604,
        lesson_content_id: 51,
        label: '9. Natural Human Health Enhancer ( 3Cs)',
        description: 'Materials: 5 kgs. Celery; 5 kgs. Carrots; 5 kgs. Cucumber; and 5 Kgs. Muscuvado',
        images: '',
    },
    {
        content_info_id: 605,
        lesson_content_id: 51,
        label: 'Steps on How to ferment:',
        description: '1. Clean and wash vegetable materials thoroughly. 2. Drain for 5 minutes. 3. Slice to ¼ of an inch size. 4. Mix all vegetable thoroughly in a plastic container (80 Liters capacity). 5. Mix with 5 kgs of muscuvado thoroughly. 6. Put nylon screen on top of the mixture. 7. Put 6-8 pieces of 250-500 ml mineral water container on top of the nylon screen as weight. 8. Wipe the mouth of the plastic pail. 9. Cover with two layered Manila paper. 10. Tie with rubber band. 11. Write markings on the masking tape bearing the name and date of fermentation and paste it on top of the Manila paper. 12. Keep in dark cool room for 20 days. 13. Open the mixture and extract the liquid. 14. Filter the liquid and keep it in a plastic container (do not close the cap tightly, loosen the cap of approximately 1 complete twist). 15. Completely close cap after a week or when there are no bubbles going up. 16. The concoction is ready to use after extraction',
        images: '',
    },
    // M4; L2; C3 info
    {
        content_info_id: 606,
        lesson_content_id: 52,
        label: 'Introduction',
        description: 'The insurmountable rising cost of inorganic fertilizers inevitably uncontrollable in the coming production years. Looking into this perspective the farmers has to look for an alternative measure to sustain his farming business profitability. Here comes the discovery of using concoctions. Concoctions is a combination of various ingredients, usually herbs, spices, condiments, powdery substances or minerals, mixed up together, minced, dissolved or macerated into a liquid so as they can be ingested or drunk. The term “concoction” is sometimes loosely used metaphorically in order to describe a cocktail or a motley assemblage of things, persons or ideas. Various concoctions.',
        images: '',
    },
    {
        content_info_id: 607,
        lesson_content_id: 52,
        label: '1. Indigenous Microorganism (IMO)',
        description: 'Indigenous microorganisms are a group of innate microbial consortium that inhabits the soil and the surfaces of all living things inside and out which have the potentiality in biodegradation, nitrogen fixation, improving soil fertility, phosphate solubilizes and plant growth promoters.',
        images: 'assets/module_images/M4/L2/imo.png',
    },
    {
        content_info_id: 608,
        lesson_content_id: 52,
        label: 'Uses',
        description: 'Serve as Foliar Spray, applied to the soil-one 1day before direct seedling or transplanting.',
        images: '',
    },
    {
        content_info_id: 609,
        lesson_content_id: 52,
        label: 'Purpose',
        description: 'Hasten decomposition of compost and increase soil fertility, Serve as foliar fertilizer and good soil conditioner, Restore plant vitality, Reduces growth of weeds and grasses seeds, Speed up plant growth, and Revives nutrients in the soil',
        images: '',
    },
    {
        content_info_id: 610,
        lesson_content_id: 52,
        label: '2. Fermented Plant Juice (FPJ)',
        description: 'Fermented plant juice (FPJ) is a fermented extract of plants which helps crops to absorb nutrients directly for healthy growth and enabling their potential. It consist the young shoots of vigorously growing plants that are allowed to ferment for approximately 7 days with the aid of brown sugar. The brown sugar draws the juices out of the plant material via osmosis and also serves as a food source for the microbes carrying out the fermentation process. The weak alcohol produced during fermentation extracts chlorophyll (soluble in ethanol) and other plant components.',
        images: 'assets/module_images/M4/L2/fpj.png',
    },
    {
        content_info_id: 611,
        lesson_content_id: 52,
        label: 'Uses',
        description: 'Growth hormone promotant. Chlorophyll enhancer, microbe’s fortifier. Spray as side dressing during “ Vegetative Stage” (Pagpangipli). Apply on spray during “ change Over Period” (pamusog-busog) and Reproductive Stage (pamuging)',
        images: '',
    },
    {
        content_info_id: 612,
        lesson_content_id: 52,
        label: 'Purpose',
        description: 'Food for Microorganism. Enhances plant growth. Greening of leaves and produces chlorophyll. Makes plant strong and builds resistance against pests and diseases.',
        images: '',
    },
    {
        content_info_id: 613,
        lesson_content_id: 52,
        label: '3. Fermented Fruit Juice or FFJ',
        description: 'Is made from sweet ripe fruits, fruit vegetables and root crops. Thoroughly blended with crude sugar or molasses and stored for a short period of time, the fermented extract is applied to the plants to promote flowering and fruit setting.',
        images: 'assets/module_images/M4/L2/ffj.png',
    },
    {
        content_info_id: 614,
        lesson_content_id: 52,
        label: 'Uses',
        description: 'Good source of potash (Potassium)',
        images: '',
    },
    {
        content_info_id: 615,
        lesson_content_id: 52,
        label: 'Purpose',
        description: 'Sweetens the fruit and serves as source of potassium which can speed up plant absorption and result to sweeter tasting fruits. Increases plant nutrition through leaves and roots with potassium factor. Improves plant growth an soil health. Acts as plant hormone and growth promotant. Speeds up harvesting',
        images: '',
    },
    {
        content_info_id: 616,
        lesson_content_id: 52,
        label: '4. Fish Amino Acid (FAA)',
        description: 'The Fish Amino Acid (FAA) is a liquid made from fish. FAA is of great value to both plants and microorganisms in their growth, because it contains and abundant amount of nutrients and various types of amino acids (will constitute a source of nitrogen (N) for plants). ... Fish trash (head, bone, intestine, etc.)',
        images: 'assets/module_images/M4/L2/faa.png',
    },
    {
        content_info_id: 617,
        lesson_content_id: 52,
        label: 'Uses',
        description: 'Nitrogen Fixing (Urea Fertilizer). Nitrate from fish contains. Abundant amount of nutrient and various type of amino acid',
        images: '',
    },
    {
        content_info_id: 618,
        lesson_content_id: 52,
        label: 'Purpose',
        description: 'Serve as nitrogen fertilizer, good soil conditioner. Rich in calcium and protein and rich supplement for plants. Serve as “growth hormone” for plant growth and development Food for microorganism.',
        images: '',
    },
    {
        content_info_id: 619,
        lesson_content_id: 52,
        label: '5. Oriental Herbal Nutrients',
        description: 'OHN is a mixture of edible, aromatic herbs extracted with alcohol and fermented with brown sugar. It is used to discourage the growth of anaerobic, potentially pathogenic microbes and encourage beneficial aerobic microbes in the soil and on plants.',
        images: 'assets/module_images/M4/L2/ohn.png',
    },
    {
        content_info_id: 620,
        lesson_content_id: 52,
        label: 'Uses',
        description: 'For rice, corn vegetables and banana. Spray from planting up to bearing stage.',
        images: '',
    },
    {
        content_info_id: 621,
        lesson_content_id: 52,
        label: 'Benefits',
        description: 'Natural pest repellent. It is use throughout the early, vegetative, change over and fruiting stages. It is very important in natural farming.',
        images: '',
    },
    {
        content_info_id: 622,
        lesson_content_id: 52,
        label: 'Purpose',
        description: 'Natural pesticide and fungicide. Serve as pesticide and fungicide for plants and animals. Repel insect. Prevent plant pest and diseases. Promote healthy immune system. Treatment of fungal problem of plants, downy mildew, powdery mildew.',
        images: '',
    },
    {
        content_info_id: 623,
        lesson_content_id: 52,
        label: '6. Calcium Phosphate (Cal Phos)',
        description: 'Calcium phosphate is a family of materials and minerals containing calcium ions (Ca2+) together with inorganic phosphate anions. Some so-called calcium phosphates contain oxide and hydroxide as well. They are white solids of nutritious value. Calcium phosphates occur abundantly in nature in several forms and are the principal minerals for the production of phosphate fertilizers and for a range of phosphorus compounds. For example, the tribasic variety (precipitated calcium phosphate), Ca3 (PO4)2, is the principal inorganic constituent of bone ash.',
        images: 'assets/module_images/M4/L2/cal.png',
    },
    {
        content_info_id: 624,
        lesson_content_id: 52,
        label: 'Uses',
        description: 'Induces flowering and prevent overgrowth of plants. Strengthen flower.',
        images: '',
    },
    {
        content_info_id: 625,
        lesson_content_id: 52,
        label: 'Purpose',
        description: 'Makes fruit hard and sweet. Prevent overgrowth and applied when nitrogen is big. Increases calcium factor on roots and leaves. Applied when the plants are about to flower. Induces flowering among plants. Induces longer shelf life in fruits.',
        images: '',
    },
    {
        content_info_id: 626,
        lesson_content_id: 52,
        label: '7. Lactic Acid Bacteria Serum (LABS)',
        description: 'Lactic Acid Bacteria (LAB) are widespread microorganisms which can be found in any environment rich mainly in carbohydrates, LAB are anaerobic microorganism that decompose sugar in the absence of oxygen. Normally they are separated and cultured with rice washed with water and milk. This is how Lactic Acid Bacteria Serum (LABS) obtained. Lactic Acid Bacteria Serum is now used for its ability to convert waste into organic matter and basic materials. And they thrive and feed on the ammonia released in the decomposition normally associated with foul odor (removes foul odor). Lastly they serve as defense against pathogenic diseases such as harmful fungi and viruses.',
        images: 'assets/module_images/M4/L2/labs.png',
    },
    {
        content_info_id: 627,
        lesson_content_id: 52,
        label: 'Uses',
        description: 'It converts waste into organic matter and basic minerals.',
        images: '',
    },
    {
        content_info_id: 628,
        lesson_content_id: 52,
        label: 'Purpose',
        description: 'Improve growth rate on plants and improve digestive on animals. Prevent foul odor.',
        images: '',
    },
    // M4; L2; C4 info
    {
        content_info_id: 629,
        lesson_content_id: 53,
        label: 'Introduction',
        description: 'The knowledge, skills and attitude required to produce organic fertilizers which include tasks such as preparing composting area and raw materials and carrying-out composting activities and finally, harvesting of fertilizer. Using Organic Concoction is connecting with the nature. Embracing the mystery of the environment that God created. Significance of Organic Concoctions 1. Replaces the chemical based fertilizers, pesticides, fungicides, repellants, growth enhances and other food ingredients for animals and plants; 2. Safe for carcinogenic substance; 3. An environment-friendly; 4. Low cost; and 5. Many business opportunities.',
        images: '',
    },
    {
        content_info_id: 630,
        lesson_content_id: 53,
        label: 'Produce in harvesting Organic Concoctions',
        description: '',
        images: '',
    },
    {
        content_info_id: 631,
        lesson_content_id: 53,
        label: 'Fermented Plant Juice (FPJ)',
        description: 'After Fermenting for 7 days. Extract the liquid using strainer or a piece of cloth. Keep it in a plastic container. FPJ is ready to use.',
        images: '',
    },
    {
        content_info_id: 632,
        lesson_content_id: 53,
        label: 'Fermented Fruit Juice (FFJ)',
        description: 'After Fermenting for 7 days. Extract the liquid using strainer or a piece of cloth. Keep it in a plastic container. FFJ is ready to use.',
        images: '',
    },
    {
        content_info_id: 633,
        lesson_content_id: 53,
        label: 'Fish Amino Acid (FAA)',
        description: 'After Fermenting for 7 days. Extract the liquid using strainer or a piece of cloth. Keep it in a plastic container. FAA is ready to use.',
        images: '',
    },
    {
        content_info_id: 634,
        lesson_content_id: 53,
        label: 'Oriental Herbal Nutrient (OHN)',
        description: '1. After Fermenting for 10 days. 2. Extract the liquid using strainer or a piece of cloth. 3. Keep it in a plastic container. Organic Agriculture Production Producing Organic Concoction and Exacts 4. OHN is ready to use. Calcium Phosphate (CALPHOS). After Fermenting for 30 days. Extract the liquid using strainer or a piece of cloth. Keep it in a plastic container. CALPHOS is ready to use.',
        images: '',
    },
    {
        content_info_id: 635,
        lesson_content_id: 53,
        label: 'Beneficial Microorganism (BMO)/Indigenous Microorganism (IMO)',
        description: 'After Fermenting for 1 week. Extract the liquid using strainer or a piece of cloth. Keep it in a plastic container. BMO/IMO is ready to use after fermentation.',
        images: '',
    },
    {
        content_info_id: 636,
        lesson_content_id: 53,
        label: 'Lactic Acid Bacteria Serum (LABS)',
        description: 'After Fermenting for 1 week. Extract the liquid using strainer or a piece of cloth Keep it in a plastic container. BMO/IMO is ready to use after fermentation.',
        images: '',
    },
    {
        content_info_id: 637,
        lesson_content_id: 53,
        label: 'Lactic Acid Bacteria Serum (LABS)',
        description: 'After Fermenting for 1 week. Extract the liquid using strainer or a piece of cloth Keep it in a plastic container. BMO/IMO is ready to use after fermentation.',
        images: '',
    },
    // M4; L3; C1 info
    {
        content_info_id: 638,
        lesson_content_id: 54,
        label: 'STERILIZATION',
        description: 'Staff at production and research laboratories use high-pressure steam inside autoclave to sterilize or remove all microorganisms from plastic containers. These containers must be rated safe for an autoclave as some plastics, such as HDPE and polyethylene, will melt in the course of a standard autoclave run. For those looking to sterilize plastic containers at home, a standard microwave oven will do the trick. Of course, only microwave-safe plastics ought to be sterilized in this manner. Although not appropriate for home sterilization, plastic container sterilizations also be accomplished via ethylene oxide gas sterilization, per acetic acid, ionizing graduation, dry heat, hydrogen peroxide gas plasma systems, ozone, formal dehyde steam, gaseous chlorine dioxide and infrared radiation.',
        images: '',
    },
    {
        content_info_id: 639,
        lesson_content_id: 54,
        label: 'Microwave Sterilization',
        description: '',
        images: '',
    },
    {
        content_info_id: 640,
        lesson_content_id: 54,
        label: '1. Prepare a Heat Sink',
        description: 'Fill a cup with 250 to 500 ml (about 1 to 2 cups) of water and place it in the microwave. This will act as a heat sink to ensure the plastic container inside the microwave does not get too hot and melt.',
        images: '',
    },
    {
        content_info_id: 641,
        lesson_content_id: 54,
        label: '2. Place Containers in Microwave',
        description: 'Gather together the microwave-safe containers and lids that require sterilization. Microwave containers in a secondary container for at least 3 minutes on the highest setting',
        images: '',
    },
    {
        content_info_id: 642,
        lesson_content_id: 54,
        label: '3. Take out sterilized containers',
        description: 'Remove secondary container for microwave with plastic containers inside, while maintaining sterility. Use insulated gloves, as the containers may be hot.',
        images: '',
    },
    {
        content_info_id: 643,
        lesson_content_id: 54,
        label: 'Autoclave Sterilization',
        description: '',
        images: '',
    },
    {
        content_info_id: 644,
        lesson_content_id: 54,
        label: '1. Prepare the Containers',
        description: 'Gather together autoclave-safe plastic containers and any lids that need sterilization. Lids can be loosely placed on top of containers. A tightly attached lid can cause a container to succumb to pressure within the autoclave and crack or explode.',
        images: '',
    },
    {
        content_info_id: 645,
        lesson_content_id: 54,
        label: '2. Organize the Containers',
        description: 'Place containers and lids in a secondary autoclave-safe container, making sure to leave space between containers.',
        images: '',
    },
    {
        content_info_id: 646,
        lesson_content_id: 54,
        label: '3. Follow the Operating Procedures',
        description: 'Place the secondary container in the autoclave and follow any standard operating procedures for your specific autoclave. The standard sterilizing autoclave run is at 121 degrees Celsius, 15 pounds per square inch of pressure for at least 30 minutes.',
        images: '',
    },
    {
        content_info_id: 647,
        lesson_content_id: 54,
        label: '4. Remove Sterilized Containers carefully',
        description: 'Remove the secondary container from the autoclave using thick, insulated gloves to avoid burning. The surfaces will be extremely hot.',
        images: '',
    },
    {
        content_info_id: 648,
        lesson_content_id: 54,
        label: 'How to sterilize plastic bottles',
        description: 'Step 1: Remove all the labels from your bottles before cleaning them. You can do this with scissors or by soaking the bottle in warm soapy water to dilute the glue. The method you use will depend on the actual labels. For example, soft drink bottles have labels that are only glued in one spot. Using the scissors, you can easily cut the band and then unwrap what is left. Step 2: Unscrew the tops and set them in a container of warm soapy water to avoid losing them down the drain. Step 3: Fill a large pot or sink with soap and hot water. You all want to fully submerge your bottles into the solution for a few minutes to kill any bacteria. If scratches are on the inside of the bottles, recycle them. Bacteria can become lodged in those scratches and multiply later. Step 4: Rinse the bottles and tops thoroughly. For the bottles, fill them with warm water from the tap until no soap residue is left over. You can also place the caps on the bottles and shake the water inside to see if soap bubbles appear. If they do, rinse again. Step 5: Stand the bottles upside down on a well-ventilated drying rack. Do not lay them on their sides as they all take longer to dry and may dry unevenly. Allow the bottles to dry overnight. Don not refill the bottles too soon; they must be completely dry before refilling to avoid bacterial buildup.',
        images: '',
    },
    {
        content_info_id: 649,
        lesson_content_id: 54,
        label: 'How to sterilize plastic bottles',
        description: 'Purpose To perform proper sterilization of plastic bottles: Supplies/Materials Plastic bottles, water, detergents',
        images: '',
    },
    {
        content_info_id: 650,
        lesson_content_id: 54,
        label: 'Procedure',
        description: 'Remove all the labels from your bottles before cleaning them. You can do this with scissors or by soaking the bottle in warm soapy water to dilute the glue. 2. Unscrew the tops and set them in a container of warm soapy water to avoid losing them down the drain. 3. Fill a large pot or sink with soap and hot water. You all want to fully submerge your bottles into the solution for a few minutes to kill any bacteria. If scratches are on the inside of the bottles, recycle them. 4. Rinse the bottles and tops thoroughly. For the bottles, fill them with warm water from the tap until no soap residue is left over. You can also place the caps on the bottles and shake the water inside to see if soap bubbles appear. If they do, rinse again. 5. Stand the bottles upside down on a well-ventilated drying rack. Do not lay them on their sides as they all take longer to dry and may dry unevenly. Allow the bottles to dry overnight. Do not refill the bottles too soon; they must be completely dry before refilling to avoid bacterial buildup.',
        images: '',
    },
    // M4; L3; C2 info
    {
        content_info_id: 651,
        lesson_content_id: 55,
        label: 'PROPER LABELING AND PACKAGING',
        description: 'Importance of labeling and packaging another main purpose of the use of labeling and packaging is to exaggerate the product. A marketer needs to grab the attention of a viewer to purchase the product. Labeling and packaging should be able to beautify a product to add to its visual appeal. This can instantly grab a viewer’s attention towards a product. You can arouse interest in the mind of a customer towards a product through an attractively designed label. It is essential to use a good quality material for the sticker.',
        images: '',
    },
    {
        content_info_id: 652,
        lesson_content_id: 55,
        label: 'A label needs to comply with the Competition and Consumer Act 2010 (CCA). This Act is required to give information to consumers, such as:',
        description: 'The mandatory consumer product information standards under the CCA Industry specific regulations, such as the Food Standards Code. Labels required by customs for some imported products under the Commerce (Trade Descriptions) Act: The role of packaging and labeling has become quite significant as it helps to grab. Attention of the audience: Labelling and packaging can be used by marketers to encourage potential buyers. Purchase the product: Packaging is also used for convenience and information transmission. Packages and labels communicate how to use, transport, recycle or dispose of the package or product.',
        images: '',
    },
    {
        content_info_id: 653,
        lesson_content_id: 55,
        label: 'Name of',
        description: 'True nature of the Product; state type of treatment it has undergone; the name of the product shall be presented in bold type letters; a complete list of raw materials shall Ingredients be declared in descending order of proportion; A specific name, not collective (generic) name shall use as an ingredient.',
        images: '',
    },
    {
        content_info_id: 654,
        lesson_content_id: 55,
        label: 'The name',
        description: 'The name and address of the and address manufacturer, packer or the distributor of the of the food shall be declared in the manufacturer, label. Packer or distributor; if the product is not manufactured by person or company whose appear in the label, the name must be qualified  by manufactured for or packed for or similar expression.',
        images: '',
    },
    {
        content_info_id: 655,
        lesson_content_id: 55,
        label: 'Manufacturing',
        description: 'The date when the product was and manufactured and the date of expiration shall be placed visibly within Date the label.',
        images: '',
    },
    // M4; L3; C3 info
    {
        content_info_id: 656,
        lesson_content_id: 56,
        label: 'Introduction',
        description: 'Storage Requirements of various concoctions. Store the covered container in a well-ventilated area away from artificial or natural light and extreme heat or cold. Do not refrigerate. In order for the fermentation process to occur properly, the volume of the plant-material-and-brown-sugar mixture should settle to 2/3 of the container after 24 hours.',
        images: '',
    },
    {
        content_info_id: 657,
        lesson_content_id: 56,
        label: 'Storage Requirements of various concoctions',
        description: '',
        images: '',
    },
    {
        content_info_id: 658,
        lesson_content_id: 56,
        label: 'Fermented Fruit Juice',
        description: 'Store the container with the bagged mixture for 7 days in a cool dry shady place. Make sure that the storage area is not infested with cockroaches or mice, because they might feed on the mixture and contaminate the extracts. In 7 days, plant juice is extracted and fermented. The fruit extract will change its color from yellow orange to brown and will smell sweet and alcoholic. After 7 days, lift the bagged mixture and squeeze hard to get the remaining extracts.',
        images: '',
    },
    {
        content_info_id: 659,
        lesson_content_id: 56,
        label: 'Fermented Plant Juice',
        description: 'Polyethylene or glass products or clay jar may be used as a container. When using glass bottles, brown glass containers must be preferred. Store in a cool place. Select a shaded area where there is no direct sunlight and where the temperature does not fluctuate. Direct sunlight should be avoided. The optimum temperature range is 1 to15ºC for storage (Use a Refrigerator if available) if you want to keep for one year. Otherwise one can use within 30 days store at room temperature.',
        images: '',
    },
    {
        content_info_id: 660,
        lesson_content_id: 56,
        label: 'Fish Amino Acid',
        description: 'Store the container with the mixture for 4 weeks in a cool dry shady place. Make sure that the storage area is not infested with cockroaches or mice because they might feed on the mixture and contaminate the extract. The mixture may be appealing to the house pets so make sure that it is properly secured. In a month’s time, the fermented extract is ready.',
        images: '',
    },
    {
        content_info_id: 661,
        lesson_content_id: 56,
        label: 'Lactic Acid Bacteria Serum (LABS)',
        description: 'Keep the refined LAB serum at cool temperature, so for longer period where there is temperature change (1-15°C ). No storage under direct sunlight. In order to keep LAB at a normal temperature it must be mixed with the same amount of brown sugar and stirred with a wooden stick (ladle). Note: Using rice-washed water in obtaining lactic acid bacteria is to collect stronger ones. Only strong ones can survive in poor nutrients condition like rice washed water.',
        images: '',
    },
    {
        content_info_id: 662,
        lesson_content_id: 56,
        label: 'Oriental Herbs Nutrients (OHN)',
        description: 'The jar must cover it with tight lid / vinyl film. Stir the mixture gently clockwise every day morning for a week. Leave it for 4-6 days. Filter the content and keep the extraction in another jar for long-term storage. The extracting process is difficult add water to extract juice this can be used within 45 days.',
        images: '',
    },
    {
        content_info_id: 663,
        lesson_content_id: 56,
        label: 'Indigenous Microorganism',
        description: 'Keep the IMO3 bags in shaded and cool place. Make sure that the air is well circulated by keeping IMO-3 in a ventilated container such as jute / gunny / cloth bags. First, spread rice straw or leaf litter at the bottom of the container, and put in IMO-3. During storage, the IMO-3 may become dry (moisture level 20-30%) as the moisture gets evaporated. It means that the IMOs have entered a sleeping phase (state of dormancy). Pile up containers into 3 layers and shield them from direct sunlight and rain. At this point, there is no need to turn over, because of the convection currents that are created through the gaps of containers.',
        images: '',
    },
    {
        content_info_id: 664,
        lesson_content_id: 56,
        label: 'TEMPERATURE AND SHELFLIFE REQUIREMENT',
        description: '',
        images: '',
    },
    {
        content_info_id: 665,
        lesson_content_id: 56,
        label: 'Temperature Control',
        description: 'There should be active mechanical temperature control and no direct sources of heat (sunny windows, steam pipes, furnaces, etc.). Most are fairly stable at room temperature. 4 degrees Celsius should be ok for most plant extracts. I would also suggest keeping it out of light as well. As light can alter certain compound and decrease their potency and change their structure, Shelf life.',
        images: '',
    },
    {
        content_info_id: 666,
        lesson_content_id: 56,
        label: 'Various concoctions and extracts packaged in bottles/ containers',
        description: 'The sealed bottles or other package prevents contamination during storage and transport. The concoctions/extracts will have a long but not an indefinite storage life. The storage life depends on several factors, but especially on the nature of the product and the conditions of storage. Concoctions have a storage life for many years. As a general rule, the lower the storage temperature, the longer the storage life will be.',
        images: '',
    },


    




    

























];

async function seedContentInfo() {
    const existingContentInfoRecord = await listContentInfo();
    const existingId = new Set(existingContentInfoRecord.map((record) => record.content_info_id));

    let insertCount = 0;
    for (const contentInfoInput of SEED_CONTENT_INFORMATION) {
        if (existingId.has(contentInfoInput.content_info_id)) {
            continue;
        }

        await createContentInfo(contentInfoInput);
        insertCount += 1;
    }

    console.log(`Seed ${insertCount} content info record(s).`);

}

seedContentInfo().catch((error) => {
    console.error('Failed to seed content info.', error);
    process.exitCode = 1;
})
