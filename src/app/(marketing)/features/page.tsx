"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Target,
  Search,
  PenTool,
  Link2,
  BarChart3,
  Eye,
  Zap,
  Shield,
  Globe,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mainFeatures = [
  {
    id: "ai-agents",
    icon: Bot,
    title: "AI-Powered Agents",
    description:
      "8 specialized AI agents work around the clock on your SEO tasks. From site audits to content creation to link building — they handle it all.",
    benefits: [
      "24/7 automated SEO execution",
      "Human-quality output with AI speed",
      "Configurable approval workflows",
      "Real-time progress tracking",
    ],
    image: "/features/ai-agents.png",
  },
  {
    id: "keyword-research",
    icon: Target,
    title: "Predictive Keyword Intelligence",
    description:
      "Go beyond basic keyword research. Our AI predicts trending keywords, identifies gaps, and clusters opportunities by intent and topic.",
    benefits: [
      "AI-powered keyword predictions",
      "Semantic clustering",
      "Intent classification",
      "Competitor gap analysis",
    ],
    image: "/features/keywords.png",
  },
  {
    id: "site-audit",
    icon: Search,
    title: "Autonomous Technical SEO",
    description:
      "Comprehensive site audits that don't just find issues — they fix them. Core Web Vitals, schema markup, mobile optimization, and more.",
    benefits: [
      "60+ technical SEO checks",
      "Automated fix suggestions",
      "Core Web Vitals monitoring",
      "Schema markup validation",
    ],
    image: "/features/audit.png",
  },
  {
    id: "content",
    icon: PenTool,
    title: "Content Intelligence Engine",
    description:
      "Generate SEO-optimized content briefs and full articles that rank. Our AI understands your brand voice and target audience.",
    benefits: [
      "AI content brief generation",
      "Full article writing",
      "Brand voice matching",
      "SEO optimization built-in",
    ],
    image: "/features/content.png",
  },
  {
    id: "link-building",
    icon: Link2,
    title: "Automated Link Building",
    description:
      "Discover high-quality backlink opportunities and automate outreach. Build authority while you sleep.",
    benefits: [
      "Opportunity discovery",
      "Automated outreach",
      "Quality scoring",
      "Progress tracking",
    ],
    image: "/features/links.png",
  },
  {
    id: "ai-visibility",
    icon: Eye,
    title: "AI Search Visibility",
    description:
      "Track how your brand appears in ChatGPT, Claude, Gemini, and Perplexity. The only SEO tool with AI search tracking.",
    benefits: [
      "ChatGPT mention tracking",
      "Claude visibility monitoring",
      "Gemini presence analysis",
      "Perplexity ranking",
    ],
    badge: "Exclusive",
    image: "/features/ai-visibility.png",
  },
];

const additionalFeatures = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track rankings, traffic, and ROI with beautiful dashboards.",
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description: "Monitor competitor strategies and find opportunities.",
  },
  {
    icon: Globe,
    title: "Multi-Search Tracking",
    description: "Rankings across Google, Bing, Yahoo, and more.",
  },
  {
    icon: FileText,
    title: "Automated Reports",
    description: "White-label reports generated automatically.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant with SSO and role-based access.",
  },
  {
    icon: Zap,
    title: "API Access",
    description: "Full API for custom integrations and workflows.",
  },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6">
              Everything you need to dominate SEO
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8">
              Our AI agents handle the entire SEO workflow — from research to
              execution to reporting. You focus on strategy, we handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/signup">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-24 md:space-y-32">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    {feature.badge && (
                      <Badge variant="accent">{feature.badge}</Badge>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-base sm:text-lg text-text-secondary mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-text-primary">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/product/${feature.id}`}>
                    <Button variant="secondary">
                      Learn more
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="aspect-video rounded-xl bg-bg-elevated border border-border overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-8">
                        <feature.icon className="h-16 w-16 text-accent/30 mx-auto mb-4" />
                        <p className="text-text-muted">Feature Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-12 sm:py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
              And so much more
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
              Every feature you need to run a world-class SEO operation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {additionalFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Why Optimus SEO?
            </h2>
            <p className="text-base sm:text-lg text-text-secondary">
              See how we compare to traditional SEO tools.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-text-primary font-semibold">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 text-accent font-semibold">
                    Optimus SEO
                  </th>
                  <th className="text-center py-4 px-4 text-text-muted font-semibold">
                    Traditional Tools
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI-powered execution", true, false],
                  ["Automated content creation", true, false],
                  ["Link building automation", true, false],
                  ["AI search visibility", true, false],
                  ["Keyword research", true, true],
                  ["Site audits", true, true],
                  ["Rank tracking", true, true],
                  ["Competitor analysis", true, true],
                  ["White-label reports", true, "Limited"],
                  ["API access", true, "Paid add-on"],
                ].map(([feature, optimus, traditional]) => (
                  <tr key={feature as string} className="border-b border-border">
                    <td className="py-4 px-4 text-text-primary text-sm sm:text-base">{feature}</td>
                    <td className="py-4 px-4 text-center">
                      {optimus === true ? (
                        <CheckCircle className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <span className="text-text-secondary text-sm">{optimus}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {traditional === true ? (
                        <CheckCircle className="h-5 w-5 text-success mx-auto" />
                      ) : traditional === false ? (
                        <span className="text-text-muted">—</span>
                      ) : (
                        <span className="text-text-secondary text-sm">{traditional}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Ready to automate your SEO?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8">
            Join 500+ agencies already using Optimus SEO to scale their
            operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/signup">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
