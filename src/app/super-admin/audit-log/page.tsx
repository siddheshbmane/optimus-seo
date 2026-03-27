"use client";

import * as React from "react";
import {
  ScrollText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuditEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  resource: string;
  source: string;
  ipAddress: string;
}

interface AuditLogData {
  entries: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AuditLogPage() {
  const [data, setData] = React.useState<AuditLogData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [actionFilter, setActionFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const pageSize = 50;

  React.useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (actionFilter !== "all") params.set("action", actionFilter);
    if (sourceFilter !== "all") params.set("source", sourceFilter);

    fetch(`/api/super-admin/audit-log?${params}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
      })
      .catch((err) => console.error("Failed to fetch audit log:", err))
      .finally(() => setLoading(false));
  }, [page, actionFilter, sourceFilter]);

  const actionBadgeVariant = (action: string) => {
    if (action.startsWith("create") || action.startsWith("add"))
      return "success";
    if (action.startsWith("delete") || action.startsWith("remove"))
      return "error";
    if (action.startsWith("update") || action.startsWith("edit"))
      return "warning";
    if (action.startsWith("login") || action.startsWith("auth")) return "info";
    return "neutral";
  };

  const actionOptions = [
    "all",
    "login",
    "create",
    "update",
    "delete",
    "export",
    "import",
  ];

  const sourceOptions = ["all", "web", "api", "cli", "webhook", "system"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track all platform actions and changes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {actionOptions.map((a) => (
              <option key={a} value={a}>
                {a === "all"
                  ? "All Actions"
                  : a.charAt(0).toUpperCase() + a.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {sourceOptions.map((s) => (
              <option key={s} value={s}>
                {s === "all"
                  ? "All Sources"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-slate-400" />
            Activity Log
            {data && (
              <span className="text-slate-500 text-sm font-normal ml-2">
                ({data.total} total entries)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-4 w-36 bg-slate-800 rounded" />
                  <div className="h-4 w-40 bg-slate-800 rounded" />
                  <div className="h-4 w-20 bg-slate-800 rounded" />
                  <div className="h-4 w-24 bg-slate-800 rounded" />
                  <div className="h-4 w-16 bg-slate-800 rounded" />
                  <div className="h-4 w-28 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : !data || data.entries.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No audit log entries found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left p-4 text-slate-400 font-medium">
                        Timestamp
                      </th>
                      <th className="text-left p-4 text-slate-400 font-medium">
                        User
                      </th>
                      <th className="text-left p-4 text-slate-400 font-medium">
                        Action
                      </th>
                      <th className="text-left p-4 text-slate-400 font-medium">
                        Resource
                      </th>
                      <th className="text-left p-4 text-slate-400 font-medium">
                        Source
                      </th>
                      <th className="text-left p-4 text-slate-400 font-medium">
                        IP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-4 text-slate-400 text-xs font-mono whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-slate-300 text-xs">
                          {entry.userEmail}
                        </td>
                        <td className="p-4">
                          <Badge variant={actionBadgeVariant(entry.action)}>
                            {entry.action}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-xs">
                          {entry.resource}
                        </td>
                        <td className="p-4">
                          <Badge variant="neutral">{entry.source}</Badge>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-xs">
                          {entry.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-800">
                  <p className="text-sm text-slate-500">
                    Page {data.page} of {data.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={page >= data.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
