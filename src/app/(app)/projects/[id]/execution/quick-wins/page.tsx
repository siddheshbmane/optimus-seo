"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  FileText,
  Link2,
  Code,
  Play,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { useProjectContext } from "@/contexts/project-context";
import { useProjectConfig } from "@/contexts/project-config-context";
import { useKeywordData, useBacklinksSummary, useSiteAuditData, useTechnicalIssues } from "@/hooks/use-seo-data";
import { formatNumber, cn } from "@/lib/utils";

interface QuickWin {
  id: string;
  title: string;
  description: string;
  type: "content" | "technical" | "links" | "meta";
  impact: "high" | "medium" | "low";
  effort: "easy" | "medium" | "hard";
  estimatedTime: string;
  potentialTraffic: number;
  status: "pending" | "in_progress" | "completed";
  keyword?: string;
}

// ── Fallback mock data used when no real data is available ──────────────
const fallbackQuickWins: QuickWin[] = [
  {
    id: "mock-1",
    title: "Add FAQ schema to top 5 pages",
    description: "Implement FAQ structured data to win featured snippets",
    type: "technical",
    impact: "high",
    effort: "easy",
    estimatedTime: "30 min",
    potentialTraffic: 2500,
    status: "pending",
  },
  {
    id: "mock-2",
    title: "Optimize title tags for CTR",
    description: "Update 12 pages with low CTR despite good rankings",
    type: "meta",
    impact: "high",
    effort: "easy",
    estimatedTime: "1 hour",
    potentialTraffic: 3200,
    status: "pending",
  },
  {
    id: "mock-3",
    title: "Fix broken internal links",
    description: "23 broken internal links found across the site",
    type: "technical",
    impact: "medium",
    effort: "easy",
    estimatedTime: "45 min",
    potentialTraffic: 800,
    status: "pending",
  },
  {
    id: "mock-4",
    title: "Add internal links to orphan pages",
    description: "8 pages have no internal links pointing to them",
    type: "links",
    impact: "medium",
    effort: "easy",
    estimatedTime: "30 min",
    potentialTraffic: 1200,
    status: "pending",
  },
  {
    id: "mock-5",
    title: "Expand thin content pages",
    description: "5 pages under 500 words need more content",
    type: "content",
    impact: "high",
    effort: "medium",
    estimatedTime: "3 hours",
    potentialTraffic: 4500,
    status: "pending",
    keyword: "seo services",
  },
  {
    id: "mock-6",
    title: "Add alt text to images",
    description: "156 images missing alt text",
    type: "technical",
    impact: "low",
    effort: "easy",
    estimatedTime: "2 hours",
    potentialTraffic: 500,
    status: "pending",
  },
  {
    id: "mock-7",
    title: "Optimize meta descriptions",
    description: "18 pages have duplicate or missing meta descriptions",
    type: "meta",
    impact: "medium",
    effort: "easy",
    estimatedTime: "1 hour",
    potentialTraffic: 1800,
    status: "pending",
  },
  {
    id: "mock-8",
    title: "Compress large images",
    description: "34 images over 500KB slowing page speed",
    type: "technical",
    impact: "medium",
    effort: "easy",
    estimatedTime: "1 hour",
    potentialTraffic: 1500,
    status: "pending",
  },
];

// ── localStorage helpers for persisting win statuses ────────────────────
const STORAGE_KEY_PREFIX = "optimus_quick_wins_";

function getStorageKey(projectId: string): string {
  return `${STORAGE_KEY_PREFIX}${projectId}`;
}

function loadWinStatuses(projectId: string): Record<string, "pending" | "in_progress" | "completed"> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(getStorageKey(projectId));
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveWinStatuses(projectId: string, statuses: Record<string, "pending" | "in_progress" | "completed">) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(projectId), JSON.stringify(statuses));
  } catch {
    // silently ignore
  }
}

