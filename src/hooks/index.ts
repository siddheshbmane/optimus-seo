// Hooks barrel export
// Re-exports all hooks for easy importing

// DataForSEO hooks
export {
  useDataForSEO,
  useDataForSEOMutation,
  useSerpGoogleOrganic,
  useKeywordsSearchVolume,
  useKeywordsForSite,
  useKeywordIdeas,
  useRelatedKeywords,
  useCompetitorsDomain,
  useRankedKeywords,
  useBacklinksSummary,
  useBacklinksBacklinks,
  useBacklinksReferringDomains,
  useLLMMentionsSearch,
  useLLMMentionsTopPages,
  useLLMMentionsTopDomains,
  useLLMMentionsAggregated,
  useOnpageLighthouse,
  useContentAnalysisSearch,
  useGoogleMyBusinessInfo,
  useGoogleReviews,
} from './use-dataforseo';

// LLM hooks
export {
  useLLMAvailability,
  useLLMCompletion,
  useLLMStream,
  useSEOAnalysis,
  useContentGeneration,
  useContentAnalysis,
  useMetaGeneration,
  useKeywordSuggestions,
  useCompetitorAnalysis,
  useTechnicalAudit,
} from './use-llm';

// Real-time hooks
export { 
  useRealtime, 
  useAgentStatus, 
  useNotifications, 
  useRankingChanges, 
  useAPIUsage,
  CHANNELS,
} from './use-realtime';

// Export hooks
export { useExport } from './use-export';

// Project hooks
export { 
  useProjects, 
  useDashboardProjects, 
  useProject,
  type Project,
  type DashboardProject,
} from './use-projects';

// Agent hooks
export {
  useAgentActivity,
  useAgentSchedules,
  useAgentRuns,
  type AgentActivity,
} from './use-agents';

// SEO Data hooks (with API + mock fallback)
export {
  useKeywordData,
  useSiteAuditData,
  useCompetitorData,
  useAIVisibilityData,
  type KeywordData,
  type SiteAuditData,
  type CompetitorData,
  type AIVisibilityData,
} from './use-seo-data';
