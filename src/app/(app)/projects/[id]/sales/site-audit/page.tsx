"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  Download,
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

type IssueSeverity = "critical" | "warning" | "info" | "passed";
type IssueCategory = "technical" | "content" | "performance" | "security" | "mobile";

interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  category: IssueCategory;
  affectedPages: number;
  impact: string;
  howToFix: string;
  expanded?: boolean;
}

const mockAuditIssues: AuditIssue[] = [
  {
    id: "1",
    title: "Missing meta descriptions",
    description: "23 pages are missing meta descriptions, which can impact click-through rates from search results.",
    severity: "critical",
    category: "content",
    affectedPages: 23,
    impact: "High - Affects CTR and rankings",
    howToFix: "Add unique, compelling meta descriptions (150-160 characters) to each page.",
  },
  {
    id: "2",
    title: "Slow page load time",
    description: "15 pages have a load time exceeding 3 seconds on mobile devices.",
    severity: "critical",
    category: "performance",
    affectedPages: 15,
    impact: "High - Core Web Vitals failure",
    howToFix: "Optimize images, enable compression, and leverage browser caching.",
  },
  {
    id: "3",
    title: "Broken internal links",
    description: "8 internal links are pointing to 404 pages.",
    severity: "warning",
    category: "technical",
    affectedPages: 8,
    impact: "Medium - Wastes crawl budget",
    howToFix: "Update or remove broken links, implement proper redirects.",
  },
  {
    id: "4",
    title: "Missing alt text on images",
    description: "45 images are missing alt text attributes.",
    severity: "warning",
    category: "content",
    affectedPages: 12,
    impact: "Medium - Accessibility and image SEO",
    howToFix: "Add descriptive alt text to all images.",
  },
  {
    id: "5",
    title: "Duplicate title tags",
    description: "5 pages have duplicate title tags.",
    severity: "warning",
    category: "content",
    affectedPages: 5,
    impact: "Medium - Keyword cannibalization",
    howToFix: "Create unique, descriptive title tags for each page.",
  },
  {
    id: "6",
    title: "Missing HTTPS redirect",
    description: "HTTP version of site is accessible without redirect.",
    severity: "critical",
    category: "security",
    affectedPages: 1,
    impact: "High - Security and trust signals",
    howToFix: "Implement 301 redirect from HTTP to HTTPS.",
  },
  {
    id: "7",
    title: "Mobile viewport not set",
    description: "2 pages are missing the viewport meta tag.",
    severity: "warning",
    category: "mobile",
    affectedPages: 2,
    impact: "Medium - Mobile usability",
    howToFix: "Add viewport meta tag to all pages.",
  },
  {
    id: "8",
    title: "Robots.txt blocking important pages",
    description: "Robots.txt may be blocking crawlers from important content.",
    severity: "info",
    category: "technical",
    affectedPages: 3,
    impact: "Low - Review recommended",
    howToFix: "Review robots.txt rules and ensure important pages are crawlable.",
  },
  {
    id: "9",
    title: "XML sitemap present",
    description: "XML sitemap is properly configured and submitted.",
    severity: "passed",
    category: "technical",
    affectedPages: 0,
    impact: "Positive - Helps crawling",
    howToFix: "No action needed.",
  },
  {
    id: "10",
    title: "SSL certificate valid",
    description: "SSL certificate is valid and properly configured.",
    severity: "passed",
    category: "security",
    affectedPages: 0,
    impact: "Positive - Trust signal",
    howToFix: "No action needed.",
  },
];

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-error",
    bg: "bg-error/10",
    label: "Critical",
    badgeVariant: "error" as const,
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Warning",
    badgeVariant: "warning" as const,
  },
  info: {
    icon: Info,
    color: "text-info",
    bg: "bg-info/10",
    label: "Info",
    badgeVariant: "info" as const,
  },
  passed: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    label: "Passed",
    badgeVariant: "success" as const,
  },
};

const categoryLabels: Record<IssueCategory, string> = {
  technical: "Technical",
  content: "Content",
  performance: "Performance",
  security: "Security",
  mobile: "Mobile",
};

export default function SiteAuditPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState<IssueSeverity | "all">("all");
  const [expandedIssues, setExpandedIssues] = React.useState<Set<string>>(new Set());

  if (!project) return null;

  const filteredIssues = mockAuditIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || issue.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const issueCounts = {
    critical: mockAuditIssues.filter((i) => i.severity === "critical").length,
    warning: mockAuditIssues.filter((i) => i.severity === "warning").length,
    info: mockAuditIssues.filter((i) => i.severity === "info").length,
    passed: mockAuditIssues.filter((i) => i.severity === "passed").length,
  };

  const toggleIssue = (id: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Site Audit</h1>
          <p className="text-text-secondary">
            Last crawled 2 hours ago • 156 pages analyzed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="accent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-crawl Site
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Health Score"
          value={`${project.healthScore}/100`}
          trend={5.2}
          trendLabel="vs last audit"
          icon={<Zap className="h-5 w-5" />}
        />
        <StatCard
          label="Critical Issues"
          value={issueCounts.critical}
          trend={-2}
          trendLabel="vs last audit"
          icon={<AlertCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Warnings"
          value={issueCounts.warning}
          trend={-5}
          trendLabel="vs last audit"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Passed Checks"
          value={issueCounts.passed}
          trend={3}
          trendLabel="vs last audit"
          icon={<CheckCircle className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
          {(["all", "critical", "warning", "info", "passed"] as const).map(
            (severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize flex items-center gap-1.5",
                  severityFilter === severity
                    ? "bg-bg-card text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {severity !== "all" && (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      severity === "critical" && "bg-error",
                      severity === "warning" && "bg-warning",
                      severity === "info" && "bg-info",
                      severity === "passed" && "bg-success"
                    )}
                  />
                )}
                {severity === "all" ? "All" : severityConfig[severity].label}
                {severity !== "all" && (
                  <span className="text-text-muted">
                    ({issueCounts[severity]})
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Issues ({filteredIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredIssues.map((issue) => {
              const config = severityConfig[issue.severity];
              const Icon = config.icon;
              const isExpanded = expandedIssues.has(issue.id);

              return (
                <div key={issue.id} className="p-4">
                  <button
                    onClick={() => toggleIssue(issue.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          config.bg
                        )}
                      >
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-text-primary">
                              {issue.title}
                            </h3>
                            <Badge variant={config.badgeVariant} className="text-xs">
                              {config.label}
                            </Badge>
                            <Badge variant="neutral" className="text-xs">
                              {categoryLabels[issue.category]}
                            </Badge>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-text-muted" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-text-muted" />
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                          {issue.description}
                        </p>
                        {issue.affectedPages > 0 && (
                          <p className="text-xs text-text-muted mt-1">
                            {issue.affectedPages} pages affected
                          </p>
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 ml-11 p-4 bg-bg-elevated rounded-lg space-y-3">
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                          Impact
                        </h4>
                        <p className="text-sm text-text-primary">{issue.impact}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                          How to Fix
                        </h4>
                        <p className="text-sm text-text-primary">{issue.howToFix}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="accent" size="sm">
                          <Zap className="h-3.5 w-3.5 mr-1" />
                          Auto-fix with AI
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View affected pages
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
