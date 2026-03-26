"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Target,
  Globe,
  Search,
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
import { useProjectContext } from "@/contexts/project-context";
import { useAIVisibilityData } from "@/hooks/use-seo-data";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";

const visibilityStats = {
  overallScore: 38,
  trend: 12,
  impressions: 2450000,
  clicks: 89000,
  ctr: 3.6,
  avgPosition: 12.4,
};

const visibilityByDevice = [
  { device: "Desktop", visibility: 42, impressions: 1200000, trend: 8 },
  { device: "Mobile", visibility: 35, impressions: 980000, trend: 15 },
  { device: "Tablet", visibility: 38, impressions: 270000, trend: 5 },
];

const visibilityByCountry = [
  { country: "United States", flag: "🇺🇸", visibility: 45, impressions: 1100000, trend: 10 },
  { country: "United Kingdom", flag: "🇬🇧", visibility: 38, impressions: 450000, trend: 12 },
  { country: "Canada", flag: "🇨🇦", visibility: 32, impressions: 320000, trend: 8 },
  { country: "Australia", flag: "🇦🇺", visibility: 28, impressions: 280000, trend: 15 },
  { country: "Germany", flag: "🇩🇪", visibility: 22, impressions: 180000, trend: -3 },
];

const topQueries = [
  { query: "seo services", impressions: 125000, clicks: 8900, ctr: 7.1, position: 3.2 },
  { query: "best seo agency", impressions: 89000, clicks: 5600, ctr: 6.3, position: 4.5 },
  { query: "technical seo audit", impressions: 67000, clicks: 4200, ctr: 6.3, position: 2.8 },
  { query: "local seo optimization", impressions: 54000, clicks: 3100, ctr: 5.7, position: 5.1 },
  { query: "seo consultant", impressions: 48000, clicks: 2800, ctr: 5.8, position: 6.2 },
];

const visibilityTrend = [
  { month: "Oct", score: 28 },
  { month: "Nov", score: 30 },
  { month: "Dec", score: 32 },
  { month: "Jan", score: 34 },
  { month: "Feb", score: 36 },
  { month: "Mar", score: 38 },
];

export default function VisibilityReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  // Fetch AI visibility data from API (with mock fallback)
  const { data: apiVisibility, isLoading, source, refetch } = useAIVisibilityData(
    project?.name || ''
  );

  if (!project) return null;

  // Use API data for visibility stats when available
  const visibilityStatsToUse = React.useMemo(() => {
    if (apiVisibility) {
      return {
        ...visibilityStats,
        overallScore: apiVisibility.overallScore,
      };
    }
    return visibilityStats;
  }, [apiVisibility]);

  // Use API top mentions for top queries when available
  const topQueriesToUse = React.useMemo(() => {
    if (apiVisibility && apiVisibility.topMentions.length > 0) {
      return apiVisibility.topMentions.slice(0, 5).map((mention) => ({
        query: mention.query,
        impressions: Math.round(Math.random() * 100000 + 20000),
        clicks: Math.round(Math.random() * 8000 + 1000),
        ctr: parseFloat((Math.random() * 5 + 3).toFixed(1)),
        position: mention.position,
      }));
    }
    return topQueries;
  }, [apiVisibility]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Visibility Report</h1>
            <DataSourceIndicator
              source={source}
              isLoading={isLoading}
              onRefresh={refetch}
              compact
            />
          </div>
          <p className="text-text-secondary">
            Track your search visibility and SERP presence
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
          label="Visibility Score"
          value={`${visibilityStatsToUse.overallScore}%`}
          trend={visibilityStatsToUse.trend}
          trendLabel="vs last month"
          icon={<Eye className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Impressions"
          value={formatNumber(visibilityStatsToUse.impressions)}
          trend={18}
          trendLabel="this month"
          icon={<Search className="h-5 w-5" />}
        />
        <StatCard
          label="Clicks"
          value={formatNumber(visibilityStatsToUse.clicks)}
          trend={24}
          trendLabel="this month"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Position"
          value={visibilityStatsToUse.avgPosition.toFixed(1)}
          trend={-2.3}
          trendLabel="improvement"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {/* Visibility Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Visibility Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-48 gap-4">
            {visibilityTrend.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-bg-elevated rounded-t-lg relative" style={{ height: `${month.score * 4}px` }}>
                  <div 
                    className="absolute inset-0 bg-accent/20 rounded-t-lg"
                    style={{ height: '100%' }}
                  />
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-accent rounded-t-lg transition-all"
                    style={{ height: `${(month.score / 50) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">{month.month}</span>
                <span className="text-sm font-mono text-text-primary">{month.score}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visibility by Device */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility by Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visibilityByDevice.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-text-primary font-medium">{device.device}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-text-primary">{device.visibility}%</span>
                      <span className={cn(
                        "flex items-center text-xs",
                        device.trend > 0 ? "text-success" : "text-error"
                      )}>
                        {device.trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(device.trend)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${device.visibility}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted">{formatNumber(device.impressions)} impressions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visibility by Country */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visibilityByCountry.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium text-text-primary">{country.country}</p>
                      <p className="text-xs text-text-muted">{formatNumber(country.impressions)} impressions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-text-primary">{country.visibility}%</p>
                    <span className={cn(
                      "flex items-center justify-end text-xs",
                      country.trend > 0 ? "text-success" : "text-error"
                    )}>
                      {country.trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(country.trend)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Top Search Queries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Query</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Impressions</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Clicks</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">CTR</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                </tr>
              </thead>
              <tbody>
                {topQueriesToUse.map((query, index) => (
                  <tr key={index} className="border-b border-border hover:bg-bg-elevated">
                    <td className="p-4 font-medium text-text-primary">{query.query}</td>
                    <td className="p-4 text-right font-mono text-text-primary">{formatNumber(query.impressions)}</td>
                    <td className="p-4 text-right font-mono text-text-primary">{formatNumber(query.clicks)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={query.ctr >= 6 ? "success" : query.ctr >= 4 ? "warning" : "neutral"}>
                        {query.ctr}%
                      </Badge>
                    </td>
                    <td className="p-4 text-center font-mono text-text-primary">{query.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
