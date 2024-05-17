import { RoundData } from "@/misc/RoundDataTypes";

export interface dateInterFace {
  name: string;
  created: Date;
  template: string;
  numberOfRespondents: number;
  _id: string;
  editId: string;
  coworker: string[];
  lastresponsedate: string;

}

export const sampleData: dateInterFace[] = [
  {
    name: "KTH Period 3",
    created: new Date("2024-01-16"),
    template: "magello",
    numberOfRespondents: 4,
    _id: "66460a2b4c82500bb88ac220",
    editId: "c66e01d4-ec1d-45c1-94a0-5f5e89a02b39",
    coworker:["Dag Reuterskiöld", "Erik Von Knorring"],
    lastresponsedate: "2024-06-16",
  },
  {
    name: "EventAppen Retro",
    created: new Date("2024-01-04"),
    template: "magello",
    numberOfRespondents: 1,
    _id: "66460a2b4c82500bb88ac220",
    editId: "c66e01d4-ec1d-45c1-94a0-5f5e89a02b39",
    coworker:["Erik Von Knorring"],
    lastresponsedate: "2024-06-16",
  },
  {
    name: "Inför lönerev",
    created: new Date("2024-01-02"),
    template: "lön",
    numberOfRespondents: 3,
    _id: "66460a2b4c82500bb88ac220",
    editId: "c66e01d4-ec1d-45c1-94a0-5f5e89a02b39",
    coworker:["Alexander Bard"],
    lastresponsedate: "2024-06-16",
  },
  {
    name: "Dags möhippa",
    created: new Date("2024-04-03"),
    template: "lön",
    numberOfRespondents: 2,
    _id: "66460a2b4c82500bb88ac220",
    editId: "c66e01d4-ec1d-45c1-94a0-5f5e89a02b39",
    coworker:["Isak Reuterskiöld"],
    lastresponsedate: "2024-06-16",
  },
];

export type Coworkers = {
  name: string;
};

export const sampleDataCoworkers: Coworkers[] = [
  {
    name: "Dag Reuterskiöld",
  },
  {
    name: "Erik Von Knorring",
  },
  {
    name: "Alexander Bard",
  },
  {
    name: "Isak Reuterskiöld",
  },
  {
    name: "Kristin Rosenhall",
  },
  {
    name: "Patrik Jansson",
  },
  {
    name: "Per Daynac",
  },
  {
    name: "Johan Ytterberg",
  },
  {
    name: "Samir Talic",
  },
  {
    name: "Test Testsson",
  },
  {
    name: "Alexander Bard Junior",
  },
  {
    name: "Isak Reuterskiöld Junior",
  },
  {
    name: "Kristin Rosenhall Senior",
  },
  {
    name: "Patrik Jansson Cheef",
  },
  {
    name: "Per Daynac Senior",
  },
];

