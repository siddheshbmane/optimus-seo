/**
 * Agents Hook
 *
 * Fetches agent activity from the agent-scheduler API.
 * Falls back to mock data in development when not authenticated or API unavailable.
 */

import * as React from "react";
import { useSession } from "@/lib/auth/client";
import { mockAgentActivity, type AgentActivity } from "@/data/mock-agents";
import type { AgentSchedule, AgentRun, AgentType } from "@/lib/agent-scheduler/scheduler";

export type { AgentActivity } from "@/data/mock-agents";

interface UseAgentActivityResult {
  activities: AgentActivity[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  runningCount: number;
  completedCount: number;
  failedCount: number;
}

/**
 * Convert AgentRun records from the scheduler API into AgentActivity format
 * for display in the dashboard.
 */
function runsToActivities(runs: AgentRun[], schedules: AgentSchedule[]): AgentActivity[] {
  const scheduleMap = new Map(schedules.map(s => [s.id, s]));

  return runs
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .map((run): AgentActivity => {
      const schedule = scheduleMap.get(run.scheduleId);
      const agentNameMap: Record<AgentType, string> = {
        keyword_research: "Keyword Research",
        rank_tracker: "Rank Tracker",
        backlink_monitor: "Backlink Monitor",
        site_auditor: "Site Auditor",
        competitor_analyzer: "Competitor Analyzer",
        content_optimizer: "Content Optimizer",
        report_generator: "Report Generator",
      };

      // Map scheduler statuses to AgentActivity statuses
      const statusMap: Record<string, AgentActivity["status"]> = {
        pending: "idle",
        running: "running",
        completed: "completed",
        failed: "failed",
        cancelled: "idle",
      };

      const progress = run.status === "completed" ? 100 : run.status === "running" ? 50 : 0;

      let message = "";
      if (run.status === "completed" && run.result) {
        const result = run.result as Record<string, unknown>;
        if (result.llmAnalysis) {
          const analysis = String(result.llmAnalysis);
          message = `Completed: ${analysis.substring(0, 80)}${analysis.length > 80 ? "..." : ""}`;
        } else {
          message = `Completed (${result.usedLLM ? "LLM" : "local"} analysis)`;
        }
      } else if (run.status === "running") {
        message = `Running ${agentNameMap[run.agentType] || run.agentType} analysis...`;
      } else if (run.status === "failed") {
        message = run.error || "Execution failed";
      } else {
        message = "Pending execution";
      }

      return {
        id: run.id,
        agentId: run.agentType,
        agentName: agentNameMap[run.agentType] || run.agentType,
        projectId: schedule?.projectId || "unknown",
        projectName: schedule?.name || "Scheduled Task",
        status: statusMap[run.status] || "idle",
        progress,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        message,
      };
    });
}

/**
 * Hook for fetching agent activity from the scheduler API.
 * Falls back to mock data when API is unavailable.
 */
export function useAgentActivity(): UseAgentActivityResult {
  const { data: session, isPending } = useSession();
  const [activities, setActivities] = React.useState<AgentActivity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchActivities = React.useCallback(async () => {
    if (isPending) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch both runs and schedules in parallel
      const [runsRes, schedulesRes] = await Promise.all([
        fetch("/api/agent-scheduler?type=runs"),
        fetch("/api/agent-scheduler?type=schedules"),
      ]);

      if (!runsRes.ok || !schedulesRes.ok) {
        console.warn("Agent scheduler API returned error, using mock data");
        setActivities(mockAgentActivity);
        return;
      }

      const [runsData, schedulesData] = await Promise.all([
        runsRes.json(),
        schedulesRes.json(),
      ]);

      const runs: AgentRun[] = runsData.data || [];
      const schedules: AgentSchedule[] = schedulesData.data || [];

      if (runs.length === 0) {
        // No runs yet, use mock data
        setActivities(mockAgentActivity);
      } else {
        const converted = runsToActivities(runs, schedules);
        setActivities(converted);
      }
    } catch (err) {
      console.warn("Error fetching agent activity, using mock data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setActivities(mockAgentActivity);
    } finally {
      setIsLoading(false);
    }
  }, [isPending]);

  React.useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const runningCount = activities.filter(a => a.status === "running").length;
  const completedCount = activities.filter(a => a.status === "completed").length;
  const failedCount = activities.filter(a => a.status === "failed").length;

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities,
    runningCount,
    completedCount,
    failedCount,
  };
}

// --- Schedule management hooks ---

interface UseAgentSchedulesResult {
  schedules: AgentSchedule[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleSchedule: (scheduleId: string) => Promise<AgentSchedule | null>;
  executeSchedule: (scheduleId: string) => Promise<AgentRun | null>;
  createSchedule: (config: {
    name: string;
    agentType: AgentType;
    frequency: string;
    config?: Record<string, unknown>;
  }) => Promise<AgentSchedule | null>;
}

/**
 * Hook for managing agent schedules - list, toggle, execute, create.
 */
export function useAgentSchedules(): UseAgentSchedulesResult {
  const [schedules, setSchedules] = React.useState<AgentSchedule[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSchedules = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/agent-scheduler?type=schedules");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSchedules(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schedules");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const toggleSchedule = React.useCallback(async (scheduleId: string): Promise<AgentSchedule | null> => {
    try {
      const res = await fetch("/api/agent-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", scheduleId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        // Update local state
        setSchedules(prev =>
          prev.map(s => (s.id === scheduleId ? data.data : s))
        );
        return data.data;
      }
      return null;
    } catch (err) {
      console.error("Failed to toggle schedule:", err);
      return null;
    }
  }, []);

  const executeSchedule = React.useCallback(async (scheduleId: string): Promise<AgentRun | null> => {
    try {
      const res = await fetch("/api/agent-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "execute", scheduleId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        // Refetch schedules to get updated lastRunAt
        await fetchSchedules();
        return data.data;
      }
      return null;
    } catch (err) {
      console.error("Failed to execute schedule:", err);
      return null;
    }
  }, [fetchSchedules]);

  const createSchedule = React.useCallback(async (config: {
    name: string;
    agentType: AgentType;
    frequency: string;
    config?: Record<string, unknown>;
  }): Promise<AgentSchedule | null> => {
    try {
      const res = await fetch("/api/agent-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          projectId: "project-1",
          organizationId: "org-1",
          createdBy: "user-1",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setSchedules(prev => [...prev, data.data]);
        return data.data;
      }
      return null;
    } catch (err) {
      console.error("Failed to create schedule:", err);
      return null;
    }
  }, []);

  return {
    schedules,
    isLoading,
    error,
    refetch: fetchSchedules,
    toggleSchedule,
    executeSchedule,
    createSchedule,
  };
}

// --- Agent execution result hooks ---

interface UseAgentRunsResult {
  runs: AgentRun[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching agent execution runs.
 */
export function useAgentRuns(scheduleId?: string): UseAgentRunsResult {
  const [runs, setRuns] = React.useState<AgentRun[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRuns = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = scheduleId
        ? `/api/agent-scheduler?type=runs&scheduleId=${scheduleId}`
        : "/api/agent-scheduler?type=runs";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRuns((data.data || []).sort(
        (a: AgentRun, b: AgentRun) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch runs");
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);

  React.useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  return {
    runs,
    isLoading,
    error,
    refetch: fetchRuns,
  };
}
