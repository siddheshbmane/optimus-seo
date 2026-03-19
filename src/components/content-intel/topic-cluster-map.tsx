"use client";

import * as React from "react";
import {
  Layers,
  CheckCircle,
  AlertTriangle,
  Circle,
  TrendingUp,
  Target,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import type { TopicCluster, Subtopic } from "@/agents/content-intel-agent";

interface TopicClusterMapProps {
  clusters: TopicCluster[];
  onCreateContent?: (topic: string) => void;
  onViewContent?: (url: string) => void;
}

export function TopicClusterMap({
  clusters,
  onCreateContent,
  onViewContent,
}: TopicClusterMapProps) {
  const [expandedClusters, setExpandedClusters] = React.useState<Set<string>>(
    new Set(clusters.map((c) => c.id))
  );

  const toggleCluster = (id: string) => {
    const newExpanded = new Set(expandedClusters);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedClusters(newExpanded);
  };

  const getStatusIcon = (status: Subtopic["status"]) => {
    switch (status) {
      case "covered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "partial":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "missing":
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Subtopic["status"]) => {
    switch (status) {
      case "covered":
        return "bg-green-500/10 text-green-500";
      case "partial":
        return "bg-yellow-500/10 text-yellow-500";
      case "missing":
        return "bg-muted text-muted-foreground";
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "text-green-500";
    if (coverage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{clusters.length}</p>
              <p className="text-sm text-muted-foreground">Topic Clusters</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {clusters.reduce((sum, c) => sum + c.subtopics.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Subtopics</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {formatNumber(clusters.reduce((sum, c) => sum + c.totalSearchVolume, 0))}
              </p>
              <p className="text-sm text-muted-foreground">Total Search Volume</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {Math.round(clusters.reduce((sum, c) => sum + c.coverage, 0) / clusters.length)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Coverage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cluster Cards */}
      {clusters.map((cluster) => (
        <Card key={cluster.id}>
          <CardHeader className="cursor-pointer" onClick={() => toggleCluster(cluster.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {expandedClusters.has(cluster.id) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <Layers className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{cluster.pillarTopic}</CardTitle>
                  {cluster.pillarUrl && (
                    <a
                      href={cluster.pillarUrl}
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cluster.pillarUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Coverage</p>
                  <p className={cn("text-xl font-bold", getCoverageColor(cluster.coverage))}>
                    {cluster.coverage}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Search Volume</p>
                  <p className="text-xl font-bold">{formatNumber(cluster.totalSearchVolume)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Authority</p>
                  <p className="text-xl font-bold">{cluster.authority}</p>
                </div>
              </div>
            </div>
          </CardHeader>

          {expandedClusters.has(cluster.id) && (
            <CardContent>
              {/* Coverage Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Topic Coverage</span>
                  <span className="text-sm font-medium">{cluster.coverage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      cluster.coverage >= 80 ? "bg-green-500" :
                      cluster.coverage >= 50 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${cluster.coverage}%` }}
                  />
                </div>
              </div>

              {/* Subtopics Table */}
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Subtopic</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Search Volume</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Difficulty</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Content Score</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cluster.subtopics.map((subtopic, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(subtopic.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(subtopic.status)}
                              {subtopic.status}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm">{subtopic.topic}</p>
                            {subtopic.url && (
                              <a
                                href={subtopic.url}
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                {subtopic.url}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatNumber(subtopic.searchVolume)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full",
                                  subtopic.difficulty <= 30 ? "bg-green-500" :
                                  subtopic.difficulty <= 60 ? "bg-yellow-500" : "bg-red-500"
                                )}
                                style={{ width: `${subtopic.difficulty}%` }}
                              />
                            </div>
                            <span className="text-sm">{subtopic.difficulty}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {subtopic.contentScore !== undefined ? (
                            <span className={cn(
                              "font-semibold",
                              subtopic.contentScore >= 80 ? "text-green-500" :
                              subtopic.contentScore >= 60 ? "text-yellow-500" : "text-red-500"
                            )}>
                              {subtopic.contentScore}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {subtopic.status === "missing" ? (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => onCreateContent?.(subtopic.topic)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Create
                            </Button>
                          ) : subtopic.status === "partial" ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => subtopic.url && onViewContent?.(subtopic.url)}
                            >
                              Improve
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => subtopic.url && onViewContent?.(subtopic.url)}
                            >
                              View
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cluster Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Covered</span>
                  </div>
                  <p className="text-2xl font-bold text-green-500 mt-1">
                    {cluster.subtopics.filter((s) => s.status === "covered").length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Partial</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-500 mt-1">
                    {cluster.subtopics.filter((s) => s.status === "partial").length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Missing</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">
                    {cluster.subtopics.filter((s) => s.status === "missing").length}
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

export default TopicClusterMap;
