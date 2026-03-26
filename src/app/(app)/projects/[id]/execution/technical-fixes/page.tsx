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
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/contexts/project-context";
import { useTechnicalIssues } from "@/hooks/use-seo-data";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { cn } from "@/lib/utils";

// Fallback mock data (used when API returns nothing)
const fallbackIssues = [
  {
    id: "fallback-1",
    title: "Missing meta descriptions",
    category: "Content",
    severity: "critical" as const,
    affectedPages: 23,
    autoFixable: true,
    estimatedTime: "2 min",
    description: "Pages are missing meta descriptions, which affects click-through rates from search results.",
    howToFix: "Add unique, descriptive meta descriptions to each page (150-160 characters).",
  },
  {
    id: "fallback-2",
    title: "Broken internal links",
    category: "Technical",
    severity: "warning" as const,
    affectedPages: 8,
    autoFixable: true,
    estimatedTime: "1 min",
    description: "Internal links pointing to non-existent pages return 404 errors.",
    howToFix: "Update or remove broken internal links to improve crawlability.",
  },
  {
    id: "fallback-3",
    title: "Missing alt text on images",
    category: "Content",
    severity: "warning" as const,
    affectedPages: 45,
    autoFixable: true,
    estimatedTime: "3 min",
    description: "Images without alt text are not accessible and miss SEO opportunities.",
    howToFix: "Add descriptive alt text to all images that convey meaning.",
  },
  {
    id: "fallback-4",
    title: "Duplicate title tags",
    category: "Content",
    severity: "warning" as const,
    affectedPages: 5,
    autoFixable: true,
    estimatedTime: "1 min",
    description: "Multiple pages share the same title tag, causing confusion for search engines.",
    howToFix: "Create unique title tags for each page that accurately describe the content.",
  },
  {
    id: "fallback-5",
    title: "Missing canonical tags",
    category: "Technical",
    severity: "critical" as const,
    affectedPages: 12,
    autoFixable: true,
    estimatedTime: "1 min",
    description: "Pages without canonical tags may cause duplicate content issues.",
    howToFix: "Add rel=\"canonical\" tags to specify the preferred version of each page.",
  },
  {
    id: "fallback-6",
    title: "Slow page load time",
    category: "Performance",
    severity: "critical" as const,
    affectedPages: 15,
    autoFixable: false,
    estimatedTime: null,
    description: "Pages with slow load times negatively impact user experience and rankings.",
    howToFix: "Optimize images, minify CSS/JS, enable caching, and consider a CDN.",
  },
];

interface MappedIssue {
  id: string;
  title: string;
  category: string;
  severity: "critical" | "warning" | "info";
  affectedPages: number;
  autoFixable: boolean;
  estimatedTime: string | null;
  description: string;
  howToFix: string;
  status: "pending" | "completed" | "manual";
}

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

function mapSeverity(severity: string): "critical" | "warning" | "info" {
  if (severity === "critical") return "critical";
  if (severity === "warning") return "warning";
  return "info";
}

function inferCategory(type: string, title: string): string {
  const lower = (type + " " + title).toLowerCase();
  if (lower.includes("meta") || lower.includes("title") || lower.includes("description") || lower.includes("content") || lower.includes("alt") || lower.includes("heading") || lower.includes("h1")) return "Content";
  if (lower.includes("speed") || lower.includes("load") || lower.includes("performance") || lower.includes("core web") || lower.includes("lcp") || lower.includes("cls")) return "Performance";
  if (lower.includes("link") || lower.includes("redirect") || lower.includes("broken")) return "Links";
  return "Technical";
}

