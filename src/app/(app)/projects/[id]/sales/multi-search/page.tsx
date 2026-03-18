"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Globe,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Eye,
  RefreshCw,
  Download,
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Settings,
  Plus,
  Map,
  Smartphone,
  Monitor,
  Zap,
  Award,
  Clock,
  Calendar,
  Hash,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// ============ TYPES ============
interface SearchEngine {
  id: string;
  name: string;
  icon: string;
  color: string;
  marketShare: number;
  enabled: boolean;
  region: string;
}

interface KeywordRanking {
  keyword: string;
  searchVolume: number;
  google: { position: number; change: number; url: string };
  bing: { position: number; change: number; url: string };
  duckduckgo: { position: number; change: number; url: string };
  yahoo: { position: number; change: number; url: string };
  yandex: { position: number; change: number; url: string };
  baidu: { position: number; change: number; url: string };
}

interface SearchEngineMetrics {
  engine: string;
  visibility: number;
  avgPosition: number;
  top3: number;
  top10: number;
  top100: number;
  impressions: number;
  clicks: number;
  ctr: number;
  trend: number;
}

interface RegionalData {
  region: string;
  country: string;
  primaryEngine: string;
  visibility: number;
  keywords: number;
  traffic: number;
}

// ============ MOCK DATA ============
const searchEngines: SearchEngine[] = [
  { id: "google", name: "Google", icon: "🔍", color: "#4285F4", marketShare: 91.9, enabled: true, region: "Global" },
  { id: "bing", name: "Bing", icon: "🅱️", color: "#00809D", marketShare: 3.0, enabled: true, region: "Global" },
  { id: "duckduckgo", name: "DuckDuckGo", icon: "🦆", color: "#DE5833", marketShare: 0.6, enabled: true, region: "Global" },
  { id: "yahoo", name: "Yahoo", icon: "📧", color: "#6001D2", marketShare: 1.2, enabled: true, region: "Global" },
  { id: "yandex", name: "Yandex", icon: "🔴", color: "#FF0000", marketShare: 1.5, enabled: true, region: "Russia/CIS" },
  { id: "baidu", name: "Baidu", icon: "🐻", color: "#2319DC", marketShare: 1.1, enabled: false, region: "China" },
];

