"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Zap,
  Users,
  Globe,
  Coffee,
  Laptop,
  Plane,
  GraduationCap,
  ArrowRight,
  Building2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Top-of-market compensation with equity options for all employees.",
  },
  {
    icon: Laptop,
    title: "Remote-First",
    description: "Work from anywhere in the world. We're fully distributed across 15+ countries.",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision coverage for you and your family.",
  },
  {
    icon: Plane,
    title: "Unlimited PTO",
    description: "Take the time you need. We trust you to manage your own schedule.",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "$2,000/year for courses, conferences, and professional development.",
  },
  {
    icon: Coffee,
    title: "Home Office Setup",
    description: "$1,500 stipend to create your perfect workspace at home.",
  },
];

const departments = [
  { name: "Engineering", count: 5, icon: Zap },
  { name: "Product", count: 2, icon: Sparkles },
  { name: "Design", count: 1, icon: Heart },
  { name: "Marketing", count: 2, icon: Globe },
  { name: "Sales", count: 3, icon: Briefcase },
  { name: "Customer Success", count: 2, icon: Users },
];

const openings = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$150k - $200k",
    description: "Build the core platform that powers AI-driven SEO automation for thousands of agencies.",
    requirements: [
      "5+ years of experience with React, TypeScript, and Node.js",
      "Experience with PostgreSQL and modern ORMs",
      "Strong understanding of API design and microservices",
      "Bonus: Experience with AI/ML systems",
    ],
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$160k - $220k",
    description: "Design and implement AI agents that autonomously optimize SEO strategies.",
    requirements: [
      "3+ years of experience with Python and ML frameworks",
      "Experience with LLMs (GPT, Claude, etc.)",
      "Strong understanding of NLP and text analysis",
      "Published research or open-source contributions a plus",
    ],
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "Shape the user experience of our AI-powered SEO platform.",
    requirements: [
      "4+ years of product design experience",
      "Strong portfolio showing complex B2B SaaS work",
      "Proficiency in Figma and design systems",
      "Experience with data visualization a plus",
    ],
  },
  {
    id: 4,
    title: "Senior Product Manager",
    department: "Product",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$140k - $180k",
    description: "Drive the product roadmap and work closely with engineering to ship features that customers love.",
    requirements: [
      "5+ years of product management experience",
      "Experience with B2B SaaS products",
      "Strong analytical and communication skills",
      "SEO or marketing tech experience a plus",
    ],
  },
  {
    id: 5,
    title: "Account Executive",
    department: "Sales",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$80k - $120k + Commission",
    description: "Help SEO agencies discover how Optimus can transform their operations.",
    requirements: [
      "3+ years of B2B SaaS sales experience",
      "Track record of exceeding quota",
      "Experience selling to agencies or marketing teams",
      "Strong demo and presentation skills",
    ],
  },
  {
    id: 6,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$90k - $130k",
    description: "Ensure our customers achieve their SEO goals and become advocates for Optimus.",
    requirements: [
      "3+ years of customer success experience",
      "Experience with SEO or marketing technology",
      "Strong relationship-building skills",
      "Data-driven approach to customer health",
    ],
  },
  {
    id: 7,
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$100k - $140k",
    description: "Create compelling content that educates the market about AI-powered SEO.",
    requirements: [
      "4+ years of content marketing experience",
      "Strong SEO knowledge and writing skills",
      "Experience with B2B SaaS content strategy",
      "Ability to translate technical concepts for broad audiences",
    ],
  },
];

const values = [
  {
    title: "Move Fast, Stay Focused",
    description: "We ship quickly but thoughtfully. Speed matters, but so does quality.",
  },
  {
    title: "Customer Obsession",
    description: "Every decision starts with 'How does this help our customers?'",
  },
  {
    title: "Radical Transparency",
    description: "We share context openly. Everyone has the information they need to make great decisions.",
  },
  {
    title: "Own Your Impact",
    description: "We hire people who take ownership. You'll have real responsibility from day one.",
  },
];

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = React.useState<string | null>(null);

  const filteredOpenings = selectedDepartment
    ? openings.filter((job) => job.department === selectedDepartment)
    : openings;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="neutral" className="mb-4">
              We're Hiring
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Join the Future of{" "}
              <span className="text-accent">AI-Powered SEO</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8">
              We're building the platform that will transform how SEO agencies work.
              Join our remote-first team and help shape the future of search.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="accent" size="lg" asChild>
                <a href="#openings">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/about">Learn About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">35+</div>
              <div className="text-sm text-text-secondary">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">15+</div>
              <div className="text-sm text-text-secondary">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-text-secondary">Remote</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">$5M</div>
              <div className="text-sm text-text-secondary">Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Our Values
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              These principles guide everything we do — from how we build products to how we work together.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-bg-card border-border">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-accent">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Benefits & Perks
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We take care of our team so they can focus on doing their best work.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-bg-card border-border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Open Positions
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Find your next role and help us build the future of SEO.
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedDepartment === null ? "accent" : "secondary"}
              size="sm"
              onClick={() => setSelectedDepartment(null)}
            >
              All ({openings.length})
            </Button>
            {departments.map((dept) => (
              <Button
                key={dept.name}
                variant={selectedDepartment === dept.name ? "accent" : "secondary"}
                size="sm"
                onClick={() => setSelectedDepartment(dept.name)}
              >
                {dept.name} ({dept.count})
              </Button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredOpenings.map((job) => (
              <Card key={job.id} className="bg-bg-card border-border hover:border-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {job.title}
                        </h3>
                        <Badge variant="neutral">{job.department}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="accent" asChild>
                        <Link href={`/careers/${job.id}`}>
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOpenings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">
                No open positions in this department right now. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Don't See Your Role */}
      <section className="py-16 sm:py-20 bg-bg-elevated">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
            Don't See Your Role?
          </h2>
          <p className="text-text-secondary mb-8">
            We're always looking for talented people. If you think you'd be a great fit
            for Optimus SEO, we'd love to hear from you.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/contact">
              Send Us Your Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Life at Optimus */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Life at Optimus
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We're a remote-first company that values flexibility, autonomy, and results.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
              <span className="text-text-muted">Team Retreat 2025</span>
            </div>
            <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <span className="text-text-muted">Virtual Coffee Chats</span>
            </div>
            <div className="aspect-video rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <span className="text-text-muted">Hackathon Winners</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-accent to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Help us build the future of AI-powered SEO. We can't wait to meet you.
          </p>
          <Button
            size="lg"
            className="bg-white text-accent hover:bg-white/90"
            asChild
          >
            <a href="#openings">
              View Open Positions
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
