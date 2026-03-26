"use client";

import * as React from "react";
import { Cloud, Database, RefreshCw, AlertCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DataSourceIndicatorProps {
  source: 'api' | 'mock' | null;
  isLoading?: boolean;
  error?: string | null;
  lastUpdated?: string | Date;
  onRefresh?: () => void;
  className?: string;
  showRefreshButton?: boolean;
  compact?: boolean;
}

/**
 * Data Source Indicator Component
 * 
 * Shows users where the data is coming from (Live API vs Demo Data)
 * and provides refresh functionality.
 * 
 * Usage:
 * ```tsx
 * <DataSourceIndicator 
 *   source={source} 
 *   isLoading={isLoading}
 *   lastUpdated={new Date()}
 *   onRefresh={refetch}
 * />
 * ```
 */
export function DataSourceIndicator({
  source,
  isLoading = false,
  error = null,
  lastUpdated,
  onRefresh,
  className,
  showRefreshButton = true,
  compact = false,
}: DataSourceIndicatorProps) {
  const formatLastUpdated = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  if (error) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="error" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Error
        </Badge>
        {showRefreshButton && onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          </Button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="neutral" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading...
        </Badge>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {source === 'api' ? (
          <span className="flex items-center gap-1 text-xs text-success">
            <Cloud className="h-3 w-3" />
            Live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Database className="h-3 w-3" />
            Demo
          </span>
        )}
        {showRefreshButton && onRefresh && (
          <button 
            onClick={onRefresh} 
            disabled={isLoading}
            className="p-0.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {source === 'api' ? (
        <Badge variant="success" className="gap-1">
          <Cloud className="h-3 w-3" />
          Live Data
        </Badge>
      ) : (
        <Badge variant="neutral" className="gap-1">
          <Database className="h-3 w-3" />
          Demo Data
        </Badge>
      )}
      
      {lastUpdated && (
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          {formatLastUpdated(lastUpdated)}
        </span>
      )}
      
      {showRefreshButton && onRefresh && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isLoading}
          className="h-6 px-2"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          <span className="ml-1 text-xs">Refresh</span>
        </Button>
      )}
    </div>
  );
}

/**
 * Inline version for use in headers
 */
export function DataSourceBadge({
  source,
  isLoading = false,
}: {
  source: 'api' | 'mock' | null;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-text-muted">
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    );
  }

  if (source === 'api') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-success">
        <Cloud className="h-3 w-3" />
        Live
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
      <Database className="h-3 w-3" />
      Demo
    </span>
  );
}

/**
 * Setup Required Banner
 * Shows when user needs to configure something before data can be fetched
 */
export function SetupRequiredBanner({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = AlertCircle,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-warning/5 border border-warning/20">
      <div className="p-2 rounded-lg bg-warning/10">
        <Icon className="h-5 w-5 text-warning" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted mt-1">{description}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

/**
 * Empty State with Setup CTA
 */
export function EmptyStateWithSetup({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-bg-elevated mb-4">
        <Icon className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted max-w-md mb-6">{description}</p>
      <Button variant="accent" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
