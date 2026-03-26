"use client";

import * as React from "react";

/**
 * Project Configuration Context
 *
 * Stores user-configured data for a project:
 * - Target keywords to track
 * - Competitor domains to analyze
 * - Business information for local SEO
 * - Audit settings and history
 *
 * Hybrid persistence strategy:
 * 1. localStorage for instant reads (primary, offline-first)
 * 2. Database API for durable storage (background sync)
 * 3. On load: localStorage first, then API fetch merges in
 * 4. On mutations: localStorage updated immediately, API synced fire-and-forget
 */

export interface TrackedKeyword {
  id: string;
  keyword: string;
  addedAt: string;
  volume?: number;
  difficulty?: number;
  currentPosition?: number;
}

export interface CompetitorDomain {
  id: string;
  domain: string;
  name?: string;
  addedAt: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  category: string;
}

export interface AuditHistory {
  id: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed';
  healthScore?: number;
  issuesFound?: number;
}

export interface ProjectConfig {
  projectId: string;
  keywords: TrackedKeyword[];
  competitors: CompetitorDomain[];
  businessInfo: BusinessInfo | null;
  auditHistory: AuditHistory[];
  lastKeywordRefresh?: string;
  lastCompetitorRefresh?: string;
  lastAuditRun?: string;
}

interface ProjectConfigContextValue {
  config: ProjectConfig | null;
  isLoading: boolean;

  // Keywords
  addKeyword: (keyword: string) => void;
  addKeywords: (keywords: string[]) => void;
  removeKeyword: (id: string) => void;
  updateKeyword: (id: string, updates: Partial<TrackedKeyword>) => void;

  // Competitors
  addCompetitor: (domain: string, name?: string) => void;
  removeCompetitor: (id: string) => void;
  updateCompetitor: (id: string, updates: Partial<CompetitorDomain>) => void;

  // Business Info
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  clearBusinessInfo: () => void;

  // Audit
  startAudit: () => string;
  completeAudit: (auditId: string, healthScore: number, issuesFound: number) => void;
  failAudit: (auditId: string) => void;

  // General
  refreshConfig: () => void;
  clearConfig: () => void;
}

const ProjectConfigContext = React.createContext<ProjectConfigContextValue | null>(null);

const STORAGE_KEY_PREFIX = 'optimus_project_config_';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getStorageKey(projectId: string): string {
  return `${STORAGE_KEY_PREFIX}${projectId}`;
}

function loadConfig(projectId: string): ProjectConfig {
  if (typeof window === 'undefined') {
    return createEmptyConfig(projectId);
  }

  try {
    const stored = localStorage.getItem(getStorageKey(projectId));
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...createEmptyConfig(projectId), ...parsed, projectId };
    }
  } catch (error) {
    console.warn('Failed to load project config from localStorage:', error);
  }

  return createEmptyConfig(projectId);
}

function saveConfig(config: ProjectConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getStorageKey(config.projectId), JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save project config to localStorage:', error);
  }
}

function createEmptyConfig(projectId: string): ProjectConfig {
  return {
    projectId,
    keywords: [],
    competitors: [],
    businessInfo: null,
    auditHistory: [],
  };
}

// ---------------------------------------------------------------------------
// API sync helpers (fire-and-forget, best-effort)
// ---------------------------------------------------------------------------

async function syncAddKeywordToAPI(
  projectId: string,
  keyword: TrackedKeyword
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    await fetch(`/api/projects/${projectId}/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: keyword.keyword,
        searchVolume: keyword.volume ?? null,
        difficulty: keyword.difficulty ?? null,
        currentPosition: keyword.currentPosition ?? null,
      }),
    });
  } catch {
    console.warn('Failed to sync keyword addition to API');
  }
}

async function syncAddKeywordsBatchToAPI(
  projectId: string,
  keywords: TrackedKeyword[]
): Promise<void> {
  try {
    if (typeof window === 'undefined' || keywords.length === 0) return;
    await fetch(`/api/projects/${projectId}/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keywords: keywords.map((kw) => ({
          keyword: kw.keyword,
          searchVolume: kw.volume ?? null,
          difficulty: kw.difficulty ?? null,
          currentPosition: kw.currentPosition ?? null,
        })),
      }),
    });
  } catch {
    console.warn('Failed to sync keyword batch to API');
  }
}

async function syncRemoveKeywordFromAPI(
  projectId: string,
  keywordId: string
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    await fetch(
      `/api/projects/${projectId}/keywords?keywordId=${encodeURIComponent(keywordId)}`,
      { method: 'DELETE' }
    );
  } catch {
    console.warn('Failed to sync keyword removal to API');
  }
}

