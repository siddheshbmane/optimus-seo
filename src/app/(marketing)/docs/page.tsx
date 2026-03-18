"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Book,
  Code,
  Zap,
  Settings,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  ExternalLink,
  PlayCircle,
  FileText,
  Lightbulb,
  Rocket,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const quickLinks = [
  {
    title: "Getting Started",
    description: "Set up your first project in under 5 minutes",
    icon: Rocket,
    href: "/docs/getting-started",
    color: "bg-green-500",
  },
  {
    title: "API Reference",
    description: "Complete API documentation for developers",
    icon: Code,
    href: "/docs/api",
    color: "bg-blue-500",
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step guides for every feature",
    icon: PlayCircle,
    href: "/docs/tutorials",
    color: "bg-purple-500",
  },
  {
    title: "FAQ",
    description: "Answers to common questions",
    icon: HelpCircle,
    href: "/docs/faq",
    color: "bg-orange-500",
  },
];

const categories = [
  {
    title: "Getting Started",
    icon: Rocket,
    articles: [
      { title: "Quick Start Guide", href: "/docs/getting-started/quick-start" },
      { title: "Creating Your First Project", href: "/docs/getting-started/first-project" },
      { title: "Connecting Google Search Console", href: "/docs/getting-started/gsc" },
      { title: "Understanding the Dashboard", href: "/docs/getting-started/dashboard" },
      { title: "Inviting Team Members", href: "/docs/getting-started/team" },
    ],
  },
  {
    title: "AI Visibility",
    icon: Zap,
    articles: [
      { title: "What is AI Visibility?", href: "/docs/ai-visibility/overview" },
      { title: "Tracking Brand Mentions in LLMs", href: "/docs/ai-visibility/tracking" },
      { title: "Optimizing for AI Search", href: "/docs/ai-visibility/optimization" },
      { title: "AI Visibility Reports", href: "/docs/ai-visibility/reports" },
      { title: "Competitor AI Analysis", href: "/docs/ai-visibility/competitors" },
    ],
  },
  {
    title: "Keyword Research",
    icon: BarChart3,
    articles: [
      { title: "Keyword Research Overview", href: "/docs/keywords/overview" },
      { title: "Finding Keyword Opportunities", href: "/docs/keywords/opportunities" },
      { title: "Keyword Clustering", href: "/docs/keywords/clustering" },
      { title: "Search Intent Analysis", href: "/docs/keywords/intent" },
      { title: "Competitor Keyword Gap", href: "/docs/keywords/gap-analysis" },
    ],
  },
  {
    title: "Technical SEO",
    icon: Settings,
    articles: [
      { title: "Site Audit Overview", href: "/docs/technical/audit" },
      { title: "Core Web Vitals", href: "/docs/technical/cwv" },
      { title: "Crawl Analysis", href: "/docs/technical/crawl" },
      { title: "Schema Markup", href: "/docs/technical/schema" },
      { title: "Mobile Optimization", href: "/docs/technical/mobile" },
    ],
  },
  {
    title: "Content Optimization",
    icon: FileText,
    articles: [
      { title: "Content Briefs", href: "/docs/content/briefs" },
      { title: "On-Page Optimization", href: "/docs/content/on-page" },
      { title: "Content Scoring", href: "/docs/content/scoring" },
      { title: "Topic Clusters", href: "/docs/content/clusters" },
      { title: "Content Calendar", href: "/docs/content/calendar" },
    ],
  },
  {
    title: "Reporting",
    icon: BarChart3,
    articles: [
      { title: "Report Builder", href: "/docs/reports/builder" },
      { title: "White-Label Reports", href: "/docs/reports/white-label" },
      { title: "Scheduled Reports", href: "/docs/reports/scheduled" },
      { title: "Custom Dashboards", href: "/docs/reports/dashboards" },
      { title: "Data Export", href: "/docs/reports/export" },
    ],
  },
  {
    title: "Team & Permissions",
    icon: Users,
    articles: [
      { title: "User Roles", href: "/docs/team/roles" },
      { title: "Permissions", href: "/docs/team/permissions" },
      { title: "SSO Setup", href: "/docs/team/sso" },
      { title: "Audit Logs", href: "/docs/team/audit-logs" },
    ],
  },
  {
    title: "API & Integrations",
    icon: Code,
    articles: [
      { title: "API Overview", href: "/docs/api/overview" },
      { title: "Authentication", href: "/docs/api/auth" },
      { title: "Endpoints Reference", href: "/docs/api/endpoints" },
      { title: "Webhooks", href: "/docs/api/webhooks" },
      { title: "Rate Limits", href: "/docs/api/rate-limits" },
    ],
  },
];

