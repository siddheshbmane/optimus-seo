"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  RefreshCw,
  Code,
  Webhook,
  Key,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = [
  { name: "All", count: 24 },
  { name: "Analytics", count: 6 },
  { name: "Search Engines", count: 4 },
  { name: "CMS", count: 5 },
  { name: "E-commerce", count: 4 },
  { name: "Communication", count: 3 },
  { name: "Developer", count: 2 },
];

const integrations = [
  {
    name: "Google Search Console",
    description: "Import search performance data, keywords, and indexing status directly from GSC.",
    category: "Search Engines",
    logo: "GSC",
    color: "bg-blue-500",
    features: ["Keyword data sync", "Indexing status", "Click & impression data", "Search appearance"],
    popular: true,
  },
  {
    name: "Google Analytics 4",
    description: "Connect GA4 to correlate SEO performance with user behavior and conversions.",
    category: "Analytics",
    logo: "GA4",
    color: "bg-orange-500",
    features: ["Traffic attribution", "Conversion tracking", "User behavior", "Custom events"],
    popular: true,
  },
  {
    name: "Bing Webmaster Tools",
    description: "Track your Bing search performance and optimize for Microsoft's search engine.",
    category: "Search Engines",
    logo: "BWT",
    color: "bg-teal-500",
    features: ["Bing rankings", "Crawl data", "Backlink data", "SEO reports"],
    popular: false,
  },
  {
    name: "WordPress",
    description: "Seamlessly integrate with WordPress sites for real-time content optimization.",
    category: "CMS",
    logo: "WP",
    color: "bg-blue-600",
    features: ["Content sync", "Meta optimization", "Schema markup", "Sitemap management"],
    popular: true,
  },
  {
    name: "Shopify",
    description: "Optimize your Shopify store with product-level SEO insights and automation.",
    category: "E-commerce",
    logo: "SH",
    color: "bg-green-500",
    features: ["Product SEO", "Collection optimization", "Schema markup", "Redirect management"],
    popular: true,
  },
  {
    name: "Slack",
    description: "Get real-time SEO alerts and reports delivered directly to your Slack channels.",
    category: "Communication",
    logo: "SL",
    color: "bg-purple-500",
    features: ["Alert notifications", "Weekly reports", "Team mentions", "Custom triggers"],
    popular: true,
  },
  {
    name: "DataForSEO",
    description: "Power your SEO data with DataForSEO's comprehensive API for rankings and more.",
    category: "Developer",
    logo: "DFS",
    color: "bg-indigo-500",
    features: ["SERP data", "Keyword data", "Backlink data", "On-page analysis"],
    popular: false,
  },
  {
    name: "Ahrefs",
    description: "Import backlink data and domain metrics from Ahrefs for comprehensive analysis.",
    category: "Analytics",
    logo: "AH",
    color: "bg-orange-600",
    features: ["Backlink import", "Domain rating", "Referring domains", "Anchor text"],
    popular: false,
  },
  {
    name: "Semrush",
    description: "Sync keyword and competitor data from Semrush into your Optimus dashboard.",
    category: "Analytics",
    logo: "SR",
    color: "bg-orange-500",
    features: ["Keyword sync", "Competitor data", "Traffic estimates", "Position tracking"],
    popular: false,
  },
  {
    name: "WooCommerce",
    description: "Optimize your WooCommerce store with automated product SEO recommendations.",
    category: "E-commerce",
    logo: "WC",
    color: "bg-purple-600",
    features: ["Product optimization", "Category SEO", "Schema markup", "URL structure"],
    popular: false,
  },
  {
    name: "BigCommerce",
    description: "Connect BigCommerce for enterprise e-commerce SEO optimization.",
    category: "E-commerce",
    logo: "BC",
    color: "bg-blue-700",
    features: ["Product SEO", "Category pages", "Technical audit", "Schema markup"],
    popular: false,
  },
  {
    name: "Webflow",
    description: "Integrate with Webflow for design-first websites with SEO best practices.",
    category: "CMS",
    logo: "WF",
    color: "bg-blue-500",
    features: ["Content sync", "Meta management", "Sitemap", "301 redirects"],
    popular: false,
  },
  {
    name: "HubSpot",
    description: "Connect HubSpot CRM to track SEO impact on leads and revenue.",
    category: "Analytics",
    logo: "HS",
    color: "bg-orange-500",
    features: ["Lead attribution", "Revenue tracking", "Contact sync", "Campaign data"],
    popular: false,
  },
  {
    name: "Contentful",
    description: "Headless CMS integration for enterprise content optimization.",
    category: "CMS",
    logo: "CF",
    color: "bg-yellow-500",
    features: ["Content sync", "SEO fields", "Localization", "Preview mode"],
    popular: false,
  },
  {
    name: "Sanity",
    description: "Connect Sanity CMS for real-time content SEO optimization.",
    category: "CMS",
    logo: "SN",
    color: "bg-red-500",
    features: ["Content sync", "Schema builder", "Preview", "Localization"],
    popular: false,
  },
  {
    name: "Microsoft Teams",
    description: "Receive SEO alerts and collaborate on optimization tasks in Teams.",
    category: "Communication",
    logo: "MT",
    color: "bg-purple-600",
    features: ["Notifications", "Reports", "Task assignments", "Team channels"],
    popular: false,
  },
  {
    name: "Discord",
    description: "Get SEO updates and alerts in your Discord server.",
    category: "Communication",
    logo: "DC",
    color: "bg-indigo-600",
    features: ["Bot notifications", "Channel alerts", "Custom commands", "Role mentions"],
    popular: false,
  },
  {
    name: "Zapier",
    description: "Connect Optimus SEO to 5,000+ apps with Zapier automation.",
    category: "Developer",
    logo: "ZP",
    color: "bg-orange-500",
    features: ["Custom workflows", "Triggers", "Actions", "Multi-step zaps"],
    popular: true,
  },
  {
    name: "Magento",
    description: "Enterprise e-commerce SEO for Magento/Adobe Commerce stores.",
    category: "E-commerce",
    logo: "MG",
    color: "bg-orange-600",
    features: ["Product SEO", "Category optimization", "Technical audit", "Multi-store"],
    popular: false,
  },
  {
    name: "Looker Studio",
    description: "Export SEO data to Looker Studio for custom reporting dashboards.",
    category: "Analytics",
    logo: "LS",
    color: "bg-blue-500",
    features: ["Data export", "Custom dashboards", "Scheduled reports", "Data blending"],
    popular: false,
  },
];

