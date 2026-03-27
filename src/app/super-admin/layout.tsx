"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  BrainCircuit,
  Activity,
  ScrollText,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { label: "Tenants", href: "/super-admin/tenants", icon: Building2 },
  { label: "Users", href: "/super-admin/users", icon: Users },
  { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { label: "LLM Costs", href: "/super-admin/llm-costs", icon: BrainCircuit },
  { label: "Usage", href: "/super-admin/usage", icon: Activity },
  { label: "Audit Log", href: "/super-admin/audit-log", icon: ScrollText },
  { label: "Settings", href: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [authorized, setAuthorized] = React.useState<boolean | null>(null);

  // Skip auth check and sidebar for the login page
  const isLoginPage = pathname === "/super-admin/login";

  React.useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true); // Don't block login page rendering
      return;
    }

    fetch("/api/super-admin/auth/check")
      .then((res) => {
        if (!res.ok) {
          router.push("/super-admin/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) setAuthorized(true);
        else router.push("/super-admin/login");
      })
      .catch(() => router.push("/super-admin/login"));
  }, [router, isLoginPage]);

  // Login page: render children directly without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Verifying access...</div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/super-admin") return pathname === "/super-admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="font-bold text-sm">SUPER ADMIN</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              <div>
                <div className="font-bold text-sm text-white">SUPER ADMIN</div>
                <div className="text-xs text-slate-500">
                  Optimus SEO Platform
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-red-500/10 text-red-400 font-medium"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-3 border-t border-slate-800 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to App
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