// ── Generate quick wins from real data ──────────────────────────────────
function generateQuickWinsFromData(
  keywordData: ReturnType<typeof useKeywordData>["data"],
  auditData: ReturnType<typeof useSiteAuditData>["data"],
  technicalIssues: ReturnType<typeof useTechnicalIssues>["data"],
  backlinksSummary: ReturnType<typeof useBacklinksSummary>["data"],
): QuickWin[] {
  const wins: QuickWin[] = [];

  // 1. Low-difficulty, high-volume keywords not yet ranking well
  if (keywordData && keywordData.length > 0) {
    const opportunities = keywordData
      .filter((kw) => kw.difficulty < 40 && kw.volume > 500 && (!kw.position || kw.position > 10))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 3);

    opportunities.forEach((kw, i) => {
      wins.push({
        id: `kw-${i}`,
        title: `Create optimized content for "${kw.keyword}"`,
        description: `Low difficulty (${kw.difficulty}/100) keyword with ${formatNumber(kw.volume)} monthly searches${kw.position ? `. Currently ranking #${kw.position}` : " - not yet ranking"}`,
        type: "content",
        impact: kw.volume > 2000 ? "high" : kw.volume > 1000 ? "medium" : "low",
        effort: kw.difficulty < 20 ? "easy" : "medium",
        estimatedTime: kw.difficulty < 20 ? "1 hour" : "2 hours",
        potentialTraffic: Math.round(kw.volume * 0.3),
        status: "pending",
        keyword: kw.keyword,
      });
    });

    // Keywords ranking on page 2 (positions 11-20) - quick to push to page 1
    const almostThere = keywordData
      .filter((kw) => kw.position && kw.position >= 11 && kw.position <= 20 && kw.volume > 200)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 2);

    almostThere.forEach((kw, i) => {
      wins.push({
        id: `page2-${i}`,
        title: `Push "${kw.keyword}" from page 2 to page 1`,
        description: `Currently ranking #${kw.position} with ${formatNumber(kw.volume)} monthly searches. Optimize on-page SEO and add internal links.`,
        type: "content",
        impact: "high",
        effort: "medium",
        estimatedTime: "2 hours",
        potentialTraffic: Math.round(kw.volume * 0.25),
        status: "pending",
        keyword: kw.keyword,
      });
    });
  }

  // 2. Technical issues from audit
  if (technicalIssues && technicalIssues.length > 0) {
    const criticalIssues = technicalIssues
      .filter((issue) => issue.severity === "critical")
      .slice(0, 2);

    criticalIssues.forEach((issue, i) => {
      wins.push({
        id: `tech-${i}`,
        title: issue.title,
        description: `${issue.description} (${issue.affectedUrls.length} URLs affected)`,
        type: "technical",
        impact: "high",
        effort: issue.affectedUrls.length > 10 ? "medium" : "easy",
        estimatedTime: issue.affectedUrls.length > 10 ? "2 hours" : "45 min",
        potentialTraffic: issue.affectedUrls.length * 100,
        status: "pending",
      });
    });

    const warningIssues = technicalIssues
      .filter((issue) => issue.severity === "warning")
      .slice(0, 2);

    warningIssues.forEach((issue, i) => {
      wins.push({
        id: `warn-${i}`,
        title: issue.title,
        description: `${issue.description} (${issue.affectedUrls.length} URLs affected)`,
        type: "technical",
        impact: "medium",
        effort: "easy",
        estimatedTime: "1 hour",
        potentialTraffic: issue.affectedUrls.length * 50,
        status: "pending",
      });
    });
  }

  // 3. Audit-based meta/content wins
  if (auditData) {
    const metaCategory = auditData.categories.find(
      (c) => c.name.toLowerCase().includes("meta") || c.name.toLowerCase().includes("seo")
    );
    if (metaCategory && metaCategory.issues > 0) {
      wins.push({
        id: "audit-meta",
        title: "Fix meta tag issues across the site",
        description: `${metaCategory.issues} meta-related issues found. Health score: ${metaCategory.score}%`,
        type: "meta",
        impact: metaCategory.issues > 10 ? "high" : "medium",
        effort: "easy",
        estimatedTime: "1 hour",
        potentialTraffic: metaCategory.issues * 80,
        status: "pending",
      });
    }

    const contentCategory = auditData.categories.find(
      (c) => c.name.toLowerCase().includes("content")
    );
    if (contentCategory && contentCategory.issues > 0) {
      wins.push({
        id: "audit-content",
        title: "Address content quality issues",
        description: `${contentCategory.issues} content issues detected. Improve thin pages and duplicate content.`,
        type: "content",
        impact: contentCategory.issues > 5 ? "high" : "medium",
        effort: "medium",
        estimatedTime: "3 hours",
        potentialTraffic: contentCategory.issues * 150,
        status: "pending",
      });
    }
  }

  // 4. Backlink-related wins
  if (backlinksSummary) {
    const brokenBacklinks = (backlinksSummary as unknown as Record<string, unknown>).brokenBacklinks;
    if (typeof brokenBacklinks === "number" && brokenBacklinks > 0) {
      wins.push({
        id: "bl-broken",
        title: "Reclaim broken backlinks",
        description: `${brokenBacklinks} broken backlinks found. Set up redirects to recapture link equity.`,
        type: "links",
        impact: brokenBacklinks > 20 ? "high" : "medium",
        effort: "easy",
        estimatedTime: "30 min",
        potentialTraffic: brokenBacklinks * 30,
        status: "pending",
      });
    }
  }

  return wins;
}

const typeConfig = {
  content: { icon: FileText, color: "bg-info/10 text-info" },
  technical: { icon: Code, color: "bg-warning/10 text-warning" },
  links: { icon: Link2, color: "bg-success/10 text-success" },
  meta: { icon: Target, color: "bg-accent/10 text-accent" },
};