const keywordRankings: KeywordRanking[] = [
  {
    keyword: "seo services",
    searchVolume: 22000,
    google: { position: 3, change: 2, url: "/services/seo" },
    bing: { position: 5, change: 1, url: "/services/seo" },
    duckduckgo: { position: 4, change: 0, url: "/services/seo" },
    yahoo: { position: 6, change: -1, url: "/services/seo" },
    yandex: { position: 12, change: 3, url: "/services/seo" },
    baidu: { position: 0, change: 0, url: "" },
  },
  {
    keyword: "technical seo audit",
    searchVolume: 8100,
    google: { position: 1, change: 0, url: "/services/technical-seo" },
    bing: { position: 2, change: 1, url: "/services/technical-seo" },
    duckduckgo: { position: 1, change: 0, url: "/services/technical-seo" },
    yahoo: { position: 3, change: 2, url: "/services/technical-seo" },
    yandex: { position: 8, change: -2, url: "/services/technical-seo" },
    baidu: { position: 0, change: 0, url: "" },
  },
  {
    keyword: "local seo company",
    searchVolume: 6600,
    google: { position: 5, change: -1, url: "/services/local-seo" },
    bing: { position: 3, change: 2, url: "/services/local-seo" },
    duckduckgo: { position: 6, change: 1, url: "/services/local-seo" },
    yahoo: { position: 4, change: 0, url: "/services/local-seo" },
    yandex: { position: 15, change: 5, url: "/services/local-seo" },
    baidu: { position: 0, change: 0, url: "" },
  },
  {
    keyword: "ecommerce seo",
    searchVolume: 5400,
    google: { position: 7, change: 3, url: "/services/ecommerce-seo" },
    bing: { position: 8, change: 0, url: "/services/ecommerce-seo" },
    duckduckgo: { position: 9, change: -2, url: "/services/ecommerce-seo" },
    yahoo: { position: 10, change: 1, url: "/services/ecommerce-seo" },
    yandex: { position: 22, change: -5, url: "/services/ecommerce-seo" },
    baidu: { position: 0, change: 0, url: "" },
  },
  {
    keyword: "seo consultant",
    searchVolume: 4400,
    google: { position: 2, change: 1, url: "/about/team" },
    bing: { position: 4, change: 2, url: "/about/team" },
    duckduckgo: { position: 3, change: 0, url: "/about/team" },
    yahoo: { position: 5, change: -1, url: "/about/team" },
    yandex: { position: 18, change: 0, url: "/about/team" },
    baidu: { position: 0, change: 0, url: "" },
  },
  {
    keyword: "link building services",
    searchVolume: 3600,
    google: { position: 4, change: 0, url: "/services/link-building" },
    bing: { position: 6, change: -1, url: "/services/link-building" },
    duckduckgo: { position: 5, change: 2, url: "/services/link-building" },
    yahoo: { position: 7, change: 1, url: "/services/link-building" },
    yandex: { position: 25, change: -3, url: "/services/link-building" },
    baidu: { position: 0, change: 0, url: "" },
  },
  {
    keyword: "content marketing agency",
    searchVolume: 2900,
    google: { position: 8, change: 2, url: "/services/content-marketing" },
    bing: { position: 7, change: 3, url: "/services/content-marketing" },
    duckduckgo: { position: 10, change: -1, url: "/services/content-marketing" },
    yahoo: { position: 9, change: 0, url: "/services/content-marketing" },
    yandex: { position: 30, change: 2, url: "/services/content-marketing" },
    baidu: { position: 0, change: 0, url: "" },
  },
  {
    keyword: "seo agency near me",
    searchVolume: 12100,
    google: { position: 6, change: -2, url: "/contact" },
    bing: { position: 4, change: 1, url: "/contact" },
    duckduckgo: { position: 8, change: 0, url: "/contact" },
    yahoo: { position: 5, change: 2, url: "/contact" },
    yandex: { position: 0, change: 0, url: "" },
    baidu: { position: 0, change: 0, url: "" },
  },
];

const searchEngineMetrics: SearchEngineMetrics[] = [
  { engine: "Google", visibility: 78, avgPosition: 4.2, top3: 45, top10: 156, top100: 423, impressions: 125000, clicks: 8500, ctr: 6.8, trend: 5.2 },
  { engine: "Bing", visibility: 72, avgPosition: 5.1, top3: 38, top10: 142, top100: 398, impressions: 18000, clicks: 1200, ctr: 6.7, trend: 8.1 },
  { engine: "DuckDuckGo", visibility: 68, avgPosition: 5.8, top3: 32, top10: 128, top100: 356, impressions: 4500, clicks: 320, ctr: 7.1, trend: 12.3 },
  { engine: "Yahoo", visibility: 65, avgPosition: 6.2, top3: 28, top10: 118, top100: 334, impressions: 8200, clicks: 540, ctr: 6.6, trend: 2.1 },
  { engine: "Yandex", visibility: 42, avgPosition: 15.4, top3: 8, top10: 45, top100: 189, impressions: 2100, clicks: 85, ctr: 4.0, trend: -3.5 },
  { engine: "Baidu", visibility: 0, avgPosition: 0, top3: 0, top10: 0, top100: 0, impressions: 0, clicks: 0, ctr: 0, trend: 0 },
];

