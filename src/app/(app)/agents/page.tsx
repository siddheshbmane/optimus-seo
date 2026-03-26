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
  Calendar,
  ChevronRight,
  Filter,
  Download,
  History,
  Cpu,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { formatNumber, cn } from "@/lib/utils";
import { useAgentSchedules, useAgentRuns, useAgentActivity } from "@/hooks";
import type { AgentSchedule, AgentRun, AgentType } from "@/lib/agent-scheduler/scheduler";
import {
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

// Agent definitions with UI metadata
interface AgentDefinition {
  id: string;
  agentType: AgentType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const agentDefinitions: AgentDefinition[] = [
  {
    id: "agent-1",
    agentType: "keyword_research",
    name: "Keyword Intelligence Agent",
    description: "Analyzes keywords, predicts trends, and identifies opportunities",
    icon: Target,
    color: "#FD8C73",
  },
  {
    id: "agent-2",
    agentType: "site_auditor",
    name: "Technical SEO Agent",
    description: "Crawls sites, identifies issues, and generates fix code",
    icon: Code,
    color: "#6366F1",
  },
  {
    id: "agent-3",
    agentType: "content_optimizer",
    name: "Content Intelligence Agent",
    description: "Generates briefs, analyzes competitors, and optimizes content",
    icon: FileText,
    color: "#10B981",
  },
  {
    id: "agent-4",
    agentType: "backlink_monitor",
    name: "Link Building Agent",
    description: "Finds opportunities, analyzes backlinks, and suggests outreach",
    icon: Link2,
    color: "#F59E0B",
  },
  {
    id: "agent-5",
    agentType: "competitor_analyzer",
    name: "Competitive Intel Agent",
    description: "Monitors competitors, tracks changes, and identifies gaps",
    icon: Eye,
    color: "#8B5CF6",
  },
  {
    id: "agent-6",
    agentType: "report_generator",
    name: "Report Generator Agent",
    description: "Generates comprehensive SEO reports and performance summaries",
    icon: Brain,
    color: "#EC4899",
  },
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
  const [showRunResult, setShowRunResult] = React.useState(false);
  const [selectedAgent, setSelectedAgent] = React.useState<AgentDefinition | null>(null);
  const [selectedRun, setSelectedRun] = React.useState<AgentRun | null>(null);
  const [executingAgents, setExecutingAgents] = React.useState<Set<string>>(new Set());

  // New automation form state
  const [newAutoName, setNewAutoName] = React.useState("");
  const [newAutoAgent, setNewAutoAgent] = React.useState<AgentType>("keyword_research");
  const [newAutoFrequency, setNewAutoFrequency] = React.useState("daily");

  // Hooks for real API data
  const {
    schedules,
    isLoading: schedulesLoading,
    refetch: refetchSchedules,
    toggleSchedule,
    executeSchedule,
    createSchedule,
  } = useAgentSchedules();

  const {
    runs,
    isLoading: runsLoading,
    refetch: refetchRuns,
  } = useAgentRuns();

  const {
    activities,
    refetch: refetchActivities,
  } = useAgentActivity();

  const isLoading = schedulesLoading || runsLoading;

  // Computed stats
  const completedRuns = runs.filter(r => r.status === "completed").length;
  const failedRuns = runs.filter(r => r.status === "failed").length;
  const successRate = runs.length > 0 ? ((completedRuns / runs.length) * 100) : 100;
  const activeSchedules = schedules.filter(s => s.enabled).length;

  // Get schedule for an agent type
  const getScheduleForAgent = (agentType: AgentType): AgentSchedule | undefined => {
    return schedules.find(s => s.agentType === agentType);
  };

  // Handle running an agent
  const handleExecuteAgent = async (agentDef: AgentDefinition) => {
    let schedule = getScheduleForAgent(agentDef.agentType);

    // If no schedule exists, create one first
    if (!schedule) {
      const created = await createSchedule({
        name: `${agentDef.name} - On Demand`,
        agentType: agentDef.agentType,
        frequency: "daily",
        config: {},
      });
      if (!created) return;
      schedule = created;
    }

    setExecutingAgents(prev => new Set(prev).add(agentDef.agentType));

    const run = await executeSchedule(schedule.id);

    setExecutingAgents(prev => {
      const next = new Set(prev);
      next.delete(agentDef.agentType);
      return next;
    });

    if (run) {
      setSelectedRun(run);
      setShowRunResult(true);
      // Refresh data
      refetchRuns();
      refetchActivities();
    }
  };

  // Handle toggling an agent schedule
  const handleToggleAgent = async (agentDef: AgentDefinition) => {
    const schedule = getScheduleForAgent(agentDef.agentType);
    if (schedule) {
      await toggleSchedule(schedule.id);
    }
  };

  // Handle creating a new automation
  const handleCreateAutomation = async () => {
    if (!newAutoName.trim()) return;

    const result = await createSchedule({
      name: newAutoName,
      agentType: newAutoAgent,
      frequency: newAutoFrequency,
      config: {},
    });

    if (result) {
      setShowCreateAutomation(false);
      setNewAutoName("");
      setNewAutoAgent("keyword_research");
      setNewAutoFrequency("daily");
    }
  };

  // Handle refresh all
  const handleRefresh = async () => {
    await Promise.all([refetchSchedules(), refetchRuns(), refetchActivities()]);
  };

  // Format LLM result for display
  const formatRunResult = (run: AgentRun): string => {
    if (!run.result) return "No results available.";
    const result = run.result as Record<string, unknown>;
    if (result.llmAnalysis) {
      return String(result.llmAnalysis);
    }
    if (result.llmError) {
      return `LLM unavailable (${result.llmError}). Run completed with local analysis.`;
    }
    return JSON.stringify(result, null, 2);
  };

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
          label="Active Schedules"
          value={`${activeSchedules}/${schedules.length}`}
          icon={<Bot className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Total Runs"
          value={formatNumber(runs.length)}
          trend={18.5}
          trendLabel="this week"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Active Automations"
          value={activeSchedules}
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

      {/* Agent Status Cards */}
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
            {agentDefinitions.slice(0, 6).map((agent) => {
              const Icon = agent.icon;
              const schedule = getScheduleForAgent(agent.agentType);
              const isActive = schedule?.enabled ?? false;
              const isExecuting = executingAgents.has(agent.agentType);
              return (
                <div
                  key={agent.id}
                  className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowAgentDetail(true);
                  }}
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
                        <p className="text-xs text-text-muted">
                          {schedule?.lastRunAt
                            ? `Last run: ${new Date(schedule.lastRunAt).toLocaleString()}`
                            : "Never run"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={isActive ? "success" : "warning"}>
                      {isExecuting ? "running" : isActive ? "active" : "paused"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      {schedule ? `${schedule.runCount} runs` : "Not scheduled"}
                    </span>
                    {schedule && schedule.runCount > 0 && (
                      <span className="text-success">
                        {schedule.runCount > 0
                          ? `${(((schedule.runCount - schedule.failureCount) / schedule.runCount) * 100).toFixed(0)}% success`
                          : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Runs */}
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
            {runs.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">
                No agent runs yet. Execute an agent to see activity here.
              </p>
            ) : (
              runs.slice(0, 5).map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated cursor-pointer hover:bg-bg-elevated/80 transition-colors"
                  onClick={() => {
                    setSelectedRun(run);
                    setShowRunResult(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    {run.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : run.status === "failed" ? (
                      <AlertCircle className="h-5 w-5 text-error" />
                    ) : run.status === "running" ? (
                      <Loader2 className="h-5 w-5 text-accent animate-spin" />
                    ) : (
                      <Clock className="h-5 w-5 text-text-muted" />
                    )}
                    <div>
                      <p className="font-medium text-text-primary text-sm">{run.agentType.replace(/_/g, " ")}</p>
                      <p className="text-xs text-text-muted">
                        {run.duration ? `${(run.duration / 1000).toFixed(1)}s` : "In progress..."}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-muted">{new Date(run.startedAt).toLocaleString()}</p>
                    <Badge
                      variant={
                        run.status === "completed" ? "success" :
                        run.status === "failed" ? "error" :
                        run.status === "running" ? "accent" :
                        "neutral"
                      }
                    >
                      {run.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
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
        {agentDefinitions
          .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((agent) => {
            const Icon = agent.icon;
            const schedule = getScheduleForAgent(agent.agentType);
            const isActive = schedule?.enabled ?? false;
            const isExecuting = executingAgents.has(agent.agentType);
            return (
              <Card
                key={agent.id}
                className="cursor-pointer hover:border-accent/50 transition-colors"
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
                    <Badge variant={isActive ? "success" : "warning"}>
                      {isExecuting ? "running" : isActive ? "active" : "paused"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-bg-elevated">
                      <p className="text-xs text-text-muted">Runs</p>
                      <p className="text-lg font-semibold">{schedule?.runCount ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated">
                      <p className="text-xs text-text-muted">Success</p>
                      <p className="text-lg font-semibold text-success">
                        {schedule && schedule.runCount > 0
                          ? `${(((schedule.runCount - schedule.failureCount) / schedule.runCount) * 100).toFixed(0)}%`
                          : "--"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated">
                      <p className="text-xs text-text-muted">Frequency</p>
                      <p className="text-lg font-semibold capitalize">{schedule?.frequency ?? "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">
                      {schedule?.lastRunAt
                        ? `Last: ${new Date(schedule.lastRunAt).toLocaleString()}`
                        : "Never run"}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Run button */}
                      <Button
                        variant="accent"
                        size="sm"
                        disabled={isExecuting}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecuteAgent(agent);
                        }}
                      >
                        {isExecuting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="ml-1">{isExecuting ? "Running" : "Run"}</span>
                      </Button>
                      {/* Toggle button */}
                      {schedule && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAgent(agent);
                          }}
                        >
                          {isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAgent(agent);
                          setShowAgentDetail(true);
                        }}
                      >
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
          {schedules.length === 0 ? (
            <div className="p-8 text-center">
              <Bot className="h-12 w-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No automations yet</p>
              <p className="text-sm text-text-muted mt-1">Create your first automation to get started.</p>
              <Button variant="accent" className="mt-4" onClick={() => setShowCreateAutomation(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Automation
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {schedules
                .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((schedule) => {
                  const isExecuting = executingAgents.has(schedule.agentType);
                  return (
                    <div key={schedule.id} className="p-4 hover:bg-bg-elevated transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-text-primary">{schedule.name}</h3>
                            <Badge variant={schedule.enabled ? "success" : "neutral"}>
                              {schedule.enabled ? "active" : "paused"}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-muted capitalize">
                            {schedule.frequency} - {schedule.agentType.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="accent"
                            size="sm"
                            disabled={isExecuting}
                            onClick={() => {
                              const agentDef = agentDefinitions.find(a => a.agentType === schedule.agentType);
                              if (agentDef) handleExecuteAgent(agentDef);
                            }}
                          >
                            {isExecuting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSchedule(schedule.id)}
                          >
                            {schedule.enabled ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-text-muted" />
                          <span className="text-text-secondary capitalize">{schedule.agentType.replace(/_/g, " ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-text-muted" />
                          <span className="text-text-muted">
                            Last: {schedule.lastRunAt ? new Date(schedule.lastRunAt).toLocaleString() : "Never"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-text-muted" />
                          <span className="text-text-muted">
                            Next: {schedule.enabled && schedule.nextRunAt ? new Date(schedule.nextRunAt).toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-text-muted" />
                          <span className="text-text-muted">{schedule.runCount} runs</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
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
          {runs.length === 0 ? (
            <div className="p-8 text-center">
              <History className="h-12 w-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No activity logs</p>
              <p className="text-sm text-text-muted mt-1">Execute an agent to see logs here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="p-4 hover:bg-bg-elevated transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedRun(run);
                    setShowRunResult(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {run.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : run.status === "failed" ? (
                        <AlertCircle className="h-5 w-5 text-error" />
                      ) : run.status === "running" ? (
                        <Loader2 className="h-5 w-5 text-accent animate-spin" />
                      ) : (
                        <Clock className="h-5 w-5 text-text-muted" />
                      )}
                      <div>
                        <p className="font-medium text-text-primary capitalize">
                          {run.agentType.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-text-muted">
                          {run.logs.length > 0 ? run.logs[run.logs.length - 1] : "No logs"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-secondary">
                        {new Date(run.startedAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-text-muted">
                        Duration: {run.duration ? `${(run.duration / 1000).toFixed(1)}s` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                      {runs.length} agent executions this session
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
    <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-6">
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
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
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
        {selectedAgent && (() => {
          const schedule = getScheduleForAgent(selectedAgent.agentType);
          const isActive = schedule?.enabled ?? false;
          const isExecuting = executingAgents.has(selectedAgent.agentType);
          const agentRuns = runs.filter(r => r.agentType === selectedAgent.agentType);

          return (
            <div className="space-y-6">
              <p className="text-text-secondary">{selectedAgent.description}</p>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-xs text-text-muted">Status</p>
                  <Badge variant={isActive ? "success" : "warning"} className="mt-1">
                    {isActive ? "active" : "paused"}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-xs text-text-muted">Total Runs</p>
                  <p className="text-xl font-bold">{schedule?.runCount ?? 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-xs text-text-muted">Success Rate</p>
                  <p className="text-xl font-bold text-success">
                    {schedule && schedule.runCount > 0
                      ? `${(((schedule.runCount - schedule.failureCount) / schedule.runCount) * 100).toFixed(0)}%`
                      : "--"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-xs text-text-muted">Frequency</p>
                  <p className="text-xl font-bold capitalize">{schedule?.frequency ?? "N/A"}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-bg-elevated">
                <p className="text-sm text-text-muted mb-1">Last Run</p>
                <p className="font-medium">
                  {schedule?.lastRunAt
                    ? new Date(schedule.lastRunAt).toLocaleString()
                    : "Never executed"}
                </p>
              </div>

              {/* Recent runs for this agent */}
              {agentRuns.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-text-primary mb-2">Recent Runs</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {agentRuns.slice(0, 5).map((run) => (
                      <div
                        key={run.id}
                        className="flex items-center justify-between p-2 rounded border border-border cursor-pointer hover:bg-bg-elevated"
                        onClick={() => {
                          setSelectedRun(run);
                          setShowRunResult(true);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {run.status === "completed" ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : run.status === "failed" ? (
                            <AlertCircle className="h-4 w-4 text-error" />
                          ) : (
                            <Clock className="h-4 w-4 text-text-muted" />
                          )}
                          <span className="text-sm">{new Date(run.startedAt).toLocaleString()}</span>
                        </div>
                        <Badge
                          variant={
                            run.status === "completed" ? "success" :
                            run.status === "failed" ? "error" :
                            "neutral"
                          }
                        >
                          {run.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ModalFooter>
                <Button variant="secondary" onClick={() => setShowAgentDetail(false)}>Close</Button>
                {schedule && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleToggleAgent(selectedAgent);
                    }}
                  >
                    {isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Enable
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="accent"
                  disabled={isExecuting}
                  onClick={() => handleExecuteAgent(selectedAgent)}
                >
                  {isExecuting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isExecuting ? "Running..." : "Run Now"}
                </Button>
              </ModalFooter>
            </div>
          );
        })()}
      </Modal>

      {/* Run Result Modal */}
      <Modal
        isOpen={showRunResult}
        onClose={() => {
          setShowRunResult(false);
          setSelectedRun(null);
        }}
        title={selectedRun ? `${selectedRun.agentType.replace(/_/g, " ")} - Execution Result` : "Execution Result"}
        size="lg"
      >
        {selectedRun && (
          <div className="space-y-4">
            {/* Status Banner */}
            <div className={cn(
              "p-3 rounded-lg flex items-center gap-3",
              selectedRun.status === "completed" ? "bg-success-bg" :
              selectedRun.status === "failed" ? "bg-error-bg" :
              "bg-bg-elevated"
            )}>
              {selectedRun.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : selectedRun.status === "failed" ? (
                <AlertCircle className="h-5 w-5 text-error" />
              ) : (
                <Loader2 className="h-5 w-5 text-accent animate-spin" />
              )}
              <div>
                <p className="font-medium capitalize">
                  {selectedRun.status === "completed" ? "Analysis Complete" :
                   selectedRun.status === "failed" ? "Execution Failed" :
                   "Running..."}
                </p>
                <p className="text-xs text-text-muted">
                  Duration: {selectedRun.duration ? `${(selectedRun.duration / 1000).toFixed(1)}s` : "In progress"}
                </p>
              </div>
            </div>

            {/* LLM/Error indicator */}
            {selectedRun.result && (
              <div className="flex items-center gap-2">
                <Badge variant={
                  (selectedRun.result as Record<string, unknown>).usedLLM ? "accent" : "warning"
                }>
                  {(selectedRun.result as Record<string, unknown>).usedLLM ? "LLM Analysis" : "Fallback Mode"}
                </Badge>
                <Badge variant="info">
                  {String((selectedRun.result as Record<string, unknown>).action || selectedRun.agentType)}
                </Badge>
              </div>
            )}

            {/* Result content */}
            <div className="max-h-[400px] overflow-y-auto">
              <div className="p-4 rounded-lg bg-bg-elevated">
                <pre className="text-sm text-text-primary whitespace-pre-wrap break-words font-sans leading-relaxed">
                  {formatRunResult(selectedRun)}
                </pre>
              </div>
            </div>

            {/* Execution logs */}
            {selectedRun.logs.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text-primary mb-2">Execution Logs</p>
                <div className="p-3 rounded-lg bg-bg-elevated max-h-32 overflow-y-auto">
                  {selectedRun.logs.map((log, i) => (
                    <p key={i} className="text-xs text-text-muted font-mono">{log}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Error details */}
            {selectedRun.error && (
              <div className="p-3 rounded-lg bg-error-bg">
                <p className="text-sm font-medium text-error mb-1">Error</p>
                <p className="text-sm text-text-primary">{selectedRun.error}</p>
              </div>
            )}

            <ModalFooter>
              <Button variant="secondary" onClick={() => { setShowRunResult(false); setSelectedRun(null); }}>
                Close
              </Button>
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
            <Input
              placeholder="e.g., Daily Rank Check"
              value={newAutoName}
              onChange={(e) => setNewAutoName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Select Agent</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary"
              value={newAutoAgent}
              onChange={(e) => setNewAutoAgent(e.target.value as AgentType)}
            >
              {agentDefinitions.map((agent) => (
                <option key={agent.id} value={agent.agentType}>{agent.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Frequency</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary"
              value={newAutoFrequency}
              onChange={(e) => setNewAutoFrequency(e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowCreateAutomation(false)}>Cancel</Button>
            <Button
              variant="accent"
              disabled={!newAutoName.trim()}
              onClick={handleCreateAutomation}
            >
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
            {agentDefinitions.map((agent) => {
              const Icon = agent.icon;
              const schedule = getScheduleForAgent(agent.agentType);
              const isActive = schedule?.enabled ?? false;
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
                    checked={isActive}
                    onChange={() => handleToggleAgent(agent)}
                    className="rounded border-border"
                  />
                </div>
              );
            })}
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAgentConfig(false)}>Close</Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
