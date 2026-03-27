"use client";

import * as React from "react";
import { Building2, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  subscriptionStatus: string;
  userCount: number;
  projectCount: number;
  createdAt: string;
}

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  React.useEffect(() => {
    fetch("/api/super-admin/tenants")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTenants(data.data || []);
      })
      .catch((err) => console.error("Failed to fetch tenants:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || t.subscriptionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "trialing":
        return "info";
      case "past_due":
        return "warning";
      case "canceled":
      case "inactive":
        return "error";
      default:
        return "neutral";
    }
  };

  const uniqueStatuses = [
    "all",
    ...Array.from(new Set(tenants.map((t) => t.subscriptionStatus))),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tenants</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage all organizations on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-slate-400" />
            Organizations ({filteredTenants.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-4 w-40 bg-slate-800 rounded" />
                  <div className="h-4 w-24 bg-slate-800 rounded" />
                  <div className="h-4 w-16 bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-slate-800 rounded" />
                  <div className="h-4 w-28 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              {search || statusFilter !== "all"
                ? "No tenants match your filters"
                : "No tenants found"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Name
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Slug
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Status
                    </th>
                    <th className="text-right p-4 text-slate-400 font-medium">
                      Users
                    </th>
                    <th className="text-right p-4 text-slate-400 font-medium">
                      Projects
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 text-white font-medium">
                        {tenant.name}
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-xs">
                        {tenant.slug}
                      </td>
                      <td className="p-4">
                        <Badge variant={statusBadgeVariant(tenant.subscriptionStatus)}>
                          {tenant.subscriptionStatus}
                        </Badge>
                      </td>
                      <td className="p-4 text-right text-slate-300">
                        {tenant.userCount}
                      </td>
                      <td className="p-4 text-right text-slate-300">
                        {tenant.projectCount}
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