export default function QuickWinsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  const { config } = useProjectConfig();

  // Fetch real data
  const domain = project?.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "";
  const keywordHook = useKeywordData(domain);
  const auditHook = useSiteAuditData(project?.url || "");
  const technicalHook = useTechnicalIssues(project?.url || "");
  const backlinksHook = useBacklinksSummary(domain);

  const isDataLoading = keywordHook.isLoading || auditHook.isLoading || technicalHook.isLoading || backlinksHook.isLoading;
  const dataSource = keywordHook.source || auditHook.source || technicalHook.source || backlinksHook.source;

  // Persisted statuses
  const [statuses, setStatuses] = React.useState<Record<string, "pending" | "in_progress" | "completed">>({});

  React.useEffect(() => {
    setStatuses(loadWinStatuses(projectId));
  }, [projectId]);

  // Generate wins from real data, fall back to mock
  const generatedWins = React.useMemo(() => {
    const hasRealData =
      (keywordHook.data && keywordHook.data.length > 0) ||
      auditHook.data ||
      (technicalHook.data && technicalHook.data.length > 0) ||
      backlinksHook.data;

    if (hasRealData) {
      return generateQuickWinsFromData(
        keywordHook.data,
        auditHook.data,
        technicalHook.data,
        backlinksHook.data,
      );
    }

    return fallbackQuickWins;
  }, [keywordHook.data, auditHook.data, technicalHook.data, backlinksHook.data]);

  // Merge persisted statuses onto generated wins
  const wins = React.useMemo(() => {
    return generatedWins.map((w) => ({
      ...w,
      status: statuses[w.id] || w.status,
    }));
  }, [generatedWins, statuses]);

  const updateStatus = React.useCallback(
    (id: string, status: "pending" | "in_progress" | "completed") => {
      setStatuses((prev) => {
        const next = { ...prev, [id]: status };
        saveWinStatuses(projectId, next);
        return next;
      });
    },
    [projectId],
  );

  const startWin = React.useCallback((id: string) => updateStatus(id, "in_progress"), [updateStatus]);
  const completeWin = React.useCallback((id: string) => updateStatus(id, "completed"), [updateStatus]);

  const handleRefresh = React.useCallback(() => {
    keywordHook.refetch();
    auditHook.refetch();
    technicalHook.refetch();
    backlinksHook.refetch();
  }, [keywordHook, auditHook, technicalHook, backlinksHook]);

  if (!project) return null;

  const pendingWins = wins.filter((w) => w.status === "pending");
  const inProgressWins = wins.filter((w) => w.status === "in_progress");
  const completedWins = wins.filter((w) => w.status === "completed");
  const activeWins = wins.filter((w) => w.status !== "completed");
  const totalPotentialTraffic = pendingWins.reduce((sum, w) => sum + w.potentialTraffic, 0);
  const highImpactWins = pendingWins.filter((w) => w.impact === "high");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Quick Wins</h1>
            <DataSourceIndicator
              source={dataSource}
              isLoading={isDataLoading}
              onRefresh={handleRefresh}
              compact
            />
          </div>
          <p className="text-text-secondary">
            Low-effort, high-impact SEO improvements
          </p>
        </div>
        {pendingWins.length > 0 && (
          <Button
            variant="accent"
            size="sm"
            onClick={() => {
              pendingWins
                .filter((w) => w.effort === "easy")
                .forEach((w) => startWin(w.id));
            }}
          >
            <Zap className="h-4 w-4 mr-2" />
            Execute All Easy Wins
          </Button>
        )}
      </div>

      {/* Loading state */}
      {isDataLoading && wins.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted mr-2" />
          <span className="text-text-muted">Analyzing your site for quick wins...</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Wins"
          value={pendingWins.length}
          trendLabel="opportunities"
          icon={<Zap className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="High Impact"
          value={highImpactWins.length}
          trendLabel="priority wins"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Potential Traffic"
          value={`+${formatNumber(totalPotentialTraffic)}`}
          trendLabel="monthly visits"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={completedWins.length}
          trend={completedWins.length}
          trendLabel="this month"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Quick Wins List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeWins.map((win) => {
          const TypeIcon = typeConfig[win.type].icon;
          return (
            <Card
              key={win.id}
              className={cn(
                "transition-colors",
                win.status === "in_progress" && "border-accent/50",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      typeConfig[win.type].color,
                    )}
                  >
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-text-primary">{win.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            win.impact === "high"
                              ? "success"
                              : win.impact === "medium"
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {win.impact} impact
                        </Badge>
                        {win.status === "in_progress" && (
                          <Badge variant="accent">In Progress</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mb-3">{win.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {win.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +{formatNumber(win.potentialTraffic)} traffic
                        </span>
                        <Badge variant="neutral">{win.effort}</Badge>
                      </div>

                      {win.status === "pending" ? (
                        <Button variant="accent" size="sm" onClick={() => startWin(win.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => completeWin(win.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completed Wins */}
      {completedWins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Completed Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedWins.map((win) => {
                const TypeIcon = typeConfig[win.type].icon;
                return (
                  <div
                    key={win.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          typeConfig[win.type].color,
                        )}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{win.title}</p>
                        <p className="text-xs text-text-muted">
                          +{formatNumber(win.potentialTraffic)} potential traffic
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
