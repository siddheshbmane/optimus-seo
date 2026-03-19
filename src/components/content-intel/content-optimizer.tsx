"use client";

import * as React from "react";
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  Circle,
  TrendingUp,
  FileText,
  Hash,
  BookOpen,
  Link2,
  Image,
  Target,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { OptimizationSuggestions, OptimizationSuggestion } from "@/agents/content-intel-agent";

interface ContentOptimizerProps {
  suggestions?: OptimizationSuggestions;
  onApplySuggestion?: (suggestion: OptimizationSuggestion) => void;
}

export function ContentOptimizer({
  suggestions,
  onApplySuggestion,
}: ContentOptimizerProps) {
  const [appliedSuggestions, setAppliedSuggestions] = React.useState<Set<string>>(new Set());

  const handleApply = (suggestion: OptimizationSuggestion) => {
    setAppliedSuggestions((prev) => new Set([...prev, suggestion.id]));
    onApplySuggestion?.(suggestion);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "low":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "seo":
        return Target;
      case "readability":
        return BookOpen;
      case "engagement":
        return TrendingUp;
      case "structure":
        return FileText;
      case "keywords":
        return Hash;
      default:
        return Zap;
    }
  };

  if (!suggestions) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Select content to analyze and get optimization suggestions
          </p>
        </CardContent>
      </Card>
    );
  }

  const radarData = [
    { subject: "SEO", score: suggestions.seoScore, fullMark: 100 },
    { subject: "Readability", score: suggestions.readabilityScore, fullMark: 100 },
    { subject: "Engagement", score: suggestions.engagementScore, fullMark: 100 },
    { subject: "Structure", score: suggestions.structureAnalysis.h2Count > 5 ? 80 : 60, fullMark: 100 },
    { subject: "Keywords", score: suggestions.keywordAnalysis.semanticKeywordsUsed > 10 ? 75 : 55, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={cn("text-4xl font-bold", getScoreColor(suggestions.overallScore))}>
                {suggestions.overallScore}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full", getScoreBgColor(suggestions.overallScore))}
                  style={{ width: `${suggestions.overallScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={cn("text-4xl font-bold", getScoreColor(suggestions.seoScore))}>
                {suggestions.seoScore}
              </div>
              <p className="text-sm text-muted-foreground mt-1">SEO Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={cn("text-4xl font-bold", getScoreColor(suggestions.readabilityScore))}>
                {suggestions.readabilityScore}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Readability</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={cn("text-4xl font-bold", getScoreColor(suggestions.engagementScore))}>
                {suggestions.engagementScore}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Engagement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart & Keyword Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis dataKey="subject" className="text-xs" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Keyword Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Target Keyword</span>
                <Badge>{suggestions.keywordAnalysis.targetKeyword}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Density</p>
                  <p className="text-xl font-bold">{suggestions.keywordAnalysis.density}%</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Occurrences</p>
                  <p className="text-xl font-bold">{suggestions.keywordAnalysis.occurrences}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Keyword Placement</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "In Title", value: suggestions.keywordAnalysis.inTitle },
                    { label: "In H1", value: suggestions.keywordAnalysis.inH1 },
                    { label: "In First Paragraph", value: suggestions.keywordAnalysis.inFirstParagraph },
                    { label: "In Meta Description", value: suggestions.keywordAnalysis.inMetaDescription },
                    { label: "In URL", value: suggestions.keywordAnalysis.inUrl },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {item.value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {suggestions.keywordAnalysis.semanticKeywordsMissing.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Missing Semantic Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestions.keywordAnalysis.semanticKeywordsMissing.map((kw, index) => (
                      <Badge key={index} variant="warning" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.suggestions.map((suggestion) => {
              const Icon = getCategoryIcon(suggestion.category);
              const isApplied = appliedSuggestions.has(suggestion.id);

              return (
                <div
                  key={suggestion.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    isApplied ? "bg-green-500/5 border-green-500/20" : "hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-lg", getPriorityColor(suggestion.priority))}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{suggestion.title}</p>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                        <Badge>{suggestion.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      {(suggestion.currentValue || suggestion.suggestedValue) && (
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          {suggestion.currentValue && (
                            <span className="text-muted-foreground">
                              Current: <span className="text-red-500">{suggestion.currentValue}</span>
                            </span>
                          )}
                          {suggestion.suggestedValue && (
                            <span className="text-muted-foreground">
                              Suggested: <span className="text-green-500">{suggestion.suggestedValue}</span>
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-green-500 mt-1">Impact: {suggestion.impact}</p>
                    </div>
                    <Button
                      variant={isApplied ? "ghost" : "secondary"}
                      size="sm"
                      onClick={() => handleApply(suggestion)}
                      disabled={isApplied}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Applied
                        </>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Structure & Readability Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Structure Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {suggestions.structureAnalysis.hasH1 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">Has H1</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">H2 Count</p>
                  <p className="text-xl font-bold">{suggestions.structureAnalysis.h2Count}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">H3 Count</p>
                  <p className="text-xl font-bold">{suggestions.structureAnalysis.h3Count}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Paragraphs</p>
                  <p className="text-xl font-bold">{suggestions.structureAnalysis.paragraphCount}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {suggestions.structureAnalysis.hasImages ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">Has Images ({suggestions.structureAnalysis.imageCount})</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {suggestions.structureAnalysis.hasBulletPoints ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">Bullet Points</span>
                  </div>
                </div>
              </div>
              {suggestions.structureAnalysis.suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Suggestions</p>
                  <ul className="space-y-1">
                    {suggestions.structureAnalysis.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Readability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Flesch Score</p>
                  <p className={cn("text-xl font-bold", getScoreColor(suggestions.readabilityAnalysis.fleschScore))}>
                    {suggestions.readabilityAnalysis.fleschScore}
                  </p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Grade Level</p>
                  <p className="text-xl font-bold">{suggestions.readabilityAnalysis.gradeLevel}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Avg Sentence Length</p>
                  <p className="text-xl font-bold">{suggestions.readabilityAnalysis.avgSentenceLength} words</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Passive Voice</p>
                  <p className={cn(
                    "text-xl font-bold",
                    suggestions.readabilityAnalysis.passiveVoicePercentage > 15 ? "text-yellow-500" : "text-green-500"
                  )}>
                    {suggestions.readabilityAnalysis.passiveVoicePercentage}%
                  </p>
                </div>
              </div>
              {suggestions.readabilityAnalysis.suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Suggestions</p>
                  <ul className="space-y-1">
                    {suggestions.readabilityAnalysis.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Internal Linking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Internal Linking Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Internal Links</p>
              <p className="text-2xl font-bold">{suggestions.internalLinkingAnalysis.internalLinkCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">External Links</p>
              <p className="text-2xl font-bold">{suggestions.internalLinkingAnalysis.externalLinkCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Broken Links</p>
              <p className={cn(
                "text-2xl font-bold",
                suggestions.internalLinkingAnalysis.brokenLinks.length > 0 ? "text-red-500" : "text-green-500"
              )}>
                {suggestions.internalLinkingAnalysis.brokenLinks.length}
              </p>
            </div>
          </div>

          {suggestions.internalLinkingAnalysis.suggestedInternalLinks.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Suggested Internal Links</p>
              <div className="space-y-2">
                {suggestions.internalLinkingAnalysis.suggestedInternalLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{link.targetTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        Anchor: "{link.anchorText}" • {link.context}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{link.relevance}% relevant</Badge>
                      <Button variant="secondary" size="sm">Add Link</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ContentOptimizer;
