"use client";

import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CompetitorPosition {
  name: string;
  domainRating: number;
  traffic: number;
  marketShare: number;
  isYou?: boolean;
}

interface CompetitorLandscapeProps {
  competitors: CompetitorPosition[];
  className?: string;
}

const COLORS = ['#FD8C73', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function CompetitorLandscape({ competitors, className }: CompetitorLandscapeProps) {
  const data = competitors.map((c, i) => ({
    ...c,
    z: c.marketShare * 10, // Size based on market share
    fill: c.isYou ? '#FD8C73' : COLORS[(i + 1) % COLORS.length],
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Competitive Landscape</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                type="number"
                dataKey="domainRating"
                name="Domain Rating"
                domain={[40, 100]}
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                label={{ value: 'Domain Rating', position: 'bottom', fill: 'var(--color-text-muted)' }}
              />
              <YAxis
                type="number"
                dataKey="traffic"
                name="Traffic"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                label={{ value: 'Traffic', angle: -90, position: 'left', fill: 'var(--color-text-muted)' }}
              />
              <ZAxis type="number" dataKey="z" range={[100, 1000]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-text-primary flex items-center gap-2">
                          {data.name}
                          {data.isYou && <Badge variant="accent" className="text-xs">You</Badge>}
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p><span className="text-text-muted">DR:</span> {data.domainRating}</p>
                          <p><span className="text-text-muted">Traffic:</span> {data.traffic.toLocaleString()}</p>
                          <p><span className="text-text-muted">Market Share:</span> {data.marketShare}%</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={data}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke={entry.isYou ? '#FD8C73' : 'transparent'}
                    strokeWidth={entry.isYou ? 3 : 0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          {data.map((competitor) => (
            <div key={competitor.name} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  competitor.isYou && "ring-2 ring-accent ring-offset-2 ring-offset-bg-card"
                )}
                style={{ backgroundColor: competitor.fill }}
              />
              <span className="text-sm text-text-muted">{competitor.name}</span>
            </div>
          ))}
        </div>

        {/* Quadrant Labels */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-text-muted">
          <div className="p-2 rounded bg-bg-elevated text-center">
            <p className="font-medium text-text-primary">High DR, Low Traffic</p>
            <p>Authority without reach</p>
          </div>
          <div className="p-2 rounded bg-bg-elevated text-center">
            <p className="font-medium text-success">High DR, High Traffic</p>
            <p>Market leaders</p>
          </div>
          <div className="p-2 rounded bg-bg-elevated text-center">
            <p className="font-medium text-warning">Low DR, Low Traffic</p>
            <p>Emerging players</p>
          </div>
          <div className="p-2 rounded bg-bg-elevated text-center">
            <p className="font-medium text-info">Low DR, High Traffic</p>
            <p>Content-driven growth</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Positioning Matrix - 2x2 grid view
export function PositioningMatrix({
  competitors,
  xAxis = "domainRating",
  yAxis = "traffic",
  xLabel = "Domain Authority",
  yLabel = "Traffic",
  className,
}: {
  competitors: CompetitorPosition[];
  xAxis?: keyof CompetitorPosition;
  yAxis?: keyof CompetitorPosition;
  xLabel?: string;
  yLabel?: string;
  className?: string;
}) {
  // Calculate medians for quadrant lines
  const xValues = competitors.map(c => c[xAxis] as number);
  const yValues = competitors.map(c => c[yAxis] as number);
  const xMedian = xValues.sort((a, b) => a - b)[Math.floor(xValues.length / 2)];
  const yMedian = yValues.sort((a, b) => a - b)[Math.floor(yValues.length / 2)];

  // Categorize competitors into quadrants
  const quadrants = {
    topRight: competitors.filter(c => (c[xAxis] as number) >= xMedian && (c[yAxis] as number) >= yMedian),
    topLeft: competitors.filter(c => (c[xAxis] as number) < xMedian && (c[yAxis] as number) >= yMedian),
    bottomRight: competitors.filter(c => (c[xAxis] as number) >= xMedian && (c[yAxis] as number) < yMedian),
    bottomLeft: competitors.filter(c => (c[xAxis] as number) < xMedian && (c[yAxis] as number) < yMedian),
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Competitive Positioning Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Top Left */}
          <div className="p-4 rounded-lg border border-border bg-info/5">
            <p className="text-xs font-medium text-info mb-2">High {yLabel}, Low {xLabel}</p>
            <div className="space-y-1">
              {quadrants.topLeft.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", c.isYou ? "bg-accent" : "bg-info")} />
                  <span className={cn("text-sm", c.isYou && "font-medium text-accent")}>{c.name}</span>
                </div>
              ))}
              {quadrants.topLeft.length === 0 && <p className="text-xs text-text-muted">No competitors</p>}
            </div>
          </div>

          {/* Top Right - Leaders */}
          <div className="p-4 rounded-lg border border-success/50 bg-success/5">
            <p className="text-xs font-medium text-success mb-2">Leaders</p>
            <div className="space-y-1">
              {quadrants.topRight.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", c.isYou ? "bg-accent" : "bg-success")} />
                  <span className={cn("text-sm", c.isYou && "font-medium text-accent")}>{c.name}</span>
                </div>
              ))}
              {quadrants.topRight.length === 0 && <p className="text-xs text-text-muted">No competitors</p>}
            </div>
          </div>

          {/* Bottom Left - Emerging */}
          <div className="p-4 rounded-lg border border-border bg-warning/5">
            <p className="text-xs font-medium text-warning mb-2">Emerging</p>
            <div className="space-y-1">
              {quadrants.bottomLeft.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", c.isYou ? "bg-accent" : "bg-warning")} />
                  <span className={cn("text-sm", c.isYou && "font-medium text-accent")}>{c.name}</span>
                </div>
              ))}
              {quadrants.bottomLeft.length === 0 && <p className="text-xs text-text-muted">No competitors</p>}
            </div>
          </div>

          {/* Bottom Right */}
          <div className="p-4 rounded-lg border border-border bg-bg-elevated">
            <p className="text-xs font-medium text-text-muted mb-2">High {xLabel}, Low {yLabel}</p>
            <div className="space-y-1">
              {quadrants.bottomRight.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", c.isYou ? "bg-accent" : "bg-text-muted")} />
                  <span className={cn("text-sm", c.isYou && "font-medium text-accent")}>{c.name}</span>
                </div>
              ))}
              {quadrants.bottomRight.length === 0 && <p className="text-xs text-text-muted">No competitors</p>}
            </div>
          </div>
        </div>

        {/* Axis Labels */}
        <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
          <span>← Low {xLabel}</span>
          <span>High {xLabel} →</span>
        </div>
      </CardContent>
    </Card>
  );
}
