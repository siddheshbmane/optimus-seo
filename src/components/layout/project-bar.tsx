"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Globe, Users, Plus } from "lucide-react";
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
    <div className="border-b border-border bg-bg-card">
      {/* Project Info Row */}
      <div className="flex items-center justify-between px-4 h-11">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-primary">
            <Globe className="h-4 w-4 text-text-muted" />
            <span className="font-medium">{projectName}</span>
            {currentPage && (
              <>
                <span className="text-text-muted">/</span>
                <span className="text-text-secondary">{currentPage}</span>
              </>
            )}
          </div>
          {badge && (
            <Badge variant={badge.variant}>{badge.label}</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Users className="h-4 w-4 mr-1" />
            Invite
          </Button>
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Content
          </Button>
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="flex items-center px-4 gap-1">
        {phaseTabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/projects/${projectId}/${tab.href}`}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              activePhase === tab.id
                ? "text-text-primary border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary hover:border-border"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
