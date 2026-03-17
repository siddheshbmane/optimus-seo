"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

const contentStats = {
  totalPages: 156,
  publishedThisMonth: 12,
  avgWordCount: 2450,
  avgTimeOnPage: "4:32",
  topPerforming: 23,
  needsOptimization: 34,
};

const topContent = [
  {
    id: 1,
    title: "Complete Guide to Technical SEO",
    url: "/blog/technical-seo-guide",
    traffic: 12500,
    keywords: 45,
    position: 2,
    trend: 15,
    score: 92,
  },
  {
    id: 2,
    title: "Local SEO Strategies for 2026",
    url: "/blog/local-seo-strategies",
    traffic: 8900,
    keywords: 32,
    position: 3,
    trend: 8,
    score: 88,
  },
  {
    id: 3,
    title: "Link Building Best Practices",
    url: "/blog/link-building",
    traffic: 7200,
    keywords: 28,
    position: 5,
    trend: -3,
    score: 85,
  },
  {
    id: 4,
    title: "Core Web Vitals Optimization",
    url: "/blog/core-web-vitals",
    traffic: 6800,
    keywords: 24,
    position: 4,
    trend: 12,
    score: 90,
  },
  {
    id: 5,
    title: "SEO for E-commerce Sites",
    url: "/blog/ecommerce-seo",
    traffic: 5400,
    keywords: 19,
    position: 6,
    trend: 5,
    score: 82,
  },
];

const contentNeedsWork = [
  {
    id: 1,
    title: "Old SEO Tips Article",
    url: "/blog/seo-tips-2024",
    issue: "Outdated content",
    traffic: 450,
    decline: -45,
    priority: "high",
  },
  {
    id: 2,
    title: "Keyword Research Basics",
    url: "/blog/keyword-research",
    issue: "Thin content (800 words)",
    traffic: 890,
    decline: -22,
    priority: "medium",
  },
  {
    id: 3,
    title: "Mobile SEO Guide",
    url: "/blog/mobile-seo",
    issue: "Missing images",
    traffic: 1200,
    decline: -15,
    priority: "low",
  },
  {
    id: 4,
    title: "SEO Tools Comparison",
    url: "/blog/seo-tools",
    issue: "Broken links",
    traffic: 2100,
    decline: -8,
    priority: "high",
  },
];

const contentByType = [
  { type: "Blog Posts", count: 89, traffic: 45000 },
  { type: "Guides", count: 24, traffic: 32000 },
  { type: "Landing Pages", count: 18, traffic: 28000 },
  { type: "Case Studies", count: 12, traffic: 8500 },
  { type: "Tools", count: 8, traffic: 15000 },
  { type: "Other", count: 5, traffic: 2500 },
];

export default function ContentReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Content Report</h1>
          <p className="text-text-secondary">
            Analyze content performance and identify optimization opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="accent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pages"
          value={contentStats.totalPages}
          trend={contentStats.publishedThisMonth}
          trendLabel="this month"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Word Count"
          value={formatNumber(contentStats.avgWordCount)}
          trendLabel="per page"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Top Performing"
          value={contentStats.topPerforming}
          trendLabel="pages"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Needs Optimization"
          value={contentStats.needsOptimization}
          trendLabel="pages"
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Content</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Traffic</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Keywords</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Trend</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Score</th>
                </tr>
              </thead>
              <tbody>
                {topContent.map((content) => (
                  <tr key={content.id} className="border-b border-border hover:bg-bg-elevated">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-text-primary">{content.title}</p>
                        <p className="text-xs text-text-muted">{content.url}</p>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-text-primary">
                      {formatNumber(content.traffic)}
                    </td>
                    <td className="p-4 text-center text-text-primary">{content.keywords}</td>
                    <td className="p-4 text-center">
                      <Badge variant="success">#{content.position}</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "flex items-center justify-center text-sm",
                        content.trend > 0 ? "text-success" : "text-error"
                      )}>
                        {content.trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {Math.abs(content.trend)}%
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className={cn(
                        "inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold",
                        content.score >= 90 ? "bg-success/10 text-success" :
                        content.score >= 80 ? "bg-warning/10 text-warning" : "bg-error/10 text-error"
                      )}>
                        {content.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Needs Work */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Content Needs Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentNeedsWork.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{content.title}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <Badge variant={
                        content.priority === "high" ? "error" :
                        content.priority === "medium" ? "warning" : "neutral"
                      }>
                        {content.priority}
                      </Badge>
                      <span>{content.issue}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-primary">{formatNumber(content.traffic)}</p>
                    <span className="text-xs text-error flex items-center justify-end">
                      <ArrowDownRight className="h-3 w-3" />
                      {Math.abs(content.decline)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Content by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentByType.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{type.type}</p>
                      <p className="text-xs text-text-muted">{type.count} pages</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-text-primary">{formatNumber(type.traffic)}</p>
                    <p className="text-xs text-text-muted">monthly traffic</p>
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
