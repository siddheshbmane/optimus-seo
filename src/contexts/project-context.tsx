"use client";

import * as React from "react";
import { useProject, type DashboardProject } from "@/hooks/use-projects";

interface ProjectContextValue {
  project: DashboardProject | null;
  isLoading: boolean;
  error: string | null;
  source: 'api' | 'mock' | null;
  refetch: () => Promise<void>;
}

const ProjectContext = React.createContext<ProjectContextValue | null>(null);

interface ProjectProviderProps {
  projectId: string;
  children: React.ReactNode;
}

export function ProjectProvider({ projectId, children }: ProjectProviderProps) {
  const { project, isLoading, error, source, refetch } = useProject(projectId);

  return (
    <ProjectContext.Provider value={{ project, isLoading, error, source, refetch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}

// Convenience hook that returns just the project (throws if not found)
export function useCurrentProject(): DashboardProject {
  const { project, isLoading, error } = useProjectContext();
  
  if (isLoading) {
    // Return a placeholder during loading - components should handle loading state
    throw new Promise(() => {}); // This will trigger Suspense if used
  }
  
  if (error || !project) {
    throw new Error(error || "Project not found");
  }
  
  return project;
}
