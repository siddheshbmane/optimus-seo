"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Youtube,
  Play,
  Eye,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Search,
  Target,
  BarChart2,
  Clock,
  Users,
  Video,
  Sparkles,
  Download,
  RefreshCw,
  Plus,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Hash,
  FileText,
  Lightbulb,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type TabType = "overview" | "videos" | "keywords" | "competitors" | "optimization";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 className="h-4 w-4" /> },
  { id: "videos", label: "Videos", icon: <Video className="h-4 w-4" /> },
  { id: "keywords", label: "Keywords", icon: <Target className="h-4 w-4" /> },
  { id: "competitors", label: "Competitors", icon: <Users className="h-4 w-4" /> },
  { id: "optimization", label: "Optimization", icon: <Sparkles className="h-4 w-4" /> },
];

// Mock data
const mockChannelStats = {
  subscribers: 45200,
  subscribersChange: 12.5,
  totalViews: 2850000,
  viewsChange: 18.2,
  totalVideos: 156,
  avgViews: 18269,
  avgEngagement: 4.8,
  watchTime: 125000,
};

const mockVideos = [
  { id: 1, title: "Complete SEO Tutorial 2026", views: 125000, likes: 8500, comments: 450, duration: "45:32", published: "2 weeks ago", ranking: 3, keyword: "seo tutorial" },
  { id: 2, title: "Technical SEO Checklist", views: 89000, likes: 6200, comments: 320, duration: "28:15", published: "1 month ago", ranking: 1, keyword: "technical seo" },
  { id: 3, title: "Keyword Research Guide", views: 156000, likes: 12000, comments: 680, duration: "52:18", published: "3 weeks ago", ranking: 2, keyword: "keyword research" },
  { id: 4, title: "Link Building Strategies", views: 67000, likes: 4800, comments: 210, duration: "35:45", published: "1 week ago", ranking: 5, keyword: "link building" },
  { id: 5, title: "Local SEO for Beginners", views: 98000, likes: 7200, comments: 380, duration: "42:10", published: "2 months ago", ranking: 4, keyword: "local seo" },
];

const mockKeywords = [
  { keyword: "seo tutorial", volume: 74000, competition: "high", yourRank: 3, topCompetitor: "Ahrefs", topRank: 1 },
  { keyword: "technical seo", volume: 33100, competition: "medium", yourRank: 1, topCompetitor: "Moz", topRank: 2 },
  { keyword: "keyword research", volume: 49500, competition: "high", yourRank: 2, topCompetitor: "Semrush", topRank: 1 },
  { keyword: "link building", volume: 27100, competition: "medium", yourRank: 5, topCompetitor: "Backlinko", topRank: 1 },
  { keyword: "local seo", volume: 33100, competition: "medium", yourRank: 4, topCompetitor: "BrightLocal", topRank: 1 },
  { keyword: "seo tools", volume: 22200, competition: "high", yourRank: 8, topCompetitor: "Ahrefs", topRank: 1 },
];

const mockCompetitors = [
  { name: "Ahrefs", subscribers: 450000, videos: 320, avgViews: 85000, engagement: 5.2 },
  { name: "Moz", subscribers: 280000, videos: 450, avgViews: 45000, engagement: 4.5 },
  { name: "Semrush", subscribers: 380000, videos: 280, avgViews: 72000, engagement: 4.8 },
  { name: "Backlinko", subscribers: 520000, videos: 85, avgViews: 250000, engagement: 6.2 },
];

const mockViewsTrend = [
  { month: "Oct", views: 180000 },
  { month: "Nov", views: 220000 },
  { month: "Dec", views: 195000 },
  { month: "Jan", views: 280000 },
  { month: "Feb", views: 320000 },
  { month: "Mar", views: 350000 },
];

const mockOptimizationTips = [
  { title: "Add timestamps to video descriptions", impact: "high", effort: "low", status: "pending" },
  { title: "Create custom thumbnails for all videos", impact: "high", effort: "medium", status: "in_progress" },
  { title: "Add end screens to boost watch time", impact: "medium", effort: "low", status: "completed" },
  { title: "Optimize video titles with target keywords", impact: "high", effort: "low", status: "pending" },
  { title: "Add cards linking to related videos", impact: "medium", effort: "low", status: "pending" },
  { title: "Create playlists for topic clusters", impact: "medium", effort: "medium", status: "completed" },
];

