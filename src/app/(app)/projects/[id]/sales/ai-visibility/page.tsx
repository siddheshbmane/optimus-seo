"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Eye,
  Bot,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Send,
  Copy,
  ExternalLink,
  Filter,
  Download,
  BarChart3,
  Target,
  Zap,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronRight,
  Info,
  X,
  Play,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";
import {
  mockLLMMentions,
  mockAggregatedMetrics,
  mockCrossAggregated,
  mockCompetitorAIVisibility,
  mockTopQueries,
  mockVisibilityTrend,
  mockAIVisibilityRecommendations,
  mockMissedMentions,
} from "@/data/mock-llm-mentions";
import { mockLLMResponses, mockSampleQueries, simulateQuery } from "@/data/mock-llm-responses";
import { mockAIKeywords, mockAIFirstKeywords, mockRisingAIKeywords, calculateAIOpportunityScore } from "@/data/mock-ai-keywords";
import type { LLMPlatform, Sentiment } from "@/lib/dataforseo/types";

// Tab definitions
const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "mentions", label: "LLM Mentions", icon: MessageSquare },
  { id: "responses", label: "LLM Responses", icon: Bot },
  { id: "keywords", label: "AI Keywords", icon: Search },
  { id: "google-ai", label: "Google AI Mode", icon: Globe },
  { id: "competitors", label: "Competitors", icon: Target },
  { id: "optimization", label: "Optimization", icon: Zap },
] as const;

type TabId = (typeof tabs)[number]["id"];

// Platform colors and icons
const platformConfig: Record<LLMPlatform, { color: string; bgColor: string; icon: string; name: string }> = {
  chatgpt: { color: "text-emerald-500", bgColor: "bg-emerald-500/10", icon: "🤖", name: "ChatGPT" },
  claude: { color: "text-orange-500", bgColor: "bg-orange-500/10", icon: "🧠", name: "Claude" },
  gemini: { color: "text-blue-500", bgColor: "bg-blue-500/10", icon: "✨", name: "Gemini" },
  perplexity: { color: "text-purple-500", bgColor: "bg-purple-500/10", icon: "💡", name: "Perplexity" },
};

const sentimentConfig: Record<Sentiment, { color: string; bgColor: string; label: string }> = {
  positive: { color: "text-success", bgColor: "bg-success/10", label: "Positive" },
  neutral: { color: "text-text-muted", bgColor: "bg-text-muted/10", label: "Neutral" },
  negative: { color: "text-error", bgColor: "bg-error/10", label: "Negative" },
};