export const roundSampleData: RoundData = {
  name: "Sample Round",
  roundId: "7f3a1fd0-9c61-4f2d-b62c-06b7af3092ac",
  editId: "c66e01d4-ec1d-45c1-94a0-5f5e89a02b39",
  authorizedUsers: [{ userName: "Dag Reuterskiöld", userId: "dagge" }],
  authorizedUserIds: ["dagge"],
  created: new Date(),
  answers: [
    {
      userId: "user1",
      isAnonymous: false,
      answers: {
        q1: {
          score: 3,
          motivation: "I believe this is the correct answer because...",
        },
        q2: {
          score: 4,
          motivation: "This option resonates with me because...",
        },
        q3: {
          score: 2,
          motivation: "I'm not entirely sure about this answer, but...",
        },
        q4: {
          score: 5,
          motivation: "I strongly agree with this statement because...",
        },
        q5: {
          score: 3,
          motivation:
            "Based on my experience, I think this is the right choice...",
        },
        q6: {
          score: 4,
          motivation: "This aligns with my research findings...",
        },
        q7: {
          score: 1,
          motivation:
            "I'm not confident in my answer, but I'll choose this for now...",
        },
        q8: {
          score: 2,
          motivation: "I'm leaning towards this option because...",
        },
        q9: {
          score: 5,
          motivation: "This answer seems logical and well-supported...",
        },
        q10: {
          score: 3,
          motivation: "I agree with this perspective because...",
        },
        q11: {
          score: 4,
          motivation: "This resonates with my personal beliefs and values...",
        },
        q12: {
          score: 2,
          motivation:
            "I'm uncertain about this answer, but it seems plausible...",
        },
        q13: {
          score: 5,
          motivation: "I strongly support this idea because...",
        },
        q14: {
          score: 3,
          motivation:
            "After considering all options, this seems like the best choice...",
        },
      },
    },
    {
      userId: "user2",
      isAnonymous: false,
      answers: {
        q1: {
          score: 2,
          motivation: "I'm not entirely sure about this answer, but...",
        },
        q2: {
          score: 5,
          motivation: "I strongly agree with this statement because...",
        },
        q3: {
          score: 3,
          motivation:
            "This seems like a reasonable choice based on the information provided...",
        },
        q4: {
          score: 4,
          motivation: "I agree with this perspective because...",
        },
        q5: {
          score: 2,
          motivation: "This option seems plausible given the context...",
        },
        q6: {
          score: 5,
          motivation: "This is supported by recent studies in the field...",
        },
        q7: {
          score: 3,
          motivation:
            "I'm unsure about my answer, but this seems like a reasonable choice...",
        },
        q8: {
          score: 4,
          motivation:
            "After weighing the options, this seems like the most appropriate choice...",
        },
        q9: {
          score: 2,
          motivation:
            "I'm not fully convinced by this answer, but I'll go with it for now...",
        },
        q10: {
          score: 5,
          motivation:
            "This aligns perfectly with my understanding of the topic...",
        },
        q11: {
          score: 3,
          motivation:
            "This reflects my personal experience and observations...",
        },
        q12: {
          score: 4,
          motivation: "This is in line with the theory I've studied...",
        },
        q13: {
          score: 2,
          motivation:
            "I have reservations about this idea, but it's the best option available...",
        },
        q14: {
          score: 5,
          motivation: "I strongly believe in this solution because...",
        },
      },
    },
    {
      userId: "user3",
      isAnonymous: true,
      answers: {
        q1: {
          score: 4,
          motivation: "I strongly believe this is the right answer because...",
        },
        q2: {
          score: 3,
          motivation: "This option makes sense given the context...",
        },
        q3: {
          score: 5,
          motivation:
            "After thorough consideration, this seems like the most appropriate choice...",
        },
        q4: {
          score: 2,
          motivation:
            "I have some doubts about this perspective, but it's worth considering...",
        },
        q5: {
          score: 4,
          motivation:
            "This is consistent with my understanding of the topic...",
        },
        q6: {
          score: 3,
          motivation:
            "Based on available evidence, this seems like a reasonable conclusion...",
        },
        q7: {
          score: 5,
          motivation:
            "I'm confident in this choice because it aligns with established principles...",
        },
        q8: {
          score: 1,
          motivation:
            "I'm unsure about this answer, but it's the best I can come up with at the moment...",
        },
        q9: {
          score: 4,
          motivation:
            "This is a well-reasoned response supported by relevant data...",
        },
        q10: {
          score: 2,
          motivation:
            "I have some reservations about this perspective, but I'll go with it for now...",
        },
        q11: {
          score: 5,
          motivation: "This resonates with my values and beliefs strongly...",
        },
        q12: {
          score: 3,
          motivation:
            "After considering various factors, this seems like the most reasonable choice...",
        },
        q13: {
          score: 1,
          motivation:
            "I'm not entirely convinced by this idea, but it's the only option that fits...",
        },
        q14: {
          score: 4,
          motivation:
            "This solution seems practical and feasible given the circumstances...",
        },
      },
    },
  ],
  templateId: "5f5e01d4-94a0-45c1-ec1d-c66e89a02b39",
  templateData: {
    templateId: "5f5e01d4-94a0-45c1-ec1d-c66e89a02b39",
    templateName: "Sample Template",
    scoreScale: {
      start: 1,
      end: 6,
      descriptions: [
        {
          score: "1",
          title: "Oacceptabelt",
          description:
            " Anställd når inte upp till mål/ förväntade resultat. Handlingsplan bör upprättas. ",
        },
        {
          score: "2",
          title: "Inte så bra",
          description:
            "Den anställda når inte alltid upp till målen/ de förväntade resultaten. Brist på kompetens och resultat mot förväntat för sin roll.",
        },
        {
          score: "3",
          title: "Acceptabelt",
          description:
            "Har rätt kompetens för vad som förväntas i sin roll. Godkänd prestation.",
        },
        {
          score: "4",
          title: "Bra",
          description: "Hög nivå på prestation och kompetens.",
        },
        {
          score: "5",
          title: "Mycket bra",
          description:
            "Hög nivå på prestation och kompetens med extra energi, analys och engagemang.",
        },
        {
          score: "6",
          title: "Fantastiskt",
          description:
            "Presterar konsekventa på en väldigt hög nivå från alla aspeketer av sin roll med enastående kompetens.",
        },
      ],
    },
    mandatoryMotivations: true,
    categories: [
      {
        categoryName: "Lärande",
        questions: [
          {
            id: "q1",
            text: "Tar sig för kunskaper proaktivt i vardagen och mår bra av egenutveckling",
          },
          {
            id: "q2",
            text: "Delar med sig av kunskap och erfarenheter till sina teammedlemmar och kollegor runtomkring",
          },
          {
            id: "q3",
            text: "Har en hög grad av nyfikenhet av att lära sig nytt och förkovrar sig gärna i både teknik och metodik",
          },
        ],
      },
      {
        categoryName: "Trygga",
        questions: [
          {
            id: "q4",
            text: "Bidrar till en miljö där alla kan agera självständigt, snabbt och med teamets prioriteringar i åtanke",
          },
          { id: "q5", text: "Är trygg i sin kompetens och agerar därefter" },
          {
            id: "q6",
            text: "Litar på sig själv och andra runtomkring för att fatta beslut och bidra",
          },
          {
            id: "q7",
            text: "Är tillräckligt trygg i sin kompetens för att våga be om hjälp och testa nya saker",
          },
        ],
      },
      {
        categoryName: "Kommunikativa",
        questions: [
          {
            id: "q8",
            text: "Kommunicerar sitt budskap på ett konkret sätt och med en tydlighet att syftet är att hen vill mottagaren väl",
          },
          {
            id: "q9",
            text: "Ger en tydlig förväntansbild av vad som förväntas av sin omgivning",
          },
          {
            id: "q10",
            text: "Skapar förtroende inom Magello och i relation med våra kunder och partners",
          },
        ],
      },
      {
        categoryName: "Personliga",
        questions: [
          {
            id: "q11",
            text: "Visar omtanke och är inlyssnande och inkännande",
          },
          {
            id: "q12",
            text: "Försöker alltid i så stor utsträckning som möjligt hitta den bästa lösningen för alla parter",
          },
          { id: "q13", text: "Är enkel och behaglig att ha att göra med" },
          {
            id: "q14",
            text: "Upplevs som professionell och samtidigt mänsklig",
          },
        ],
      },
    ],
    colorScale: {
      colorName: "Sample Color Scale",
      hexValues: ["#FF5733", "#33FF57", "#3357FF", "#5733FF", "#57FF33"],
    },
  },
};

