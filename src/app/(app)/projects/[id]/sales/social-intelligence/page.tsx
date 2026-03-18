"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Share2,
  Eye,
  BarChart3,
  Globe,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Filter,
  Download,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Clock,
  Calendar,
  Hash,
  AtSign,
  Link2,
  Image,
  Video,
  Zap,
  Target,
  Award,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Send,
  Bell,
  Settings,
  Search,
  Bookmark,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
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
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============ TYPES ============
interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  followers: number;
  engagement: number;
  posts: number;
  mentions: number;
  sentiment: number;
}

interface ReviewPlatform {
  id: string;
  name: string;
  rating: number;
  totalReviews: number;
  responseRate: number;
  avgResponseTime: string;
  sentiment: { positive: number; neutral: number; negative: number };
  trend: number;
}

interface SocialMention {
  id: number;
  platform: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
  engagement: { likes: number; shares: number; comments: number };
  reach: number;
  responded: boolean;
  flagged: boolean;
}

interface Review {
  id: number;
  platform: string;
  author: string;
  rating: number;
  content: string;
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
  responded: boolean;
  helpful: number;
  verified: boolean;
}

interface BrandAlert {
  id: number;
  type: "mention" | "review" | "sentiment" | "competitor";
  title: string;
  description: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  read: boolean;
}

// ============ MOCK DATA ============
const socialPlatforms: SocialPlatform[] = [
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    color: "#1DA1F2",
    connected: true,
    followers: 12500,
    engagement: 4.2,
    posts: 156,
    mentions: 89,
    sentiment: 78,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    connected: true,
    followers: 8900,
    engagement: 2.8,
    posts: 89,
    mentions: 45,
    sentiment: 82,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    connected: true,
    followers: 15600,
    engagement: 5.6,
    posts: 234,
    mentions: 156,
    sentiment: 85,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    connected: true,
    followers: 5400,
    engagement: 3.1,
    posts: 67,
    mentions: 34,
    sentiment: 91,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "#FF0000",
    connected: false,
    followers: 0,
    engagement: 0,
    posts: 0,
    mentions: 0,
    sentiment: 0,
  },
];

const reviewPlatforms: ReviewPlatform[] = [
  {
    id: "google",
    name: "Google Business",
    rating: 4.8,
    totalReviews: 127,
    responseRate: 95,
    avgResponseTime: "2 hours",
    sentiment: { positive: 85, neutral: 10, negative: 5 },
    trend: 8,
  },
  {
    id: "yelp",
    name: "Yelp",
    rating: 4.5,
    totalReviews: 89,
    responseRate: 78,
    avgResponseTime: "6 hours",
    sentiment: { positive: 75, neutral: 15, negative: 10 },
    trend: 3,
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    rating: 4.6,
    totalReviews: 234,
    responseRate: 88,
    avgResponseTime: "4 hours",
    sentiment: { positive: 80, neutral: 12, negative: 8 },
    trend: 12,
  },
  {
    id: "g2",
    name: "G2",
    rating: 4.7,
    totalReviews: 56,
    responseRate: 92,
    avgResponseTime: "3 hours",
    sentiment: { positive: 88, neutral: 8, negative: 4 },
    trend: 15,
  },
  {
    id: "capterra",
    name: "Capterra",
    rating: 4.4,
    totalReviews: 78,
    responseRate: 85,
    avgResponseTime: "5 hours",
    sentiment: { positive: 72, neutral: 18, negative: 10 },
    trend: -2,
  },
];

