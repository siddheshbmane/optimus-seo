"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  BarChart3,
  Sparkles,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/contexts/project-context";
import { useContentIdeas } from "@/hooks/use-seo-data";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";

const contentPages = [
  {
    id: 1,
    title: "Complete Guide to Technical SEO",
    url: "/blog/technical-seo-guide",
    score: 92,
    wordCount: 5200,
    keywords: 45,
    readability: "Good",
    issues: [],
    status: "optimized",
  },
  {
    id: 2,
    title: "Local SEO Strategies",
    url: "/blog/local-seo",
    score: 78,
    wordCount: 2800,
    keywords: 28,
    readability: "Good",
    issues: ["Missing H2 tags", "Low keyword density"],
    status: "needs_work",
  },
  {
    id: 3,
    title: "Link Building Best Practices",
    url: "/blog/link-building",
    score: 65,
    wordCount: 1800,
    keywords: 15,
    readability: "Fair",
    issues: ["Thin content", "Missing internal links", "No FAQ section"],
    status: "needs_work",
  },
  {
    id: 4,
    title: "SEO for E-commerce",
    url: "/blog/ecommerce-seo",
    score: 85,
    wordCount: 4200,
    keywords: 38,
    readability: "Good",
    issues: ["Missing schema markup"],
    status: "needs_work",
  },
  {
    id: 5,
    title: "Core Web Vitals Guide",
    url: "/blog/core-web-vitals",
    score: 88,
    wordCount: 3500,
    keywords: 32,
    readability: "Excellent",
    issues: [],
    status: "optimized",
  },
];

const optimizationSuggestions = [
  { type: "Add FAQ Section", pages: 8, impact: "high" },
  { type: "Improve Readability", pages: 12, impact: "medium" },
  { type: "Add Internal Links", pages: 15, impact: "high" },
  { type: "Increase Word Count", pages: 6, impact: "high" },
  { type: "Add Schema Markup", pages: 23, impact: "medium" },
  { type: "Optimize Images", pages: 34, impact: "low" },
];

export default function ContentOptimizationPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  // Fetch content ideas from API (with mock fallback)
  const { isLoading: contentLoading, source: contentSource, refetch: refetchContent } = useContentIdeas(
    project?.url || ''
  );

  if (!project) return null;

  const optimizedCount = contentPages.filter(p => p.status === "optimized").length;
  const needsWorkCount = contentPages.filter(p => p.status === "needs_work").length;
  const avgScore = Math.round(contentPages.reduce((sum, p) => sum + p.score, 0) / contentPages.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Content Optimization</h1>
            <DataSourceIndicator source={contentSource} isLoading={contentLoading} onRefresh={refetchContent} compact />
          </div>
          <p className="text-text-secondary">
            Analyze and optimize your content for better rankings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="accent">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Optimize All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pages"
          value={contentPages.length}
          trendLabel="analyzed"
          icon={<FileCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Score"
          value={avgScore}
          trendLabel="out of 100"
          icon={<BarChart3 className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Optimized"
          value={optimizedCount}
          trendLabel="pages"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Needs Work"
          value={needsWorkCount}
          trendLabel="pages"
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Pages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content Pages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {contentPages.map((page) => (
                <div key={page.id} className="p-4 hover:bg-bg-elevated transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text-primary">{page.title}</h3>
                        <Badge variant={page.status === "optimized" ? "success" : "warning"}>
                          {page.status === "optimized" ? "Optimized" : "Needs Work"}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-muted mb-2">{page.url}</p>
                      
                      {page.issues.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {page.issues.map((issue, index) => (
                            <span key={index} className="text-xs px-2 py-0.5 rounded bg-warning/10 text-warning">
                              {issue}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span>{formatNumber(page.wordCount)} words</span>
                        <span>{page.keywords} keywords</span>
                        <span>Readability: {page.readability}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold",
                        page.score >= 85 ? "bg-success/10 text-success" :
                        page.score >= 70 ? "bg-warning/10 text-warning" : "bg-error/10 text-error"
                      )}>
                        {page.score}
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div>
                    <p className="font-medium text-text-primary">{suggestion.type}</p>
                    <p className="text-xs text-text-muted">{suggestion.pages} pages affected</p>
                  </div>
                  <Badge variant={
                    suggestion.impact === "high" ? "success" :
                    suggestion.impact === "medium" ? "warning" : "neutral"
                  }>
                    {suggestion.impact}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button variant="accent" className="w-full mt-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Apply All Suggestions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
