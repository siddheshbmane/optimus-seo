"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  MousePointer,
  Eye,
  BarChart3,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ShoppingCart,
  LineChart,
  FileText,
  Users,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  ExternalLink,
  Copy,
  Sparkles,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
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

type TabType = "overview" | "campaigns" | "keywords" | "ads" | "competitors" | "shopping" | "trends";

// Mock data for campaigns
const campaigns = [
  { id: 1, name: "Brand Keywords", status: "active", budget: 5000, spent: 3245, clicks: 12450, impressions: 156000, ctr: 7.98, cpc: 0.26, conversions: 342, roas: 4.2 },
  { id: 2, name: "Competitor Targeting", status: "active", budget: 8000, spent: 6120, clicks: 8900, impressions: 245000, ctr: 3.63, cpc: 0.69, conversions: 156, roas: 2.8 },
  { id: 3, name: "Product - SEO Tools", status: "active", budget: 12000, spent: 9800, clicks: 15600, impressions: 320000, ctr: 4.88, cpc: 0.63, conversions: 489, roas: 5.1 },
  { id: 4, name: "Remarketing", status: "paused", budget: 3000, spent: 1200, clicks: 4500, impressions: 89000, ctr: 5.06, cpc: 0.27, conversions: 178, roas: 6.2 },
  { id: 5, name: "Display Network", status: "active", budget: 4000, spent: 2890, clicks: 18900, impressions: 890000, ctr: 2.12, cpc: 0.15, conversions: 89, roas: 1.8 },
];

// Mock data for PPC keywords
const ppcKeywords = [
  { id: 1, keyword: "seo services", cpc: 12.50, volume: 14800, competition: "High", yourBid: 14.00, position: 2.1, qualityScore: 8, clicks: 1250, conversions: 45 },
  { id: 2, keyword: "seo agency", cpc: 15.20, volume: 9200, competition: "High", yourBid: 14.00, position: 3.2, qualityScore: 7, clicks: 890, conversions: 32 },
  { id: 3, keyword: "local seo services", cpc: 8.90, volume: 6700, competition: "Medium", yourBid: 8.50, position: 1.8, qualityScore: 9, clicks: 1560, conversions: 78 },
  { id: 4, keyword: "technical seo audit", cpc: 11.20, volume: 5600, competition: "Medium", yourBid: 10.00, position: 2.5, qualityScore: 8, clicks: 720, conversions: 28 },
  { id: 5, keyword: "seo consultant", cpc: 14.20, volume: 9800, competition: "High", yourBid: 12.00, position: 4.1, qualityScore: 6, clicks: 450, conversions: 15 },
  { id: 6, keyword: "ecommerce seo", cpc: 10.80, volume: 4500, competition: "Medium", yourBid: 9.50, position: 2.8, qualityScore: 7, clicks: 680, conversions: 22 },
  { id: 7, keyword: "link building service", cpc: 15.80, volume: 4200, competition: "High", yourBid: 15.00, position: 1.5, qualityScore: 9, clicks: 920, conversions: 41 },
  { id: 8, keyword: "content marketing agency", cpc: 9.50, volume: 7800, competition: "Medium", yourBid: 8.00, position: 3.8, qualityScore: 7, clicks: 540, conversions: 18 },
];

