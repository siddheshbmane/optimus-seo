"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  PenTool,
  Link2,
  Code,
  FileCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  PlayCircle,
  Pause,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

const executionTools = [
  {
    id: "content-writer",
    name: "AI Content Writer",
    description: "Generate SEO-optimized content",
    icon: PenTool,
    href: "content-writer",
    status: "active",
    tasksRunning: 2,
    tasksCompleted: 45,
  },
  {
    id: "link-builder",
    name: "Link Builder",
    description: "Automated outreach and link building",
    icon: Link2,
    href: "link-builder",
    status: "active",
    tasksRunning: 1,
    tasksCompleted: 23,
  },
  {
    id: "technical-fixes",
    name: "Technical Fixes",
    description: "Auto-fix technical SEO issues",
    icon: Code,
    href: "technical-fixes",
    status: "idle",
    tasksRunning: 0,
    tasksCompleted: 156,
  },
  {
    id: "content-optimizer",
    name: "Content Optimizer",
    description: "Optimize existing content for rankings",
    icon: FileCheck,
    href: "content-optimizer",
    status: "active",
    tasksRunning: 3,
    tasksCompleted: 89,
  },
  {
    id: "quick-wins",
    name: "Quick Wins",
    description: "Low-effort, high-impact optimizations",
    icon: Zap,
    href: "quick-wins",
    status: "idle",
    tasksRunning: 0,
    tasksCompleted: 34,
  },
];

const runningTasks = [
  {
    id: 1,
    name: "Writing: Complete Guide to Technical SEO",
    agent: "AI Content Writer",
    progress: 65,
    startedAt: "10 min ago",
    estimatedTime: "5 min remaining",
    status: "running",
  },
  {
    id: 2,
    name: "Writing: Local SEO Checklist",
    agent: "AI Content Writer",
    progress: 30,
    startedAt: "3 min ago",
    estimatedTime: "12 min remaining",
    status: "running",
  },
  {
    id: 3,
    name: "Outreach: TechCrunch Guest Post",
    agent: "Link Builder",
    progress: 45,
    startedAt: "25 min ago",
    estimatedTime: "Waiting for response",
    status: "waiting",
  },
  {
    id: 4,
    name: "Optimizing: Homepage Meta Tags",
    agent: "Content Optimizer",
    progress: 80,
    startedAt: "2 min ago",
    estimatedTime: "1 min remaining",
    status: "running",
  },
  {
    id: 5,
    name: "Optimizing: Blog Post Internal Links",
    agent: "Content Optimizer",
    progress: 15,
    startedAt: "1 min ago",
    estimatedTime: "8 min remaining",
    status: "running",
  },
  {
    id: 6,
    name: "Optimizing: Product Page Schema",
    agent: "Content Optimizer",
    progress: 50,
    startedAt: "5 min ago",
    estimatedTime: "3 min remaining",
    status: "running",
  },
];

const recentCompletions = [
  {
    id: 1,
    name: "Fixed 23 broken internal links",
    agent: "Technical Fixes",
    completedAt: "1 hour ago",
    impact: "+5 Health Score",
  },
  {
    id: 2,
    name: "Published: SEO Trends 2026 Blog Post",
    agent: "AI Content Writer",
    completedAt: "2 hours ago",
    impact: "2,500 words",
  },
  {
    id: 3,
    name: "Acquired backlink from Forbes",
    agent: "Link Builder",
    completedAt: "3 hours ago",
    impact: "DR 94",
  },
  {
    id: 4,
    name: "Optimized 15 meta descriptions",
    agent: "Content Optimizer",
    completedAt: "4 hours ago",
    impact: "+12% CTR expected",
  },
];

export default function ExecutionOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  const totalRunning = executionTools.reduce((sum, t) => sum + t.tasksRunning, 0);
  const totalCompleted = executionTools.reduce((sum, t) => sum + t.tasksCompleted, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Execution</h1>
          <p className="text-text-secondary">
            AI agents working on your SEO tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Pause className="h-4 w-4 mr-2" />
            Pause All
          </Button>
          <Button variant="accent">
            <Sparkles className="h-4 w-4 mr-2" />
            Run All Agents
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tasks Running"
          value={totalRunning}
          trendLabel="across all agents"
          icon={<PlayCircle className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Tasks Completed"
          value={totalCompleted}
          trend={24}
          trendLabel="this week"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Content Written"
          value="45"
          trend={12}
          trendLabel="pieces this month"
          icon={<PenTool className="h-5 w-5" />}
        />
        <StatCard
          label="Links Built"
          value="23"
          trend={8}
          trendLabel="this month"
          icon={<Link2 className="h-5 w-5" />}
        />
      </div>

      {/* Agent Cards */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Execution Agents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {executionTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/projects/${projectId}/execution/${tool.href}`}
            >
              <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        tool.status === "active"
                          ? "bg-success/10"
                          : "bg-bg-elevated"
                      )}
                    >
                      <tool.icon
                        className={cn(
                          "h-5 w-5",
                          tool.status === "active"
                            ? "text-success"
                            : "text-text-muted"
                        )}
                      />
                    </div>
                    {tool.status === "active" && (
                      <span className="flex items-center gap-1 text-xs text-success">
                        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-text-primary mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-text-muted mb-3">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">
                      {tool.tasksRunning > 0 ? (
                        <span className="text-info">
                          {tool.tasksRunning} running
                        </span>
                      ) : (
                        "Idle"
                      )}
                    </span>
                    <span className="text-text-secondary">
                      {tool.tasksCompleted} completed
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Running Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Running Tasks</CardTitle>
            <span className="flex items-center gap-1 text-xs text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {runningTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-bg-elevated"
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    task.status === "running" ? "bg-info/10" : "bg-warning/10"
                  )}
                >
                  {task.status === "running" ? (
                    <PlayCircle className="h-4 w-4 text-info animate-pulse" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-sm text-text-primary truncate">
                      {task.name}
                    </p>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {task.startedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="neutral" className="text-xs">
                      {task.agent}
                    </Badge>
                    <span className="text-xs text-text-muted">
                      {task.estimatedTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          task.status === "running" ? "bg-info" : "bg-warning"
                        )}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-primary">
                      {task.progress}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-text-primary">
                    <Pause className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-text-primary">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Completions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCompletions.map((completion) => (
              <div
                key={completion.id}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-text-primary">
                      {completion.name}
                    </p>
                    <p className="text-xs text-text-muted">{completion.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-primary">{completion.impact}</p>
                  <p className="text-xs text-text-muted">{completion.completedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