const socialMentions: SocialMention[] = [
  {
    id: 1,
    platform: "twitter",
    author: "John Marketing",
    handle: "@johnmarketing",
    content: "Just had an amazing experience with @AcmeCorp SEO team! Our rankings improved 150% in 3 months. Highly recommend! 🚀",
    timestamp: "2 hours ago",
    sentiment: "positive",
    engagement: { likes: 45, shares: 12, comments: 8 },
    reach: 15600,
    responded: true,
    flagged: false,
  },
  {
    id: 2,
    platform: "linkedin",
    author: "Sarah Chen",
    handle: "sarah-chen-seo",
    content: "Great insights from the Acme Corp webinar on technical SEO. The team really knows their stuff when it comes to Core Web Vitals optimization.",
    timestamp: "5 hours ago",
    sentiment: "positive",
    engagement: { likes: 89, shares: 23, comments: 15 },
    reach: 8900,
    responded: false,
    flagged: false,
  },
  {
    id: 3,
    platform: "twitter",
    author: "Mike Reviews",
    handle: "@mikereviews",
    content: "Been waiting 2 weeks for a response from @AcmeCorp support. Not impressed with the customer service so far.",
    timestamp: "1 day ago",
    sentiment: "negative",
    engagement: { likes: 5, shares: 2, comments: 3 },
    reach: 2300,
    responded: false,
    flagged: true,
  },
  {
    id: 4,
    platform: "instagram",
    author: "Digital Agency Pro",
    handle: "@digitalagencypro",
    content: "Partnering with Acme Corp for our clients' SEO needs. The results speak for themselves! 📈",
    timestamp: "2 days ago",
    sentiment: "positive",
    engagement: { likes: 234, shares: 45, comments: 28 },
    reach: 45000,
    responded: true,
    flagged: false,
  },
  {
    id: 5,
    platform: "facebook",
    author: "Small Biz Owner",
    handle: "smallbizowner",
    content: "Looking for SEO recommendations. Has anyone worked with Acme Corp? What was your experience?",
    timestamp: "3 days ago",
    sentiment: "neutral",
    engagement: { likes: 12, shares: 3, comments: 18 },
    reach: 3400,
    responded: true,
    flagged: false,
  },
];

const recentReviews: Review[] = [
  {
    id: 1,
    platform: "google",
    author: "David K.",
    rating: 5,
    content: "Excellent SEO services! Our organic traffic increased by 200% in just 4 months. The team is professional, responsive, and really knows their stuff.",
    timestamp: "1 day ago",
    sentiment: "positive",
    responded: true,
    helpful: 15,
    verified: true,
  },
  {
    id: 2,
    platform: "trustpilot",
    author: "Emily R.",
    rating: 5,
    content: "Best SEO agency we've worked with. They took the time to understand our business and created a customized strategy that delivered results.",
    timestamp: "2 days ago",
    sentiment: "positive",
    responded: true,
    helpful: 8,
    verified: true,
  },
  {
    id: 3,
    platform: "yelp",
    author: "Michael T.",
    rating: 3,
    content: "Decent results but communication could be better. Sometimes had to wait a few days for responses to questions.",
    timestamp: "3 days ago",
    sentiment: "neutral",
    responded: false,
    helpful: 3,
    verified: true,
  },
  {
    id: 4,
    platform: "g2",
    author: "Jennifer L.",
    rating: 5,
    content: "Acme Corp transformed our online presence. Their technical SEO audit uncovered issues we didn't even know existed. Highly recommend!",
    timestamp: "4 days ago",
    sentiment: "positive",
    responded: true,
    helpful: 22,
    verified: true,
  },
  {
    id: 5,
    platform: "google",
    author: "Robert M.",
    rating: 2,
    content: "Expected faster results. After 2 months, we haven't seen significant improvement in rankings. Still waiting to see if things improve.",
    timestamp: "5 days ago",
    sentiment: "negative",
    responded: true,
    helpful: 1,
    verified: true,
  },
];

const brandAlerts: BrandAlert[] = [
  {
    id: 1,
    type: "sentiment",
    title: "Negative Sentiment Spike",
    description: "3 negative mentions detected on Twitter in the last 24 hours",
    timestamp: "1 hour ago",
    priority: "high",
    read: false,
  },
  {
    id: 2,
    type: "review",
    title: "New 2-Star Review",
    description: "Robert M. left a 2-star review on Google Business",
    timestamp: "5 hours ago",
    priority: "high",
    read: false,
  },
  {
    id: 3,
    type: "mention",
    title: "Viral Mention",
    description: "Your brand was mentioned in a post with 45K+ reach",
    timestamp: "2 days ago",
    priority: "medium",
    read: true,
  },
  {
    id: 4,
    type: "competitor",
    title: "Competitor Activity",
    description: "SEO Experts Inc. launched a new service similar to yours",
    timestamp: "3 days ago",
    priority: "low",
    read: true,
  },
];