// Mock data for competitor ads
const competitorAds = [
  {
    id: 1,
    competitor: "SEO Agency Pro",
    headline: "Top SEO Agency | 500+ Clients Served",
    description: "Boost your rankings with our proven SEO strategies. Free audit included.",
    displayUrl: "seoagencypro.com/services",
    position: 1,
    estimatedSpend: 45000,
    keywords: 156,
    adStrength: "Excellent",
  },
  {
    id: 2,
    competitor: "Digital Growth Co",
    headline: "SEO Services That Deliver Results",
    description: "Data-driven SEO campaigns. See 3x ROI in 6 months. Get started today.",
    displayUrl: "digitalgrowth.co/seo",
    position: 2,
    estimatedSpend: 38000,
    keywords: 124,
    adStrength: "Good",
  },
  {
    id: 3,
    competitor: "RankBoost",
    headline: "Affordable SEO for Small Business",
    description: "Professional SEO services starting at $499/mo. No contracts.",
    displayUrl: "rankboost.com/pricing",
    position: 3,
    estimatedSpend: 22000,
    keywords: 89,
    adStrength: "Good",
  },
  {
    id: 4,
    competitor: "SearchMasters",
    headline: "Enterprise SEO Solutions | Fortune 500",
    description: "Trusted by leading brands. Custom SEO strategies for enterprise.",
    displayUrl: "searchmasters.io/enterprise",
    position: 4,
    estimatedSpend: 65000,
    keywords: 234,
    adStrength: "Excellent",
  },
];

// Mock data for shopping/merchant
const shoppingProducts = [
  { id: 1, title: "SEO Audit Tool Pro", price: 299, merchant: "SEOTools Inc", rating: 4.8, reviews: 1250, position: 1, clicks: 3400 },
  { id: 2, title: "Keyword Research Suite", price: 199, merchant: "MarketingPro", rating: 4.6, reviews: 890, position: 2, clicks: 2100 },
  { id: 3, title: "Backlink Analyzer", price: 149, merchant: "LinkMaster", rating: 4.5, reviews: 567, position: 3, clicks: 1800 },
  { id: 4, title: "Rank Tracking Software", price: 99, merchant: "RankWatch", rating: 4.7, reviews: 2340, position: 4, clicks: 2800 },
];

// Mock data for trends
const trendingKeywords = [
  { keyword: "ai seo tools", trend: 245, volume: 8900, growth: "rising" },
  { keyword: "chatgpt seo", trend: 189, volume: 12400, growth: "rising" },
  { keyword: "voice search optimization", trend: 78, volume: 5600, growth: "stable" },
  { keyword: "local seo 2026", trend: 156, volume: 4200, growth: "rising" },
  { keyword: "seo automation", trend: 134, volume: 6800, growth: "rising" },
];

