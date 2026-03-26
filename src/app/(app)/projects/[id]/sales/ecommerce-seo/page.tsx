"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Target,
  BarChart2,
  Star,
  Tag,
  Layers,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Download,
  RefreshCw,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Box,
  Store,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { useProjectContext } from "@/contexts/project-context";
import { useSiteAuditData } from "@/hooks/use-seo-data";
import { useSEOAnalysis } from "@/hooks/use-llm";
import { formatNumber, getDifficultyColor, cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type TabType = "overview" | "products" | "categories" | "schema" | "competitors" | "optimization";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 className="h-4 w-4" /> },
  { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { id: "categories", label: "Categories", icon: <Layers className="h-4 w-4" /> },
  { id: "schema", label: "Schema", icon: <Tag className="h-4 w-4" /> },
  { id: "competitors", label: "Competitors", icon: <Store className="h-4 w-4" /> },
  { id: "optimization", label: "Optimization", icon: <Sparkles className="h-4 w-4" /> },
];

// Mock data
const mockStoreStats = {
  totalProducts: 1247,
  indexedProducts: 1189,
  avgProductRating: 4.3,
  organicTraffic: 125000,
  trafficChange: 18.5,
  organicRevenue: 485000,
  revenueChange: 22.3,
  conversionRate: 3.2,
};

const mockProducts = [
  { id: 1, name: "Premium SEO Tool Suite", category: "Software", price: 299, traffic: 12500, position: 3, rating: 4.8, reviews: 156, schemaValid: true },
  { id: 2, name: "Keyword Research Pro", category: "Software", price: 149, traffic: 8900, position: 5, rating: 4.5, reviews: 89, schemaValid: true },
  { id: 3, name: "Link Building Toolkit", category: "Software", price: 199, traffic: 6700, position: 8, rating: 4.2, reviews: 67, schemaValid: false },
  { id: 4, name: "Technical SEO Analyzer", category: "Software", price: 249, traffic: 5400, position: 12, rating: 4.6, reviews: 45, schemaValid: true },
  { id: 5, name: "Content Optimization Suite", category: "Software", price: 179, traffic: 4200, position: 15, rating: 4.4, reviews: 34, schemaValid: false },
];

const mockCategories = [
  { name: "SEO Tools", products: 45, traffic: 45000, avgPosition: 8.2, schemaComplete: 85 },
  { name: "Analytics Software", products: 32, traffic: 28000, avgPosition: 12.5, schemaComplete: 72 },
  { name: "Content Tools", products: 28, traffic: 22000, avgPosition: 15.3, schemaComplete: 68 },
  { name: "Link Building", products: 18, traffic: 15000, avgPosition: 18.7, schemaComplete: 55 },
  { name: "Technical SEO", products: 22, traffic: 18000, avgPosition: 10.2, schemaComplete: 90 },
];

const mockSchemaIssues = [
  { type: "Missing Product Schema", count: 58, severity: "critical" },
  { type: "Invalid Price Format", count: 23, severity: "warning" },
  { type: "Missing Review Schema", count: 89, severity: "warning" },
  { type: "Missing Availability", count: 34, severity: "info" },
  { type: "Missing Brand", count: 45, severity: "info" },
];

const mockCompetitors = [
  { name: "SEMrush Store", products: 2500, avgPosition: 5.2, traffic: 450000, schemaScore: 95 },
  { name: "Ahrefs Shop", products: 1800, avgPosition: 6.8, traffic: 380000, schemaScore: 92 },
  { name: "Moz Marketplace", products: 1200, avgPosition: 8.5, traffic: 220000, schemaScore: 88 },
  { name: "Majestic Store", products: 800, avgPosition: 12.3, traffic: 95000, schemaScore: 75 },
];

const mockOptimizationTips = [
  { title: "Add Product Schema to 58 products", impact: "high", category: "Schema", status: "pending" },
  { title: "Optimize product titles with keywords", impact: "high", category: "Content", status: "in_progress" },
  { title: "Add customer reviews to product pages", impact: "high", category: "Trust", status: "pending" },
  { title: "Improve category page content", impact: "medium", category: "Content", status: "pending" },
  { title: "Fix broken product images", impact: "medium", category: "Technical", status: "completed" },
  { title: "Add FAQ schema to product pages", impact: "medium", category: "Schema", status: "pending" },
];