const regionalData: RegionalData[] = [
  { region: "North America", country: "United States", primaryEngine: "Google", visibility: 82, keywords: 423, traffic: 45000 },
  { region: "North America", country: "Canada", primaryEngine: "Google", visibility: 78, keywords: 312, traffic: 12000 },
  { region: "Europe", country: "United Kingdom", primaryEngine: "Google", visibility: 75, keywords: 289, traffic: 18000 },
  { region: "Europe", country: "Germany", primaryEngine: "Google", visibility: 71, keywords: 234, traffic: 8500 },
  { region: "Europe", country: "France", primaryEngine: "Google", visibility: 68, keywords: 198, traffic: 6200 },
  { region: "Asia", country: "Japan", primaryEngine: "Google", visibility: 45, keywords: 89, traffic: 2100 },
  { region: "CIS", country: "Russia", primaryEngine: "Yandex", visibility: 42, keywords: 156, traffic: 3400 },
  { region: "Asia", country: "China", primaryEngine: "Baidu", visibility: 0, keywords: 0, traffic: 0 },
];

const visibilityTrend = [
  { date: "Jan", google: 72, bing: 65, duckduckgo: 58, yahoo: 60, yandex: 38 },
  { date: "Feb", google: 74, bing: 68, duckduckgo: 62, yahoo: 61, yandex: 40 },
  { date: "Mar", google: 76, bing: 70, duckduckgo: 65, yahoo: 63, yandex: 42 },
  { date: "Apr", google: 75, bing: 69, duckduckgo: 64, yahoo: 62, yandex: 41 },
  { date: "May", google: 77, bing: 71, duckduckgo: 66, yahoo: 64, yandex: 43 },
  { date: "Jun", google: 78, bing: 72, duckduckgo: 68, yahoo: 65, yandex: 42 },
];

const deviceDistribution = [
  { device: "Desktop", google: 45, bing: 62, duckduckgo: 55, yahoo: 48 },
  { device: "Mobile", google: 52, bing: 35, duckduckgo: 42, yahoo: 48 },
  { device: "Tablet", google: 3, bing: 3, duckduckgo: 3, yahoo: 4 },
];

