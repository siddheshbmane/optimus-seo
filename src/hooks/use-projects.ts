/**
 * Projects Hook
 * 
 * Fetches projects from the API with caching and real-time updates.
 */

import * as React from "react";
import { useSession } from "@/lib/auth/client";

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
}

interface UseProjectsResult {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const { data: session } = useSession();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProjects = React.useCallback(async () => {
    if (!session?.user) {
      setProjects([]);
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
      setProjects(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

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

// Hook for a single project
export function useProject(id: string) {
  const { data: session } = useSession();
  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProject = React.useCallback(async () => {
    if (!session?.user || !id) {
      setProject(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const data = await response.json();
      setProject(data.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, id]);

  React.useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    refetch: fetchProject,
  };
}
