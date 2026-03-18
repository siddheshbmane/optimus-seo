"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
  Copy,
  Sparkles,
  Clock,
  CheckCircle,
  Target,
  BarChart2,
  List,
  Save,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Globe,
  ExternalLink,
  RefreshCw,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  BookOpen,
  PenTool,
  LineChart,
  Award,
  Users,
  MessageSquare,
  Link2,
  Image,
  Video,
  Hash,
  Layers,
  Brain,
  Gauge,
  Star,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
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
interface ContentBrief {
  id: number;
  title: string;
  targetKeyword: string;
  wordCount: number;
  headings: number;
  status: "draft" | "in_review" | "approved" | "published" | "optimizing";
  createdAt: string;
  assignee: string;
  contentScore?: number;
  readability?: number;
  seoScore?: number;
  traffic?: number;
  conversions?: number;
}

interface ContentAuditItem {
  id: number;
  url: string;
  title: string;
  wordCount: number;
  contentScore: number;
  traffic: number;
  trafficTrend: number;
  lastUpdated: string;
  status: "performing" | "declining" | "needs_update" | "thin_content";
  issues: string[];
  opportunities: string[];
}

interface SerpResult {
  position: number;
  url: string;
  title: string;
  domain: string;
  wordCount: number;
  headings: number;
  images: number;
  videos: number;
  schema: string[];
  contentScore: number;
  backlinks: number;
}

interface TopicIdea {
  id: number;
  topic: string;
  searchVolume: number;
  difficulty: number;
  intent: "informational" | "commercial" | "transactional" | "navigational";
  trend: "rising" | "stable" | "declining";
  relatedTopics: string[];
  questions: string[];
  contentGap: boolean;
}

// ============ MOCK DATA ============
const initialBriefs: ContentBrief[] = [
  {
    id: 1,
    title: "Complete Guide to Technical SEO in 2026",
    targetKeyword: "technical seo guide",
    wordCount: 3500,
    headings: 12,
    status: "published",
    createdAt: "Mar 10, 2026",
    assignee: "AI Writer",
    contentScore: 92,
    readability: 78,
    seoScore: 95,
    traffic: 4520,
    conversions: 45,
  },
  {
    id: 2,
    title: "Local SEO Checklist for Small Businesses",
    targetKeyword: "local seo checklist",
    wordCount: 2200,
    headings: 8,
    status: "in_review",
    createdAt: "Mar 12, 2026",
    assignee: "Content Team",
    contentScore: 85,
    readability: 82,
    seoScore: 88,
  },
  {
    id: 3,
    title: "How to Optimize for Voice Search",
    targetKeyword: "voice search optimization",
    wordCount: 2800,
    headings: 10,
    status: "draft",
    createdAt: "Mar 14, 2026",
    assignee: "AI Writer",
    contentScore: 72,
    readability: 75,
    seoScore: 68,
  },
  {
    id: 4,
    title: "E-commerce SEO Best Practices",
    targetKeyword: "ecommerce seo",
    wordCount: 4000,
    headings: 15,
    status: "published",
    createdAt: "Mar 8, 2026",
    assignee: "Content Team",
    contentScore: 88,
    readability: 80,
    seoScore: 91,
    traffic: 3200,
    conversions: 32,
  },
  {
    id: 5,
    title: "Link Building Strategies That Work",
    targetKeyword: "link building strategies",
    wordCount: 3200,
    headings: 11,
    status: "optimizing",
    createdAt: "Mar 15, 2026",
    assignee: "AI Writer",
    contentScore: 78,
    readability: 76,
    seoScore: 82,
    traffic: 1850,
    conversions: 18,
  },
];