const engagementTrend = [
  { date: "Mon", mentions: 12, engagement: 450, sentiment: 78 },
  { date: "Tue", mentions: 18, engagement: 680, sentiment: 82 },
  { date: "Wed", mentions: 15, engagement: 520, sentiment: 75 },
  { date: "Thu", mentions: 22, engagement: 890, sentiment: 85 },
  { date: "Fri", mentions: 28, engagement: 1200, sentiment: 88 },
  { date: "Sat", mentions: 8, engagement: 320, sentiment: 80 },
  { date: "Sun", mentions: 6, engagement: 280, sentiment: 82 },
];

const sentimentDistribution = [
  { name: "Positive", value: 72, color: "#10B981" },
  { name: "Neutral", value: 18, color: "#6B7280" },
  { name: "Negative", value: 10, color: "#EF4444" },
];

const platformEngagement = [
  { platform: "Twitter", mentions: 89, engagement: 2.4, reach: 45000 },
  { platform: "Instagram", mentions: 156, engagement: 5.6, reach: 78000 },
  { platform: "LinkedIn", mentions: 34, engagement: 3.1, reach: 12000 },
  { platform: "Facebook", mentions: 45, engagement: 2.8, reach: 23000 },
];

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "mentions", label: "Social Mentions", icon: AtSign },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "sentiment", label: "Sentiment", icon: Heart },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "competitors", label: "Competitors", icon: Users },
];

