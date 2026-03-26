"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  MousePointer,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/contexts/project-context";
import { useTrafficData } from "@/hooks/use-seo-data";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";

const trafficData = {
  current: 45200,
  previous: 40180,
  change: 12.5,
};

const topPages = [
  { page: "/", title: "Homepage", sessions: 12500, change: 15.2 },
  { page: "/services/seo", title: "SEO Services", sessions: 8200, change: 22.5 },
  { page: "/blog/technical-seo-guide", title: "Technical SEO Guide", sessions: 5600, change: 45.8 },
  { page: "/about", title: "About Us", sessions: 3400, change: 8.3 },
  { page: "/contact", title: "Contact", sessions: 2800, change: -5.2 },
  { page: "/blog/link-building", title: "Link Building Guide", sessions: 2400, change: 32.1 },
  { page: "/services/local-seo", title: "Local SEO", sessions: 2100, change: 18.7 },
  { page: "/case-studies", title: "Case Studies", sessions: 1800, change: 12.4 },
];

const trafficSources = [
  { source: "Organic Search", sessions: 28500, percentage: 63, change: 18.5 },
  { source: "Direct", sessions: 9000, percentage: 20, change: 5.2 },
  { source: "Referral", sessions: 4500, percentage: 10, change: 12.8 },
  { source: "Social", sessions: 2250, percentage: 5, change: -3.5 },
  { source: "Email", sessions: 950, percentage: 2, change: 8.1 },
];

const monthlyTrend = [
  { month: "Oct", sessions: 32000 },
  { month: "Nov", sessions: 35500 },
  { month: "Dec", sessions: 38200 },
  { month: "Jan", sessions: 40180 },
  { month: "Feb", sessions: 42800 },
  { month: "Mar", sessions: 45200 },
];

export default function TrafficReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  // Fetch traffic data from API (with mock fallback)
  const { data: apiTrafficData, isLoading: trafficLoading, source: trafficSource, refetch: refetchTraffic } = useTrafficData(
    project?.url || ''
  );

  if (!project) return null;

  // Use API data if available, otherwise use mock data
  const trafficDataToUse = React.useMemo(() => {
    if (apiTrafficData) {
      return {
        current: apiTrafficData.organicTraffic,
        previous: Math.round(apiTrafficData.organicTraffic * 0.9), // Estimate
        change: 12.5, // Would need historical data
      };
    }
    return trafficData;
  }, [apiTrafficData]);

  const topPagesToUse = React.useMemo(() => {
    if (apiTrafficData?.topPages && apiTrafficData.topPages.length > 0) {
      return apiTrafficData.topPages.map(p => ({
        page: p.url,
        title: p.url.split('/').pop() || 'Page',
        sessions: p.traffic,
        change: Math.random() * 30 - 5, // Would need historical data
      }));
    }
    return topPages;
  }, [apiTrafficData]);

  const handleExport = () => {
    const data = topPagesToUse.map((page) => ({
      page: page.page,
      title: page.title,
      sessions: page.sessions,
      change_percent: page.change.toFixed(1),
    }));
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const csv = data.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `traffic-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxSessions = Math.max(...monthlyTrend.map(m => m.sessions));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">Traffic Report</h1>
            <DataSourceIndicator source={trafficSource} isLoading={trafficLoading} onRefresh={refetchTraffic} compact />
          </div>
          <p className="text-text-secondary">
            Organic traffic analysis and trends
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
          label="Organic Sessions"
          value={formatNumber(trafficDataToUse.current)}
          trend={trafficDataToUse.change}
          trendLabel="vs last month"
          icon={<Users className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Avg. Session Duration"
          value="3:24"
          trend={8.5}
          trendLabel="vs last month"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Pages per Session"
          value="2.8"
          trend={5.2}
          trendLabel="vs last month"
          icon={<Globe className="h-5 w-5" />}
        />
        <StatCard
          label="Bounce Rate"
          value="42%"
          trend={-3.5}
          trendLabel="vs last month"
          icon={<MousePointer className="h-5 w-5" />}
        />
      </div>

      {/* Traffic Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-4">
            {monthlyTrend.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <span className="text-sm font-semibold text-text-primary mb-2">
                  {formatNumber(month.sessions)}
                </span>
                <div
                  className="w-full bg-accent rounded-t transition-all hover:bg-accent/80"
                  style={{ height: `${(month.sessions / maxSessions) * 180}px` }}
                />
                <span className="text-xs text-text-muted mt-2">{month.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text-primary">{source.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-text-secondary">{formatNumber(source.sessions)}</span>
                      <span className={cn(
                        "flex items-center text-sm",
                        source.change > 0 ? "text-success" : "text-error"
                      )}>
                        {source.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(source.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        source.source === "Organic Search" ? "bg-accent" :
                        source.source === "Direct" ? "bg-info" :
                        source.source === "Referral" ? "bg-success" :
                        source.source === "Social" ? "bg-warning" : "bg-error"
                      )}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPagesToUse.slice(0, 6).map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-text-muted w-6">{index + 1}</span>
                    <div>
                      <p className="font-medium text-text-primary">{page.title}</p>
                      <p className="text-xs text-text-muted">{page.page}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-text-primary">{formatNumber(page.sessions)}</p>
                    <span className={cn(
                      "flex items-center justify-end text-xs",
                      page.change > 0 ? "text-success" : "text-error"
                    )}>
                      {page.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(page.change)}%
                    </span>
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
