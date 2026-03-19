"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Target,
  FileText,
  Calendar,
  Users,
  BarChart3,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Layers,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

const strategyTools = [
  {
    id: "keyword-strategy",
    name: "Keyword Strategy",
    description: "Plan and prioritize target keywords",
    icon: Target,
    href: "keyword-strategy",
    status: "ready",
    progress: 75,
  },
  {
    id: "content-calendar",
    name: "Content Calendar",
    description: "Schedule and manage content production",
    icon: Calendar,
    href: "content-calendar",
    status: "ready",
    progress: 60,
  },
  {
    id: "content-briefs",
    name: "Content Briefs",
    description: "AI-generated content outlines",
    icon: FileText,
    href: "content-briefs",
    status: "ready",
    progress: 45,
  },
  {
    id: "topic-clusters",
    name: "Topic Clusters",
    description: "Build topical authority maps",
    icon: Layers,
    href: "topic-clusters",
    status: "ready",
    progress: 80,
  },
  {
    id: "competitor-gaps",
    name: "Competitor Gaps",
    description: "Identify content opportunities",
    icon: Users,
    href: "competitor-gaps",
    status: "ready",
    progress: 90,
  },
  {
    id: "content-ideas",
    name: "Content Ideas",
    description: "AI-powered content suggestions",
    icon: Lightbulb,
    href: "content-ideas",
    status: "ready",
    progress: 100,
  },
  {
    id: "serp-analysis",
    name: "SERP Analysis",
    description: "Analyze search result patterns",
    icon: BarChart3,
    href: "serp-analysis",
    status: "ready",
    progress: 55,
  },
  {
    id: "content-optimization",
    name: "Content Optimization",
    description: "Improve existing content performance",
    icon: PenTool,
    href: "content-optimization",
    status: "ready",
    progress: 30,
  },
];

const upcomingContent = [
  {
    id: 1,
    title: "Complete Guide to Technical SEO in 2026",
    type: "Pillar Page",
    dueDate: "Mar 20, 2026",
    status: "in_progress",
    assignee: "AI Writer",
    progress: 65,
  },
  {
    id: 2,
    title: "Local SEO Checklist for Small Businesses",
    type: "Blog Post",
    dueDate: "Mar 22, 2026",
    status: "draft",
    assignee: "Content Team",
    progress: 30,
  },
  {
    id: 3,
    title: "How to Optimize for Voice Search",
    type: "Blog Post",
    dueDate: "Mar 25, 2026",
    status: "planned",
    assignee: "AI Writer",
    progress: 0,
  },
  {
    id: 4,
    title: "E-commerce SEO Best Practices",
    type: "Guide",
    dueDate: "Mar 28, 2026",
    status: "planned",
    assignee: "Content Team",
    progress: 0,
  },
];

const statusConfig = {
  in_progress: { label: "In Progress", variant: "info" as const, icon: Clock },
  draft: { label: "Draft", variant: "warning" as const, icon: AlertCircle },
  planned: { label: "Planned", variant: "neutral" as const, icon: Calendar },
  published: { label: "Published", variant: "success" as const, icon: CheckCircle },
};

export default function StrategyOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Strategy</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Plan and organize your SEO content strategy
          </p>
        </div>
        <Button variant="accent" className="w-full sm:w-auto">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Strategy
        </Button>
      </div>

      {/* Quick Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Target Keywords"
          value="156"
          trend={12}
          trendLabel="this month"
          icon={<Target className="h-4 sm:h-5 w-4 sm:w-5" />}
        />
        <StatCard
          label="Content Planned"
          value="24"
          trend={8}
          trendLabel="pieces"
          icon={<FileText className="h-4 sm:h-5 w-4 sm:w-5" />}
        />
        <StatCard
          label="Topic Clusters"
          value="8"
          trendLabel="active clusters"
          icon={<Layers className="h-4 sm:h-5 w-4 sm:w-5" />}
        />
        <StatCard
          label="Content Score"
          value="78/100"
          trend={5}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-4 sm:h-5 w-4 sm:w-5" />}
          variant="accent"
        />
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">
          Strategy Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {strategyTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/projects/${projectId}/strategy/${tool.href}`}
            >
              <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <tool.icon className="h-5 w-5 text-accent" />
                    </div>
                    {tool.progress === 100 && (
                      <Badge variant="success">Complete</Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-text-primary mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-3">
                    {tool.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Progress</span>
                      <span className="text-text-primary font-mono">
                        {tool.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${tool.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Content</CardTitle>
          <Link href={`/projects/${projectId}/strategy/content-calendar`}>
            <Button variant="ghost" size="sm">
              View Calendar
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingContent.map((content) => {
              const config = statusConfig[content.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;

              return (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        content.status === "in_progress" && "bg-info/10",
                        content.status === "draft" && "bg-warning/10",
                        content.status === "planned" && "bg-bg-card"
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          "h-4 w-4",
                          content.status === "in_progress" && "text-info",
                          content.status === "draft" && "text-warning",
                          content.status === "planned" && "text-text-muted"
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary truncate">
                        {content.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>{content.type}</span>
                        <span>•</span>
                        <span>{content.assignee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {content.progress > 0 && (
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-text-muted">Progress</span>
                          <span className="text-text-primary font-mono">
                            {content.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${content.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-text-primary">{content.dueDate}</p>
                      <Badge variant={config.variant} className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