export default function SocialIntelligencePage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [activeTab, setActiveTab] = React.useState("overview");
  const [showReplyModal, setShowReplyModal] = React.useState(false);
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const [showAlertSettings, setShowAlertSettings] = React.useState(false);
  const [selectedMention, setSelectedMention] = React.useState<SocialMention | null>(null);
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [mentionFilter, setMentionFilter] = React.useState<string>("all");
  const [reviewFilter, setReviewFilter] = React.useState<string>("all");
  const [showMentionDetail, setShowMentionDetail] = React.useState(false);

  if (!project) return null;

  // Calculate totals
  const totalFollowers = socialPlatforms.filter(p => p.connected).reduce((sum, p) => sum + p.followers, 0);
  const totalMentions = socialPlatforms.filter(p => p.connected).reduce((sum, p) => sum + p.mentions, 0);
  const avgEngagement = socialPlatforms.filter(p => p.connected).reduce((sum, p) => sum + p.engagement, 0) / socialPlatforms.filter(p => p.connected).length;
  const avgSentiment = socialPlatforms.filter(p => p.connected).reduce((sum, p) => sum + p.sentiment, 0) / socialPlatforms.filter(p => p.connected).length;
  
  const totalReviews = reviewPlatforms.reduce((sum, p) => sum + p.totalReviews, 0);
  const avgRating = reviewPlatforms.reduce((sum, p) => sum + p.rating, 0) / reviewPlatforms.length;
  const avgResponseRate = reviewPlatforms.reduce((sum, p) => sum + p.responseRate, 0) / reviewPlatforms.length;

  const unreadAlerts = brandAlerts.filter(a => !a.read).length;
  const needsResponse = socialMentions.filter(m => !m.responded && m.sentiment === "negative").length + 
                        recentReviews.filter(r => !r.responded && r.rating <= 3).length;

  const handleReply = (item: SocialMention | Review) => {
    if ('handle' in item) {
      setSelectedMention(item);
      setSelectedReview(null);
    } else {
      setSelectedReview(item);
      setSelectedMention(null);
    }
    setShowReplyModal(true);
  };

  const filteredMentions = mentionFilter === "all" 
    ? socialMentions 
    : socialMentions.filter(m => m.sentiment === mentionFilter);

  const filteredReviews = reviewFilter === "all"
    ? recentReviews
    : reviewFilter === "needs_response"
    ? recentReviews.filter(r => !r.responded)
    : recentReviews.filter(r => r.platform === reviewFilter);

  const getPlatformIcon = (platformId: string) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform?.icon || Globe;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform?.color || "#6B7280";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Social & Review Intelligence</h1>
          <p className="text-text-secondary">
            Monitor brand mentions, reviews, and social sentiment across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowConnectModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Platform
          </Button>
          <Button variant="accent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {unreadAlerts > 0 && (
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-warning" />
            <div>
              <p className="font-medium text-text-primary">
                {unreadAlerts} unread alert{unreadAlerts > 1 ? "s" : ""} require your attention
              </p>
              <p className="text-sm text-text-muted">
                {needsResponse} items need a response
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setActiveTab("alerts")}>
            View Alerts
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.id === "alerts" && unreadAlerts > 0 && (
              <Badge variant="error" className="ml-1">{unreadAlerts}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StatCard
              label="Total Followers"
              value={formatNumber(totalFollowers)}
              trend={8.5}
              trendLabel="vs last month"
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              label="Brand Mentions"
              value={formatNumber(totalMentions)}
              trend={12.3}
              trendLabel="this week"
              icon={<AtSign className="h-5 w-5" />}
            />
            <StatCard
              label="Avg Engagement"
              value={`${avgEngagement.toFixed(1)}%`}
              trend={2.1}
              trendLabel="vs last month"
              icon={<Heart className="h-5 w-5" />}
            />
            <StatCard
              label="Total Reviews"
              value={formatNumber(totalReviews)}
              trend={15}
              trendLabel="this month"
              icon={<Star className="h-5 w-5" />}
            />
            <StatCard
              label="Avg Rating"
              value={avgRating.toFixed(1)}
              icon={<Award className="h-5 w-5" />}
            />
            <StatCard
              label="Sentiment Score"
              value={`${Math.round(avgSentiment)}%`}
              trend={3.2}
              trendLabel="positive"
              icon={<Activity className="h-5 w-5" />}
              variant="accent"
            />
          </div>

          {/* Connected Platforms */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Connected Platforms</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowConnectModal(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div
                      key={platform.id}
                      className={cn(
                        "p-4 rounded-lg border transition-colors",
                        platform.connected
                          ? "border-border hover:border-accent/50"
                          : "border-dashed border-border/50 opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${platform.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: platform.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-sm">{platform.name}</p>
                          {platform.connected ? (
                            <Badge variant="success" className="text-xs">Connected</Badge>
                          ) : (
                            <Badge variant="neutral" className="text-xs">Not Connected</Badge>
                          )}
                        </div>
                      </div>
                      {platform.connected && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-text-muted">Followers</p>
                            <p className="font-medium text-text-primary">{formatNumber(platform.followers)}</p>
                          </div>
                          <div>
                            <p className="text-text-muted">Mentions</p>
                            <p className="font-medium text-text-primary">{platform.mentions}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            {/* Engagement Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                      <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-bg-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="engagement"
                        stroke="#FD8C73"
                        fill="#FD8C73"
                        fillOpacity={0.2}
                        name="Engagement"
                      />
                      <Area
                        type="monotone"
                        dataKey="mentions"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.2}
                        name="Mentions"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={sentimentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {sentimentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Mentions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Mentions</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("mentions")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {socialMentions.slice(0, 3).map((mention) => {
                    const Icon = getPlatformIcon(mention.platform);
                    return (
                      <div key={mention.id} className="p-4 hover:bg-bg-elevated transition-colors">
                        <div className="flex items-start gap-3">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${getPlatformColor(mention.platform)}20` }}
                          >
                            <Icon className="h-4 w-4" style={{ color: getPlatformColor(mention.platform) }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-text-primary text-sm">{mention.author}</span>
                              <span className="text-text-muted text-xs">{mention.handle}</span>
                              <Badge
                                variant={
                                  mention.sentiment === "positive" ? "success" :
                                  mention.sentiment === "negative" ? "error" : "neutral"
                                }
                                className="text-xs"
                              >
                                {mention.sentiment}
                              </Badge>
                            </div>
                            <p className="text-sm text-text-secondary line-clamp-2">{mention.content}</p>
                            <p className="text-xs text-text-muted mt-1">{mention.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Reviews</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("reviews")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentReviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="p-4 hover:bg-bg-elevated transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary text-sm">{review.author}</span>
                          <Badge variant="neutral" className="text-xs">{review.platform}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < review.rating ? "fill-warning text-warning" : "text-border"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">{review.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-text-muted">{review.timestamp}</p>
                        {review.responded ? (
                          <Badge variant="success" className="text-xs">Replied</Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">Needs Reply</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Social Mentions Tab */}
      {activeTab === "mentions" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={mentionFilter === "all" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setMentionFilter("all")}
              >
                All ({socialMentions.length})
              </Button>
              <Button
                variant={mentionFilter === "positive" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setMentionFilter("positive")}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Positive
              </Button>
              <Button
                variant={mentionFilter === "neutral" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setMentionFilter("neutral")}
              >
                Neutral
              </Button>
              <Button
                variant={mentionFilter === "negative" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setMentionFilter("negative")}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Negative
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search mentions..." className="w-64" />
              <Button variant="secondary">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Mentions List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredMentions.map((mention) => {
                  const Icon = getPlatformIcon(mention.platform);
                  return (
                    <div key={mention.id} className="p-4 hover:bg-bg-elevated transition-colors">
                      <div className="flex items-start gap-4">
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${getPlatformColor(mention.platform)}20` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: getPlatformColor(mention.platform) }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-text-primary">{mention.author}</span>
                            <span className="text-text-muted text-sm">{mention.handle}</span>
                            <Badge
                              variant={
                                mention.sentiment === "positive" ? "success" :
                                mention.sentiment === "negative" ? "error" : "neutral"
                              }
                            >
                              {mention.sentiment}
                            </Badge>
                            {mention.flagged && (
                              <Badge variant="error">
                                <Flag className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <p className="text-text-secondary mb-2">{mention.content}</p>
                          <div className="flex items-center gap-4 text-sm text-text-muted">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {mention.engagement.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" />
                              {mention.engagement.shares}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {mention.engagement.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {formatNumber(mention.reach)} reach
                            </span>
                            <span>{mention.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {mention.responded ? (
                            <Badge variant="success">Responded</Badge>
                          ) : (
                            <Button variant="secondary" size="sm" onClick={() => handleReply(mention)}>
                              <Reply className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Review Platforms Summary */}
          <div className="grid grid-cols-5 gap-4">
            {reviewPlatforms.map((platform) => (
              <Card key={platform.id} className="hover:border-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text-primary text-sm">{platform.name}</span>
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      platform.trend >= 0 ? "text-success" : "text-error"
                    )}>
                      {platform.trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(platform.trend)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-bold text-text-primary">{platform.rating}</span>
                    </div>
                    <span className="text-text-muted text-sm">({platform.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>{platform.responseRate}% response rate</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={reviewFilter === "all" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setReviewFilter("all")}
              >
                All Reviews
              </Button>
              <Button
                variant={reviewFilter === "needs_response" ? "accent" : "secondary"}
                size="sm"
                onClick={() => setReviewFilter("needs_response")}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Needs Response
              </Button>
              {reviewPlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={reviewFilter === platform.id ? "accent" : "secondary"}
                  size="sm"
                  onClick={() => setReviewFilter(platform.id)}
                >
                  {platform.name}
                </Button>
              ))}
            </div>
            <Button variant="accent">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Replies
            </Button>
          </div>

          {/* Reviews List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="p-4 hover:bg-bg-elevated transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-accent font-semibold">{review.author.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary">{review.author}</span>
                            {review.verified && (
                              <Badge variant="success" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-text-muted">
                            <Badge variant="neutral" className="text-xs">{review.platform}</Badge>
                            <span>{review.timestamp}</span>
                          </div>
                        </div>
                      </div>
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
                    </div>
                    <p className="text-text-secondary mb-3">{review.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {review.helpful} found helpful
                        </span>
                        <Badge
                          variant={
                            review.sentiment === "positive" ? "success" :
                            review.sentiment === "negative" ? "error" : "neutral"
                          }
                        >
                          {review.sentiment}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.responded ? (
                          <Badge variant="success">Replied</Badge>
                        ) : (
                          <Button variant="secondary" size="sm" onClick={() => handleReply(review)}>
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sentiment Tab */}
      {activeTab === "sentiment" && (
        <div className="space-y-6">
          {/* Sentiment Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <ThumbsUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">72%</p>
                    <p className="text-sm text-text-muted">Positive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                    <Activity className="h-5 w-5 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">18%</p>
                    <p className="text-sm text-text-muted">Neutral</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-error/10 flex items-center justify-center">
                    <ThumbsDown className="h-5 w-5 text-error" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-error">10%</p>
                    <p className="text-sm text-text-muted">Negative</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">+5.2%</p>
                    <p className="text-sm text-text-muted">vs Last Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Sentiment Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                      <YAxis stroke="var(--color-text-muted)" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-bg-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sentiment"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981" }}
                        name="Sentiment Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Platform Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialPlatforms.filter(p => p.connected).map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div key={platform.id} className="flex items-center gap-4">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${platform.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: platform.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-text-primary">{platform.name}</span>
                            <span className="text-sm text-text-muted">{platform.sentiment}%</span>
                          </div>
                          <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${platform.sentiment}%`,
                                backgroundColor: platform.sentiment >= 80 ? "#10B981" : platform.sentiment >= 60 ? "#F59E0B" : "#EF4444"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Top Mentioned Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  { word: "professional", count: 45, sentiment: "positive" },
                  { word: "results", count: 38, sentiment: "positive" },
                  { word: "responsive", count: 32, sentiment: "positive" },
                  { word: "helpful", count: 28, sentiment: "positive" },
                  { word: "recommend", count: 25, sentiment: "positive" },
                  { word: "slow", count: 8, sentiment: "negative" },
                  { word: "expensive", count: 6, sentiment: "negative" },
                  { word: "communication", count: 15, sentiment: "neutral" },
                  { word: "team", count: 22, sentiment: "positive" },
                  { word: "support", count: 18, sentiment: "positive" },
                ].map((keyword) => (
                  <Badge
                    key={keyword.word}
                    variant={
                      keyword.sentiment === "positive" ? "success" :
                      keyword.sentiment === "negative" ? "error" : "neutral"
                    }
                    className="text-sm py-1 px-3"
                  >
                    {keyword.word} ({keyword.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Brand Alerts</h2>
            <Button variant="secondary" onClick={() => setShowAlertSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Alert Settings
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {brandAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-4 hover:bg-bg-elevated transition-colors",
                      !alert.read && "bg-accent/5"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        alert.priority === "high" ? "bg-error/10" :
                        alert.priority === "medium" ? "bg-warning/10" : "bg-info/10"
                      )}>
                        {alert.type === "mention" ? (
                          <AtSign className={cn(
                            "h-5 w-5",
                            alert.priority === "high" ? "text-error" :
                            alert.priority === "medium" ? "text-warning" : "text-info"
                          )} />
                        ) : alert.type === "review" ? (
                          <Star className={cn(
                            "h-5 w-5",
                            alert.priority === "high" ? "text-error" :
                            alert.priority === "medium" ? "text-warning" : "text-info"
                          )} />
                        ) : alert.type === "sentiment" ? (
                          <Activity className={cn(
                            "h-5 w-5",
                            alert.priority === "high" ? "text-error" :
                            alert.priority === "medium" ? "text-warning" : "text-info"
                          )} />
                        ) : (
                          <Users className={cn(
                            "h-5 w-5",
                            alert.priority === "high" ? "text-error" :
                            alert.priority === "medium" ? "text-warning" : "text-info"
                          )} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "font-medium",
                            !alert.read ? "text-text-primary" : "text-text-secondary"
                          )}>
                            {alert.title}
                          </span>
                          <Badge variant={
                            alert.priority === "high" ? "error" :
                            alert.priority === "medium" ? "warning" : "info"
                          }>
                            {alert.priority}
                          </Badge>
                          {!alert.read && (
                            <div className="h-2 w-2 rounded-full bg-accent" />
                          )}
                        </div>
                        <p className="text-sm text-text-muted">{alert.description}</p>
                        <p className="text-xs text-text-muted mt-1">{alert.timestamp}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
              <CardTitle>Competitor Social Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Competitor</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Followers</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Engagement</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Avg Rating</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Reviews</th>
                      <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border bg-accent/5">
                      <td className="p-4 font-medium text-accent">Your Brand</td>
                      <td className="p-4 text-center font-mono text-text-primary">{formatNumber(totalFollowers)}</td>
                      <td className="p-4 text-center font-mono text-text-primary">{avgEngagement.toFixed(1)}%</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-mono text-text-primary">{avgRating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono text-text-primary">{formatNumber(totalReviews)}</td>
                      <td className="p-4 text-center">
                        <Badge variant="success">{Math.round(avgSentiment)}%</Badge>
                      </td>
                    </tr>
                    {[
                      { name: "SEO Experts Inc.", followers: 45000, engagement: 3.8, rating: 4.5, reviews: 456, sentiment: 75 },
                      { name: "Digital Growth Co.", followers: 32000, engagement: 4.2, rating: 4.6, reviews: 312, sentiment: 82 },
                      { name: "Rank Masters", followers: 28000, engagement: 3.5, rating: 4.3, reviews: 234, sentiment: 70 },
                      { name: "Search Pros", followers: 18000, engagement: 2.9, rating: 4.1, reviews: 189, sentiment: 68 },
                    ].map((competitor) => (
                      <tr key={competitor.name} className="border-b border-border hover:bg-bg-elevated">
                        <td className="p-4 font-medium text-text-primary">{competitor.name}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(competitor.followers)}</td>
                        <td className="p-4 text-center font-mono text-text-primary">{competitor.engagement}%</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="font-mono text-text-primary">{competitor.rating}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-mono text-text-primary">{formatNumber(competitor.reviews)}</td>
                        <td className="p-4 text-center">
                          <Badge variant={competitor.sentiment >= 75 ? "success" : competitor.sentiment >= 60 ? "warning" : "error"}>
                            {competitor.sentiment}%
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

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedMention(null);
          setSelectedReview(null);
          setReplyText("");
        }}
        title={selectedMention ? "Reply to Mention" : "Reply to Review"}
        size="lg"
      >
        <div className="space-y-4">
          {/* Original Content */}
          <div className="p-4 rounded-lg bg-bg-elevated">
            {selectedMention && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-text-primary">{selectedMention.author}</span>
                  <span className="text-text-muted">{selectedMention.handle}</span>
                </div>
                <p className="text-text-secondary">{selectedMention.content}</p>
              </>
            )}
            {selectedReview && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-text-primary">{selectedReview.author}</span>
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
                </div>
                <p className="text-text-secondary">{selectedReview.content}</p>
              </>
            )}
          </div>

          {/* AI Suggestion */}
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">AI Suggested Reply</span>
            </div>
            <p className="text-sm text-text-secondary">
              {selectedMention?.sentiment === "negative" || (selectedReview && selectedReview.rating <= 3)
                ? "Thank you for your feedback. We're sorry to hear about your experience and would like to make things right. Please reach out to our support team at support@acmecorp.com so we can address your concerns directly."
                : "Thank you so much for your kind words! We're thrilled to hear about your positive experience. Your support means a lot to our team, and we look forward to continuing to deliver great results for you!"}
            </p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setReplyText(
              selectedMention?.sentiment === "negative" || (selectedReview && selectedReview.rating <= 3)
                ? "Thank you for your feedback. We're sorry to hear about your experience and would like to make things right. Please reach out to our support team at support@acmecorp.com so we can address your concerns directly."
                : "Thank you so much for your kind words! We're thrilled to hear about your positive experience. Your support means a lot to our team, and we look forward to continuing to deliver great results for you!"
            )}>
              Use This Reply
            </Button>
          </div>

          {/* Reply Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Your Reply
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 rounded-md border border-border bg-bg-card text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => {
              setShowReplyModal(false);
              setSelectedMention(null);
              setSelectedReview(null);
              setReplyText("");
            }}>
              Cancel
            </Button>
            <Button variant="accent" disabled={!replyText.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Connect Platform Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        title="Connect Platform"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Connect your social media and review platforms to monitor brand mentions and reviews.
          </p>
          <div className="space-y-3">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div
                  key={platform.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-colors",
                    platform.connected ? "border-success/50 bg-success/5" : "border-border hover:border-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: platform.color }} />
                    </div>
                    <span className="font-medium text-text-primary">{platform.name}</span>
                  </div>
                  {platform.connected ? (
                    <Badge variant="success">Connected</Badge>
                  ) : (
                    <Button variant="secondary" size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowConnectModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Alert Settings Modal */}
      <Modal
        isOpen={showAlertSettings}
        onClose={() => setShowAlertSettings(false)}
        title="Alert Settings"
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { label: "Negative mentions", description: "Alert when negative sentiment is detected", enabled: true },
              { label: "New reviews", description: "Alert for all new reviews", enabled: true },
              { label: "Low ratings", description: "Alert for reviews 3 stars or below", enabled: true },
              { label: "Viral mentions", description: "Alert when reach exceeds 10K", enabled: false },
              { label: "Competitor activity", description: "Alert for competitor mentions", enabled: false },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                <div>
                  <p className="font-medium text-text-primary">{setting.label}</p>
                  <p className="text-sm text-text-muted">{setting.description}</p>
                </div>
                <button
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    setting.enabled ? "bg-accent" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      setting.enabled ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAlertSettings(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowAlertSettings(false)}>
              Save Settings
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
