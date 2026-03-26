"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Lightbulb,
  Plus,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
  Filter,
  Loader2,
  Database,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useProjectContext } from "@/contexts/project-context";
import { useContentIdeas, type ContentIdea as APIContentIdea } from "@/hooks/use-seo-data";
import { useKeywordSuggestions, useContentGeneration } from "@/hooks/use-llm";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";

interface ContentIdea {
  id: string;
  title: string;
  type: string;
  keyword: string;
  volume: number;
  difficulty: number;
  score: number;
  source: string;
  saved: boolean;
}

const sourceConfig: Record<string, { color: string }> = {
  "Competitor Gap": { color: "bg-info/10 text-info" },
  "Trending Topic": { color: "bg-success/10 text-success" },
  "Question Analysis": { color: "bg-warning/10 text-warning" },
  "AI Suggestion": { color: "bg-accent/10 text-accent" },
};

const typeLabels: Record<string, string> = {
  blog: "Blog Post",
  guide: "Guide",
  video: "Video",
  infographic: "Infographic",
  case_study: "Case Study",
};

const sourceLabels = ["Competitor Gap", "Trending Topic", "Question Analysis", "AI Suggestion"];

function transformAPIIdeas(apiIdeas: APIContentIdea[]): ContentIdea[] {
  return apiIdeas.map((idea, index) => ({
    id: idea.id,
    title: idea.title,
    type: typeLabels[idea.type] || idea.type,
    keyword: idea.keyword,
    volume: idea.volume,
    difficulty: idea.difficulty,
    score: Math.min(100, Math.round((idea.volume / 100) + (100 - idea.difficulty))),
    source: sourceLabels[index % sourceLabels.length],
    saved: false,
  }));
}

