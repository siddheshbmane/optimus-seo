"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  PlayCircle,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/agents", label: "Agents", icon: PlayCircle },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors",
              isActive(item.href)
                ? "text-accent"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform",
              isActive(item.href) && "scale-110"
            )} />
            <span className={cn(
              "text-[10px] font-medium",
              isActive(item.href) && "font-semibold"
            )}>
              {item.label}
            </span>
            {isActive(item.href) && (
              <div className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
