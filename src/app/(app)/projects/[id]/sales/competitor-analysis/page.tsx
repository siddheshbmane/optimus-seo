"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  Link2,
  Eye,
  BarChart3,
  Plus,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  FileText,
  Swords,
  Lightbulb,
  Mail,
  Copy,
  Check,
  ArrowRight,
  Trophy,
  Zap,
  Globe,
  Bot,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { getProjectById } from "@/data/mock-projects";
import {
  mockCompetitors,
  mockKeywordGaps,
  mockContentGaps,
  mockBacklinkGaps,
  mockSERPBattles,
  mockTrafficTrends,
  yourSiteData,
  getKeywordOverlap,
  getMarketShareData,
  getCompetitorComparison,
  getHighPriorityGaps,
  type Competitor,
  type KeywordGap,
  type ContentGap,
  type BacklinkGap,
  type SERPBattle,
} from "@/data/mock-competitors";
import { formatNumber, getDifficultyColor, cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Area,
  AreaChart,
} from "recharts";

type TabType = "overview" | "keywords" | "content" | "backlinks" | "traffic" | "serp" | "strategy";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "keywords", label: "Keyword Gaps", icon: <Target className="h-4 w-4" /> },
  { id: "content", label: "Content Gaps", icon: <FileText className="h-4 w-4" /> },
  { id: "backlinks", label: "Backlink Gaps", icon: <Link2 className="h-4 w-4" /> },
  { id: "traffic", label: "Traffic Analysis", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "serp", label: "SERP Battles", icon: <Swords className="h-4 w-4" /> },
  { id: "strategy", label: "Strategy", icon: <Lightbulb className="h-4 w-4" /> },
];

