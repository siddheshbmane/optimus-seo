"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Target,
  Plus,
  Filter,
  Download,
  TrendingUp,
  CheckCircle,
  Sparkles,
  MoreHorizontal,
  X,
  FileText,
  FolderPlus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { Input } from "@/components/ui/input";
import { useProjectContext } from "@/contexts/project-context";
import { useProjectConfig } from "@/contexts/project-config-context";
import { useKeywordData } from "@/hooks/use-seo-data";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, getDifficultyColor, cn } from "@/lib/utils";

interface KeywordGroup {
  id: number;
  name: string;
  description: string;
  keywords: number;
  avgVolume: number;
  avgDifficulty: number;
  status: "active" | "review" | "planned";
}

const initialKeywordGroups: KeywordGroup[] = [
  {
    id: 1,
    name: "Primary Keywords",
    description: "High-priority target keywords",
    keywords: 25,
    avgVolume: 12500,
    avgDifficulty: 65,
    status: "active",
  },
  {
    id: 2,
    name: "Long-tail Opportunities",
    description: "Lower competition, high intent",
    keywords: 78,
    avgVolume: 2800,
    avgDifficulty: 35,
    status: "active",
  },
  {
    id: 3,
    name: "Local Keywords",
    description: "Location-based search terms",
    keywords: 34,
    avgVolume: 1500,
    avgDifficulty: 28,
    status: "active",
  },
  {
    id: 4,
    name: "Competitor Keywords",
    description: "Keywords competitors rank for",
    keywords: 156,
    avgVolume: 8200,
    avgDifficulty: 58,
    status: "review",
  },
  {
    id: 5,
    name: "Content Gap Keywords",
    description: "Missing from current content",
    keywords: 45,
    avgVolume: 5600,
    avgDifficulty: 42,
    status: "planned",
  },
];

const initialPrioritizedKeywords = [
  { id: 1, keyword: "seo services", volume: 14800, difficulty: 72, priority: "high", status: "targeting", content: 3 },
  { id: 2, keyword: "local seo optimization", volume: 6700, difficulty: 52, priority: "high", status: "targeting", content: 2 },
  { id: 3, keyword: "technical seo audit", volume: 5600, difficulty: 55, priority: "high", status: "ranking", content: 1 },
  { id: 4, keyword: "seo consultant", volume: 9800, difficulty: 58, priority: "medium", status: "targeting", content: 1 },
  { id: 5, keyword: "link building service", volume: 4200, difficulty: 61, priority: "medium", status: "planned", content: 0 },
  { id: 6, keyword: "content marketing strategy", volume: 12300, difficulty: 64, priority: "medium", status: "planned", content: 0 },
  { id: 7, keyword: "keyword research tools", volume: 18500, difficulty: 68, priority: "low", status: "monitoring", content: 1 },
  { id: 8, keyword: "on-page seo checklist", volume: 8900, difficulty: 45, priority: "high", status: "targeting", content: 2 },
];

const statusConfig = {
  targeting: { label: "Targeting", variant: "info" as const },
  ranking: { label: "Ranking", variant: "success" as const },
  planned: { label: "Planned", variant: "neutral" as const },
  monitoring: { label: "Monitoring", variant: "warning" as const },
};

