"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TechnicalIssue } from "@/data/mock-technical-seo";

interface IssueCardProps {
  issue: TechnicalIssue;
  isExpanded?: boolean;
  onToggle?: () => void;
  onGenerateFix?: () => void;
  onViewPages?: () => void;
  className?: string;
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-error",
    bg: "bg-error/10",
    label: "Critical",
    badgeVariant: "error" as const,
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Warning",
    badgeVariant: "warning" as const,
  },
  info: {
    icon: Info,
    color: "text-info",
    bg: "bg-info/10",
    label: "Info",
    badgeVariant: "info" as const,
  },
};

const categoryLabels: Record<string, string> = {
  crawlability: "Crawlability",
  indexability: "Indexability",
  performance: "Performance",
  content: "Content",
  links: "Links",
  security: "Security",
  mobile: "Mobile",
  "structured-data": "Structured Data",
};

export function IssueCard({
  issue,
  isExpanded = false,
  onToggle,
  onGenerateFix,
  onViewPages,
  className,
}: IssueCardProps) {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={cn("p-4", className)}>
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
              config.bg
            )}
          >
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-text-primary">{issue.title}</h3>
                <Badge variant={config.badgeVariant} className="text-xs">
                  {config.label}
                </Badge>
                <Badge variant="neutral" className="text-xs">
                  {categoryLabels[issue.category]}
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-text-muted" />
              ) : (
                <ChevronRight className="h-4 w-4 text-text-muted" />
              )}
            </div>
            <p className="text-sm text-text-secondary mt-1">{issue.description}</p>
            {issue.affectedPages > 0 && (
              <p className="text-xs text-text-muted mt-1">
                {issue.affectedPages} pages affected
              </p>
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 ml-11 p-4 bg-bg-elevated rounded-lg space-y-4">
          <div>
            <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
              How to Fix
            </h4>
            <p className="text-sm text-text-primary">{issue.fixSuggestion}</p>
          </div>

          {issue.fixCode && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Fix Code
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(issue.fixCode!)}
                >
                  {copiedCode ? (
                    <Check className="h-3.5 w-3.5 mr-1 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1" />
                  )}
                  {copiedCode ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className="p-3 bg-bg-primary rounded-lg text-sm font-mono text-text-secondary overflow-x-auto">
                {issue.fixCode}
              </pre>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button variant="accent" size="sm" onClick={onGenerateFix}>
              <Zap className="h-3.5 w-3.5 mr-1" />
              Generate AI Fix
            </Button>
            <Button variant="ghost" size="sm" onClick={onViewPages}>
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View affected pages
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function IssueCardCompact({
  issue,
  onClick,
  className,
}: {
  issue: TechnicalIssue;
  onClick?: () => void;
  className?: string;
}) {
  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex items-center gap-3 hover:bg-bg-elevated transition-colors text-left",
        className
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
          config.bg
        )}
      >
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary">{issue.title}</p>
        <p className="text-sm text-text-muted">{issue.affectedPages} pages affected</p>
      </div>
      <Badge variant={config.badgeVariant}>{config.label}</Badge>
      <ChevronRight className="h-4 w-4 text-text-muted" />
    </button>
  );
}
