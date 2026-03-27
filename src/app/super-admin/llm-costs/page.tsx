"use client";

import * as React from "react";
import {
  BrainCircuit,
  Zap,
  DollarSign,
  Clock,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LlmCostsData {
  summary: {
    totalRequests: number;
    totalTokens: number;
    totalCostCents: number;
    avgLatencyMs: number;
  };
  breakdown: {
    group: string;
    requests: number;
    tokens: number;
    costCents: number;
    avgLatencyMs: number;
  }[];
}

const periodOptions = [
  { label: "Today", value: "today" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

const groupByOptions = [
  { label: "Provider", value: "provider" },
  { label: "Model", value: "model" },
  { label: "Feature", value: "feature" },
];

export default function LlmCostsPage() {
  const [data, setData] = React.useState<LlmCostsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState("30d");
  const [groupBy, setGroupBy] = React.useState("provider");

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/super-admin/llm-costs?period=${period}&groupBy=${groupBy}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
      })
      .catch((err) => console.error("Failed to fetch LLM costs:", err))
      .finally(() => setLoading(false));
  }, [period, groupBy]);

  const formatCost = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatLatency = (ms: number) =>
    ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
  const formatTokens = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
        ? `${(n / 1_000).toFixed(1)}K`
        : n.toString();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">LLM Costs</h1>
          <p className="text-slate-400 text-sm mt-1">
            AI model usage and cost breakdown
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

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-900 border border-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : !data ? (
        <div className="text-center text-slate-500 py-12">
          Failed to load LLM cost data
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Requests"
              value={data.summary.totalRequests.toLocaleString()}
              icon={<Hash className="h-5 w-5" />}
            />
            <KpiCard
              label="Total Tokens"
              value={formatTokens(data.summary.totalTokens)}
              icon={<Zap className="h-5 w-5" />}
            />
            <KpiCard
              label="Total Cost"
              value={formatCost(data.summary.totalCostCents)}
              icon={<DollarSign className="h-5 w-5" />}
              highlight
            />
            <KpiCard
              label="Avg Latency"
              value={formatLatency(data.summary.avgLatencyMs)}
              icon={<Clock className="h-5 w-5" />}
            />
          </div>

          {/* Group-by selector + Breakdown table */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-slate-400" />
                  Cost Breakdown
                </CardTitle>
                <div className="flex gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
                  {groupByOptions.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGroupBy(g.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        groupBy === g.value
                          ? "bg-slate-800 text-white"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {data.breakdown.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No cost data for this period
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left p-4 text-slate-400 font-medium capitalize">
                          {groupBy}
                        </th>
                        <th className="text-right p-4 text-slate-400 font-medium">
                          Requests
                        </th>
                        <th className="text-right p-4 text-slate-400 font-medium">
                          Tokens
                        </th>
                        <th className="text-right p-4 text-slate-400 font-medium">
                          Cost
                        </th>
                        <th className="text-right p-4 text-slate-400 font-medium">
                          Avg Latency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.breakdown.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="p-4 text-white font-medium font-mono text-xs">
                            {row.group}
                          </td>
                          <td className="p-4 text-right text-slate-300">
                            {row.requests.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-slate-300 font-mono text-xs">
                            {formatTokens(row.tokens)}
                          </td>
                          <td className="p-4 text-right text-emerald-400 font-mono">
                            {formatCost(row.costCents)}
                          </td>
                          <td className="p-4 text-right text-slate-400">
                            {formatLatency(row.avgLatencyMs)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
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
