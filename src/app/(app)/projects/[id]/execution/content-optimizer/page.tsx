"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileCheck,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

const contentToOptimize = [
  {
    id: 1,
    title: "SEO Best Practices Guide",
    url: "/blog/seo-best-practices",
    currentScore: 68,
    potentialScore: 92,
    issues: ["Missing H2 tags", "Low keyword density", "No internal links"],
    status: "pending",
    traffic: 2400,
    keywords: 12,
  },
  {
    id: 2,
    title: "Link Building Strategies",
    url: "/blog/link-building",
    currentScore: 72,
    potentialScore: 88,
    issues: ["Thin content", "Missing meta description"],
    status: "optimizing",
    progress: 45,
    traffic: 3200,
    keywords: 18,
  },
  {
    id: 3,
    title: "Local SEO Tips",
    url: "/blog/local-seo-tips",
    currentScore: 58,
    potentialScore: 85,
    issues: ["Outdated information", "Missing schema markup", "Poor readability"],
    status: "pending",
    traffic: 1800,
    keywords: 8,
  },
  {
    id: 4,
    title: "Technical SEO Checklist",
    url: "/blog/technical-seo-checklist",
    currentScore: 82,
    potentialScore: 95,
    issues: ["Missing alt tags"],
    status: "completed",
    traffic: 5600,
    keywords: 24,
  },
  {
    id: 5,
    title: "Content Marketing Guide",
    url: "/blog/content-marketing",
    currentScore: 65,
    potentialScore: 90,
    issues: ["No FAQ section", "Missing internal links", "Low word count"],
    status: "pending",
    traffic: 2100,
    keywords: 15,
  },
];

const optimizationStats = {
  totalPages: 156,
  optimized: 89,
  pending: 45,
  inProgress: 3,
  avgScoreImprovement: 18,
};

export default function ContentOptimizerPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  const [content, setContent] = React.useState(contentToOptimize);

  if (!project) return null;

  const startOptimization = (id: number) => {
    setContent(content.map(c => 
      c.id === id ? { ...c, status: "optimizing", progress: 0 } : c
    ));
    // Simulate progress
    const interval = setInterval(() => {
      setContent(prev => prev.map(c => {
        if (c.id === id && c.status === "optimizing") {
          const newProgress = (c.progress || 0) + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...c, status: "completed", progress: 100, currentScore: c.potentialScore };
          }
          return { ...c, progress: newProgress };
        }
        return c;
      }));
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Content Optimizer</h1>
          <p className="text-text-secondary">
            AI-powered content optimization for better rankings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan All Pages
          </Button>
          <Button variant="accent">
            <Sparkles className="h-4 w-4 mr-2" />
            Optimize All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pages"
          value={optimizationStats.totalPages}
          trendLabel="indexed pages"
          icon={<FileCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Optimized"
          value={optimizationStats.optimized}
          trend={12}
          trendLabel="this month"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Pending"
          value={optimizationStats.pending}
          trendLabel="need optimization"
          icon={<Clock className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Avg Improvement"
          value={`+${optimizationStats.avgScoreImprovement}%`}
          trendLabel="score increase"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Content to Optimize</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {content.map((item) => (
              <div key={item.id} className="p-4 hover:bg-bg-elevated transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text-primary">{item.title}</h3>
                      <Badge variant={
                        item.status === "completed" ? "success" :
                        item.status === "optimizing" ? "info" : "neutral"
                      }>
                        {item.status === "optimizing" ? `${item.progress}%` : item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted mb-2">{item.url}</p>
                    
                    {/* Issues */}
                    {item.status !== "completed" && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.issues.map((issue, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded bg-warning/10 text-warning">
                            {issue}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Progress bar for optimizing */}
                    {item.status === "optimizing" && (
                      <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {formatNumber(item.traffic)} traffic
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {item.keywords} keywords
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold",
                        item.currentScore >= 80 ? "bg-success/10 text-success" :
                        item.currentScore >= 60 ? "bg-warning/10 text-warning" : "bg-error/10 text-error"
                      )}>
                        {item.currentScore}
                      </div>
                      <p className="text-xs text-text-muted mt-1">Current</p>
                    </div>
                    {item.status !== "completed" && (
                      <>
                        <span className="text-text-muted">→</span>
                        <div className="text-center">
                          <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold bg-success/10 text-success">
                            {item.potentialScore}
                          </div>
                          <p className="text-xs text-text-muted mt-1">Potential</p>
                        </div>
                      </>
                    )}
                    
                    {/* Action */}
                    <div className="ml-4">
                      {item.status === "pending" && (
                        <Button variant="accent" size="sm" onClick={() => startOptimization(item.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Optimize
                        </Button>
                      )}
                      {item.status === "optimizing" && (
                        <Button variant="secondary" size="sm">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      {item.status === "completed" && (
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1 text-success" />
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
