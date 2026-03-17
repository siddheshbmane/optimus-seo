"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Clock,
  Image,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Search,
  Users,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Building,
  Navigation,
  Camera,
  Sparkles,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

type TabType = "overview" | "reviews" | "posts" | "photos" | "insights" | "competitors" | "citations";

const gmbData = {
  name: "Acme Corp - SEO Agency",
  address: "123 Main Street, New York, NY 10001",
  phone: "(555) 123-4567",
  website: "https://acmecorp.com",
  category: "Marketing Agency",
  rating: 4.8,
  totalReviews: 127,
  responseRate: 95,
  avgResponseTime: "2 hours",
  photos: 45,
  posts: 12,
  questions: 8,
  views: 15600,
  searches: 8900,
  actions: 2340,
};

const profileCompleteness = [
  { item: "Business Name", complete: true },
  { item: "Address", complete: true },
  { item: "Phone Number", complete: true },
  { item: "Website", complete: true },
  { item: "Business Hours", complete: true },
  { item: "Business Description", complete: true },
  { item: "Categories", complete: true },
  { item: "Attributes", complete: false },
  { item: "Products/Services", complete: false },
  { item: "Photos (20+)", complete: true },
];

const reviews = [
  {
    id: 1,
    author: "John D.",
    rating: 5,
    date: "2 days ago",
    text: "Excellent SEO services! Our rankings improved significantly within 3 months. The team was professional and kept us informed throughout the process.",
    replied: true,
    helpful: 12,
    sentiment: "positive",
  },
  {
    id: 2,
    author: "Sarah M.",
    rating: 5,
    date: "1 week ago",
    text: "Very professional team. They explained everything clearly and delivered results. Would highly recommend to anyone looking for SEO help.",
    replied: true,
    helpful: 8,
    sentiment: "positive",
  },
  {
    id: 3,
    author: "Mike T.",
    rating: 4,
    date: "2 weeks ago",
    text: "Good service overall. Communication could be slightly better, but the results speak for themselves. Our traffic increased by 150%.",
    replied: true,
    helpful: 5,
    sentiment: "positive",
  },
  {
    id: 4,
    author: "Emily R.",
    rating: 5,
    date: "3 weeks ago",
    text: "Best SEO agency we've worked with. Highly recommend! They really understand the local market.",
    replied: false,
    helpful: 15,
    sentiment: "positive",
  },
  {
    id: 5,
    author: "David K.",
    rating: 3,
    date: "1 month ago",
    text: "Decent results but took longer than expected. The team was responsive though.",
    replied: true,
    helpful: 3,
    sentiment: "neutral",
  },
];

const posts = [
  { id: 1, type: "update", title: "New SEO Guide Released", date: "Mar 15, 2026", views: 450, clicks: 89, status: "published" },
  { id: 2, type: "offer", title: "20% Off SEO Audit", date: "Mar 10, 2026", views: 890, clicks: 156, status: "published" },
  { id: 3, type: "event", title: "Free SEO Webinar", date: "Mar 5, 2026", views: 1200, clicks: 234, status: "published" },
  { id: 4, type: "update", title: "Case Study: 300% Traffic Increase", date: "Feb 28, 2026", views: 670, clicks: 112, status: "published" },
];

const localRankings = [
  { keyword: "seo agency new york", position: 2, change: 1, searches: 2400 },
  { keyword: "seo services nyc", position: 3, change: 2, searches: 1800 },
  { keyword: "digital marketing agency manhattan", position: 5, change: -1, searches: 1200 },
  { keyword: "local seo new york", position: 1, change: 0, searches: 890 },
  { keyword: "best seo company nyc", position: 4, change: 3, searches: 1500 },
  { keyword: "seo consultant new york", position: 6, change: 2, searches: 720 },
];

const competitors = [
  { name: "NYC SEO Experts", rating: 4.6, reviews: 89, distance: "0.5 mi", ranking: 1 },
  { name: "Manhattan Digital", rating: 4.4, reviews: 156, distance: "0.8 mi", ranking: 3 },
  { name: "Empire SEO", rating: 4.7, reviews: 234, distance: "1.2 mi", ranking: 2 },
  { name: "Big Apple Marketing", rating: 4.3, reviews: 67, distance: "1.5 mi", ranking: 5 },
];

