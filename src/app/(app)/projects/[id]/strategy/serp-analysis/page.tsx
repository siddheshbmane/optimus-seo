"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Target,
  TrendingUp,
  FileText,
  Image,
  Video,
  ShoppingBag,
  MapPin,
  HelpCircle,
  Star,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProjectContext } from "@/contexts/project-context";
import { useSERPData } from "@/hooks/use-seo-data";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";

const serpFeatures = [
  { name: "Featured Snippet", icon: FileText, count: 12, opportunity: 8 },
  { name: "People Also Ask", icon: HelpCircle, count: 45, opportunity: 23 },
  { name: "Image Pack", icon: Image, count: 18, opportunity: 12 },
  { name: "Video Results", icon: Video, count: 8, opportunity: 5 },
  { name: "Local Pack", icon: MapPin, count: 15, opportunity: 10 },
  { name: "Shopping Results", icon: ShoppingBag, count: 6, opportunity: 3 },
  { name: "Reviews", icon: Star, count: 22, opportunity: 15 },
];

const serpAnalysis = [
  {
    keyword: "seo services",
    volume: 14800,
    position: 3,
    features: ["Featured Snippet", "People Also Ask", "Local Pack"],
    competitors: [
      { name: "Moz", position: 1 },
      { name: "Ahrefs", position: 2 },
      { name: "SEMrush", position: 4 },
    ],
    opportunity: "Featured Snippet",
  },
  {
    keyword: "technical seo audit",
    volume: 5600,
    position: 2,
    features: ["People Also Ask", "Video Results"],
    competitors: [
      { name: "Screaming Frog", position: 1 },
      { name: "Sitebulb", position: 3 },
    ],
    opportunity: "Video Results",
  },
  {
    keyword: "local seo optimization",
    volume: 6700,
    position: 5,
    features: ["Local Pack", "People Also Ask", "Reviews"],
    competitors: [
      { name: "BrightLocal", position: 1 },
      { name: "Whitespark", position: 2 },
      { name: "Moz Local", position: 3 },
    ],
    opportunity: "Local Pack",
  },
  {
    keyword: "link building strategies",
    volume: 8900,
    position: 4,
    features: ["Featured Snippet", "People Also Ask", "Image Pack"],
    competitors: [
      { name: "Backlinko", position: 1 },
      { name: "Ahrefs", position: 2 },
      { name: "Neil Patel", position: 3 },
    ],
    opportunity: "Featured Snippet",
  },
];

const paaQuestions = [
  { question: "What is technical SEO?", keyword: "technical seo", volume: 2400 },
  { question: "How much do SEO services cost?", keyword: "seo services cost", volume: 1800 },
  { question: "Is SEO worth it for small business?", keyword: "seo small business", volume: 1200 },
  { question: "How long does SEO take to work?", keyword: "seo timeline", volume: 2100 },
  { question: "What are the best SEO tools?", keyword: "best seo tools", volume: 3400 },
];

export default function SerpAnalysisPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  const [searchKeyword, setSearchKeyword] = React.useState("");

  // Fetch SERP data from API (with mock fallback)
  const defaultKeywords = React.useMemo(() => serpAnalysis.map(s => s.keyword), []);
  const { isLoading: serpLoading, source: serpSource, refetch: refetchSerp } = useSERPData(defaultKeywords);

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">SERP Analysis</h1>
            <DataSourceIndicator source={serpSource} isLoading={serpLoading} onRefresh={refetchSerp} compact />
          </div>
          <p className="text-text-secondary">
            Analyze search results and find SERP feature opportunities
          </p>
        </div>
        <Button variant="accent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Enter keyword to analyze SERP..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="accent">Analyze SERP</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Keywords Analyzed"
          value={serpAnalysis.length}
          trendLabel="tracked keywords"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="SERP Features"
          value={serpFeatures.reduce((sum, f) => sum + f.count, 0)}
          trendLabel="total appearances"
          icon={<Search className="h-5 w-5" />}
        />
        <StatCard
          label="Opportunities"
          value={serpFeatures.reduce((sum, f) => sum + f.opportunity, 0)}
          trendLabel="feature opportunities"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="PAA Questions"
          value={paaQuestions.length}
          trendLabel="to target"
          icon={<HelpCircle className="h-5 w-5" />}
        />
      </div>

      {/* SERP Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>SERP Features Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {serpFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg bg-bg-elevated">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-sm font-medium text-text-primary mb-1">{feature.name}</p>
                  <p className="text-2xl font-bold text-text-primary">{feature.count}</p>
                  <p className="text-xs text-success">+{feature.opportunity} opportunities</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword SERP Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Keyword SERP Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serpAnalysis.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-bg-elevated">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-text-primary">{item.keyword}</h3>
                      <p className="text-sm text-text-muted">{formatNumber(item.volume)} monthly searches</p>
                    </div>
                    <Badge variant="success">#{item.position}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.features.map((feature, i) => (
                      <Badge key={i} variant="neutral" className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-text-muted">
                      Top: {item.competitors.map(c => c.name).join(", ")}
                    </div>
                    <Badge variant="accent">{item.opportunity}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* People Also Ask */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              People Also Ask
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paaQuestions.map((paa, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium text-text-primary">{paa.question}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <Badge variant="neutral">{paa.keyword}</Badge>
                      <span>{formatNumber(paa.volume)} vol</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Target
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
