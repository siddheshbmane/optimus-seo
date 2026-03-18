"use client";

import * as React from "react";
import {
  Bot,
  Play,
  Pause,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  FileText,
  Link2,
  Search,
  BarChart2,
  TrendingUp,
  RefreshCw,
  Plus,
  Eye,
  Code,
  Brain,
  Sparkles,
  Calendar,
  ArrowRight,
  ChevronRight,
  Filter,
  Download,
  History,
  Cpu,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
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

type TabType = "overview" | "agents" | "automations" | "logs" | "settings";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 className="h-4 w-4" /> },
  { id: "agents", label: "AI Agents", icon: <Bot className="h-4 w-4" /> },
  { id: "automations", label: "Automations", icon: <Zap className="h-4 w-4" /> },
  { id: "logs", label: "Activity Logs", icon: <History className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

// Mock data
const mockAgents = [
  {
    id: "agent-1",
    name: "Keyword Intelligence Agent",
    description: "Analyzes keywords, predicts trends, and identifies opportunities",
    status: "active",
    tasksCompleted: 1247,
    successRate: 98.5,
    avgResponseTime: 2.3,
    lastRun: "2 minutes ago",
    icon: Target,
    color: "#FD8C73",
  },
  {
    id: "agent-2",
    name: "Technical SEO Agent",
    description: "Crawls sites, identifies issues, and generates fix code",
    status: "active",
    tasksCompleted: 856,
    successRate: 97.2,
    avgResponseTime: 4.5,
    lastRun: "5 minutes ago",
    icon: Code,
    color: "#6366F1",
  },
  {
    id: "agent-3",
    name: "Content Intelligence Agent",
    description: "Generates briefs, analyzes competitors, and optimizes content",
    status: "active",
    tasksCompleted: 623,
    successRate: 96.8,
    avgResponseTime: 3.8,
    lastRun: "10 minutes ago",
    icon: FileText,
    color: "#10B981",
  },
  {
    id: "agent-4",
    name: "Link Building Agent",
    description: "Finds opportunities, analyzes backlinks, and suggests outreach",
    status: "paused",
    tasksCompleted: 412,
    successRate: 94.5,
    avgResponseTime: 5.2,
    lastRun: "1 hour ago",
    icon: Link2,
    color: "#F59E0B",
  },
  {
    id: "agent-5",
    name: "Competitive Intel Agent",
    description: "Monitors competitors, tracks changes, and identifies gaps",
    status: "active",
    tasksCompleted: 534,
    successRate: 97.8,
    avgResponseTime: 3.1,
    lastRun: "15 minutes ago",
    icon: Eye,
    color: "#8B5CF6",
  },
  {
    id: "agent-6",
    name: "AI Visibility Agent",
    description: "Tracks LLM mentions, monitors AI search, and optimizes for AI",
    status: "active",
    tasksCompleted: 289,
    successRate: 99.1,
    avgResponseTime: 2.8,
    lastRun: "3 minutes ago",
    icon: Brain,
    color: "#EC4899",
  },
];

const mockAutomations = [
  {
    id: "auto-1",
    name: "Daily Rank Tracking",
    trigger: "Schedule: Every day at 6 AM",
    agent: "Keyword Intelligence Agent",
    status: "active",
    lastRun: "Today, 6:00 AM",
    nextRun: "Tomorrow, 6:00 AM",
    runsCompleted: 156,
  },
  {
    id: "auto-2",
    name: "Weekly Site Audit",
    trigger: "Schedule: Every Monday at 9 AM",
    agent: "Technical SEO Agent",
    status: "active",
    lastRun: "Monday, 9:00 AM",
    nextRun: "Next Monday, 9:00 AM",
    runsCompleted: 24,
  },
  {
    id: "auto-3",
    name: "Competitor Alert",
    trigger: "Event: Competitor ranking change > 5 positions",
    agent: "Competitive Intel Agent",
    status: "active",
    lastRun: "2 hours ago",
    nextRun: "On trigger",
    runsCompleted: 89,
  },
  {
    id: "auto-4",
    name: "Content Brief Generation",
    trigger: "Manual: On new keyword added",
    agent: "Content Intelligence Agent",
    status: "active",
    lastRun: "Yesterday, 3:45 PM",
    nextRun: "On trigger",
    runsCompleted: 45,
  },
  {
    id: "auto-5",
    name: "AI Visibility Check",
    trigger: "Schedule: Every 4 hours",
    agent: "AI Visibility Agent",
    status: "active",
    lastRun: "2 hours ago",
    nextRun: "In 2 hours",
    runsCompleted: 312,
  },
];

const mockActivityLogs = [
  { id: 1, agent: "Keyword Intelligence Agent", action: "Analyzed 350 keywords", status: "success", time: "2 minutes ago", duration: "2.3s" },
  { id: 2, agent: "AI Visibility Agent", action: "Checked LLM mentions for 25 queries", status: "success", time: "3 minutes ago", duration: "4.1s" },
  { id: 3, agent: "Technical SEO Agent", action: "Crawled 156 pages", status: "success", time: "5 minutes ago", duration: "45.2s" },
  { id: 4, agent: "Competitive Intel Agent", action: "Updated competitor data for 5 domains", status: "success", time: "15 minutes ago", duration: "8.7s" },
  { id: 5, agent: "Content Intelligence Agent", action: "Generated content brief for 'AI SEO Tools'", status: "success", time: "25 minutes ago", duration: "12.4s" },
  { id: 6, agent: "Link Building Agent", action: "Found 23 new backlink opportunities", status: "warning", time: "1 hour ago", duration: "15.8s" },
  { id: 7, agent: "Keyword Intelligence Agent", action: "Predicted trends for Q2 2026", status: "success", time: "1 hour ago", duration: "5.6s" },
  { id: 8, agent: "Technical SEO Agent", action: "Generated fix code for 12 issues", status: "success", time: "2 hours ago", duration: "3.2s" },
];

const mockAgentPerformance = [
  { day: "Mon", tasks: 245, success: 240 },
  { day: "Tue", tasks: 312, success: 305 },
  { day: "Wed", tasks: 289, success: 285 },
  { day: "Thu", tasks: 356, success: 348 },
  { day: "Fri", tasks: 298, success: 292 },
  { day: "Sat", tasks: 156, success: 154 },
  { day: "Sun", tasks: 134, success: 132 },
];

const mockTaskDistribution = [
  { name: "Keyword Analysis", value: 35, color: "#FD8C73" },
  { name: "Technical SEO", value: 25, color: "#6366F1" },
  { name: "Content", value: 20, color: "#10B981" },
  { name: "Competitive Intel", value: 12, color: "#8B5CF6" },
  { name: "AI Visibility", value: 8, color: "#EC4899" },
];

export default function AgentsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAgentDetail, setShowAgentDetail] = React.useState(false);
  const [showCreateAutomation, setShowCreateAutomation] = React.useState(false);
  const [showAgentConfig, setShowAgentConfig] = React.useState(false);
  const [selectedAgent, setSelectedAgent] = React.useState<typeof mockAgents[0] | null>(null);

  const totalTasks = mockAgents.reduce((s, a) => s + a.tasksCompleted, 0);
  const avgSuccessRate = mockAgents.reduce((s, a) => s + a.successRate, 0) / mockAgents.length;
  const activeAgents = mockAgents.filter(a => a.status === "active").length;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "agents":
        return renderAgentsTab();
      case "automations":
        return renderAutomationsTab();
      case "logs":
        return renderLogsTab();
      case "settings":
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Agents"
          value={`${activeAgents}/${mockAgents.length}`}
          icon={<Bot className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Tasks Completed"
          value={formatNumber(totalTasks)}
          trend={18.5}
          trendLabel="this week"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Success Rate"
          value={`${avgSuccessRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Active Automations"
          value={mockAutomations.filter(a => a.status === "active").length}
          icon={<Zap className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAgentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tasks" name="Total Tasks" fill="#6B7280" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="success" name="Successful" fill="#FD8C73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockTaskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {mockTaskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agent Status</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("agents")}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAgents.slice(0, 6).map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowAgentDetail(true);
                  }}
                  className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${agent.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: agent.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{agent.name}</p>
                        <p className="text-xs text-text-muted">{agent.lastRun}</p>
                      </div>
                    </div>
                    <Badge variant={agent.status === "active" ? "success" : "warning"}>
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">{formatNumber(agent.tasksCompleted)} tasks</span>
                    <span className="text-success">{agent.successRate}% success</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("logs")}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockActivityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                <div className="flex items-center gap-3">
                  {log.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-warning" />
                  )}
                  <div>
                    <p className="font-medium text-text-primary text-sm">{log.action}</p>
                    <p className="text-xs text-text-muted">{log.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-muted">{log.time}</p>
                  <p className="text-xs text-text-muted">{log.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderAgentsTab = () => (
    <>
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="accent" onClick={() => setShowAgentConfig(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Agents
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAgents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card
              key={agent.id}
              className="cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => {
                setSelectedAgent(agent);
                setShowAgentDetail(true);
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-14 w-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}20` }}
                    >
                      <Icon className="h-7 w-7" style={{ color: agent.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{agent.name}</h3>
                      <p className="text-sm text-text-muted">{agent.description}</p>
                    </div>
                  </div>
                  <Badge variant={agent.status === "active" ? "success" : "warning"}>
                    {agent.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-xs text-text-muted">Tasks</p>
                    <p className="text-lg font-semibold">{formatNumber(agent.tasksCompleted)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-xs text-text-muted">Success</p>
                    <p className="text-lg font-semibold text-success">{agent.successRate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-xs text-text-muted">Avg. Time</p>
                    <p className="text-lg font-semibold">{agent.avgResponseTime}s</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Last run: {agent.lastRun}</span>
                  <div className="flex items-center gap-2">
                    {agent.status === "active" ? (
                      <Button variant="ghost" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );

  const renderAutomationsTab = () => (
    <>
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="accent" onClick={() => setShowCreateAutomation(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockAutomations.map((auto) => (
              <div key={auto.id} className="p-4 hover:bg-bg-elevated transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text-primary">{auto.name}</h3>
                      <Badge variant={auto.status === "active" ? "success" : "neutral"}>
                        {auto.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted">{auto.trigger}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-text-muted" />
                    <span className="text-text-secondary">{auto.agent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">Last: {auto.lastRun}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">Next: {auto.nextRun}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">{auto.runsCompleted} runs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderLogsTab = () => (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockActivityLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-bg-elevated transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {log.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-warning" />
                    )}
                    <div>
                      <p className="font-medium text-text-primary">{log.action}</p>
                      <p className="text-sm text-text-muted">{log.agent}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">{log.time}</p>
                    <p className="text-xs text-text-muted">Duration: {log.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderSettingsTab = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>LLM Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Primary LLM Provider</label>
                <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary">
                  <option>Groq (Llama 3.3 70B) - Free Tier</option>
                  <option>OpenRouter (Llama 3.3 70B)</option>
                  <option>OpenAI (GPT-4o-mini)</option>
                  <option>Anthropic (Claude 3.5 Sonnet)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Fallback Provider</label>
                <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary">
                  <option>OpenRouter (Llama 3.3 70B)</option>
                  <option>Groq (Llama 3.3 70B)</option>
                  <option>OpenAI (GPT-4o-mini)</option>
                </select>
              </div>
              <div className="p-4 rounded-lg bg-bg-elevated">
                <div className="flex items-start gap-3">
                  <Cpu className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary">Current Usage</p>
                    <p className="text-sm text-text-muted mt-1">
                      12,450 / 30,000 requests this month (Groq Free Tier)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Defaults</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Default Response Timeout</label>
                <Input type="number" defaultValue={30} />
                <p className="text-xs text-text-muted mt-1">Seconds before agent times out</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Max Retries</label>
                <Input type="number" defaultValue={3} />
                <p className="text-xs text-text-muted mt-1">Number of retry attempts on failure</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Concurrent Tasks</label>
                <Input type="number" defaultValue={5} />
                <p className="text-xs text-text-muted mt-1">Maximum parallel tasks per agent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Agent failures", description: "Get notified when an agent task fails", enabled: true },
                { label: "Automation completions", description: "Notify when scheduled automations complete", enabled: true },
                { label: "Performance alerts", description: "Alert when success rate drops below 95%", enabled: false },
                { label: "Daily summary", description: "Receive daily agent activity summary", enabled: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-text-primary">{setting.label}</p>
                    <p className="text-sm text-text-muted">{setting.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={setting.enabled}
                    className="rounded border-border"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">DataForSEO API Key</label>
                <Input type="password" defaultValue="••••••••••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Groq API Key</label>
                <Input type="password" defaultValue="••••••••••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">OpenRouter API Key (Optional)</label>
                <Input type="password" placeholder="Enter API key" />
              </div>
              <Button variant="accent" className="w-full">
                Save API Keys
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Bot className="h-7 w-7 text-accent" />
            AI Agent Orchestration
          </h1>
          <p className="text-text-secondary">
            Manage and monitor your autonomous SEO agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button variant="accent" onClick={() => setShowCreateAutomation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Automation
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

      {/* Agent Detail Modal */}
      <Modal
        isOpen={showAgentDetail}
        onClose={() => setShowAgentDetail(false)}
        title={selectedAgent?.name || "Agent Details"}
        size="lg"
      >
        {selectedAgent && (
          <div className="space-y-6">
            <p className="text-text-secondary">{selectedAgent.description}</p>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Status</p>
                <Badge variant={selectedAgent.status === "active" ? "success" : "warning"} className="mt-1">
                  {selectedAgent.status}
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Tasks Completed</p>
                <p className="text-xl font-bold">{formatNumber(selectedAgent.tasksCompleted)}</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Success Rate</p>
                <p className="text-xl font-bold text-success">{selectedAgent.successRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-bg-elevated">
                <p className="text-xs text-text-muted">Avg. Response</p>
                <p className="text-xl font-bold">{selectedAgent.avgResponseTime}s</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-bg-elevated">
              <p className="text-sm text-text-muted mb-1">Last Run</p>
              <p className="font-medium">{selectedAgent.lastRun}</p>
            </div>

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowAgentDetail(false)}>Close</Button>
              <Button variant="ghost">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              {selectedAgent.status === "active" ? (
                <Button variant="accent">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Agent
                </Button>
              ) : (
                <Button variant="accent">
                  <Play className="h-4 w-4 mr-2" />
                  Start Agent
                </Button>
              )}
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Create Automation Modal */}
      <Modal
        isOpen={showCreateAutomation}
        onClose={() => setShowCreateAutomation(false)}
        title="Create Automation"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Automation Name</label>
            <Input placeholder="e.g., Daily Rank Check" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Select Agent</label>
            <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary">
              {mockAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Trigger Type</label>
            <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary">
              <option>Schedule (Cron)</option>
              <option>Event-based</option>
              <option>Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Schedule</label>
            <Input placeholder="e.g., Every day at 6 AM" />
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowCreateAutomation(false)}>Cancel</Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Agent Config Modal */}
      <Modal
        isOpen={showAgentConfig}
        onClose={() => setShowAgentConfig(false)}
        title="Configure Agents"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Enable or disable agents and configure their behavior.
          </p>
          <div className="space-y-3">
            {mockAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: agent.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{agent.name}</p>
                      <p className="text-sm text-text-muted">{agent.description}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={agent.status === "active"}
                    className="rounded border-border"
                  />
                </div>
              );
            })}
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAgentConfig(false)}>Cancel</Button>
            <Button variant="accent">Save Configuration</Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