export const chartDataA = [
  {
    subject: "Math",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "Chinese",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "English",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Geography",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "Physics",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "History",
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

export const chartDataB = [
  {
    id: "q1",
    text: "Tar sig för kunskaper proaktivt i vardagen och mår bra av egenutveckling",
    subject: "Lärande",
    user1: 2,
    // user2: 4,
    // user3: 3,
  },
  {
    id: "q2",
    text: "Delar med sig av kunskap och erfarenheter till sina teammedlemmar och kollegor runtomkring",
    subject: "Lärande",
    user1: 5,
    // user2: 3,
    // user3: 4,
  },
  {
    id: "q3",
    text: "Har en hög grad av nyfikenhet av att lära sig nytt och förkovrar sig gärna i både teknik och metodik",
    subject: "Lärande",
    user1: 3,
    // user2: 5,
    // user3: 2,
  },
  {
    id: "q4",
    text: "Bidrar till en miljö där alla kan agera självständigt, snabbt och med teamets prioriteringar i åtanke",
    subject: "Trygga",
    user1: 4,
    // user2: 2,
    // user3: 5,
  },
  {
    id: "q5",
    text: "Är trygg i sin kompetens och agerar därefter",
    subject: "Trygga",
    user1: 2,
    // user2: 4,
    // user3: 3,
  },
  {
    id: "q6",
    text: "Litar på sig själv och andra runtomkring för att fatta beslut och bidra",
    subject: "Trygga",
    user1: 5,
    // user2: 3,
    // user3: 4,
  },
  {
    id: "q7",
    text: "Är tillräckligt trygg i sin kompetens för att våga be om hjälp och testa nya saker",
    subject: "Trygga",
    user1: 3,
    // user2: 5,
    // user3: 1,
  },
  {
    id: "q8",
    text: "Kommunicerar sitt budskap på ett konkret sätt och med en tydlighet att syftet är att hen vill mottagaren väl",
    subject: "Kommunikativa",
    user1: 4,
    // user2: 1,
    // user3: 2,
  },
  {
    id: "q9",
    text: "Ger en tydlig förväntansbild av vad som förväntas av sin omgivning",
    subject: "Kommunikativa",
    user1: 2,
    // user2: 4,
    // user3: 5,
  },
  {
    id: "q10",
    text: "Skapar förtroende inom Magello och i relation med våra kunder och partners",
    subject: "Kommunikativa",
    user1: 5,
    // user2: 2,
    // user3: 3,
  },
  {
    id: "q11",
    text: "Visar omtanke och är inlyssnande och inkännande",
    subject: "Personliga",
    user1: 3,
    // user2: 5,
    // user3: 4,
  },
  {
    id: "q12",
    text: "Försöker alltid i så stor utsträckning som möjligt hitta den bästa lösningen för alla parter",
    subject: "Personliga",
    user1: 4,
    // user2: 3,
    // user3: 2,
  },
  {
    id: "q13",
    text: "Är enkel och behaglig att ha att göra med",
    subject: "Personliga",
    user1: 2,
    // user2: 1,
    // user3: 5,
  },
  {
    id: "q14",
    text: "Upplevs som professionell och samtidigt mänsklig",
    subject: "Personliga",
    user1: 5,
    // user2: 4,
    // user3: 3,
  },
];

export const roundInsert = {
  lastDateToAnswer: "2024-05-24",
  name: "New Sample Round 12345",
  authorizedUsers: [
    {
      userName: "Dag Reuterskiöld",
      userId: "dagge",
    },
    {
      userName: "Bob Johnson",
      userId: "bob",
    },
  ],
  templateId: "aabbccdd-0011-2233-4455-66778899aabb",
};

interface TemplateData {
  id: string;
  name: string;
}

export const templateData: TemplateData[] = [
  {id: "1", name:"magello"},
  {id: "2", name:"lön"},
  {id: "3", name:"test"}
]

