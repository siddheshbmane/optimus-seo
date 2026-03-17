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
  Plus,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
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
    name: "SEO Agency Pro",
    url: "seoagencypro.com",
    domainRating: 72,
    drChange: 2,
    organicTraffic: 125000,
    trafficChange: 15.2,
    keywords: 4500,
    keywordsChange: 8.5,
    backlinks: 12500,
    backlinksChange: 12.3,
    topKeywords: ["seo services", "seo agency", "digital marketing"],
  },
  {
    id: 2,
    name: "Digital Growth Co",
    url: "digitalgrowth.co",
    domainRating: 68,
    drChange: 1,
    organicTraffic: 98000,
    trafficChange: 22.1,
    keywords: 3200,
    keywordsChange: 15.2,
    backlinks: 8900,
    backlinksChange: 8.7,
    topKeywords: ["growth marketing", "seo consultant", "content marketing"],
  },
  {
    id: 3,
    name: "RankBoost",
    url: "rankboost.io",
    domainRating: 65,
    drChange: -1,
    organicTraffic: 76000,
    trafficChange: -5.3,
    keywords: 2800,
    keywordsChange: -2.1,
    backlinks: 6700,
    backlinksChange: 3.2,
    topKeywords: ["rank tracking", "keyword research", "backlink analysis"],
  },
  {
    id: 4,
    name: "SearchMaster",
    url: "searchmaster.com",
    domainRating: 78,
    drChange: 3,
    organicTraffic: 156000,
    trafficChange: 18.9,
    keywords: 5200,
    keywordsChange: 12.4,
    backlinks: 15600,
    backlinksChange: 15.8,
    topKeywords: ["seo tools", "search optimization", "website audit"],
  },
  {
    id: 5,
    name: "OptimizeNow",
    url: "optimizenow.net",
    domainRating: 58,
    drChange: 0,
    organicTraffic: 45000,
    trafficChange: 8.2,
    keywords: 1800,
    keywordsChange: 5.6,
    backlinks: 4200,
    backlinksChange: 6.1,
    topKeywords: ["website optimization", "page speed", "technical seo"],
  },
];

const keywordGaps = [
  { keyword: "enterprise seo services", volume: 2400, difficulty: 65, competitors: 4 },
  { keyword: "seo audit tool", volume: 8100, difficulty: 58, competitors: 3 },
  { keyword: "local seo software", volume: 3600, difficulty: 52, competitors: 5 },
  { keyword: "seo reporting dashboard", volume: 1900, difficulty: 48, competitors: 4 },
  { keyword: "ai seo tools", volume: 5400, difficulty: 62, competitors: 3 },
  { keyword: "white label seo", volume: 4200, difficulty: 55, competitors: 4 },
];

export default function CompetitorAnalysisPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  const avgCompetitorDR = Math.round(
    competitors.reduce((sum, c) => sum + c.domainRating, 0) / competitors.length
  );
  const totalKeywordGaps = keywordGaps.length;
  const avgGapVolume = Math.round(
    keywordGaps.reduce((sum, k) => sum + k.volume, 0) / keywordGaps.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Competitor Analysis
          </h1>
          <p className="text-text-secondary">
            Analyze and track your competitors&apos; SEO performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
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
          label="Avg. Domain Rating"
          value={avgCompetitorDR}
          trend={2}
          trendLabel="vs last month"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Keyword Gaps"
          value={totalKeywordGaps}
          trendLabel="opportunities found"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Gap Volume"
          value={formatNumber(avgGapVolume)}
          trendLabel="monthly searches"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      {/* Competitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Competitor
                  </th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                    Domain Rating
                  </th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                    Organic Traffic
                  </th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                    Keywords
                  </th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase tracking-wider">
                    Backlinks
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Top Keywords
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor) => (
                  <tr
                    key={competitor.id}
                    className="border-b border-border hover:bg-bg-elevated transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                          <span className="text-text-primary font-semibold text-sm">
                            {competitor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {competitor.name}
                          </p>
                          <a
                            href={`https://${competitor.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-text-muted hover:text-accent flex items-center gap-1"
                          >
                            {competitor.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono font-semibold text-text-primary">
                          {competitor.domainRating}
                        </span>
                        <span
                          className={cn(
                            "flex items-center text-xs",
                            competitor.drChange > 0
                              ? "text-success"
                              : competitor.drChange < 0
                              ? "text-error"
                              : "text-text-muted"
                          )}
                        >
                          {competitor.drChange > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : competitor.drChange < 0 ? (
                            <ArrowDownRight className="h-3 w-3" />
                          ) : null}
                          {competitor.drChange !== 0 && Math.abs(competitor.drChange)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-text-primary">
                          {formatNumber(competitor.organicTraffic)}
                        </span>
                        <span
                          className={cn(
                            "flex items-center text-xs",
                            competitor.trafficChange > 0
                              ? "text-success"
                              : "text-error"
                          )}
                        >
                          {competitor.trafficChange > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(competitor.trafficChange)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-text-primary">
                          {formatNumber(competitor.keywords)}
                        </span>
                        <span
                          className={cn(
                            "flex items-center text-xs",
                            competitor.keywordsChange > 0
                              ? "text-success"
                              : "text-error"
                          )}
                        >
                          {competitor.keywordsChange > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(competitor.keywordsChange)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-text-primary">
                          {formatNumber(competitor.backlinks)}
                        </span>
                        <span
                          className={cn(
                            "flex items-center text-xs",
                            competitor.backlinksChange > 0
                              ? "text-success"
                              : "text-error"
                          )}
                        >
                          {competitor.backlinksChange > 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(competitor.backlinksChange)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {competitor.topKeywords.slice(0, 2).map((kw) => (
                          <Badge key={kw} variant="neutral" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                        {competitor.topKeywords.length > 2 && (
                          <Badge variant="neutral" className="text-xs">
                            +{competitor.topKeywords.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Keyword Gap Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted mb-4">
            Keywords your competitors rank for that you don&apos;t
          </p>
          <div className="space-y-3">
            {keywordGaps.map((gap) => (
              <div
                key={gap.keyword}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-text-primary">{gap.keyword}</p>
                    <p className="text-xs text-text-muted">
                      {gap.competitors} competitors ranking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-mono text-text-primary">
                      {formatNumber(gap.volume)}
                    </p>
                    <p className="text-xs text-text-muted">Volume</p>
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "font-mono font-semibold",
                        gap.difficulty <= 40
                          ? "text-success"
                          : gap.difficulty <= 60
                          ? "text-warning"
                          : "text-error"
                      )}
                    >
                      {gap.difficulty}
                    </p>
                    <p className="text-xs text-text-muted">Difficulty</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Add to Strategy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