const COLORS = ['#FD8C73', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function CompetitorAnalysisPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copiedEmail, setCopiedEmail] = React.useState<string | null>(null);
  
  // Modal states
  const [showAddCompetitor, setShowAddCompetitor] = React.useState(false);
  const [showCompetitorDetail, setShowCompetitorDetail] = React.useState(false);
  const [showKeywordDetail, setShowKeywordDetail] = React.useState(false);
  const [showContentDetail, setShowContentDetail] = React.useState(false);
  const [showBacklinkDetail, setShowBacklinkDetail] = React.useState(false);
  const [showStrategyExport, setShowStrategyExport] = React.useState(false);
  
  // Selected items
  const [selectedCompetitor, setSelectedCompetitor] = React.useState<Competitor | null>(null);
  const [selectedKeyword, setSelectedKeyword] = React.useState<KeywordGap | null>(null);
  const [selectedContent, setSelectedContent] = React.useState<ContentGap | null>(null);
  const [selectedBacklink, setSelectedBacklink] = React.useState<BacklinkGap | null>(null);
  
  // New competitor form
  const [newCompetitorUrl, setNewCompetitorUrl] = React.useState("");

  if (!project) return null;

  const keywordOverlap = getKeywordOverlap();
  const marketShareData = getMarketShareData();
  const comparison = getCompetitorComparison();
  const highPriorityGaps = getHighPriorityGaps();

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "keywords":
        return renderKeywordsTab();
      case "content":
        return renderContentTab();
      case "backlinks":
        return renderBacklinksTab();
      case "traffic":
        return renderTrafficTab();
      case "serp":
        return renderSERPTab();
      case "strategy":
        return renderStrategyTab();
      default:
        return renderOverviewTab();
    }
  };

  // Overview Tab
  const renderOverviewTab = () => {
    const radarData = [
      { metric: 'Domain Rating', you: yourSiteData.domainRating, competitor: comparison.domainRating.avg },
      { metric: 'Traffic (K)', you: yourSiteData.organicTraffic / 1000, competitor: comparison.traffic.avg / 1000 },
      { metric: 'Keywords (K)', you: yourSiteData.keywords / 1000, competitor: comparison.keywords.avg / 1000 },
      { metric: 'Backlinks (K)', you: yourSiteData.backlinks / 1000, competitor: comparison.backlinks.avg / 1000 },
      { metric: 'AI Visibility', you: yourSiteData.aiVisibilityScore, competitor: mockCompetitors.reduce((s, c) => s + c.aiVisibilityScore, 0) / mockCompetitors.length },
    ];

    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Competitors Tracked"
            value={mockCompetitors.length}
            trendLabel="active competitors"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            label="Your Market Share"
            value={`${yourSiteData.marketShare}%`}
            trend={3.2}
            trendLabel="vs last month"
            icon={<Trophy className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            label="Keyword Gaps"
            value={mockKeywordGaps.length}
            trendLabel={`${highPriorityGaps.keywords} high priority`}
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            label="Backlink Opportunities"
            value={mockBacklinkGaps.length}
            trendLabel={`${highPriorityGaps.backlinks} high priority`}
            icon={<Link2 className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Share */}
          <Card>
            <CardHeader>
              <CardTitle>Market Share Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {marketShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Radar */}
          <Card>
            <CardHeader>
              <CardTitle>You vs Competitors (Avg)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <Radar name="You" dataKey="you" stroke="#FD8C73" fill="#FD8C73" fillOpacity={0.5} />
                    <Radar name="Competitors" dataKey="competitor" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competitors Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Competitor Overview</CardTitle>
              <Button variant="accent" size="sm" onClick={() => setShowAddCompetitor(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Competitor
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Competitor</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">DR</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Traffic</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Keywords</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Backlinks</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">AI Score</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Your site row */}
                  <tr className="border-b border-border bg-accent/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <span className="text-accent font-semibold text-sm">You</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">Your Site</p>
                          <p className="text-sm text-text-muted">{project.url}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono font-semibold text-accent">{yourSiteData.domainRating}</span>
                        <span className="flex items-center text-xs text-success">
                          <ArrowUpRight className="h-3 w-3" />
                          {yourSiteData.drChange}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-text-primary">{formatNumber(yourSiteData.organicTraffic)}</span>
                        <span className="flex items-center text-xs text-success">
                          <ArrowUpRight className="h-3 w-3" />
                          {yourSiteData.trafficChange}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-text-primary">{formatNumber(yourSiteData.keywords)}</span>
                        <span className="flex items-center text-xs text-success">
                          <ArrowUpRight className="h-3 w-3" />
                          {yourSiteData.keywordsChange}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-text-primary">{formatNumber(yourSiteData.backlinks)}</span>
                        <span className="flex items-center text-xs text-success">
                          <ArrowUpRight className="h-3 w-3" />
                          {yourSiteData.backlinksChange}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="accent">{yourSiteData.aiVisibilityScore}</Badge>
                    </td>
                    <td className="p-4 text-center font-semibold text-accent">{yourSiteData.marketShare}%</td>
                  </tr>
                  {/* Competitors */}
                  {mockCompetitors.map((competitor) => (
                    <tr
                      key={competitor.id}
                      onClick={() => {
                        setSelectedCompetitor(competitor);
                        setShowCompetitorDetail(true);
                      }}
                      className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                            <span className="text-text-primary font-semibold text-sm">
                              {competitor.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{competitor.name}</p>
                            <a
                              href={`https://${competitor.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-text-muted hover:text-accent flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {competitor.url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono font-semibold text-text-primary">{competitor.domainRating}</span>
                          <span className={cn(
                            "flex items-center text-xs",
                            competitor.drChange > 0 ? "text-success" : competitor.drChange < 0 ? "text-error" : "text-text-muted"
                          )}>
                            {competitor.drChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : competitor.drChange < 0 ? <ArrowDownRight className="h-3 w-3" /> : null}
                            {competitor.drChange !== 0 && Math.abs(competitor.drChange)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono text-text-primary">{formatNumber(competitor.organicTraffic)}</span>
                          <span className={cn(
                            "flex items-center text-xs",
                            competitor.trafficChange > 0 ? "text-success" : "text-error"
                          )}>
                            {competitor.trafficChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(competitor.trafficChange)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono text-text-primary">{formatNumber(competitor.keywords)}</span>
                          <span className={cn(
                            "flex items-center text-xs",
                            competitor.keywordsChange > 0 ? "text-success" : "text-error"
                          )}>
                            {competitor.keywordsChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(competitor.keywordsChange)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono text-text-primary">{formatNumber(competitor.backlinks)}</span>
                          <span className={cn(
                            "flex items-center text-xs",
                            competitor.backlinksChange > 0 ? "text-success" : "text-error"
                          )}>
                            {competitor.backlinksChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(competitor.backlinksChange)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={competitor.aiVisibilityScore >= 70 ? "success" : competitor.aiVisibilityScore >= 50 ? "warning" : "neutral"}>
                          {competitor.aiVisibilityScore}
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-mono">{competitor.marketShare}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  // Keywords Tab
  const renderKeywordsTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Keyword Gaps"
          value={mockKeywordGaps.length}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="High Priority"
          value={highPriorityGaps.keywords}
          icon={<Zap className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Total Gap Volume"
          value={formatNumber(mockKeywordGaps.reduce((s, k) => s + k.volume, 0))}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Difficulty"
          value={Math.round(mockKeywordGaps.reduce((s, k) => s + k.difficulty, 0) / mockKeywordGaps.length)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Keyword Gaps Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Keyword Gap Opportunities</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Volume</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Difficulty</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">CPC</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Your Pos</th>
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Competitors</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Priority</th>
                </tr>
              </thead>
              <tbody>
                {mockKeywordGaps
                  .filter(k => k.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((gap) => (
                  <tr
                    key={gap.keyword}
                    onClick={() => {
                      setSelectedKeyword(gap);
                      setShowKeywordDetail(true);
                    }}
                    className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-medium text-text-primary">{gap.keyword}</td>
                    <td className="p-4 text-center font-mono">{formatNumber(gap.volume)}</td>
                    <td className="p-4 text-center">
                      <span className={cn("font-mono font-semibold", getDifficultyColor(gap.difficulty))}>
                        {gap.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono">${gap.cpc.toFixed(2)}</td>
                    <td className="p-4 text-center font-mono">
                      {gap.yourPosition || <span className="text-text-muted">—</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {gap.competitors.slice(0, 2).map((c) => (
                          <Badge key={c.name} variant="neutral" className="text-xs">
                            {c.name.split(' ')[0]} #{c.position}
                          </Badge>
                        ))}
                        {gap.competitors.length > 2 && (
                          <Badge variant="neutral" className="text-xs">+{gap.competitors.length - 2}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={gap.opportunity === 'high' ? 'success' : gap.opportunity === 'medium' ? 'warning' : 'neutral'}>
                        {gap.opportunity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Content Tab
  const renderContentTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Content Gaps"
          value={mockContentGaps.length}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="High Priority"
          value={highPriorityGaps.content}
          icon={<Zap className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Est. Traffic Potential"
          value={formatNumber(mockContentGaps.reduce((s, c) => s + c.estimatedTraffic, 0))}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Coverage Gap"
          value={`${Math.round(mockContentGaps.reduce((s, c) => s + (c.competitorCoverage - c.yourCoverage), 0) / mockContentGaps.length)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Content Gaps */}
      <Card>
        <CardHeader>
          <CardTitle>Content Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockContentGaps.map((gap) => (
              <div
                key={gap.topic}
                onClick={() => {
                  setSelectedContent(gap);
                  setShowContentDetail(true);
                }}
                className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text-primary">{gap.topic}</h3>
                      <Badge variant={gap.priority === 'high' ? 'success' : gap.priority === 'medium' ? 'warning' : 'neutral'}>
                        {gap.priority}
                      </Badge>
                      <Badge variant="neutral">{gap.contentType}</Badge>
                    </div>
                    <p className="text-sm text-text-muted">Est. traffic: {formatNumber(gap.estimatedTraffic)}/mo</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-text-muted" />
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-muted">Your Coverage</span>
                      <span className="font-medium">{gap.yourCoverage}%</span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${gap.yourCoverage}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-muted">Competitor Coverage</span>
                      <span className="font-medium">{gap.competitorCoverage}%</span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-info rounded-full" style={{ width: `${gap.competitorCoverage}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Backlinks Tab
  const renderBacklinksTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Link Opportunities"
          value={mockBacklinkGaps.length}
          icon={<Link2 className="h-5 w-5" />}
        />
        <StatCard
          label="High Priority"
          value={highPriorityGaps.backlinks}
          icon={<Zap className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Avg. Domain Rating"
          value={Math.round(mockBacklinkGaps.reduce((s, b) => s + b.domainRating, 0) / mockBacklinkGaps.length)}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="With Contact Info"
          value={mockBacklinkGaps.filter(b => b.contactEmail).length}
          icon={<Mail className="h-5 w-5" />}
        />
      </div>

      {/* Backlink Gaps Table */}
      <Card>
        <CardHeader>
          <CardTitle>Backlink Gap Opportunities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Domain</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">DR</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Traffic</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Links to Competitors</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Links to You</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Priority</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Contact</th>
                </tr>
              </thead>
              <tbody>
                {mockBacklinkGaps.map((gap) => (
                  <tr
                    key={gap.domain}
                    onClick={() => {
                      setSelectedBacklink(gap);
                      setShowBacklinkDetail(true);
                    }}
                    className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <a
                        href={`https://${gap.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-text-primary hover:text-accent flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {gap.domain}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "font-mono font-semibold",
                        gap.domainRating >= 80 ? "text-success" : gap.domainRating >= 60 ? "text-warning" : "text-text-primary"
                      )}>
                        {gap.domainRating}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono">{formatNumber(gap.traffic)}</td>
                    <td className="p-4 text-center">
                      <Badge variant="info">{gap.linksToCompetitors}</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={gap.linksToYou > 0 ? "success" : "neutral"}>{gap.linksToYou}</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={gap.outreachPriority === 'high' ? 'success' : gap.outreachPriority === 'medium' ? 'warning' : 'neutral'}>
                        {gap.outreachPriority}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      {gap.contactEmail ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyEmail(gap.contactEmail!);
                          }}
                        >
                          {copiedEmail === gap.contactEmail ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Traffic Tab
  const renderTrafficTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Your Traffic"
          value={formatNumber(yourSiteData.organicTraffic)}
          trend={yourSiteData.trafficChange}
          trendLabel="vs last month"
          icon={<Eye className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Top Competitor"
          value={formatNumber(Math.max(...mockCompetitors.map(c => c.organicTraffic)))}
          icon={<Trophy className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Competitor"
          value={formatNumber(Math.round(mockCompetitors.reduce((s, c) => s + c.organicTraffic, 0) / mockCompetitors.length))}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Traffic Gap"
          value={formatNumber(Math.max(...mockCompetitors.map(c => c.organicTraffic)) - yourSiteData.organicTraffic)}
          trendLabel="to #1 competitor"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Traffic Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Comparison Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrafficTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-bg-primary border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-text-primary mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {formatNumber(entry.value as number)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="you" name="Your Site" stroke="#FD8C73" strokeWidth={3} dot={{ fill: '#FD8C73' }} />
                <Line type="monotone" dataKey="SEO Agency Pro" stroke="#6366F1" strokeWidth={2} />
                <Line type="monotone" dataKey="SearchMaster" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Digital Growth Co" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Growth Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Growth Rate Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Your Site', growth: yourSiteData.trafficChange },
                ...mockCompetitors.map(c => ({ name: c.name, growth: c.trafficChange }))
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="growth" name="Growth %" radius={[4, 4, 0, 0]}>
                  {[yourSiteData, ...mockCompetitors].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // SERP Tab
  const renderSERPTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="SERP Battles"
          value={mockSERPBattles.length}
          icon={<Swords className="h-5 w-5" />}
        />
        <StatCard
          label="Winning"
          value={mockSERPBattles.filter(b => b.yourPosition && b.yourPosition <= 3).length}
          icon={<Trophy className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Improving"
          value={mockSERPBattles.filter(b => b.yourChange > 0).length}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Declining"
          value={mockSERPBattles.filter(b => b.yourChange < 0).length}
          icon={<TrendingDown className="h-5 w-5" />}
        />
      </div>

      {/* SERP Battles */}
      <Card>
        <CardHeader>
          <CardTitle>Head-to-Head SERP Battles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSERPBattles.map((battle) => (
              <div key={battle.keyword} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-text-primary text-lg">{battle.keyword}</h3>
                    <p className="text-sm text-text-muted">Volume: {formatNumber(battle.volume)}/mo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {battle.serpFeatures.map((feature) => (
                      <Badge key={feature} variant="neutral" className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Your position */}
                  <div className={cn(
                    "p-3 rounded-lg",
                    battle.winner === 'Your Site' ? "bg-accent/10 border border-accent" : "bg-bg-elevated"
                  )}>
                    <p className="text-xs text-text-muted mb-1">Your Site</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-accent">#{battle.yourPosition || '—'}</span>
                      {battle.yourChange !== 0 && (
                        <span className={cn(
                          "flex items-center text-sm",
                          battle.yourChange > 0 ? "text-success" : "text-error"
                        )}>
                          {battle.yourChange > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {Math.abs(battle.yourChange)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Competitors */}
                  {battle.competitors.slice(0, 3).map((comp) => (
                    <div key={comp.name} className={cn(
                      "p-3 rounded-lg",
                      battle.winner === comp.name ? "bg-info/10 border border-info" : "bg-bg-elevated"
                    )}>
                      <p className="text-xs text-text-muted mb-1">{comp.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">#{comp.position}</span>
                        {comp.change !== 0 && (
                          <span className={cn(
                            "flex items-center text-sm",
                            comp.change > 0 ? "text-success" : "text-error"
                          )}>
                            {comp.change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            {Math.abs(comp.change)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Strategy Tab
  const renderStrategyTab = () => (
    <>
      {/* Priority Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              AI-Generated Competitive Strategy
            </CardTitle>
            <Button variant="accent" onClick={() => setShowStrategyExport(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export Strategy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Quick Wins */}
            <div>
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-success" />
                Quick Wins (1-2 weeks)
              </h3>
              <div className="space-y-2">
                {[
                  { action: 'Target "technical seo checklist" - you\'re at #15, competitors at #2-8', impact: 'High', effort: 'Low' },
                  { action: 'Create content for "AI SEO Tools Comparison" - 0% coverage vs 75% competitor', impact: 'High', effort: 'Medium' },
                  { action: 'Reach out to searchengineland.com - links to 4 competitors, 0 to you', impact: 'High', effort: 'Low' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <span className="text-text-secondary">{item.action}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">{item.impact} Impact</Badge>
                      <Badge variant="neutral">{item.effort} Effort</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Plays */}
            <div>
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-info" />
                Strategic Plays (1-3 months)
              </h3>
              <div className="space-y-2">
                {[
                  { action: 'Build a free SEO audit tool - competitors have 60% coverage, est. 15K traffic', impact: 'Very High', effort: 'High' },
                  { action: 'Create comprehensive E-E-A-T guide - 20% vs 85% competitor coverage', impact: 'High', effort: 'Medium' },
                  { action: 'Launch link building campaign targeting 8 high-DR domains', impact: 'High', effort: 'High' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <span className="text-text-secondary">{item.action}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{item.impact} Impact</Badge>
                      <Badge variant="warning">{item.effort} Effort</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term Goals */}
            <div>
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                Long-term Goals (3-6 months)
              </h3>
              <div className="space-y-2">
                {[
                  { action: 'Increase market share from 18% to 25%', metric: 'Current: 18%', target: 'Target: 25%' },
                  { action: 'Close traffic gap with SearchMaster', metric: 'Gap: 71K', target: 'Target: <30K' },
                  { action: 'Improve AI visibility score', metric: 'Current: 68', target: 'Target: 80+' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <span className="text-text-secondary">{item.action}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral">{item.metric}</Badge>
                      <Badge variant="accent">{item.target}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-medium text-text-primary mb-2">Content Creation</h4>
              <p className="text-3xl font-bold text-accent mb-2">40%</p>
              <p className="text-sm text-text-muted">Focus on closing content gaps and creating tools</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-medium text-text-primary mb-2">Link Building</h4>
              <p className="text-3xl font-bold text-info mb-2">35%</p>
              <p className="text-sm text-text-muted">Target high-DR domains linking to competitors</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-medium text-text-primary mb-2">Technical SEO</h4>
              <p className="text-3xl font-bold text-success mb-2">25%</p>
              <p className="text-sm text-text-muted">Maintain and improve site performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Competitive Intelligence War Room</h1>
          <p className="text-text-secondary">
            Analyze competitors and identify opportunities to outrank them
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="accent" onClick={() => setShowAddCompetitor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-bg-primary text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Add Competitor Modal */}
      <Modal
        isOpen={showAddCompetitor}
        onClose={() => setShowAddCompetitor(false)}
        title="Add Competitor"
        description="Enter a competitor's domain to start tracking"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Competitor URL</label>
            <Input
              placeholder="e.g., competitor.com"
              value={newCompetitorUrl}
              onChange={(e) => setNewCompetitorUrl(e.target.value)}
            />
          </div>
          <div className="p-4 rounded-lg bg-bg-elevated">
            <p className="text-sm text-text-muted">
              We'll analyze their domain rating, traffic, keywords, backlinks, and AI visibility score.
            </p>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddCompetitor(false)}>Cancel</Button>
            <Button variant="accent" disabled={!newCompetitorUrl.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Competitor Detail Modal */}
      <Modal
        isOpen={showCompetitorDetail}
        onClose={() => setShowCompetitorDetail(false)}
        title={selectedCompetitor?.name || "Competitor Details"}
        description={selectedCompetitor?.url}
        size="lg"
      >
        {selectedCompetitor && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Domain Rating</p>
                <p className="text-2xl font-bold">{selectedCompetitor.domainRating}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Traffic</p>
                <p className="text-2xl font-bold">{formatNumber(selectedCompetitor.organicTraffic)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Keywords</p>
                <p className="text-2xl font-bold">{formatNumber(selectedCompetitor.keywords)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">AI Score</p>
                <p className="text-2xl font-bold text-accent">{selectedCompetitor.aiVisibilityScore}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Top Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCompetitor.topKeywords.map((kw) => (
                  <Badge key={kw} variant="neutral">{kw}</Badge>
                ))}
              </div>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowCompetitorDetail(false)}>Close</Button>
              <Button variant="accent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Analysis
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Keyword Detail Modal */}
      <Modal
        isOpen={showKeywordDetail}
        onClose={() => setShowKeywordDetail(false)}
        title={selectedKeyword?.keyword || "Keyword Details"}
        size="md"
      >
        {selectedKeyword && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Volume</p>
                <p className="text-xl font-bold">{formatNumber(selectedKeyword.volume)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Difficulty</p>
                <p className={cn("text-xl font-bold", getDifficultyColor(selectedKeyword.difficulty))}>
                  {selectedKeyword.difficulty}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">CPC</p>
                <p className="text-xl font-bold">${selectedKeyword.cpc.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-2">Competitor Rankings</h4>
              <div className="space-y-2">
                {selectedKeyword.competitors.map((c) => (
                  <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-bg-elevated">
                    <span>{c.name}</span>
                    <Badge variant="info">#{c.position}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowKeywordDetail(false)}>Close</Button>
              <Button variant="accent">
                <Plus className="h-4 w-4 mr-2" />
                Add to Strategy
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Content Detail Modal */}
      <Modal
        isOpen={showContentDetail}
        onClose={() => setShowContentDetail(false)}
        title={selectedContent?.topic || "Content Gap Details"}
        size="md"
      >
        {selectedContent && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Est. Traffic</p>
                <p className="text-xl font-bold">{formatNumber(selectedContent.estimatedTraffic)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Content Type</p>
                <Badge variant="neutral" className="mt-1">{selectedContent.contentType}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Your Coverage</span>
                  <span className="font-medium">{selectedContent.yourCoverage}%</span>
                </div>
                <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${selectedContent.yourCoverage}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Competitor Coverage</span>
                  <span className="font-medium">{selectedContent.competitorCoverage}%</span>
                </div>
                <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-info rounded-full" style={{ width: `${selectedContent.competitorCoverage}%` }} />
                </div>
              </div>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowContentDetail(false)}>Close</Button>
              <Button variant="accent">
                <FileText className="h-4 w-4 mr-2" />
                Create Content Brief
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Backlink Detail Modal */}
      <Modal
        isOpen={showBacklinkDetail}
        onClose={() => setShowBacklinkDetail(false)}
        title={selectedBacklink?.domain || "Backlink Opportunity"}
        size="md"
      >
        {selectedBacklink && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Domain Rating</p>
                <p className="text-xl font-bold">{selectedBacklink.domainRating}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Traffic</p>
                <p className="text-xl font-bold">{formatNumber(selectedBacklink.traffic)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Links to Competitors</p>
                <p className="text-xl font-bold">{selectedBacklink.linksToCompetitors}</p>
              </div>
            </div>
            {selectedBacklink.contactEmail && (
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="text-sm text-text-muted mb-2">Contact Email</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono">{selectedBacklink.contactEmail}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyEmail(selectedBacklink.contactEmail!)}>
                    {copiedEmail === selectedBacklink.contactEmail ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowBacklinkDetail(false)}>Close</Button>
              <Button variant="accent">
                <Mail className="h-4 w-4 mr-2" />
                Start Outreach
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Strategy Export Modal */}
      <Modal
        isOpen={showStrategyExport}
        onClose={() => setShowStrategyExport(false)}
        title="Export Competitive Strategy"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "pdf", label: "PDF", desc: "Presentation ready" },
                { value: "docx", label: "Word", desc: "Editable document" },
                { value: "csv", label: "CSV", desc: "Data export" },
              ].map((format) => (
                <button
                  key={format.value}
                  className="p-4 rounded-lg border border-border hover:border-accent/50 text-left transition-colors"
                >
                  <p className="font-medium text-text-primary">{format.label}</p>
                  <p className="text-xs text-text-muted mt-1">{format.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowStrategyExport(false)}>Cancel</Button>
            <Button variant="accent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
