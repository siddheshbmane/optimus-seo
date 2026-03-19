"use client";

import * as React from "react";
import {
  Globe,
  Search,
  TrendingUp,
  FileText,
  Image,
  Video,
  MessageSquare,
  Star,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart2,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { SERPContentAnalysis, SERPFeature, SERPResult } from "@/agents/content-intel-agent";

interface SERPContentAnalysisProps {
  analysis?: SERPContentAnalysis;
  onAnalyze?: (keyword: string) => void;
  isAnalyzing?: boolean;
}

export function SERPContentAnalysisView({
  analysis,
  onAnalyze,
  isAnalyzing = false,
}: SERPContentAnalysisProps) {
  const [keyword, setKeyword] = React.useState("");

  const handleAnalyze = () => {
    if (keyword.trim() && onAnalyze) {
      onAnalyze(keyword.trim());
    }
  };

  const getIntentColor = (intent: string) => {
    const colors = {
      informational: "bg-blue-500/10 text-blue-500",
      navigational: "bg-purple-500/10 text-purple-500",
      transactional: "bg-green-500/10 text-green-500",
      commercial: "bg-orange-500/10 text-orange-500",
    };
    return colors[intent as keyof typeof colors] || "bg-gray-500/10 text-gray-500";
  };

  const getOpportunityColor = (opportunity: string) => {
    const colors = {
      high: "text-green-500",
      medium: "text-yellow-500",
      low: "text-gray-500",
    };
    return colors[opportunity as keyof typeof colors] || "text-gray-500";
  };

  const getFeatureIcon = (type: string) => {
    const icons = {
      "featured-snippet": Star,
      "people-also-ask": MessageSquare,
      video: Video,
      image: Image,
      "local-pack": Globe,
      "knowledge-panel": FileText,
      shopping: Target,
    };
    return icons[type as keyof typeof icons] || Globe;
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SERP Content Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter keyword to analyze SERP content..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !keyword.trim()}>
              {isAnalyzing ? "Analyzing..." : "Analyze SERP"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge className={cn("mb-2", getIntentColor(analysis.searchIntent))}>
                    {analysis.searchIntent}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Search Intent</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{analysis.avgWordCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Avg Word Count</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{analysis.avgHeadings}</p>
                  <p className="text-sm text-muted-foreground">Avg Headings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{analysis.avgImages}</p>
                  <p className="text-sm text-muted-foreground">Avg Images</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{analysis.avgVideos}</p>
                  <p className="text-sm text-muted-foreground">Avg Videos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SERP Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                SERP Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {analysis.serpFeatures.map((feature, index) => {
                  const Icon = getFeatureIcon(feature.type);
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        feature.present ? "bg-green-500/5 border-green-500/20" : "bg-muted/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium capitalize">
                            {feature.type.replace("-", " ")}
                          </span>
                        </div>
                        {feature.present ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">Opportunity:</span>
                        <span className={cn("text-sm font-medium", getOpportunityColor(feature.opportunity))}>
                          {feature.opportunity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{feature.recommendation}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Results Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Top Results Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.topResults}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="position" tickFormatter={(v) => `#${v}`} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="wordCount" fill="hsl(var(--primary))" name="Word Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Words</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Headings</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Images</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">DA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.topResults.map((result, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <Badge>#{result.position}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm truncate max-w-xs">{result.title}</p>
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                            >
                              {new URL(result.url).hostname}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{result.wordCount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{result.headings}</td>
                        <td className="px-4 py-3 text-sm">{result.images}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "font-semibold",
                            result.contentScore >= 80 ? "text-green-500" :
                            result.contentScore >= 60 ? "text-yellow-500" : "text-red-500"
                          )}>
                            {result.contentScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{result.domainAuthority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Content Patterns */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Content Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.contentPatterns.map((pattern, index) => (
                    <div key={index} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{pattern.pattern}</span>
                        <Badge
                          className={cn(
                            pattern.importance === "high" ? "bg-green-500/10 text-green-500" :
                            pattern.importance === "medium" ? "bg-yellow-500/10 text-yellow-500" :
                            "bg-gray-500/10 text-gray-500"
                          )}
                        >
                          {pattern.importance}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Used by {pattern.frequency}/5 top results
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: {pattern.example}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Topics & Content Gaps */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Topics Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.commonTopics.map((topic, index) => (
                    <Badge key={index}>
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Content Gaps (Opportunities)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.contentGaps.map((gap, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{gap}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default SERPContentAnalysisView;