export default function AIVisibilityPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [selectedPlatform, setSelectedPlatform] = React.useState<LLMPlatform | "all">("all");
  const [selectedSentiment, setSelectedSentiment] = React.useState<Sentiment | "all">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [simulatorQuery, setSimulatorQuery] = React.useState("");
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulatedResponse, setSimulatedResponse] = React.useState<typeof mockLLMResponses[0] | null>(null);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [showMentionDetail, setShowMentionDetail] = React.useState<typeof mockLLMMentions[0] | null>(null);

  if (!project) return null;

  // Calculate overall metrics
  const overallScore = Math.round(
    mockCrossAggregated.platforms_comparison.reduce((sum, p) => sum + p.visibility_score, 0) /
      mockCrossAggregated.platforms_comparison.length
  );
  const totalMentions = mockAggregatedMetrics.total_mentions;
  const avgPosition = (
    mockAggregatedMetrics.platforms_breakdown.reduce((sum, p) => sum + p.avg_position, 0) /
    mockAggregatedMetrics.platforms_breakdown.length
  ).toFixed(1);
  const positiveSentiment = Math.round(
    (mockAggregatedMetrics.platforms_breakdown.reduce((sum, p) => sum + p.sentiment.positive, 0) /
      totalMentions) *
      100
  );

  // Filter mentions
  const filteredMentions = mockLLMMentions.filter((m) => {
    if (selectedPlatform !== "all" && m.platform !== selectedPlatform) return false;
    if (selectedSentiment !== "all" && m.sentiment !== selectedSentiment) return false;
    if (searchQuery && !m.query.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Simulate query
  const handleSimulate = async () => {
    if (!simulatorQuery.trim()) return;
    setIsSimulating(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const response = simulateQuery(simulatorQuery);
    setSimulatedResponse(response);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">AI Search Command Center</h1>
            <Badge variant="accent">New</Badge>
          </div>
          <p className="text-text-secondary">
            Track your brand visibility across ChatGPT, Claude, Gemini, and Perplexity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="accent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
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
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-card/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab
          overallScore={overallScore}
          totalMentions={totalMentions}
          avgPosition={avgPosition}
          positiveSentiment={positiveSentiment}
        />
      )}

      {activeTab === "mentions" && (
        <MentionsTab
          mentions={filteredMentions}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          selectedSentiment={selectedSentiment}
          setSelectedSentiment={setSelectedSentiment}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMentionClick={setShowMentionDetail}
        />
      )}

      {activeTab === "responses" && (
        <ResponsesTab
          simulatorQuery={simulatorQuery}
          setSimulatorQuery={setSimulatorQuery}
          isSimulating={isSimulating}
          simulatedResponse={simulatedResponse}
          onSimulate={handleSimulate}
        />
      )}

      {activeTab === "keywords" && <KeywordsTab />}

      {activeTab === "google-ai" && <GoogleAIModeTab />}

      {activeTab === "competitors" && <CompetitorsTab />}

      {activeTab === "optimization" && <OptimizationTab />}

      {/* Mention Detail Modal */}
      <Modal 
        isOpen={!!showMentionDetail} 
        onClose={() => setShowMentionDetail(null)} 
        title={showMentionDetail ? `${platformConfig[showMentionDetail.platform].icon} Mention Details` : "Mention Details"}
        size="lg"
      >
        {showMentionDetail && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-muted">Query</label>
              <p className="font-medium text-text-primary">&quot;{showMentionDetail.query}&quot;</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-text-muted">Platform</label>
                <p className="font-medium text-text-primary">{platformConfig[showMentionDetail.platform].name}</p>
              </div>
              <div>
                <label className="text-sm text-text-muted">Position</label>
                <p className="font-medium text-text-primary">#{showMentionDetail.position}</p>
              </div>
              <div>
                <label className="text-sm text-text-muted">Sentiment</label>
                <Badge variant={showMentionDetail.sentiment === "positive" ? "success" : showMentionDetail.sentiment === "negative" ? "error" : "neutral"}>
                  {showMentionDetail.sentiment}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-text-muted">Snippet</label>
              <p className="text-text-secondary bg-bg-elevated p-3 rounded-lg mt-1">{showMentionDetail.snippet}</p>
            </div>
            {showMentionDetail.source_url && (
              <div>
                <label className="text-sm text-text-muted">Source</label>
                <a
                  href={showMentionDetail.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent hover:underline mt-1"
                >
                  {showMentionDetail.source_title || showMentionDetail.source_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            <div>
              <label className="text-sm text-text-muted">Date</label>
              <p className="text-text-primary">{showMentionDetail.date}</p>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowMentionDetail(null)}>
                Close
              </Button>
              <Button variant="accent">
                <Copy className="h-4 w-4 mr-2" />
                Copy Details
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Export Modal */}
      <Modal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
        title="Export AI Visibility Data"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">Choose what data to export:</p>
          <div className="space-y-2">
            {["All Mentions", "Platform Comparison", "Competitor Analysis", "Recommendations", "Full Report"].map((option) => (
              <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-bg-elevated cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-text-primary">{option}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="text-sm text-text-muted">Format</label>
            <div className="flex gap-2 mt-2">
              <Button variant="secondary" className="flex-1">CSV</Button>
              <Button variant="secondary" className="flex-1">JSON</Button>
              <Button variant="accent" className="flex-1">PDF Report</Button>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowExportModal(false)}>Cancel</Button>
            <Button variant="accent" onClick={() => setShowExportModal(false)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// TAB COMPONENTS
// ============================================

function OverviewTab({
  overallScore,
  totalMentions,
  avgPosition,
  positiveSentiment,
}: {
  overallScore: number;
  totalMentions: number;
  avgPosition: string;
  positiveSentiment: number;
}) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="AI Visibility Score"
          value={`${overallScore}/100`}
          trend={8}
          trendLabel="vs last month"
          icon={<Eye className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Total Mentions"
          value={totalMentions}
          trend={23}
          trendLabel="this month"
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Position"
          value={`#${avgPosition}`}
          trend={-0.5}
          trendLabel="improvement"
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Positive Sentiment"
          value={`${positiveSentiment}%`}
          trend={5}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Platform Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Visibility Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCrossAggregated.platforms_comparison.map((platform) => {
              const config = platformConfig[platform.platform];
              return (
                <div key={platform.platform} className="flex items-center gap-4 p-4 rounded-lg bg-bg-elevated">
                  <div className={cn("text-3xl p-2 rounded-lg", config.bgColor)}>{config.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-text-primary">{config.name}</span>
                      <span className="text-sm text-text-muted">{platform.total_mentions} mentions</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-text-muted">Visibility Score</span>
                          <span className="font-mono text-text-primary">{platform.visibility_score}/100</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              platform.visibility_score >= 70
                                ? "bg-success"
                                : platform.visibility_score >= 50
                                ? "bg-warning"
                                : "bg-error"
                            )}
                            style={{ width: `${platform.visibility_score}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <span className="text-sm text-text-muted">Avg. Position</span>
                        <p className="font-mono font-medium text-text-primary">#{platform.avg_position.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trend Chart & Top Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visibility Trend */}
        <Card>
          <CardHeader>
            <CardTitle>30-Day Visibility Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-1">
              {mockVisibilityTrend.slice(-30).map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-accent/80 rounded-t transition-all hover:bg-accent"
                    style={{ height: `${(day.overall / 100) * 180}px` }}
                    title={`${day.date}: ${day.overall}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-muted">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopQueries.slice(0, 6).map((query, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-text-muted w-6">#{i + 1}</span>
                    <span className="text-sm text-text-primary truncate max-w-[200px]">{query.query}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted">{query.mentions} mentions</span>
                    <span
                      className={cn(
                        "flex items-center text-sm",
                        query.trend > 0 ? "text-success" : query.trend < 0 ? "text-error" : "text-text-muted"
                      )}
                    >
                      {query.trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : query.trend < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      {Math.abs(query.trend)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missed Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Missed Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Queries where competitors are mentioned but you are not:
          </p>
          <div className="space-y-3">
            {mockMissedMentions.map((missed, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-warning/30 bg-warning/5">
                <div>
                  <p className="font-medium text-text-primary">&quot;{missed.query}&quot;</p>
                  <p className="text-sm text-text-muted mt-1">
                    Competitors: {missed.competitors_mentioned.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="warning">Score: {missed.opportunity_score}</Badge>
                  <p className="text-xs text-text-muted mt-1">{missed.search_volume.toLocaleString()} searches/mo</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MentionsTab({
  mentions,
  selectedPlatform,
  setSelectedPlatform,
  selectedSentiment,
  setSelectedSentiment,
  searchQuery,
  setSearchQuery,
  onMentionClick,
}: {
  mentions: typeof mockLLMMentions;
  selectedPlatform: LLMPlatform | "all";
  setSelectedPlatform: (p: LLMPlatform | "all") => void;
  selectedSentiment: Sentiment | "all";
  setSelectedSentiment: (s: Sentiment | "all") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onMentionClick: (m: typeof mockLLMMentions[0]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Platform:</span>
              <div className="flex gap-1">
                <Button
                  variant={selectedPlatform === "all" ? "accent" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedPlatform("all")}
                >
                  All
                </Button>
                {(Object.keys(platformConfig) as LLMPlatform[]).map((p) => (
                  <Button
                    key={p}
                    variant={selectedPlatform === p ? "accent" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedPlatform(p)}
                  >
                    {platformConfig[p].icon}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Sentiment:</span>
              <div className="flex gap-1">
                <Button
                  variant={selectedSentiment === "all" ? "accent" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedSentiment("all")}
                >
                  All
                </Button>
                {(["positive", "neutral", "negative"] as Sentiment[]).map((s) => (
                  <Button
                    key={s}
                    variant={selectedSentiment === s ? "accent" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedSentiment(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Brand Mentions ({mentions.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mentions.length === 0 ? (
              <p className="text-center text-text-muted py-8">No mentions found matching your filters.</p>
            ) : (
              mentions.map((mention, i) => {
                const pConfig = platformConfig[mention.platform];
                const sConfig = sentimentConfig[mention.sentiment];
                return (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 cursor-pointer transition-colors"
                    onClick={() => onMentionClick(mention)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xl", pConfig.bgColor, "p-1 rounded")}>{pConfig.icon}</span>
                        <span className="font-medium text-text-primary">&quot;{mention.query}&quot;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={mention.sentiment === "positive" ? "success" : mention.sentiment === "negative" ? "error" : "neutral"}>
                          {mention.sentiment}
                        </Badge>
                        <Badge variant="neutral">#{mention.position}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">{mention.snippet}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-text-muted">{mention.date}</span>
                      <ChevronRight className="h-4 w-4 text-text-muted" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResponsesTab({
  simulatorQuery,
  setSimulatorQuery,
  isSimulating,
  simulatedResponse,
  onSimulate,
}: {
  simulatorQuery: string;
  setSimulatorQuery: (q: string) => void;
  isSimulating: boolean;
  simulatedResponse: typeof mockLLMResponses[0] | null;
  onSimulate: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Query Simulator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-accent" />
            LLM Response Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Enter a query to see how different AI platforms respond and whether your brand is mentioned.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a query (e.g., 'best seo tools for agencies')"
              value={simulatorQuery}
              onChange={(e) => setSimulatorQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSimulate()}
              className="flex-1"
            />
            <Button variant="accent" onClick={onSimulate} disabled={isSimulating || !simulatorQuery.trim()}>
              {isSimulating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Querying...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Simulate
                </>
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-text-muted">Try:</span>
            {mockSampleQueries.slice(0, 4).map((q, i) => (
              <button
                key={i}
                onClick={() => setSimulatorQuery(q)}
                className="text-xs text-accent hover:underline"
              >
                {q.length > 40 ? q.slice(0, 40) + "..." : q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simulated Responses */}
      {simulatedResponse && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(Object.entries(simulatedResponse.responses) as [LLMPlatform, typeof simulatedResponse.responses.chatgpt][]).map(
            ([platform, response]) => {
              if (!response) return null;
              const config = platformConfig[platform];
              const hasBrandMention = response.sources.some((s) => s.is_brand_mention);
              return (
                <Card key={platform} className={cn(hasBrandMention && "ring-2 ring-success/50")}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xl p-1 rounded", config.bgColor)}>{config.icon}</span>
                        <CardTitle className="text-base">{config.name}</CardTitle>
                      </div>
                      {hasBrandMention ? (
                        <Badge variant="success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mentioned
                        </Badge>
                      ) : (
                        <Badge variant="warning">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Not Mentioned
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-text-secondary whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {response.response_text}
                    </div>
                    {response.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-text-muted mb-2">Sources cited:</p>
                        <div className="space-y-1">
                          {response.sources.map((source, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center gap-2 text-xs p-1 rounded",
                                source.is_brand_mention && "bg-success/10"
                              )}
                            >
                              <span className="text-text-muted">#{source.position}</span>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "hover:underline truncate",
                                  source.is_brand_mention ? "text-success font-medium" : "text-accent"
                                )}
                              >
                                {source.title}
                              </a>
                              {source.is_brand_mention && (
                                <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-border text-xs text-text-muted">
                      <span>Model: {response.model}</span>
                      <span>{response.response_time_ms}ms</span>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      )}

      {/* Pre-loaded Responses */}
      {!simulatedResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Query Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLLMResponses.map((response, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-border hover:border-accent/50 cursor-pointer"
                  onClick={() => {
                    setSimulatorQuery(response.query);
                    onSimulate();
                  }}
                >
                  <p className="font-medium text-text-primary mb-2">&quot;{response.query}&quot;</p>
                  <div className="flex items-center gap-4">
                    {(Object.entries(response.responses) as [LLMPlatform, typeof response.responses.chatgpt][]).map(
                      ([platform, resp]) => {
                        if (!resp) return null;
                        const config = platformConfig[platform];
                        const hasMention = resp.sources.some((s) => s.is_brand_mention);
                        return (
                          <div key={platform} className="flex items-center gap-1">
                            <span>{config.icon}</span>
                            {hasMention ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <X className="h-4 w-4 text-error" />
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function KeywordsTab() {
  const [sortBy, setSortBy] = React.useState<"opportunity" | "ai_volume" | "trend">("opportunity");

  const sortedKeywords = React.useMemo(() => {
    const withScores = mockAIKeywords.map((k) => ({
      ...k,
      opportunity_score: calculateAIOpportunityScore(k),
      avg_trend: k.platforms_data.reduce((sum, p) => sum + p.trend, 0) / k.platforms_data.length,
    }));

    return [...withScores].sort((a, b) => {
      if (sortBy === "opportunity") return b.opportunity_score - a.opportunity_score;
      if (sortBy === "ai_volume") return b.ai_search_volume - a.ai_search_volume;
      return b.avg_trend - a.avg_trend;
    });
  }, [sortBy]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="AI-First Keywords"
          value={mockAIFirstKeywords.length}
          trendLabel="Higher AI than Google volume"
          icon={<Sparkles className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Rising AI Keywords"
          value={mockRisingAIKeywords.length}
          trend={35}
          trendLabel="avg. growth"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Total AI Search Volume"
          value={mockAIKeywords.reduce((sum, k) => sum + k.ai_search_volume, 0).toLocaleString()}
          trendLabel="across tracked keywords"
          icon={<Search className="h-5 w-5" />}
        />
      </div>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Keyword Intelligence</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Sort by:</span>
              <Button
                variant={sortBy === "opportunity" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setSortBy("opportunity")}
              >
                Opportunity
              </Button>
              <Button
                variant={sortBy === "ai_volume" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setSortBy("ai_volume")}
              >
                AI Volume
              </Button>
              <Button
                variant={sortBy === "trend" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setSortBy("trend")}
              >
                Trend
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Keyword</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">AI Volume</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">Google Volume</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">Trend</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">Competition</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {sortedKeywords.map((keyword, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-bg-elevated">
                    <td className="py-3 px-2">
                      <span className="font-medium text-text-primary">{keyword.keyword}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-mono text-text-primary">{keyword.ai_search_volume.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-mono text-text-muted">{keyword.traditional_search_volume.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        variant={
                          keyword.ai_volume_trend === "rising"
                            ? "success"
                            : keyword.ai_volume_trend === "declining"
                            ? "error"
                            : "neutral"
                        }
                      >
                        {keyword.ai_volume_trend === "rising" && <ArrowUpRight className="h-3 w-3 mr-1" />}
                        {keyword.ai_volume_trend === "declining" && <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {keyword.ai_volume_trend}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        variant={
                          keyword.ai_competition === "low"
                            ? "success"
                            : keyword.ai_competition === "high"
                            ? "error"
                            : "warning"
                        }
                      >
                        {keyword.ai_competition}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${keyword.opportunity_score}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm text-text-primary w-8">{keyword.opportunity_score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GoogleAIModeTab() {
  const mockGoogleAIResults = [
    {
      keyword: "best seo tools 2026",
      hasAIOverview: true,
      brandInOverview: true,
      overviewPosition: 2,
      sourcesCount: 5,
      lastChecked: "2 hours ago",
    },
    {
      keyword: "how to do keyword research",
      hasAIOverview: true,
      brandInOverview: false,
      overviewPosition: null,
      sourcesCount: 4,
      lastChecked: "3 hours ago",
    },
    {
      keyword: "technical seo checklist",
      hasAIOverview: true,
      brandInOverview: true,
      overviewPosition: 3,
      sourcesCount: 6,
      lastChecked: "1 hour ago",
    },
    {
      keyword: "backlink building strategies",
      hasAIOverview: false,
      brandInOverview: false,
      overviewPosition: null,
      sourcesCount: 0,
      lastChecked: "4 hours ago",
    },
    {
      keyword: "local seo tips",
      hasAIOverview: true,
      brandInOverview: false,
      overviewPosition: null,
      sourcesCount: 5,
      lastChecked: "2 hours ago",
    },
  ];

  const withOverview = mockGoogleAIResults.filter((r) => r.hasAIOverview).length;
  const brandAppearances = mockGoogleAIResults.filter((r) => r.brandInOverview).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Keywords with AI Overview"
          value={`${withOverview}/${mockGoogleAIResults.length}`}
          trendLabel="of tracked keywords"
          icon={<Globe className="h-5 w-5" />}
        />
        <StatCard
          label="Brand in AI Overview"
          value={brandAppearances}
          trend={15}
          trendLabel="vs last week"
          icon={<CheckCircle className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Avg. Source Position"
          value="#2.5"
          trend={-0.3}
          trendLabel="improvement"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Google AI Mode Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockGoogleAIResults.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      result.hasAIOverview ? "bg-blue-500/10" : "bg-text-muted/10"
                    )}
                  >
                    {result.hasAIOverview ? (
                      <Sparkles className="h-5 w-5 text-blue-500" />
                    ) : (
                      <X className="h-5 w-5 text-text-muted" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{result.keyword}</p>
                    <p className="text-sm text-text-muted">
                      {result.hasAIOverview
                        ? `AI Overview with ${result.sourcesCount} sources`
                        : "No AI Overview"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {result.brandInOverview ? (
                    <Badge variant="success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Position #{result.overviewPosition}
                    </Badge>
                  ) : result.hasAIOverview ? (
                    <Badge variant="warning">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Not Cited
                    </Badge>
                  ) : (
                    <Badge variant="neutral">N/A</Badge>
                  )}
                  <span className="text-xs text-text-muted">{result.lastChecked}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CompetitorsTab() {
  return (
    <div className="space-y-6">
      {/* Share of Voice */}
      <Card>
        <CardHeader>
          <CardTitle>AI Share of Voice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCompetitorAIVisibility.map((competitor, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 truncate">
                  <span className={cn("font-medium", i === 0 ? "text-accent" : "text-text-primary")}>
                    {competitor.domain.replace(".com", "")}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-border rounded-full overflow-hidden flex">
                    <div
                      className={cn("h-full", i === 0 ? "bg-accent" : "bg-text-muted/50")}
                      style={{ width: `${competitor.share_of_voice}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="font-mono text-text-primary">{competitor.share_of_voice}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor AI Visibility Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Domain</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">Score</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">🤖 ChatGPT</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">🧠 Claude</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">✨ Gemini</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">💡 Perplexity</th>
                </tr>
              </thead>
              <tbody>
                {mockCompetitorAIVisibility.map((competitor, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-border/50",
                      i === 0 && "bg-accent/5"
                    )}
                  >
                    <td className="py-3 px-2">
                      <span className={cn("font-medium", i === 0 ? "text-accent" : "text-text-primary")}>
                        {competitor.domain}
                      </span>
                      {i === 0 && <Badge variant="accent" className="ml-2">You</Badge>}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-mono font-medium text-text-primary">{competitor.visibility_score}</span>
                    </td>
                    {competitor.platform_breakdown.map((p, j) => (
                      <td key={j} className="py-3 px-2 text-center">
                        <span className="font-mono text-sm text-text-primary">{p.score}</span>
                        <span className="text-xs text-text-muted ml-1">({p.mentions})</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OptimizationTab() {
  const [completedTasks, setCompletedTasks] = React.useState<string[]>([]);

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const completionRate = Math.round((completedTasks.length / mockAIVisibilityRecommendations.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">AI Optimization Progress</h3>
              <p className="text-sm text-text-secondary">
                Complete these tasks to improve your AI visibility
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-accent">{completionRate}%</span>
              <p className="text-sm text-text-muted">
                {completedTasks.length}/{mockAIVisibilityRecommendations.length} tasks
              </p>
            </div>
          </div>
          <div className="h-3 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Visibility Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAIVisibilityRecommendations.map((rec) => {
              const isCompleted = completedTasks.includes(rec.id);
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                    isCompleted
                      ? "border-success/30 bg-success/5"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <button
                    onClick={() => toggleTask(rec.id)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                      isCompleted
                        ? "border-success bg-success text-white"
                        : "border-border hover:border-accent"
                    )}
                  >
                    {isCompleted && <CheckCircle className="h-4 w-4" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "font-medium",
                          isCompleted ? "text-text-muted line-through" : "text-text-primary"
                        )}
                      >
                        {rec.title}
                      </span>
                      <Badge
                        variant={
                          rec.category === "content"
                            ? "info"
                            : rec.category === "technical"
                            ? "warning"
                            : rec.category === "authority"
                            ? "accent"
                            : "neutral"
                        }
                      >
                        {rec.category}
                      </Badge>
                    </div>
                    <p
                      className={cn(
                        "text-sm",
                        isCompleted ? "text-text-muted" : "text-text-secondary"
                      )}
                    >
                      {rec.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={rec.impact === "high" ? "accent" : rec.impact === "medium" ? "warning" : "neutral"}>
                      {rec.impact} impact
                    </Badge>
                    <Badge variant="neutral">{rec.effort} effort</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
