"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  Play,
  Bot,
  Target,
  PenTool,
  Link2,
  BarChart3,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Agents",
    description:
      "8 specialized AI agents work 24/7 on your SEO tasks - from audits to content creation to link building.",
  },
  {
    icon: Target,
    title: "Smart Keyword Research",
    description:
      "Discover high-value keywords with AI-powered analysis of search intent, competition, and opportunity.",
  },
  {
    icon: PenTool,
    title: "Automated Content",
    description:
      "Generate SEO-optimized content briefs and full articles that rank, with your brand voice.",
  },
  {
    icon: Link2,
    title: "Link Building",
    description:
      "Automated outreach campaigns that build high-quality backlinks while you sleep.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track rankings, traffic, and ROI with beautiful dashboards and automated reports.",
  },
  {
    icon: Zap,
    title: "Technical SEO",
    description:
      "Automatic detection and fixing of technical issues that hurt your rankings.",
  },
];

const stats = [
  { value: "10,000+", label: "Keywords Tracked" },
  { value: "500+", label: "Agencies Trust Us" },
  { value: "2M+", label: "Pages Optimized" },
  { value: "98%", label: "Customer Satisfaction" },
];

const testimonials = [
  {
    quote:
      "Optimus SEO has transformed how we deliver SEO services. What used to take our team days now happens automatically.",
    author: "Sarah Chen",
    role: "CEO, Digital Growth Agency",
    avatar: "SC",
  },
  {
    quote:
      "The AI agents are incredible. They found keyword opportunities we never would have discovered manually.",
    author: "Michael Torres",
    role: "SEO Director, TechStart Inc",
    avatar: "MT",
  },
  {
    quote:
      "We've increased our client capacity by 3x without hiring. The ROI is unbelievable.",
    author: "Emily Watson",
    role: "Founder, RankBoost",
    avatar: "EW",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for freelancers and small agencies",
    features: [
      "3 projects",
      "5,000 keywords",
      "Basic AI agents",
      "Weekly reports",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "For growing agencies and in-house teams",
    features: [
      "15 projects",
      "25,000 keywords",
      "All AI agents",
      "Daily reports",
      "Priority support",
      "White-label reports",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large agencies and enterprises",
    features: [
      "Unlimited projects",
      "Unlimited keywords",
      "Custom AI training",
      "Real-time reports",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              Your AI SEO team,
              <br />
              <span className="text-accent">on autopilot</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Automate your entire SEO workflow with AI agents that research,
              write, build links, and report — while you focus on growing your
              business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button variant="accent" size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="text-lg px-8">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-text-muted mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border bg-bg-card shadow-2xl overflow-hidden">
              <div className="h-8 bg-bg-elevated border-b border-border flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-error/50" />
                <div className="h-3 w-3 rounded-full bg-warning/50" />
                <div className="h-3 w-3 rounded-full bg-success/50" />
              </div>
              <div className="p-4 bg-bg-page">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {[
                    { label: "Active Projects", value: "12" },
                    { label: "Keywords Tracked", value: "4,860" },
                    { label: "Backlinks Built", value: "234" },
                    { label: "Agents Running", value: "6" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-lg bg-bg-card border border-border"
                    >
                      <p className="text-sm text-text-muted">{stat.label}</p>
                      <p className="text-2xl font-bold text-text-primary font-mono">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 p-4 rounded-lg bg-bg-card border border-border h-48">
                    <p className="text-sm font-medium text-text-primary mb-2">
                      Organic Traffic
                    </p>
                    <div className="h-32 flex items-end gap-1">
                      {[40, 55, 45, 60, 75, 65, 80, 90, 85, 95, 100, 110].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-accent/20 rounded-t"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-card border border-border">
                    <p className="text-sm font-medium text-text-primary mb-2">
                      Agent Activity
                    </p>
                    <div className="space-y-2">
                      {[
                        { name: "Content Writer", status: "running" },
                        { name: "Link Builder", status: "running" },
                        { name: "Site Auditor", status: "completed" },
                      ].map((agent) => (
                        <div
                          key={agent.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-text-secondary">
                            {agent.name}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-1",
                              agent.status === "running"
                                ? "text-success"
                                : "text-text-muted"
                            )}
                          >
                            {agent.status === "running" && (
                              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            )}
                            {agent.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-accent font-mono">
                  {stat.value}
                </p>
                <p className="text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="neutral" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything you need to dominate SEO
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our AI agents handle the entire SEO workflow, from research to
              execution to reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:border-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="neutral" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              SEO on autopilot in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Your Site",
                description:
                  "Add your website and connect Google Search Console. Our AI immediately starts analyzing.",
                icon: Shield,
              },
              {
                step: "2",
                title: "AI Agents Get to Work",
                description:
                  "Our agents audit your site, research keywords, create content, and build links automatically.",
                icon: Bot,
              },
              {
                step: "3",
                title: "Watch Rankings Climb",
                description:
                  "Track your progress with real-time dashboards and automated reports for your clients.",
                icon: TrendingUp,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="neutral" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Loved by SEO professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-text-primary mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-semibold text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-text-muted">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 md:py-32 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="neutral" className="mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-text-secondary">
              Start free, upgrade when you&apos;re ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative",
                  plan.popular && "border-accent ring-2 ring-accent"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-text-muted">{plan.period}</span>
                  </div>
                  <p className="text-text-secondary mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "accent" : "secondary"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Ready to automate your SEO?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Join 500+ agencies already using Optimus SEO to scale their
            operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="accent" size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
