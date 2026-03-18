"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      <div className="flex items-center justify-between px-3 sm:px-4 h-11 sm:h-12">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Back button on mobile */}
          <Link href="/projects" className="sm:hidden p-1 -ml-1 text-text-muted hover:text-text-primary">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex items-center gap-2 text-text-primary min-w-0 flex-1">
            <Globe className="h-4 w-4 text-text-muted flex-shrink-0 hidden sm:block" />
            <span className="font-medium truncate text-sm sm:text-base">{projectName}</span>
            {currentPage && (
              <>
                <span className="text-text-muted hidden sm:inline">/</span>
                <span className="text-text-secondary hidden sm:inline">{currentPage}</span>
              </>
            )}
          </div>
          {badge && (
            <Badge variant={badge.variant} className="flex-shrink-0 text-[10px] sm:text-xs">
              {badge.label}
            </Badge>
          )}
        </div>

        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Users className="h-4 w-4 mr-1" />
            Invite
          </Button>
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Content
          </Button>
        </div>
        
        {/* Mobile: Just show + button */}
        <Button variant="accent" size="icon-sm" className="sm:hidden flex-shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Phase Tabs - Scrollable on mobile */}
      <div className="flex items-center px-3 sm:px-4 gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
        {phaseTabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/projects/${projectId}/${tab.href}`}
            className={cn(
              "px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
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
