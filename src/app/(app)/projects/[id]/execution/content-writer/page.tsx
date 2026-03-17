"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  PenTool,
  Plus,
  Play,
  Pause,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Sparkles,
  Eye,
  Edit,
  Download,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

const writingTasks = [
  {
    id: 1,
    title: "Complete Guide to Technical SEO in 2026",
    type: "Pillar Page",
    targetKeyword: "technical seo guide",
    wordCount: 3500,
    currentWords: 2275,
    status: "writing",
    progress: 65,
    startedAt: "10 min ago",
    estimatedTime: "5 min",
  },
  {
    id: 2,
    title: "Local SEO Checklist for Small Businesses",
    type: "Blog Post",
    targetKeyword: "local seo checklist",
    wordCount: 2200,
    currentWords: 660,
    status: "writing",
    progress: 30,
    startedAt: "3 min ago",
    estimatedTime: "12 min",
  },
  {
    id: 3,
    title: "How to Optimize for Voice Search",
    type: "Blog Post",
    targetKeyword: "voice search optimization",
    wordCount: 2800,
    currentWords: 0,
    status: "queued",
    progress: 0,
    startedAt: null,
    estimatedTime: "15 min",
  },
];

const completedContent = [
  {
    id: 1,
    title: "SEO Trends 2026: What You Need to Know",
    type: "Blog Post",
    wordCount: 2500,
    completedAt: "2 hours ago",
    score: 92,
  },
  {
    id: 2,
    title: "Link Building Strategies That Actually Work",
    type: "Guide",
    wordCount: 3200,
    completedAt: "5 hours ago",
    score: 88,
  },
  {
    id: 3,
    title: "Core Web Vitals Optimization Guide",
    type: "Pillar Page",
    wordCount: 4500,
    completedAt: "1 day ago",
    score: 95,
  },
  {
    id: 4,
    title: "Mobile-First Indexing Explained",
    type: "Blog Post",
    wordCount: 1800,
    completedAt: "2 days ago",
    score: 85,
  },
];

export default function ContentWriterPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  const activeWriting = writingTasks.filter(t => t.status === "writing").length;
  const totalWords = completedContent.reduce((sum, c) => sum + c.wordCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Content Writer</h1>
          <p className="text-text-secondary">
            Generate SEO-optimized content automatically
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Pause className="h-4 w-4 mr-2" />
            Pause All
          </Button>
          <Button variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Currently Writing"
          value={activeWriting}
          trendLabel="articles in progress"
          icon={<PenTool className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Completed Today"
          value={completedContent.length}
          trend={25}
          trendLabel="vs yesterday"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Words Written"
          value={formatNumber(totalWords)}
          trend={18}
          trendLabel="this week"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Content Score"
          value="90"
          trendLabel="out of 100"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Active Writing Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Active Writing</CardTitle>
            <span className="flex items-center gap-1 text-xs text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {writingTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="neutral">{task.type}</Badge>
                      <Badge variant={task.status === "writing" ? "info" : "neutral"}>
                        {task.status === "writing" ? "Writing..." : "Queued"}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-text-primary">{task.title}</h3>
                    <p className="text-sm text-text-muted">Target: {task.targetKeyword}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === "writing" ? (
                      <Button variant="ghost" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {task.status === "writing" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">
                        {formatNumber(task.currentWords)} / {formatNumber(task.wordCount)} words
                      </span>
                      <span className="text-text-muted flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {task.estimatedTime} remaining
                      </span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all animate-pulse"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Completed</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {completedContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 hover:bg-bg-elevated">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{content.title}</p>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Badge variant="neutral">{content.type}</Badge>
                      <span>{formatNumber(content.wordCount)} words</span>
                      <span>•</span>
                      <span>{content.completedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                    content.score >= 90 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {content.score}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
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
