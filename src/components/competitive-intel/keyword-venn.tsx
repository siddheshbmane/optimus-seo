"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface KeywordOverlapData {
  yours: number;
  competitors: number;
  overlap: number;
  unique: number;
  gaps: number;
}

interface KeywordVennProps {
  data: KeywordOverlapData;
  yourName?: string;
  competitorName?: string;
  className?: string;
}

export function KeywordVenn({
  data,
  yourName = "Your Site",
  competitorName = "Competitors",
  className,
}: KeywordVennProps) {
  const totalKeywords = data.yours + data.competitors - data.overlap;
  const yourPercentage = Math.round((data.yours / totalKeywords) * 100);
  const competitorPercentage = Math.round((data.competitors / totalKeywords) * 100);
  const overlapPercentage = Math.round((data.overlap / totalKeywords) * 100);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Keyword Overlap Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Venn Diagram Visualization */}
        <div className="relative h-[250px] flex items-center justify-center">
          {/* Your Keywords Circle */}
          <div
            className="absolute w-[180px] h-[180px] rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center"
            style={{ left: "calc(50% - 130px)" }}
          >
            <div className="text-center -ml-8">
              <p className="text-2xl font-bold text-accent">{data.yours.toLocaleString()}</p>
              <p className="text-xs text-text-muted">{yourName}</p>
            </div>
          </div>

          {/* Competitor Keywords Circle */}
          <div
            className="absolute w-[180px] h-[180px] rounded-full bg-info/20 border-2 border-info flex items-center justify-center"
            style={{ right: "calc(50% - 130px)" }}
          >
            <div className="text-center ml-8">
              <p className="text-2xl font-bold text-info">{data.competitors.toLocaleString()}</p>
              <p className="text-xs text-text-muted">{competitorName}</p>
            </div>
          </div>

          {/* Overlap Area */}
          <div className="absolute z-10 text-center">
            <div className="bg-bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
              <p className="text-xl font-bold text-success">{data.overlap.toLocaleString()}</p>
              <p className="text-xs text-text-muted">Overlap</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-bg-elevated">
            <p className="text-lg font-bold text-accent">{data.unique.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Your Unique</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-bg-elevated">
            <p className="text-lg font-bold text-success">{data.overlap.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Shared</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-bg-elevated">
            <p className="text-lg font-bold text-info">{(data.competitors - data.overlap).toLocaleString()}</p>
            <p className="text-xs text-text-muted">Competitor Only</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-bg-elevated">
            <p className="text-lg font-bold text-warning">{data.gaps}</p>
            <p className="text-xs text-text-muted">Gap Opportunities</p>
          </div>
        </div>

        {/* Percentages */}
        <div className="mt-4 p-3 rounded-lg bg-bg-elevated">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Overlap Rate:</span>
            <span className="font-medium text-text-primary">{overlapPercentage}%</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-text-muted">Your Coverage:</span>
            <span className="font-medium text-text-primary">{yourPercentage}%</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-text-muted">Competitor Coverage:</span>
            <span className="font-medium text-text-primary">{competitorPercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple horizontal bar comparison
export function KeywordComparisonBar({
  label,
  yourValue,
  competitorValue,
  className,
}: {
  label: string;
  yourValue: number;
  competitorValue: number;
  className?: string;
}) {
  const max = Math.max(yourValue, competitorValue);
  const yourWidth = (yourValue / max) * 100;
  const competitorWidth = (competitorValue / max) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted w-20">You</span>
          <div className="flex-1 h-4 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${yourWidth}%` }}
            />
          </div>
          <span className="text-xs font-medium w-16 text-right">{yourValue.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted w-20">Competitors</span>
          <div className="flex-1 h-4 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-info rounded-full transition-all"
              style={{ width: `${competitorWidth}%` }}
            />
          </div>
          <span className="text-xs font-medium w-16 text-right">{competitorValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
