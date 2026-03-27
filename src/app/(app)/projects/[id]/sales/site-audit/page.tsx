"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  Download,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Zap,
  Globe,
  FileCode,
  Link2,
  Gauge,
  Code,
  Copy,
  Check,
  Play,
  Settings,
  Eye,
  FileText,
  Network,
  Shield,
  Smartphone,
  Clock,
  Activity,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Layers,
  Box,
  ArrowRight,
  Wrench,
  Lightbulb,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import {
  mockTechnicalIssues,
  mockPageAudits,
  mockCrawlSummary,
  mockCoreWebVitals,
  mockLighthouseScores,
  getIssueCounts,
  getIssuesByCategory,
  generateFixCode,
  type TechnicalIssue,
  type PageAudit,
} from "@/data/mock-technical-seo";
import { useSiteAuditData } from "@/hooks/use-seo-data";
import { useProjectContext } from "@/contexts/project-context";
import { useProjectConfig } from "@/contexts/project-config-context";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";
import { exportAuditIssues, type AuditIssueExportData } from "@/lib/export";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Treemap,
} from "recharts";

type TabType = "overview" | "crawl" | "issues" | "performance" | "schema" | "links" | "fixes";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 className="h-4 w-4" /> },
  { id: "crawl", label: "Crawl Results", icon: <Globe className="h-4 w-4" /> },
  { id: "issues", label: "Technical Issues", icon: <AlertTriangle className="h-4 w-4" /> },
  { id: "performance", label: "Performance", icon: <Gauge className="h-4 w-4" /> },
  { id: "schema", label: "Schema", icon: <Code className="h-4 w-4" /> },
  { id: "links", label: "Internal Links", icon: <Link2 className="h-4 w-4" /> },
  { id: "fixes", label: "Fix Generator", icon: <Wrench className="h-4 w-4" /> },
];

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-error",
    bg: "bg-error/10",
    label: "Critical",
    badgeVariant: "error" as const,
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Warning",
    badgeVariant: "warning" as const,
  },
  info: {
    icon: Info,
    color: "text-info",
    bg: "bg-info/10",
    label: "Info",
    badgeVariant: "info" as const,
  },
};

const categoryLabels: Record<string, string> = {
  crawlability: "Crawlability",
  indexability: "Indexability",
  performance: "Performance",
  content: "Content",
  links: "Links",
  security: "Security",
  mobile: "Mobile",
  "structured-data": "Structured Data",
};

// Mock schema data
const mockSchemaData = [
  { type: "Organization", status: "valid", pages: 1, issues: 0 },
  { type: "WebSite", status: "valid", pages: 1, issues: 0 },
  { type: "BreadcrumbList", status: "warning", pages: 45, issues: 3 },
  { type: "Article", status: "valid", pages: 28, issues: 0 },
  { type: "Product", status: "missing", pages: 0, issues: 15 },
  { type: "FAQ", status: "missing", pages: 0, issues: 8 },
  { type: "LocalBusiness", status: "warning", pages: 1, issues: 2 },
];

// Mock internal link data
const mockInternalLinks = {
  totalLinks: 4523,
  uniqueLinks: 1847,
  avgLinksPerPage: 12.4,
  orphanPages: 12,
  topLinkedPages: [
    { url: "/", title: "Home", incomingLinks: 156 },
    { url: "/services", title: "Services", incomingLinks: 89 },
    { url: "/about", title: "About Us", incomingLinks: 67 },
    { url: "/blog", title: "Blog", incomingLinks: 54 },
    { url: "/contact", title: "Contact", incomingLinks: 45 },
  ],
  linkDistribution: [
    { depth: 1, pages: 8, percentage: 5 },
    { depth: 2, pages: 45, percentage: 29 },
    { depth: 3, pages: 67, percentage: 43 },
    { depth: 4, pages: 28, percentage: 18 },
    { depth: 5, pages: 8, percentage: 5 },
  ],
};