const citations = [
  { source: "Yelp", status: "verified", nap: "consistent", url: "yelp.com/biz/acme-corp" },
  { source: "Yellow Pages", status: "verified", nap: "consistent", url: "yellowpages.com/acme-corp" },
  { source: "Facebook", status: "verified", nap: "consistent", url: "facebook.com/acmecorp" },
  { source: "BBB", status: "pending", nap: "inconsistent", url: "bbb.org/acme-corp" },
  { source: "Foursquare", status: "not found", nap: "missing", url: null },
];

const optimizationTips = [
  { tip: "Add business attributes (wheelchair accessible, etc.)", priority: "High", impact: "Medium" },
  { tip: "List all services with descriptions", priority: "High", impact: "High" },
  { tip: "Respond to the 1 unanswered review", priority: "Medium", impact: "High" },
  { tip: "Post weekly updates to stay active", priority: "Medium", impact: "Medium" },
  { tip: "Add more photos of your team and office", priority: "Low", impact: "Low" },
  { tip: "Add Q&A section with common questions", priority: "Medium", impact: "Medium" },
];

export default function GMBAnalysisPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [showReplyModal, setShowReplyModal] = React.useState(false);
  const [showPostModal, setShowPostModal] = React.useState(false);
  const [showPhotoModal, setShowPhotoModal] = React.useState(false);
  const [showReviewDetail, setShowReviewDetail] = React.useState(false);
  const [showCitationModal, setShowCitationModal] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState<typeof reviews[0] | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [filterRating, setFilterRating] = React.useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  if (!project) return null;

  const completenessScore = Math.round(
    (profileCompleteness.filter(p => p.complete).length / profileCompleteness.length) * 100
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "photos", label: "Photos", icon: Camera },
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "competitors", label: "Competitors", icon: Users },
    { id: "citations", label: "Citations", icon: Building },
  ];

  const handleReplyToReview = (review: typeof reviews[0]) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleViewReviewDetail = (review: typeof reviews[0]) => {
    setSelectedReview(review);
    setShowReviewDetail(true);
  };

  const handleSendReply = () => {
    // In a real app, this would send the reply
    setShowReplyModal(false);
    setSelectedReview(null);
    setReplyText("");
  };

  const filteredReviews = filterRating === "all" 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Local SEO & GMB</h1>
          <p className="text-text-secondary">
            Google Business Profile optimization and local search insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Google
          </Button>
          <Button variant="accent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="Profile Score"
              value={`${completenessScore}%`}
              trend={5}
              trendLabel="vs last month"
              icon={<CheckCircle className="h-5 w-5" />}
              variant="accent"
            />
            <StatCard
              label="Average Rating"
              value={gmbData.rating.toString()}
              trendLabel={`${gmbData.totalReviews} reviews`}
              icon={<Star className="h-5 w-5" />}
            />
            <StatCard
              label="Profile Views"
              value={formatNumber(gmbData.views)}
              trend={12}
              trendLabel="vs last month"
              icon={<Eye className="h-5 w-5" />}
            />
            <StatCard
              label="Search Appearances"
              value={formatNumber(gmbData.searches)}
              trend={8}
              trendLabel="vs last month"
              icon={<Search className="h-5 w-5" />}
            />
            <StatCard
              label="Customer Actions"
              value={formatNumber(gmbData.actions)}
              trend={15}
              trendLabel="vs last month"
              icon={<Navigation className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Business Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{gmbData.name}</h3>
                    <p className="text-text-secondary">{gmbData.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium text-text-primary">{gmbData.rating}</span>
                      <span className="text-text-muted">({gmbData.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated">
                    <MapPin className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Address</p>
                      <p className="text-sm text-text-primary">{gmbData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated">
                    <Phone className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Phone</p>
                      <p className="text-sm text-text-primary">{gmbData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated">
                    <Globe className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Website</p>
                      <p className="text-sm text-text-primary">{gmbData.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated">
                    <Clock className="h-5 w-5 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Avg Response Time</p>
                      <p className="text-sm text-text-primary">{gmbData.avgResponseTime}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative h-32 w-32">
                    <svg className="h-32 w-32 -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-border"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray={`${completenessScore * 3.52} 352`}
                        className="text-accent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-text-primary">{completenessScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {profileCompleteness.map((item) => (
                    <div key={item.item} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{item.item}</span>
                      {item.complete ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Local Rankings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Local Pack Rankings</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("insights")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {localRankings.slice(0, 5).map((ranking) => (
                  <div key={ranking.keyword} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <div>
                      <span className="font-medium text-text-primary">{ranking.keyword}</span>
                      <p className="text-xs text-text-muted">{formatNumber(ranking.searches)} monthly searches</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex items-center text-sm",
                        ranking.change > 0 ? "text-success" : ranking.change < 0 ? "text-error" : "text-text-muted"
                      )}>
                        {ranking.change > 0 && <TrendingUp className="h-4 w-4 mr-1" />}
                        {ranking.change < 0 && <TrendingDown className="h-4 w-4 mr-1" />}
                        {ranking.change !== 0 && Math.abs(ranking.change)}
                      </span>
                      <Badge variant={ranking.position <= 3 ? "success" : "neutral"}>
                        #{ranking.position}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizationTips.map((tip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        tip.priority === "High" ? "bg-error" : tip.priority === "Medium" ? "bg-warning" : "bg-text-muted"
                      )} />
                      <span className="text-text-primary">{tip.tip}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tip.impact === "High" ? "success" : tip.impact === "Medium" ? "warning" : "neutral"}>
                        {tip.impact} Impact
                      </Badge>
                      <Badge variant={tip.priority === "High" ? "error" : tip.priority === "Medium" ? "warning" : "neutral"}>
                        {tip.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Reviews"
              value={gmbData.totalReviews}
              trend={8}
              trendLabel="this month"
              icon={<MessageSquare className="h-5 w-5" />}
            />
            <StatCard
              label="Average Rating"
              value={gmbData.rating.toString()}
              icon={<Star className="h-5 w-5" />}
            />
            <StatCard
              label="Response Rate"
              value={`${gmbData.responseRate}%`}
              icon={<Reply className="h-5 w-5" />}
            />
            <StatCard
              label="Needs Reply"
              value={reviews.filter(r => !r.replied).length}
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="accent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {filterRating !== "all" && (
                  <Badge variant="accent" className="ml-2">{filterRating} stars</Badge>
                )}
              </Button>
              {showFilterDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {["all", "5", "4", "3", "2", "1"].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => { setFilterRating(rating); setShowFilterDropdown(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-md",
                          filterRating === rating ? "bg-accent/10 text-accent" : "hover:bg-bg-elevated"
                        )}
                      >
                        {rating === "all" ? "All Ratings" : `${rating} Stars`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button variant="accent">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Reply Suggestions
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="p-4 hover:bg-bg-elevated transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-accent font-semibold text-sm">{review.author.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{review.author}</p>
                          <p className="text-xs text-text-muted">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < review.rating ? "fill-warning text-warning" : "text-border"
                              )}
                            />
                          ))}
                        </div>
                        <Badge variant={review.sentiment === "positive" ? "success" : review.sentiment === "negative" ? "error" : "neutral"}>
                          {review.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{review.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {review.helpful} helpful
                        </span>
                        {review.replied ? (
                          <Badge variant="success" className="text-xs">Replied</Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">Needs Reply</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewReviewDetail(review)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!review.replied && (
                          <Button variant="secondary" size="sm" onClick={() => handleReplyToReview(review)}>
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Google Posts</h2>
            <Button variant="accent" onClick={() => setShowPostModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:border-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={post.type === "offer" ? "accent" : post.type === "event" ? "info" : "neutral"}>
                      {post.type}
                    </Badge>
                    <span className="text-xs text-text-muted">{post.date}</span>
                  </div>
                  <h3 className="font-medium text-text-primary mb-3">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      {post.clicks} clicks
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Photos</h2>
              <p className="text-sm text-text-muted">{gmbData.photos} photos uploaded</p>
            </div>
            <Button variant="accent" onClick={() => setShowPhotoModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-lg bg-bg-elevated flex items-center justify-center hover:bg-bg-elevated/80 transition-colors cursor-pointer">
                <Camera className="h-8 w-8 text-text-muted" />
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Photo Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { category: "Logo", count: 1, recommended: 1 },
                  { category: "Cover", count: 1, recommended: 1 },
                  { category: "Interior", count: 12, recommended: 10 },
                  { category: "Exterior", count: 5, recommended: 5 },
                  { category: "Team", count: 8, recommended: 5 },
                  { category: "Products", count: 15, recommended: 10 },
                  { category: "At Work", count: 3, recommended: 5 },
                  { category: "Food & Drink", count: 0, recommended: 0 },
                ].map((cat) => (
                  <div key={cat.category} className="p-3 rounded-lg bg-bg-elevated">
                    <p className="font-medium text-text-primary">{cat.category}</p>
                    <p className="text-sm text-text-muted">
                      {cat.count}/{cat.recommended} photos
                    </p>
                    {cat.count >= cat.recommended ? (
                      <CheckCircle className="h-4 w-4 text-success mt-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Search className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{formatNumber(gmbData.searches)}</p>
                    <p className="text-sm text-text-muted">Search Appearances</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Direct</span>
                    <span className="text-text-primary">65%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Discovery</span>
                    <span className="text-text-primary">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Branded</span>
                    <span className="text-text-primary">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{formatNumber(gmbData.views)}</p>
                    <p className="text-sm text-text-muted">Profile Views</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Search</span>
                    <span className="text-text-primary">78%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Maps</span>
                    <span className="text-text-primary">22%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{formatNumber(gmbData.actions)}</p>
                    <p className="text-sm text-text-muted">Customer Actions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Website Clicks</span>
                    <span className="text-text-primary">1,245</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Direction Requests</span>
                    <span className="text-text-primary">567</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Phone Calls</span>
                    <span className="text-text-primary">528</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Local Pack Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Position</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Change</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Searches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localRankings.map((ranking) => (
                      <tr key={ranking.keyword} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4 font-medium text-text-primary">{ranking.keyword}</td>
                        <td className="p-4 text-center">
                          <Badge variant={ranking.position <= 3 ? "success" : "neutral"}>
                            #{ranking.position}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "flex items-center justify-center text-sm",
                            ranking.change > 0 ? "text-success" : ranking.change < 0 ? "text-error" : "text-text-muted"
                          )}>
                            {ranking.change > 0 && <TrendingUp className="h-4 w-4 mr-1" />}
                            {ranking.change < 0 && <TrendingDown className="h-4 w-4 mr-1" />}
                            {ranking.change !== 0 ? Math.abs(ranking.change) : "—"}
                          </span>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(ranking.searches)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === "competitors" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Local Competitors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Business</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Rating</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Reviews</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Distance</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Avg. Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border bg-accent/5">
                      <td className="p-4 font-medium text-accent">{gmbData.name} (You)</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-mono text-text-primary">{gmbData.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono text-text-primary">{gmbData.totalReviews}</td>
                      <td className="p-4 text-center text-text-muted">—</td>
                      <td className="p-4 text-center">
                        <Badge variant="success">#2</Badge>
                      </td>
                    </tr>
                    {competitors.map((competitor) => (
                      <tr key={competitor.name} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4 font-medium text-text-primary">{competitor.name}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="font-mono text-text-primary">{competitor.rating}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">{competitor.reviews}</td>
                        <td className="p-4 text-center text-text-muted">{competitor.distance}</td>
                        <td className="p-4 text-center">
                          <Badge variant={competitor.ranking <= 3 ? "success" : "neutral"}>
                            #{competitor.ranking}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Citations Tab */}
      {activeTab === "citations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Citations"
              value={citations.length}
              icon={<Building className="h-5 w-5" />}
            />
            <StatCard
              label="Verified"
              value={citations.filter(c => c.status === "verified").length}
              icon={<CheckCircle className="h-5 w-5" />}
            />
            <StatCard
              label="Inconsistent NAP"
              value={citations.filter(c => c.nap === "inconsistent").length}
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="accent"
            />
            <StatCard
              label="Missing"
              value={citations.filter(c => c.status === "not found").length}
              icon={<Flag className="h-5 w-5" />}
            />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Citation Sources</h2>
            <Button variant="accent" onClick={() => setShowCitationModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Citation
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Source</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Status</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">NAP Consistency</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citations.map((citation) => (
                      <tr key={citation.source} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-bg-elevated flex items-center justify-center">
                              <Building className="h-4 w-4 text-text-muted" />
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">{citation.source}</p>
                              {citation.url && (
                                <p className="text-xs text-text-muted">{citation.url}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={
                            citation.status === "verified" ? "success" : 
                            citation.status === "pending" ? "warning" : "error"
                          }>
                            {citation.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={
                            citation.nap === "consistent" ? "success" : 
                            citation.nap === "inconsistent" ? "warning" : "error"
                          }>
                            {citation.nap}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          {citation.status === "not found" ? (
                            <Button variant="secondary" size="sm">
                              <Plus className="h-3 w-3 mr-1" />
                              Claim
                            </Button>
                          ) : citation.nap === "inconsistent" ? (
                            <Button variant="secondary" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Fix
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => { setShowReplyModal(false); setSelectedReview(null); setReplyText(""); }}
        title="Reply to Review"
        description={`Respond to ${selectedReview?.author}'s review`}
        size="lg"
      >
        <div className="space-y-4">
          {selectedReview && (
            <div className="p-4 rounded-lg bg-bg-elevated">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < selectedReview.rating ? "fill-warning text-warning" : "text-border"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-text-muted">{selectedReview.date}</span>
              </div>
              <p className="text-sm text-text-secondary">{selectedReview.text}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Your Reply
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 rounded-md border border-border bg-bg-card text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Write a professional and helpful response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-lg bg-info/10 border border-info/20">
            <p className="text-sm text-info">
              <strong>Tip:</strong> Thank the customer, address their feedback specifically, and invite them to return.
            </p>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowReplyModal(false); setSelectedReview(null); setReplyText(""); }}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleSendReply} disabled={!replyText.trim()}>
              <Reply className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Post Modal */}
      <Modal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title="Create Google Post"
        description="Share updates with your customers"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Post Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Update", "Offer", "Event"].map((type) => (
                <button
                  key={type}
                  className="p-3 rounded-lg border border-border hover:border-accent/50 text-center transition-colors"
                >
                  <p className="font-medium text-text-primary">{type}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Post Content
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 rounded-md border border-border bg-bg-card text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Write your post content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Add Photo
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-8 w-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">Click to upload or drag and drop</p>
            </div>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowPostModal(false)}>
              Cancel
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Photo Upload Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Upload Photos"
        description="Add photos to your Google Business Profile"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Photo Category
            </label>
            <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary">
              <option>Interior</option>
              <option>Exterior</option>
              <option>Team</option>
              <option>Products</option>
              <option>At Work</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Camera className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <p className="font-medium text-text-primary mb-1">Drop photos here</p>
            <p className="text-sm text-text-muted">or click to browse</p>
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
              Cancel
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Citation Modal */}
      <Modal
        isOpen={showCitationModal}
        onClose={() => setShowCitationModal(false)}
        title="Add Citation"
        description="Add a new business listing"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Directory/Platform
            </label>
            <Input placeholder="e.g., Yelp, Yellow Pages" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Listing URL
            </label>
            <Input placeholder="https://..." />
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowCitationModal(false)}>
              Cancel
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Add Citation
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Review Detail Panel */}
      <SlidePanel
        isOpen={showReviewDetail}
        onClose={() => { setShowReviewDetail(false); setSelectedReview(null); }}
        title="Review Details"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-semibold text-xl">{selectedReview.author.charAt(0)}</span>
              </div>
              <div>
                <p className="text-lg font-medium text-text-primary">{selectedReview.author}</p>
                <p className="text-sm text-text-muted">{selectedReview.date}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < selectedReview.rating ? "fill-warning text-warning" : "text-border"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-text-primary">{selectedReview.text}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated text-center">
                <p className="text-lg font-semibold text-text-primary">{selectedReview.helpful}</p>
                <p className="text-xs text-text-muted">Helpful votes</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated text-center">
                <Badge variant={selectedReview.sentiment === "positive" ? "success" : "neutral"}>
                  {selectedReview.sentiment}
                </Badge>
                <p className="text-xs text-text-muted mt-1">Sentiment</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated text-center">
                <Badge variant={selectedReview.replied ? "success" : "warning"}>
                  {selectedReview.replied ? "Replied" : "Pending"}
                </Badge>
                <p className="text-xs text-text-muted mt-1">Status</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => { setShowReviewDetail(false); setSelectedReview(null); }}>
                Close
              </Button>
              {!selectedReview.replied && (
                <Button variant="accent" onClick={() => {
                  setShowReviewDetail(false);
                  handleReplyToReview(selectedReview);
                }}>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              )}
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
