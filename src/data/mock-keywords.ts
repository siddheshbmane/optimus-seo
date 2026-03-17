export interface Keyword {
  id: string;
  keyword: string;
  position: number;
  previousPosition: number;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: "commercial" | "informational" | "navigational" | "transactional";
  type: "short-tail" | "long-tail" | "branded" | "generic";
  url: string;
  trend: number[];
  featuredSnippet: boolean;
  paaQuestions: string[];
}

export const mockKeywords: Keyword[] = [
  {
    id: "kw-1",
    keyword: "seo services",
    position: 3,
    previousPosition: 5,
    volume: 14800,
    difficulty: 72,
    cpc: 12.5,
    intent: "commercial",
    type: "short-tail",
    url: "/services/seo",
    trend: [12000, 13500, 14200, 14800, 15100, 14800],
    featuredSnippet: false,
    paaQuestions: [
      "What are SEO services?",
      "How much do SEO services cost?",
      "Are SEO services worth it?",
    ],
  },
  {
    id: "kw-2",
    keyword: "best seo agency near me",
    position: 1,
    previousPosition: 2,
    volume: 8900,
    difficulty: 45,
    cpc: 18.2,
    intent: "transactional",
    type: "long-tail",
    url: "/",
    trend: [7500, 8000, 8200, 8500, 8700, 8900],
    featuredSnippet: true,
    paaQuestions: [
      "How do I find a good SEO agency?",
      "What should I look for in an SEO agency?",
    ],
  },
  {
    id: "kw-3",
    keyword: "how to improve website ranking",
    position: 7,
    previousPosition: 12,
    volume: 22100,
    difficulty: 58,
    cpc: 4.8,
    intent: "informational",
    type: "long-tail",
    url: "/blog/improve-website-ranking",
    trend: [18000, 19500, 20000, 21000, 21500, 22100],
    featuredSnippet: false,
    paaQuestions: [
      "How long does it take to improve website ranking?",
      "What factors affect website ranking?",
      "Can I improve my ranking for free?",
    ],
  },
  {
    id: "kw-4",
    keyword: "acme corp",
    position: 1,
    previousPosition: 1,
    volume: 1200,
    difficulty: 12,
    cpc: 0.5,
    intent: "navigational",
    type: "branded",
    url: "/",
    trend: [1000, 1050, 1100, 1150, 1180, 1200],
    featuredSnippet: false,
    paaQuestions: [],
  },
  {
    id: "kw-5",
    keyword: "local seo optimization",
    position: 5,
    previousPosition: 8,
    volume: 6700,
    difficulty: 52,
    cpc: 8.9,
    intent: "commercial",
    type: "long-tail",
    url: "/services/local-seo",
    trend: [5500, 5800, 6000, 6200, 6500, 6700],
    featuredSnippet: true,
    paaQuestions: [
      "What is local SEO?",
      "How do I optimize for local search?",
    ],
  },
  {
    id: "kw-6",
    keyword: "keyword research tools",
    position: 12,
    previousPosition: 15,
    volume: 18500,
    difficulty: 68,
    cpc: 6.2,
    intent: "informational",
    type: "long-tail",
    url: "/blog/keyword-research-tools",
    trend: [15000, 16000, 17000, 17500, 18000, 18500],
    featuredSnippet: false,
    paaQuestions: [
      "What is the best free keyword research tool?",
      "How do I do keyword research?",
    ],
  },
  {
    id: "kw-7",
    keyword: "backlink building service",
    position: 4,
    previousPosition: 6,
    volume: 4200,
    difficulty: 61,
    cpc: 15.8,
    intent: "transactional",
    type: "long-tail",
    url: "/services/link-building",
    trend: [3500, 3700, 3900, 4000, 4100, 4200],
    featuredSnippet: false,
    paaQuestions: [
      "How much does link building cost?",
      "Is buying backlinks safe?",
    ],
  },
  {
    id: "kw-8",
    keyword: "technical seo audit",
    position: 2,
    previousPosition: 3,
    volume: 5600,
    difficulty: 55,
    cpc: 11.2,
    intent: "commercial",
    type: "long-tail",
    url: "/services/technical-seo",
    trend: [4800, 5000, 5200, 5400, 5500, 5600],
    featuredSnippet: true,
    paaQuestions: [
      "What is a technical SEO audit?",
      "How often should I do a technical SEO audit?",
    ],
  },
  {
    id: "kw-9",
    keyword: "content marketing strategy",
    position: 9,
    previousPosition: 14,
    volume: 12300,
    difficulty: 64,
    cpc: 7.5,
    intent: "informational",
    type: "long-tail",
    url: "/blog/content-marketing-strategy",
    trend: [10000, 10500, 11000, 11500, 12000, 12300],
    featuredSnippet: false,
    paaQuestions: [
      "How do I create a content marketing strategy?",
      "What are the types of content marketing?",
    ],
  },
  {
    id: "kw-10",
    keyword: "seo consultant",
    position: 6,
    previousPosition: 9,
    volume: 9800,
    difficulty: 58,
    cpc: 14.2,
    intent: "transactional",
    type: "short-tail",
    url: "/about",
    trend: [8500, 8800, 9000, 9300, 9500, 9800],
    featuredSnippet: false,
    paaQuestions: [
      "What does an SEO consultant do?",
      "How much does an SEO consultant charge?",
    ],
  },
];

// Generate more keywords for rich data
export function generateMockKeywords(count: number): Keyword[] {
  const baseKeywords = [
    "digital marketing",
    "website optimization",
    "google ranking",
    "search engine optimization",
    "organic traffic",
    "on-page seo",
    "off-page seo",
    "meta tags",
    "site speed",
    "mobile optimization",
    "voice search optimization",
    "featured snippets",
    "schema markup",
    "core web vitals",
    "page experience",
  ];

  const intents: Keyword["intent"][] = [
    "commercial",
    "informational",
    "navigational",
    "transactional",
  ];
  const types: Keyword["type"][] = [
    "short-tail",
    "long-tail",
    "branded",
    "generic",
  ];

  const generated: Keyword[] = [...mockKeywords];

  for (let i = mockKeywords.length; i < count; i++) {
    const baseKw = baseKeywords[i % baseKeywords.length];
    const suffix = i > baseKeywords.length ? ` ${Math.floor(i / baseKeywords.length)}` : "";
    
    generated.push({
      id: `kw-${i + 1}`,
      keyword: `${baseKw}${suffix}`,
      position: Math.floor(Math.random() * 100) + 1,
      previousPosition: Math.floor(Math.random() * 100) + 1,
      volume: Math.floor(Math.random() * 50000) + 100,
      difficulty: Math.floor(Math.random() * 100),
      cpc: Math.round(Math.random() * 20 * 100) / 100,
      intent: intents[Math.floor(Math.random() * intents.length)],
      type: types[Math.floor(Math.random() * types.length)],
      url: `/page-${i}`,
      trend: Array.from({ length: 6 }, () => Math.floor(Math.random() * 10000)),
      featuredSnippet: Math.random() > 0.8,
      paaQuestions: [],
    });
  }

  return generated;
}