export default function SiteAuditPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  const { startAudit, completeAudit, failAudit } = useProjectConfig();

  const [activeTab, setActiveTabRaw] = React.useState<TabType>("overview");
  const setActiveTab = React.useCallback((tab: TabType) => {
    React.startTransition(() => { setActiveTabRaw(tab); });
  }, []);
  const [isCrawling, setIsCrawling] = React.useState(false);
  const [crawlProgress, setCrawlProgress] = React.useState("");
  const [crawlDepth, setCrawlDepth] = React.useState<number>(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState<"all" | "critical" | "warning" | "info">("all");
  const [expandedIssues, setExpandedIssues] = React.useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [generatingFix, setGeneratingFix] = React.useState<string | null>(null);
  const [generatedFixes, setGeneratedFixes] = React.useState<Record<string, string>>({});
  
  // Modal states
  const [showPageDetail, setShowPageDetail] = React.useState(false);
  const [showIssueDetail, setShowIssueDetail] = React.useState(false);
  const [showSchemaGenerator, setShowSchemaGenerator] = React.useState(false);
  const [showFixExport, setShowFixExport] = React.useState(false);
  const [showRecrawlModal, setShowRecrawlModal] = React.useState(false);
  
  // Selected items
  const [selectedPage, setSelectedPage] = React.useState<PageAudit | null>(null);
  const [selectedIssue, setSelectedIssue] = React.useState<TechnicalIssue | null>(null);
  const [selectedSchemaType, setSelectedSchemaType] = React.useState<string | null>(null);
  const [selectedFixes, setSelectedFixes] = React.useState<Set<string>>(new Set());
  const [exportFormat, setExportFormat] = React.useState<"csv" | "json" | "html">("html");

  // Fetch site audit data from API (with mock fallback)
  const { data: auditData, isLoading: auditLoading, source: auditSource, refetch: refetchAudit } = useSiteAuditData(
    project?.url || ''
  );

  const handleStartCrawl = async () => {
    if (!project?.url) return;
    setIsCrawling(true);
    setCrawlProgress("Starting crawl...");
    const auditId = startAudit();

    try {
      // Start the crawl
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'onpageTaskPost',
          params: { url: project.url },
        }),
      });

      if (!response.ok) throw new Error('Failed to start crawl');

      const result = await response.json();
      const taskId = result.tasks?.[0]?.id;

      if (taskId) {
        setCrawlProgress("Crawl in progress...");
        // Poll for results
        let attempts = 0;
        const maxAttempts = 30;
        const poll = async () => {
          attempts++;
          try {
            const statusResponse = await fetch('/api/dataforseo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                method: 'onpageSummary',
                params: { taskId },
              }),
            });
            if (statusResponse.ok) {
              const statusResult = await statusResponse.json();
              const summary = statusResult.tasks?.[0]?.result?.[0];
              if (summary) {
                const crawlStatus = summary.crawl_progress || 'in_progress';
                setCrawlProgress(`Crawled ${summary.pages_crawled || 0} pages...`);
                if (crawlStatus === 'finished' || attempts >= maxAttempts) {
                  const score = Math.round(100 - (Number(summary.pages_with_errors || 0) / Math.max(Number(summary.pages_crawled || 1), 1)) * 100);
                  const issues = (Number(summary.pages_with_errors || 0) + Number(summary.pages_with_warnings || 0));
                  completeAudit(auditId, score, issues);
                  setCrawlProgress("Crawl complete!");
                  setIsCrawling(false);
                  refetchAudit();
                  setTimeout(() => setShowRecrawlModal(false), 1500);
                  return;
                }
              }
            }
            if (attempts < maxAttempts) {
              setTimeout(poll, 10000);
            }
          } catch {
            failAudit(auditId);
            setIsCrawling(false);
            setCrawlProgress("Crawl failed. Please try again.");
          }
        };
        setTimeout(poll, 15000);
      } else {
        // Mock/fallback - simulate instant completion
        setCrawlProgress("Processing results...");
        setTimeout(() => {
          completeAudit(auditId, 78, 17);
          setCrawlProgress("Crawl complete!");
          setIsCrawling(false);
          refetchAudit();
          setTimeout(() => setShowRecrawlModal(false), 1500);
        }, 2000);
      }
    } catch {
      failAudit(auditId);
      setIsCrawling(false);
      setCrawlProgress("Crawl failed. Please try again.");
    }
  };

  if (!project) return null;

  // Use API data for overview stats, fallback to mock data for detailed views
  const healthScore = auditData?.healthScore ?? mockCrawlSummary.healthScore;
  const pagesScanned = auditData?.pagesScanned ?? mockCrawlSummary.crawledPages;
  const apiIssueCounts = auditData?.issues ?? null;
  const issueCounts = apiIssueCounts 
    ? { 
        critical: apiIssueCounts.critical, 
        warning: apiIssueCounts.warnings, 
        info: apiIssueCounts.notices,
        total: apiIssueCounts.critical + apiIssueCounts.warnings + apiIssueCounts.notices
      }
    : getIssueCounts();
  const issuesByCategory = getIssuesByCategory();

  const filteredIssues = mockTechnicalIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || issue.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const toggleIssue = (id: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateAIFix = async (issue: TechnicalIssue) => {
    setGeneratingFix(issue.id);
    try {
      const response = await fetch('/api/llm/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'technicalAudit',
          params: {
            issues: [issue.title + ': ' + issue.description],
            url: project?.url || '',
          },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedFixes(prev => ({ ...prev, [issue.id]: data.result }));
      }
    } catch (error) {
      console.warn('Failed to generate AI fix:', error);
    } finally {
      setGeneratingFix(null);
    }
  };

  const toggleFixSelection = (id: string) => {
    setSelectedFixes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "crawl":
        return renderCrawlTab();
      case "issues":
        return renderIssuesTab();
      case "performance":
        return renderPerformanceTab();
      case "schema":
        return renderSchemaTab();
      case "links":
        return renderLinksTab();
      case "fixes":
        return renderFixesTab();
      default:
        return renderOverviewTab();
    }
  };

  // Overview Tab
  const renderOverviewTab = () => {
    const healthScoreData = [
      { name: "Score", value: healthScore, fill: "#FD8C73" },
      { name: "Remaining", value: 100 - healthScore, fill: "#1F2937" },
    ];

    const issueDistributionData = [
      { name: "Critical", value: issueCounts.critical, fill: "#EF4444" },
      { name: "Warning", value: issueCounts.warning, fill: "#F59E0B" },
      { name: "Info", value: issueCounts.info, fill: "#3B82F6" },
    ];

    const categoryData = Object.entries(issuesByCategory).map(([category, count]) => ({
      name: categoryLabels[category] || category,
      issues: count,
    }));

    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Health Score"
            value={`${healthScore}/100`}
            trend={5.2}
            trendLabel="vs last audit"
            icon={<Zap className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            label="Pages Crawled"
            value={formatNumber(pagesScanned)}
            trendLabel={`of ${formatNumber(mockCrawlSummary.totalPages)} total`}
            icon={<Globe className="h-5 w-5" />}
          />
          <StatCard
            label="Critical Issues"
            value={issueCounts.critical}
            trend={-2}
            trendLabel="vs last audit"
            icon={<AlertCircle className="h-5 w-5" />}
          />
          <StatCard
            label="Total Issues"
            value={issueCounts.total}
            trend={-8}
            trendLabel="vs last audit"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score Gauge */}
          <Card>
            <CardHeader>
              <CardTitle>Site Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthScoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={180}
                      endAngle={0}
                      dataKey="value"
                    >
                      {healthScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center mt-8">
                    <p className="text-4xl font-bold text-accent">{healthScore}</p>
                    <p className="text-sm text-text-muted">out of 100</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-bg-elevated">
                <p className="text-sm text-text-secondary">
                  {healthScore >= 80 ? "Good" : healthScore >= 60 ? "Needs Improvement" : "Poor"} - 
                  {healthScore >= 80 
                    ? " Your site is well-optimized with minor issues to address."
                    : healthScore >= 60
                    ? " Several issues need attention to improve SEO performance."
                    : " Critical issues are affecting your site's SEO performance."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Issue Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueDistributionData}
                      cx="50%"
                      cy="45%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {issueDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {issueDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm text-text-muted">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Issues by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="issues" fill="#FD8C73" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab("issues")}
                className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors text-left"
              >
                <AlertCircle className="h-8 w-8 text-error mb-2" />
                <p className="font-medium text-text-primary">Fix Critical Issues</p>
                <p className="text-sm text-text-muted">{issueCounts.critical} issues need attention</p>
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors text-left"
              >
                <Gauge className="h-8 w-8 text-warning mb-2" />
                <p className="font-medium text-text-primary">Improve Performance</p>
                <p className="text-sm text-text-muted">Core Web Vitals analysis</p>
              </button>
              <button
                onClick={() => setActiveTab("schema")}
                className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors text-left"
              >
                <Code className="h-8 w-8 text-info mb-2" />
                <p className="font-medium text-text-primary">Add Schema Markup</p>
                <p className="text-sm text-text-muted">Generate structured data</p>
              </button>
              <button
                onClick={() => setActiveTab("fixes")}
                className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors text-left"
              >
                <Wrench className="h-8 w-8 text-accent mb-2" />
                <p className="font-medium text-text-primary">Generate Fix Code</p>
                <p className="text-sm text-text-muted">Auto-generate solutions</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Top Issues */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Issues to Fix</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("issues")}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockTechnicalIssues.filter(i => i.severity === 'critical').slice(0, 4).map((issue) => {
                const config = severityConfig[issue.severity];
                const Icon = config.icon;
                return (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowIssueDetail(true);
                    }}
                    className="w-full p-4 flex items-center gap-3 hover:bg-bg-elevated transition-colors text-left"
                  >
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary">{issue.title}</p>
                      <p className="text-sm text-text-muted">{issue.affectedPages} pages affected</p>
                    </div>
                    <Badge variant={config.badgeVariant}>{config.label}</Badge>
                    <ArrowRight className="h-4 w-4 text-text-muted" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  // Crawl Tab
  const renderCrawlTab = () => {
    const statusCodeData = [
      { name: "200 OK", value: mockCrawlSummary.indexablePages, fill: "#10B981" },
      { name: "301/302", value: mockCrawlSummary.redirectedPages, fill: "#F59E0B" },
      { name: "404", value: mockCrawlSummary.brokenPages, fill: "#EF4444" },
      { name: "Other", value: mockCrawlSummary.nonIndexablePages - mockCrawlSummary.brokenPages, fill: "#6B7280" },
    ];

    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Pages"
            value={formatNumber(mockCrawlSummary.totalPages)}
            icon={<Globe className="h-5 w-5" />}
          />
          <StatCard
            label="Indexable Pages"
            value={formatNumber(mockCrawlSummary.indexablePages)}
            trend={Math.round((mockCrawlSummary.indexablePages / mockCrawlSummary.totalPages) * 100)}
            trendLabel="of total"
            icon={<CheckCircle className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            label="Redirected Pages"
            value={mockCrawlSummary.redirectedPages}
            icon={<ArrowRight className="h-5 w-5" />}
          />
          <StatCard
            label="Broken Pages"
            value={mockCrawlSummary.brokenPages}
            icon={<AlertCircle className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Code Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Code Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusCodeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {statusCodeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Crawl Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Crawl Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-text-muted" />
                    <span className="text-text-secondary">Last Crawl</span>
                  </div>
                  <span className="font-medium">{new Date(mockCrawlSummary.lastCrawl).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-text-muted" />
                    <span className="text-text-secondary">Crawl Rate</span>
                  </div>
                  <span className="font-medium">{Math.round((pagesScanned / mockCrawlSummary.totalPages) * 100)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-text-muted" />
                    <span className="text-text-secondary">Indexability Rate</span>
                  </div>
                  <span className="font-medium">{Math.round((mockCrawlSummary.indexablePages / pagesScanned) * 100)}%</span>
                </div>
                <Button variant="accent" className="w-full" onClick={() => setShowRecrawlModal(true)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start New Crawl
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page List */}
        <Card>
          <CardHeader>
            <CardTitle>Crawled Pages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">URL</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Status</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Load Time</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Word Count</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Issues</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPageAudits.map((page) => (
                    <tr
                      key={page.url}
                      onClick={() => {
                        setSelectedPage(page);
                        setShowPageDetail(true);
                      }}
                      className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-text-primary">{page.title}</p>
                          <p className="text-sm text-text-muted">{page.url}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={
                          page.statusCode === 200 ? "success" :
                          page.statusCode === 301 || page.statusCode === 302 ? "warning" : "error"
                        }>
                          {page.statusCode}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "font-mono",
                          page.loadTime > 3 ? "text-error" : page.loadTime > 2 ? "text-warning" : "text-success"
                        )}>
                          {page.loadTime}s
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono">{formatNumber(page.wordCount)}</td>
                      <td className="p-4 text-center">
                        {page.issues.length > 0 ? (
                          <Badge variant="warning">{page.issues.length}</Badge>
                        ) : (
                          <Badge variant="success">0</Badge>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "font-semibold",
                          page.score >= 80 ? "text-success" : page.score >= 60 ? "text-warning" : "text-error"
                        )}>
                          {page.score}
                        </span>
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

  // Issues Tab
  const renderIssuesTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Critical Issues"
          value={issueCounts.critical}
          icon={<AlertCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Warnings"
          value={issueCounts.warning}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Info"
          value={issueCounts.info}
          icon={<Info className="h-5 w-5" />}
        />
        <StatCard
          label="Total Issues"
          value={issueCounts.total}
          icon={<Layers className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
          {(["all", "critical", "warning", "info"] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setSeverityFilter(severity)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize flex items-center gap-1.5",
                severityFilter === severity
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {severity !== "all" && (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    severity === "critical" && "bg-error",
                    severity === "warning" && "bg-warning",
                    severity === "info" && "bg-info"
                  )}
                />
              )}
              {severity === "all" ? "All" : severityConfig[severity].label}
              {severity !== "all" && (
                <span className="text-text-muted">({issueCounts[severity]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Issues ({filteredIssues.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredIssues.map((issue) => {
              const config = severityConfig[issue.severity];
              const Icon = config.icon;
              const isExpanded = expandedIssues.has(issue.id);

              return (
                <div key={issue.id} className="p-4">
                  <button onClick={() => toggleIssue(issue.id)} className="w-full text-left">
                    <div className="flex items-start gap-3">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-text-primary">{issue.title}</h3>
                            <Badge variant={config.badgeVariant} className="text-xs">{config.label}</Badge>
                            <Badge variant="neutral" className="text-xs">{categoryLabels[issue.category]}</Badge>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-text-muted" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-text-muted" />
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{issue.description}</p>
                        {issue.affectedPages > 0 && (
                          <p className="text-xs text-text-muted mt-1">{issue.affectedPages} pages affected</p>
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 ml-11 p-4 bg-bg-elevated rounded-lg space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">How to Fix</h4>
                        <p className="text-sm text-text-primary">{issue.fixSuggestion}</p>
                      </div>
                      
                      {issue.fixCode && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">Fix Code</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(issue.fixCode!, issue.id)}
                            >
                              {copiedCode === issue.id ? (
                                <Check className="h-3.5 w-3.5 mr-1 text-success" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 mr-1" />
                              )}
                              {copiedCode === issue.id ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                          <pre className="p-3 bg-bg-primary rounded-lg text-sm font-mono text-text-secondary overflow-x-auto">
                            {issue.fixCode}
                          </pre>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="accent"
                          size="sm"
                          disabled={generatingFix === issue.id}
                          onClick={() => handleGenerateAIFix(issue)}
                        >
                          {generatingFix === issue.id ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <Zap className="h-3.5 w-3.5 mr-1" />
                          )}
                          {generatingFix === issue.id ? "Generating..." : "Generate AI Fix"}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View affected pages
                        </Button>
                      </div>

                      {generatedFixes[issue.id] && (
                        <div className="mt-4 p-4 rounded-lg border border-accent/30 bg-accent/5">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                              <Zap className="h-4 w-4 text-accent" />
                              AI-Generated Fix
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(generatedFixes[issue.id], `ai-fix-${issue.id}`)}
                            >
                              {copiedCode === `ai-fix-${issue.id}` ? (
                                <Check className="h-3.5 w-3.5 mr-1 text-success" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 mr-1" />
                              )}
                              {copiedCode === `ai-fix-${issue.id}` ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                          <pre className="p-3 bg-bg-primary rounded-lg text-sm font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap">
                            {generatedFixes[issue.id]}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Performance Tab
  const renderPerformanceTab = () => {
    const lighthouseData = [
      { name: "Performance", score: mockLighthouseScores.performance, fullMark: 100 },
      { name: "Accessibility", score: mockLighthouseScores.accessibility, fullMark: 100 },
      { name: "Best Practices", score: mockLighthouseScores.bestPractices, fullMark: 100 },
      { name: "SEO", score: mockLighthouseScores.seo, fullMark: 100 },
    ];

    const cwvRatingColor = (rating: string) => {
      switch (rating) {
        case "good": return "text-success";
        case "needs-improvement": return "text-warning";
        case "poor": return "text-error";
        default: return "text-text-muted";
      }
    };

    return (
      <>
        {/* Core Web Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">LCP</span>
                <Badge variant={mockCoreWebVitals.lcp.rating === "good" ? "success" : mockCoreWebVitals.lcp.rating === "needs-improvement" ? "warning" : "error"}>
                  {mockCoreWebVitals.lcp.rating}
                </Badge>
              </div>
              <p className={cn("text-2xl font-bold", cwvRatingColor(mockCoreWebVitals.lcp.rating))}>
                {mockCoreWebVitals.lcp.value}s
              </p>
              <p className="text-xs text-text-muted mt-1">Largest Contentful Paint</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">FID</span>
                <Badge variant={mockCoreWebVitals.fid.rating === "good" ? "success" : mockCoreWebVitals.fid.rating === "needs-improvement" ? "warning" : "error"}>
                  {mockCoreWebVitals.fid.rating}
                </Badge>
              </div>
              <p className={cn("text-2xl font-bold", cwvRatingColor(mockCoreWebVitals.fid.rating))}>
                {mockCoreWebVitals.fid.value}ms
              </p>
              <p className="text-xs text-text-muted mt-1">First Input Delay</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">CLS</span>
                <Badge variant={mockCoreWebVitals.cls.rating === "good" ? "success" : mockCoreWebVitals.cls.rating === "needs-improvement" ? "warning" : "error"}>
                  {mockCoreWebVitals.cls.rating}
                </Badge>
              </div>
              <p className={cn("text-2xl font-bold", cwvRatingColor(mockCoreWebVitals.cls.rating))}>
                {mockCoreWebVitals.cls.value}
              </p>
              <p className="text-xs text-text-muted mt-1">Cumulative Layout Shift</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">TTFB</span>
                <Badge variant={mockCoreWebVitals.ttfb.rating === "good" ? "success" : mockCoreWebVitals.ttfb.rating === "needs-improvement" ? "warning" : "error"}>
                  {mockCoreWebVitals.ttfb.rating}
                </Badge>
              </div>
              <p className={cn("text-2xl font-bold", cwvRatingColor(mockCoreWebVitals.ttfb.rating))}>
                {mockCoreWebVitals.ttfb.value}ms
              </p>
              <p className="text-xs text-text-muted mt-1">Time to First Byte</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lighthouse Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Lighthouse Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={lighthouseData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <Radar name="Score" dataKey="score" stroke="#FD8C73" fill="#FD8C73" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lighthouseData.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={cn(
                        "text-sm font-semibold",
                        item.score >= 90 ? "text-success" : item.score >= 50 ? "text-warning" : "text-error"
                      )}>
                        {item.score}
                      </span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          item.score >= 90 ? "bg-success" : item.score >= 50 ? "bg-warning" : "bg-error"
                        )}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-bg-elevated">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary">Performance Tip</p>
                    <p className="text-sm text-text-muted mt-1">
                      Focus on improving FID by reducing JavaScript execution time and optimizing third-party scripts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  // Schema Tab
  const renderSchemaTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Schema Types"
          value={mockSchemaData.filter(s => s.status !== 'missing').length}
          icon={<Code className="h-5 w-5" />}
        />
        <StatCard
          label="Valid Schemas"
          value={mockSchemaData.filter(s => s.status === 'valid').length}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="With Warnings"
          value={mockSchemaData.filter(s => s.status === 'warning').length}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Missing"
          value={mockSchemaData.filter(s => s.status === 'missing').length}
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      {/* Schema List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Structured Data</CardTitle>
            <Button variant="accent" onClick={() => setShowSchemaGenerator(true)}>
              <Code className="h-4 w-4 mr-2" />
              Generate Schema
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Schema Type</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Pages</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Issues</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSchemaData.map((schema) => (
                  <tr key={schema.type} className="border-b border-border hover:bg-bg-elevated transition-colors">
                    <td className="p-4 font-medium text-text-primary">{schema.type}</td>
                    <td className="p-4 text-center">
                      <Badge variant={
                        schema.status === 'valid' ? 'success' :
                        schema.status === 'warning' ? 'warning' : 'error'
                      }>
                        {schema.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center font-mono">{schema.pages}</td>
                    <td className="p-4 text-center">
                      {schema.issues > 0 ? (
                        <Badge variant="warning">{schema.issues}</Badge>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSchemaType(schema.type);
                          setShowSchemaGenerator(true);
                        }}
                      >
                        {schema.status === 'missing' ? 'Generate' : 'Edit'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Schema Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Schema Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSchemaData.filter(s => s.status === 'missing').map((schema) => (
              <div key={schema.type} className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="h-5 w-5 text-accent" />
                  <span className="font-medium text-text-primary">{schema.type}</span>
                </div>
                <p className="text-sm text-text-muted mb-3">
                  {schema.issues} pages could benefit from this schema type.
                </p>
                <Button
                  variant="accent"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedSchemaType(schema.type);
                    setShowSchemaGenerator(true);
                  }}
                >
                  Generate Schema
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Links Tab
  const renderLinksTab = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Links"
          value={formatNumber(mockInternalLinks.totalLinks)}
          icon={<Link2 className="h-5 w-5" />}
        />
        <StatCard
          label="Unique Links"
          value={formatNumber(mockInternalLinks.uniqueLinks)}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Links/Page"
          value={mockInternalLinks.avgLinksPerPage.toFixed(1)}
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          label="Orphan Pages"
          value={mockInternalLinks.orphanPages}
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Linked Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Linked Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInternalLinks.topLinkedPages.map((page, i) => (
                <div key={page.url} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent">#{i + 1}</span>
                    <div>
                      <p className="font-medium text-text-primary">{page.title}</p>
                      <p className="text-sm text-text-muted">{page.url}</p>
                    </div>
                  </div>
                  <Badge variant="accent">{page.incomingLinks} links</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Link Depth Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Link Depth Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockInternalLinks.linkDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="depth" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} label={{ value: 'Click Depth', position: 'bottom', fill: 'var(--color-text-muted)' }} />
                  <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="pages" fill="#FD8C73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-bg-elevated">
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary">Recommendation:</strong> Keep important pages within 3 clicks from the homepage for better crawlability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orphan Pages */}
      {mockInternalLinks.orphanPages > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Orphan Pages ({mockInternalLinks.orphanPages})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary mb-4">
              These pages have no internal links pointing to them, making them difficult for search engines to discover.
            </p>
            <div className="space-y-2">
              {["/old-landing-page", "/archived-blog-post", "/test-page"].map((url) => (
                <div key={url} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-text-primary">{url}</span>
                  <Button variant="ghost" size="sm">
                    <Link2 className="h-4 w-4 mr-1" />
                    Add Links
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  // Fixes Tab
  const renderFixesTab = () => {
    const fixableIssues = mockTechnicalIssues.filter(i => i.fixCode);

    return (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Auto-fixable Issues"
            value={fixableIssues.length}
            icon={<Wrench className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            label="Selected Fixes"
            value={selectedFixes.size}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <StatCard
            label="Pages Affected"
            value={fixableIssues.reduce((s, i) => s + i.affectedPages, 0)}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            label="Est. Time Saved"
            value={`${fixableIssues.length * 15}min`}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Fix Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select Fixes to Generate</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (selectedFixes.size === fixableIssues.length) {
                      setSelectedFixes(new Set());
                    } else {
                      setSelectedFixes(new Set(fixableIssues.map(i => i.id)));
                    }
                  }}
                >
                  {selectedFixes.size === fixableIssues.length ? "Deselect All" : "Select All"}
                </Button>
                <Button
                  variant="accent"
                  disabled={selectedFixes.size === 0}
                  onClick={() => setShowFixExport(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Fixes ({selectedFixes.size})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {fixableIssues.map((issue) => {
                const config = severityConfig[issue.severity];
                const Icon = config.icon;
                const isSelected = selectedFixes.has(issue.id);

                return (
                  <div
                    key={issue.id}
                    className={cn(
                      "p-4 cursor-pointer transition-colors",
                      isSelected ? "bg-accent/5" : "hover:bg-bg-elevated"
                    )}
                    onClick={() => toggleFixSelection(issue.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFixSelection(issue.id)}
                        className="mt-1 rounded border-border"
                      />
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-text-primary">{issue.title}</h3>
                          <Badge variant={config.badgeVariant} className="text-xs">{config.label}</Badge>
                        </div>
                        <p className="text-sm text-text-muted mb-2">{issue.affectedPages} pages affected</p>
                        {issue.fixCode && (
                          <pre className="p-2 bg-bg-elevated rounded text-xs font-mono text-text-secondary overflow-x-auto">
                            {issue.fixCode.substring(0, 100)}...
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Fix Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Fix Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: "missing_meta_description", label: "Meta Description", icon: FileText },
                { type: "missing_canonical", label: "Canonical Tag", icon: Link2 },
                { type: "missing_schema", label: "Schema Markup", icon: Code },
                { type: "redirect_301", label: "301 Redirect", icon: ArrowRight },
                { type: "robots_noindex", label: "Noindex Tag", icon: Shield },
                { type: "hreflang", label: "Hreflang Tag", icon: Globe },
              ].map((fix) => (
                <button
                  key={fix.type}
                  onClick={() => {
                    const code = generateFixCode(fix.type);
                    copyToClipboard(code, fix.type);
                  }}
                  className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors text-left"
                >
                  <fix.icon className="h-6 w-6 text-accent mb-2" />
                  <p className="font-medium text-text-primary">{fix.label}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {copiedCode === fix.type ? "Copied!" : "Click to copy"}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  // Sticky offset: topnav + projectbar (using CSS variables)
  
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Sticky Header + Tabs Container - Flush with ProjectBar (negative margins to break out of layout padding) */}
      <div className="-mx-3 sm:-mx-4 lg:-mx-6 -mt-3 sm:-mt-4 sticky top-[calc(var(--topnav-height)+var(--projectbar-height-mobile))] sm:top-[calc(var(--topnav-height)+var(--projectbar-height))] z-30 bg-bg-card border-b border-border">
        {/* Header Row - Compact */}
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 border-b border-border">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-text-primary truncate">Technical SEO Audit</h1>
              <DataSourceIndicator source={auditSource} isLoading={auditLoading} onRefresh={refetchAudit} compact />
            </div>
            <p className="text-[10px] sm:text-xs text-text-muted">
              {new Date(mockCrawlSummary.lastCrawl).toLocaleDateString()} • {formatNumber(pagesScanned)} pages
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setShowFixExport(true)}>
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">Export</span>
            </Button>
            <Button variant="accent" size="sm" className="h-7 px-2 text-xs" onClick={() => setShowRecrawlModal(true)}>
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">Re-crawl</span>
            </Button>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="flex items-center gap-0 sm:gap-0.5 px-3 sm:px-4 lg:px-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "text-text-primary border-accent"
                  : "text-text-secondary border-transparent hover:text-text-primary hover:border-border"
              )}
            >
              <span className="[&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Content - no extra padding needed, layout handles it */}
      <div className="space-y-3 sm:space-y-4">
        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Page Detail Modal */}
      <Modal
        isOpen={showPageDetail}
        onClose={() => setShowPageDetail(false)}
        title={selectedPage?.title || "Page Details"}
        description={selectedPage?.url}
        size="lg"
      >
        {selectedPage && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Status Code</p>
                <Badge variant={selectedPage.statusCode === 200 ? "success" : "warning"} className="mt-1">
                  {selectedPage.statusCode}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Load Time</p>
                <p className={cn("text-xl font-semibold", selectedPage.loadTime > 3 ? "text-error" : "text-success")}>
                  {selectedPage.loadTime}s
                </p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Word Count</p>
                <p className="text-xl font-semibold">{formatNumber(selectedPage.wordCount)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Page Score</p>
                <p className={cn("text-xl font-semibold", selectedPage.score >= 80 ? "text-success" : "text-warning")}>
                  {selectedPage.score}
                </p>
              </div>
            </div>

            {selectedPage.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-text-primary mb-3">Issues Found</h4>
                <div className="space-y-2">
                  {selectedPage.issues.map((issueType) => (
                    <div key={issueType} className="flex items-center gap-2 p-3 rounded-lg border border-border">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="text-text-secondary">{issueType.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowPageDetail(false)}>
                Close
              </Button>
              <Button variant="accent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Page
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Issue Detail Modal */}
      <Modal
        isOpen={showIssueDetail}
        onClose={() => setShowIssueDetail(false)}
        title={selectedIssue?.title || "Issue Details"}
        size="lg"
      >
        {selectedIssue && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-text-secondary">{selectedIssue.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-text-muted">Severity</p>
                <Badge variant={severityConfig[selectedIssue.severity].badgeVariant} className="mt-1">
                  {severityConfig[selectedIssue.severity].label}
                </Badge>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-text-muted">Affected Pages</p>
                <p className="text-xl font-semibold">{selectedIssue.affectedPages}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text-primary mb-2">How to Fix</h4>
              <p className="text-text-secondary">{selectedIssue.fixSuggestion}</p>
            </div>

            {selectedIssue.fixCode && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">Generated Fix Code</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(selectedIssue.fixCode!, selectedIssue.id)}
                  >
                    {copiedCode === selectedIssue.id ? (
                      <Check className="h-3.5 w-3.5 mr-1 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copiedCode === selectedIssue.id ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="p-4 bg-bg-elevated rounded-lg text-sm font-mono text-text-secondary overflow-x-auto">
                  {selectedIssue.fixCode}
                </pre>
              </div>
            )}

            {generatedFixes[selectedIssue.id] && (
              <div className="p-4 rounded-lg border border-accent/30 bg-accent/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-accent" />
                    AI-Generated Fix
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedFixes[selectedIssue.id], `ai-fix-modal-${selectedIssue.id}`)}
                  >
                    {copiedCode === `ai-fix-modal-${selectedIssue.id}` ? (
                      <Check className="h-3.5 w-3.5 mr-1 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copiedCode === `ai-fix-modal-${selectedIssue.id}` ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="p-3 bg-bg-primary rounded-lg text-sm font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap">
                  {generatedFixes[selectedIssue.id]}
                </pre>
              </div>
            )}

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowIssueDetail(false)}>
                Close
              </Button>
              <Button
                variant="accent"
                disabled={generatingFix === selectedIssue.id}
                onClick={() => handleGenerateAIFix(selectedIssue)}
              >
                {generatingFix === selectedIssue.id ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {generatingFix === selectedIssue.id ? "Generating..." : "Generate AI Fix"}
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Schema Generator Modal */}
      <Modal
        isOpen={showSchemaGenerator}
        onClose={() => setShowSchemaGenerator(false)}
        title="Schema Markup Generator"
        description={selectedSchemaType ? `Generate ${selectedSchemaType} schema` : "Select a schema type to generate"}
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Schema Type</label>
            <div className="grid grid-cols-3 gap-2">
              {["Organization", "Article", "Product", "FAQ", "LocalBusiness", "BreadcrumbList"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedSchemaType(type)}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-colors",
                    selectedSchemaType === type
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-border text-text-secondary hover:border-accent/50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {selectedSchemaType && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-text-primary">Generated Schema</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generateFixCode("missing_schema", { type: selectedSchemaType }), "schema")}
                >
                  {copiedCode === "schema" ? (
                    <Check className="h-3.5 w-3.5 mr-1 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1" />
                  )}
                  {copiedCode === "schema" ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className="p-4 bg-bg-elevated rounded-lg text-sm font-mono text-text-secondary overflow-x-auto max-h-[300px]">
                {generateFixCode("missing_schema", { type: selectedSchemaType, name: "Your Company", description: "Your description" })}
              </pre>
            </div>
          )}

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowSchemaGenerator(false)}>
              Cancel
            </Button>
            <Button variant="accent" disabled={!selectedSchemaType}>
              <Download className="h-4 w-4 mr-2" />
              Download Schema
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Fix Export Modal */}
      <Modal
        isOpen={showFixExport}
        onClose={() => setShowFixExport(false)}
        title="Export Issues"
        description={`Export ${selectedFixes.size > 0 ? selectedFixes.size : 'all'} issues`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "html" as const, label: "HTML", desc: "Print-ready report" },
                { value: "json" as const, label: "JSON", desc: "Structured data" },
                { value: "csv" as const, label: "CSV", desc: "Spreadsheet" },
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
            <Button variant="secondary" onClick={() => setShowFixExport(false)}>
              Cancel
            </Button>
            <Button 
              variant="accent"
              onClick={() => {
                // Get issues to export
                const issuesToExport = selectedFixes.size > 0
                  ? mockTechnicalIssues.filter(issue => selectedFixes.has(issue.id))
                  : mockTechnicalIssues;
                
                // Transform to export format
                const exportData: AuditIssueExportData[] = issuesToExport.map(issue => ({
                  title: issue.title,
                  severity: issue.severity,
                  category: categoryLabels[issue.category] || issue.category,
                  affectedPages: issue.affectedPages,
                  description: issue.description,
                }));
                
                // Export with selected format
                const filename = `site-audit-${project?.name || 'export'}-${new Date().toISOString().split('T')[0]}`;
                exportAuditIssues(exportData, exportFormat, filename);
                
                // Close modal
                setShowFixExport(false);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export {selectedFixes.size > 0 ? selectedFixes.size : mockTechnicalIssues.length} Issues
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Recrawl Modal */}
      <Modal
        isOpen={showRecrawlModal}
        onClose={() => setShowRecrawlModal(false)}
        title="Start New Crawl"
        description="Configure and start a new site crawl"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-bg-elevated">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-info mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">Crawl Information</p>
                <p className="text-sm text-text-muted mt-1">
                  A new crawl will analyze all pages on your site and update the audit results. This may take 5-15 minutes depending on site size.
                </p>
              </div>
            </div>
          </div>

          {isCrawling ? (
            <div className="p-6 text-center space-y-4">
              <RefreshCw className="h-8 w-8 text-accent animate-spin mx-auto" />
              <p className="font-medium text-text-primary">{crawlProgress}</p>
              <p className="text-sm text-text-muted">This may take 5-15 minutes depending on site size.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Crawl Depth</label>
                <div className="flex gap-2">
                  {[3, 5, 10, 0].map((depth) => (
                    <button
                      key={depth}
                      onClick={() => setCrawlDepth(depth)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                        crawlDepth === depth
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent/50"
                      )}
                    >
                      {depth === 0 ? "Unlimited" : depth}
                    </button>
                  ))}
                </div>
              </div>

              <ModalFooter>
                <Button variant="secondary" onClick={() => setShowRecrawlModal(false)}>
                  Cancel
                </Button>
                <Button variant="accent" onClick={handleStartCrawl}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Crawl
                </Button>
              </ModalFooter>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