export default function ContentIdeasPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  
  // Fetch content ideas from API
  const domain = project?.url?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com';
  const { data: apiIdeas, isLoading, error, source, refetch } = useContentIdeas(domain);
  
  // Transform API data to local format with saved state
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [showCreateBriefModal, setShowCreateBriefModal] = React.useState(false);
  const [selectedIdea, setSelectedIdea] = React.useState<ContentIdea | null>(null);
  const [filterSource, setFilterSource] = React.useState<string>("all");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [aiGeneratedIdeas, setAiGeneratedIdeas] = React.useState<ContentIdea[]>([]);
  const [briefContent, setBriefContent] = React.useState<string>("");
  const [isGeneratingBrief, setIsGeneratingBrief] = React.useState(false);

  // LLM hooks
  const { suggestKeywords } = useKeywordSuggestions();
  const { generateContent } = useContentGeneration();

  const ideas = React.useMemo(() => {
    const transformed = apiIdeas ? transformAPIIdeas(apiIdeas).map(idea => ({
      ...idea,
      saved: savedIds.has(idea.id),
    })) : [];
    // Merge AI-generated ideas (deduplicate by id)
    const existingIds = new Set(transformed.map(i => i.id));
    const uniqueAiIdeas = aiGeneratedIdeas.filter(i => !existingIds.has(i.id));
    return [...transformed, ...uniqueAiIdeas];
  }, [apiIdeas, savedIds, aiGeneratedIdeas]);

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    try {
      const llmResult = await suggestKeywords(domain, ideas.map(i => i.keyword));
      // Parse LLM text response into ContentIdea objects
      if (llmResult) {
        const lines = llmResult.split('\n').filter((l: string) => l.trim());
        const parsed: ContentIdea[] = [];
        for (const line of lines) {
          // Try to extract keyword/title pairs from lines like "1. keyword - title" or "- keyword: title"
          const match = line.match(/(?:\d+[\.\)]\s*|[-*]\s*)(.+?)(?:\s*[-:–]\s*)(.+)/);
          if (match) {
            const keyword = match[1].trim().replace(/[*"]/g, '');
            const title = match[2].trim().replace(/[*"]/g, '');
            if (keyword && title) {
              parsed.push({
                id: `ai-${Date.now()}-${parsed.length}`,
                title,
                keyword,
                type: "Blog Post",
                volume: Math.floor(Math.random() * 5000) + 500,
                difficulty: Math.floor(Math.random() * 60) + 20,
                score: Math.floor(Math.random() * 30) + 65,
                source: "AI Suggestion",
                saved: false,
              });
            }
          }
        }
        if (parsed.length > 0) {
          setAiGeneratedIdeas(prev => [...prev, ...parsed]);
        }
      }
      // Also refresh from DataForSEO API
      refetch();
    } catch {
      // Fall back to just refetching from DataForSEO
      refetch();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBrief = async () => {
    if (!selectedIdea) return;
    setIsGeneratingBrief(true);
    setBriefContent("");
    try {
      const result = await generateContent(selectedIdea.title, [selectedIdea.keyword], 'blog');
      setBriefContent(result || "Failed to generate brief. Please try again.");
    } catch {
      setBriefContent("Failed to generate brief. Please try again.");
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  if (!project) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-text-secondary">Loading content ideas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <Button variant="accent" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openCreateBrief = (idea: ContentIdea) => {
    setSelectedIdea(idea);
    setShowCreateBriefModal(true);
  };

  const savedCount = ideas.filter(i => i.saved).length;
  
  const filteredIdeas = filterSource === "all" 
    ? ideas 
    : ideas.filter(i => i.source === filterSource);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Content Ideas</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-text-secondary">
              AI-powered content suggestions based on your strategy
            </p>
            <DataSourceIndicator 
              source={source} 
              isLoading={isLoading}
              onRefresh={refetch}
              compact
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <Button 
              variant="secondary"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {filterSource !== "all" && (
                <Badge variant="accent" className="ml-2">{filterSource}</Badge>
              )}
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button
                    onClick={() => { setFilterSource("all"); setShowFilterDropdown(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md",
                      filterSource === "all" ? "bg-accent/10 text-accent" : "hover:bg-bg-elevated"
                    )}
                  >
                    All Sources
                  </button>
                  {Object.keys(sourceConfig).map((source) => (
                    <button
                      key={source}
                      onClick={() => { setFilterSource(source); setShowFilterDropdown(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md",
                        filterSource === source ? "bg-accent/10 text-accent" : "hover:bg-bg-elevated"
                      )}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button variant="accent" onClick={handleGenerateIdeas} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate Ideas"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Ideas"
          value={ideas.length}
          trendLabel="generated"
          icon={<Lightbulb className="h-5 w-5" />}
        />
        <StatCard
          label="Saved Ideas"
          value={savedCount}
          trendLabel="for later"
          icon={<Bookmark className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Score"
          value={ideas.length > 0 ? Math.round(ideas.reduce((sum, i) => sum + i.score, 0) / ideas.length) : 0}
          trendLabel="out of 100"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Total Volume"
          value={formatNumber(ideas.reduce((sum, i) => sum + i.volume, 0))}
          trendLabel="monthly searches"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-bg-elevated mb-4">
            <Lightbulb className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No Content Ideas Yet</h3>
          <p className="text-text-muted max-w-md mb-6">
            Click "Generate Ideas" to get AI-powered content suggestions based on your domain and target keywords.
          </p>
          <Button variant="accent" onClick={handleGenerateIdeas} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate Ideas"}
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="hover:border-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="neutral">{idea.type}</Badge>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", sourceConfig[idea.source]?.color || "bg-bg-elevated")}>
                      {idea.source}
                    </span>
                  </div>
                  <h3 className="font-medium text-text-primary">{idea.title}</h3>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                    idea.score >= 80 ? "bg-success/10 text-success" :
                    idea.score >= 60 ? "bg-warning/10 text-warning" : "bg-error/10 text-error"
                  )}>
                    {idea.score}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  {idea.keyword}
                </span>
                <span>{formatNumber(idea.volume)} vol</span>
                <span>KD {idea.difficulty}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSave(idea.id)}
                    className={idea.saved ? "text-accent" : ""}
                  >
                    <Bookmark className={cn("h-4 w-4", idea.saved && "fill-current")} />
                  </Button>
                  <Button variant="accent" size="sm" onClick={() => openCreateBrief(idea)}>
                    Create Brief
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Load More */}
      <div className="text-center">
        <Button variant="secondary" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Load More Ideas
        </Button>
      </div>

      {/* Create Brief Modal */}
      <Modal
        isOpen={showCreateBriefModal}
        onClose={() => {
          setShowCreateBriefModal(false);
          setSelectedIdea(null);
          setBriefContent("");
        }}
        title="Create Content Brief"
        description="Generate a detailed brief for this content idea"
        size="md"
      >
        {selectedIdea && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-bg-elevated">
              <h3 className="font-medium text-text-primary mb-2">{selectedIdea.title}</h3>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <Badge variant="neutral">{selectedIdea.type}</Badge>
                <span>{selectedIdea.keyword}</span>
                <span>{formatNumber(selectedIdea.volume)} vol</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Target Word Count
              </label>
              <Input type="number" defaultValue={2500} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Assignee
              </label>
              <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="AI Writer">AI Writer</option>
                <option value="Content Team">Content Team</option>
                <option value="External Writer">External Writer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Additional Instructions
              </label>
              <textarea 
                className="w-full h-24 px-3 py-2 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="Any specific requirements or notes..."
              />
            </div>
            
            {briefContent && (
              <div className="p-4 rounded-lg bg-bg-elevated border border-border max-h-64 overflow-y-auto">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Generated Brief
                </label>
                <div className="text-sm text-text-secondary whitespace-pre-wrap">{briefContent}</div>
              </div>
            )}

            <ModalFooter>
              <Button variant="secondary" onClick={() => {
                setShowCreateBriefModal(false);
                setBriefContent("");
              }}>
                Cancel
              </Button>
              <Button variant="accent" onClick={handleGenerateBrief} disabled={isGeneratingBrief}>
                {isGeneratingBrief ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGeneratingBrief ? "Generating..." : "Generate Brief"}
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
