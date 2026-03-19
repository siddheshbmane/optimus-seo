"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ThumbsUp,
  ThumbsDown,
  Meh,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { SentimentTrend, SentimentDataPoint, PlatformSentiment } from "@/agents/review-response-agent";

interface SentimentChartProps {
  trend: SentimentTrend;
  className?: string;
}

export function SentimentChart({ trend, className }: SentimentChartProps) {
  const COLORS = {
    positive: '#22c55e',
    neutral: '#eab308',
    negative: '#ef4444',
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return <ThumbsUp className="h-5 w-5 text-green-500" />;
    if (score < -0.3) return <ThumbsDown className="h-5 w-5 text-red-500" />;
    return <Meh className="h-5 w-5 text-yellow-500" />;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  // Calculate sentiment distribution for pie chart
  const sentimentDistribution = [
    { name: 'Positive', value: trend.sentimentOverTime.filter(d => d.sentiment > 0.3).length },
    { name: 'Neutral', value: trend.sentimentOverTime.filter(d => d.sentiment >= -0.3 && d.sentiment <= 0.3).length },
    { name: 'Negative', value: trend.sentimentOverTime.filter(d => d.sentiment < -0.3).length },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                <div className="flex items-center gap-2 mt-1">
                  {getSentimentIcon(trend.overallSentiment)}
                  <span className="text-2xl font-bold">
                    {getSentimentLabel(trend.overallSentiment)}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Score: {(trend.overallSentiment * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volume Change</p>
                <p className="text-2xl font-bold">{trend.volumeChange > 0 ? '+' : ''}{trend.volumeChange}%</p>
              </div>
              {getChangeIcon(trend.volumeChange)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">vs previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating Change</p>
                <p className="text-2xl font-bold">{trend.ratingChange > 0 ? '+' : ''}{trend.ratingChange}</p>
              </div>
              {getChangeIcon(trend.ratingChange)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">avg rating change</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{trend.responseRateChange > 0 ? '+' : ''}{trend.responseRateChange}%</p>
              </div>
              {getChangeIcon(trend.responseRateChange)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.sentimentOverTime}>
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#eab308" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[-1, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Sentiment']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="sentiment"
                  stroke="#22c55e"
                  fill="url(#sentimentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Distribution & Platform Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {sentimentDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[item.name.toLowerCase() as keyof typeof COLORS] }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trend.sentimentByPlatform.map((platform, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 capitalize font-medium">{platform.platform}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          platform.sentiment > 0.3 ? "bg-green-500" :
                          platform.sentiment < -0.3 ? "bg-red-500" : "bg-yellow-500"
                        )}
                        style={{ width: `${((platform.sentiment + 1) / 2) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-medium">{platform.avgRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground"> / 5</span>
                  </div>
                  <Badge variant="neutral" className="w-16 justify-center">
                    {platform.reviewCount}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Topics */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              Top Positive Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trend.topPositiveTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-green-500/5">
                  <span className="font-medium">{topic.name}</span>
                  <Badge variant="success">{topic.mentions} mentions</Badge>
                </div>
              ))}
              {trend.topPositiveTopics.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No positive topics found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsDown className="h-5 w-5 text-red-500" />
              Top Negative Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trend.topNegativeTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5">
                  <span className="font-medium">{topic.name}</span>
                  <Badge variant="error">{topic.mentions} mentions</Badge>
                </div>
              ))}
              {trend.topNegativeTopics.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No negative topics found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trend.insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border",
                  insight.type === 'improvement' && "bg-green-500/5 border-green-500/20",
                  insight.type === 'decline' && "bg-red-500/5 border-red-500/20",
                  insight.type === 'opportunity' && "bg-blue-500/5 border-blue-500/20",
                  insight.type === 'alert' && "bg-yellow-500/5 border-yellow-500/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{insight.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                  <Badge
                    className={cn(
                      insight.type === 'improvement' && "bg-green-500/10 text-green-500",
                      insight.type === 'decline' && "bg-red-500/10 text-red-500",
                      insight.type === 'opportunity' && "bg-blue-500/10 text-blue-500",
                      insight.type === 'alert' && "bg-yellow-500/10 text-yellow-500"
                    )}
                  >
                    {insight.change > 0 ? '+' : ''}{insight.change}%
                  </Badge>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-medium">Recommendation:</span> {insight.recommendation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SentimentChart;
