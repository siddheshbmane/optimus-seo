"use client";

import * as React from "react";
import {
  Bot,
  PlayCircle,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Settings,
  TrendingUp,
  Zap,
  PenTool,
  Link2,
  Code,
  FileCheck,
  Search,
  Target,
  Users,
  FileText,
  X,
  Save,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  status: "idle" | "running" | "paused";
  tasksCompleted: number;
  lastRun: string;
  avgDuration: string;
  currentTask?: string;
  progress?: number;
  settings: {
    enabled: boolean;
    autoRun: boolean;
    frequency: string;
    maxTasks: number;
    priority: "low" | "medium" | "high";
  };
}

const initialAgents: Agent[] = [
  {
    id: "site-auditor",
    name: "Site Auditor",
    description: "Crawls and analyzes websites for technical SEO issues",
    icon: Search,
    category: "Sales",
    status: "idle",
    tasksCompleted: 156,
    lastRun: "2 hours ago",
    avgDuration: "5 min",
    settings: {
      enabled: true,
      autoRun: true,
      frequency: "daily",
      maxTasks: 10,
      priority: "high",
    },
  },
  {
    id: "keyword-researcher",
    name: "Keyword Researcher",
    description: "Discovers and analyzes keyword opportunities",
    icon: Target,
    category: "Sales",
    status: "running",
    tasksCompleted: 89,
    lastRun: "Running now",
    avgDuration: "3 min",
    currentTask: "Analyzing 'seo services' cluster",
    progress: 45,
    settings: {
      enabled: true,
      autoRun: true,
      frequency: "weekly",
      maxTasks: 50,
      priority: "high",
    },
  },
  {
    id: "competitor-analyzer",
    name: "Competitor Analyzer",
    description: "Tracks and analyzes competitor SEO strategies",
    icon: Users,
    category: "Sales",
    status: "idle",
    tasksCompleted: 45,
    lastRun: "1 day ago",
    avgDuration: "8 min",
    settings: {
      enabled: true,
      autoRun: false,
      frequency: "weekly",
      maxTasks: 5,
      priority: "medium",
    },
  },
  {
    id: "content-writer",
    name: "AI Content Writer",
    description: "Generates SEO-optimized content",
    icon: PenTool,
    category: "Execution",
    status: "running",
    tasksCompleted: 234,
    lastRun: "Running now",
    avgDuration: "15 min",
    currentTask: "Writing 'Technical SEO Guide'",
    progress: 65,
    settings: {
      enabled: true,
      autoRun: true,
      frequency: "on-demand",
      maxTasks: 20,
      priority: "high",
    },
  },
  {
    id: "link-builder",
    name: "Link Builder",
    description: "Automated outreach and link acquisition",
    icon: Link2,
    category: "Execution",
    status: "running",
    tasksCompleted: 78,
    lastRun: "Running now",
    avgDuration: "Ongoing",
    currentTask: "Outreach to TechCrunch",
    progress: 30,
    settings: {
      enabled: true,
      autoRun: true,
      frequency: "daily",
      maxTasks: 100,
      priority: "medium",
    },
  },
  {
    id: "technical-fixer",
    name: "Technical Fixer",
    description: "Auto-fixes technical SEO issues",
    icon: Code,
    category: "Execution",
    status: "idle",
    tasksCompleted: 567,
    lastRun: "3 hours ago",
    avgDuration: "2 min",
    settings: {
      enabled: true,
      autoRun: true,
      frequency: "hourly",
      maxTasks: 50,
      priority: "high",
    },
  },
  {
    id: "content-optimizer",
    name: "Content Optimizer",
    description: "Optimizes existing content for better rankings",
    icon: FileCheck,
    category: "Execution",
    status: "idle",
    tasksCompleted: 123,
    lastRun: "5 hours ago",
    avgDuration: "4 min",
    settings: {
      enabled: true,
      autoRun: false,
      frequency: "weekly",
      maxTasks: 30,
      priority: "medium",
    },
  },
  {
    id: "report-generator",
    name: "Report Generator",
    description: "Creates automated SEO reports",
    icon: FileText,
    category: "Reports",
    status: "idle",
    tasksCompleted: 89,
    lastRun: "1 day ago",
    avgDuration: "10 min",
    settings: {
      enabled: true,
      autoRun: true,
      frequency: "weekly",
      maxTasks: 10,
      priority: "low",
    },
  },
];