async function syncAddCompetitorToAPI(
  projectId: string,
  competitor: CompetitorDomain
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    await fetch(`/api/projects/${projectId}/competitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: competitor.domain,
        name: competitor.name ?? null,
      }),
    });
  } catch {
    console.warn('Failed to sync competitor addition to API');
  }
}

async function syncRemoveCompetitorFromAPI(
  projectId: string,
  competitorId: string
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    await fetch(
      `/api/projects/${projectId}/competitors?competitorId=${encodeURIComponent(competitorId)}`,
      { method: 'DELETE' }
    );
  } catch {
    console.warn('Failed to sync competitor removal to API');
  }
}

/**
 * Fetch config from API and return partial config to merge.
 * Returns null if nothing was fetched.
 */
async function fetchConfigFromAPI(
  projectId: string
): Promise<Partial<ProjectConfig> | null> {
  try {
    if (typeof window === 'undefined') return null;

    const [kwRes, compRes] = await Promise.allSettled([
      fetch(`/api/projects/${projectId}/keywords`),
      fetch(`/api/projects/${projectId}/competitors`),
    ]);

    const config: Partial<ProjectConfig> = {};

    if (kwRes.status === 'fulfilled' && kwRes.value.ok) {
      const json = await kwRes.value.json();
      if (json.data?.length) {
        config.keywords = json.data.map((kw: Record<string, unknown>) => ({
          id: kw.id as string,
          keyword: kw.keyword as string,
          addedAt: (kw.createdAt as string) ?? new Date().toISOString(),
          volume: (kw.searchVolume as number | undefined) ?? undefined,
          difficulty: (kw.difficulty as number | undefined) ?? undefined,
          currentPosition: (kw.currentPosition as number | undefined) ?? undefined,
        }));
      }
    }

    if (compRes.status === 'fulfilled' && compRes.value.ok) {
      const json = await compRes.value.json();
      if (json.data?.length) {
        config.competitors = json.data.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          domain: (c.url as string) ?? '',
          name: (c.name as string | undefined) ?? undefined,
          addedAt: (c.createdAt as string) ?? new Date().toISOString(),
        }));
      }
    }

    return Object.keys(config).length > 0 ? config : null;
  } catch {
    console.warn('Failed to fetch config from API');
    return null;
  }
}

/**
 * Merge API config into local config.
 * API data takes priority for items that share the same keyword/domain.
 * Local-only items (not in API) are preserved.
 */
function mergeConfigs(
  local: ProjectConfig,
  api: Partial<ProjectConfig>
): ProjectConfig {
  const merged = { ...local };

  if (api.keywords) {
    // Build a map of API keywords by keyword text (lowercased) for dedup
    const apiByKeyword = new Map(
      api.keywords.map((kw) => [kw.keyword.toLowerCase(), kw])
    );
    // Keep local keywords that don't exist in API (by keyword text)
    const localOnly = local.keywords.filter(
      (kw) => !apiByKeyword.has(kw.keyword.toLowerCase())
    );
    merged.keywords = [...api.keywords, ...localOnly];
  }

  if (api.competitors) {
    const apiByDomain = new Map(
      api.competitors.map((c) => [c.domain.toLowerCase(), c])
    );
    const localOnly = local.competitors.filter(
      (c) => !apiByDomain.has(c.domain.toLowerCase())
    );
    merged.competitors = [...api.competitors, ...localOnly];
  }

  if (api.auditHistory) {
    const apiById = new Map(api.auditHistory.map((a) => [a.id, a]));
    const localOnly = local.auditHistory.filter((a) => !apiById.has(a.id));
    merged.auditHistory = [...api.auditHistory, ...localOnly];
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ProjectConfigProviderProps {
  projectId: string;
  children: React.ReactNode;
}

export function ProjectConfigProvider({ projectId, children }: ProjectConfigProviderProps) {
  const [config, setConfig] = React.useState<ProjectConfig | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const syncedRef = React.useRef(false);

  // Load config on mount: localStorage first (instant), then API merge
  React.useEffect(() => {
    setIsLoading(true);
    syncedRef.current = false;

    // 1. Instant load from localStorage
    const loaded = loadConfig(projectId);
    setConfig(loaded);
    setIsLoading(false);

    // 2. Background fetch from API, then merge
    let cancelled = false;
    fetchConfigFromAPI(projectId).then((apiConfig) => {
      if (cancelled) return;
      if (apiConfig) {
        setConfig((prev) => {
          if (!prev) return prev;
          const merged = mergeConfigs(prev, apiConfig);
          // Persist merged result to localStorage
          saveConfig(merged);
          return merged;
        });
      }
      syncedRef.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // Save config to localStorage whenever it changes
  React.useEffect(() => {
    if (config && !isLoading) {
      saveConfig(config);
    }
  }, [config, isLoading]);

  // Keywords
  const addKeyword = React.useCallback((keyword: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      // Don't add duplicates
      if (prev.keywords.some(k => k.keyword.toLowerCase() === keyword.toLowerCase())) {
        return prev;
      }
      const newKeyword: TrackedKeyword = {
        id: generateId(),
        keyword: keyword.trim(),
        addedAt: new Date().toISOString(),
      };
      const updated = {
        ...prev,
        keywords: [...prev.keywords, newKeyword],
      };
      // Sync to API (fire-and-forget)
      syncAddKeywordToAPI(prev.projectId, newKeyword);
      return updated;
    });
  }, []);

  const addKeywords = React.useCallback((keywords: string[]) => {
    setConfig(prev => {
      if (!prev) return prev;
      const existingKeywords = new Set(prev.keywords.map(k => k.keyword.toLowerCase()));
      const newKeywords = keywords
        .map(k => k.trim())
        .filter(k => k && !existingKeywords.has(k.toLowerCase()))
        .map(keyword => ({
          id: generateId(),
          keyword,
          addedAt: new Date().toISOString(),
        }));

      if (newKeywords.length === 0) return prev;

      const updated = {
        ...prev,
        keywords: [...prev.keywords, ...newKeywords],
      };
      // Sync batch to API (fire-and-forget)
      syncAddKeywordsBatchToAPI(prev.projectId, newKeywords);
      return updated;
    });
  }, []);

  const removeKeyword = React.useCallback((id: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      // Sync removal to API (fire-and-forget)
      syncRemoveKeywordFromAPI(prev.projectId, id);
      return {
        ...prev,
        keywords: prev.keywords.filter(k => k.id !== id),
      };
    });
  }, []);

  const updateKeyword = React.useCallback((id: string, updates: Partial<TrackedKeyword>) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        keywords: prev.keywords.map(k =>
          k.id === id ? { ...k, ...updates } : k
        ),
      };
    });
  }, []);

  // Competitors
  const addCompetitor = React.useCallback((domain: string, name?: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      // Normalize domain
      const normalizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
      // Don't add duplicates
      if (prev.competitors.some(c => c.domain.toLowerCase() === normalizedDomain)) {
        return prev;
      }
      const newCompetitor: CompetitorDomain = {
        id: generateId(),
        domain: normalizedDomain,
        name,
        addedAt: new Date().toISOString(),
      };
      const updated = {
        ...prev,
        competitors: [...prev.competitors, newCompetitor],
      };
      // Sync to API (fire-and-forget)
      syncAddCompetitorToAPI(prev.projectId, newCompetitor);
      return updated;
    });
  }, []);

  const removeCompetitor = React.useCallback((id: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      // Sync removal to API (fire-and-forget)
      syncRemoveCompetitorFromAPI(prev.projectId, id);
      return {
        ...prev,
        competitors: prev.competitors.filter(c => c.id !== id),
      };
    });
  }, []);

  const updateCompetitor = React.useCallback((id: string, updates: Partial<CompetitorDomain>) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        competitors: prev.competitors.map(c =>
          c.id === id ? { ...c, ...updates } : c
        ),
      };
    });
  }, []);

  // Business Info
  const updateBusinessInfo = React.useCallback((info: Partial<BusinessInfo>) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        businessInfo: {
          name: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
          phone: '',
          email: '',
          category: '',
          ...prev.businessInfo,
          ...info,
        },
      };
    });
  }, []);

  const clearBusinessInfo = React.useCallback(() => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        businessInfo: null,
      };
    });
  }, []);

  // Audit
  const startAudit = React.useCallback((): string => {
    const auditId = generateId();
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lastAuditRun: new Date().toISOString(),
        auditHistory: [
          {
            id: auditId,
            startedAt: new Date().toISOString(),
            status: 'running',
          },
          ...prev.auditHistory.slice(0, 9), // Keep last 10 audits
        ],
      };
    });
    return auditId;
  }, []);

  const completeAudit = React.useCallback((auditId: string, healthScore: number, issuesFound: number) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        auditHistory: prev.auditHistory.map(a =>
          a.id === auditId
            ? { ...a, status: 'completed' as const, completedAt: new Date().toISOString(), healthScore, issuesFound }
            : a
        ),
      };
    });
  }, []);

  const failAudit = React.useCallback((auditId: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        auditHistory: prev.auditHistory.map(a =>
          a.id === auditId
            ? { ...a, status: 'failed' as const, completedAt: new Date().toISOString() }
            : a
        ),
      };
    });
  }, []);

  // General
  const refreshConfig = React.useCallback(() => {
    const loaded = loadConfig(projectId);
    setConfig(loaded);

    // Also re-fetch from API
    fetchConfigFromAPI(projectId).then((apiConfig) => {
      if (apiConfig) {
        setConfig((prev) => {
          if (!prev) return prev;
          const merged = mergeConfigs(prev, apiConfig);
          saveConfig(merged);
          return merged;
        });
      }
    });
  }, [projectId]);

  const clearConfig = React.useCallback(() => {
    setConfig(createEmptyConfig(projectId));
  }, [projectId]);

  const value: ProjectConfigContextValue = {
    config,
    isLoading,
    addKeyword,
    addKeywords,
    removeKeyword,
    updateKeyword,
    addCompetitor,
    removeCompetitor,
    updateCompetitor,
    updateBusinessInfo,
    clearBusinessInfo,
    startAudit,
    completeAudit,
    failAudit,
    refreshConfig,
    clearConfig,
  };

  return (
    <ProjectConfigContext.Provider value={value}>
      {children}
    </ProjectConfigContext.Provider>
  );
}

export function useProjectConfig() {
  const context = React.useContext(ProjectConfigContext);
  if (!context) {
    throw new Error("useProjectConfig must be used within a ProjectConfigProvider");
  }
  return context;
}

// Safe version that returns null if not in provider
export function useProjectConfigSafe() {
  return React.useContext(ProjectConfigContext);
}