const serpFeatures = [
  { feature: "Featured Snippets", google: 12, bing: 8, duckduckgo: 5, yahoo: 3 },
  { feature: "People Also Ask", google: 18, bing: 6, duckduckgo: 0, yahoo: 4 },
  { feature: "Local Pack", google: 8, bing: 5, duckduckgo: 0, yahoo: 3 },
  { feature: "Image Pack", google: 15, bing: 12, duckduckgo: 8, yahoo: 6 },
  { feature: "Video Results", google: 6, bing: 4, duckduckgo: 2, yahoo: 3 },
  { feature: "Knowledge Panel", google: 3, bing: 2, duckduckgo: 0, yahoo: 1 },
];

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "rankings", label: "Rankings", icon: Target },
  { id: "engines", label: "Search Engines", icon: Globe },
  { id: "regional", label: "Regional", icon: Map },
  { id: "serp", label: "SERP Features", icon: Layers },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function MultiSearchPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedEngine, setSelectedEngine] = React.useState<string>("all");
  const [showAddKeywordModal, setShowAddKeywordModal] = React.useState(false);
  const [showEngineSettings, setShowEngineSettings] = React.useState(false);
  const [showKeywordDetail, setShowKeywordDetail] = React.useState<KeywordRanking | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string>("volume");

  if (!project) return null;

  // Calculate totals
  const totalKeywords = keywordRankings.length;
  const avgVisibility = Math.round(searchEngineMetrics.filter(m => m.visibility > 0).reduce((sum, m) => sum + m.visibility, 0) / searchEngineMetrics.filter(m => m.visibility > 0).length);
  const totalImpressions = searchEngineMetrics.reduce((sum, m) => sum + m.impressions, 0);
  const totalClicks = searchEngineMetrics.reduce((sum, m) => sum + m.clicks, 0);

  const filteredKeywords = keywordRankings.filter(k => 
    searchQuery ? k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    if (sortBy === "volume") return b.searchVolume - a.searchVolume;
    if (sortBy === "google") return a.google.position - b.google.position;
    if (sortBy === "bing") return a.bing.position - b.bing.position;
    return 0;
  });

  const getPositionBadge = (position: number, change: number) => {
    if (position === 0) return <span className="text-text-muted">—</span>;
    return (
      <div className="flex items-center gap-1">
        <Badge variant={position <= 3 ? "success" : position <= 10 ? "warning" : "neutral"}>
          #{position}
        </Badge>
        {change !== 0 && (
          <span className={cn(
            "flex items-center text-xs",
            change > 0 ? "text-success" : "text-error"
          )}>
            {change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(change)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">Multi-Search Engine Tracking</h1>
            <Badge variant="info">6 Engines</Badge>
          </div>
          <p className="text-text-secondary">
            Track rankings across Google, Bing, DuckDuckGo, Yahoo, Yandex, and Baidu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowEngineSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="accent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Rankings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Avg Visibility"
              value={`${avgVisibility}%`}
              trend={5.2}
              trendLabel="vs last month"
              icon={<Eye className="h-5 w-5" />}
              variant="accent"
            />
            <StatCard
              label="Tracked Keywords"
              value={formatNumber(totalKeywords * 50)}
              trend={12}
              trendLabel="new this month"
              icon={<Target className="h-5 w-5" />}
            />
            <StatCard
              label="Total Impressions"
              value={formatNumber(totalImpressions)}
              trend={8.5}
              trendLabel="vs last month"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <StatCard
              label="Total Clicks"
              value={formatNumber(totalClicks)}
              trend={15.2}
              trendLabel="vs last month"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          {/* Search Engine Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {searchEngines.map((engine) => {
              const metrics = searchEngineMetrics.find(m => m.engine === engine.name);
              return (
                <Card key={engine.id} className={cn(
                  "hover:border-accent/50 transition-colors cursor-pointer",
                  !engine.enabled && "opacity-50"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{engine.icon}</span>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{engine.name}</p>
                        <p className="text-xs text-text-muted">{engine.marketShare}% share</p>
                      </div>
                    </div>
                    {engine.enabled && metrics ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-muted">Visibility</span>
                          <span className="font-mono text-sm text-text-primary">{metrics.visibility}%</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${metrics.visibility}%`, backgroundColor: engine.color }}
                          />
                        </div>
                        <div className={cn(
                          "flex items-center justify-end text-xs",
                          metrics.trend >= 0 ? "text-success" : "text-error"
                        )}>
                          {metrics.trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(metrics.trend)}%
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <Badge variant="neutral">Not Enabled</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Visibility Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility Trend (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibilityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="google" stroke="#4285F4" strokeWidth={2} name="Google" />
                    <Line type="monotone" dataKey="bing" stroke="#00809D" strokeWidth={2} name="Bing" />
                    <Line type="monotone" dataKey="duckduckgo" stroke="#DE5833" strokeWidth={2} name="DuckDuckGo" />
                    <Line type="monotone" dataKey="yahoo" stroke="#6001D2" strokeWidth={2} name="Yahoo" />
                    <Line type="monotone" dataKey="yandex" stroke="#FF0000" strokeWidth={2} name="Yandex" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Rankings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Keywords Across Engines</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("rankings")}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                      <th className="p-3 text-center text-xs font-medium text-text-muted uppercase">Volume</th>
                      <th className="p-3 text-center text-xs font-medium text-text-muted uppercase">🔍 Google</th>
                      <th className="p-3 text-center text-xs font-medium text-text-muted uppercase">🅱️ Bing</th>
                      <th className="p-3 text-center text-xs font-medium text-text-muted uppercase">🦆 DDG</th>
                      <th className="p-3 text-center text-xs font-medium text-text-muted uppercase">📧 Yahoo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordRankings.slice(0, 5).map((kw) => (
                      <tr key={kw.keyword} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-3 font-medium text-text-primary">{kw.keyword}</td>
                        <td className="p-3 text-center font-mono text-text-muted">{formatNumber(kw.searchVolume)}</td>
                        <td className="p-3 text-center">{getPositionBadge(kw.google.position, kw.google.change)}</td>
                        <td className="p-3 text-center">{getPositionBadge(kw.bing.position, kw.bing.change)}</td>
                        <td className="p-3 text-center">{getPositionBadge(kw.duckduckgo.position, kw.duckduckgo.change)}</td>
                        <td className="p-3 text-center">{getPositionBadge(kw.yahoo.position, kw.yahoo.change)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rankings Tab */}
      {activeTab === "rankings" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <select
                className="h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="volume">Sort by Volume</option>
                <option value="google">Sort by Google Rank</option>
                <option value="bing">Sort by Bing Rank</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="accent" onClick={() => setShowAddKeywordModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Keywords
              </Button>
            </div>
          </div>

          {/* Rankings Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Volume</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">🔍 Google</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">🅱️ Bing</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">🦆 DDG</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">📧 Yahoo</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">🔴 Yandex</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedKeywords.map((kw) => (
                      <tr key={kw.keyword} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4">
                          <p className="font-medium text-text-primary">{kw.keyword}</p>
                          <p className="text-xs text-text-muted">{kw.google.url}</p>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(kw.searchVolume)}</td>
                        <td className="p-4 text-center">{getPositionBadge(kw.google.position, kw.google.change)}</td>
                        <td className="p-4 text-center">{getPositionBadge(kw.bing.position, kw.bing.change)}</td>
                        <td className="p-4 text-center">{getPositionBadge(kw.duckduckgo.position, kw.duckduckgo.change)}</td>
                        <td className="p-4 text-center">{getPositionBadge(kw.yahoo.position, kw.yahoo.change)}</td>
                        <td className="p-4 text-center">{getPositionBadge(kw.yandex.position, kw.yandex.change)}</td>
                        <td className="p-4 text-center">
                          <Button variant="ghost" size="sm" onClick={() => setShowKeywordDetail(kw)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Engines Tab */}
      {activeTab === "engines" && (
        <div className="space-y-6">
          {/* Engine Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {searchEngineMetrics.filter(m => m.visibility > 0).map((metrics) => {
              const engine = searchEngines.find(e => e.name === metrics.engine);
              return (
                <Card key={metrics.engine}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{engine?.icon}</span>
                      <div>
                        <CardTitle>{metrics.engine}</CardTitle>
                        <p className="text-sm text-text-muted">{engine?.marketShare}% global market share</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-bg-elevated">
                        <p className="text-2xl font-bold text-text-primary">{metrics.visibility}%</p>
                        <p className="text-xs text-text-muted">Visibility</p>
                      </div>
                      <div className="p-3 rounded-lg bg-bg-elevated">
                        <p className="text-2xl font-bold text-text-primary">#{metrics.avgPosition.toFixed(1)}</p>
                        <p className="text-xs text-text-muted">Avg Position</p>
                      </div>
                      <div className="p-3 rounded-lg bg-bg-elevated">
                        <p className="text-2xl font-bold text-text-primary">{metrics.ctr}%</p>
                        <p className="text-xs text-text-muted">CTR</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Top 3 Keywords</span>
                        <span className="font-mono text-text-primary">{metrics.top3}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Top 10 Keywords</span>
                        <span className="font-mono text-text-primary">{metrics.top10}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Top 100 Keywords</span>
                        <span className="font-mono text-text-primary">{metrics.top100}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Impressions</span>
                        <span className="font-mono text-text-primary">{formatNumber(metrics.impressions)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Clicks</span>
                        <span className="font-mono text-text-primary">{formatNumber(metrics.clicks)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Device Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Device Distribution by Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="device" stroke="var(--color-text-muted)" fontSize={12} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="google" fill="#4285F4" name="Google" />
                    <Bar dataKey="bing" fill="#00809D" name="Bing" />
                    <Bar dataKey="duckduckgo" fill="#DE5833" name="DuckDuckGo" />
                    <Bar dataKey="yahoo" fill="#6001D2" name="Yahoo" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Regional Tab */}
      {activeTab === "regional" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Region</th>
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Country</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Primary Engine</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Visibility</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Keywords</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Traffic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((region, i) => (
                      <tr key={i} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4 text-text-muted">{region.region}</td>
                        <td className="p-4 font-medium text-text-primary">{region.country}</td>
                        <td className="p-4 text-center">
                          <Badge variant="neutral">{region.primaryEngine}</Badge>
                        </td>
                        <td className="p-4 text-center">
                          {region.visibility > 0 ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    region.visibility >= 70 ? "bg-success" :
                                    region.visibility >= 50 ? "bg-warning" : "bg-error"
                                  )}
                                  style={{ width: `${region.visibility}%` }}
                                />
                              </div>
                              <span className="font-mono text-sm text-text-primary">{region.visibility}%</span>
                            </div>
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">
                          {region.keywords > 0 ? formatNumber(region.keywords) : "—"}
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">
                          {region.traffic > 0 ? formatNumber(region.traffic) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Regional Insights */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Regions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionalData.filter(r => r.visibility > 0).sort((a, b) => b.visibility - a.visibility).slice(0, 5).map((region, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-text-muted">#{i + 1}</span>
                        <div>
                          <p className="font-medium text-text-primary">{region.country}</p>
                          <p className="text-xs text-text-muted">{region.primaryEngine}</p>
                        </div>
                      </div>
                      <Badge variant={region.visibility >= 70 ? "success" : "warning"}>
                        {region.visibility}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expansion Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: "China", engine: "Baidu", potential: "High", note: "Requires localization" },
                    { country: "South Korea", engine: "Naver", potential: "Medium", note: "Growing market" },
                    { country: "Japan", engine: "Yahoo Japan", potential: "Medium", note: "Unique search behavior" },
                  ].map((opp, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-text-primary">{opp.country}</span>
                        <Badge variant={opp.potential === "High" ? "success" : "warning"}>
                          {opp.potential} Potential
                        </Badge>
                      </div>
                      <p className="text-sm text-text-muted">Primary: {opp.engine}</p>
                      <p className="text-xs text-text-muted mt-1">{opp.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* SERP Features Tab */}
      {activeTab === "serp" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SERP Features by Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serpFeatures} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" stroke="var(--color-text-muted)" fontSize={12} />
                    <YAxis dataKey="feature" type="category" stroke="var(--color-text-muted)" fontSize={12} width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="google" fill="#4285F4" name="Google" />
                    <Bar dataKey="bing" fill="#00809D" name="Bing" />
                    <Bar dataKey="duckduckgo" fill="#DE5833" name="DuckDuckGo" />
                    <Bar dataKey="yahoo" fill="#6001D2" name="Yahoo" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Feature Details */}
          <div className="grid grid-cols-3 gap-4">
            {serpFeatures.map((feature) => (
              <Card key={feature.feature}>
                <CardContent className="p-4">
                  <h3 className="font-medium text-text-primary mb-3">{feature.feature}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">🔍 Google</span>
                      <span className="font-mono text-text-primary">{feature.google}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">🅱️ Bing</span>
                      <span className="font-mono text-text-primary">{feature.bing}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">🦆 DDG</span>
                      <span className="font-mono text-text-primary">{feature.duckduckgo}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">📧 Yahoo</span>
                      <span className="font-mono text-text-primary">{feature.yahoo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchEngines.map((engine) => (
                  <div key={engine.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{engine.icon}</span>
                      <div>
                        <p className="font-medium text-text-primary">{engine.name}</p>
                        <p className="text-sm text-text-muted">{engine.region} • {engine.marketShare}% market share</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={engine.enabled ? "success" : "neutral"}>
                        {engine.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <button
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          engine.enabled ? "bg-accent" : "bg-border"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            engine.enabled ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Daily rank updates", description: "Check rankings every 24 hours", enabled: true },
                  { label: "SERP feature tracking", description: "Track featured snippets, PAA, etc.", enabled: true },
                  { label: "Mobile rankings", description: "Track mobile-specific rankings", enabled: true },
                  { label: "Local rankings", description: "Track location-specific rankings", enabled: false },
                  { label: "Competitor tracking", description: "Monitor competitor rankings", enabled: true },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <div>
                      <p className="font-medium text-text-primary">{setting.label}</p>
                      <p className="text-sm text-text-muted">{setting.description}</p>
                    </div>
                    <button
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        setting.enabled ? "bg-accent" : "bg-border"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          setting.enabled ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Keyword Modal */}
      <Modal
        isOpen={showAddKeywordModal}
        onClose={() => setShowAddKeywordModal(false)}
        title="Add Keywords"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Keywords (one per line)
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 rounded-md border border-border bg-bg-card text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="seo services&#10;technical seo&#10;local seo company"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Track on Engines
            </label>
            <div className="flex flex-wrap gap-2">
              {searchEngines.map((engine) => (
                <label key={engine.id} className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer hover:bg-bg-elevated">
                  <input type="checkbox" defaultChecked={engine.enabled} className="rounded" />
                  <span className="text-lg">{engine.icon}</span>
                  <span className="text-sm text-text-primary">{engine.name}</span>
                </label>
              ))}
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddKeywordModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowAddKeywordModal(false)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Keywords
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Keyword Detail Panel */}
      <SlidePanel
        isOpen={!!showKeywordDetail}
        onClose={() => setShowKeywordDetail(null)}
        title={showKeywordDetail?.keyword || "Keyword Details"}
        size="lg"
      >
        {showKeywordDetail && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="text-2xl font-bold text-text-primary">{formatNumber(showKeywordDetail.searchVolume)}</p>
                <p className="text-sm text-text-muted">Monthly Search Volume</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="text-2xl font-bold text-text-primary">{showKeywordDetail.google.url}</p>
                <p className="text-sm text-text-muted">Ranking URL</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-text-primary mb-3">Rankings by Engine</h3>
              <div className="space-y-3">
                {[
                  { name: "Google", icon: "🔍", data: showKeywordDetail.google },
                  { name: "Bing", icon: "🅱️", data: showKeywordDetail.bing },
                  { name: "DuckDuckGo", icon: "🦆", data: showKeywordDetail.duckduckgo },
                  { name: "Yahoo", icon: "📧", data: showKeywordDetail.yahoo },
                  { name: "Yandex", icon: "🔴", data: showKeywordDetail.yandex },
                ].map((engine) => (
                  <div key={engine.name} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{engine.icon}</span>
                      <span className="font-medium text-text-primary">{engine.name}</span>
                    </div>
                    {getPositionBadge(engine.data.position, engine.data.change)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => setShowKeywordDetail(null)}>
                Close
              </Button>
              <Button variant="accent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View in SERP
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Engine Settings Modal */}
      <Modal
        isOpen={showEngineSettings}
        onClose={() => setShowEngineSettings(false)}
        title="Search Engine Settings"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Configure which search engines to track and their settings.
          </p>
          <div className="space-y-3">
            {searchEngines.map((engine) => (
              <div key={engine.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{engine.icon}</span>
                  <div>
                    <p className="font-medium text-text-primary">{engine.name}</p>
                    <p className="text-sm text-text-muted">{engine.region}</p>
                  </div>
                </div>
                <button
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    engine.enabled ? "bg-accent" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      engine.enabled ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowEngineSettings(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowEngineSettings(false)}>
              Save Settings
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
