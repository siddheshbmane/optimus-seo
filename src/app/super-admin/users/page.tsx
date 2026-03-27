"use client";

import * as React from "react";
import { Users, Search, Filter, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationName: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");

  React.useEffect(() => {
    fetch("/api/super-admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data || []);
      })
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const uniqueRoles = [
    "all",
    ...Array.from(new Set(users.map((u) => u.role).filter(Boolean))),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 text-sm mt-1">
          All users across all organizations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {uniqueRoles.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-400" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-4 w-32 bg-slate-800 rounded" />
                  <div className="h-4 w-48 bg-slate-800 rounded" />
                  <div className="h-4 w-16 bg-slate-800 rounded" />
                  <div className="h-4 w-28 bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-slate-800 rounded" />
                  <div className="h-4 w-20 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              {search || roleFilter !== "all"
                ? "No users match your filters"
                : "No users found"}
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
                      Email
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Role
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Organization
                    </th>
                    <th className="text-center p-4 text-slate-400 font-medium">
                      Active
                    </th>
                    <th className="text-center p-4 text-slate-400 font-medium">
                      Admin
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Last Login
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 text-white font-medium">
                        {user.name || "---"}
                      </td>
                      <td className="p-4 text-slate-300 font-mono text-xs">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <Badge variant="neutral">{user.role}</Badge>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        {user.organizationName || "---"}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            user.isActive ? "bg-emerald-500" : "bg-slate-600"
                          }`}
                        />
                      </td>
                      <td className="p-4 text-center">
                        {user.isSuperAdmin && (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                            <Shield className="h-3 w-3 mr-1" />
                            SUPER ADMIN
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
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
