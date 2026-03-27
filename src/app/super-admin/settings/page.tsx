"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  Server,
  Shield,
  User,
  ExternalLink,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SettingsData {
  system: {
    nodeVersion: string;
    environment: string;
    platform: string;
    uptime: string;
    dbProvider: string;
  };
  superAdmins: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }[];
  currentAdmin: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function SettingsPage() {
  const [data, setData] = React.useState<SettingsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/super-admin/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
      })
      .catch((err) => console.error("Failed to fetch settings:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">
            System configuration and admin management
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-slate-900 border border-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">
            System configuration and admin management
          </p>
        </div>
        <div className="text-center text-slate-500 py-12">
          Failed to load settings
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          System configuration and admin management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Info */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-slate-400" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <InfoRow label="Node Version" value={data.system.nodeVersion} />
              <InfoRow label="Environment" value={data.system.environment} />
              <InfoRow label="Platform" value={data.system.platform} />
              <InfoRow label="Uptime" value={data.system.uptime} />
              <InfoRow label="Database" value={data.system.dbProvider} />
            </div>
          </CardContent>
        </Card>

        {/* Current Admin */}
        {data.currentAdmin && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-slate-400" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <InfoRow
                  label="Name"
                  value={data.currentAdmin.name || "---"}
                />
                <InfoRow label="Email" value={data.currentAdmin.email} />
                <InfoRow label="Role" value={data.currentAdmin.role} />
                <InfoRow label="ID" value={data.currentAdmin.id} mono />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Go to App Settings
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Super Admin Users */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Super Admin Users
            <Badge className="bg-red-500/10 text-red-400 ml-2">
              {data.superAdmins.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data.superAdmins.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No super admin users found
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
                      Status
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Since
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.superAdmins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 text-white font-medium">
                        {admin.name || "---"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          <span className="font-mono text-xs">
                            {admin.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                          <Shield className="h-3 w-3 mr-1" />
                          SUPER ADMIN
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {new Date(admin.createdAt).toLocaleDateString()}
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

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm text-white ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
