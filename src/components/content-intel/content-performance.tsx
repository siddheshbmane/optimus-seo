"use client";

import * as React from "react";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  DollarSign,
  Users,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { ContentPerformance as ContentPerformanceType } from "@/agents/content-intel-agent";

interface ContentPerformanceProps {
  topPerformers: ContentPerformanceType[];
  underperformers: ContentPerformanceType[];
  trendData?: { date: string; traffic: number; conversions: number }[];
}

export function ContentPerformance({
  topPerformers,
  underperformers,
  trendData,
}: ContentPerformanceProps) {
  // Generate mock trend data if not provided
  const chartData = trendData || [
    { date: "Jan", traffic: 12500, conversions: 180 },
    { date: "Feb", traffic: 14200, conversions: 210 },
    { date: "Mar", traffic: 13800, conversions: 195 },
    { date: "Apr", traffic: 15600, conversions: 245 },
    { date: "May", traffic: 17200, conversions: 280 },
    { date: "Jun", traffic: 19500, conversions: 320 },
  ];

  const totalTraffic = topPerformers.reduce((sum, p) => sum + p.traffic, 0);
  const totalConversions = topPerformers.reduce((sum, p) => sum + p.conversions, 0);
  const avgBounceRate = Math.round(
    topPerformers.reduce((sum, p) => sum + p.bounceRate, 0) / topPerformers.length
  );
  const avgTimeOnPage = Math.round(
    topPerformers.reduce((sum, p) => sum + p.avgTimeOnPage, 0) / topPerformers.length
  );

  const getChangeIndicator = (value: number, isPositive: boolean = true) => {
    const isUp = value > 0;
    const color = (isUp && isPositive) || (!isUp && !isPositive) ? "text-green-500" : "text-red-500";
    const Icon = isUp ? ArrowUpRight : ArrowDownRight;
    return (
      <span className={cn("flex items-center gap-1 text-sm", color)}>
        <Icon className="h-4 w-4" />
        {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Traffic</p>
                <p className="text-2xl font-bold">{formatNumber(totalTraffic)}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-2">{getChangeIndicator(12.5)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">{formatNumber(totalConversions)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-2">{getChangeIndicator(8.3)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Bounce Rate</p>
                <p className="text-2xl font-bold">{avgBounceRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <MousePointer className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-2">{getChangeIndicator(-3.2, false)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Time on Page</p>
                <p className="text-2xl font-bold">{Math.floor(avgTimeOnPage / 60)}:{(avgTimeOnPage % 60).toString().padStart(2, '0')}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-2">{getChangeIndicator(5.8)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic & Conversions Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Traffic & Conversions Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="traffic"
                  stroke="hsl(var(--primary))"
                  fill="url(#trafficGradient)"
                  name="Traffic"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversions"
                  stroke="#22c55e"
                  fill="url(#conversionsGradient)"
                  name="Conversions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers & Underperformers */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Performing Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((content, index) => (
                <div key={index} className="p-4 rounded-lg border hover:bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{content.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{content.url}</p>
                    </div>
                    <Badge variant="success" className="ml-2">
                      {content.contentScore}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Traffic</p>
                      <p className="text-sm font-medium">{formatNumber(content.traffic)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                      <p className="text-sm font-medium">{content.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Backlinks</p>
                      <p className="text-sm font-medium">{content.backlinks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Shares</p>
                      <p className="text-sm font-medium">{formatNumber(content.socialShares)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Underperforming Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {underperformers.map((content, index) => (
                <div key={index} className="p-4 rounded-lg border hover:bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{content.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{content.url}</p>
                    </div>
                    <Badge variant="error" className="ml-2">
                      {content.contentScore}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Traffic</p>
                      <p className="text-sm font-medium text-red-500">{formatNumber(content.traffic)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Bounce</p>
                      <p className="text-sm font-medium text-red-500">{content.bounceRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium text-red-500">{content.avgTimeOnPage}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Updated</p>
                      <p className="text-sm font-medium text-yellow-500">{content.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="warning" className="text-xs">Needs Update</Badge>
                    {content.bounceRate > 70 && (
                      <Badge variant="error" className="text-xs">High Bounce</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content ROI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Content ROI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topPerformers.map((p) => ({
                  title: p.title.slice(0, 20) + "...",
                  traffic: p.traffic,
                  conversions: p.conversions * 50, // Estimated value per conversion
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="title" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="traffic" fill="hsl(var(--primary))" name="Traffic" />
                <Bar dataKey="conversions" fill="#22c55e" name="Est. Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContentPerformance;
