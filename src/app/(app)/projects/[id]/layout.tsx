"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ProjectBar } from "@/components/layout/project-bar";
import { ProjectProvider, useProjectContext } from "@/contexts/project-context";
import { ProjectConfigProvider } from "@/contexts/project-config-context";
import { Loader2 } from "lucide-react";

// Inner component that uses the project context
function ProjectLayoutContent({ children }: { children: React.ReactNode }) {
  const { project, isLoading, error } = useProjectContext();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-text-muted">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state - project not found
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Project Not Found</h1>
          <p className="text-text-secondary mb-4">
            {error || "The project you're looking for doesn't exist or you don't have access to it."}
          </p>
          <a 
            href="/projects" 
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProjectBar
        projectId={project.id}
        projectName={project.name}
        projectUrl={project.url}
        badge={
          project.status === "active"
            ? { label: "Active", variant: "success" }
            : project.status === "paused"
            ? { label: "Paused", variant: "warning" }
            : { label: "Completed", variant: "neutral" }
        }
      />
      {/* Content wrapper with consistent padding */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">{children}</div>
    </div>
  );
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectConfigProvider projectId={projectId}>
        <ProjectLayoutContent>{children}</ProjectLayoutContent>
      </ProjectConfigProvider>
    </ProjectProvider>
  );
}
