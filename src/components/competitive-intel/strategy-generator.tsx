"use client";

import * as React from "react";
import {
  Zap,
  Target,
  Trophy,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  Strategy,
  StrategyAction,
  StrategyGoal,
  StrategyTimeline,
  KPI,
  ResourceAllocation,
} from "@/agents/competitive-intel-agent";

interface StrategyGeneratorProps {
  strategy: Strategy;
  onExport?: () => void;
  className?: string;
}

export function StrategyGenerator({ strategy, onExport, className }: StrategyGeneratorProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Strategy Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary leading-relaxed">{strategy.summary}</p>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <StrategyActionsCard
        title="Quick Wins"
        subtitle="1-2 weeks"
        icon={<Zap className="h-5 w-5 text-success" />}
        actions={strategy.quickWins}
        accentColor="success"
      />

      {/* Strategic Plays */}
      <StrategyActionsCard
        title="Strategic Plays"
        subtitle="1-3 months"
        icon={<Target className="h-5 w-5 text-info" />}
        actions={strategy.strategicPlays}
        accentColor="info"
      />

      {/* Long-term Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Long-term Goals (3-6 months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategy.longTermGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation */}
      <ResourceAllocationCard allocation={strategy.resourceAllocation} />

      {/* Timeline */}
      <TimelineCard timeline={strategy.timeline} />

      {/* KPIs */}
      <KPICard kpis={strategy.kpis} />
    </div>
  );
}

function StrategyActionsCard({
  title,
  subtitle,
  icon,
  actions,
  accentColor,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  actions: StrategyAction[];
  accentColor: "success" | "info" | "warning" | "accent";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
          <span className="text-sm font-normal text-text-muted">({subtitle})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-start justify-between p-3 rounded-lg bg-bg-elevated"
            >
              <div className="flex-1">
                <p className="font-medium text-text-primary">{action.action}</p>
                <p className="text-sm text-text-muted mt-1">{action.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="neutral" className="text-xs">
                    {action.category}
                  </Badge>
                  <Badge variant="neutral" className="text-xs">
                    {action.timeframe}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 ml-4">
                <Badge
                  variant={
                    action.impact === "very-high" || action.impact === "high"
                      ? "success"
                      : action.impact === "medium"
                      ? "warning"
                      : "neutral"
                  }
                >
                  {action.impact} impact
                </Badge>
                <Badge
                  variant={
                    action.effort === "low"
                      ? "success"
                      : action.effort === "medium"
                      ? "warning"
                      : "error"
                  }
                >
                  {action.effort} effort
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function GoalCard({ goal }: { goal: StrategyGoal }) {
  return (
    <div className="p-4 rounded-lg border border-border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-text-primary">{goal.goal}</p>
          <p className="text-sm text-text-muted">{goal.timeframe}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted">Current → Target</p>
          <p className="font-mono">
            <span className="text-text-secondary">{goal.currentValue}</span>
            <ArrowRight className="inline h-3 w-3 mx-1 text-text-muted" />
            <span className="text-accent font-semibold">{goal.targetValue}</span>
          </p>
        </div>
      </div>

      {/* Milestones */}
      <div className="flex items-center gap-2">
        {goal.milestones.map((milestone, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 text-center">
              <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${((i + 1) / goal.milestones.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">{milestone.date}</p>
              <p className="text-xs font-medium">{milestone.target}</p>
            </div>
            {i < goal.milestones.length - 1 && (
              <ArrowRight className="h-3 w-3 text-text-muted flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ResourceAllocationCard({ allocation }: { allocation: ResourceAllocation }) {
  const items = [
    { label: "Content Creation", value: allocation.content, color: "bg-accent" },
    { label: "Link Building", value: allocation.linkBuilding, color: "bg-info" },
    { label: "Technical SEO", value: allocation.technical, color: "bg-success" },
    { label: "Analytics", value: allocation.analytics, color: "bg-warning" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-accent" />
          Recommended Resource Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.label} className="p-4 rounded-lg border border-border text-center">
              <p className="text-3xl font-bold text-text-primary">{item.value}%</p>
              <p className="text-sm text-text-muted mt-1">{item.label}</p>
              <div className="h-2 bg-bg-elevated rounded-full mt-2 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", item.color)}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCard({ timeline }: { timeline: StrategyTimeline[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Implementation Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((phase, i) => (
            <div key={phase.phase} className="relative pl-8">
              {/* Timeline line */}
              {i < timeline.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border" />
              )}
              
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center",
                  i === 0 ? "bg-accent" : "bg-bg-elevated border-2 border-border"
                )}
              >
                <span className={cn("text-xs font-medium", i === 0 ? "text-white" : "text-text-muted")}>
                  {i + 1}
                </span>
              </div>

              <div className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-text-primary">{phase.phase}</p>
                  <Badge variant="neutral" className="text-xs">{phase.duration}</Badge>
                </div>
                <ul className="text-sm text-text-muted space-y-1 mb-2">
                  {phase.focus.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-success mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">Expected:</span> {phase.expectedOutcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function KPICard({ kpis }: { kpis: KPI[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Key Performance Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const progress = Math.min((kpi.current / kpi.target) * 100, 100);
            return (
              <div key={kpi.name} className="p-3 rounded-lg border border-border">
                <p className="text-sm text-text-muted mb-1">{kpi.name}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-text-primary">
                    {kpi.current.toLocaleString()}
                  </span>
                  <span className="text-sm text-text-muted">/ {kpi.target.toLocaleString()}</span>
                  <span className="text-xs text-text-muted">{kpi.unit}</span>
                </div>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      progress >= 80 ? "bg-success" : progress >= 50 ? "bg-warning" : "bg-accent"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">{kpi.timeframe}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
