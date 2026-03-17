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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

interface ContentIdea {
  id: number;
  title: string;
  type: string;
  keyword: string;
  volume: number;
  difficulty: number;
  score: number;
  source: string;
  saved: boolean;
}

const initialContentIdeas: ContentIdea[] = [
  {
    id: 1,
    title: "10 Technical SEO Mistakes That Are Killing Your Rankings",
    type: "Blog Post",
    keyword: "technical seo mistakes",
    volume: 2400,
    difficulty: 45,
    score: 92,
    source: "Competitor Gap",
    saved: true,
  },
  {
    id: 2,
    title: "The Ultimate Guide to Core Web Vitals in 2026",
    type: "Pillar Page",
    keyword: "core web vitals guide",
    volume: 8100,
    difficulty: 58,
    score: 88,
    source: "Trending Topic",
    saved: true,
  },
  {
    id: 3,
    title: "How to Recover from a Google Algorithm Update",
    type: "Blog Post",
    keyword: "google algorithm recovery",
    volume: 3600,
    difficulty: 52,
    score: 85,
    source: "Question Analysis",
    saved: false,
  },
  {
    id: 4,
    title: "Local SEO vs National SEO: Which Strategy is Right for You?",
    type: "Comparison",
    keyword: "local seo vs national seo",
    volume: 1900,
    difficulty: 38,
    score: 82,
    source: "AI Suggestion",
    saved: false,
  },
  {
    id: 5,
    title: "Schema Markup: A Complete Implementation Guide",
    type: "Guide",
    keyword: "schema markup guide",
    volume: 5400,
    difficulty: 48,
    score: 79,
    source: "Competitor Gap",
    saved: true,
  },
  {
    id: 6,
    title: "Why Your SEO Strategy Isn't Working (And How to Fix It)",
    type: "Blog Post",
    keyword: "seo strategy not working",
    volume: 1200,
    difficulty: 35,
    score: 76,
    source: "Question Analysis",
    saved: false,
  },
  {
    id: 7,
    title: "The ROI of SEO: How to Measure and Report Results",
    type: "Guide",
    keyword: "seo roi measurement",
    volume: 2800,
    difficulty: 42,
    score: 74,
    source: "AI Suggestion",
    saved: false,
  },
  {
    id: 8,
    title: "Voice Search Optimization: Preparing for the Future",
    type: "Blog Post",
    keyword: "voice search optimization",
    volume: 4200,
    difficulty: 55,
    score: 71,
    source: "Trending Topic",
    saved: false,
  },
];

const sourceConfig: Record<string, { color: string }> = {
  "Competitor Gap": { color: "bg-info/10 text-info" },
  "Trending Topic": { color: "bg-success/10 text-success" },
  "Question Analysis": { color: "bg-warning/10 text-warning" },
  "AI Suggestion": { color: "bg-accent/10 text-accent" },
};

export default function ContentIdeasPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  const [ideas, setIdeas] = React.useState(initialContentIdeas);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [showCreateBriefModal, setShowCreateBriefModal] = React.useState(false);
  const [selectedIdea, setSelectedIdea] = React.useState<ContentIdea | null>(null);
  const [filterSource, setFilterSource] = React.useState<string>("all");

  if (!project) return null;

  const toggleSave = (id: number) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, saved: !idea.saved } : idea
    ));
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
          <p className="text-text-secondary">
            AI-powered content suggestions based on your strategy
          </p>
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
          <Button variant="accent">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Ideas
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
          value={Math.round(ideas.reduce((sum, i) => sum + i.score, 0) / ideas.length)}
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

      {/* Load More */}
      <div className="text-center">
        <Button variant="secondary">
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
            
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowCreateBriefModal(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={() => setShowCreateBriefModal(false)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Brief
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
