"use client";

import * as React from "react";
import {
  Building2,
  Users,
  FolderKanban,
  Activity,
  TrendingUp,
  Zap,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  overview: {
    totalOrganizations: number;
    totalUsers: number;
    activeUsersLast7Days: number;
    totalProjects: number;
    sessionsToday: number;
  };
  growth: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  };
  planDistribution: Array<{ status: string; count: number }>;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchStats = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const kpiCards = stats
    ? [
        {
          label: "Total Tenants",
          value: stats.overview.totalOrganizations,
          icon: Building2,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        },
        {
          label: "Total Users",
          value: stats.overview.totalUsers,
          icon: Users,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
        },
        {
          label: "Active Users (7d)",
          value: stats.overview.activeUsersLast7Days,
          icon: Activity,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
        },
        {
          label: "Total Projects",
          value: stats.overview.totalProjects,
          icon: FolderKanban,
          color: "text-purple-400",
          bg: "bg-purple-500/10",
        },
        {
          label: "Sessions Today",
          value: stats.overview.sessionsToday,
          icon: Zap,
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
        },
        {
          label: "New Users (30d)",
          value: stats.growth.newUsersThisMonth,
          icon: TrendingUp,
          color: "text-pink-400",
          bg: "bg-pink-500/10",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Global KPIs and system health
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchStats}
          disabled={loading}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                  <div className="h-8 bg-slate-800 rounded w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={kpi.label}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{kpi.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {kpi.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Growth + Plan Distribution */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Card */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">User Growth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300">Today</span>
                </div>
                <span className="text-lg font-semibold text-white">
                  +{stats.growth.newUsersToday}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-300">This Week</span>
                </div>
                <span className="text-lg font-semibold text-white">
                  +{stats.growth.newUsersThisWeek}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm text-slate-300">This Month</span>
                </div>
                <span className="text-lg font-semibold text-white">
                  +{stats.growth.newUsersThisMonth}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Plan Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.planDistribution.map((plan) => {
                  const total = stats.overview.totalOrganizations || 1;
                  const pct = Math.round((plan.count / total) * 100);
                  return (
                    <div key={plan.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="neutral"
                            className="border-slate-600 text-slate-300 capitalize"
                          >
                            {plan.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-slate-400">
                          {plan.count} orgs ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {stats.planDistribution.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No data yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