const popularArticles = [
  { title: "How to set up AI visibility tracking", views: "12.5k" },
  { title: "Understanding keyword difficulty scores", views: "9.8k" },
  { title: "Connecting Google Search Console", views: "8.2k" },
  { title: "Creating white-label reports", views: "7.1k" },
  { title: "API authentication guide", views: "6.4k" },
];

const recentUpdates = [
  { title: "AI Visibility 2.0 documentation", date: "Mar 15, 2026" },
  { title: "New API endpoints for bulk operations", date: "Mar 12, 2026" },
  { title: "Updated Core Web Vitals guide", date: "Mar 10, 2026" },
  { title: "Team permissions overhaul", date: "Mar 8, 2026" },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-bg-elevated">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="neutral" className="mb-4">
              <Book className="h-3 w-3 mr-1" />
              Documentation
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              How can we help?
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8">
              Everything you need to get the most out of Optimus SEO.
              Guides, tutorials, and API reference.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <Card className="bg-bg-card border-border hover:border-accent/50 transition-colors h-full">
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center text-white mb-4",
                        link.color
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {link.title}
                    </h3>
                    <p className="text-sm text-text-secondary">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              {/* Popular Articles */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                  Popular Articles
                </h3>
                <div className="space-y-3">
                  {popularArticles.map((article, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="block text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      {article.title}
                      <span className="text-text-muted ml-2">({article.views})</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Updates */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                  Recent Updates
                </h3>
                <div className="space-y-3">
                  {recentUpdates.map((update, index) => (
                    <div key={index}>
                      <Link
                        href="#"
                        className="block text-sm text-text-secondary hover:text-accent transition-colors"
                      >
                        {update.title}
                      </Link>
                      <span className="text-xs text-text-muted">{update.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help */}
              <Card className="bg-bg-card border-border">
                <CardContent className="p-6">
                  <MessageSquare className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <Button variant="accent" className="w-full" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Categories Grid */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Browse by Category
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                  <Card key={index} className="bg-bg-card border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-accent" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.articles.map((article, i) => (
                          <li key={i}>
                            <Link
                              href={article.href}
                              className="text-sm text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
                            >
                              {article.title}
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/docs/${category.title.toLowerCase().replace(/ /g, "-")}`}
                        className="inline-flex items-center gap-1 text-sm text-accent mt-4 hover:underline"
                      >
                        View all
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 sm:py-20 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Video Tutorials
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Learn by watching. Our video tutorials cover everything from basics to advanced features.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Getting Started with Optimus SEO", duration: "5:32" },
              { title: "Setting Up AI Visibility Tracking", duration: "8:15" },
              { title: "Creating Your First Report", duration: "6:48" },
              { title: "Keyword Research Masterclass", duration: "12:20" },
              { title: "Technical SEO Audit Walkthrough", duration: "10:05" },
              { title: "API Integration Tutorial", duration: "15:30" },
            ].map((video, index) => (
              <Card
                key={index}
                className="bg-bg-card border-border hover:border-accent/50 transition-colors cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center relative">
                    <PlayCircle className="h-12 w-12 text-accent group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-text-primary group-hover:text-accent transition-colors">
                      {video.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="secondary" asChild>
              <Link href="/docs/tutorials">
                View All Tutorials
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Developer Resources */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="neutral" className="mb-4">
                <Code className="h-3 w-3 mr-1" />
                For Developers
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                Build with Our API
              </h2>
              <p className="text-text-secondary mb-6">
                Full REST API access to all Optimus SEO data. Build custom integrations,
                automate workflows, and extend the platform to fit your needs.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Comprehensive REST API",
                  "Real-time webhooks",
                  "OAuth 2.0 authentication",
                  "SDKs for Python, Node.js, and PHP",
                  "Interactive API explorer",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-text-secondary">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Button variant="accent" asChild>
                  <Link href="/docs/api">
                    API Reference
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="secondary" asChild>
                  <a href="https://github.com/optimus-seo" target="_blank" rel="noopener">
                    GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="bg-bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-sm text-text-secondary overflow-x-auto">
                <code>{`# Install the SDK
pip install optimus-seo

# Initialize the client
from optimus import OptimusSEO

client = OptimusSEO(api_key="your_api_key")

# Get project rankings
rankings = client.projects.get_rankings(
    project_id="123",
    date_range="last_30_days"
)

print(f"Top 10 keywords: {rankings.top10}")
# Output: Top 10 keywords: 342`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-accent to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Create your free account and start optimizing your SEO in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-accent hover:bg-white/90"
              asChild
            >
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white border-white/30 hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
