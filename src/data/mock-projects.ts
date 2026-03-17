export interface Project {
  id: string;
  name: string;
  url: string;
  location: string;
  locationCode: number;
  healthScore: number;
  keywords: number;
  backlinks: number;
  traffic: number;
  trafficTrend: number;
  status: "active" | "paused" | "completed";
  createdAt: string;
  lastUpdated: string;
  agents: {
    running: number;
    completed: number;
    failed: number;
  };
}

export const mockProjects: Project[] = [
  {
    id: "acme-corp",
    name: "Acme Corp",
    url: "https://acmecorp.com",
    location: "United States",
    locationCode: 2840,
    healthScore: 72,
    keywords: 847,
    backlinks: 234,
    traffic: 45200,
    trafficTrend: 12.5,
    status: "active",
    createdAt: "2026-01-15",
    lastUpdated: "2026-03-15T14:30:00Z",
    agents: {
      running: 2,
      completed: 15,
      failed: 0,
    },
  },
  {
    id: "techstart-inc",
    name: "TechStart Inc",
    url: "https://techstart.io",
    location: "United Kingdom",
    locationCode: 2826,
    healthScore: 85,
    keywords: 1234,
    backlinks: 567,
    traffic: 89000,
    trafficTrend: 24.3,
    status: "active",
    createdAt: "2026-02-01",
    lastUpdated: "2026-03-15T10:15:00Z",
    agents: {
      running: 1,
      completed: 22,
      failed: 1,
    },
  },
  {
    id: "local-bakery",
    name: "Sweet Delights Bakery",
    url: "https://sweetdelightsbakery.com",
    location: "New York, NY",
    locationCode: 1023191,
    healthScore: 58,
    keywords: 156,
    backlinks: 45,
    traffic: 3200,
    trafficTrend: -5.2,
    status: "active",
    createdAt: "2026-02-20",
    lastUpdated: "2026-03-14T16:45:00Z",
    agents: {
      running: 0,
      completed: 8,
      failed: 0,
    },
  },
  {
    id: "fitness-pro",
    name: "FitnessPro Academy",
    url: "https://fitnesspro.academy",
    location: "Australia",
    locationCode: 2036,
    healthScore: 91,
    keywords: 2100,
    backlinks: 890,
    traffic: 156000,
    trafficTrend: 18.7,
    status: "active",
    createdAt: "2025-11-10",
    lastUpdated: "2026-03-15T08:00:00Z",
    agents: {
      running: 3,
      completed: 45,
      failed: 2,
    },
  },
  {
    id: "green-energy",
    name: "GreenEnergy Solutions",
    url: "https://greenenergy.solutions",
    location: "Germany",
    locationCode: 2276,
    healthScore: 67,
    keywords: 523,
    backlinks: 178,
    traffic: 28500,
    trafficTrend: 8.1,
    status: "paused",
    createdAt: "2025-12-05",
    lastUpdated: "2026-03-10T12:00:00Z",
    agents: {
      running: 0,
      completed: 12,
      failed: 0,
    },
  },
];

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}