export default function TechnicalFixesPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  // Fetch real technical issues
  const { data: technicalIssues, isLoading, source, refetch } = useTechnicalIssues(project?.url || '');

  // AI fix generation state
  const [generatingFix, setGeneratingFix] = React.useState<string | null>(null);
  const [generatedFixes, setGeneratedFixes] = React.useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [expandedIssue, setExpandedIssue] = React.useState<string | null>(null);
  const [completedIssues, setCompletedIssues] = React.useState<Set<string>>(new Set());

  // Map API data to UI format, fallback to mock
  const fixableIssues: MappedIssue[] = React.useMemo(() => {
    if (technicalIssues && technicalIssues.length > 0) {
      return technicalIssues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        category: inferCategory(issue.type, issue.title),
        severity: mapSeverity(issue.severity),
        affectedPages: issue.affectedUrls?.length || 1,
        autoFixable: issue.severity !== "notice",
        estimatedTime: issue.severity === "critical" ? "2 min" : "1 min",
        description: issue.description,
        howToFix: issue.howToFix,
        status: "pending" as const,
      }));
    }
    return fallbackIssues.map((issue) => ({
      ...issue,
      status: (issue.autoFixable ? "pending" : "manual") as "pending" | "completed" | "manual",
    }));
  }, [technicalIssues]);

  // Derive display issues with completed status applied
  const displayIssues = React.useMemo(() => {
    return fixableIssues.map((issue) => ({
      ...issue,
      status: completedIssues.has(issue.id) ? ("completed" as const) : issue.status,
    }));
  }, [fixableIssues, completedIssues]);

  const pendingIssues = displayIssues.filter((i) => i.status !== "completed");
  const completedCount = displayIssues.filter((i) => i.status === "completed").length;
  const autoFixableCount = displayIssues.filter((i) => i.autoFixable && i.status !== "completed").length;
  const criticalCount = pendingIssues.filter((i) => i.severity === "critical").length;
  const totalAffected = pendingIssues.reduce((sum, i) => sum + i.affectedPages, 0);

  if (!project) return null;

  const handleGenerateFix = async (issue: MappedIssue) => {
    setGeneratingFix(issue.id);
    try {
      const response = await fetch("/api/llm/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "technicalAudit",
          params: {
            issues: [issue.title + ": " + issue.description],
            url: project?.url || "",
          },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedFixes((prev) => ({ ...prev, [issue.id]: data.result }));
      }
    } catch (error) {
      console.warn("Failed to generate AI fix:", error);
    } finally {
      setGeneratingFix(null);
    }
  };

  const handleMarkCompleted = (issueId: string) => {
    setCompletedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }
      return next;
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleFixAll = async () => {
    const pending = displayIssues.filter(
      (i) => i.autoFixable && i.status !== "completed" && !generatedFixes[i.id]
    );
    for (const issue of pending) {
      await handleGenerateFix(issue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">Technical Fixes</h1>
            <DataSourceIndicator source={source} isLoading={isLoading} onRefresh={refetch} compact />
          </div>
          <p className="text-text-secondary">
            Auto-fix technical SEO issues with AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Re-scan
          </Button>
          <Button variant="accent" size="sm" onClick={handleFixAll} disabled={autoFixableCount === 0}>
            <Zap className="h-4 w-4 mr-2" />
            Fix All Issues
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Issues"
          value={pendingIssues.length}
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
          label="Completed"
          value={completedCount}
          trendLabel={`of ${displayIssues.length} total`}
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 text-accent animate-spin" />
              <p className="text-text-secondary">Scanning for technical issues...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fixable Issues */}
      {!isLoading && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Issues to Fix</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="error">{criticalCount} Critical</Badge>
              <Badge variant="warning">{pendingIssues.filter((i) => i.severity === "warning").length} Warnings</Badge>
              {completedCount > 0 && (
                <Badge variant="success">{completedCount} Fixed</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayIssues.map((issue) => {
                const severity = severityConfig[issue.severity as keyof typeof severityConfig];
                const SeverityIcon = severity.icon;
                const isCompleted = issue.status === "completed";
                const isExpanded = expandedIssue === issue.id;
                const isGenerating = generatingFix === issue.id;
                const hasFix = !!generatedFixes[issue.id];

                return (
                  <div
                    key={issue.id}
                    className={cn(
                      "rounded-lg border transition-colors",
                      isCompleted
                        ? "border-success/30 bg-success/5"
                        : "border-border"
                    )}
                  >
                    {/* Issue Row */}
                    <div className="flex items-center justify-between p-4">
                      <button
                        className="flex items-center gap-4 flex-1 text-left"
                        onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            isCompleted && "bg-success/10",
                            !isCompleted && issue.severity === "critical" && "bg-error/10",
                            !isCompleted && issue.severity === "warning" && "bg-warning/10",
                            !isCompleted && issue.severity === "info" && "bg-info/10"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <SeverityIcon
                              className={cn(
                                "h-5 w-5",
                                issue.severity === "critical" && "text-error",
                                issue.severity === "warning" && "text-warning",
                                issue.severity === "info" && "text-info"
                              )}
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                "font-medium",
                                isCompleted ? "text-text-muted line-through" : "text-text-primary"
                              )}
                            >
                              {issue.title}
                            </h3>
                            {!isCompleted && <Badge variant={severity.variant}>{severity.label}</Badge>}
                            {isCompleted && <Badge variant="success">Fixed</Badge>}
                            <Badge variant="neutral">{issue.category}</Badge>
                          </div>
                          <p className="text-sm text-text-muted">
                            {issue.affectedPages} pages affected
                            {issue.autoFixable && issue.estimatedTime && ` \u2022 Est. ${issue.estimatedTime}`}
                          </p>
                        </div>
                      </button>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!isCompleted && (
                          <>
                            {issue.autoFixable ? (
                              <Button
                                variant="accent"
                                size="sm"
                                disabled={isGenerating}
                                onClick={() => handleGenerateFix(issue)}
                              >
                                {isGenerating ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : hasFix ? (
                                  <Check className="h-4 w-4 mr-1" />
                                ) : (
                                  <Zap className="h-4 w-4 mr-1" />
                                )}
                                {isGenerating ? "Generating..." : hasFix ? "Regenerate" : "Auto-Fix"}
                              </Button>
                            ) : (
                              <Button variant="secondary" size="sm">
                                <Settings className="h-4 w-4 mr-1" />
                                Manual Fix
                              </Button>
                            )}
                          </>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-text-muted" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-text-muted" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4">
                        <div className="ml-14 p-4 bg-bg-elevated rounded-lg space-y-3">
                          {issue.description && (
                            <div>
                              <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                                Description
                              </h4>
                              <p className="text-sm text-text-primary">{issue.description}</p>
                            </div>
                          )}
                          {issue.howToFix && (
                            <div>
                              <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                                How to Fix
                              </h4>
                              <p className="text-sm text-text-primary">{issue.howToFix}</p>
                            </div>
                          )}

                          {/* AI Generated Fix */}
                          {hasFix && (
                            <div className="mt-3 p-4 rounded-lg border border-accent/30 bg-accent/5">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                                  <Zap className="h-4 w-4 text-accent" />
                                  AI-Generated Fix
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(generatedFixes[issue.id], `fix-${issue.id}`)}
                                >
                                  {copiedCode === `fix-${issue.id}` ? (
                                    <Check className="h-3.5 w-3.5 mr-1 text-success" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {copiedCode === `fix-${issue.id}` ? "Copied!" : "Copy"}
                                </Button>
                              </div>
                              <pre className="p-3 bg-bg-primary rounded-lg text-sm font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap">
                                {generatedFixes[issue.id]}
                              </pre>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2">
                            {!isCompleted && issue.autoFixable && !hasFix && (
                              <Button
                                variant="accent"
                                size="sm"
                                disabled={isGenerating}
                                onClick={() => handleGenerateFix(issue)}
                              >
                                {isGenerating ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <Zap className="h-3.5 w-3.5 mr-1" />
                                )}
                                {isGenerating ? "Generating..." : "Generate AI Fix"}
                              </Button>
                            )}
                            <Button
                              variant={isCompleted ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => handleMarkCompleted(issue.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              {isCompleted ? "Mark Pending" : "Mark as Fixed"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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
                      <span>&bull;</span>
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