const recentActivity = [
  {
    id: 1,
    agent: "AI Content Writer",
    action: "Completed article",
    details: "SEO Trends 2026 - 2,500 words",
    time: "10 min ago",
    status: "success",
  },
  {
    id: 2,
    agent: "Link Builder",
    action: "Sent outreach email",
    details: "TechCrunch guest post pitch",
    time: "25 min ago",
    status: "pending",
  },
  {
    id: 3,
    agent: "Site Auditor",
    action: "Completed audit",
    details: "Found 23 issues on acmecorp.com",
    time: "2 hours ago",
    status: "warning",
  },
  {
    id: 4,
    agent: "Technical Fixer",
    action: "Fixed issues",
    details: "Resolved 15 broken links",
    time: "3 hours ago",
    status: "success",
  },
  {
    id: 5,
    agent: "Keyword Researcher",
    action: "Discovered keywords",
    details: "Added 156 new opportunities",
    time: "5 hours ago",
    status: "success",
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = React.useState(initialAgents);
  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null);
  const [showConfigModal, setShowConfigModal] = React.useState(false);
  const [showGlobalConfig, setShowGlobalConfig] = React.useState(false);
  const [agentSettings, setAgentSettings] = React.useState<Agent["settings"] | null>(null);

  const runningAgents = agents.filter((a) => a.status === "running").length;
  const totalCompleted = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);

  const openAgentConfig = (agent: Agent) => {
    setSelectedAgent(agent);
    setAgentSettings({ ...agent.settings });
    setShowConfigModal(true);
  };

  const saveAgentConfig = () => {
    if (selectedAgent && agentSettings) {
      setAgents(agents.map(a => 
        a.id === selectedAgent.id 
          ? { ...a, settings: agentSettings }
          : a
      ));
      setShowConfigModal(false);
      setSelectedAgent(null);
      setAgentSettings(null);
    }
  };

  const toggleAgentStatus = (agentId: string) => {
    setAgents(agents.map(a => {
      if (a.id === agentId) {
        if (a.status === "running") {
          return { ...a, status: "paused" as const, currentTask: undefined, progress: undefined };
        } else {
          return { ...a, status: "running" as const, lastRun: "Running now" };
        }
      }
      return a;
    }));
  };

  const runAllAgents = () => {
    setAgents(agents.map(a => ({
      ...a,
      status: a.settings.enabled ? "running" as const : a.status,
      lastRun: a.settings.enabled ? "Running now" : a.lastRun,
    })));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Agents</h1>
          <p className="text-text-secondary">
            Your AI SEO team, working on autopilot
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowGlobalConfig(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="accent" onClick={runAllAgents}>
            <Zap className="h-4 w-4 mr-2" />
            Run All Agents
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Agents"
          value={agents.length}
          trendLabel="available agents"
          icon={<Bot className="h-5 w-5" />}
        />
        <StatCard
          label="Currently Running"
          value={runningAgents}
          trendLabel="active now"
          icon={<PlayCircle className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Tasks Completed"
          value={totalCompleted.toLocaleString()}
          trend={24}
          trendLabel="this week"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Success Rate"
          value="98.5%"
          trend={0.5}
          trendLabel="vs last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Agents Grid */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          All Agents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={cn(
                "transition-colors",
                agent.status === "running" && "border-accent/50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      agent.status === "running"
                        ? "bg-accent/10"
                        : "bg-bg-elevated"
                    )}
                  >
                    <agent.icon
                      className={cn(
                        "h-5 w-5",
                        agent.status === "running"
                          ? "text-accent"
                          : "text-text-muted"
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" className="text-xs">
                      {agent.category}
                    </Badge>
                    {agent.status === "running" && (
                      <span className="flex items-center gap-1 text-xs text-success">
                        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-medium text-text-primary mb-1">
                  {agent.name}
                </h3>
                <p className="text-xs text-text-muted mb-3 line-clamp-2">
                  {agent.description}
                </p>

                {agent.status === "running" && agent.currentTask && (
                  <div className="mb-3 p-2 bg-bg-elevated rounded-lg">
                    <p className="text-xs text-text-secondary truncate mb-1">
                      {agent.currentTask}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${agent.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-text-primary">
                        {agent.progress}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                  <span>{agent.tasksCompleted} completed</span>
                  <span>{agent.lastRun}</span>
                </div>

                <div className="flex items-center gap-2">
                  {agent.status === "running" ? (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => toggleAgentStatus(agent.id)}
                    >
                      <Pause className="h-3.5 w-3.5 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      variant="accent" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => toggleAgentStatus(agent.id)}
                    >
                      <PlayCircle className="h-3.5 w-3.5 mr-1" />
                      Run
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openAgentConfig(agent)}
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Recent Activity</CardTitle>
            <span className="flex items-center gap-1 text-xs text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      activity.status === "success" && "bg-success/10",
                      activity.status === "warning" && "bg-warning/10",
                      activity.status === "pending" && "bg-info/10"
                    )}
                  >
                    {activity.status === "success" && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {activity.status === "warning" && (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    )}
                    {activity.status === "pending" && (
                      <Clock className="h-4 w-4 text-info" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-text-primary">
                        {activity.agent}
                      </p>
                      <span className="text-text-muted">•</span>
                      <span className="text-sm text-text-secondary">
                        {activity.action}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{activity.details}</p>
                  </div>
                </div>
                <span className="text-xs text-text-muted">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Config Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedAgent(null);
          setAgentSettings(null);
        }}
        title={`${selectedAgent?.name} Settings`}
        description="Configure agent behavior and automation"
        size="md"
      >
        {agentSettings && (
          <div className="space-y-4">
            {/* Enabled Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
              <div>
                <p className="font-medium text-text-primary">Enabled</p>
                <p className="text-sm text-text-muted">Allow this agent to run</p>
              </div>
              <button
                onClick={() => setAgentSettings({ ...agentSettings, enabled: !agentSettings.enabled })}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  agentSettings.enabled ? "bg-accent" : "bg-border"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
                    agentSettings.enabled && "translate-x-5"
                  )}
                />
              </button>
            </div>

            {/* Auto Run Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
              <div>
                <p className="font-medium text-text-primary">Auto Run</p>
                <p className="text-sm text-text-muted">Run automatically on schedule</p>
              </div>
              <button
                onClick={() => setAgentSettings({ ...agentSettings, autoRun: !agentSettings.autoRun })}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  agentSettings.autoRun ? "bg-accent" : "bg-border"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform",
                    agentSettings.autoRun && "translate-x-5"
                  )}
                />
              </button>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Run Frequency
              </label>
              <select
                value={agentSettings.frequency}
                onChange={(e) => setAgentSettings({ ...agentSettings, frequency: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="on-demand">On Demand</option>
              </select>
            </div>

            {/* Max Tasks */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Max Tasks per Run
              </label>
              <Input
                type="number"
                value={agentSettings.maxTasks}
                onChange={(e) => setAgentSettings({ ...agentSettings, maxTasks: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setAgentSettings({ ...agentSettings, priority })}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize",
                      agentSettings.priority === priority
                        ? priority === "high"
                          ? "bg-error/10 text-error border border-error"
                          : priority === "medium"
                          ? "bg-warning/10 text-warning border border-warning"
                          : "bg-info/10 text-info border border-info"
                        : "bg-bg-elevated text-text-secondary hover:bg-bg-elevated/80"
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={saveAgentConfig}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Global Config Modal */}
      <Modal
        isOpen={showGlobalConfig}
        onClose={() => setShowGlobalConfig(false)}
        title="Global Agent Configuration"
        description="Configure settings for all agents"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
            <div>
              <p className="font-medium text-text-primary">Enable All Agents</p>
              <p className="text-sm text-text-muted">Allow all agents to run</p>
            </div>
            <button
              className="relative w-11 h-6 rounded-full transition-colors bg-accent"
            >
              <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white translate-x-5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
            <div>
              <p className="font-medium text-text-primary">Auto-scheduling</p>
              <p className="text-sm text-text-muted">Run agents on their schedules</p>
            </div>
            <button
              className="relative w-11 h-6 rounded-full transition-colors bg-accent"
            >
              <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white translate-x-5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
            <div>
              <p className="font-medium text-text-primary">Notifications</p>
              <p className="text-sm text-text-muted">Get notified on task completion</p>
            </div>
            <button
              className="relative w-11 h-6 rounded-full transition-colors bg-accent"
            >
              <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white translate-x-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Default Priority
            </label>
            <select
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Max Concurrent Agents
            </label>
            <Input type="number" defaultValue={3} />
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowGlobalConfig(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowGlobalConfig(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
