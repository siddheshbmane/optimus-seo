"use client";

import * as React from "react";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  MessageSquare,
  Clock,
  Users,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReputationScore } from "@/agents/review-response-agent";

interface ReputationScoreCardProps {
  score: ReputationScore;
  className?: string;
}

export function ReputationScoreCard({ score, className }: ReputationScoreCardProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-500 bg-green-500/10';
    if (grade.startsWith('B')) return 'text-blue-500 bg-blue-500/10';
    if (grade.startsWith('C')) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  const getTrendIcon = () => {
    switch (score.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const breakdownItems = [
    { label: 'Review Volume', value: score.breakdown.reviewVolume, icon: Users },
    { label: 'Avg Rating', value: score.breakdown.avgRating, icon: Star },
    { label: 'Sentiment', value: score.breakdown.sentimentScore, icon: BarChart2 },
    { label: 'Response Rate', value: score.breakdown.responseRate, icon: MessageSquare },
    { label: 'Response Time', value: score.breakdown.responseTime, icon: Clock },
    { label: 'Review Recency', value: score.breakdown.reviewRecency, icon: Clock },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Reputation Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          {/* Main Score */}
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${score.overall * 3.52} 352`}
                className={cn(
                  score.overall >= 80 ? 'text-green-500' :
                  score.overall >= 60 ? 'text-yellow-500' : 'text-red-500'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score.overall}</span>
              <span className="text-xs text-muted-foreground">out of 100</span>
            </div>
          </div>

          {/* Grade & Trend */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("text-4xl font-bold px-4 py-2 rounded-lg", getGradeColor(score.grade))}>
                {score.grade}
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className="text-sm capitalize">{score.trend}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={score.benchmarkComparison >= 0 ? 'success' : 'error'}>
                {score.benchmarkComparison >= 0 ? '+' : ''}{score.benchmarkComparison}% vs industry
              </Badge>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Score Breakdown</p>
          {breakdownItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">{item.label}</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all", getScoreColor(item.value))}
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ReputationScoreCard;