const contentAuditData: ContentAuditItem[] = [
  {
    id: 1,
    url: "/blog/technical-seo-guide",
    title: "Complete Guide to Technical SEO in 2026",
    wordCount: 3500,
    contentScore: 92,
    traffic: 4520,
    trafficTrend: 15.2,
    lastUpdated: "Mar 10, 2026",
    status: "performing",
    issues: [],
    opportunities: ["Add video content", "Update for 2026 trends"],
  },
  {
    id: 2,
    url: "/blog/seo-basics",
    title: "SEO Basics for Beginners",
    wordCount: 1200,
    contentScore: 58,
    traffic: 890,
    trafficTrend: -22.5,
    lastUpdated: "Jan 15, 2025",
    status: "declining",
    issues: ["Thin content", "Outdated information", "Missing schema"],
    opportunities: ["Expand to 2500+ words", "Add FAQ section", "Update examples"],
  },
  {
    id: 3,
    url: "/blog/keyword-research-tools",
    title: "Best Keyword Research Tools",
    wordCount: 2100,
    contentScore: 71,
    traffic: 2340,
    trafficTrend: -8.3,
    lastUpdated: "Nov 20, 2025",
    status: "needs_update",
    issues: ["Missing new tools", "Broken links"],
    opportunities: ["Add AI tools section", "Update pricing info"],
  },
  {
    id: 4,
    url: "/blog/local-seo-tips",
    title: "Local SEO Tips",
    wordCount: 850,
    contentScore: 45,
    traffic: 320,
    trafficTrend: -35.1,
    lastUpdated: "Aug 5, 2024",
    status: "thin_content",
    issues: ["Very thin content", "No images", "Poor structure"],
    opportunities: ["Complete rewrite needed", "Add local examples"],
  },
  {
    id: 5,
    url: "/blog/ecommerce-seo",
    title: "E-commerce SEO Best Practices",
    wordCount: 4000,
    contentScore: 88,
    traffic: 3200,
    trafficTrend: 8.7,
    lastUpdated: "Mar 8, 2026",
    status: "performing",
    issues: [],
    opportunities: ["Add case studies", "Create video version"],
  },
];

const serpAnalysisData: SerpResult[] = [
  {
    position: 1,
    url: "https://moz.com/technical-seo-guide",
    title: "The Complete Technical SEO Guide - Moz",
    domain: "moz.com",
    wordCount: 4200,
    headings: 18,
    images: 12,
    videos: 2,
    schema: ["Article", "FAQ", "HowTo"],
    contentScore: 95,
    backlinks: 2450,
  },
  {
    position: 2,
    url: "https://ahrefs.com/blog/technical-seo",
    title: "Technical SEO: The Definitive Guide - Ahrefs",
    domain: "ahrefs.com",
    wordCount: 3800,
    headings: 15,
    images: 24,
    videos: 1,
    schema: ["Article", "FAQ"],
    contentScore: 92,
    backlinks: 1890,
  },
  {
    position: 3,
    url: "https://semrush.com/blog/technical-seo",
    title: "Technical SEO Checklist - Semrush",
    domain: "semrush.com",
    wordCount: 3500,
    headings: 14,
    images: 18,
    videos: 0,
    schema: ["Article", "HowTo"],
    contentScore: 89,
    backlinks: 1560,
  },
  {
    position: 4,
    url: "https://backlinko.com/technical-seo-guide",
    title: "Technical SEO Guide - Backlinko",
    domain: "backlinko.com",
    wordCount: 5200,
    headings: 22,
    images: 35,
    videos: 3,
    schema: ["Article", "FAQ", "HowTo", "Video"],
    contentScore: 94,
    backlinks: 3200,
  },
  {
    position: 5,
    url: "https://searchenginejournal.com/technical-seo",
    title: "Technical SEO: A Complete Guide - SEJ",
    domain: "searchenginejournal.com",
    wordCount: 2900,
    headings: 12,
    images: 8,
    videos: 0,
    schema: ["Article"],
    contentScore: 82,
    backlinks: 980,
  },
];

