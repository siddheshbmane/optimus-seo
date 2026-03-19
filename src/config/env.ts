// Environment configuration for Optimus SEO
// Handles all environment variables with type safety and defaults

export const env = {
  // DataForSEO API
  DATAFORSEO_LOGIN: process.env.DATAFORSEO_LOGIN || '',
  DATAFORSEO_PASSWORD: process.env.DATAFORSEO_PASSWORD || '',
  DATAFORSEO_API_URL: process.env.DATAFORSEO_API_URL || 'https://api.dataforseo.com/v3',
  
  // Mock Mode - when true, uses mock data instead of real API
  // Only use mock if explicitly set to 'true' OR if no credentials are configured
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  
  // LLM Providers
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // App Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Cache Configuration
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10), // 1 hour default
  ENABLE_CACHE: process.env.ENABLE_CACHE !== 'false',
} as const;

// Type for environment config
export type EnvConfig = typeof env;

// Helper to check if DataForSEO credentials are configured
export function hasDataForSEOCredentials(): boolean {
  return !!(env.DATAFORSEO_LOGIN && env.DATAFORSEO_PASSWORD);
}

// Helper to check if we should use mock data
export function shouldUseMockData(): boolean {
  // Use mock data if explicitly enabled OR if no DataForSEO credentials
  if (env.USE_MOCK_DATA) return true;
  return !hasDataForSEOCredentials();
}

// Helper to get LLM provider
export function getAvailableLLMProvider(): 'groq' | 'openrouter' | 'openai' | null {
  if (env.GROQ_API_KEY) return 'groq';
  if (env.OPENROUTER_API_KEY) return 'openrouter';
  if (env.OPENAI_API_KEY) return 'openai';
  return null;
}
