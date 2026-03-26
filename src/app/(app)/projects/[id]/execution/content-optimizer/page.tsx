"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileCheck,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { useProjectContext } from "@/contexts/project-context";
import { formatNumber, cn } from "@/lib/utils";

interface ContentItem {
  id: number;
  title: string;
  url: string;
  currentScore: number;
  potentialScore: number;
  issues: string[];
  status: string;
  progress?: number;
  traffic: number;
  keywords: number;
}

const contentToOptimize: ContentItem[] = [
  {
    id: 1,
    title: "SEO Best Practices Guide",
    url: "/blog/seo-best-practices",
    currentScore: 68,
    potentialScore: 92,
    issues: ["Missing H2 tags", "Low keyword density", "No internal links"],
    status: "pending",
    traffic: 2400,
    keywords: 12,
  },
  {
    id: 2,
    title: "Link Building Strategies",
    url: "/blog/link-building",
    currentScore: 72,
    potentialScore: 88,
    issues: ["Thin content", "Missing meta description"],
    status: "pending",
    traffic: 3200,
    keywords: 18,
  },
  {
    id: 3,
    title: "Local SEO Tips",
    url: "/blog/local-seo-tips",
    currentScore: 58,
    potentialScore: 85,
    issues: ["Outdated information", "Missing schema markup", "Poor readability"],
    status: "pending",
    traffic: 1800,
    keywords: 8,
  },
  {
    id: 4,
    title: "Technical SEO Checklist",
    url: "/blog/technical-seo-checklist",
    currentScore: 82,
    potentialScore: 95,
    issues: ["Missing alt tags"],
    status: "completed",
    traffic: 5600,
    keywords: 24,
  },
  {
    id: 5,
    title: "Content Marketing Guide",
    url: "/blog/content-marketing",
    currentScore: 65,
    potentialScore: 90,
    issues: ["No FAQ section", "Missing internal links", "Low word count"],
    status: "pending",
    traffic: 2100,
    keywords: 15,
  },
];

const optimizationStats = {
  totalPages: 156,
  optimized: 89,
  pending: 45,
  inProgress: 3,
  avgScoreImprovement: 18,
};