const topicIdeas: TopicIdea[] = [
  {
    id: 1,
    topic: "AI SEO Tools Comparison 2026",
    searchVolume: 8500,
    difficulty: 45,
    intent: "commercial",
    trend: "rising",
    relatedTopics: ["ChatGPT for SEO", "AI content optimization", "Automated SEO"],
    questions: ["What are the best AI SEO tools?", "Is AI good for SEO?"],
    contentGap: true,
  },
  {
    id: 2,
    topic: "Core Web Vitals Optimization Guide",
    searchVolume: 12000,
    difficulty: 62,
    intent: "informational",
    trend: "stable",
    relatedTopics: ["Page speed optimization", "LCP improvement", "CLS fixes"],
    questions: ["How to improve Core Web Vitals?", "What is a good LCP score?"],
    contentGap: false,
  },
  {
    id: 3,
    topic: "E-E-A-T SEO Strategy",
    searchVolume: 6200,
    difficulty: 55,
    intent: "informational",
    trend: "rising",
    relatedTopics: ["Google E-E-A-T", "Author authority", "Trust signals"],
    questions: ["What is E-E-A-T in SEO?", "How to improve E-E-A-T?"],
    contentGap: true,
  },
  {
    id: 4,
    topic: "Schema Markup Generator",
    searchVolume: 15000,
    difficulty: 38,
    intent: "transactional",
    trend: "stable",
    relatedTopics: ["JSON-LD generator", "Structured data", "Rich snippets"],
    questions: ["How to create schema markup?", "What schema types should I use?"],
    contentGap: true,
  },
  {
    id: 5,
    topic: "SEO for AI Search Engines",
    searchVolume: 4800,
    difficulty: 32,
    intent: "informational",
    trend: "rising",
    relatedTopics: ["ChatGPT SEO", "Perplexity optimization", "AI visibility"],
    questions: ["How to rank in AI search?", "Does SEO work for AI?"],
    contentGap: true,
  },
];

const briefPreview = {
  title: "Complete Guide to Technical SEO in 2026",
  targetKeyword: "technical seo guide",
  secondaryKeywords: ["technical seo checklist", "technical seo audit", "site speed optimization"],
  wordCount: 3500,
  outline: [
    { h2: "What is Technical SEO?", h3s: ["Definition", "Why It Matters"] },
    { h2: "Technical SEO Checklist", h3s: ["Site Architecture", "URL Structure", "XML Sitemaps"] },
    { h2: "Site Speed Optimization", h3s: ["Core Web Vitals", "Image Optimization", "Caching"] },
    { h2: "Mobile Optimization", h3s: ["Mobile-First Indexing", "Responsive Design"] },
    { h2: "Crawlability & Indexing", h3s: ["Robots.txt", "Canonical Tags", "Pagination"] },
  ],
  competitors: [
    { url: "moz.com/technical-seo-guide", wordCount: 4200 },
    { url: "ahrefs.com/technical-seo", wordCount: 3800 },
    { url: "semrush.com/technical-seo", wordCount: 3500 },
  ],
};

const contentPerformanceData = [
  { month: "Oct", traffic: 2800, conversions: 28, score: 75 },
  { month: "Nov", traffic: 3200, conversions: 32, score: 78 },
  { month: "Dec", traffic: 3500, conversions: 35, score: 82 },
  { month: "Jan", traffic: 3800, conversions: 38, score: 85 },
  { month: "Feb", traffic: 4200, conversions: 42, score: 88 },
  { month: "Mar", traffic: 4520, conversions: 45, score: 92 },
];

const contentTypeDistribution = [
  { name: "Blog Posts", value: 45, color: "#FD8C73" },
  { name: "Guides", value: 25, color: "#10B981" },
  { name: "Case Studies", value: 15, color: "#3B82F6" },
  { name: "Landing Pages", value: 10, color: "#8B5CF6" },
  { name: "Tools", value: 5, color: "#F59E0B" },
];

const optimizationSuggestions = [
  {
    id: 1,
    type: "content",
    title: "Add FAQ Section",
    description: "Top competitors have FAQ sections with 5-8 questions",
    impact: "high",
    effort: "low",
  },
  {
    id: 2,
    type: "media",
    title: "Include Video Content",
    description: "3 of 5 top results have embedded videos",
    impact: "high",
    effort: "medium",
  },
  {
    id: 3,
    type: "schema",
    title: "Add HowTo Schema",
    description: "Enable rich snippets for step-by-step sections",
    impact: "medium",
    effort: "low",
  },
  {
    id: 4,
    type: "internal",
    title: "Add Internal Links",
    description: "Link to 5+ related articles for better crawlability",
    impact: "medium",
    effort: "low",
  },
  {
    id: 5,
    type: "content",
    title: "Expand Word Count",
    description: "Top result has 4200 words, yours has 3500",
    impact: "medium",
    effort: "high",
  },
];

const statusConfig = {
  draft: { label: "Draft", variant: "neutral" as const },
  in_review: { label: "In Review", variant: "warning" as const },
  approved: { label: "Approved", variant: "success" as const },
  published: { label: "Published", variant: "info" as const },
  optimizing: { label: "Optimizing", variant: "accent" as const },
};

