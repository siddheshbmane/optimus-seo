"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Eye,
  Bot,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

const aiPlatforms = [
  {
    name: "ChatGPT",
    icon: "🤖",
    visibility: 72,
    change: 8,
    mentions: 45,
    sentiment: "positive",
    lastChecked: "2 hours ago",
  },
  {
    name: "Google SGE",
    icon: "🔍",
    visibility: 58,
    change: -3,
    mentions: 23,
    sentiment: "neutral",
    lastChecked: "1 hour ago",
  },
  {
    name: "Perplexity",
    icon: "💡",
    visibility: 65,
    change: 12,
    mentions: 34,
    sentiment: "positive",
    lastChecked: "3 hours ago",
  },
  {
    name: "Claude",
    icon: "🧠",
    visibility: 48,
    change: 5,
    mentions: 18,
    sentiment: "neutral",
    lastChecked: "4 hours ago",
  },
  {
    name: "Bing Chat",
    icon: "💬",
    visibility: 52,
    change: -2,
    mentions: 21,
    sentiment: "neutral",
    lastChecked: "2 hours ago",
  },
];

const brandMentions = [
  {
    query: "best seo agencies in the US",
    platform: "ChatGPT",
    mentioned: true,
    position: 3,
    context: "Acme Corp is mentioned as a top SEO agency known for technical expertise...",
  },
  {
    query: "how to improve website rankings",
    platform: "Perplexity",
    mentioned: true,
    position: 5,
    context: "According to Acme Corp's blog, the key factors for improving rankings include...",
  },
  {
    query: "seo services for small business",
    platform: "Google SGE",
    mentioned: false,
    position: null,
    context: null,
  },
  {
    query: "technical seo audit checklist",
    platform: "ChatGPT",
    mentioned: true,
    position: 2,
    context: "Acme Corp recommends starting with a comprehensive crawl analysis...",
  },
  {
    query: "link building strategies 2026",
    platform: "Claude",
    mentioned: false,
    position: null,
    context: null,
  },
];

const recommendations = [
  {
    title: "Improve E-E-A-T signals",
    description: "Add more author bios and credentials to your content to improve AI trust signals.",
    impact: "High",
    effort: "Medium",
  },
  {
    title: "Create FAQ schema",
    description: "Add FAQ structured data to help AI systems understand your content better.",
    impact: "Medium",
    effort: "Low",
  },
  {
    title: "Publish original research",
    description: "AI systems prefer citing original data and research. Consider publishing industry studies.",
    impact: "High",
    effort: "High",
  },
  {
    title: "Optimize for conversational queries",
    description: "Rewrite content to answer natural language questions directly.",
    impact: "Medium",
    effort: "Medium",
  },
];

export default function AIVisibilityPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  const avgVisibility = Math.round(aiPlatforms.reduce((sum, p) => sum + p.visibility, 0) / aiPlatforms.length);
  const totalMentions = aiPlatforms.reduce((sum, p) => sum + p.mentions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">AI Visibility</h1>
            <Badge variant="info">Beta</Badge>
          </div>
          <p className="text-text-secondary">
            Track your brand presence in AI-powered search engines
          </p>
        </div>
        <Button variant="accent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Check Visibility
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="AI Visibility Score"
          value={`${avgVisibility}/100`}
          trend={5}
          trendLabel="vs last week"
          icon={<Eye className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Brand Mentions"
          value={totalMentions}
          trend={18}
          trendLabel="this month"
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <StatCard
          label="Platforms Tracked"
          value={aiPlatforms.length}
          trendLabel="AI search engines"
          icon={<Bot className="h-5 w-5" />}
        />
        <StatCard
          label="Positive Sentiment"
          value="78%"
          trend={3}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Platform Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiPlatforms.map((platform) => (
              <div key={platform.name} className="flex items-center gap-4 p-4 rounded-lg bg-bg-elevated">
                <div className="text-3xl">{platform.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">{platform.name}</span>
                      <Badge variant={platform.sentiment === "positive" ? "success" : "neutral"}>
                        {platform.sentiment}
                      </Badge>
                    </div>
                    <span className="text-xs text-text-muted">Last checked: {platform.lastChecked}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-muted">Visibility Score</span>
                        <span className="font-mono text-text-primary">{platform.visibility}/100</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            platform.visibility >= 70 ? "bg-success" : platform.visibility >= 50 ? "bg-warning" : "bg-error"
                          )}
                          style={{ width: `${platform.visibility}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "flex items-center text-sm font-medium",
                        platform.change > 0 ? "text-success" : "text-error"
                      )}>
                        {platform.change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {Math.abs(platform.change)}%
                      </span>
                      <span className="text-xs text-text-muted">{platform.mentions} mentions</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Mentions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Brand Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brandMentions.map((mention, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-text-muted" />
                    <span className="font-medium text-text-primary">&quot;{mention.query}&quot;</span>
                  </div>
                  <Badge variant="neutral">{mention.platform}</Badge>
                </div>
                {mention.mentioned ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <div>
                      <p className="text-sm text-success mb-1">Mentioned at position #{mention.position}</p>
                      <p className="text-sm text-text-secondary">{mention.context}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <p className="text-sm text-warning">Not mentioned in AI response</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Visibility Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start justify-between p-4 rounded-lg bg-bg-elevated">
                <div className="flex-1">
                  <p className="font-medium text-text-primary mb-1">{rec.title}</p>
                  <p className="text-sm text-text-secondary">{rec.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={rec.impact === "High" ? "accent" : "neutral"}>
                    {rec.impact} Impact
                  </Badge>
                  <Badge variant="neutral">{rec.effort} Effort</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
