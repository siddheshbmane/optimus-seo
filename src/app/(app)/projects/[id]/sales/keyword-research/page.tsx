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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { getProjectById } from "@/data/mock-projects";
import { mockKeywords, generateMockKeywords, type Keyword } from "@/data/mock-keywords";
import { formatNumber, getDifficultyColor, cn } from "@/lib/utils";

type SortField = "keyword" | "volume" | "difficulty" | "cpc" | "position";
type SortDirection = "asc" | "desc";

const keywordGroups = [
  { id: 1, name: "Primary Keywords", keywords: 25 },
  { id: 2, name: "Long-tail Opportunities", keywords: 78 },
  { id: 3, name: "Local Keywords", keywords: 34 },
  { id: 4, name: "Competitor Keywords", keywords: 156 },
  { id: 5, name: "Content Gap Keywords", keywords: 45 },
];

export default function KeywordResearchPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

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

  const pageSize = 20;

  // Generate more keywords for demo
  const allKeywords = React.useMemo(() => {
    return generateMockKeywords(110);
  }, []);

  if (!project) return null;

  // Apply filters
  const applyFilters = (keywords: Keyword[]) => {
    return keywords.filter((kw) => {
      // Volume filter
      if (activeFilters.minVolume && kw.volume < parseInt(activeFilters.minVolume)) return false;
      if (activeFilters.maxVolume && kw.volume > parseInt(activeFilters.maxVolume)) return false;
      
      // Difficulty filter
      if (activeFilters.minDifficulty && kw.difficulty < parseInt(activeFilters.minDifficulty)) return false;
      if (activeFilters.maxDifficulty && kw.difficulty > parseInt(activeFilters.maxDifficulty)) return false;
      
      // CPC filter
      if (activeFilters.minCpc && kw.cpc < parseFloat(activeFilters.minCpc)) return false;
      if (activeFilters.maxCpc && kw.cpc > parseFloat(activeFilters.maxCpc)) return false;
      
      // Intent filter
      if (activeFilters.intent !== "all" && kw.intent !== activeFilters.intent) return false;
      
      // Trend filter
      if (activeFilters.trend !== "all") {
        const trendDirection = kw.trend.length >= 2 
          ? kw.trend[kw.trend.length - 1] > kw.trend[0] ? "up" : kw.trend[kw.trend.length - 1] < kw.trend[0] ? "down" : "stable"
          : "stable";
        if (activeFilters.trend !== trendDirection) return false;
      }
      
      // Position filter
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
    // In a real app, this would add keywords to the selected group
    setShowAddToStrategy(false);
    setSelectedGroup(null);
    setSelectedKeywords(new Set());
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Keyword Research
          </h1>
          <p className="text-text-secondary">
            {formatNumber(allKeywords.length)} keywords tracked •{" "}
            {formatNumber(rankingKeywords)} ranking
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

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Keywords"
        description="Apply filters to narrow down your keyword list"
        size="lg"
      >
        <div className="space-y-6">
          {/* Volume Range */}
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

          {/* Difficulty Range */}
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

          {/* CPC Range */}
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

          {/* Intent Filter */}
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

          {/* Trend Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Trend Direction
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Trends" },
                { value: "up", label: "Trending Up" },
                { value: "down", label: "Trending Down" },
                { value: "stable", label: "Stable" },
              ].map((trend) => (
                <button
                  key={trend.value}
                  onClick={() => setFilters({ ...filters, trend: trend.value })}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filters.trend === trend.value
                      ? "bg-accent text-white"
                      : "bg-bg-elevated text-text-secondary hover:bg-bg-elevated/80"
                  )}
                >
                  {trend.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Ranking Status
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Keywords" },
                { value: "ranking", label: "Currently Ranking" },
                { value: "not-ranking", label: "Not Ranking" },
              ].map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setFilters({ ...filters, hasPosition: pos.value })}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filters.hasPosition === pos.value
                      ? "bg-accent text-white"
                      : "bg-bg-elevated text-text-secondary hover:bg-bg-elevated/80"
                  )}
                >
                  {pos.label}
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

          <div className="p-3 rounded-lg bg-bg-elevated">
            <p className="text-sm text-text-muted">
              <strong className="text-text-primary">{selectedKeywords.size}</strong> keywords will be added to the selected group
            </p>
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

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowDiscoverKeywords(false)}>
              Cancel
            </Button>
            <Button variant="accent" disabled={!seedKeyword.trim()}>
              <Sparkles className="h-4 w-4 mr-2" />
              Discover Keywords
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
                { value: "csv", label: "CSV", desc: "Spreadsheet format" },
                { value: "xlsx", label: "Excel", desc: "Microsoft Excel" },
                { value: "json", label: "JSON", desc: "Developer format" },
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

          <div className="p-3 rounded-lg bg-bg-elevated">
            <p className="text-sm text-text-muted">
              {selectedKeywords.size > 0 
                ? `${selectedKeywords.size} keywords will be exported`
                : `${filteredKeywords.length} keywords will be exported`
              }
            </p>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
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
