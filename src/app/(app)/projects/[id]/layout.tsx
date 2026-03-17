"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import { ProjectBar } from "@/components/layout/project-bar";
import { getProjectById } from "@/data/mock-projects";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
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
      <div className="p-6">{children}</div>
    </div>
  );
}
