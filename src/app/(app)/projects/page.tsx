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
  ChevronRight,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockProjects, type Project as MockProject } from "@/data/mock-projects";
import { useProjects, type Project as DBProject } from "@/hooks/use-projects";
import { formatNumber, getHealthScoreColor, cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "active" | "paused" | "completed" | "created";

// Unified project type for display
interface DisplayProject {
  id: string;
  name: string;
  url: string;
  status: "active" | "paused" | "completed" | "created";
  healthScore: number;
  keywords: number;
  backlinks: number;
  traffic: number;
  trafficTrend: number;
  agents: { running: number; total: number };
}

// Convert DB project to display format
function toDisplayProject(project: DBProject): DisplayProject {
  // Map DB status to display status
  const statusMap: Record<string, "active" | "paused" | "completed" | "created"> = {
    created: "created",
    sales_phase: "active",
    strategy_phase: "active",
    execution_phase: "active",
    reporting: "active",
    completed: "completed",
    paused: "paused",
    archived: "completed",
  };

  return {
    id: project.id,
    name: project.name,
    url: project.clientUrl,
    status: statusMap[project.status] || "created",
    healthScore: project.healthScore || 0,
    keywords: 0, // Will be populated from related data
    backlinks: 0,
    traffic: 0,
    trafficTrend: 0,
    agents: { running: 0, total: 0 },
  };
}

// Convert mock project to display format
function mockToDisplayProject(project: MockProject): DisplayProject {
  return {
    id: project.id,
    name: project.name,
    url: project.url,
    status: project.status,
    healthScore: project.healthScore,
    keywords: project.keywords,
    backlinks: project.backlinks,
    traffic: project.traffic,
    trafficTrend: project.trafficTrend,
    agents: { running: project.agents.running, total: project.agents.running + project.agents.completed + project.agents.failed },
  };
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = React.useState(false);

  // Fetch real projects from API
  const { projects: dbProjects, isLoading, error, refetch } = useProjects();

  // Combine real projects with mock projects for demo
  const allProjects: DisplayProject[] = React.useMemo(() => {
    const realProjects = dbProjects.map(toDisplayProject);
    // If we have real projects, show them first, then mock projects
    // In production, you'd only show real projects
    if (realProjects.length > 0) {
      return [...realProjects, ...mockProjects.map(mockToDisplayProject)];
    }
    // Fallback to mock projects if no real projects
    return mockProjects.map(mockToDisplayProject);
  }, [dbProjects]);

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: DisplayProject["status"]) => {
    switch (status) {
      case "active":
        return <PlayCircle className="h-3.5 w-3.5" />;
      case "paused":
        return <Pause className="h-3.5 w-3.5" />;
      case "completed":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "created":
        return <Globe className="h-3.5 w-3.5" />;
    }
  };

  const getStatusBadgeVariant = (status: DisplayProject["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "completed":
        return "neutral";
      case "created":
        return "info";
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Manage and monitor all your SEO projects
            {dbProjects.length > 0 && (
              <span className="ml-2 text-accent">({dbProjects.length} from database)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="hidden sm:flex"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="accent" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {error}. Showing demo projects instead.
        </div>
      )}

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Search and Filter Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <Button 
            variant="secondary" 
            size="sm" 
            className="sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          {/* Desktop Status Filter */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
            {(["all", "active", "paused", "completed"] as StatusFilter[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors capitalize",
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

          {/* View Toggle - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
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

        {/* Mobile Filters */}
        {showFilters && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:hidden scrollbar-hide">
            {(["all", "active", "paused", "completed"] as StatusFilter[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize whitespace-nowrap",
                    statusFilter === status
                      ? "bg-accent text-white"
                      : "bg-bg-elevated text-text-secondary"
                  )}
                >
                  {status}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Projects Grid/List */}
      {/* Mobile always shows cards, desktop respects viewMode */}
      <div className={cn(
        "grid gap-3 sm:gap-4",
        viewMode === "grid" || true // Always grid on mobile
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      )}>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} viewMode={viewMode} />
        ))}
      </div>

      {/* Desktop List View */}
      {viewMode === "list" && (
        <div className="hidden md:block space-y-2">
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
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <Globe className="h-7 w-7 sm:h-8 sm:w-8 text-text-muted" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-text-primary mb-1">
            No projects found
          </h3>
          <p className="text-sm sm:text-base text-text-secondary mb-4">
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

function ProjectCard({ project, viewMode }: { project: DisplayProject; viewMode: ViewMode }) {
  return (
    <Link href={`/projects/${project.id}/sales`}>
      <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-semibold text-xs sm:text-sm">
                  {project.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm sm:text-base text-text-primary truncate">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted truncate">
                  {project.url}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-1 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary flex-shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Health Score */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm text-text-secondary">Health Score</span>
              <span
                className={cn(
                  "font-mono font-semibold text-sm",
                  getHealthScoreColor(project.healthScore)
                )}
              >
                {project.healthScore}/100
              </span>
            </div>
            <div className="h-1.5 sm:h-2 bg-bg-elevated rounded-full overflow-hidden">
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
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="text-center p-1.5 sm:p-2 bg-bg-elevated rounded-lg">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5 sm:mb-1">
                <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
              <p className="font-mono font-semibold text-text-primary text-xs sm:text-sm">
                {formatNumber(project.keywords)}
              </p>
              <p className="text-[10px] sm:text-xs text-text-muted">Keywords</p>
            </div>
            <div className="text-center p-1.5 sm:p-2 bg-bg-elevated rounded-lg">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5 sm:mb-1">
                <Link2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>
              <p className="font-mono font-semibold text-text-primary text-xs sm:text-sm">
                {formatNumber(project.backlinks)}
              </p>
              <p className="text-[10px] sm:text-xs text-text-muted">Backlinks</p>
            </div>
            <div className="text-center p-1.5 sm:p-2 bg-bg-elevated rounded-lg">
              <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5 sm:mb-1">
                {project.trafficTrend > 0 ? (
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-success" />
                ) : project.trafficTrend < 0 ? (
                  <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-error" />
                ) : (
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                )}
              </div>
              <p className="font-mono font-semibold text-text-primary text-xs sm:text-sm">
                {formatNumber(project.traffic)}
              </p>
              <p className="text-[10px] sm:text-xs text-text-muted">Traffic</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border">
            <Badge 
              variant={project.status === "active" ? "success" : project.status === "paused" ? "warning" : "neutral"}
              className="text-[10px] sm:text-xs"
            >
              {project.status}
            </Badge>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-text-muted">
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