const mockRevenueTrend = [
  { month: "Oct", revenue: 320000, traffic: 95000 },
  { month: "Nov", revenue: 380000, traffic: 105000 },
  { month: "Dec", revenue: 520000, traffic: 145000 },
  { month: "Jan", revenue: 420000, traffic: 115000 },
  { month: "Feb", revenue: 450000, traffic: 120000 },
  { month: "Mar", revenue: 485000, traffic: 125000 },
];

export default function EcommerceSEOPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showProductDetail, setShowProductDetail] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<typeof mockProducts[0] | null>(null);
  const [showSchemaGenerator, setShowSchemaGenerator] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [optimizeResult, setOptimizeResult] = React.useState<string | null>(null);
  const [showOptimizeResult, setShowOptimizeResult] = React.useState(false);

  // Data hooks
  const { isLoading: auditLoading, source: auditSource, refetch: refetchAudit } = useSiteAuditData(
    project?.url || ''
  );
  const { analyze, isLoading: llmLoading } = useSEOAnalysis();

  const handleSyncProducts = React.useCallback(async () => {
    setIsSyncing(true);
    await refetchAudit();
    setIsSyncing(false);
  }, [refetchAudit]);

  const handleBulkOptimize = React.useCallback(async () => {
    try {
      const result = await analyze('generateContent', {
        topic: 'E-commerce product page SEO optimization strategy',
        keywords: ['product seo', 'schema markup', 'rich results'],
        contentType: 'landing' as const,
      });
      setOptimizeResult(result);
      setShowOptimizeResult(true);
    } catch {
      // Error handled by hook
    }
  }, [analyze]);

  const handleGenerateSchema = React.useCallback(async () => {
    try {
      const result = await analyze('generateContent', {
        topic: 'Generate Product schema markup (JSON-LD) for e-commerce products',
        keywords: ['product schema', 'structured data', 'rich snippets'],
        contentType: 'meta' as const,
      });
      setOptimizeResult(result);
      setShowOptimizeResult(true);
      setShowSchemaGenerator(false);
    } catch {
      // Error handled by hook
    }
  }, [analyze]);

  if (!project) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "products":
        return renderProductsTab();
      case "categories":
        return renderCategoriesTab();
      case "schema":
        return renderSchemaTab();
      case "competitors":
        return renderCompetitorsTab();
      case "optimization":
        return renderOptimizationTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Organic Revenue"
          value={`$${formatNumber(mockStoreStats.organicRevenue)}`}
          trend={mockStoreStats.revenueChange}
          trendLabel="this month"
          icon={<DollarSign className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Organic Traffic"
          value={formatNumber(mockStoreStats.organicTraffic)}
          trend={mockStoreStats.trafficChange}
          trendLabel="this month"
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Indexed Products"
          value={`${mockStoreStats.indexedProducts}/${mockStoreStats.totalProducts}`}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          label="Conversion Rate"
          value={`${mockStoreStats.conversionRate}%`}
          icon={<Percent className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Traffic Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockRevenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#FD8C73" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="traffic" name="Traffic" stroke="#6366F1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProducts.slice(0, 4).map((product, i) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent">#{i + 1}</span>
                    <div>
                      <p className="font-medium text-text-primary text-sm">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span>{product.rating}</span>
                        <span>•</span>
                        <span>{product.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-text-primary">{formatNumber(product.traffic)}</p>
                    <p className="text-xs text-text-muted">visits/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Schema Issues Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mockSchemaIssues.map((issue) => (
              <div key={issue.type} className="p-4 rounded-lg border border-border">
                <p className="text-2xl font-bold text-text-primary">{issue.count}</p>
                <p className="text-sm text-text-muted">{issue.type}</p>
                <Badge variant={issue.severity === "critical" ? "error" : issue.severity === "warning" ? "warning" : "info"} className="mt-2">
                  {issue.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderProductsTab = () => (
    <>
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="accent">
          <Sparkles className="h-4 w-4 mr-2" />
          Bulk Optimize
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Product</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Price</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Traffic</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Rating</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Schema</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductDetail(true);
                    }}
                    className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-text-primary">{product.name}</p>
                        <p className="text-xs text-text-muted">{product.category}</p>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono">${product.price}</td>
                    <td className="p-4 text-center font-mono">{formatNumber(product.traffic)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={product.position <= 5 ? "success" : product.position <= 10 ? "warning" : "neutral"}>
                        #{product.position}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-mono">{product.rating}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {product.schemaValid ? (
                        <CheckCircle className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-warning mx-auto" />
                      )}
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

  const renderCategoriesTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Categories"
          value={mockCategories.length}
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          label="Total Products"
          value={mockCategories.reduce((s, c) => s + c.products, 0)}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Position"
          value={(mockCategories.reduce((s, c) => s + c.avgPosition, 0) / mockCategories.length).toFixed(1)}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Schema Complete"
          value={`${Math.round(mockCategories.reduce((s, c) => s + c.schemaComplete, 0) / mockCategories.length)}%`}
          icon={<Tag className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Category</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Products</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Traffic</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Avg. Position</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Schema Complete</th>
                </tr>
              </thead>
              <tbody>
                {mockCategories.map((cat) => (
                  <tr key={cat.name} className="border-b border-border hover:bg-bg-elevated transition-colors">
                    <td className="p-4 font-medium text-text-primary">{cat.name}</td>
                    <td className="p-4 text-center font-mono">{cat.products}</td>
                    <td className="p-4 text-center font-mono">{formatNumber(cat.traffic)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={cat.avgPosition <= 10 ? "success" : cat.avgPosition <= 20 ? "warning" : "neutral"}>
                        {cat.avgPosition.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 h-2 bg-bg-elevated rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              cat.schemaComplete >= 80 ? "bg-success" : cat.schemaComplete >= 60 ? "bg-warning" : "bg-error"
                            )}
                            style={{ width: `${cat.schemaComplete}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm">{cat.schemaComplete}%</span>
                      </div>
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

  const renderSchemaTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Products with Schema"
          value={`${mockStoreStats.indexedProducts - mockSchemaIssues[0].count}/${mockStoreStats.totalProducts}`}
          icon={<Tag className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Critical Issues"
          value={mockSchemaIssues.filter(i => i.severity === "critical").reduce((s, i) => s + i.count, 0)}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Warnings"
          value={mockSchemaIssues.filter(i => i.severity === "warning").reduce((s, i) => s + i.count, 0)}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Rich Results Eligible"
          value={`${Math.round(((mockStoreStats.totalProducts - mockSchemaIssues[0].count) / mockStoreStats.totalProducts) * 100)}%`}
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Schema Issues</CardTitle>
            <Button variant="accent" onClick={() => setShowSchemaGenerator(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Schema
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSchemaIssues.map((issue) => (
              <div key={issue.type} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {issue.severity === "critical" ? (
                    <AlertTriangle className="h-5 w-5 text-error" />
                  ) : issue.severity === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-info" />
                  )}
                  <div>
                    <p className="font-medium text-text-primary">{issue.type}</p>
                    <p className="text-sm text-text-muted">{issue.count} products affected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={issue.severity === "critical" ? "error" : issue.severity === "warning" ? "warning" : "info"}>
                    {issue.severity}
                  </Badge>
                  <Button variant="ghost" size="sm">Fix All</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderCompetitorsTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Your Products"
          value={mockStoreStats.totalProducts}
          icon={<Package className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Your Traffic"
          value={formatNumber(mockStoreStats.organicTraffic)}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Top Competitor Traffic"
          value={formatNumber(Math.max(...mockCompetitors.map(c => c.traffic)))}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Traffic Gap"
          value={formatNumber(Math.max(...mockCompetitors.map(c => c.traffic)) - mockStoreStats.organicTraffic)}
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>E-commerce Competitors</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Store</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Products</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Avg. Position</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Traffic</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Schema Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border bg-accent/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Store className="h-5 w-5 text-accent" />
                      </div>
                      <span className="font-medium text-accent">Your Store</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-accent">{mockStoreStats.totalProducts}</td>
                  <td className="p-4 text-center font-mono">8.5</td>
                  <td className="p-4 text-center font-mono text-accent">{formatNumber(mockStoreStats.organicTraffic)}</td>
                  <td className="p-4 text-center font-mono">78%</td>
                </tr>
                {mockCompetitors.map((comp) => (
                  <tr key={comp.name} className="border-b border-border hover:bg-bg-elevated transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                          <Store className="h-5 w-5 text-text-muted" />
                        </div>
                        <span className="font-medium text-text-primary">{comp.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono">{formatNumber(comp.products)}</td>
                    <td className="p-4 text-center font-mono">{comp.avgPosition}</td>
                    <td className="p-4 text-center font-mono">{formatNumber(comp.traffic)}</td>
                    <td className="p-4 text-center font-mono">{comp.schemaScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderOptimizationTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Optimization Tasks"
          value={mockOptimizationTips.length}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={mockOptimizationTips.filter(t => t.status === "completed").length}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="High Impact"
          value={mockOptimizationTips.filter(t => t.impact === "high").length}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Est. Traffic Gain"
          value="+25K"
          icon={<Eye className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>E-commerce Optimization Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOptimizationTips.map((tip, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={tip.status === "completed"}
                    onChange={() => {}}
                    className="rounded border-border"
                  />
                  <div>
                    <p className={cn(
                      "font-medium",
                      tip.status === "completed" ? "text-text-muted line-through" : "text-text-primary"
                    )}>
                      {tip.title}
                    </p>
                    <Badge variant="neutral" className="mt-1">{tip.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tip.impact === "high" ? "success" : "warning"}>{tip.impact} impact</Badge>
                  <Badge variant={
                    tip.status === "completed" ? "success" :
                    tip.status === "in_progress" ? "warning" : "neutral"
                  }>
                    {tip.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <ShoppingCart className="h-7 w-7 text-accent" />
              E-Commerce SEO
            </h1>
            <DataSourceIndicator
              source={auditSource}
              isLoading={auditLoading}
              onRefresh={refetchAudit}
              compact
            />
          </div>
          <p className="text-text-secondary">
            Optimize your product pages and increase organic revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleSyncProducts} disabled={isSyncing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
            Sync Products
          </Button>
          <Button variant="accent" onClick={handleBulkOptimize} disabled={llmLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {llmLoading ? "Optimizing..." : "Bulk Optimize"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
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

      {renderTabContent()}

      <Modal
        isOpen={showProductDetail}
        onClose={() => setShowProductDetail(false)}
        title={selectedProduct?.name || "Product Details"}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Price</p>
                <p className="text-xl font-bold">${selectedProduct.price}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Traffic</p>
                <p className="text-xl font-bold">{formatNumber(selectedProduct.traffic)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Position</p>
                <p className="text-xl font-bold text-accent">#{selectedProduct.position}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <p className="text-xl font-bold">{selectedProduct.rating}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-sm text-text-muted mb-2">Schema Status</p>
              {selectedProduct.schemaValid ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span>Valid Product Schema</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Schema needs attention</span>
                </div>
              )}
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowProductDetail(false)}>Close</Button>
              <Button
                variant="accent"
                disabled={llmLoading}
                onClick={async () => {
                  try {
                    const result = await analyze('generateContent', {
                      topic: `Optimize product page SEO for: "${selectedProduct.name}"`,
                      keywords: [selectedProduct.name.toLowerCase(), selectedProduct.category.toLowerCase()],
                      contentType: 'product' as const,
                    });
                    setOptimizeResult(result);
                    setShowOptimizeResult(true);
                  } catch {
                    // Error handled by hook
                  }
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {llmLoading ? "Optimizing..." : "Optimize Product"}
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showSchemaGenerator}
        onClose={() => setShowSchemaGenerator(false)}
        title="Generate Product Schema"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Generate valid Product schema markup for your products to enable rich results in search.
          </p>
          <div className="p-4 rounded-lg bg-bg-elevated">
            <p className="text-sm text-text-muted mb-2">Products without schema:</p>
            <p className="text-2xl font-bold text-accent">{mockSchemaIssues[0].count}</p>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowSchemaGenerator(false)}>Cancel</Button>
            <Button variant="accent" onClick={handleGenerateSchema} disabled={llmLoading}>
              <Sparkles className="h-4 w-4 mr-2" />
              {llmLoading ? "Generating..." : "Generate All"}
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <Modal
        isOpen={showOptimizeResult}
        onClose={() => setShowOptimizeResult(false)}
        title="AI Optimization Suggestions"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">AI-Generated Suggestions</span>
            </div>
            <div className="text-sm text-text-secondary whitespace-pre-wrap">
              {optimizeResult || "No suggestions generated yet."}
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowOptimizeResult(false)}>Close</Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
