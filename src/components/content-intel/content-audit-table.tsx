"use client";

import * as React from "react";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, formatNumber } from "@/lib/utils";
import type { ContentPerformance, ContentRecommendation } from "@/agents/content-intel-agent";

interface ContentAuditTableProps {
  content: ContentPerformance[];
  recommendations?: ContentRecommendation[];
  onViewContent?: (url: string) => void;
  onEditContent?: (url: string) => void;
  onRefreshContent?: (url: string) => void;
}

export function ContentAuditTable({
  content,
  recommendations = [],
  onViewContent,
  onEditContent,
  onRefreshContent,
}: ContentAuditTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<keyof ContentPerformance>("contentScore");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredContent = React.useMemo(() => {
    let filtered = content.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [content, searchQuery, sortField, sortDirection, statusFilter]);

  const handleSort = (field: keyof ContentPerformance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (status: ContentPerformance["status"]) => {
    const config = {
      excellent: { color: "bg-green-500/10 text-green-500", icon: CheckCircle },
      good: { color: "bg-blue-500/10 text-blue-500", icon: TrendingUp },
      "needs-improvement": { color: "bg-yellow-500/10 text-yellow-500", icon: AlertTriangle },
      poor: { color: "bg-red-500/10 text-red-500", icon: TrendingDown },
    };
    const { color, icon: Icon } = config[status];
    return (
      <Badge className={cn("gap-1", color)}>
        <Icon className="h-3 w-3" />
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Audit
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All Status</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="needs-improvement">Needs Improvement</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Content</th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("contentScore")}
                >
                  <div className="flex items-center gap-1">
                    Score
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("traffic")}
                >
                  <div className="flex items-center gap-1">
                    Traffic
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
                  onClick={() => handleSort("conversions")}
                >
                  <div className="flex items-center gap-1">
                    Conversions
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Last Updated</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {item.url}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("font-semibold", getScoreColor(item.contentScore))}>
                      {item.contentScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatNumber(item.traffic)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatNumber(item.conversions)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.lastUpdated}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewContent?.(item.url)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditContent?.(item.url)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRefreshContent?.(item.url)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Recommendations</h4>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      rec.priority === "high"
                        ? "bg-red-500/10 text-red-500"
                        : rec.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-blue-500/10 text-blue-500"
                    )}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{rec.title}</p>
                      <Badge className="text-xs">
                        {rec.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rec.description}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      Impact: {rec.estimatedImpact}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Take Action
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ContentAuditTable;
