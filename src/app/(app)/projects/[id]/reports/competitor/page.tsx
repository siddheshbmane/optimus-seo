"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  Link2,
  Eye,
  BarChart3,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

const competitors = [
  {
    id: 1,
    name: "Competitor A",
    domain: "competitora.com",
    domainRating: 68,
    traffic: 125000,
    keywords: 2340,
    backlinks: 4560,
    visibility: 45,
    trend: 12,
  },
  {
    id: 2,
    name: "Competitor B",
    domain: "competitorb.io",
    domainRating: 72,
    traffic: 189000,
    keywords: 3120,
    backlinks: 5890,
    visibility: 52,
    trend: 8,
  },
  {
    id: 3,
    name: "Competitor C",
    domain: "competitorc.com",
    domainRating: 58,
    traffic: 67000,
    keywords: 1560,
    backlinks: 2340,
    visibility: 32,
    trend: -5,
  },
  {
    id: 4,
    name: "Competitor D",
    domain: "competitord.net",
    domainRating: 61,
    traffic: 89000,
    keywords: 1890,
    backlinks: 3120,
    visibility: 38,
    trend: 3,
  },
];

const keywordGaps = [
  { keyword: "seo automation tools", volume: 8900, yourRank: null, compRank: 3, difficulty: 52 },
  { keyword: "ai seo software", volume: 12400, yourRank: null, compRank: 5, difficulty: 58 },
  { keyword: "enterprise seo platform", volume: 4500, yourRank: null, compRank: 2, difficulty: 65 },
  { keyword: "seo reporting dashboard", volume: 3200, yourRank: 45, compRank: 8, difficulty: 42 },
  { keyword: "automated link building", volume: 2800, yourRank: null, compRank: 4, difficulty: 48 },
];

const contentGaps = [
  { topic: "AI in SEO: Complete Guide", competitors: 3, avgWords: 4500, opportunity: "high" },
  { topic: "SEO Automation Best Practices", competitors: 2, avgWords: 3200, opportunity: "high" },
  { topic: "Enterprise SEO Strategy", competitors: 4, avgWords: 5800, opportunity: "medium" },
  { topic: "SEO ROI Calculator", competitors: 2, avgWords: 2100, opportunity: "high" },
];

export default function CompetitorReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Competitor Report</h1>
          <p className="text-text-secondary">
            Analyze competitor strategies and find opportunities
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
          label="Competitors Tracked"
          value={competitors.length}
          trendLabel="active competitors"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Keyword Gaps"
          value={keywordGaps.filter(k => !k.yourRank).length}
          trendLabel="opportunities"
          icon={<Target className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Content Gaps"
          value={contentGaps.length}
          trendLabel="topics to cover"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Visibility Gap"
          value="+15%"
          trend={-3}
          trendLabel="vs competitors"
          icon={<Eye className="h-5 w-5" />}
        />
      </div>

      {/* Competitor Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Competitor</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">DR</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Traffic</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Keywords</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Backlinks</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Visibility</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Trend</th>
                </tr>
              </thead>
              <tbody>
                {/* Your Site */}
                <tr className="border-b border-border bg-accent/5">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="accent">You</Badge>
                      <span className="font-medium text-text-primary">{project.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono font-semibold text-accent">52</td>
                  <td className="p-4 text-right font-mono text-text-primary">{formatNumber(project.traffic)}</td>
                  <td className="p-4 text-right font-mono text-text-primary">{formatNumber(project.keywords)}</td>
                  <td className="p-4 text-right font-mono text-text-primary">{formatNumber(project.backlinks)}</td>
                  <td className="p-4 text-center font-mono text-text-primary">38%</td>
                  <td className="p-4 text-center">
                    <span className="flex items-center justify-center text-success">
                      <ArrowUpRight className="h-4 w-4" />
                      12%
                    </span>
                  </td>
                </tr>
                {/* Competitors */}
                {competitors.map((comp) => (
                  <tr key={comp.id} className="border-b border-border hover:bg-bg-elevated">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-text-muted" />
                        <div>
                          <p className="font-medium text-text-primary">{comp.name}</p>
                          <p className="text-xs text-text-muted">{comp.domain}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono font-semibold text-text-primary">{comp.domainRating}</td>
                    <td className="p-4 text-right font-mono text-text-primary">{formatNumber(comp.traffic)}</td>
                    <td className="p-4 text-right font-mono text-text-primary">{formatNumber(comp.keywords)}</td>
                    <td className="p-4 text-right font-mono text-text-primary">{formatNumber(comp.backlinks)}</td>
                    <td className="p-4 text-center font-mono text-text-primary">{comp.visibility}%</td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "flex items-center justify-center",
                        comp.trend > 0 ? "text-success" : "text-error"
                      )}>
                        {comp.trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {Math.abs(comp.trend)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Gaps */}
        <Card>
          <CardHeader>
            <CardTitle>Keyword Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keywordGaps.map((gap, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div>
                    <p className="font-medium text-text-primary">{gap.keyword}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <span>{formatNumber(gap.volume)} vol</span>
                      <span>•</span>
                      <span>KD {gap.difficulty}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-muted">You:</span>
                      <Badge variant={gap.yourRank ? "neutral" : "error"}>
                        {gap.yourRank ? `#${gap.yourRank}` : "Not ranking"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-text-muted">Comp:</span>
                      <Badge variant="success">#{gap.compRank}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Gaps */}
        <Card>
          <CardHeader>
            <CardTitle>Content Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentGaps.map((gap, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div>
                    <p className="font-medium text-text-primary">{gap.topic}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <span>{gap.competitors} competitors</span>
                      <span>•</span>
                      <span>~{formatNumber(gap.avgWords)} words avg</span>
                    </div>
                  </div>
                  <Badge variant={
                    gap.opportunity === "high" ? "success" :
                    gap.opportunity === "medium" ? "warning" : "neutral"
                  }>
                    {gap.opportunity} opportunity
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
