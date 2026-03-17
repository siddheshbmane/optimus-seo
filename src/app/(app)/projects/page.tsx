"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  MoreHorizontal,
  Globe,
  TrendingUp,
  TrendingDown,
  Link2,
  Target,
  PlayCircle,
  Pause,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockProjects, type Project } from "@/data/mock-projects";
import { formatNumber, getHealthScoreColor, cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "paused" | "completed";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return <PlayCircle className="h-3.5 w-3.5" />;
      case "paused":
        return <Pause className="h-3.5 w-3.5" />;
      case "completed":
        return <CheckCircle className="h-3.5 w-3.5" />;
    }
  };

  const getStatusBadgeVariant = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "completed":
        return "neutral";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary">
            Manage and monitor all your SEO projects
          </p>
        </div>
        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
            {(["all", "active", "paused", "completed"] as StatusFilter[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                    statusFilter === status
                      ? "bg-bg-card text-text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* More Filters */}
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-bg-card text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "list"
                ? "bg-bg-card text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
            <div className="col-span-4">Project</div>
            <div className="col-span-2 text-center">Health</div>
            <div className="col-span-2 text-center">Keywords</div>
            <div className="col-span-2 text-center">Traffic</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1"></div>
          </div>
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}/sales`}
              className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-bg-card border border-border rounded-lg hover:border-accent/50 transition-colors"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-sm">
                    {project.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {project.name}
                  </p>
                  <p className="text-sm text-text-muted truncate">
                    {project.url}
                  </p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span
                  className={cn(
                    "font-mono font-semibold",
                    getHealthScoreColor(project.healthScore)
                  )}
                >
                  {project.healthScore}
                </span>
                <span className="text-text-muted">/100</span>
              </div>
              <div className="col-span-2 text-center font-mono text-text-primary">
                {formatNumber(project.keywords)}
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-mono text-text-primary">
                    {formatNumber(project.traffic)}
                  </span>
                  {project.trafficTrend !== 0 && (
                    <span
                      className={cn(
                        "flex items-center text-xs",
                        project.trafficTrend > 0 ? "text-success" : "text-error"
                      )}
                    >
                      {project.trafficTrend > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status}</span>
                  </span>
                </Badge>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-1">
            No projects found
          </h3>
          <p className="text-text-secondary mb-4">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Get started by creating your first project"}
          </p>
          {!searchQuery && (
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}/sales`}>
      <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-semibold text-sm">
                  {project.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">{project.name}</h3>
                <p className="text-sm text-text-muted truncate max-w-[180px]">
                  {project.url}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Health Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-text-secondary">Health Score</span>
              <span
                className={cn(
                  "font-mono font-semibold",
                  getHealthScoreColor(project.healthScore)
                )}
              >
                {project.healthScore}/100
              </span>
            </div>
            <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  project.healthScore >= 80
                    ? "bg-success"
                    : project.healthScore >= 50
                    ? "bg-warning"
                    : "bg-error"
                )}
                style={{ width: `${project.healthScore}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-bg-elevated rounded-lg">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-1">
                <Target className="h-3.5 w-3.5" />
              </div>
              <p className="font-mono font-semibold text-text-primary text-sm">
                {formatNumber(project.keywords)}
              </p>
              <p className="text-xs text-text-muted">Keywords</p>
            </div>
            <div className="text-center p-2 bg-bg-elevated rounded-lg">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-1">
                <Link2 className="h-3.5 w-3.5" />
              </div>
              <p className="font-mono font-semibold text-text-primary text-sm">
                {formatNumber(project.backlinks)}
              </p>
              <p className="text-xs text-text-muted">Backlinks</p>
            </div>
            <div className="text-center p-2 bg-bg-elevated rounded-lg">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-1">
                {project.trafficTrend > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : project.trafficTrend < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5 text-error" />
                ) : (
                  <TrendingUp className="h-3.5 w-3.5" />
                )}
              </div>
              <p className="font-mono font-semibold text-text-primary text-sm">
                {formatNumber(project.traffic)}
              </p>
              <p className="text-xs text-text-muted">Traffic</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Badge variant={project.status === "active" ? "success" : project.status === "paused" ? "warning" : "neutral"}>
              {project.status}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              {project.agents.running > 0 && (
                <span className="flex items-center gap-1 text-info">
                  <span className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
                  {project.agents.running} running
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
