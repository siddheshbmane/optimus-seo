"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface HealthScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function HealthScoreGauge({
  score,
  size = "md",
  showLabel = true,
  className,
}: HealthScoreGaugeProps) {
  const data = [
    { name: "Score", value: score, fill: getScoreColor(score) },
    { name: "Remaining", value: 100 - score, fill: "#1F2937" },
  ];

  const sizeConfig = {
    sm: { height: 120, innerRadius: 35, outerRadius: 50, fontSize: "text-2xl" },
    md: { height: 200, innerRadius: 60, outerRadius: 80, fontSize: "text-4xl" },
    lg: { height: 280, innerRadius: 85, outerRadius: 110, fontSize: "text-5xl" },
  };

  const config = sizeConfig[size];

  return (
    <div className={cn("relative", className)} style={{ height: config.height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={config.innerRadius}
            outerRadius={config.outerRadius}
            startAngle={180}
            endAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center mt-8">
            <p className={cn(config.fontSize, "font-bold", getScoreTextColor(score))}>
              {score}
            </p>
            <p className="text-sm text-text-muted">out of 100</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981"; // green
  if (score >= 60) return "#F59E0B"; // yellow
  if (score >= 40) return "#F97316"; // orange
  return "#EF4444"; // red
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-orange-500";
  return "text-error";
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Improvement";
  return "Poor";
}

export function getHealthScoreDescription(score: number): string {
  if (score >= 80) return "Your site is well-optimized with minor issues to address.";
  if (score >= 60) return "Several issues need attention to improve SEO performance.";
  if (score >= 40) return "Multiple issues are affecting your site's SEO performance.";
  return "Critical issues are severely impacting your site's SEO performance.";
}