const auditStatusConfig = {
  performing: { label: "Performing", variant: "success" as const, icon: TrendingUp },
  declining: { label: "Declining", variant: "error" as const, icon: TrendingDown },
  needs_update: { label: "Needs Update", variant: "warning" as const, icon: AlertTriangle },
  thin_content: { label: "Thin Content", variant: "error" as const, icon: AlertTriangle },
};

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "audit", label: "Content Audit", icon: Search },
  { id: "briefs", label: "Brief Generator", icon: FileText },
  { id: "serp", label: "SERP Analysis", icon: Globe },
  { id: "topics", label: "Topic Research", icon: Lightbulb },
  { id: "optimization", label: "Optimization", icon: Zap },
];

export default function ContentBriefsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  
  // State
  const [activeTab, setActiveTab] = React.useState("overview");
  const [briefs, setBriefs] = React.useState(initialBriefs);
  const [selectedBrief, setSelectedBrief] = React.useState(briefs[0]);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditPanel, setShowEditPanel] = React.useState(false);
  const [showSerpModal, setShowSerpModal] = React.useState(false);
  const [showTopicModal, setShowTopicModal] = React.useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = React.useState(false);
  const [selectedAuditItem, setSelectedAuditItem] = React.useState<ContentAuditItem | null>(null);
  const [selectedTopic, setSelectedTopic] = React.useState<TopicIdea | null>(null);
  const [serpKeyword, setSerpKeyword] = React.useState("technical seo guide");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [auditFilter, setAuditFilter] = React.useState<string>("all");
  const [newBrief, setNewBrief] = React.useState({
    title: "",
    targetKeyword: "",
    wordCount: 2500,
    assignee: "AI Writer",
  });

  if (!project) return null;

  const handleAddBrief = () => {
    const brief: ContentBrief = {
      id: briefs.length + 1,
      title: newBrief.title,
      targetKeyword: newBrief.targetKeyword,
      wordCount: newBrief.wordCount,
      headings: Math.floor(newBrief.wordCount / 300),
      status: "draft",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      assignee: newBrief.assignee,
      contentScore: 0,
      readability: 0,
      seoScore: 0,
    };
    setBriefs([brief, ...briefs]);
    setShowAddModal(false);
    setNewBrief({ title: "", targetKeyword: "", wordCount: 2500, assignee: "AI Writer" });
  };

  const handleAnalyzeSERP = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowSerpModal(true);
    }, 1500);
  };

  const filteredAuditItems = auditFilter === "all" 
    ? contentAuditData 
    : contentAuditData.filter(item => item.status === auditFilter);

  // Calculate stats
  const totalContent = contentAuditData.length;
  const performingContent = contentAuditData.filter(c => c.status === "performing").length;
  const decliningContent = contentAuditData.filter(c => c.status === "declining" || c.status === "thin_content").length;
  const avgContentScore = Math.round(contentAuditData.reduce((sum, c) => sum + c.contentScore, 0) / totalContent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Content Intelligence</h1>
          <p className="text-text-secondary">
            AI-powered content strategy, briefs, and optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowSerpModal(true)}>
            <Search className="h-4 w-4 mr-2" />
            Analyze SERP
          </Button>
          <Button variant="accent" onClick={() => setShowAddModal(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Brief
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

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{totalContent}</p>
                    <p className="text-sm text-text-muted">Total Content</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{performingContent}</p>
                    <p className="text-sm text-text-muted">Performing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-error/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-error" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{decliningContent}</p>
                    <p className="text-sm text-text-muted">Needs Attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Gauge className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{avgContentScore}</p>
                    <p className="text-sm text-text-muted">Avg Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={contentPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} />
                      <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-bg-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="traffic"
                        stroke="#FD8C73"
                        fill="#FD8C73"
                        fillOpacity={0.2}
                        name="Traffic"
                      />
                      <Area
                        type="monotone"
                        dataKey="conversions"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.2}
                        name="Conversions"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Content Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentTypeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {contentTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Briefs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Content Briefs</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("briefs")}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {briefs.slice(0, 5).map((brief) => (
                  <div
                    key={brief.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 cursor-pointer"
                    onClick={() => {
                      setSelectedBrief(brief);
                      setActiveTab("briefs");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{brief.title}</p>
                        <p className="text-sm text-text-muted">
                          {brief.targetKeyword} • {formatNumber(brief.wordCount)} words
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {brief.contentScore && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-text-primary">{brief.contentScore}</p>
                          <p className="text-xs text-text-muted">Score</p>
                        </div>
                      )}
                      <Badge variant={statusConfig[brief.status].variant}>
                        {statusConfig[brief.status].label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-6">
          {/* Audit Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={auditFilter === "all" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setAuditFilter("all")}
              >
                All ({contentAuditData.length})
              </Button>
              <Button
                variant={auditFilter === "performing" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setAuditFilter("performing")}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Performing
              </Button>
              <Button
                variant={auditFilter === "declining" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setAuditFilter("declining")}
              >
                <TrendingDown className="h-4 w-4 mr-1" />
                Declining
              </Button>
              <Button
                variant={auditFilter === "needs_update" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setAuditFilter("needs_update")}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Needs Update
              </Button>
              <Button
                variant={auditFilter === "thin_content" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setAuditFilter("thin_content")}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Thin Content
              </Button>
            </div>
            <Button variant="secondary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Audit
            </Button>
          </div>

          {/* Audit Table */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-text-muted">Content</th>
                    <th className="text-center p-4 text-sm font-medium text-text-muted">Score</th>
                    <th className="text-center p-4 text-sm font-medium text-text-muted">Traffic</th>
                    <th className="text-center p-4 text-sm font-medium text-text-muted">Trend</th>
                    <th className="text-center p-4 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-center p-4 text-sm font-medium text-text-muted">Issues</th>
                    <th className="text-right p-4 text-sm font-medium text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditItems.map((item) => {
                    const StatusIcon = auditStatusConfig[item.status].icon;
                    return (
                      <tr key={item.id} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-text-primary">{item.title}</p>
                            <p className="text-sm text-text-muted">{item.url}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className={cn(
                            "inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm",
                            item.contentScore >= 80 ? "bg-success/10 text-success" :
                            item.contentScore >= 60 ? "bg-warning/10 text-warning" :
                            "bg-error/10 text-error"
                          )}>
                            {item.contentScore}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <p className="font-medium text-text-primary">{formatNumber(item.traffic)}</p>
                        </td>
                        <td className="p-4 text-center">
                          <div className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium",
                            item.trafficTrend >= 0 ? "text-success" : "text-error"
                          )}>
                            {item.trafficTrend >= 0 ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(item.trafficTrend)}%
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={auditStatusConfig[item.status].variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {auditStatusConfig[item.status].label}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "font-medium",
                            item.issues.length > 0 ? "text-error" : "text-success"
                          )}>
                            {item.issues.length}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAuditItem(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Zap className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "briefs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Briefs List */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Briefs</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {briefs.map((brief) => (
                  <div
                    key={brief.id}
                    onClick={() => setSelectedBrief(brief)}
                    className={cn(
                      "p-4 cursor-pointer transition-colors",
                      selectedBrief.id === brief.id ? "bg-accent/5 border-l-2 border-accent" : "hover:bg-bg-elevated"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-text-primary text-sm line-clamp-2">{brief.title}</h3>
                      <Badge variant={statusConfig[brief.status].variant} className="text-xs ml-2">
                        {statusConfig[brief.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{formatNumber(brief.wordCount)} words</span>
                      <span>•</span>
                      <span>{brief.headings} headings</span>
                      {brief.contentScore && (
                        <>
                          <span>•</span>
                          <span className="text-accent">{brief.contentScore} score</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brief Preview */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Brief Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowEditPanel(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Title & Meta */}
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-2">{briefPreview.title}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-text-muted">Target: <span className="text-accent">{briefPreview.targetKeyword}</span></span>
                    <span className="text-text-muted">Words: <span className="text-text-primary">{formatNumber(briefPreview.wordCount)}</span></span>
                  </div>
                </div>

                {/* Secondary Keywords */}
                <div>
                  <h3 className="text-sm font-medium text-text-muted mb-2">Secondary Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {briefPreview.secondaryKeywords.map((kw) => (
                      <Badge key={kw} variant="neutral">{kw}</Badge>
                    ))}
                  </div>
                </div>

                {/* Outline */}
                <div>
                  <h3 className="text-sm font-medium text-text-muted mb-3">Content Outline</h3>
                  <div className="space-y-3">
                    {briefPreview.outline.map((section, index) => (
                      <div key={index} className="p-3 rounded-lg bg-bg-elevated">
                        <p className="font-medium text-text-primary mb-2">H2: {section.h2}</p>
                        <div className="ml-4 space-y-1">
                          {section.h3s.map((h3, i) => (
                            <p key={i} className="text-sm text-text-secondary">• H3: {h3}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitor Analysis */}
                <div>
                  <h3 className="text-sm font-medium text-text-muted mb-3">Competitor Content</h3>
                  <div className="space-y-2">
                    {briefPreview.competitors.map((comp, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-bg-elevated">
                        <span className="text-sm text-text-secondary">{comp.url}</span>
                        <span className="text-sm text-text-muted">{formatNumber(comp.wordCount)} words</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="accent" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Full Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "serp" && (
        <div className="space-y-6">
          {/* SERP Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter keyword to analyze SERP..."
                    value={serpKeyword}
                    onChange={(e) => setSerpKeyword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="accent" onClick={handleAnalyzeSERP} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze SERP
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SERP Results */}
          <Card>
            <CardHeader>
              <CardTitle>SERP Analysis: "{serpKeyword}"</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serpAnalysisData.map((result) => (
                  <div
                    key={result.position}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent">
                        #{result.position}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-text-primary mb-1">{result.title}</h3>
                            <p className="text-sm text-success mb-2">{result.url}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-accent">{result.contentScore}</p>
                            <p className="text-xs text-text-muted">Content Score</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {formatNumber(result.wordCount)} words
                          </span>
                          <span className="flex items-center gap-1">
                            <List className="h-4 w-4" />
                            {result.headings} headings
                          </span>
                          <span className="flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            {result.images} images
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            {result.videos} videos
                          </span>
                          <span className="flex items-center gap-1">
                            <Link2 className="h-4 w-4" />
                            {formatNumber(result.backlinks)} backlinks
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {result.schema.map((s) => (
                            <Badge key={s} variant="neutral" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SERP Insights */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-text-muted mb-2">Avg Word Count</h3>
                <p className="text-2xl font-bold text-text-primary">
                  {formatNumber(Math.round(serpAnalysisData.reduce((sum, r) => sum + r.wordCount, 0) / serpAnalysisData.length))}
                </p>
                <p className="text-sm text-text-muted">Top 5 results</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-text-muted mb-2">Avg Headings</h3>
                <p className="text-2xl font-bold text-text-primary">
                  {Math.round(serpAnalysisData.reduce((sum, r) => sum + r.headings, 0) / serpAnalysisData.length)}
                </p>
                <p className="text-sm text-text-muted">Top 5 results</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-text-muted mb-2">Avg Images</h3>
                <p className="text-2xl font-bold text-text-primary">
                  {Math.round(serpAnalysisData.reduce((sum, r) => sum + r.images, 0) / serpAnalysisData.length)}
                </p>
                <p className="text-sm text-text-muted">Top 5 results</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "topics" && (
        <div className="space-y-6">
          {/* Topic Ideas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Topic Ideas</CardTitle>
              <Button variant="secondary" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate More
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topicIdeas.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedTopic(topic);
                      setShowTopicModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          topic.contentGap ? "bg-success/10" : "bg-bg-elevated"
                        )}>
                          {topic.contentGap ? (
                            <Star className="h-5 w-5 text-success" />
                          ) : (
                            <Lightbulb className="h-5 w-5 text-text-muted" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">{topic.topic}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              topic.intent === "informational" ? "info" :
                              topic.intent === "commercial" ? "warning" :
                              topic.intent === "transactional" ? "success" : "neutral"
                            }>
                              {topic.intent}
                            </Badge>
                            {topic.contentGap && (
                              <Badge variant="success">Content Gap</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-text-primary">{formatNumber(topic.searchVolume)}</p>
                          <p className="text-xs text-text-muted">Volume</p>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-medium",
                            topic.difficulty <= 40 ? "text-success" :
                            topic.difficulty <= 60 ? "text-warning" : "text-error"
                          )}>
                            {topic.difficulty}
                          </p>
                          <p className="text-xs text-text-muted">Difficulty</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          topic.trend === "rising" ? "text-success" :
                          topic.trend === "declining" ? "text-error" : "text-text-muted"
                        )}>
                          {topic.trend === "rising" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : topic.trend === "declining" ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {topic.relatedTopics.slice(0, 3).map((rt) => (
                        <Badge key={rt} variant="neutral" className="text-xs">
                          {rt}
                        </Badge>
                      ))}
                      {topic.relatedTopics.length > 3 && (
                        <span className="text-xs text-text-muted">+{topic.relatedTopics.length - 3} more</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "optimization" && (
        <div className="space-y-6">
          {/* Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          suggestion.type === "content" ? "bg-accent/10" :
                          suggestion.type === "media" ? "bg-info/10" :
                          suggestion.type === "schema" ? "bg-success/10" : "bg-warning/10"
                        )}>
                          {suggestion.type === "content" ? (
                            <FileText className="h-5 w-5 text-accent" />
                          ) : suggestion.type === "media" ? (
                            <Video className="h-5 w-5 text-info" />
                          ) : suggestion.type === "schema" ? (
                            <Hash className="h-5 w-5 text-success" />
                          ) : (
                            <Link2 className="h-5 w-5 text-warning" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">{suggestion.title}</h3>
                          <p className="text-sm text-text-muted mt-1">{suggestion.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant={
                            suggestion.impact === "high" ? "success" :
                            suggestion.impact === "medium" ? "warning" : "neutral"
                          }>
                            {suggestion.impact} impact
                          </Badge>
                          <p className="text-xs text-text-muted mt-1">{suggestion.effort} effort</p>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => setShowOptimizeModal(true)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Content Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: "Readability", A: 78, fullMark: 100 },
                    { subject: "SEO", A: 95, fullMark: 100 },
                    { subject: "Engagement", A: 82, fullMark: 100 },
                    { subject: "Structure", A: 88, fullMark: 100 },
                    { subject: "Keywords", A: 91, fullMark: 100 },
                    { subject: "Media", A: 65, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--color-text-muted)", fontSize: 10 }} />
                    <Radar name="Score" dataKey="A" stroke="#FD8C73" fill="#FD8C73" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Brief Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Generate New Brief"
        description="AI will create a content brief based on your inputs"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Title
            </label>
            <Input 
              placeholder="e.g., Complete Guide to Technical SEO"
              value={newBrief.title}
              onChange={(e) => setNewBrief({ ...newBrief, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Keyword
            </label>
            <Input 
              placeholder="e.g., technical seo guide"
              value={newBrief.targetKeyword}
              onChange={(e) => setNewBrief({ ...newBrief, targetKeyword: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Word Count
            </label>
            <Input 
              type="number"
              value={newBrief.wordCount}
              onChange={(e) => setNewBrief({ ...newBrief, wordCount: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Assignee
            </label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={newBrief.assignee}
              onChange={(e) => setNewBrief({ ...newBrief, assignee: e.target.value })}
            >
              <option value="AI Writer">AI Writer</option>
              <option value="Content Team">Content Team</option>
              <option value="External Writer">External Writer</option>
            </select>
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddBrief}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Brief
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Edit Brief Panel */}
      <SlidePanel
        isOpen={showEditPanel}
        onClose={() => setShowEditPanel(false)}
        title="Edit Brief"
        description="Modify the content brief"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Title
            </label>
            <Input defaultValue={briefPreview.title} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Keyword
            </label>
            <Input defaultValue={briefPreview.targetKeyword} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Secondary Keywords
            </label>
            <Input defaultValue={briefPreview.secondaryKeywords.join(", ")} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Word Count
            </label>
            <Input type="number" defaultValue={briefPreview.wordCount} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Outline
            </label>
            <div className="space-y-2">
              {briefPreview.outline.map((section, index) => (
                <div key={index} className="p-3 rounded-lg bg-bg-elevated">
                  <Input defaultValue={section.h2} className="mb-2" />
                  {section.h3s.map((h3, i) => (
                    <Input key={i} defaultValue={h3} className="ml-4 mb-1" />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowEditPanel(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowEditPanel(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </SlidePanel>

      {/* SERP Analysis Modal */}
      <Modal
        isOpen={showSerpModal}
        onClose={() => setShowSerpModal(false)}
        title="SERP Analysis Complete"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Analysis complete for "{serpKeyword}". Key insights:
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-2xl font-bold text-text-primary">3,920</p>
              <p className="text-sm text-text-muted">Avg Word Count</p>
            </div>
            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-2xl font-bold text-text-primary">16</p>
              <p className="text-sm text-text-muted">Avg Headings</p>
            </div>
            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-2xl font-bold text-text-primary">19</p>
              <p className="text-sm text-text-muted">Avg Images</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <h4 className="font-medium text-success mb-2">Opportunity Detected</h4>
            <p className="text-sm text-text-secondary">
              Only 2 of 5 top results have video content. Adding video could help you stand out.
            </p>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowSerpModal(false)}>
              Close
            </Button>
            <Button variant="accent" onClick={() => {
              setShowSerpModal(false);
              setActiveTab("serp");
            }}>
              View Full Analysis
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Topic Details Modal */}
      <Modal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        title={selectedTopic?.topic || "Topic Details"}
        size="lg"
      >
        {selectedTopic && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="text-2xl font-bold text-text-primary">{formatNumber(selectedTopic.searchVolume)}</p>
                <p className="text-sm text-text-muted">Monthly Volume</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className={cn(
                  "text-2xl font-bold",
                  selectedTopic.difficulty <= 40 ? "text-success" :
                  selectedTopic.difficulty <= 60 ? "text-warning" : "text-error"
                )}>
                  {selectedTopic.difficulty}
                </p>
                <p className="text-sm text-text-muted">Difficulty</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated">
                <Badge variant={
                  selectedTopic.intent === "informational" ? "info" :
                  selectedTopic.intent === "commercial" ? "warning" :
                  selectedTopic.intent === "transactional" ? "success" : "neutral"
                } className="text-lg">
                  {selectedTopic.intent}
                </Badge>
                <p className="text-sm text-text-muted mt-1">Intent</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-text-primary mb-2">Related Topics</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.relatedTopics.map((rt) => (
                  <Badge key={rt} variant="neutral">{rt}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-text-primary mb-2">People Also Ask</h4>
              <div className="space-y-2">
                {selectedTopic.questions.map((q, i) => (
                  <div key={i} className="p-3 rounded-lg bg-bg-elevated flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-text-muted" />
                    <span className="text-text-secondary">{q}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowTopicModal(false)}>
                Close
              </Button>
              <Button variant="accent" onClick={() => {
                setNewBrief({ ...newBrief, title: selectedTopic.topic, targetKeyword: selectedTopic.topic.toLowerCase() });
                setShowTopicModal(false);
                setShowAddModal(true);
              }}>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Brief
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Optimization Modal */}
      <Modal
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
        title="Apply Optimization"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            AI will automatically apply this optimization to your content. This may take a few moments.
          </p>
          <div className="p-4 rounded-lg bg-bg-elevated">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-text-primary">AI Content Optimizer</p>
                <p className="text-sm text-text-muted">Powered by GPT-4</p>
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowOptimizeModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowOptimizeModal(false)}>
              <Zap className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Audit Item Details Panel */}
      <SlidePanel
        isOpen={!!selectedAuditItem}
        onClose={() => setSelectedAuditItem(null)}
        title={selectedAuditItem?.title || "Content Details"}
        size="lg"
      >
        {selectedAuditItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="text-2xl font-bold text-text-primary">{selectedAuditItem.contentScore}</p>
                <p className="text-sm text-text-muted">Content Score</p>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="text-2xl font-bold text-text-primary">{formatNumber(selectedAuditItem.traffic)}</p>
                <p className="text-sm text-text-muted">Monthly Traffic</p>
              </div>
            </div>
            
            {selectedAuditItem.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Issues Found</h4>
                <div className="space-y-2">
                  {selectedAuditItem.issues.map((issue, i) => (
                    <div key={i} className="p-3 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-error" />
                      <span className="text-text-primary">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedAuditItem.opportunities.length > 0 && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Opportunities</h4>
                <div className="space-y-2">
                  {selectedAuditItem.opportunities.map((opp, i) => (
                    <div key={i} className="p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-success" />
                      <span className="text-text-primary">{opp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => setSelectedAuditItem(null)}>
                Close
              </Button>
              <Button variant="accent">
                <Zap className="h-4 w-4 mr-2" />
                Auto-Optimize
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
