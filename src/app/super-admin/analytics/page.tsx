"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  UserPlus,
  Activity,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  growth: {
    signupTrend: { date: string; count: number }[];
    newUsers: number;
    newOrgs: number;
    totalUsers: number;
    totalOrgs: number;
  };
  engagement: {
    dau: number;
    usersByRole: { role: string; count: number }[];
  };
  retention: {
    orgStatusDistribution: { status: string; count: number }[];
  };
}

const periods = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState("30d");

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/super-admin/analytics?period=${period}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
      })
      .catch((err) => console.error("Failed to fetch analytics:", err))
      .finally(() => setLoading(false));
  }, [period]);

  const maxSignups = data
    ? Math.max(...data.growth.signupTrend.map((d) => d.count), 1)
    : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">
            Platform growth, engagement, and retention metrics
          </p>
        </div>
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === p.value
                  ? "bg-red-500/10 text-red-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-900 border border-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : !data ? (
        <div className="text-center text-slate-500 py-12">
          Failed to load analytics data
        </div>
      ) : (
        <>
          {/* Growth KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Users"
              value={data.growth.totalUsers}
              icon={<Users className="h-5 w-5" />}
            />
            <KpiCard
              label="New Users"
              value={data.growth.newUsers}
              icon={<UserPlus className="h-5 w-5" />}
              highlight
            />
            <KpiCard
              label="Total Orgs"
              value={data.growth.totalOrgs}
              icon={<Building2 className="h-5 w-5" />}
            />
            <KpiCard
              label="DAU"
              value={data.engagement.dau}
              icon={<Activity className="h-5 w-5" />}
            />
          </div>

          {/* Signup Trend */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-400" />
                Signup Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.growth.signupTrend.length === 0 ? (
                <div className="text-slate-500 text-sm text-center py-8">
                  No signup data for this period
                </div>
              ) : (
                <div className="flex items-end gap-1 h-40">
                  {data.growth.signupTrend.map((d, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] text-slate-500">
                        {d.count}
                      </span>
                      <div
                        className="w-full bg-red-500/20 rounded-t hover:bg-red-500/40 transition-colors"
                        style={{
                          height: `${Math.max((d.count / maxSignups) * 100, 4)}%`,
                          minHeight: "4px",
                        }}
                      />
                      <span className="text-[9px] text-slate-600 truncate w-full text-center">
                        {new Date(d.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Engagement & Retention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Users by Role */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  Users by Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.engagement.usersByRole.map((r) => {
                    const total = data.engagement.usersByRole.reduce(
                      (a, b) => a + b.count,
                      0
                    );
                    const pct = total > 0 ? (r.count / total) * 100 : 0;
                    return (
                      <div key={r.role}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300 capitalize">
                            {r.role}
                          </span>
                          <span className="text-slate-500">
                            {r.count} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500/50 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {data.engagement.usersByRole.length === 0 && (
                    <p className="text-slate-500 text-sm">No role data</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Org Status Distribution */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  Organization Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.retention.orgStatusDistribution.map((s) => {
                    const total = data.retention.orgStatusDistribution.reduce(
                      (a, b) => a + b.count,
                      0
                    );
                    const pct = total > 0 ? (s.count / total) * 100 : 0;
                    return (
                      <div key={s.status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300 capitalize">
                            {s.status}
                          </span>
                          <span className="text-slate-500">
                            {s.count} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500/50 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {data.retention.orgStatusDistribution.length === 0 && (
                    <p className="text-slate-500 text-sm">No status data</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "bg-red-500/5 border-red-500/20"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        <div className="text-slate-500">{icon}</div>
      </div>
      <p
        className={`text-2xl font-bold mt-2 font-mono ${
          highlight ? "text-red-400" : "text-white"
        }`}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}
