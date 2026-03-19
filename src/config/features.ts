// Feature Flags for Optimus SEO
// Control feature availability across the application

import { env, hasDataForSEOCredentials, getAvailableLLMProvider, shouldUseMockData } from './env';

// Dynamic feature detection based on environment
const hasDataForSEO = hasDataForSEOCredentials();
const llmProvider = getAvailableLLMProvider();
const useMockData = shouldUseMockData();

export const features = {
  // Core Features
  mockMode: useMockData,              // Use mock data when no credentials
  caching: env.ENABLE_CACHE,          // Enable caching layer
  
  // API Integrations
  dataForSEO: {
    enabled: hasDataForSEO,            // DataForSEO API integration
    serp: hasDataForSEO,               // SERP API
    keywords: hasDataForSEO,           // Keywords Data API
    labs: hasDataForSEO,               // DataForSEO Labs API
    backlinks: hasDataForSEO,          // Backlinks API
    onpage: hasDataForSEO,             // OnPage API
    aiOptimization: hasDataForSEO,     // AI Optimization API (LLM Mentions)
    contentAnalysis: hasDataForSEO,    // Content Analysis API
    businessData: hasDataForSEO,       // Business Data API
  },
  
  // LLM Features
  llm: {
    enabled: llmProvider !== null,     // LLM integration
    groq: llmProvider === 'groq' || !!env.GROQ_API_KEY,
    openrouter: llmProvider === 'openrouter' || !!env.OPENROUTER_API_KEY,
    openai: llmProvider === 'openai' || !!env.OPENAI_API_KEY,
    agentMode: llmProvider !== null,   // AI Agent autonomous mode
  },
  
  // UI Features
  ui: {
    darkMode: true,                    // Dark mode support
    commandPalette: true,              // Cmd+K command palette
    notifications: true,               // In-app notifications
    realTimeUpdates: false,            // WebSocket real-time updates
    exportPDF: true,                   // PDF export functionality
    exportCSV: true,                   // CSV export functionality
  },
  
  // Module Features
  modules: {
    aiVisibility: true,                // AI Search Command Center
    keywordResearch: true,             // Keyword Research module
    siteAudit: true,                   // Technical SEO Audit
    competitorAnalysis: true,          // Competitor Analysis
    contentBriefs: true,               // Content Brief Generator
    linkBuilder: true,                 // Link Building module
    rankTracker: true,                 // Rank Tracking
    reportGenerator: true,             // Report Generation
    pitchDeck: true,                   // Pitch Deck Generator
    proposalGenerator: true,           // Proposal Generator
    ppcIntelligence: true,             // PPC Intelligence
    gmbAnalysis: true,                 // Google My Business
    youtubeSEO: true,                  // YouTube SEO
    ecommerceSEO: true,                // E-commerce SEO
    socialIntelligence: true,          // Social Intelligence
    multiSearch: true,                 // Multi-Search Engine Tracking
  },
  
  // Beta Features
  beta: {
    aiAgents: llmProvider !== null,    // AI Agent Orchestration (enabled with LLM)
    voiceSearch: false,                // Voice Search Optimization
    predictiveAnalytics: false,        // Predictive Analytics
    automatedReporting: false,         // Automated Report Scheduling
  },
} as const;

export type Features = typeof features;

// Helper to check if a feature is enabled
export function isFeatureEnabled(path: string): boolean {
  const parts = path.split('.');
  let current: unknown = features;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return false;
    }
  }
  
  return current === true;
}

// Helper to get all enabled features
export function getEnabledFeatures(): string[] {
  const enabled: string[] = [];
  
  function traverse(obj: Record<string, unknown>, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'boolean' && value) {
        enabled.push(path);
      } else if (typeof value === 'object' && value !== null) {
        traverse(value as Record<string, unknown>, path);
      }
    }
  }
  
  traverse(features as unknown as Record<string, unknown>);
  return enabled;
}

// Helper to get API status
export function getAPIStatus() {
  return {
    dataForSEO: {
      configured: hasDataForSEO,
      mockMode: useMockData,
    },
    llm: {
      configured: llmProvider !== null,
      provider: llmProvider,
      providers: {
        groq: !!env.GROQ_API_KEY,
        openrouter: !!env.OPENROUTER_API_KEY,
        openai: !!env.OPENAI_API_KEY,
      },
    },
  };
}