export default function PPCIntelligencePage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [showBidModal, setShowBidModal] = React.useState(false);
  const [showCampaignModal, setShowCampaignModal] = React.useState(false);
  const [showAdDetailPanel, setShowAdDetailPanel] = React.useState(false);
  const [showKeywordDetailPanel, setShowKeywordDetailPanel] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [selectedKeyword, setSelectedKeyword] = React.useState<typeof ppcKeywords[0] | null>(null);
  const [selectedAd, setSelectedAd] = React.useState<typeof competitorAds[0] | null>(null);
  const [selectedCampaign, setSelectedCampaign] = React.useState<typeof campaigns[0] | null>(null);
  const [bidAmount, setBidAmount] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  if (!project) return null;

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgCpc = totalSpend / totalClicks;
  const avgRoas = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "campaigns", label: "Campaigns", icon: Target },
    { id: "keywords", label: "Keywords", icon: Search },
    { id: "ads", label: "Ad Copy", icon: FileText },
    { id: "competitors", label: "Competitors", icon: Users },
    { id: "shopping", label: "Shopping", icon: ShoppingCart },
    { id: "trends", label: "Trends", icon: LineChart },
  ];

  const handleAdjustBid = (keyword: typeof ppcKeywords[0]) => {
    setSelectedKeyword(keyword);
    setBidAmount(keyword.yourBid.toString());
    setShowBidModal(true);
  };

  const handleSaveBid = () => {
    // In a real app, this would update the bid
    setShowBidModal(false);
    setSelectedKeyword(null);
    setBidAmount("");
  };

  const handleViewAdDetail = (ad: typeof competitorAds[0]) => {
    setSelectedAd(ad);
    setShowAdDetailPanel(true);
  };

  const handleViewKeywordDetail = (keyword: typeof ppcKeywords[0]) => {
    setSelectedKeyword(keyword);
    setShowKeywordDetailPanel(true);
  };

  const filteredCampaigns = filterStatus === "all" 
    ? campaigns 
    : campaigns.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">PPC Intelligence</h1>
          <p className="text-text-secondary">
            Mission control for your performance marketing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="accent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Total Spend"
              value={`$${formatNumber(totalSpend)}`}
              trend={12}
              trendLabel="vs last month"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <StatCard
              label="Total Clicks"
              value={formatNumber(totalClicks)}
              trend={8}
              trendLabel="vs last month"
              icon={<MousePointer className="h-5 w-5" />}
            />
            <StatCard
              label="Conversions"
              value={formatNumber(totalConversions)}
              trend={15}
              trendLabel="vs last month"
              icon={<Target className="h-5 w-5" />}
            />
            <StatCard
              label="Avg. CPC"
              value={`$${avgCpc.toFixed(2)}`}
              trend={-5}
              trendLabel="vs last month"
              icon={<TrendingDown className="h-5 w-5" />}
            />
            <StatCard
              label="Avg. ROAS"
              value={`${avgRoas.toFixed(1)}x`}
              trend={18}
              trendLabel="vs last month"
              icon={<TrendingUp className="h-5 w-5" />}
              variant="accent"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => setActiveTab("campaigns")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Campaign Performance</p>
                    <p className="text-sm text-text-muted">{campaigns.filter(c => c.status === "active").length} active campaigns</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => setActiveTab("competitors")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Competitor Ads</p>
                    <p className="text-sm text-text-muted">{competitorAds.length} competitors tracked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:border-accent/50 transition-colors cursor-pointer" onClick={() => setActiveTab("trends")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <LineChart className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Trending Keywords</p>
                    <p className="text-sm text-text-muted">{trendingKeywords.filter(t => t.growth === "rising").length} rising trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Keywords */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Performing Keywords</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("keywords")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Clicks</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Conversions</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">QS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ppcKeywords.slice(0, 5).map((kw) => (
                      <tr key={kw.id} className="border-b border-border hover:bg-bg-elevated cursor-pointer" onClick={() => handleViewKeywordDetail(kw)}>
                        <td className="p-4 font-medium text-text-primary">{kw.keyword}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{kw.position.toFixed(1)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(kw.clicks)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{kw.conversions}</td>
                        <td className="p-4 text-center">
                          <Badge variant={kw.qualityScore >= 8 ? "success" : kw.qualityScore >= 6 ? "warning" : "error"}>
                            {kw.qualityScore}/10
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Competitor Ad Activity</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("competitors")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorAds.slice(0, 3).map((ad) => (
                  <div key={ad.id} className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer" onClick={() => handleViewAdDetail(ad)}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="accent">Ad #{ad.position}</Badge>
                        <span className="font-medium text-text-primary">{ad.competitor}</span>
                      </div>
                      <span className="text-sm text-text-muted">
                        Est. spend: ${formatNumber(ad.estimatedSpend)}/mo
                      </span>
                    </div>
                    <p className="text-accent font-medium mb-1">{ad.headline}</p>
                    <p className="text-sm text-text-secondary">{ad.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {filterStatus !== "all" && (
                  <Badge variant="accent" className="ml-2">{filterStatus}</Badge>
                )}
              </Button>
              {showFilterDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {["all", "active", "paused"].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setFilterStatus(status); setShowFilterDropdown(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-md capitalize",
                          filterStatus === status ? "bg-accent/10 text-accent" : "hover:bg-bg-elevated"
                        )}
                      >
                        {status === "all" ? "All Campaigns" : status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button variant="accent" onClick={() => setShowCampaignModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Campaign</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Status</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Budget</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Spent</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Clicks</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">CTR</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Conv.</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">ROAS</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4 font-medium text-text-primary">{campaign.name}</td>
                        <td className="p-4 text-center">
                          <Badge variant={campaign.status === "active" ? "success" : "neutral"}>
                            {campaign.status === "active" ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">${formatNumber(campaign.budget)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">${formatNumber(campaign.spent)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(campaign.clicks)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{campaign.ctr.toFixed(2)}%</td>
                        <td className="p-4 text-center font-mono text-text-primary">{campaign.conversions}</td>
                        <td className="p-4 text-center">
                          <Badge variant={campaign.roas >= 4 ? "success" : campaign.roas >= 2 ? "warning" : "error"}>
                            {campaign.roas.toFixed(1)}x
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <button className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
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

      {/* Keywords Tab */}
      {activeTab === "keywords" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input placeholder="Search keywords..." className="pl-9" />
            </div>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Add Keywords
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">CPC</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Your Bid</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">QS</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Clicks</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Conv.</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ppcKeywords.map((kw) => (
                      <tr key={kw.id} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4">
                          <button 
                            onClick={() => handleViewKeywordDetail(kw)}
                            className="font-medium text-text-primary hover:text-accent transition-colors"
                          >
                            {kw.keyword}
                          </button>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">${kw.cpc.toFixed(2)}</td>
                        <td className="p-4 text-center font-mono text-success">${kw.yourBid.toFixed(2)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{kw.position.toFixed(1)}</td>
                        <td className="p-4 text-center">
                          <Badge variant={kw.qualityScore >= 8 ? "success" : kw.qualityScore >= 6 ? "warning" : "error"}>
                            {kw.qualityScore}/10
                          </Badge>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(kw.clicks)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{kw.conversions}</td>
                        <td className="p-4 text-center">
                          <Button variant="secondary" size="sm" onClick={() => handleAdjustBid(kw)}>
                            Adjust Bid
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

      {/* Ads Tab */}
      {activeTab === "ads" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Your Ad Copy</h2>
            <Button variant="accent">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Ad Copy
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { headline: "Expert SEO Services | Proven Results", description: "Boost your rankings with our data-driven SEO strategies. Free consultation.", ctr: 8.5, conversions: 156 },
              { headline: "SEO Agency | 10+ Years Experience", description: "Trusted by 500+ businesses. Get more traffic and leads today.", ctr: 7.2, conversions: 124 },
              { headline: "Affordable SEO Packages | No Contracts", description: "Professional SEO services starting at $499/mo. Results guaranteed.", ctr: 6.8, conversions: 98 },
              { headline: "Local SEO Experts | Dominate Your Market", description: "Get found by local customers. Google Business Profile optimization included.", ctr: 9.1, conversions: 187 },
            ].map((ad, index) => (
              <Card key={index} className="hover:border-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="info">Ad {index + 1}</Badge>
                    <button className="p-1 rounded hover:bg-bg-elevated text-text-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-accent font-medium mb-1">{ad.headline}</p>
                  <p className="text-sm text-text-secondary mb-4">{ad.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-text-muted">CTR:</span>
                      <span className="ml-1 font-mono text-text-primary">{ad.ctr}%</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Conv:</span>
                      <span className="ml-1 font-mono text-text-primary">{ad.conversions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ad Copy Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary">AI-Generated Ad Copy</p>
                    <p className="text-sm text-text-muted mt-1">
                      Based on your top-performing ads and competitor analysis, here are suggested headlines and descriptions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "Transform Your SEO | AI-Powered Strategies",
                  "SEO That Delivers ROI | Free Strategy Session",
                  "Outrank Your Competitors | Data-Driven SEO",
                ].map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <span className="text-text-primary">{suggestion}</span>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === "competitors" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Competitors Tracked"
              value={competitorAds.length}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              label="Total Est. Spend"
              value={`$${formatNumber(competitorAds.reduce((sum, c) => sum + c.estimatedSpend, 0))}`}
              icon={<DollarSign className="h-5 w-5" />}
            />
            <StatCard
              label="Keywords Overlap"
              value="234"
              icon={<Target className="h-5 w-5" />}
            />
            <StatCard
              label="Ad Positions"
              value="1-4"
              icon={<BarChart3 className="h-5 w-5" />}
              variant="accent"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Competitor Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorAds.map((ad) => (
                  <div 
                    key={ad.id} 
                    className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleViewAdDetail(ad)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="accent">Ad #{ad.position}</Badge>
                        <span className="font-medium text-text-primary">{ad.competitor}</span>
                        <Badge variant={ad.adStrength === "Excellent" ? "success" : "warning"}>
                          {ad.adStrength}
                        </Badge>
                      </div>
                      <span className="text-sm text-text-muted">
                        Est. spend: ${formatNumber(ad.estimatedSpend)}/mo
                      </span>
                    </div>
                    <p className="text-accent font-medium mb-1">{ad.headline}</p>
                    <p className="text-sm text-text-secondary mb-2">{ad.description}</p>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {ad.displayUrl}
                      </span>
                      <span>{ad.keywords} keywords</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shopping Tab */}
      {activeTab === "shopping" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Products Tracked"
              value={shoppingProducts.length}
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <StatCard
              label="Avg. Position"
              value="2.5"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <StatCard
              label="Total Clicks"
              value={formatNumber(shoppingProducts.reduce((sum, p) => sum + p.clicks, 0))}
              icon={<MousePointer className="h-5 w-5" />}
            />
            <StatCard
              label="Avg. Rating"
              value="4.6"
              icon={<TrendingUp className="h-5 w-5" />}
              variant="accent"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shopping Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Product</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Price</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Merchant</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Rating</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoppingProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4 font-medium text-text-primary">{product.title}</td>
                        <td className="p-4 text-center font-mono text-text-primary">${product.price}</td>
                        <td className="p-4 text-center text-text-secondary">{product.merchant}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-warning">★</span>
                            <span className="font-mono text-text-primary">{product.rating}</span>
                            <span className="text-text-muted text-xs">({product.reviews})</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={product.position <= 2 ? "success" : "neutral"}>
                            #{product.position}
                          </Badge>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(product.clicks)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trending Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingKeywords.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        trend.growth === "rising" ? "bg-success/10" : "bg-bg-card"
                      )}>
                        {trend.growth === "rising" ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : (
                          <LineChart className="h-5 w-5 text-text-muted" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{trend.keyword}</p>
                        <p className="text-sm text-text-muted">{formatNumber(trend.volume)} monthly searches</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={cn(
                          "font-mono font-semibold",
                          trend.growth === "rising" ? "text-success" : "text-text-primary"
                        )}>
                          {trend.growth === "rising" && "+"}
                          {trend.trend}%
                        </p>
                        <p className="text-xs text-text-muted">vs last month</p>
                      </div>
                      <Badge variant={trend.growth === "rising" ? "success" : "neutral"}>
                        {trend.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Trends Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 rounded-lg bg-bg-elevated text-center">
                <LineChart className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-primary font-medium mb-2">Trend Analysis Chart</p>
                <p className="text-sm text-text-muted mb-4">
                  Interactive trend visualization would appear here showing search interest over time.
                </p>
                <Button variant="secondary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Google Trends
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bid Adjustment Modal */}
      <Modal
        isOpen={showBidModal}
        onClose={() => { setShowBidModal(false); setSelectedKeyword(null); }}
        title="Adjust Bid"
        description={`Set your bid for "${selectedKeyword?.keyword}"`}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-bg-elevated">
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">${selectedKeyword?.cpc.toFixed(2)}</p>
              <p className="text-xs text-text-muted">Avg. CPC</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">{selectedKeyword?.position.toFixed(1)}</p>
              <p className="text-xs text-text-muted">Current Position</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">{selectedKeyword?.qualityScore}/10</p>
              <p className="text-xs text-text-muted">Quality Score</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              New Bid Amount ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
            />
          </div>

          <div className="p-3 rounded-lg bg-info/10 border border-info/20">
            <p className="text-sm text-info">
              <strong>Tip:</strong> Increasing your bid by $2.00 could improve your position to 1.5
            </p>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowBidModal(false); setSelectedKeyword(null); }}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleSaveBid}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Bid
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Campaign Modal */}
      <Modal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        title="Create Campaign"
        description="Set up a new PPC campaign"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Campaign Name
            </label>
            <Input placeholder="e.g., Brand Keywords Q2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Daily Budget ($)
              </label>
              <Input type="number" placeholder="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Campaign Type
              </label>
              <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary">
                <option>Search</option>
                <option>Display</option>
                <option>Shopping</option>
                <option>Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Keywords
            </label>
            <Input placeholder="Enter keywords, separated by commas" />
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowCampaignModal(false)}>
              Cancel
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Ad Detail Panel */}
      <SlidePanel
        isOpen={showAdDetailPanel}
        onClose={() => { setShowAdDetailPanel(false); setSelectedAd(null); }}
        title={selectedAd?.competitor || "Ad Details"}
        description="Competitor ad analysis"
        size="lg"
      >
        {selectedAd && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg border-2 border-accent bg-accent/5">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="accent">Ad #{selectedAd.position}</Badge>
                <Badge variant={selectedAd.adStrength === "Excellent" ? "success" : "warning"}>
                  {selectedAd.adStrength}
                </Badge>
              </div>
              <p className="text-accent font-medium text-lg mb-1">{selectedAd.headline}</p>
              <p className="text-text-secondary mb-2">{selectedAd.description}</p>
              <p className="text-sm text-success">{selectedAd.displayUrl}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">${formatNumber(selectedAd.estimatedSpend)}</p>
                <p className="text-sm text-text-muted">Est. Monthly Spend</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedAd.keywords}</p>
                <p className="text-sm text-text-muted">Keywords</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-muted mb-3">Keyword Overlap</h3>
              <div className="flex flex-wrap gap-2">
                {["seo services", "seo agency", "local seo", "technical seo"].map((kw) => (
                  <Badge key={kw} variant="neutral">{kw}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => { setShowAdDetailPanel(false); setSelectedAd(null); }}>
                Close
              </Button>
              <Button variant="accent">
                <Copy className="h-4 w-4 mr-2" />
                Copy Ad Structure
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Keyword Detail Panel */}
      <SlidePanel
        isOpen={showKeywordDetailPanel}
        onClose={() => { setShowKeywordDetailPanel(false); setSelectedKeyword(null); }}
        title={selectedKeyword?.keyword || "Keyword Details"}
        description="Keyword performance analysis"
        size="lg"
      >
        {selectedKeyword && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedKeyword.position.toFixed(1)}</p>
                <p className="text-sm text-text-muted">Position</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">${selectedKeyword.yourBid.toFixed(2)}</p>
                <p className="text-sm text-text-muted">Your Bid</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">{formatNumber(selectedKeyword.clicks)}</p>
                <p className="text-sm text-text-muted">Clicks</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedKeyword.conversions}</p>
                <p className="text-sm text-text-muted">Conversions</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-muted mb-3">Quality Score Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "Expected CTR", score: "Above Average", status: "success" },
                  { label: "Ad Relevance", score: "Average", status: "warning" },
                  { label: "Landing Page Experience", score: "Above Average", status: "success" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <span className="text-text-primary">{item.label}</span>
                    <Badge variant={item.status as "success" | "warning"}>{item.score}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-muted mb-3">Recommendations</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                  <p className="text-sm text-info">
                    <strong>Improve Ad Relevance:</strong> Include the keyword in your ad headline for better relevance.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-sm text-success">
                    <strong>Bid Opportunity:</strong> Increasing bid by $1.50 could move you to position 1.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => { setShowKeywordDetailPanel(false); setSelectedKeyword(null); }}>
                Close
              </Button>
              <Button variant="accent" onClick={() => {
                setShowKeywordDetailPanel(false);
                handleAdjustBid(selectedKeyword);
              }}>
                <DollarSign className="h-4 w-4 mr-2" />
                Adjust Bid
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
