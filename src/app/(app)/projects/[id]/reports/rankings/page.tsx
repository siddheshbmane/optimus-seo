"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Settings,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/contexts/project-context";
import { useProjectConfig } from "@/contexts/project-config-context";
import { useRankingsData } from "@/hooks/use-seo-data";
import { DataSourceIndicator, SetupRequiredBanner } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";

const rankingData = [
  { keyword: "seo services", position: 3, previousPosition: 5, volume: 14800, change: 2 },
  { keyword: "best seo agency", position: 1, previousPosition: 2, volume: 8900, change: 1 },
  { keyword: "technical seo audit", position: 2, previousPosition: 3, volume: 5600, change: 1 },
  { keyword: "local seo optimization", position: 5, previousPosition: 8, volume: 6700, change: 3 },
  { keyword: "seo consultant", position: 6, previousPosition: 9, volume: 9800, change: 3 },
  { keyword: "link building service", position: 4, previousPosition: 6, volume: 4200, change: 2 },
  { keyword: "content marketing strategy", position: 9, previousPosition: 14, volume: 12300, change: 5 },
  { keyword: "keyword research tools", position: 12, previousPosition: 15, volume: 18500, change: 3 },
  { keyword: "on-page seo checklist", position: 7, previousPosition: 12, volume: 8900, change: 5 },
  { keyword: "seo for small business", position: 8, previousPosition: 8, volume: 7200, change: 0 },
  { keyword: "ecommerce seo", position: 15, previousPosition: 12, volume: 4500, change: -3 },
  { keyword: "mobile seo", position: 11, previousPosition: 18, volume: 3800, change: 7 },
];

const positionDistribution = [
  { range: "1-3", count: 3, percentage: 25 },
  { range: "4-10", count: 6, percentage: 50 },
  { range: "11-20", count: 2, percentage: 17 },
  { range: "21-50", count: 1, percentage: 8 },
  { range: "51-100", count: 0, percentage: 0 },
];

export default function RankingsReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const { project } = useProjectContext();
  const { config } = useProjectConfig();

  // Get tracked keywords from project config
  const trackedKeywords = config?.keywords || [];
  const hasTrackedKeywords = trackedKeywords.length > 0;

  // Fetch rankings data from API (with mock fallback)
  const { data: apiRankings, isLoading: rankingsLoading, error: rankingsError, source: rankingsSource, refetch: refetchRankings } = useRankingsData(
    project?.url || ''
  );

  if (!project) return null;

  // Show setup banner if no keywords are tracked
  if (!hasTrackedKeywords && !rankingsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Rankings Report</h1>
          <p className="text-text-secondary">
            Track keyword position changes over time
          </p>
        </div>
        
        <SetupRequiredBanner
          title="No Keywords Tracked"
          description="Add keywords to your project to start tracking their rankings. Go to Settings to add keywords you want to monitor."
          actionLabel="Add Keywords"
          onAction={() => router.push(`/projects/${projectId}/settings`)}
          icon={Target}
        />
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Target className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Start Tracking Rankings</h3>
              <p className="text-text-muted max-w-md mx-auto mb-6">
                Add the keywords you want to track in your project settings. Once added, we'll monitor their positions in search results and show you trends over time.
              </p>
              <Button variant="accent" onClick={() => router.push(`/projects/${projectId}/settings`)}>
                <Settings className="h-4 w-4 mr-2" />
                Go to Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (rankingsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-text-secondary">Loading rankings data...</p>
        </div>
      </div>
    );
  }

  // Use API data if available, otherwise use mock data
  const rankingsDataToUse = React.useMemo(() => {
    if (apiRankings && apiRankings.length > 0) {
      return apiRankings.map(r => ({
        keyword: r.keyword,
        position: r.position,
        previousPosition: r.previousPosition,
        volume: r.searchVolume,
        change: r.change,
      }));
    }
    return rankingData;
  }, [apiRankings]);

  const handleExport = () => {
    const data = rankingsDataToUse.map((kw) => ({
      keyword: kw.keyword,
      position: kw.position,
      previous_position: kw.previousPosition,
      change: kw.change,
      search_volume: kw.volume,
    }));
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const csv = data.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rankings-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const improved = rankingsDataToUse.filter(k => k.change > 0).length;
  const declined = rankingsDataToUse.filter(k => k.change < 0).length;
  const unchanged = rankingsDataToUse.filter(k => k.change === 0).length;
  const avgPosition = Math.round(rankingsDataToUse.reduce((sum, k) => sum + k.position, 0) / rankingsDataToUse.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">Rankings Report</h1>
            <DataSourceIndicator source={rankingsSource} isLoading={rankingsLoading} onRefresh={refetchRankings} compact />
          </div>
          <p className="text-text-secondary">
            Track keyword position changes over time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Keywords Tracked"
          value={rankingsDataToUse.length}
          trendLabel="total keywords"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Position"
          value={avgPosition}
          trend={-2}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Improved"
          value={improved}
          trendLabel="keywords moved up"
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
        <StatCard
          label="Declined"
          value={declined}
          trendLabel="keywords moved down"
          icon={<ArrowDownRight className="h-5 w-5" />}
        />
      </div>

      {/* Position Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Position Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {positionDistribution.map((dist) => (
              <div key={dist.range} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-32">
                  <span className="text-sm font-semibold text-text-primary mb-1">{dist.count}</span>
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      dist.range === "1-3" ? "bg-success" :
                      dist.range === "4-10" ? "bg-info" :
                      dist.range === "11-20" ? "bg-warning" : "bg-error"
                    )}
                    style={{ height: `${Math.max(dist.percentage * 1.2, 8)}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted mt-2">{dist.range}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rankings Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Keyword Rankings</CardTitle>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Change</th>
                  <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Volume</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Trend</th>
                </tr>
              </thead>
              <tbody>
                {rankingsDataToUse.map((keyword, index) => (
                  <tr key={index} className="border-b border-border hover:bg-bg-elevated">
                    <td className="p-4 font-medium text-text-primary">{keyword.keyword}</td>
                    <td className="p-4 text-center">
                      <Badge variant={keyword.position <= 3 ? "success" : keyword.position <= 10 ? "info" : "neutral"}>
                        #{keyword.position}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "flex items-center justify-center gap-1 font-medium",
                        keyword.change > 0 ? "text-success" :
                        keyword.change < 0 ? "text-error" : "text-text-muted"
                      )}>
                        {keyword.change > 0 && <ArrowUpRight className="h-4 w-4" />}
                        {keyword.change < 0 && <ArrowDownRight className="h-4 w-4" />}
                        {keyword.change === 0 && <Minus className="h-4 w-4" />}
                        {Math.abs(keyword.change)}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-text-primary">
                      {formatNumber(keyword.volume)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-0.5">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1 rounded-full",
                              i < 4 ? "bg-success" : i < 6 ? "bg-warning" : "bg-error"
                            )}
                            style={{ height: `${8 + Math.random() * 16}px` }}
                          />
                        ))}
                      </div>
                    </td>
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
