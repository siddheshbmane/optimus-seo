"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Download,
  Filter,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Target,
  DollarSign,
  BarChart2,
  Sparkles,
  Star,
  StarOff,
  X,
  Check,
  Sliders,
  Zap,
  Layers,
  LineChart,
  Brain,
  Bot,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  TrendingUp as TrendUp,
  Calendar,
  Eye,
  ExternalLink,
  RefreshCw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { generateMockKeywords, type Keyword } from "@/data/mock-keywords";
import { useKeywordData } from "@/hooks/use-seo-data";
import { useProjectContext } from "@/contexts/project-context";
import { useProjectConfig } from "@/contexts/project-config-context";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { exportKeywords, type KeywordExportData } from "@/lib/export";
import {
  mockKeywordOpportunities,
  mockKeywordClusters,
  mockTrendPredictions,
  mockIntentClassifications,
  mockAIVolumeComparisons,
  getQuickWins,
  getStrategicTargets,
  getClusterStats,
  getIntentDistribution,
  type KeywordOpportunity,
  type KeywordCluster,
  type TrendPrediction,
  type IntentClassification,
  type AIVolumeComparison,
} from "@/data/mock-predictive-keywords";
import { formatNumber, getDifficultyColor, cn } from "@/lib/utils";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

type SortField = "keyword" | "volume" | "difficulty" | "cpc" | "position";
type SortDirection = "asc" | "desc";
type TabType = "overview" | "opportunities" | "clusters" | "trends" | "intent" | "ai-volume";

const keywordGroups = [
  { id: 1, name: "Primary Keywords", keywords: 25 },
  { id: 2, name: "Long-tail Opportunities", keywords: 78 },
  { id: 3, name: "Local Keywords", keywords: 34 },
  { id: 4, name: "Competitor Keywords", keywords: 156 },
  { id: 5, name: "Content Gap Keywords", keywords: 45 },
];

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 className="h-4 w-4" /> },
  { id: "opportunities", label: "Opportunities", icon: <Zap className="h-4 w-4" /> },
  { id: "clusters", label: "Clusters", icon: <Layers className="h-4 w-4" /> },
  { id: "trends", label: "Trends", icon: <LineChart className="h-4 w-4" /> },
  { id: "intent", label: "Intent", icon: <Brain className="h-4 w-4" /> },
  { id: "ai-volume", label: "AI Volume", icon: <Bot className="h-4 w-4" /> },
];

