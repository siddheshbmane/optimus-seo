"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Users,
  Target,
  TrendingUp,
  FileText,
  Link2,
  Filter,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, getDifficultyColor, cn } from "@/lib/utils";

const keywordGaps = [
  { keyword: "seo automation tools", volume: 8900, difficulty: 52, competitors: 3, opportunity: "high" },
  { keyword: "ai seo software", volume: 12400, difficulty: 58, competitors: 4, opportunity: "high" },
  { keyword: "enterprise seo platform", volume: 4500, difficulty: 65, competitors: 3, opportunity: "medium" },
  { keyword: "seo reporting dashboard", volume: 3200, difficulty: 42, competitors: 2, opportunity: "high" },
  { keyword: "automated link building", volume: 2800, difficulty: 48, competitors: 3, opportunity: "medium" },
  { keyword: "seo workflow automation", volume: 1900, difficulty: 38, competitors: 2, opportunity: "high" },
  { keyword: "ai content optimization", volume: 6700, difficulty: 55, competitors: 4, opportunity: "medium" },
  { keyword: "seo task management", volume: 1200, difficulty: 32, competitors: 1, opportunity: "high" },
];

const contentGaps = [
  { topic: "AI in SEO: Complete Guide", competitors: 3, avgWords: 4500, opportunity: "high", keywords: 12 },
  { topic: "SEO Automation Best Practices", competitors: 2, avgWords: 3200, opportunity: "high", keywords: 8 },
  { topic: "Enterprise SEO Strategy", competitors: 4, avgWords: 5800, opportunity: "medium", keywords: 15 },
  { topic: "SEO ROI Calculator", competitors: 2, avgWords: 2100, opportunity: "high", keywords: 5 },
  { topic: "Technical SEO Automation", competitors: 3, avgWords: 3800, opportunity: "medium", keywords: 10 },
];

const backlinkGaps = [
  { domain: "techcrunch.com", dr: 94, competitorLinks: 5, yourLinks: 0, type: "Editorial" },
  { domain: "forbes.com", dr: 95, competitorLinks: 3, yourLinks: 1, type: "Guest Post" },
  { domain: "entrepreneur.com", dr: 92, competitorLinks: 4, yourLinks: 0, type: "Editorial" },
  { domain: "inc.com", dr: 91, competitorLinks: 2, yourLinks: 0, type: "Resource" },
  { domain: "businessinsider.com", dr: 94, competitorLinks: 3, yourLinks: 0, type: "Editorial" },
];

export default function CompetitorGapsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  const [activeTab, setActiveTab] = React.useState<"keywords" | "content" | "backlinks">("keywords");

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Competitor Gaps</h1>
          <p className="text-text-secondary">
            Find opportunities your competitors are ranking for
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="accent">
            <Download className="h-4 w-4 mr-2" />
            Export Gaps
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Keyword Gaps"
          value={keywordGaps.length}
          trendLabel="opportunities"
          icon={<Target className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Content Gaps"
          value={contentGaps.length}
          trendLabel="topics to cover"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Backlink Gaps"
          value={backlinkGaps.length}
          trendLabel="link opportunities"
          icon={<Link2 className="h-5 w-5" />}
        />
        <StatCard
          label="Total Potential"
          value={`+${formatNumber(keywordGaps.reduce((sum, k) => sum + k.volume, 0))}`}
          trendLabel="monthly traffic"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-bg-elevated rounded-lg w-fit">
        {(["keywords", "content", "backlinks"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize",
              activeTab === tab
                ? "bg-bg-card text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab} Gaps
          </button>
        ))}
      </div>

      {/* Keyword Gaps */}
      {activeTab === "keywords" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Keyword Gaps</CardTitle>
            <Button variant="accent" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content Ideas
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                    <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Volume</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Difficulty</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Competitors</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Opportunity</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordGaps.map((gap, index) => (
                    <tr key={index} className="border-b border-border hover:bg-bg-elevated">
                      <td className="p-4 font-medium text-text-primary">{gap.keyword}</td>
                      <td className="p-4 text-right font-mono text-text-primary">{formatNumber(gap.volume)}</td>
                      <td className="p-4 text-center">
                        <span className={cn("font-mono font-semibold", getDifficultyColor(gap.difficulty))}>
                          {gap.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-center text-text-primary">{gap.competitors} ranking</td>
                      <td className="p-4 text-center">
                        <Badge variant={gap.opportunity === "high" ? "success" : "warning"}>
                          {gap.opportunity}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Gaps */}
      {activeTab === "content" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Content Gaps</CardTitle>
            <Button variant="accent" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Briefs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentGaps.map((gap, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary mb-1">{gap.topic}</h3>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span>{gap.competitors} competitors</span>
                      <span>~{formatNumber(gap.avgWords)} words avg</span>
                      <span>{gap.keywords} keywords</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={gap.opportunity === "high" ? "success" : "warning"}>
                      {gap.opportunity} opportunity
                    </Badge>
                    <Button variant="accent" size="sm">
                      Create Brief
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backlink Gaps */}
      {activeTab === "backlinks" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Backlink Gaps</CardTitle>
            <Button variant="accent" size="sm">
              <Link2 className="h-4 w-4 mr-2" />
              Start Outreach
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Domain</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">DR</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Competitor Links</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Your Links</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Type</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {backlinkGaps.map((gap, index) => (
                    <tr key={index} className="border-b border-border hover:bg-bg-elevated">
                      <td className="p-4 font-medium text-text-primary">{gap.domain}</td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-semibold text-success">{gap.dr}</span>
                      </td>
                      <td className="p-4 text-center text-text-primary">{gap.competitorLinks}</td>
                      <td className="p-4 text-center">
                        <Badge variant={gap.yourLinks > 0 ? "success" : "error"}>
                          {gap.yourLinks}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="neutral">{gap.type}</Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Button variant="accent" size="sm">
                          Outreach
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
