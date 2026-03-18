"use client";

import * as React from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Globe,
  Award,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const stats = [
  { value: "2,000+", label: "Agencies & Brands" },
  { value: "50M+", label: "Keywords Tracked" },
  { value: "15", label: "Countries" },
  { value: "4.9/5", label: "Customer Rating" },
];

const logos = [
  "TechCorp", "GrowthLabs", "Digital First", "SEO Masters",
  "Rank Higher", "Search Pro", "Web Wizards", "Click Boost",
  "Traffic Kings", "Organic Growth", "Link Builders", "Content Co",
];

const caseStudies = [
  {
    id: "digital-growth-partners",
    company: "Digital Growth Partners",
    logo: "DGP",
    industry: "SEO Agency",
    location: "New York, USA",
    challenge: "Managing 150+ clients with a team of 8 was becoming unsustainable. Manual reporting took 40+ hours per week.",
    solution: "Implemented Optimus SEO's AI agents for automated audits, reporting, and competitor monitoring.",
    results: [
      { metric: "10x", label: "Client capacity increase" },
      { metric: "85%", label: "Time saved on reporting" },
      { metric: "40%", label: "Revenue growth" },
    ],
    quote: "Optimus SEO transformed our agency. We went from drowning in manual work to scaling effortlessly. The AI agents handle what used to take our team days.",
    author: "Sarah Chen",
    role: "Founder & CEO",
    featured: true,
  },
  {
    id: "ecommerce-giant",
    company: "ShopMax",
    logo: "SM",
    industry: "E-commerce",
    location: "London, UK",
    challenge: "With 50,000+ product pages, keeping track of technical SEO issues was impossible.",
    solution: "Used Optimus SEO's autonomous technical audit agent to continuously monitor and prioritize fixes.",
    results: [
      { metric: "156%", label: "Organic traffic increase" },
      { metric: "2,400", label: "Issues auto-detected" },
      { metric: "32%", label: "Conversion rate lift" },
    ],
    quote: "The technical SEO agent found issues we didn't even know existed. Our organic traffic has more than doubled.",
    author: "James Wilson",
    role: "Head of Digital",
    featured: true,
  },
  {
    id: "saas-startup",
    company: "CloudFlow",
    logo: "CF",
    industry: "SaaS",
    location: "San Francisco, USA",
    challenge: "As a startup, we couldn't afford a full SEO team but needed to compete with established players.",
    solution: "Optimus SEO's AI visibility tracking helped us optimize for both traditional search and AI assistants.",
    results: [
      { metric: "3x", label: "AI visibility score" },
      { metric: "89%", label: "More qualified leads" },
      { metric: "$0", label: "Additional headcount" },
    ],
    quote: "We're a 10-person startup competing with companies 100x our size in search. Optimus levels the playing field.",
    author: "Maria Santos",
    role: "VP Marketing",
    featured: false,
  },
  {
    id: "local-agency",
    company: "LocalSEO Pro",
    logo: "LSP",
    industry: "Local SEO Agency",
    location: "Chicago, USA",
    challenge: "Managing Google Business Profiles for 200+ local businesses was a full-time job.",
    solution: "Automated GMB monitoring and optimization with Optimus SEO's local SEO tools.",
    results: [
      { metric: "45%", label: "More map pack rankings" },
      { metric: "60%", label: "Time saved on GMB" },
      { metric: "28", label: "New clients added" },
    ],
    quote: "The GMB automation alone paid for the entire platform. Our local clients are seeing real results.",
    author: "Mike Johnson",
    role: "Owner",
    featured: false,
  },
];