export default function KeywordResearchPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  const { config, addKeyword, addKeywords } = useProjectConfig();

  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("volume");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedKeywords, setSelectedKeywords] = React.useState<Set<string>>(new Set());
  const [starredKeywords, setStarredKeywords] = React.useState<Set<string>>(new Set(["1", "3", "5"]));
  
  // Modal states
  const [showFilters, setShowFilters] = React.useState(false);
  const [showAddToStrategy, setShowAddToStrategy] = React.useState(false);
  const [showDiscoverKeywords, setShowDiscoverKeywords] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [showClusterDetail, setShowClusterDetail] = React.useState(false);
  const [showTrendDetail, setShowTrendDetail] = React.useState(false);
  const [showIntentDetail, setShowIntentDetail] = React.useState(false);
  const [showOpportunityDetail, setShowOpportunityDetail] = React.useState(false);
  
  // Selected items for detail modals
  const [selectedCluster, setSelectedCluster] = React.useState<KeywordCluster | null>(null);
  const [selectedTrend, setSelectedTrend] = React.useState<TrendPrediction | null>(null);
  const [selectedIntent, setSelectedIntent] = React.useState<IntentClassification | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<KeywordOpportunity | null>(null);
  
  // Filter states
  const [filters, setFilters] = React.useState({
    minVolume: "",
    maxVolume: "",
    minDifficulty: "",
    maxDifficulty: "",
    minCpc: "",
    maxCpc: "",
    intent: "all",
    trend: "all",
    hasPosition: "all",
  });
  const [activeFilters, setActiveFilters] = React.useState<typeof filters>(filters);
  
  // Add to strategy state
  const [selectedGroup, setSelectedGroup] = React.useState<number | null>(null);
  
  // Discover keywords state
  const [seedKeyword, setSeedKeyword] = React.useState("");
  const [discoverType, setDiscoverType] = React.useState<"related" | "questions" | "longtail">("related");
  
  // Export state
  const [exportFormat, setExportFormat] = React.useState<"csv" | "json" | "html">("csv");

  // Keyword search/discover state
  const [isDiscovering, setIsDiscovering] = React.useState(false);
  const [discoveredKeywords, setDiscoveredKeywords] = React.useState<Keyword[]>([]);
  const [trackingFeedback, setTrackingFeedback] = React.useState<string | null>(null);

  const pageSize = 20;

  // Fetch keywords from API (with mock fallback)
  const { data: apiKeywords, isLoading: keywordsLoading, source: keywordsSource, refetch: refetchKeywords } = useKeywordData(
    project?.url || '',
    project?.locationCode || 2840
  );

  // Use API keywords if available, otherwise generate mock keywords
  const allKeywords: Keyword[] = React.useMemo(() => {
    if (apiKeywords && apiKeywords.length > 0) {
      // Transform API keywords to match Keyword type
      return apiKeywords.map((kw, index) => ({
        id: kw.id || String(index + 1),
        keyword: kw.keyword,
        volume: kw.volume,
        difficulty: kw.difficulty,
        cpc: kw.cpc,
        intent: kw.intent,
        trend: kw.trend || [],
        position: kw.position ?? 0,
        previousPosition: kw.previousPosition ?? 0,
        // Default values for fields not provided by API
        type: inferKeywordType(kw.keyword) as Keyword['type'],
        url: '/',
        featuredSnippet: false,
        paaQuestions: [],
      }));
    }
    // Fallback to mock data
    return generateMockKeywords(110);
  }, [apiKeywords]);

  // Helper function to infer keyword type from the keyword text
  function inferKeywordType(keyword: string): string {
    const words = keyword.split(' ').length;
    if (words >= 4) return 'long-tail';
    if (words === 1) return 'short-tail';
    // Check for common brand indicators
    const brandIndicators = ['corp', 'inc', 'llc', 'company', 'brand'];
    if (brandIndicators.some(indicator => keyword.toLowerCase().includes(indicator))) {
      return 'branded';
    }
    return 'generic';
  }

  if (!project) return null;

  // Apply filters
  const applyFilters = (keywords: Keyword[]) => {
    return keywords.filter((kw) => {
      if (activeFilters.minVolume && kw.volume < parseInt(activeFilters.minVolume)) return false;
      if (activeFilters.maxVolume && kw.volume > parseInt(activeFilters.maxVolume)) return false;
      if (activeFilters.minDifficulty && kw.difficulty < parseInt(activeFilters.minDifficulty)) return false;
      if (activeFilters.maxDifficulty && kw.difficulty > parseInt(activeFilters.maxDifficulty)) return false;
      if (activeFilters.minCpc && kw.cpc < parseFloat(activeFilters.minCpc)) return false;
      if (activeFilters.maxCpc && kw.cpc > parseFloat(activeFilters.maxCpc)) return false;
      if (activeFilters.intent !== "all" && kw.intent !== activeFilters.intent) return false;
      if (activeFilters.trend !== "all") {
        const trendDirection = kw.trend.length >= 2 
          ? kw.trend[kw.trend.length - 1] > kw.trend[0] ? "up" : kw.trend[kw.trend.length - 1] < kw.trend[0] ? "down" : "stable"
          : "stable";
        if (activeFilters.trend !== trendDirection) return false;
      }
      if (activeFilters.hasPosition === "ranking" && !kw.position) return false;
      if (activeFilters.hasPosition === "not-ranking" && kw.position) return false;
      return true;
    });
  };

  // Filter and sort keywords
  const filteredKeywords = applyFilters(allKeywords)
    .filter((kw) =>
      kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredKeywords.length / pageSize);
  const paginatedKeywords = filteredKeywords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleKeyword = (id: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedKeywords.size === paginatedKeywords.length) {
      setSelectedKeywords(new Set());
    } else {
      setSelectedKeywords(new Set(paginatedKeywords.map((kw) => kw.id)));
    }
  };

  const handleApplyFilters = () => {
    setActiveFilters(filters);
    setShowFilters(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      minVolume: "",
      maxVolume: "",
      minDifficulty: "",
      maxDifficulty: "",
      minCpc: "",
      maxCpc: "",
      intent: "all",
      trend: "all",
      hasPosition: "all",
    };
    setFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.entries(activeFilters).some(
    ([key, value]) => value !== "" && value !== "all"
  );

  const handleAddToStrategy = () => {
    // Get selected keyword texts and add to project config tracking
    const keywordsToAdd = allKeywords
      .filter(kw => selectedKeywords.has(kw.id))
      .map(kw => kw.keyword);

    if (keywordsToAdd.length > 0) {
      addKeywords(keywordsToAdd);
      setTrackingFeedback(`Added ${keywordsToAdd.length} keyword${keywordsToAdd.length > 1 ? 's' : ''} to tracking`);
      setTimeout(() => setTrackingFeedback(null), 3000);
    }

    setShowAddToStrategy(false);
    setSelectedGroup(null);
    setSelectedKeywords(new Set());
  };

  const handleAddSingleKeyword = (keyword: string) => {
    addKeyword(keyword);
    setTrackingFeedback(`"${keyword}" added to tracking`);
    setTimeout(() => setTrackingFeedback(null), 3000);
  };

  const handleDiscoverKeywords = async () => {
    if (!seedKeyword.trim()) return;

    setIsDiscovering(true);
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'keywordIdeas',
          params: {
            keyword: seedKeyword.trim(),
            locationCode: project?.locationCode || 2840,
            languageCode: 'en',
            limit: 50,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // Handle nested Labs structure: result[0].items[]
          const rawResult = result.tasks[0].result;
          const rawItems = rawResult[0]?.items || rawResult || [];
          const ideas = (Array.isArray(rawItems) ? rawItems : []).map((item: Record<string, unknown>, index: number) => {
            const kwInfo = (item.keyword_info as Record<string, unknown>) || {};
            return {
              id: `discovered-${index + 1}`,
              keyword: String(item.keyword || ''),
              volume: Number(kwInfo.search_volume || item.search_volume || 0),
              difficulty: Number(kwInfo.keyword_difficulty || item.keyword_difficulty || 50),
              cpc: Number(kwInfo.cpc || item.cpc || 0),
              intent: 'informational' as const,
              trend: [],
              position: 0,
              previousPosition: 0,
              type: 'generic' as Keyword['type'],
              url: '/',
              featuredSnippet: false,
              paaQuestions: [],
            };
          });
          setDiscoveredKeywords(ideas);
        }
      }
    } catch (error) {
      console.warn('Failed to discover keywords:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Stats
  const avgVolume = Math.round(
    allKeywords.reduce((sum, kw) => sum + kw.volume, 0) / allKeywords.length
  );
  const avgDifficulty = Math.round(
    allKeywords.reduce((sum, kw) => sum + kw.difficulty, 0) / allKeywords.length
  );
  const avgCpc =
    allKeywords.reduce((sum, kw) => sum + kw.cpc, 0) / allKeywords.length;
  const rankingKeywords = allKeywords.filter(
    (kw) => kw.position !== null && kw.position <= 100
  ).length;

  const clusterStats = getClusterStats();
  const intentDistribution = getIntentDistribution();
  const quickWins = getQuickWins();
  const strategicTargets = getStrategicTargets();

  const SortHeader = ({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium text-text-muted uppercase tracking-wider hover:text-text-primary transition-colors",
        className
      )}
    >
      {children}
      <ArrowUpDown
        className={cn(
          "h-3 w-3",
          sortField === field && "text-accent"
        )}
      />
    </button>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "opportunities":
        return renderOpportunitiesTab();
      case "clusters":
        return renderClustersTab();
      case "trends":
        return renderTrendsTab();
      case "intent":
        return renderIntentTab();
      case "ai-volume":
        return renderAIVolumeTab();
      default:
        return renderOverviewTab();
    }
  };

  // Overview Tab
  const renderOverviewTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Keywords"
          value={formatNumber(allKeywords.length)}
          trend={12.5}
          trendLabel="this month"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Volume"
          value={formatNumber(avgVolume)}
          trend={8.2}
          trendLabel="vs last month"
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Difficulty"
          value={avgDifficulty}
          trendLabel="out of 100"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. CPC"
          value={`$${avgCpc.toFixed(2)}`}
          trend={5.3}
          trendLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Button 
            variant={hasActiveFilters ? "accent" : "ghost"} 
            size="sm"
            onClick={() => setShowFilters(true)}
          >
            <Sliders className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="accent" className="ml-2 bg-white/20">
                {Object.entries(activeFilters).filter(([_, v]) => v !== "" && v !== "all").length}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        {selectedKeywords.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">
              {selectedKeywords.size} selected
            </span>
            <Button variant="accent" size="sm" onClick={() => setShowAddToStrategy(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add to Strategy
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowExportModal(true)}>
              Export Selected
            </Button>
          </div>
        )}
      </div>

      {/* Keywords Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-center w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedKeywords.size === paginatedKeywords.length &&
                        paginatedKeywords.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="p-4 text-center w-12"></th>
                  <th className="p-4 text-left">
                    <SortHeader field="keyword">Keyword</SortHeader>
                  </th>
                  <th className="p-4 text-center">
                    <SortHeader field="volume" className="justify-center">
                      Volume
                    </SortHeader>
                  </th>
                  <th className="p-4 text-center">
                    <SortHeader field="difficulty" className="justify-center">
                      Difficulty
                    </SortHeader>
                  </th>
                  <th className="p-4 text-center">
                    <SortHeader field="cpc" className="justify-center">
                      CPC
                    </SortHeader>
                  </th>
                  <th className="p-4 text-center">
                    <SortHeader field="position" className="justify-center">
                      Position
                    </SortHeader>
                  </th>
                  <th className="p-4 text-center">Trend</th>
                  <th className="p-4 text-center">Intent</th>
                  <th className="p-4 text-center">Track</th>
                </tr>
              </thead>
              <tbody>
                {paginatedKeywords.map((keyword) => (
                  <tr
                    key={keyword.id}
                    className={cn(
                      "border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer",
                      selectedKeywords.has(keyword.id) && "bg-accent/5"
                    )}
                    onClick={() => toggleKeyword(keyword.id)}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedKeywords.has(keyword.id)}
                        onChange={() => toggleKeyword(keyword.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => toggleStar(keyword.id, e)}
                        className="text-text-muted hover:text-warning transition-colors"
                      >
                        {starredKeywords.has(keyword.id) ? (
                          <Star className="h-4 w-4 fill-warning text-warning" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-text-primary">
                        {keyword.keyword}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-text-primary">
                        {formatNumber(keyword.volume)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "font-mono font-semibold",
                          getDifficultyColor(keyword.difficulty)
                        )}
                      >
                        {keyword.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-text-primary">
                        ${keyword.cpc.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {keyword.position ? (
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-text-primary">
                            {keyword.position}
                          </span>
                          {keyword.previousPosition !== keyword.position && (
                            <span
                              className={cn(
                                "flex items-center text-xs",
                                keyword.previousPosition > keyword.position
                                  ? "text-success"
                                  : "text-error"
                              )}
                            >
                              {keyword.previousPosition > keyword.position ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {Math.abs(keyword.previousPosition - keyword.position)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {(() => {
                        const trendDirection = keyword.trend.length >= 2 
                          ? keyword.trend[keyword.trend.length - 1] > keyword.trend[0] 
                            ? "up" 
                            : keyword.trend[keyword.trend.length - 1] < keyword.trend[0] 
                              ? "down" 
                              : "stable"
                          : "stable";
                        return (
                          <Badge
                            variant={
                              trendDirection === "up"
                                ? "success"
                                : trendDirection === "down"
                                ? "error"
                                : "neutral"
                            }
                          >
                            {trendDirection === "up" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : trendDirection === "down" ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : (
                              "—"
                            )}
                          </Badge>
                        );
                      })()}
                    </td>
                    <td className="p-4 text-center">
                      <Badge
                        variant={
                          keyword.intent === "transactional"
                            ? "accent"
                            : keyword.intent === "commercial"
                            ? "info"
                            : keyword.intent === "informational"
                            ? "neutral"
                            : "warning"
                        }
                      >
                        {keyword.intent.charAt(0).toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      {config?.keywords.some(k => k.keyword.toLowerCase() === keyword.keyword.toLowerCase()) ? (
                        <Badge variant="success" className="text-xs gap-1">
                          <Check className="h-3 w-3" />
                          Tracked
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSingleKeyword(keyword.keyword);
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredKeywords.length)} of{" "}
              {filteredKeywords.length} keywords
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                        currentPage === pageNum
                          ? "bg-accent text-white"
                          : "text-text-secondary hover:bg-bg-elevated"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Opportunities Tab
  const renderOpportunitiesTab = () => {
    const opportunityMatrixData = mockKeywordOpportunities.map(k => ({
      keyword: k.keyword,
      x: k.difficulty,
      y: k.volume,
      z: k.opportunityScore,
      quickWin: k.quickWin,
      strategic: k.strategicTarget,
    }));

    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Quick Wins"
            value={quickWins.length}
            trend={15}
            trendLabel="high opportunity"
            icon={<Zap className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            label="Strategic Targets"
            value={strategicTargets.length}
            trendLabel="long-term value"
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            label="Avg. Opportunity Score"
            value={Math.round(mockKeywordOpportunities.reduce((s, k) => s + k.opportunityScore, 0) / mockKeywordOpportunities.length)}
            trendLabel="out of 100"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            label="Est. Total Traffic"
            value={formatNumber(mockKeywordOpportunities.reduce((s, k) => s + k.estimatedTraffic, 0))}
            trend={22}
            trendLabel="potential"
            icon={<Eye className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Opportunity Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Opportunity Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Difficulty" 
                      domain={[0, 100]}
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      label={{ value: 'Difficulty', position: 'bottom', fill: 'var(--color-text-muted)' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Volume"
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      label={{ value: 'Volume', angle: -90, position: 'left', fill: 'var(--color-text-muted)' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[100, 500]} name="Score" />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-bg-primary border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-medium text-text-primary">{data.keyword}</p>
                              <p className="text-sm text-text-muted">Volume: {formatNumber(data.y)}</p>
                              <p className="text-sm text-text-muted">Difficulty: {data.x}</p>
                              <p className="text-sm text-accent">Score: {data.z}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      data={opportunityMatrixData} 
                      fill="#FD8C73"
                    >
                      {opportunityMatrixData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.quickWin ? '#10B981' : entry.strategic ? '#6366F1' : '#FD8C73'}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-text-muted">Quick Wins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-info" />
                  <span className="text-sm text-text-muted">Strategic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm text-text-muted">Other</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Wins List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-success" />
                Quick Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickWins.slice(0, 5).map((kw) => (
                  <button
                    key={kw.id}
                    onClick={() => {
                      setSelectedOpportunity(kw);
                      setShowOpportunityDetail(true);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/50 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{kw.keyword}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted">Vol: {formatNumber(kw.volume)}</span>
                        <span className="text-xs text-text-muted">KD: {kw.difficulty}</span>
                        <span className="text-xs text-text-muted">Pos: {kw.currentPosition || '—'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">{kw.opportunityScore}</Badge>
                      <ArrowRight className="h-4 w-4 text-text-muted" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Opportunities Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Opportunities</CardTitle>
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
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Score</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Est. Traffic</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {mockKeywordOpportunities.map((kw) => (
                    <tr
                      key={kw.id}
                      onClick={() => {
                        setSelectedOpportunity(kw);
                        setShowOpportunityDetail(true);
                      }}
                      className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-medium text-text-primary">{kw.keyword}</td>
                      <td className="p-4 text-center font-mono">{formatNumber(kw.volume)}</td>
                      <td className="p-4 text-center">
                        <span className={cn("font-mono font-semibold", getDifficultyColor(kw.difficulty))}>
                          {kw.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono">${kw.cpc.toFixed(2)}</td>
                      <td className="p-4 text-center font-mono">{kw.currentPosition || '—'}</td>
                      <td className="p-4 text-center">
                        <Badge variant={kw.opportunityScore >= 80 ? "success" : kw.opportunityScore >= 60 ? "warning" : "neutral"}>
                          {kw.opportunityScore}
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-mono">{formatNumber(kw.estimatedTraffic)}</td>
                      <td className="p-4 text-center">
                        {kw.quickWin && <Badge variant="success">Quick Win</Badge>}
                        {kw.strategicTarget && <Badge variant="info">Strategic</Badge>}
                        {!kw.quickWin && !kw.strategicTarget && <Badge variant="neutral">Standard</Badge>}
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
  };

  // Clusters Tab
  const renderClustersTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Topic Clusters"
          value={clusterStats.totalClusters}
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          label="Total Keywords"
          value={clusterStats.totalKeywords}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Total Volume"
          value={formatNumber(clusterStats.totalVolume)}
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          label="Content Gaps"
          value={clusterStats.contentGaps}
          trendLabel="opportunities"
          icon={<AlertCircle className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      {/* Cluster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockKeywordClusters.map((cluster) => (
          <Card 
            key={cluster.id} 
            className={cn(
              "cursor-pointer hover:border-accent/50 transition-colors",
              cluster.contentGap && "border-warning/50"
            )}
            onClick={() => {
              setSelectedCluster(cluster);
              setShowClusterDetail(true);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{cluster.name}</CardTitle>
                {cluster.contentGap && (
                  <Badge variant="warning">Content Gap</Badge>
                )}
              </div>
              <p className="text-sm text-text-muted">Parent: {cluster.parentKeyword}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-text-muted">Keywords</p>
                  <p className="text-lg font-semibold">{cluster.keywords.length}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Total Volume</p>
                  <p className="text-lg font-semibold">{formatNumber(cluster.totalVolume)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Avg. Difficulty</p>
                  <p className={cn("text-lg font-semibold", getDifficultyColor(cluster.avgDifficulty))}>
                    {cluster.avgDifficulty}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Topic Authority</p>
                  <p className="text-lg font-semibold text-accent">{cluster.topicAuthority}%</p>
                </div>
              </div>
              
              {/* Mini keyword list */}
              <div className="space-y-1">
                {cluster.keywords.slice(0, 3).map((kw, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary truncate">{kw.keyword}</span>
                    <span className="text-text-muted font-mono">{formatNumber(kw.volume)}</span>
                  </div>
                ))}
                {cluster.keywords.length > 3 && (
                  <p className="text-xs text-accent">+{cluster.keywords.length - 3} more</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cluster Authority Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Authority Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={mockKeywordClusters.map(c => ({
                name: c.name,
                authority: c.topicAuthority,
                volume: Math.round(c.totalVolume / 1000),
                keywords: c.keywords.length,
              }))}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                <Radar name="Authority" dataKey="authority" stroke="#FD8C73" fill="#FD8C73" fillOpacity={0.5} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Trends Tab
  const renderTrendsTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Rising Keywords"
          value={mockTrendPredictions.filter(t => t.trendDirection === 'rising').length}
          trend={25}
          trendLabel="growth"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Stable Keywords"
          value={mockTrendPredictions.filter(t => t.trendDirection === 'stable').length}
          icon={<LineChart className="h-5 w-5" />}
        />
        <StatCard
          label="Declining Keywords"
          value={mockTrendPredictions.filter(t => t.trendDirection === 'declining').length}
          trend={-18}
          trendLabel="decline"
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <StatCard
          label="Seasonal Keywords"
          value={mockTrendPredictions.filter(t => t.seasonality !== 'none').length}
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockTrendPredictions.slice(0, 4).map((trend) => (
          <Card 
            key={trend.keyword}
            className="cursor-pointer hover:border-accent/50 transition-colors"
            onClick={() => {
              setSelectedTrend(trend);
              setShowTrendDetail(true);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{trend.keyword}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={
                      trend.trendDirection === 'rising' ? 'success' :
                      trend.trendDirection === 'declining' ? 'error' : 'neutral'
                    }>
                      {trend.trendDirection === 'rising' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {trend.trendDirection === 'declining' && <TrendingDown className="h-3 w-3 mr-1" />}
                      {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                    </Badge>
                    {trend.seasonality !== 'none' && (
                      <Badge variant="warning">
                        <Calendar className="h-3 w-3 mr-1" />
                        {trend.seasonality} seasonality
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    ...trend.historicalVolume.map(h => ({ ...h, type: 'historical' })),
                    ...trend.predictedVolume.map(p => ({ ...p, type: 'predicted' })),
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-bg-primary border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-medium text-text-primary">{data.month}</p>
                              <p className="text-sm text-text-muted">Volume: {formatNumber(data.volume)}</p>
                              {data.confidence && (
                                <p className="text-sm text-accent">Confidence: {Math.round(data.confidence * 100)}%</p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#FD8C73" 
                      fill="#FD8C73" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Trends Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trend Predictions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Current Volume</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Predicted (90d)</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Growth Rate</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Seasonality</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {mockTrendPredictions.map((trend) => (
                  <tr
                    key={trend.keyword}
                    onClick={() => {
                      setSelectedTrend(trend);
                      setShowTrendDetail(true);
                    }}
                    className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-medium text-text-primary">{trend.keyword}</td>
                    <td className="p-4 text-center font-mono">
                      {formatNumber(trend.historicalVolume[trend.historicalVolume.length - 1].volume)}
                    </td>
                    <td className="p-4 text-center font-mono">
                      {formatNumber(trend.predictedVolume[trend.predictedVolume.length - 1].volume)}
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={
                        trend.growthRate > 10 ? 'success' :
                        trend.growthRate < -10 ? 'error' : 'neutral'
                      }>
                        {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={trend.seasonality === 'high' ? 'warning' : 'neutral'}>
                        {trend.seasonality}
                      </Badge>
                    </td>
                    <td className="p-4 text-center font-mono">
                      {Math.round(trend.predictedVolume[0].confidence * 100)}%
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

  // Intent Tab
  const renderIntentTab = () => {
    const intentData = [
      { name: 'Informational', value: intentDistribution.informational, color: '#6B7280' },
      { name: 'Navigational', value: intentDistribution.navigational, color: '#F59E0B' },
      { name: 'Transactional', value: intentDistribution.transactional, color: '#FD8C73' },
      { name: 'Commercial', value: intentDistribution.commercial, color: '#6366F1' },
    ];

    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Informational"
            value={intentDistribution.informational}
            icon={<Info className="h-5 w-5" />}
          />
          <StatCard
            label="Commercial"
            value={intentDistribution.commercial}
            icon={<DollarSign className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            label="Transactional"
            value={intentDistribution.transactional}
            icon={<Target className="h-5 w-5" />}
          />
          <StatCard
            label="Navigational"
            value={intentDistribution.navigational}
            icon={<ExternalLink className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Intent Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Intent Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={intentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {intentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Journey */}
          <Card>
            <CardHeader>
              <CardTitle>Buyer Journey Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['awareness', 'consideration', 'decision'].map((stage) => {
                  const count = mockIntentClassifications.filter(k => k.buyerJourneyStage === stage).length;
                  const percentage = Math.round((count / mockIntentClassifications.length) * 100);
                  return (
                    <div key={stage}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{stage}</span>
                        <span className="text-sm text-text-muted">{count} keywords ({percentage}%)</span>
                      </div>
                      <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            stage === 'awareness' ? 'bg-info' :
                            stage === 'consideration' ? 'bg-warning' : 'bg-success'
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-bg-elevated">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary">Content Strategy Insight</p>
                    <p className="text-sm text-text-muted mt-1">
                      Focus on creating more decision-stage content to capture high-intent traffic and improve conversion rates.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Intent Classifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Intent Classifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Primary Intent</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Confidence</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Buyer Stage</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Format</th>
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {mockIntentClassifications.map((intent) => (
                    <tr
                      key={intent.keyword}
                      onClick={() => {
                        setSelectedIntent(intent);
                        setShowIntentDetail(true);
                      }}
                      className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-medium text-text-primary">{intent.keyword}</td>
                      <td className="p-4 text-center">
                        <Badge variant={
                          intent.primaryIntent === 'transactional' ? 'accent' :
                          intent.primaryIntent === 'commercial' ? 'info' :
                          intent.primaryIntent === 'informational' ? 'neutral' : 'warning'
                        }>
                          {intent.primaryIntent}
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-mono">{Math.round(intent.intentConfidence * 100)}%</td>
                      <td className="p-4 text-center">
                        <Badge variant={
                          intent.buyerJourneyStage === 'decision' ? 'success' :
                          intent.buyerJourneyStage === 'consideration' ? 'warning' : 'info'
                        }>
                          {intent.buyerJourneyStage}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="neutral">{intent.suggestedFormat}</Badge>
                      </td>
                      <td className="p-4 text-sm text-text-secondary max-w-xs truncate">
                        {intent.contentRecommendation}
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
  };

  // AI Volume Tab
  const renderAIVolumeTab = () => {
    const comparisonData = mockAIVolumeComparisons.map(k => ({
      keyword: k.keyword.length > 20 ? k.keyword.substring(0, 20) + '...' : k.keyword,
      traditional: k.traditionalVolume,
      ai: k.aiVolume,
    }));

    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="High AI Opportunity"
            value={mockAIVolumeComparisons.filter(k => k.aiOpportunity === 'high').length}
            trend={45}
            trendLabel="AI growth"
            icon={<Bot className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            label="Avg. AI Growth Rate"
            value={`${Math.round(mockAIVolumeComparisons.reduce((s, k) => s + k.aiGrowthRate, 0) / mockAIVolumeComparisons.length)}%`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            label="Total AI Volume"
            value={formatNumber(mockAIVolumeComparisons.reduce((s, k) => s + k.aiVolume, 0))}
            icon={<BarChart2 className="h-5 w-5" />}
          />
          <StatCard
            label="AI > Traditional"
            value={mockAIVolumeComparisons.filter(k => k.aiVolume > k.traditionalVolume).length}
            trendLabel="keywords"
            icon={<Sparkles className="h-5 w-5" />}
          />
        </div>

        {/* AI vs Traditional Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              AI vs Traditional Search Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <YAxis dataKey="keyword" type="category" width={150} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-bg-primary border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium text-text-primary mb-2">{label}</p>
                            <p className="text-sm text-text-muted">Traditional: {formatNumber(payload[0].value as number)}</p>
                            <p className="text-sm text-accent">AI: {formatNumber(payload[1].value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="traditional" name="Traditional" fill="#6B7280" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="ai" name="AI Search" fill="#FD8C73" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['chatgpt', 'claude', 'gemini', 'perplexity'].map((platform) => {
                  const total = mockAIVolumeComparisons.reduce((s, k) => s + k.platformBreakdown[platform as keyof typeof k.platformBreakdown], 0);
                  const maxTotal = mockAIVolumeComparisons.reduce((s, k) => s + k.platformBreakdown.chatgpt, 0);
                  const percentage = Math.round((total / maxTotal) * 100);
                  return (
                    <div key={platform}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{platform}</span>
                        <span className="text-sm text-text-muted">{formatNumber(total)}</span>
                      </div>
                      <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            platform === 'chatgpt' ? 'bg-success' :
                            platform === 'claude' ? 'bg-accent' :
                            platform === 'gemini' ? 'bg-info' : 'bg-warning'
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High AI Opportunity Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAIVolumeComparisons.filter(k => k.aiOpportunity === 'high').slice(0, 5).map((kw) => (
                  <div key={kw.keyword} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-text-primary">{kw.keyword}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted">Traditional: {formatNumber(kw.traditionalVolume)}</span>
                        <span className="text-xs text-accent">AI: {formatNumber(kw.aiVolume)}</span>
                      </div>
                    </div>
                    <Badge variant="success">+{kw.aiGrowthRate}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full AI Volume Table */}
        <Card>
          <CardHeader>
            <CardTitle>AI Volume Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Traditional</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">AI Volume</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Growth</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">ChatGPT</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Claude</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Gemini</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Perplexity</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAIVolumeComparisons.map((kw) => (
                    <tr key={kw.keyword} className="border-b border-border hover:bg-bg-elevated transition-colors">
                      <td className="p-4 font-medium text-text-primary">{kw.keyword}</td>
                      <td className="p-4 text-center font-mono">{formatNumber(kw.traditionalVolume)}</td>
                      <td className="p-4 text-center font-mono text-accent">{formatNumber(kw.aiVolume)}</td>
                      <td className="p-4 text-center">
                        <Badge variant={kw.aiGrowthRate > 30 ? 'success' : kw.aiGrowthRate > 10 ? 'warning' : 'neutral'}>
                          +{kw.aiGrowthRate}%
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-mono text-sm">{formatNumber(kw.platformBreakdown.chatgpt)}</td>
                      <td className="p-4 text-center font-mono text-sm">{formatNumber(kw.platformBreakdown.claude)}</td>
                      <td className="p-4 text-center font-mono text-sm">{formatNumber(kw.platformBreakdown.gemini)}</td>
                      <td className="p-4 text-center font-mono text-sm">{formatNumber(kw.platformBreakdown.perplexity)}</td>
                      <td className="p-4 text-center">
                        <Badge variant={
                          kw.aiOpportunity === 'high' ? 'success' :
                          kw.aiOpportunity === 'medium' ? 'warning' : 'neutral'
                        }>
                          {kw.aiOpportunity}
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
  };

  return (
    <div className="space-y-6">
      {/* Tracking Feedback Toast */}
      {trackingFeedback && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-success text-white shadow-lg animate-in slide-in-from-right">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{trackingFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">
              Predictive Keyword Intelligence
            </h1>
            <DataSourceIndicator
              source={keywordsSource}
              isLoading={keywordsLoading}
              onRefresh={refetchKeywords}
              compact
            />
          </div>
          <p className="text-text-secondary">
            {formatNumber(allKeywords.length)} keywords tracked •{" "}
            {formatNumber(rankingKeywords)} ranking
            {config?.keywords.length ? ` • ${config.keywords.length} in tracking` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="accent" onClick={() => setShowDiscoverKeywords(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Discover Keywords
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
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

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Keywords"
        description="Apply filters to narrow down your keyword list"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search Volume
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min volume"
                value={filters.minVolume}
                onChange={(e) => setFilters({ ...filters, minVolume: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Max volume"
                value={filters.maxVolume}
                onChange={(e) => setFilters({ ...filters, maxVolume: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Keyword Difficulty (0-100)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min difficulty"
                value={filters.minDifficulty}
                onChange={(e) => setFilters({ ...filters, minDifficulty: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Max difficulty"
                value={filters.maxDifficulty}
                onChange={(e) => setFilters({ ...filters, maxDifficulty: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              CPC ($)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                step="0.01"
                placeholder="Min CPC"
                value={filters.minCpc}
                onChange={(e) => setFilters({ ...filters, minCpc: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Max CPC"
                value={filters.maxCpc}
                onChange={(e) => setFilters({ ...filters, maxCpc: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search Intent
            </label>
            <div className="flex flex-wrap gap-2">
              {["all", "transactional", "commercial", "informational", "navigational"].map((intent) => (
                <button
                  key={intent}
                  onClick={() => setFilters({ ...filters, intent })}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                    filters.intent === intent
                      ? "bg-accent text-white"
                      : "bg-bg-elevated text-text-secondary hover:bg-bg-elevated/80"
                  )}
                >
                  {intent === "all" ? "All Intents" : intent}
                </button>
              ))}
            </div>
          </div>

          <ModalFooter>
            <Button variant="ghost" onClick={() => {
              setFilters(activeFilters);
              setShowFilters(false);
            }}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button variant="accent" onClick={handleApplyFilters}>
              <Check className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Add to Strategy Modal */}
      <Modal
        isOpen={showAddToStrategy}
        onClose={() => setShowAddToStrategy(false)}
        title="Add to Keyword Strategy"
        description={`Add ${selectedKeywords.size} keyword${selectedKeywords.size > 1 ? "s" : ""} to a strategy group`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Select a Group
            </label>
            <div className="space-y-2">
              {keywordGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left",
                    selectedGroup === group.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <div>
                    <p className="font-medium text-text-primary">{group.name}</p>
                    <p className="text-sm text-text-muted">{group.keywords} keywords</p>
                  </div>
                  {selectedGroup === group.id && (
                    <Check className="h-5 w-5 text-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddToStrategy(false)}>
              Cancel
            </Button>
            <Button 
              variant="accent" 
              onClick={handleAddToStrategy}
              disabled={!selectedGroup}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Group
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Discover Keywords Modal */}
      <Modal
        isOpen={showDiscoverKeywords}
        onClose={() => setShowDiscoverKeywords(false)}
        title="Discover New Keywords"
        description="Find new keyword opportunities using AI"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Seed Keyword
            </label>
            <Input
              placeholder="Enter a seed keyword (e.g., 'seo services')"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Discovery Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "related", label: "Related Keywords", desc: "Semantically similar terms" },
                { value: "questions", label: "Questions", desc: "Question-based queries" },
                { value: "longtail", label: "Long-tail", desc: "Low competition phrases" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setDiscoverType(type.value as typeof discoverType)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-colors",
                    discoverType === type.value
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <p className="font-medium text-text-primary">{type.label}</p>
                  <p className="text-xs text-text-muted mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-bg-elevated">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">AI-Powered Discovery</p>
                <p className="text-sm text-text-muted mt-1">
                  Our AI will analyze search patterns, competitor keywords, and SERP data to find the best opportunities for your seed keyword.
                </p>
              </div>
            </div>
          </div>

          {/* Discovered Keywords Results */}
          {discoveredKeywords.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-text-primary">
                  Discovered Keywords ({discoveredKeywords.length})
                </h4>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => {
                    const kwTexts = discoveredKeywords.map(kw => kw.keyword);
                    addKeywords(kwTexts);
                    setTrackingFeedback(`Added ${kwTexts.length} keywords to tracking`);
                    setTimeout(() => setTrackingFeedback(null), 3000);
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Track All
                </Button>
              </div>
              <div className="max-h-[250px] overflow-y-auto space-y-1">
                {discoveredKeywords.slice(0, 20).map((kw) => (
                  <div key={kw.id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-text-primary">{kw.keyword}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">{formatNumber(kw.volume)} vol</span>
                      <span className={cn("text-xs font-mono", getDifficultyColor(kw.difficulty))}>{kw.difficulty} KD</span>
                      <span className="text-xs text-text-muted">${kw.cpc.toFixed(2)}</span>
                      {config?.keywords.some(k => k.keyword.toLowerCase() === kw.keyword.toLowerCase()) ? (
                        <Badge variant="success" className="text-xs"><Check className="h-3 w-3" /></Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1.5"
                          onClick={() => handleAddSingleKeyword(kw.keyword)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ModalFooter>
            <Button variant="secondary" onClick={() => {
              setShowDiscoverKeywords(false);
              setDiscoveredKeywords([]);
            }}>
              Cancel
            </Button>
            <Button
              variant="accent"
              disabled={!seedKeyword.trim() || isDiscovering}
              onClick={handleDiscoverKeywords}
            >
              {isDiscovering ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Discovering...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Discover Keywords
                </>
              )}
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Keywords"
        description={selectedKeywords.size > 0 ? `Export ${selectedKeywords.size} selected keywords` : "Export all keywords"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "csv" as const, label: "CSV", desc: "Spreadsheet format" },
                { value: "html" as const, label: "HTML", desc: "Print-ready report" },
                { value: "json" as const, label: "JSON", desc: "Developer format" },
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-colors",
                    exportFormat === format.value 
                      ? "border-accent bg-accent/10" 
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <p className="font-medium text-text-primary">{format.label}</p>
                  <p className="text-xs text-text-muted mt-1">{format.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="accent"
              onClick={() => {
                // Get keywords to export (selected or all)
                const keywordsToExport = selectedKeywords.size > 0
                  ? filteredKeywords.filter(kw => selectedKeywords.has(kw.id))
                  : filteredKeywords;
                
                // Transform to export format
                const exportData: KeywordExportData[] = keywordsToExport.map(kw => ({
                  keyword: kw.keyword,
                  volume: kw.volume,
                  difficulty: kw.difficulty,
                  cpc: kw.cpc,
                  position: kw.position || null,
                  intent: kw.intent,
                }));
                
                // Export with selected format
                const filename = `keywords-${project?.name || 'export'}-${new Date().toISOString().split('T')[0]}`;
                exportKeywords(exportData, exportFormat, filename);
                
                // Close modal
                setShowExportModal(false);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export {selectedKeywords.size > 0 ? selectedKeywords.size : filteredKeywords.length} Keywords
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Cluster Detail Modal */}
      <Modal
        isOpen={showClusterDetail}
        onClose={() => setShowClusterDetail(false)}
        title={selectedCluster?.name || "Cluster Details"}
        description={`Parent keyword: ${selectedCluster?.parentKeyword}`}
        size="lg"
      >
        {selectedCluster && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Keywords</p>
                <p className="text-xl font-semibold">{selectedCluster.keywords.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Total Volume</p>
                <p className="text-xl font-semibold">{formatNumber(selectedCluster.totalVolume)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Avg. Difficulty</p>
                <p className={cn("text-xl font-semibold", getDifficultyColor(selectedCluster.avgDifficulty))}>
                  {selectedCluster.avgDifficulty}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Topic Authority</p>
                <p className="text-xl font-semibold text-accent">{selectedCluster.topicAuthority}%</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text-primary mb-3">Keywords in Cluster</h4>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {selectedCluster.keywords.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        kw.relationship === 'parent' ? 'accent' :
                        kw.relationship === 'child' ? 'info' :
                        kw.relationship === 'sibling' ? 'warning' : 'neutral'
                      }>
                        {kw.relationship}
                      </Badge>
                      <span className="font-medium">{kw.keyword}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-text-muted">{formatNumber(kw.volume)}</span>
                      <span className={cn("text-sm font-mono", getDifficultyColor(kw.difficulty))}>
                        {kw.difficulty}
                      </span>
                      <span className="text-sm text-text-muted">{Math.round(kw.semanticScore * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowClusterDetail(false)}>
                Close
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  if (selectedCluster) {
                    const kwTexts = selectedCluster.keywords.map(kw => kw.keyword);
                    addKeywords(kwTexts);
                    setTrackingFeedback(`Added ${kwTexts.length} keywords from "${selectedCluster.name}" to tracking`);
                    setTimeout(() => setTrackingFeedback(null), 3000);
                    setShowClusterDetail(false);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add All to Tracking
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Trend Detail Modal */}
      <Modal
        isOpen={showTrendDetail}
        onClose={() => setShowTrendDetail(false)}
        title={selectedTrend?.keyword || "Trend Details"}
        size="lg"
      >
        {selectedTrend && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Growth Rate</p>
                <p className={cn(
                  "text-xl font-semibold",
                  selectedTrend.growthRate > 0 ? "text-success" : selectedTrend.growthRate < 0 ? "text-error" : ""
                )}>
                  {selectedTrend.growthRate > 0 ? '+' : ''}{selectedTrend.growthRate}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Seasonality</p>
                <p className="text-xl font-semibold capitalize">{selectedTrend.seasonality}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Volatility</p>
                <p className="text-xl font-semibold">{Math.round(selectedTrend.volatility * 100)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Direction</p>
                <p className="text-xl font-semibold capitalize">{selectedTrend.trendDirection}</p>
              </div>
            </div>

            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[
                  ...selectedTrend.historicalVolume.map(h => ({ ...h, type: 'historical' })),
                  ...selectedTrend.predictedVolume.map(p => ({ ...p, type: 'predicted' })),
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="volume" fill="#FD8C73" fillOpacity={0.3} stroke="#FD8C73" />
                  <Line type="monotone" dataKey="volume" stroke="#FD8C73" strokeWidth={2} dot={{ fill: '#FD8C73' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {selectedTrend.peakMonths.length > 0 && (
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="font-medium text-text-primary mb-2">Peak Months</p>
                <div className="flex gap-2">
                  {selectedTrend.peakMonths.map((month) => (
                    <Badge key={month} variant="accent">{month}</Badge>
                  ))}
                </div>
              </div>
            )}

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowTrendDetail(false)}>
                Close
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Intent Detail Modal */}
      <Modal
        isOpen={showIntentDetail}
        onClose={() => setShowIntentDetail(false)}
        title={selectedIntent?.keyword || "Intent Details"}
        size="md"
      >
        {selectedIntent && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Primary Intent</p>
                <Badge variant={
                  selectedIntent.primaryIntent === 'transactional' ? 'accent' :
                  selectedIntent.primaryIntent === 'commercial' ? 'info' :
                  selectedIntent.primaryIntent === 'informational' ? 'neutral' : 'warning'
                } className="mt-1">
                  {selectedIntent.primaryIntent}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Confidence</p>
                <p className="text-xl font-semibold">{Math.round(selectedIntent.intentConfidence * 100)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Buyer Stage</p>
                <Badge variant={
                  selectedIntent.buyerJourneyStage === 'decision' ? 'success' :
                  selectedIntent.buyerJourneyStage === 'consideration' ? 'warning' : 'info'
                } className="mt-1">
                  {selectedIntent.buyerJourneyStage}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Suggested Format</p>
                <Badge variant="neutral" className="mt-1">{selectedIntent.suggestedFormat}</Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="font-medium text-text-primary mb-2">Content Recommendation</p>
              <p className="text-sm text-text-secondary">{selectedIntent.contentRecommendation}</p>
            </div>

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowIntentDetail(false)}>
                Close
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  if (selectedIntent) {
                    handleAddSingleKeyword(selectedIntent.keyword);
                    setShowIntentDetail(false);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Tracking
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Opportunity Detail Modal */}
      <Modal
        isOpen={showOpportunityDetail}
        onClose={() => setShowOpportunityDetail(false)}
        title={selectedOpportunity?.keyword || "Opportunity Details"}
        size="md"
      >
        {selectedOpportunity && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Opportunity Score</p>
                <p className="text-2xl font-bold text-accent">{selectedOpportunity.opportunityScore}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Est. Traffic</p>
                <p className="text-xl font-semibold">{formatNumber(selectedOpportunity.estimatedTraffic)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Est. Value</p>
                <p className="text-xl font-semibold">${formatNumber(selectedOpportunity.estimatedValue)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-text-muted">Volume</p>
                <p className="text-lg font-semibold">{formatNumber(selectedOpportunity.volume)}</p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-text-muted">Difficulty</p>
                <p className={cn("text-lg font-semibold", getDifficultyColor(selectedOpportunity.difficulty))}>
                  {selectedOpportunity.difficulty}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-text-muted">CPC</p>
                <p className="text-lg font-semibold">${selectedOpportunity.cpc.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-text-muted">Current Position</p>
                <p className="text-lg font-semibold">{selectedOpportunity.currentPosition || 'Not ranking'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedOpportunity.quickWin && <Badge variant="success">Quick Win</Badge>}
              {selectedOpportunity.strategicTarget && <Badge variant="info">Strategic Target</Badge>}
              <Badge variant="neutral">CTR Potential: {Math.round(selectedOpportunity.ctrPotential * 100)}%</Badge>
              <Badge variant="neutral">Competition: {selectedOpportunity.competition}</Badge>
            </div>

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowOpportunityDetail(false)}>
                Close
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  if (selectedOpportunity) {
                    handleAddSingleKeyword(selectedOpportunity.keyword);
                    setShowOpportunityDetail(false);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Tracking
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
