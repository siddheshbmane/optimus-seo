"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  FileText,
  Link2,
  Code,
  Play,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

interface QuickWin {
  id: number;
  title: string;
  description: string;
  type: "content" | "technical" | "links" | "meta";
  impact: "high" | "medium" | "low";
  effort: "easy" | "medium" | "hard";
  estimatedTime: string;
  potentialTraffic: number;
  status: "pending" | "in_progress" | "completed";
  keyword?: string;
}

const quickWins: QuickWin[] = [
  {
    id: 1,
    title: "Add FAQ schema to top 5 pages",
    description: "Implement FAQ structured data to win featured snippets",
    type: "technical",
    impact: "high",
    effort: "easy",
    estimatedTime: "30 min",
    potentialTraffic: 2500,
    status: "pending",
  },
  {
    id: 2,
    title: "Optimize title tags for CTR",
    description: "Update 12 pages with low CTR despite good rankings",
    type: "meta",
    impact: "high",
    effort: "easy",
    estimatedTime: "1 hour",
    potentialTraffic: 3200,
    status: "pending",
  },
  {
    id: 3,
    title: "Fix broken internal links",
    description: "23 broken internal links found across the site",
    type: "technical",
    impact: "medium",
    effort: "easy",
    estimatedTime: "45 min",
    potentialTraffic: 800,
    status: "in_progress",
  },
  {
    id: 4,
    title: "Add internal links to orphan pages",
    description: "8 pages have no internal links pointing to them",
    type: "links",
    impact: "medium",
    effort: "easy",
    estimatedTime: "30 min",
    potentialTraffic: 1200,
    status: "pending",
  },
  {
    id: 5,
    title: "Expand thin content pages",
    description: "5 pages under 500 words need more content",
    type: "content",
    impact: "high",
    effort: "medium",
    estimatedTime: "3 hours",
    potentialTraffic: 4500,
    status: "pending",
    keyword: "seo services",
  },
  {
    id: 6,
    title: "Add alt text to images",
    description: "156 images missing alt text",
    type: "technical",
    impact: "low",
    effort: "easy",
    estimatedTime: "2 hours",
    potentialTraffic: 500,
    status: "completed",
  },
  {
    id: 7,
    title: "Optimize meta descriptions",
    description: "18 pages have duplicate or missing meta descriptions",
    type: "meta",
    impact: "medium",
    effort: "easy",
    estimatedTime: "1 hour",
    potentialTraffic: 1800,
    status: "pending",
  },
  {
    id: 8,
    title: "Compress large images",
    description: "34 images over 500KB slowing page speed",
    type: "technical",
    impact: "medium",
    effort: "easy",
    estimatedTime: "1 hour",
    potentialTraffic: 1500,
    status: "pending",
  },
];

const typeConfig = {
  content: { icon: FileText, color: "bg-info/10 text-info" },
  technical: { icon: Code, color: "bg-warning/10 text-warning" },
  links: { icon: Link2, color: "bg-success/10 text-success" },
  meta: { icon: Target, color: "bg-accent/10 text-accent" },
};

export default function QuickWinsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  const [wins, setWins] = React.useState(quickWins);

  if (!project) return null;

  const pendingWins = wins.filter(w => w.status === "pending");
  const completedWins = wins.filter(w => w.status === "completed");
  const totalPotentialTraffic = pendingWins.reduce((sum, w) => sum + w.potentialTraffic, 0);
  const highImpactWins = pendingWins.filter(w => w.impact === "high");

  const startWin = (id: number) => {
    setWins(wins.map(w => 
      w.id === id ? { ...w, status: "in_progress" as const } : w
    ));
  };

  const completeWin = (id: number) => {
    setWins(wins.map(w => 
      w.id === id ? { ...w, status: "completed" as const } : w
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Quick Wins</h1>
          <p className="text-text-secondary">
            Low-effort, high-impact SEO improvements
          </p>
        </div>
        <Button variant="accent">
          <Zap className="h-4 w-4 mr-2" />
          Execute All Easy Wins
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Wins"
          value={pendingWins.length}
          trendLabel="opportunities"
          icon={<Zap className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="High Impact"
          value={highImpactWins.length}
          trendLabel="priority wins"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Potential Traffic"
          value={`+${formatNumber(totalPotentialTraffic)}`}
          trendLabel="monthly visits"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={completedWins.length}
          trend={completedWins.length}
          trendLabel="this month"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Quick Wins List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {wins.filter(w => w.status !== "completed").map((win) => {
          const TypeIcon = typeConfig[win.type].icon;
          return (
            <Card key={win.id} className={cn(
              "transition-colors",
              win.status === "in_progress" && "border-accent/50"
            )}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    typeConfig[win.type].color
                  )}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-text-primary">{win.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          win.impact === "high" ? "success" :
                          win.impact === "medium" ? "warning" : "neutral"
                        }>
                          {win.impact} impact
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mb-3">{win.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {win.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +{formatNumber(win.potentialTraffic)} traffic
                        </span>
                        <Badge variant="neutral">{win.effort}</Badge>
                      </div>
                      
                      {win.status === "pending" ? (
                        <Button variant="accent" size="sm" onClick={() => startWin(win.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => completeWin(win.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completed Wins */}
      {completedWins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Completed Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedWins.map((win) => {
                const TypeIcon = typeConfig[win.type].icon;
                return (
                  <div key={win.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        typeConfig[win.type].color
                      )}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{win.title}</p>
                        <p className="text-xs text-text-muted">+{formatNumber(win.potentialTraffic)} potential traffic</p>
                      </div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
