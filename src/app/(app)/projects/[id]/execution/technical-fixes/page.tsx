"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Code,
  Play,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  Zap,
  RefreshCw,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

const fixableIssues = [
  {
    id: 1,
    title: "Missing meta descriptions",
    category: "Content",
    severity: "critical",
    affectedPages: 23,
    autoFixable: true,
    estimatedTime: "2 min",
    status: "pending",
  },
  {
    id: 2,
    title: "Broken internal links",
    category: "Technical",
    severity: "warning",
    affectedPages: 8,
    autoFixable: true,
    estimatedTime: "1 min",
    status: "pending",
  },
  {
    id: 3,
    title: "Missing alt text on images",
    category: "Content",
    severity: "warning",
    affectedPages: 45,
    autoFixable: true,
    estimatedTime: "3 min",
    status: "pending",
  },
  {
    id: 4,
    title: "Duplicate title tags",
    category: "Content",
    severity: "warning",
    affectedPages: 5,
    autoFixable: true,
    estimatedTime: "1 min",
    status: "pending",
  },
  {
    id: 5,
    title: "Missing canonical tags",
    category: "Technical",
    severity: "critical",
    affectedPages: 12,
    autoFixable: true,
    estimatedTime: "1 min",
    status: "pending",
  },
  {
    id: 6,
    title: "Slow page load time",
    category: "Performance",
    severity: "critical",
    affectedPages: 15,
    autoFixable: false,
    estimatedTime: null,
    status: "manual",
  },
];

const recentFixes = [
  {
    id: 1,
    title: "Fixed 15 broken internal links",
    category: "Technical",
    fixedAt: "1 hour ago",
    pagesAffected: 15,
    impact: "+3 Health Score",
  },
  {
    id: 2,
    title: "Added meta descriptions to 18 pages",
    category: "Content",
    fixedAt: "3 hours ago",
    pagesAffected: 18,
    impact: "+5 Health Score",
  },
  {
    id: 3,
    title: "Implemented canonical tags",
    category: "Technical",
    fixedAt: "1 day ago",
    pagesAffected: 25,
    impact: "+4 Health Score",
  },
  {
    id: 4,
    title: "Fixed duplicate H1 tags",
    category: "Content",
    fixedAt: "2 days ago",
    pagesAffected: 8,
    impact: "+2 Health Score",
  },
];

const severityConfig = {
  critical: { label: "Critical", variant: "error" as const, icon: AlertCircle },
  warning: { label: "Warning", variant: "warning" as const, icon: AlertTriangle },
  info: { label: "Info", variant: "info" as const, icon: AlertCircle },
};

export default function TechnicalFixesPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  const autoFixableCount = fixableIssues.filter(i => i.autoFixable).length;
  const criticalCount = fixableIssues.filter(i => i.severity === "critical").length;
  const totalAffected = fixableIssues.reduce((sum, i) => sum + i.affectedPages, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Technical Fixes</h1>
          <p className="text-text-secondary">
            Auto-fix technical SEO issues with AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-scan
          </Button>
          <Button variant="accent">
            <Zap className="h-4 w-4 mr-2" />
            Fix All Issues
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Issues Found"
          value={fixableIssues.length}
          trendLabel="need attention"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Auto-Fixable"
          value={autoFixableCount}
          trendLabel="can be fixed automatically"
          icon={<Zap className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Critical Issues"
          value={criticalCount}
          trendLabel="high priority"
          icon={<AlertCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Pages Affected"
          value={totalAffected}
          trendLabel="total pages"
          icon={<Code className="h-5 w-5" />}
        />
      </div>

      {/* Fixable Issues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Issues to Fix</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="error">{criticalCount} Critical</Badge>
            <Badge variant="warning">{fixableIssues.filter(i => i.severity === "warning").length} Warnings</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fixableIssues.map((issue) => {
              const severity = severityConfig[issue.severity as keyof typeof severityConfig];
              const SeverityIcon = severity.icon;
              return (
                <div key={issue.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      issue.severity === "critical" && "bg-error/10",
                      issue.severity === "warning" && "bg-warning/10"
                    )}>
                      <SeverityIcon className={cn(
                        "h-5 w-5",
                        issue.severity === "critical" && "text-error",
                        issue.severity === "warning" && "text-warning"
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text-primary">{issue.title}</h3>
                        <Badge variant={severity.variant}>{severity.label}</Badge>
                        <Badge variant="neutral">{issue.category}</Badge>
                      </div>
                      <p className="text-sm text-text-muted">
                        {issue.affectedPages} pages affected
                        {issue.autoFixable && ` • Est. ${issue.estimatedTime}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {issue.autoFixable ? (
                      <Button variant="accent" size="sm">
                        <Zap className="h-4 w-4 mr-1" />
                        Auto-Fix
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Manual Fix
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Fixes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fixes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFixes.map((fix) => (
              <div key={fix.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{fix.title}</p>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Badge variant="neutral">{fix.category}</Badge>
                      <span>{fix.pagesAffected} pages</span>
                      <span>•</span>
                      <span>{fix.fixedAt}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="success">{fix.impact}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