const testimonials = [
  {
    quote: "Finally, an SEO tool that actually uses AI meaningfully. The predictive keyword insights have been game-changing for our content strategy.",
    author: "Emily Rodriguez",
    role: "Content Director",
    company: "MediaHub",
  },
  {
    quote: "We've tried every SEO tool out there. Optimus is the first one that feels like it was built for agencies, not just in-house teams.",
    author: "David Park",
    role: "Agency Owner",
    company: "Rank & File SEO",
  },
  {
    quote: "The AI visibility tracking is something no other tool offers. We're now optimizing for ChatGPT and Claude, not just Google.",
    author: "Lisa Thompson",
    role: "SEO Manager",
    company: "TechStart Inc",
  },
  {
    quote: "Our client retention went from 70% to 95% after switching to Optimus. The automated reporting alone is worth the price.",
    author: "Chris Anderson",
    role: "Partner",
    company: "Growth Digital",
  },
  {
    quote: "I was skeptical about AI in SEO, but Optimus proved me wrong. The agents actually understand context and make smart recommendations.",
    author: "Jennifer Lee",
    role: "SEO Consultant",
    company: "Independent",
  },
  {
    quote: "Setup took 10 minutes. Within a week, we had insights that would have taken months to gather manually.",
    author: "Robert Kim",
    role: "Marketing Director",
    company: "FinanceFlow",
  },
];

const industries = [
  { name: "SEO Agencies", count: 850, icon: Building2 },
  { name: "E-commerce", count: 420, icon: Globe },
  { name: "SaaS", count: 380, icon: TrendingUp },
  { name: "Local Business", count: 250, icon: Users },
  { name: "Enterprise", count: 100, icon: Award },
];

export default function CustomersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="neutral" className="mb-4">
              <Users className="h-3 w-3 mr-1" />
              Customer Stories
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Trusted by{" "}
              <span className="text-accent">2,000+ SEO Teams</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8">
              See how agencies and brands are using Optimus SEO to automate their
              operations and deliver better results for their clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="accent" size="lg" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-text-muted mb-8">
            TRUSTED BY LEADING AGENCIES AND BRANDS
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-12 text-text-muted font-medium"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16 sm:py-20 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Featured Case Studies
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Deep dives into how our customers achieved remarkable results with Optimus SEO.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies
              .filter((cs) => cs.featured)
              .map((study, index) => (
                <Card key={index} className="bg-bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center text-xl font-bold text-accent">
                          {study.logo}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-text-primary">
                            {study.company}
                          </h3>
                          <p className="text-sm text-text-muted">
                            {study.industry} • {study.location}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-1">
                            Challenge
                          </h4>
                          <p className="text-sm text-text-secondary">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-1">
                            Solution
                          </h4>
                          <p className="text-sm text-text-secondary">{study.solution}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {study.results.map((result, i) => (
                          <div key={i} className="text-center p-3 bg-bg-elevated rounded-lg">
                            <div className="text-xl font-bold text-accent">{result.metric}</div>
                            <div className="text-xs text-text-muted">{result.label}</div>
                          </div>
                        ))}
                      </div>

                      <blockquote className="border-l-2 border-accent pl-4 mb-4">
                        <p className="text-sm text-text-secondary italic">"{study.quote}"</p>
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-bg-elevated flex items-center justify-center text-sm font-medium text-text-primary">
                          {study.author.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{study.author}</p>
                          <p className="text-xs text-text-muted">{study.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* More Case Studies */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {caseStudies
              .filter((cs) => !cs.featured)
              .map((study, index) => (
                <Card key={index} className="bg-bg-card border-border hover:border-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                        {study.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{study.company}</h3>
                        <p className="text-xs text-text-muted">{study.industry}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                      {study.results.slice(0, 2).map((result, i) => (
                        <div key={i}>
                          <div className="text-lg font-bold text-accent">{result.metric}</div>
                          <div className="text-xs text-text-muted">{result.label}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">"{study.quote}"</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Don't just take our word for it — hear from the teams using Optimus every day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-bg-elevated flex items-center justify-center text-sm font-medium text-text-primary">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-text-muted">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 sm:py-20 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Customers Across Industries
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From solo consultants to enterprise teams, Optimus SEO works for everyone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {industries.map((industry, index) => (
              <Card key={index} className="bg-bg-card border-border text-center">
                <CardContent className="p-6">
                  <industry.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-text-primary mb-1">{industry.name}</h3>
                  <p className="text-sm text-text-muted">{industry.count}+ customers</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-accent to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Join 2,000+ SEO Teams
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Start your free trial today and see why teams are switching to Optimus SEO.
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
