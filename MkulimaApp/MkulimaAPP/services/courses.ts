export type Lesson = {
id: string;
title: string;
type: 'text' | 'video';
contentText?: string | { en: string; sw: string };
contentUri?: string;
};

export type Course = {
id: string;
title: string;
description: string | { en: string; sw: string };
imageUri?: string;
lessons: Lesson[];
};

export const demoCourses: Course[] = [
{
id: 'c1',
title: 'Sustainable Farming for Beginners',
description: {
en: 'Practical methods for starting a farm that works with nature, not against it.',
sw: 'Mbinu za vitendo za kuanzisha kilimo kinachoheshimu mazingira.',
},
imageUri:
'https://media.licdn.com/dms/image/v2/D4E22AQG7LJaNQBbJjg/feedshare-shrink_800/feedshare-shrink_800/0/1690959416569?e=2147483647&v=beta&t=h7buBcGTEqqJb9OVam6AsuHFJjhPHR8od31Sdw_ttVQ',
lessons: [
{
id: 'l1',
title: 'Understanding Sustainable Farming',
type: 'text',
contentText: {
en: 'Sustainable farming means using natural methods to grow food while protecting the environment. You can start with small actions like using compost, planting local crops, and avoiding chemicals.',
sw: 'Kilimo endelevu ni kutumia mbinu za asili kulima chakula bila kuharibu mazingira. Anza kwa kutumia mboji, kupanda mazao ya kienyeji, na kuepuka kemikali.',
},
},
{
id: 'l2',
title: 'Video: Introduction to Sustainable Farming (Swahili)',
        type: 'video',
        contentUri: 'https://www.youtube.com/embed/1pLOE-d1czc',
      },
      {
        id: 'l3',
        title: 'Simple Techniques for Smallholders',
        type: 'text',
        contentText: {
          en: '🌱 Mulching: Cover soil with dry grass to keep moisture.\n🌿 Intercropping: Plant maize and beans together.\n💧 Rainwater Harvesting: Dig small basins around crops to collect water.',
          sw: '🌱 Mulching: Funika udongo kwa nyasi kavu kuhifadhi unyevu.\n🌿 Mchanganyiko: Panda mahindi na maharagwe pamoja.\n💧 Kuvuna Maji ya Mvua: Chimba mashimo madogo kuzunguka mazao.',
        },
      },
      {
        id: 'l4',
        title: 'Crop Rotation Importance',
        type: 'text',
        contentText: {
          en: 'Rotating crops yearly helps prevent soil depletion and breaks pest cycles. For example, rotate maize with legumes like beans to restore nitrogen.',
          sw: 'Kugeuza mazao kila mwaka husaidia kuzuia upungufu wa udongo na kuzuia wadudu. Mfano, geuza mahindi na maharagwe kuongeza nitrojeni.',
        },
      },
    ],
  },
  {
    id: 'c2',
    title: 'Organic Pest & Disease Control',
    description: {
      en: 'Learn natural ways to protect your crops without chemicals.',
      sw: 'Jifunze njia asilia za kulinda mazao yako bila kutumia kemikali.',
    },
    imageUri: 'https://cropcirclefarms.com/images/crop-rotation.png',
    lessons: [
      {
        id: 'l1',
        title: 'Why Go Organic?',
        type: 'text',
        contentText: {
          en: 'Using organic pest control avoids harming soil, health, and beneficial insects. You can make solutions using ingredients like garlic, neem, chili, and soap.',
          sw: 'Udhibiti wa wadudu kwa njia ya asili huepusha madhara kwa udongo, afya, na wadudu wa msaada. Tumia vitunguu saumu, mwarobaini, pilipili, na sabuni.',
        },
      },
      {
        id: 'l2',
        title: 'Video: Natural Pest Control Using Neem Leaves',
        type: 'video',
        contentUri: 'https://www.youtube.com/embed/Y-FDNoG7kTU',
      },
      {
        id: 'l3',
        title: 'DIY Garlic-Chili Spray Recipe',
        type: 'text',
        contentText: {
          en: '🧄 Ingredients:\n- 5 garlic cloves\n- 2 chilies\n- 1L water\n- A small piece of soap\n\n🔧 Steps:\n1. Crush garlic and chilies.\n2. Mix with water.\n3. Add grated soap.\n4. Spray on leaves weekly.',
          sw: '🧄 Viambato:\n- Vitunguu saumu 5\n- Pilipili 2\n- Lita 1 ya maji\n- Kipande kidogo cha sabuni\n\n🔧 Hatua:\n1. Twanga vitunguu na pilipili.\n2. Changanya na maji.\n3. Ongeza sabuni iliyokunwa.\n4. Nyunyiza kwenye majani kila wiki.',
        },
      },
      {
        id: 'l4',
        title: 'Preventing Disease Spread',
        type: 'text',
        contentText: {
          en: 'Remove infected plants early, sanitize tools, and rotate crops to prevent diseases.',
          sw: 'Ondoa mimea iliyoathirika mapema, safisha zana za kilimo, na geuza mazao kuzuia magonjwa.',
        },
      },
    ],
  },
  {
    id: 'c3',
    title: 'Natural Pest Management',
    description: {
      en: 'Improve your pest control without chemicals and keep crops safe.',
      sw: 'Boresha udhibiti wa wadudu bila kemikali ili kulinda mazao yako.',
    },
    imageUri: 'https://paidepo.com/cdn/shop/articles/Natural_Pest_Control.png?v=1625029647',
    lessons: [
      {
        id: 'l1',
        title: 'Why Soil Health Matters',
        type: 'text',
        contentText: {
          en: 'Healthy soil grows stronger crops and resists pests better. Add organic matter like manure, compost, and crop remains.',
          sw: 'Udongo wenye afya huleta mazao yenye nguvu na kustahimili wadudu. Ongeza mbolea, mboji, na masalia ya mazao.',
        },
      },
      {
        id: 'l2',
        title: 'Video: How to Make Compost at Home',
        type: 'video',
        contentUri: 'https://www.youtube.com/embed/49amDbaZrL4',
      },
      {
        id: 'l3',
        title: '3-Step Composting Guide',
        type: 'text',
        contentText: {
          en: '🔄 1. Mix dry (leaves, maize stalks) and wet (kitchen waste, manure).\n💧 2. Keep it moist, not soggy.\n🔁 3. Turn weekly. Ready in 1–2 months.',
          sw: '🔄 1. Changanya kavu (majani, mabaki ya mahindi) na mvua (taka za jikoni, samadi).\n💧 2. Hifadhi unyevu bila kulowesha sana.\n🔁 3. Geuza kila wiki. Tayari ndani ya miezi 1–2.',
        },
      },
      {
        id: 'l4',
        title: 'Benefits of Mulching',
        type: 'text',
        contentText: {
          en: 'Mulching conserves moisture, prevents erosion, and adds organic matter to the soil.',
          sw: 'Mulching huhifadhi unyevu, kuzuia mmomonyoko, na kuongeza mboji kwenye udongo.',
        },
      },
    ],
  },
  {
    id: 'c4',
    title: 'Soil Management Essentials',
    description: {
      en: 'Understand soil types, nutrients, and care for high productivity.',
      sw: 'Fahamu aina za udongo, virutubisho, na utunzaji bora wa udongo kwa ajili ya uzalishaji mzuri.',
    },
    imageUri: 'https://farmbizafrica.com/wp-content/uploads/2024/11/soilcares_package-1-1-1.jpg',
    lessons: [
      {
        id: 'l1',
        title: 'Soil Types & Identification',
        type: 'text',
        contentText: {
          en: 'Learn how to identify sandy, loamy, and clay soils, and how to improve each for farming.',
          sw: 'Jifunze kutambua udongo wa mchanga, tifutifu, na mfinyanzi, na jinsi ya kuboresha kwa kilimo.',
        },
      },
      {
        id: 'l2',
        title: 'Essential Nutrients for Plants',
        type: 'text',
        contentText: {
          en: 'Nitrogen, phosphorus, and potassium are essential. Compost and manure help boost these nutrients.',
          sw: 'Nitrojeni, fosforasi, na potasiamu ni muhimu. Tumia mboji na samadi kuongeza virutubisho hivi.',
        },
      },
      {
        id: 'l3',
        title: 'Video: Soil Testing Methods',
        type: 'video',
        contentUri: 'https://www.youtube.com/embed/qR7XtovR9z4',
      },
      {
        id: 'l4',
        title: 'Using Lime to Balance Soil pH',
        type: 'text',
        contentText: {
          en: 'Acidic soils can be neutralized by adding lime. Test your soil before applying.',
          sw: 'Udongo wenye asidi unaweza kutengenezwa kwa kuongeza chokaa. Pima udongo kabla ya kutumia.',
        },
      },
    ],
  },
];
