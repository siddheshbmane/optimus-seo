"use client";

import * as React from "react";
import {
  Activity,
  Globe,
  FolderKanban,
  FileText,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UsageData {
  totalApiCalls: number;
  topEndpoints: { endpoint: string; method: string; count: number }[];
  projectsByStatus: { status: string; count: number }[];
  contentCount: number;
  keywordCount: number;
}

const periodOptions = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

export default function UsagePage() {
  const [data, setData] = React.useState<UsageData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState("30d");

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/super-admin/usage?period=${period}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
      })
      .catch((err) => console.error("Failed to fetch usage:", err))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Usage</h1>
          <p className="text-slate-400 text-sm mt-1">
            API usage, project stats, and content metrics
          </p>
        </div>
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {periodOptions.map((p) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-900 border border-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : !data ? (
        <div className="text-center text-slate-500 py-12">
          Failed to load usage data
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              label="Total API Calls"
              value={data.totalApiCalls.toLocaleString()}
              icon={<Globe className="h-5 w-5" />}
              highlight
            />
            <KpiCard
              label="Content Items"
              value={data.contentCount.toLocaleString()}
              icon={<FileText className="h-5 w-5" />}
            />
            <KpiCard
              label="Keywords Tracked"
              value={data.keywordCount.toLocaleString()}
              icon={<Tag className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Endpoints */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-400" />
                  Top Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {data.topEndpoints.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No endpoint data
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left p-3 text-slate-400 font-medium">
                            Endpoint
                          </th>
                          <th className="text-left p-3 text-slate-400 font-medium">
                            Method
                          </th>
                          <th className="text-right p-3 text-slate-400 font-medium">
                            Calls
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topEndpoints.map((ep, i) => (
                          <tr
                            key={i}
                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="p-3 text-slate-300 font-mono text-xs">
                              {ep.endpoint}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  ep.method === "GET"
                                    ? "info"
                                    : ep.method === "POST"
                                      ? "success"
                                      : ep.method === "DELETE"
                                        ? "error"
                                        : "warning"
                                }
                              >
                                {ep.method}
                              </Badge>
                            </td>
                            <td className="p-3 text-right text-white font-mono">
                              {ep.count.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects by Status */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-slate-400" />
                  Projects by Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {data.projectsByStatus.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm py-4">
                    No project data
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.projectsByStatus.map((s) => {
                      const total = data.projectsByStatus.reduce(
                        (a, b) => a + b.count,
                        0
                      );
                      const pct = total > 0 ? (s.count / total) * 100 : 0;
                      return (
                        <div key={s.status}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-300 capitalize">
                              {s.status}
                            </span>
                            <span className="text-slate-500 font-mono">
                              {s.count}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500/50 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
  value: string;
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
        {value}
      </p>
    </div>
  );
}
