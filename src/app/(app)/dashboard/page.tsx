"use client";

import * as React from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  TrendingUp, 
  Link2, 
  Users,
  Plus,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/data/mock-projects";
import { mockAgentActivity } from "@/data/mock-agents";
import { formatNumber, formatRelativeTime, getHealthScoreColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  // Calculate summary stats
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter((p) => p.status === "active").length;
  const totalKeywords = mockProjects.reduce((sum, p) => sum + p.keywords, 0);
  const totalBacklinks = mockProjects.reduce((sum, p) => sum + p.backlinks, 0);
  const runningAgents = mockAgentActivity.filter((a) => a.status === "running").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <PlayCircle className="h-4 w-4 text-info animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-error" />;
      default:
        return <Clock className="h-4 w-4 text-text-muted" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">
            Welcome back! Here&apos;s what&apos;s happening with your SEO projects.
          </p>
        </div>
        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Projects"
          value={activeProjects}
          trend={12}
          trendLabel="this month"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <StatCard
          label="Total Keywords"
          value={formatNumber(totalKeywords)}
          trend={8.5}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Backlinks Built"
          value={formatNumber(totalBacklinks)}
          trend={24}
          trendLabel="this month"
          icon={<Link2 className="h-5 w-5" />}
        />
        <StatCard
          label="Agents Running"
          value={runningAgents}
          trendLabel="0 failed"
          icon={<Users className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProjects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}/sales`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-semibold text-sm">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{project.name}</p>
                      <p className="text-sm text-text-muted">{project.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={cn("font-mono font-semibold", getHealthScoreColor(project.healthScore))}>
                        {project.healthScore}/100
                      </p>
                      <p className="text-xs text-text-muted">Health Score</p>
                    </div>
                    <Badge
                      variant={
                        project.status === "active"
                          ? "success"
                          : project.status === "paused"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Agent Activity</CardTitle>
              <span className="flex items-center gap-1 text-xs text-success">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </div>
            <Link href="/agents">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAgentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated"
                >
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-text-primary truncate">
                        {activity.agentName}
                      </p>
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {formatRelativeTime(activity.startedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">
                      {activity.projectName}
                    </p>
                    {activity.status === "running" && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-text-muted">{activity.message}</span>
                          <span className="text-text-primary font-mono">
                            {activity.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {activity.status === "completed" && (
                      <p className="text-xs text-success mt-1">{activity.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
