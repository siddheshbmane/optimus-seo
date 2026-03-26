"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  FileText,
  Users,
  Target,
  BarChart3,
  Eye,
  MapPin,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/contexts/project-context";
import { formatNumber, cn } from "@/lib/utils";

const salesTools = [
  {
    id: "site-audit",
    name: "Site Audit",
    description: "Comprehensive technical SEO analysis",
    icon: Search,
    href: "site-audit",
    status: "ready",
    lastRun: "2 hours ago",
    issues: 23,
  },
  {
    id: "keyword-research",
    name: "Keyword Research",
    description: "Discover high-value keyword opportunities",
    icon: Target,
    href: "keyword-research",
    status: "ready",
    lastRun: "1 day ago",
    keywords: 847,
  },
  {
    id: "competitor-analysis",
    name: "Competitor Analysis",
    description: "Analyze competitor SEO strategies",
    icon: Users,
    href: "competitor-analysis",
    status: "ready",
    lastRun: "3 days ago",
    competitors: 5,
  },
  {
    id: "pitch-deck",
    name: "Pitch Deck",
    description: "AI-generated sales presentations",
    icon: FileText,
    href: "pitch-deck",
    status: "ready",
    lastRun: "1 week ago",
    decks: 3,
  },
  {
    id: "ppc-intelligence",
    name: "PPC Intelligence",
    description: "Paid search insights and opportunities",
    icon: BarChart3,
    href: "ppc-intelligence",
    status: "ready",
    lastRun: "5 days ago",
    spend: 12500,
  },
  {
    id: "ai-visibility",
    name: "AI Visibility",
    description: "Track AI search engine presence",
    icon: Eye,
    href: "ai-visibility",
    status: "beta",
    lastRun: "Never",
    score: null,
  },
  {
    id: "gmb-analysis",
    name: "GMB Analysis",
    description: "Google Business Profile optimization",
    icon: MapPin,
    href: "gmb-analysis",
    status: "ready",
    lastRun: "2 days ago",
    score: 78,
  },
  {
    id: "proposal-generator",
    name: "Proposal Generator",
    description: "Create winning SEO proposals",
    icon: FileSpreadsheet,
    href: "proposal-generator",
    status: "ready",
    lastRun: "4 days ago",
    proposals: 2,
  },
  {
    id: "youtube-seo",
    name: "YouTube SEO",
    description: "Optimize video content for search",
    icon: Eye,
    href: "youtube-seo",
    status: "ready",
    lastRun: "1 day ago",
    videos: 24,
  },
  {
    id: "ecommerce-seo",
    name: "E-commerce SEO",
    description: "Product & category optimization",
    icon: Target,
    href: "ecommerce-seo",
    status: "ready",
    lastRun: "3 days ago",
    products: 156,
  },
  {
    id: "social-intelligence",
    name: "Social Intelligence",
    description: "Brand mentions & review monitoring",
    icon: Users,
    href: "social-intelligence",
    status: "ready",
    lastRun: "1 hour ago",
    mentions: 324,
  },
  {
    id: "multi-search",
    name: "Multi-Search Tracking",
    description: "Rankings across 6 search engines",
    icon: Globe,
    href: "multi-search",
    status: "ready",
    lastRun: "2 hours ago",
    engines: 6,
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Site Audit completed",
    details: "Found 23 issues (5 critical, 8 warnings)",
    time: "2 hours ago",
    status: "warning",
  },
  {
    id: 2,
    action: "Keyword Research updated",
    details: "Added 156 new keyword opportunities",
    time: "1 day ago",
    status: "success",
  },
  {
    id: 3,
    action: "Competitor Analysis running",
    details: "Analyzing 5 competitors",
    time: "In progress",
    status: "running",
  },
  {
    id: 4,
    action: "Pitch Deck generated",
    details: "Q1 2026 SEO Strategy Deck",
    time: "1 week ago",
    status: "success",
  },
];

export default function SalesOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const { project } = useProjectContext();

  // Project is guaranteed by layout, but TypeScript needs this check
  if (!project) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Sales Tools</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Research and analysis tools to win new clients
          </p>
        </div>
        <Button
          variant="accent"
          className="w-full sm:w-auto"
          onClick={() => router.push(`/projects/${projectId}/sales/site-audit`)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Run Full Analysis
        </Button>
      </div>

      {/* Quick Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Health Score"
          value={`${project.healthScore}/100`}
          trend={5.2}
          trendLabel="vs last audit"
          icon={<CheckCircle className="h-4 sm:h-5 w-4 sm:w-5" />}
        />
        <StatCard
          label="Issues"
          value="23"
          trend={-15}
          trendLabel="vs last audit"
          icon={<AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5" />}
        />
        <StatCard
          label="Keywords"
          value={formatNumber(project.keywords)}
          trend={18.5}
          trendLabel="new this month"
          icon={<Target className="h-4 sm:h-5 w-4 sm:w-5" />}
        />
        <StatCard
          label="Competitor Gap"
          value="34%"
          trendLabel="to capture"
          icon={<Users className="h-4 sm:h-5 w-4 sm:w-5" />}
          variant="accent"
        />
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">
          Sales Tools
        </h2>
        {/* Mobile: List view, Desktop: Grid view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {salesTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/projects/${projectId}/sales/${tool.href}`}
            >
              <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-3 sm:p-4">
                  {/* Mobile: Horizontal layout */}
                  <div className="flex items-center gap-3 sm:block">
                    <div className="h-10 w-10 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 sm:mb-3">
                      <tool.icon className="h-5 w-5 text-accent" />
                    </div>
                    
                    <div className="flex-1 min-w-0 sm:block">
                      <div className="flex items-center justify-between sm:justify-start gap-2 sm:mb-1">
                        <h3 className="font-medium text-sm sm:text-base text-text-primary truncate">
                          {tool.name}
                        </h3>
                        {tool.status === "beta" && (
                          <Badge variant="info" className="text-[10px] sm:text-xs flex-shrink-0">Beta</Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-text-muted line-clamp-1 sm:line-clamp-2 sm:mb-3">
                        {tool.description}
                      </p>
                      <div className="hidden sm:flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tool.lastRun}
                        </span>
                        <ArrowRight className="h-4 w-4 text-text-muted" />
                      </div>
                    </div>
                    
                    {/* Mobile: Chevron */}
                    <ChevronRight className="h-5 w-5 text-text-muted sm:hidden flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 sm:space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-bg-elevated"
              >
                <div
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    activity.status === "success" && "bg-success/10",
                    activity.status === "warning" && "bg-warning/10",
                    activity.status === "running" && "bg-info/10"
                  )}
                >
                  {activity.status === "success" && (
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                  )}
                  {activity.status === "warning" && (
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
                  )}
                  {activity.status === "running" && (
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-info animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-xs sm:text-sm text-text-primary truncate">
                      {activity.action}
                    </p>
                    <span className="text-[10px] sm:text-xs text-text-muted whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary truncate sm:whitespace-normal">
                    {activity.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