export default function YouTubeSEOPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAddVideo, setShowAddVideo] = React.useState(false);
  const [showVideoDetail, setShowVideoDetail] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<typeof mockVideos[0] | null>(null);

  if (!project) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "videos":
        return renderVideosTab();
      case "keywords":
        return renderKeywordsTab();
      case "competitors":
        return renderCompetitorsTab();
      case "optimization":
        return renderOptimizationTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Subscribers"
          value={formatNumber(mockChannelStats.subscribers)}
          trend={mockChannelStats.subscribersChange}
          trendLabel="this month"
          icon={<Users className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Total Views"
          value={formatNumber(mockChannelStats.totalViews)}
          trend={mockChannelStats.viewsChange}
          trendLabel="this month"
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Total Videos"
          value={mockChannelStats.totalVideos}
          icon={<Video className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Engagement"
          value={`${mockChannelStats.avgEngagement}%`}
          icon={<ThumbsUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Views Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockViewsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#FD8C73" strokeWidth={3} dot={{ fill: '#FD8C73' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVideos.slice(0, 4).map((video, i) => (
                <div key={video.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent">#{i + 1}</span>
                    <div>
                      <p className="font-medium text-text-primary text-sm">{video.title}</p>
                      <p className="text-xs text-text-muted">{video.published}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-text-primary">{formatNumber(video.views)}</p>
                    <p className="text-xs text-text-muted">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderVideosTab = () => (
    <>
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="accent" onClick={() => setShowAddVideo(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Video</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Views</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Likes</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Comments</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Duration</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Rank</th>
                </tr>
              </thead>
              <tbody>
                {mockVideos.map((video) => (
                  <tr
                    key={video.id}
                    onClick={() => {
                      setSelectedVideo(video);
                      setShowVideoDetail(true);
                    }}
                    className="border-b border-border hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-20 rounded bg-bg-elevated flex items-center justify-center">
                          <Play className="h-5 w-5 text-text-muted" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{video.title}</p>
                          <p className="text-xs text-text-muted">{video.published}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono">{formatNumber(video.views)}</td>
                    <td className="p-4 text-center font-mono">{formatNumber(video.likes)}</td>
                    <td className="p-4 text-center font-mono">{video.comments}</td>
                    <td className="p-4 text-center font-mono">{video.duration}</td>
                    <td className="p-4 text-center">
                      <Badge variant={video.ranking <= 3 ? "success" : video.ranking <= 5 ? "warning" : "neutral"}>
                        #{video.ranking}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderKeywordsTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tracked Keywords"
          value={mockKeywords.length}
          icon={<Target className="h-5 w-5" />}
        />
        <StatCard
          label="Top 3 Rankings"
          value={mockKeywords.filter(k => k.yourRank <= 3).length}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Avg. Position"
          value={(mockKeywords.reduce((s, k) => s + k.yourRank, 0) / mockKeywords.length).toFixed(1)}
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          label="Total Volume"
          value={formatNumber(mockKeywords.reduce((s, k) => s + k.volume, 0))}
          icon={<Search className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>YouTube Keyword Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Keyword</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Volume</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Competition</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Your Rank</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Top Competitor</th>
                </tr>
              </thead>
              <tbody>
                {mockKeywords.map((kw) => (
                  <tr key={kw.keyword} className="border-b border-border hover:bg-bg-elevated transition-colors">
                    <td className="p-4 font-medium text-text-primary">{kw.keyword}</td>
                    <td className="p-4 text-center font-mono">{formatNumber(kw.volume)}</td>
                    <td className="p-4 text-center">
                      <Badge variant={kw.competition === "high" ? "error" : kw.competition === "medium" ? "warning" : "success"}>
                        {kw.competition}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={kw.yourRank <= 3 ? "success" : kw.yourRank <= 5 ? "warning" : "neutral"}>
                        #{kw.yourRank}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-text-secondary">{kw.topCompetitor}</span>
                      <span className="text-text-muted ml-1">#{kw.topRank}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderCompetitorsTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Competitors Tracked"
          value={mockCompetitors.length}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Your Subscribers"
          value={formatNumber(mockChannelStats.subscribers)}
          icon={<Users className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Avg. Competitor Subs"
          value={formatNumber(Math.round(mockCompetitors.reduce((s, c) => s + c.subscribers, 0) / mockCompetitors.length))}
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          label="Gap to Leader"
          value={formatNumber(Math.max(...mockCompetitors.map(c => c.subscribers)) - mockChannelStats.subscribers)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competitor Channels</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Channel</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Subscribers</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Videos</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Avg. Views</th>
                  <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Engagement</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border bg-accent/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Youtube className="h-5 w-5 text-accent" />
                      </div>
                      <span className="font-medium text-accent">Your Channel</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-accent">{formatNumber(mockChannelStats.subscribers)}</td>
                  <td className="p-4 text-center font-mono">{mockChannelStats.totalVideos}</td>
                  <td className="p-4 text-center font-mono">{formatNumber(mockChannelStats.avgViews)}</td>
                  <td className="p-4 text-center font-mono">{mockChannelStats.avgEngagement}%</td>
                </tr>
                {mockCompetitors.map((comp) => (
                  <tr key={comp.name} className="border-b border-border hover:bg-bg-elevated transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-bg-elevated flex items-center justify-center">
                          <Youtube className="h-5 w-5 text-text-muted" />
                        </div>
                        <span className="font-medium text-text-primary">{comp.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono">{formatNumber(comp.subscribers)}</td>
                    <td className="p-4 text-center font-mono">{comp.videos}</td>
                    <td className="p-4 text-center font-mono">{formatNumber(comp.avgViews)}</td>
                    <td className="p-4 text-center font-mono">{comp.engagement}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderOptimizationTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Optimization Tasks"
          value={mockOptimizationTips.length}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={mockOptimizationTips.filter(t => t.status === "completed").length}
          icon={<Zap className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="In Progress"
          value={mockOptimizationTips.filter(t => t.status === "in_progress").length}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="High Impact"
          value={mockOptimizationTips.filter(t => t.impact === "high").length}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOptimizationTips.map((tip, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={tip.status === "completed"}
                    onChange={() => {}}
                    className="rounded border-border"
                  />
                  <div>
                    <p className={cn(
                      "font-medium",
                      tip.status === "completed" ? "text-text-muted line-through" : "text-text-primary"
                    )}>
                      {tip.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tip.impact === "high" ? "success" : "warning"}>{tip.impact} impact</Badge>
                  <Badge variant="neutral">{tip.effort} effort</Badge>
                  <Badge variant={
                    tip.status === "completed" ? "success" :
                    tip.status === "in_progress" ? "warning" : "neutral"
                  }>
                    {tip.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Youtube className="h-7 w-7 text-[#FF0000]" />
            YouTube SEO
          </h1>
          <p className="text-text-secondary">
            Optimize your YouTube channel and video rankings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Button variant="accent">
            <Sparkles className="h-4 w-4 mr-2" />
            Optimize Videos
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-bg-primary text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}

      <Modal
        isOpen={showAddVideo}
        onClose={() => setShowAddVideo(false)}
        title="Add Video to Track"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">YouTube Video URL</label>
            <Input placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Target Keyword</label>
            <Input placeholder="e.g., seo tutorial" />
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddVideo(false)}>Cancel</Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      <Modal
        isOpen={showVideoDetail}
        onClose={() => setShowVideoDetail(false)}
        title={selectedVideo?.title || "Video Details"}
        size="lg"
      >
        {selectedVideo && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Views</p>
                <p className="text-xl font-bold">{formatNumber(selectedVideo.views)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Likes</p>
                <p className="text-xl font-bold">{formatNumber(selectedVideo.likes)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Comments</p>
                <p className="text-xl font-bold">{selectedVideo.comments}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Ranking</p>
                <p className="text-xl font-bold text-accent">#{selectedVideo.ranking}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-sm text-text-muted mb-1">Target Keyword</p>
              <Badge variant="accent">{selectedVideo.keyword}</Badge>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowVideoDetail(false)}>Close</Button>
              <Button variant="accent">
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize Video
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
