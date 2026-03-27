"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Globe, Users, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const phaseTabs = [
  { id: "sales", label: "Sales", href: "sales" },
  { id: "strategy", label: "Strategy", href: "strategy" },
  { id: "execution", label: "Execution", href: "execution" },
  { id: "reports", label: "Reports", href: "reports" },
  { id: "settings", label: "Settings", href: "settings" },
];

interface ProjectBarProps {
  projectId: string;
  projectName: string;
  projectUrl?: string;
  currentPage?: string;
  badge?: {
    label: string;
    variant: "success" | "warning" | "error" | "info" | "neutral";
  };
}

export function ProjectBar({
  projectId,
  projectName,
  projectUrl,
  currentPage,
  badge,
}: ProjectBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getActivePhase = () => {
    for (const tab of phaseTabs) {
      if (pathname.includes(`/projects/${projectId}/${tab.href}`)) {
        return tab.id;
      }
    }
    return "sales";
  };

  const activePhase = getActivePhase();

  return (
    <div className="sticky top-[var(--topnav-height)] z-40 border-b border-border bg-bg-card">
      {/* Mobile: App-like header with back button and project name */}
      <div className="flex sm:hidden items-center justify-between px-3 h-11">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link href="/projects" className="p-1.5 -ml-1.5 text-text-muted hover:text-text-primary rounded-full hover:bg-bg-elevated">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="h-4 w-4 text-text-muted flex-shrink-0" />
            <span className="font-semibold text-sm text-text-primary truncate">{projectName}</span>
            {badge && (
              <Badge variant={badge.variant} className="text-[10px] flex-shrink-0">
                {badge.label}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="accent" size="icon-sm" onClick={() => router.push(`/projects/${projectId}/execution/content-writer`)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile: Phase tabs as pill navigation */}
      <div className="flex sm:hidden items-center gap-1.5 px-3 pb-2 overflow-x-auto scrollbar-hide">
        {phaseTabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/projects/${projectId}/${tab.href}`}
            className={cn(
              "px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
              activePhase === tab.id
                ? "bg-accent text-white"
                : "bg-bg-elevated text-text-secondary"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Desktop: Single row layout */}
      <div className="hidden sm:flex items-center justify-between px-4 h-11">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Project name + badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Globe className="h-4 w-4 text-text-muted" />
            <span className="font-medium text-sm text-text-primary">{projectName}</span>
            {badge && (
              <Badge variant={badge.variant} className="text-xs">
                {badge.label}
              </Badge>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border" />

          {/* Phase tabs */}
          <div className="flex items-center gap-0.5">
            {phaseTabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/projects/${projectId}/${tab.href}`}
                className={cn(
                  "px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors",
                  activePhase === tab.id
                    ? "text-text-primary bg-bg-elevated"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/projects/${projectId}/settings`)}
          >
            <Users className="h-4 w-4 mr-1" />
            Invite
          </Button>
          <Button variant="accent" size="sm" onClick={() => router.push(`/projects/${projectId}/execution/content-writer`)}>
            <Plus className="h-4 w-4 mr-1" />
            New Content
          </Button>
        </div>
      </div>
    </div>
  );
}