export default function KeywordStrategyPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  const { addKeyword } = useProjectConfig();

  const [keywordGroups, setKeywordGroups] = React.useState(initialKeywordGroups);
  const [prioritizedKeywords, setPrioritizedKeywords] = React.useState(initialPrioritizedKeywords);
  const [showNewGroupModal, setShowNewGroupModal] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [showGroupDetail, setShowGroupDetail] = React.useState<KeywordGroup | null>(null);
  const [showActionDropdown, setShowActionDropdown] = React.useState<number | null>(null);
  const [filterPriority, setFilterPriority] = React.useState<string>("all");
  const [newGroup, setNewGroup] = React.useState({
    name: "",
    description: "",
  });
  
  // Action modal states
  const [showCreateBriefModal, setShowCreateBriefModal] = React.useState(false);
  const [showAddToGroupModal, setShowAddToGroupModal] = React.useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = React.useState(false);
  const [selectedKeyword, setSelectedKeyword] = React.useState<typeof initialPrioritizedKeywords[0] | null>(null);
  const [selectedGroupForAdd, setSelectedGroupForAdd] = React.useState<number | null>(null);
  
  // AI Suggestions modal
  const [showAISuggestions, setShowAISuggestions] = React.useState(false);
  
  // Export modal
  const [showExportModal, setShowExportModal] = React.useState(false);

  // Fetch keyword data from API (with mock fallback)
  const { data: apiKeywords, isLoading: keywordsLoading, source: keywordsSource, refetch: refetchKeywords } = useKeywordData(
    project?.url || ''
  );

  // Transform API keywords to prioritized format
  const apiPrioritizedKeywords = React.useMemo(() => {
    if (apiKeywords && apiKeywords.length > 0) {
      return apiKeywords.slice(0, 20).map((kw, index) => ({
        id: index + 1,
        keyword: kw.keyword,
        volume: kw.volume,
        difficulty: kw.difficulty,
        priority: kw.volume > 10000 ? "high" : kw.volume > 5000 ? "medium" : "low",
        status: kw.position && kw.position <= 10 ? "ranking" : kw.position ? "targeting" : "planned",
        content: Math.floor(Math.random() * 3),
      }));
    }
    return null;
  }, [apiKeywords]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowActionDropdown(null);
    if (showActionDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showActionDropdown]);

  if (!project) return null;

  const totalKeywords = keywordGroups.reduce((sum, g) => sum + g.keywords, 0);
  
  // Use API keywords if available, otherwise use state
  const keywordsToUse = apiPrioritizedKeywords || prioritizedKeywords;
  
  const filteredKeywords = filterPriority === "all" 
    ? keywordsToUse 
    : keywordsToUse.filter(k => k.priority === filterPriority);

  const handleAddGroup = () => {
    const group: KeywordGroup = {
      id: keywordGroups.length + 1,
      name: newGroup.name,
      description: newGroup.description,
      keywords: 0,
      avgVolume: 0,
      avgDifficulty: 0,
      status: "planned",
    };
    setKeywordGroups([...keywordGroups, group]);
    setShowNewGroupModal(false);
    setNewGroup({ name: "", description: "" });
  };

  const handleActionClick = (action: string, keyword: typeof initialPrioritizedKeywords[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedKeyword(keyword);
    setShowActionDropdown(null);
    
    switch (action) {
      case "create-brief":
        setShowCreateBriefModal(true);
        break;
      case "add-to-group":
        setShowAddToGroupModal(true);
        break;
      case "view-serp":
        router.push(`/projects/${projectId}/strategy/serp-analysis?keyword=${encodeURIComponent(keyword.keyword)}`);
        break;
      case "remove":
        setShowRemoveConfirm(true);
        break;
    }
  };

  const handleRemoveKeyword = () => {
    if (selectedKeyword) {
      setPrioritizedKeywords(prev => prev.filter(k => k.id !== selectedKeyword.id));
      setShowRemoveConfirm(false);
      setSelectedKeyword(null);
    }
  };

  const handleAddToGroup = () => {
    // In a real app, this would add the keyword to the selected group
    setShowAddToGroupModal(false);
    setSelectedGroupForAdd(null);
    setSelectedKeyword(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Keyword Strategy</h1>
            <DataSourceIndicator source={keywordsSource} isLoading={keywordsLoading} onRefresh={refetchKeywords} compact />
          </div>
          <p className="text-text-secondary">
            Plan and prioritize your target keywords
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="accent" onClick={() => setShowAISuggestions(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Suggestions
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Keywords"
          value={formatNumber(totalKeywords)}
          trend={12}
          trendLabel="this month"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Keyword Groups"
          value={keywordGroups.length}
          trendLabel="active groups"
          icon={<Filter className="h-5 w-5" />}
        />
        <StatCard
          label="High Priority"
          value={prioritizedKeywords.filter(k => k.priority === "high").length}
          trendLabel="keywords"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Currently Ranking"
          value={prioritizedKeywords.filter(k => k.status === "ranking").length}
          trend={3}
          trendLabel="vs last month"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Keyword Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Keyword Groups</h2>
          <Button variant="secondary" size="sm" onClick={() => setShowNewGroupModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keywordGroups.map((group) => (
            <Card 
              key={group.id} 
              className="hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => setShowGroupDetail(group)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-text-primary">{group.name}</h3>
                    <p className="text-sm text-text-muted">{group.description}</p>
                  </div>
                  <Badge variant={group.status === "active" ? "success" : group.status === "review" ? "warning" : "neutral"}>
                    {group.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-bg-elevated">
                    <p className="text-lg font-semibold text-text-primary">{group.keywords}</p>
                    <p className="text-xs text-text-muted">Keywords</p>
                  </div>
                  <div className="p-2 rounded bg-bg-elevated">
                    <p className="text-lg font-semibold text-text-primary">{formatNumber(group.avgVolume)}</p>
                    <p className="text-xs text-text-muted">Avg Vol</p>
                  </div>
                  <div className="p-2 rounded bg-bg-elevated">
                    <p className={cn("text-lg font-semibold", getDifficultyColor(group.avgDifficulty))}>
                      {group.avgDifficulty}
                    </p>
                    <p className="text-xs text-text-muted">Avg KD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Prioritized Keywords */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Prioritized Keywords</CardTitle>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {filterPriority !== "all" && (
                <Badge variant="accent" className="ml-2">{filterPriority}</Badge>
              )}
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {["all", "high", "medium", "low"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => { setFilterPriority(priority); setShowFilterDropdown(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md capitalize",
                        filterPriority === priority ? "bg-accent/10 text-accent" : "hover:bg-bg-elevated"
                      )}
                    >
                      {priority === "all" ? "All Priorities" : `${priority} Priority`}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Priority</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Content</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((kw) => (
                  <tr key={kw.id} className="border-b border-border hover:bg-bg-elevated">
                    <td className="p-4 font-medium text-text-primary">{kw.keyword}</td>
                    <td className="p-4 text-center font-mono text-text-primary">{formatNumber(kw.volume)}</td>
                    <td className="p-4 text-center">
                      <span className={cn("font-mono font-semibold", getDifficultyColor(kw.difficulty))}>
                        {kw.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={kw.priority === "high" ? "error" : kw.priority === "medium" ? "warning" : "neutral"}>
                        {kw.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={statusConfig[kw.status as keyof typeof statusConfig].variant}>
                        {statusConfig[kw.status as keyof typeof statusConfig].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      {kw.content > 0 ? `${kw.content} pieces` : "—"}
                    </td>
                    <td className="p-4 text-center relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionDropdown(showActionDropdown === kw.id ? null : kw.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {showActionDropdown === kw.id && (
                        <div 
                          className="absolute right-4 mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-1">
                            <button 
                              onClick={(e) => handleActionClick("create-brief", kw, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left"
                            >
                              <FileText className="h-4 w-4 text-text-muted" />
                              Create Content Brief
                            </button>
                            <button 
                              onClick={(e) => handleActionClick("add-to-group", kw, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left"
                            >
                              <FolderPlus className="h-4 w-4 text-text-muted" />
                              Add to Group
                            </button>
                            <button 
                              onClick={(e) => handleActionClick("view-serp", kw, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left"
                            >
                              <Search className="h-4 w-4 text-text-muted" />
                              View SERP Analysis
                            </button>
                            <div className="border-t border-border my-1" />
                            <button 
                              onClick={(e) => handleActionClick("remove", kw, e)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left text-error"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Keyword
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Group Modal */}
      <Modal
        isOpen={showNewGroupModal}
        onClose={() => setShowNewGroupModal(false)}
        title="Create Keyword Group"
        description="Organize your keywords into groups"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Group Name
            </label>
            <Input 
              placeholder="e.g., Primary Keywords"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <Input 
              placeholder="e.g., High-priority target keywords"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
            />
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowNewGroupModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddGroup} disabled={!newGroup.name.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Group Detail Panel */}
      <SlidePanel
        isOpen={!!showGroupDetail}
        onClose={() => setShowGroupDetail(null)}
        title={showGroupDetail?.name || "Group Details"}
        description={showGroupDetail?.description}
        size="lg"
      >
        {showGroupDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">{showGroupDetail.keywords}</p>
                <p className="text-sm text-text-muted">Keywords</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className="text-2xl font-bold text-text-primary">{formatNumber(showGroupDetail.avgVolume)}</p>
                <p className="text-sm text-text-muted">Avg Volume</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated text-center">
                <p className={cn("text-2xl font-bold", getDifficultyColor(showGroupDetail.avgDifficulty))}>
                  {showGroupDetail.avgDifficulty}
                </p>
                <p className="text-sm text-text-muted">Avg Difficulty</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-3">Keywords in this group</h3>
              <div className="space-y-2">
                {prioritizedKeywords.slice(0, 5).map((kw) => (
                  <div key={kw.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <span className="font-medium text-text-primary">{kw.keyword}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-muted">{formatNumber(kw.volume)}</span>
                      <Badge variant={kw.priority === "high" ? "error" : kw.priority === "medium" ? "warning" : "neutral"}>
                        {kw.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => setShowGroupDetail(null)}>
                Close
              </Button>
              <Button variant="accent">
                <Plus className="h-4 w-4 mr-2" />
                Add Keywords
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Create Content Brief Modal */}
      <Modal
        isOpen={showCreateBriefModal}
        onClose={() => { setShowCreateBriefModal(false); setSelectedKeyword(null); }}
        title="Create Content Brief"
        description={`Create a content brief for "${selectedKeyword?.keyword}"`}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-bg-elevated">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-text-primary">{formatNumber(selectedKeyword?.volume || 0)}</p>
                <p className="text-xs text-text-muted">Volume</p>
              </div>
              <div>
                <p className={cn("text-lg font-semibold", getDifficultyColor(selectedKeyword?.difficulty || 0))}>
                  {selectedKeyword?.difficulty}
                </p>
                <p className="text-xs text-text-muted">Difficulty</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-text-primary capitalize">{selectedKeyword?.priority}</p>
                <p className="text-xs text-text-muted">Priority</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Blog Post", "Landing Page", "Guide"].map((type) => (
                <button
                  key={type}
                  className="p-3 rounded-lg border border-border hover:border-accent/50 text-sm font-medium text-text-primary transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowCreateBriefModal(false); setSelectedKeyword(null); }}>
              Cancel
            </Button>
            <Button 
              variant="accent"
              onClick={() => {
                setShowCreateBriefModal(false);
                setSelectedKeyword(null);
                router.push(`/projects/${projectId}/strategy/content-briefs`);
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Create Brief
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Add to Group Modal */}
      <Modal
        isOpen={showAddToGroupModal}
        onClose={() => { setShowAddToGroupModal(false); setSelectedKeyword(null); setSelectedGroupForAdd(null); }}
        title="Add to Group"
        description={`Add "${selectedKeyword?.keyword}" to a keyword group`}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {keywordGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroupForAdd(group.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left",
                  selectedGroupForAdd === group.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <div>
                  <p className="font-medium text-text-primary">{group.name}</p>
                  <p className="text-sm text-text-muted">{group.keywords} keywords</p>
                </div>
                {selectedGroupForAdd === group.id && (
                  <CheckCircle className="h-5 w-5 text-accent" />
                )}
              </button>
            ))}
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowAddToGroupModal(false); setSelectedKeyword(null); setSelectedGroupForAdd(null); }}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddToGroup} disabled={!selectedGroupForAdd}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Add to Group
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={showRemoveConfirm}
        onClose={() => { setShowRemoveConfirm(false); setSelectedKeyword(null); }}
        title="Remove Keyword"
        description={`Are you sure you want to remove "${selectedKeyword?.keyword}" from your strategy?`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This action cannot be undone. The keyword will be removed from all groups and your prioritized list.
          </p>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowRemoveConfirm(false); setSelectedKeyword(null); }}>
              Cancel
            </Button>
            <Button variant="accent" className="bg-error hover:bg-error/90" onClick={handleRemoveKeyword}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* AI Suggestions Modal */}
      <Modal
        isOpen={showAISuggestions}
        onClose={() => setShowAISuggestions(false)}
        title="AI Keyword Suggestions"
        description="Get AI-powered keyword recommendations based on your strategy"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">Analyzing your keyword strategy...</p>
                <p className="text-sm text-text-muted mt-1">
                  Our AI is reviewing your current keywords, competitor data, and search trends to find new opportunities.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Suggested Keywords</h3>
            <div className="space-y-2">
              {[
                { keyword: "enterprise seo solutions", volume: 2400, difficulty: 58, reason: "Low competition, high intent" },
                { keyword: "seo roi calculator", volume: 1800, difficulty: 35, reason: "Content gap opportunity" },
                { keyword: "b2b seo strategy", volume: 3200, difficulty: 52, reason: "Trending in your industry" },
              ].map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div>
                    <p className="font-medium text-text-primary">{suggestion.keyword}</p>
                    <p className="text-xs text-text-muted">{suggestion.reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-mono text-text-primary">{formatNumber(suggestion.volume)}</p>
                      <p className={cn("text-xs font-mono", getDifficultyColor(suggestion.difficulty))}>
                        KD: {suggestion.difficulty}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => addKeyword(suggestion.keyword)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAISuggestions(false)}>
              Close
            </Button>
            <Button variant="accent">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate More
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Keyword Strategy"
        description="Export your keyword strategy data"
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
                { value: "pdf", label: "PDF", desc: "Report format" },
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

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Include
            </label>
            <div className="space-y-2">
              {["Keyword Groups", "Prioritized Keywords", "Performance Metrics", "AI Recommendations"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                  <span className="text-sm text-text-primary">{item}</span>
                </label>
              ))}
            </div>
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