export default function ContentOptimizerPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  const [content, setContent] = React.useState<ContentItem[]>(contentToOptimize);

  // URL analysis state
  const [analyzeUrl, setAnalyzeUrl] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);

  // Per-card optimization state
  const [optimizingId, setOptimizingId] = React.useState<number | null>(null);
  const [optimizationResults, setOptimizationResults] = React.useState<Record<number, string>>({});
  const [expandedResults, setExpandedResults] = React.useState<Record<number, boolean>>({});

  if (!project) return null;

  const handleAnalyzeUrl = async () => {
    if (!analyzeUrl.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/llm/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyzeContent",
          params: {
            content: `URL: ${analyzeUrl.trim()}`,
            targetKeyword: "seo",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze URL");
      }

      setAnalysisResult(data.result);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startOptimization = async (id: number) => {
    setOptimizingId(id);
    setContent((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "optimizing" } : c))
    );

    const item = content.find((c) => c.id === id);
    if (!item) return;

    try {
      const response = await fetch("/api/llm/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyzeContent",
          params: {
            content: `Title: ${item.title}\nURL: ${item.url}\nCurrent Issues: ${item.issues.join(", ")}`,
            targetKeyword: item.title.split(" ").slice(0, 2).join(" ").toLowerCase(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Optimization failed");
      }

      setOptimizationResults((prev) => ({ ...prev, [id]: data.result }));
      setExpandedResults((prev) => ({ ...prev, [id]: true }));
      setContent((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, status: "completed", currentScore: c.potentialScore }
            : c
        )
      );
    } catch (err) {
      // On error, revert status and show the error as optimization result
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setOptimizationResults((prev) => ({
        ...prev,
        [id]: `Error: ${errorMessage}`,
      }));
      setExpandedResults((prev) => ({ ...prev, [id]: true }));
      setContent((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "pending" } : c))
      );
    } finally {
      setOptimizingId(null);
    }
  };

  const toggleResultExpanded = (id: number) => {
    setExpandedResults((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Content Optimizer</h1>
            <DataSourceIndicator source="mock" compact />
          </div>
          <p className="text-text-secondary">
            AI-powered content optimization for better rankings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan All Pages
          </Button>
          <Button variant="accent" size="md">
            <Sparkles className="h-4 w-4 mr-2" />
            Optimize All
          </Button>
        </div>
      </div>

      {/* URL Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-accent" />
            Analyze a URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a URL to analyze (e.g., https://example.com/blog/post)"
              value={analyzeUrl}
              onChange={(e) => setAnalyzeUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isAnalyzing) handleAnalyzeUrl();
              }}
              className="flex-1"
            />
            <Button
              variant="accent"
              size="md"
              onClick={handleAnalyzeUrl}
              disabled={isAnalyzing || !analyzeUrl.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {analysisError && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-error/10 border border-error/20">
              <AlertCircle className="h-4 w-4 text-error mt-0.5 shrink-0" />
              <p className="text-sm text-error">{analysisError}</p>
            </div>
          )}

          {analysisResult && (
            <div className="p-4 rounded-md bg-bg-elevated border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="success">Analysis Complete</Badge>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {analyzeUrl}
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-text-secondary whitespace-pre-wrap text-sm leading-relaxed">
                {analysisResult}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pages"
          value={optimizationStats.totalPages}
          trendLabel="indexed pages"
          icon={<FileCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Optimized"
          value={optimizationStats.optimized}
          trend={12}
          trendLabel="this month"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Pending"
          value={optimizationStats.pending}
          trendLabel="need optimization"
          icon={<Clock className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Avg Improvement"
          value={`+${optimizationStats.avgScoreImprovement}%`}
          trendLabel="score increase"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Content to Optimize</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {content.map((item) => (
              <div key={item.id}>
                <div className="p-4 hover:bg-bg-elevated transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text-primary">{item.title}</h3>
                        <Badge
                          variant={
                            item.status === "completed"
                              ? "success"
                              : item.status === "optimizing"
                                ? "info"
                                : "neutral"
                          }
                        >
                          {item.status === "optimizing" ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Optimizing
                            </span>
                          ) : (
                            item.status
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-muted mb-2">{item.url}</p>

                      {/* Issues */}
                      {item.status !== "completed" && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.issues.map((issue, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded bg-warning/10 text-warning"
                            >
                              {issue}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {formatNumber(item.traffic)} traffic
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {item.keywords} keywords
                        </span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold",
                            item.currentScore >= 80
                              ? "bg-success/10 text-success"
                              : item.currentScore >= 60
                                ? "bg-warning/10 text-warning"
                                : "bg-error/10 text-error"
                          )}
                        >
                          {item.currentScore}
                        </div>
                        <p className="text-xs text-text-muted mt-1">Current</p>
                      </div>
                      {item.status !== "completed" && (
                        <>
                          <span className="text-text-muted">&rarr;</span>
                          <div className="text-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold bg-success/10 text-success">
                              {item.potentialScore}
                            </div>
                            <p className="text-xs text-text-muted mt-1">Potential</p>
                          </div>
                        </>
                      )}

                      {/* Action */}
                      <div className="ml-4">
                        {item.status === "pending" && (
                          <Button
                            variant="accent"
                            size="sm"
                            onClick={() => startOptimization(item.id)}
                            disabled={optimizingId !== null}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Optimize
                          </Button>
                        )}
                        {item.status === "optimizing" && (
                          <Button variant="secondary" size="sm" disabled>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Working...
                          </Button>
                        )}
                        {item.status === "completed" && optimizationResults[item.id] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleResultExpanded(item.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1 text-success" />
                            {expandedResults[item.id] ? "Hide" : "View"}
                            {expandedResults[item.id] ? (
                              <ChevronUp className="h-3 w-3 ml-1" />
                            ) : (
                              <ChevronDown className="h-3 w-3 ml-1" />
                            )}
                          </Button>
                        )}
                        {item.status === "completed" && !optimizationResults[item.id] && (
                          <Button variant="ghost" size="sm" disabled>
                            <CheckCircle className="h-4 w-4 mr-1 text-success" />
                            Done
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable optimization results */}
                {optimizationResults[item.id] && expandedResults[item.id] && (
                  <div className="px-4 pb-4">
                    <div className="p-4 rounded-md bg-bg-elevated border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          Optimization Suggestions
                        </h4>
                        <Badge variant={optimizationResults[item.id].startsWith("Error:") ? "error" : "success"}>
                          {optimizationResults[item.id].startsWith("Error:") ? "Failed" : "AI Generated"}
                        </Badge>
                      </div>
                      <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {optimizationResults[item.id]}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
