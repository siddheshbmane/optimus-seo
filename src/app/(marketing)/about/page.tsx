"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Users,
  Zap,
  Heart,
  Globe,
  Award,
  ArrowRight,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "We measure success by the results we deliver. Every feature we build is designed to move the needle for your SEO.",
  },
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We're constantly pushing the boundaries of what's possible with AI in SEO. If there's a better way, we'll find it.",
  },
  {
    icon: Users,
    title: "Customer Obsessed",
    description:
      "Our customers are our partners. We listen, learn, and build what you actually need — not what we think you need.",
  },
  {
    icon: Heart,
    title: "Transparency",
    description:
      "No black boxes. We show you exactly what our AI agents are doing and why. You're always in control.",
  },
];

const team = [
  {
    name: "Siddhesh Mane",
    role: "Founder & CEO",
    bio: "Former SEO agency owner who got tired of manual work. Built Optimus to automate what he wished existed.",
    avatar: "SM",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Priya Sharma",
    role: "Head of AI",
    bio: "PhD in Machine Learning from IIT. Previously led AI research at a Fortune 500 company.",
    avatar: "PS",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Alex Chen",
    role: "Head of Product",
    bio: "10+ years in product at leading SaaS companies. Obsessed with user experience.",
    avatar: "AC",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Maria Rodriguez",
    role: "Head of Customer Success",
    bio: "Former agency director. Knows the SEO industry inside out and ensures our customers win.",
    avatar: "MR",
    linkedin: "#",
    twitter: "#",
  },
];

const milestones = [
  { year: "2024", event: "Founded with a vision to automate SEO" },
  { year: "2024", event: "Launched beta with 50 early adopters" },
  { year: "2025", event: "Reached 500+ agencies on the platform" },
  { year: "2025", event: "Raised seed funding to accelerate growth" },
  { year: "2026", event: "Launched AI visibility tracking (industry first)" },
  { year: "2026", event: "Expanded to 2,000+ customers globally" },
];

const stats = [
  { value: "2,000+", label: "Customers" },
  { value: "50M+", label: "Keywords Tracked" },
  { value: "15", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              About Us
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
              We&apos;re building the future of SEO
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Optimus SEO was born from a simple frustration: SEO is too manual,
              too slow, and too expensive. We&apos;re changing that with AI agents
              that do the work for you.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  In 2024, our founder Siddhesh was running a successful SEO
                  agency. But he noticed something frustrating: 80% of his
                  team&apos;s time was spent on repetitive tasks — keyword research,
                  content briefs, backlink prospecting, reporting.
                </p>
                <p>
                  The tools available were great at showing data, but terrible
                  at actually doing the work. Ahrefs tells you what keywords to
                  target, but you still have to write the content. SEMrush shows
                  you competitor backlinks, but you still have to do the
                  outreach.
                </p>
                <p>
                  So Siddhesh asked: what if we could build AI agents that
                  actually DO the SEO work? Not just analyze — execute. Not just
                  recommend — implement.
                </p>
                <p className="font-medium text-text-primary">
                  That&apos;s how Optimus SEO was born.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl bg-bg-card border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-10 w-10 text-accent" />
                    </div>
                    <p className="text-text-primary font-semibold">
                      AI-Powered SEO
                    </p>
                    <p className="text-text-muted text-sm">Since 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl text-text-secondary">
            To democratize SEO by making enterprise-grade optimization
            accessible to every business. We believe great SEO shouldn&apos;t
            require a team of 10 — it should require a team of AI agents
            working for you 24/7.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Our Values
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              These principles guide everything we do, from product decisions to
              customer interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Meet the Team
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We&apos;re a small but mighty team of SEO experts, AI researchers, and
              product builders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {member.name}
                  </h3>
                  <p className="text-accent text-sm mb-3">{member.role}</p>
                  <p className="text-text-secondary text-sm mb-4">
                    {member.bio}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={member.linkedin}
                      className="text-text-muted hover:text-accent transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.twitter}
                      className="text-text-muted hover:text-accent transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Our Journey
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 md:left-1/2 h-3 w-3 rounded-full bg-accent -translate-x-1/2 md:-translate-x-1/2" />
                  <div className="ml-10 md:ml-0 md:w-1/2">
                    <Card>
                      <CardContent className="p-4">
                        <Badge variant="neutral" className="mb-2">
                          {milestone.year}
                        </Badge>
                        <p className="text-text-primary">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Recognition
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              "G2 High Performer 2026",
              "Product Hunt #1 Product",
              "TechCrunch Disrupt Finalist",
              "Forbes 30 Under 30",
            ].map((award) => (
              <div
                key={award}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-border"
              >
                <Award className="h-5 w-5 text-warning" />
                <span className="text-text-primary font-medium">{award}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Join us on our mission
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Whether you&apos;re looking to use Optimus SEO or join our team, we&apos;d
            love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="accent" size="lg">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/careers">
              <Button variant="secondary" size="lg">
                View Open Positions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
