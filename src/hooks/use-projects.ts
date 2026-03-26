/**
 * Projects Hook
 * 
 * Fetches projects from the API with caching and real-time updates.
 * Falls back to mock data only when Demo Mode is enabled.
 */

import * as React from "react";
import { mockProjects } from "@/data/mock-projects";
import { useDemoModeSafe } from "@/contexts/demo-mode-context";

// API Project type (from database)
export interface Project {
  id: string;
  name: string;
  clientUrl: string;
  industry?: string;
  description?: string;
  status: "created" | "sales_phase" | "strategy_phase" | "execution_phase" | "reporting" | "completed" | "paused" | "archived";
  healthScore?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    keywords: number;
    contents: number;
    siteAudits: number;
  };
}

// Dashboard-friendly project type (for UI display)
export interface DashboardProject {
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

// Extended API Project type with locations (from detailed API response)
interface ProjectWithLocations extends Project {
  locations?: {
    isPrimary: boolean;
    location: {
      id: string;
      locationCode: number;
      locationName: string;
      locationType: string;
      countryCode: string;
      countryName: string;
    };
  }[];
}

// Transform API project to dashboard format
function transformToDashboardProject(project: Project | ProjectWithLocations): DashboardProject {
  // Map API status to dashboard status
  const statusMap: Record<string, "active" | "paused" | "completed"> = {
    created: "active",
    sales_phase: "active",
    strategy_phase: "active",
    execution_phase: "active",
    reporting: "active",
    completed: "completed",
    paused: "paused",
    archived: "paused",
  };

  // Get primary location if available
  const projectWithLocs = project as ProjectWithLocations;
  const primaryLocation = projectWithLocs.locations?.find(l => l.isPrimary)?.location;
  const location = primaryLocation?.locationName || primaryLocation?.countryName || "United States";
  const locationCode = primaryLocation?.locationCode || 2840;

  return {
    id: project.id,
    name: project.name,
    url: project.clientUrl,
    location,
    locationCode,
    healthScore: project.healthScore ?? 0,
    keywords: project._count?.keywords ?? 0,
    backlinks: 0, // Would come from backlinks API
    traffic: 0, // Would come from analytics
    trafficTrend: 0,
    status: statusMap[project.status] || "active",
    createdAt: project.createdAt,
    lastUpdated: project.updatedAt,
    agents: {
      running: 0,
      completed: 0,
      failed: 0,
    },
  };
}

interface UseProjectsResult {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseDashboardProjectsResult {
  projects: DashboardProject[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch raw projects from API
 */
export function useProjects(): UseProjectsResult {
  const isDemoMode = useDemoModeSafe();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProjects = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects");
      
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}

/**
 * Dashboard-specific hook that returns projects in dashboard format.
 * Shows real DB projects by default, mock data only when Demo Mode is enabled.
 */
export function useDashboardProjects(): UseDashboardProjectsResult {
  const isDemoMode = useDemoModeSafe();
  const [projects, setProjects] = React.useState<DashboardProject[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProjects = React.useCallback(async () => {
    // If demo mode is enabled, use mock data
    if (isDemoMode) {
      setProjects(mockProjects);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects");
      
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      const apiProjects: Project[] = data.data || [];
      
      // Transform API projects to dashboard format
      setProjects(apiProjects.map(transformToDashboardProject));
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}

/**
 * Hook for a single project - fetches from API with mock fallback for demo projects
 */
export function useProject(id: string) {
  const isDemoMode = useDemoModeSafe();
  const [project, setProject] = React.useState<DashboardProject | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchProject = React.useCallback(async () => {
    if (!id) {
      setProject(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Check if this is a mock project ID (for demo mode or demo project links)
    const mockProject = mockProjects.find(p => p.id === id);
    
    // If demo mode is enabled and we have a mock project, use it
    if (isDemoMode && mockProject) {
      setProject(mockProject);
      setSource('mock');
      setIsLoading(false);
      return;
    }

    // Try to fetch from API
    try {
      const response = await fetch(`/api/projects/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setProject(transformToDashboardProject(data.data));
          setSource('api');
        } else if (mockProject) {
          // Fall back to mock if API returns no data (for demo project IDs)
          setProject(mockProject);
          setSource('mock');
        } else {
          setProject(null);
          setError("Project not found");
        }
      } else if (mockProject) {
        // Fall back to mock on API error (for demo project IDs like "acme-corp")
        setProject(mockProject);
        setSource('mock');
      } else {
        setProject(null);
        setError("Project not found");
      }
    } catch (err) {
      // Fall back to mock on error
      if (mockProject) {
        setProject(mockProject);
        setSource('mock');
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
        setProject(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, isDemoMode]);

  React.useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    source,
    refetch: fetchProject,
  };
}