const apiFeatures = [
  {
    icon: Code,
    title: "RESTful API",
    description: "Full REST API access to all Optimus SEO data and functionality.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Real-time event notifications for rankings, alerts, and more.",
  },
  {
    icon: Key,
    title: "OAuth 2.0",
    description: "Secure authentication with industry-standard OAuth 2.0.",
  },
  {
    icon: RefreshCw,
    title: "Rate Limiting",
    description: "Generous rate limits with burst capacity for enterprise needs.",
  },
];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory =
      selectedCategory === "All" || integration.category === selectedCategory;
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularIntegrations = integrations.filter((i) => i.popular);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="neutral" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Integrations
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Connect Your{" "}
              <span className="text-accent">Entire Stack</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8">
              Optimus SEO integrates with the tools you already use. Pull in data,
              push out insights, and automate your workflow.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <Input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Integrations */}
      <section className="py-12 border-y border-border bg-bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">
            Popular Integrations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {popularIntegrations.map((integration, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-bg-elevated hover:bg-bg-page transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold mb-2",
                    integration.color
                  )}
                >
                  {integration.logo}
                </div>
                <span className="text-sm font-medium text-text-primary text-center">
                  {integration.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Integrations */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      selectedCategory === category.name
                        ? "bg-accent text-white"
                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                    )}
                  >
                    <span>{category.name}</span>
                    <span
                      className={cn(
                        "text-xs",
                        selectedCategory === category.name
                          ? "text-white/80"
                          : "text-text-muted"
                      )}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  {selectedCategory === "All"
                    ? "All Integrations"
                    : selectedCategory}
                </h2>
                <span className="text-sm text-text-muted">
                  {filteredIntegrations.length} integrations
                </span>
              </div>

              {filteredIntegrations.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIntegrations.map((integration, index) => (
                    <Card
                      key={index}
                      className="bg-bg-card border-border hover:border-accent/50 transition-colors group"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0",
                              integration.color
                            )}
                          >
                            {integration.logo}
                          </div>
                          <div>
                            <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                              {integration.name}
                            </h3>
                            <Badge variant="neutral" className="mt-1">
                              {integration.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          {integration.description}
                        </p>
                        <div className="space-y-2">
                          {integration.features.slice(0, 3).map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs text-text-muted"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No integrations found
                  </h3>
                  <p className="text-text-secondary">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-16 sm:py-20 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="neutral" className="mb-4">
                <Code className="h-3 w-3 mr-1" />
                Developer API
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                Build Custom Integrations
              </h2>
              <p className="text-text-secondary mb-6">
                Need something custom? Our comprehensive API gives you full access
                to all Optimus SEO data and functionality. Build your own integrations,
                automate workflows, and extend the platform.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {apiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-text-muted">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="accent" asChild>
                  <Link href="/docs/api">
                    View API Docs
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
                <code>{`// Get project rankings
const response = await fetch(
  'https://api.optimusseo.ai/v1/projects/123/rankings',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const rankings = await response.json();
console.log(rankings);

// Output:
// {
//   "keywords": 1250,
//   "top3": 89,
//   "top10": 342,
//   "top100": 891
// }`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Request Integration */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
            Don't See Your Tool?
          </h2>
          <p className="text-text-secondary mb-8">
            We're always adding new integrations. Let us know what you need and
            we'll prioritize it on our roadmap.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/contact">
              Request Integration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-accent to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Connect Your Stack?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Start your free trial and integrate with your favorite tools in minutes.
          </p>
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
        </div>
      </section>
    </div>
  );
}
