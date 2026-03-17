"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const getTrendColor = () => {
    if (!trend) return "text-text-muted";
    if (trend > 0) return "text-success";
    if (trend < 0) return "text-error";
    return "text-text-muted";
  };

  const TrendIcon = () => {
    if (!trend) return <Minus className="h-3 w-3" />;
    if (trend > 0) return <TrendingUp className="h-3 w-3" />;
    return <TrendingDown className="h-3 w-3" />;
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border p-4",
        variant === "accent"
          ? "border-accent/20 bg-accent/5"
          : "border-border bg-bg-card",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
            {label}
          </p>
          <p
            className={cn(
              "text-2xl font-bold font-mono",
              variant === "accent" ? "text-accent" : "text-text-primary"
            )}
          >
            {value}
          </p>
          {(trend !== undefined || trendLabel) && (
            <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
              <TrendIcon />
              <span>
                {trend !== undefined && (
                  <>
                    {trend > 0 ? "+" : ""}
                    {trend}%
                  </>
                )}
                {trendLabel && <span className="text-text-muted ml-1">{trendLabel}</span>}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-text-muted">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
