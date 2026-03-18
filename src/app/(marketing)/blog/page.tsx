"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  TrendingUp,
  Sparkles,
  BookOpen,
  Lightbulb,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = [
  { name: "All", count: 24 },
  { name: "AI & SEO", count: 8 },
  { name: "Technical SEO", count: 6 },
  { name: "Content Strategy", count: 5 },
  { name: "Case Studies", count: 3 },
  { name: "Product Updates", count: 2 },
];

const featuredPost = {
  id: "ai-visibility-future-seo",
  title: "AI Visibility: The New Frontier of SEO in 2026",
  excerpt:
    "As AI assistants like ChatGPT and Claude become primary information sources, traditional SEO metrics are no longer enough. Learn how to track and optimize your brand's visibility in AI responses.",
  author: "Siddhesh Mane",
  authorRole: "Founder & CEO",
  date: "March 15, 2026",
  readTime: "12 min read",
  category: "AI & SEO",
  image: null,
};

const posts = [
  {
    id: "technical-seo-audit-guide",
    title: "The Complete Technical SEO Audit Guide for 2026",
    excerpt:
      "A comprehensive walkthrough of every technical SEO element you need to check, from Core Web Vitals to schema markup.",
    author: "Alex Chen",
    date: "March 12, 2026",
    readTime: "15 min read",
    category: "Technical SEO",
  },
  {
    id: "ai-agents-seo-automation",
    title: "How AI Agents Are Revolutionizing SEO Automation",
    excerpt:
      "Discover how autonomous AI agents can handle repetitive SEO tasks, freeing your team to focus on strategy.",
    author: "Priya Sharma",
    date: "March 10, 2026",
    readTime: "8 min read",
    category: "AI & SEO",
  },
  {
    id: "content-clusters-strategy",
    title: "Building Topic Clusters That Actually Rank",
    excerpt:
      "Learn the science behind topic clusters and how to structure your content for maximum topical authority.",
    author: "Maria Rodriguez",
    date: "March 8, 2026",
    readTime: "10 min read",
    category: "Content Strategy",
  },
  {
    id: "case-study-agency-growth",
    title: "Case Study: How One Agency 10x'd Their Client Capacity",
    excerpt:
      "See how Digital Growth Partners scaled from 15 to 150 clients using AI-powered SEO automation.",
    author: "Siddhesh Mane",
    date: "March 5, 2026",
    readTime: "7 min read",
    category: "Case Studies",
  },
  {
    id: "core-web-vitals-2026",
    title: "Core Web Vitals in 2026: What's Changed and What Matters",
    excerpt:
      "Google's latest updates to Core Web Vitals and how to optimize for the new metrics.",
    author: "Alex Chen",
    date: "March 3, 2026",
    readTime: "9 min read",
    category: "Technical SEO",
  },
  {
    id: "llm-optimization-guide",
    title: "Optimizing Your Content for LLM Citations",
    excerpt:
      "Practical strategies to increase the chances of your content being cited by AI assistants.",
    author: "Priya Sharma",
    date: "March 1, 2026",
    readTime: "11 min read",
    category: "AI & SEO",
  },
  {
    id: "keyword-research-ai-era",
    title: "Keyword Research in the AI Era: A New Approach",
    excerpt:
      "Traditional keyword research is evolving. Learn how to adapt your strategy for AI-first search.",
    author: "Maria Rodriguez",
    date: "February 28, 2026",
    readTime: "8 min read",
    category: "Content Strategy",
  },
  {
    id: "multi-search-optimization",
    title: "Beyond Google: Optimizing for Bing, DuckDuckGo, and AI Search",
    excerpt:
      "A guide to multi-search engine optimization as search becomes more fragmented.",
    author: "Alex Chen",
    date: "February 25, 2026",
    readTime: "10 min read",
    category: "Technical SEO",
  },
  {
    id: "product-update-march-2026",
    title: "Product Update: AI Visibility Dashboard & More",
    excerpt:
      "Announcing our biggest update yet — track your brand's visibility across ChatGPT, Claude, and Perplexity.",
    author: "Optimus Team",
    date: "February 22, 2026",
    readTime: "5 min read",
    category: "Product Updates",
  },
];

const popularTags = [
  "AI SEO",
  "Technical SEO",
  "Content Strategy",
  "Core Web Vitals",
  "LLM Optimization",
  "Automation",
  "Case Studies",
  "Keyword Research",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="neutral" className="mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              Optimus Blog
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Insights on{" "}
              <span className="text-accent">AI-Powered SEO</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8">
              Expert guides, industry insights, and product updates to help you
              stay ahead in the evolving world of search.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-accent/10 to-purple-500/10 border-accent/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-accent/50" />
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <Badge variant="accent" className="w-fit mb-4">
                    Featured
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-text-secondary mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Button variant="accent" className="w-fit" asChild>
                    <Link href={`/blog/${featuredPost.id}`}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              {/* Categories */}
              <div className="mb-8">
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
              </div>

              {/* Popular Tags */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="neutral"
                      className="cursor-pointer hover:bg-accent hover:text-white transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <Card className="bg-bg-card border-border">
                <CardContent className="p-6">
                  <Lightbulb className="h-8 w-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Get the latest SEO insights delivered to your inbox weekly.
                  </p>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="mb-3"
                  />
                  <Button variant="accent" className="w-full">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Posts Grid */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  {selectedCategory === "All"
                    ? "All Articles"
                    : selectedCategory}
                </h2>
                <span className="text-sm text-text-muted">
                  {filteredPosts.length} articles
                </span>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-bg-card border-border hover:border-accent/50 transition-colors group"
                    >
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gradient-to-br from-bg-elevated to-bg-page flex items-center justify-center">
                          <Target className="h-8 w-8 text-text-muted/50 group-hover:text-accent/50 transition-colors" />
                        </div>
                        <div className="p-5">
                          <Badge variant="neutral" className="mb-3">
                            {post.category}
                          </Badge>
                          <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            <Link href={`/blog/${post.id}`}>{post.title}</Link>
                          </h3>
                          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-text-muted">
                            <span>{post.author}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No articles found
                  </h3>
                  <p className="text-text-secondary">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}

              {/* Load More */}
              {filteredPosts.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="secondary">
                    Load More Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-12 sm:py-16 bg-bg-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-text-primary">
              Trending Topics
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "AI Visibility Tracking", posts: 8 },
              { title: "LLM Optimization", posts: 6 },
              { title: "Core Web Vitals 2026", posts: 5 },
              { title: "SEO Automation", posts: 4 },
            ].map((topic, index) => (
              <Card
                key={index}
                className="bg-bg-card border-border hover:border-accent/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text-primary">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {topic.posts} articles
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
            Ready to Transform Your SEO?
          </h2>
          <p className="text-text-secondary mb-8">
            Stop reading about AI-powered SEO and start using it. Try Optimus free for 14 days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="accent" size="lg" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
