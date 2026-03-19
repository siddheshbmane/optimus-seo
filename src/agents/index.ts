// Agent Registry - Central hub for all SEO agents
// Phase 10: AI Agent Orchestration

// Import all agents
import { TechnicalSEOAgent, technicalSEOAgent } from './technical-seo-agent';
import { CompetitiveIntelAgent, competitiveIntelAgent } from './competitive-intel-agent';
import { ContentIntelAgent, contentIntelAgent } from './content-intel-agent';
import { ReviewResponseAgent, reviewResponseAgent } from './review-response-agent';
import { YouTubeSEOAgent, youtubeSEOAgent } from './youtube-seo-agent';
import { EcommerceSEOAgent, ecommerceSEOAgent } from './ecommerce-seo-agent';

// Agent Status Types
export type AgentStatus = 'active' | 'paused' | 'error' | 'initializing';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'content' | 'competitive' | 'social' | 'ecommerce' | 'video';
  status: AgentStatus;
  enabled: boolean;
  priority: number;
  maxConcurrentTasks: number;
  timeout: number; // in seconds
  retryAttempts: number;
  lastRun?: Date;
  tasksCompleted: number;
  successRate: number;
  avgResponseTime: number; // in seconds
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // in milliseconds
}

export interface AgentEvent {
  id: string;
  agentId: string;
  type: 'task_started' | 'task_completed' | 'task_failed' | 'agent_started' | 'agent_stopped' | 'error';
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  agentId: string;
  trigger: {
    type: 'schedule' | 'event' | 'manual';
    schedule?: string; // cron expression
    event?: string;
  };
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  runsCompleted: number;
}

// Agent Registry Class
export class AgentRegistry {
  private agents: Map<string, AgentConfig> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private events: AgentEvent[] = [];
  private automations: Map<string, AutomationRule> = new Map();

  constructor() {
    this.initializeAgents();
  }

  /**
   * Initialize all available agents
   */
  private initializeAgents(): void {
    const agentConfigs: AgentConfig[] = [
      {
        id: 'technical-seo',
        name: 'Technical SEO Agent',
        description: 'Crawls sites, identifies issues, and generates fix code',
        category: 'technical',
        status: 'active',
        enabled: true,
        priority: 1,
        maxConcurrentTasks: 5,
        timeout: 60,
        retryAttempts: 3,
        tasksCompleted: 856,
        successRate: 97.2,
        avgResponseTime: 4.5,
      },
      {
        id: 'competitive-intel',
        name: 'Competitive Intelligence Agent',
        description: 'Monitors competitors, tracks changes, and identifies gaps',
        category: 'competitive',
        status: 'active',
        enabled: true,
        priority: 2,
        maxConcurrentTasks: 3,
        timeout: 45,
        retryAttempts: 3,
        tasksCompleted: 534,
        successRate: 97.8,
        avgResponseTime: 3.1,
      },
      {
        id: 'content-intel',
        name: 'Content Intelligence Agent',
        description: 'Generates briefs, analyzes competitors, and optimizes content',
        category: 'content',
        status: 'active',
        enabled: true,
        priority: 2,
        maxConcurrentTasks: 4,
        timeout: 90,
        retryAttempts: 2,
        tasksCompleted: 623,
        successRate: 96.8,
        avgResponseTime: 3.8,
      },
      {
        id: 'review-response',
        name: 'Review Response Agent',
        description: 'Monitors reviews and generates AI-powered responses',
        category: 'social',
        status: 'active',
        enabled: true,
        priority: 3,
        maxConcurrentTasks: 10,
        timeout: 30,
        retryAttempts: 2,
        tasksCompleted: 412,
        successRate: 98.5,
        avgResponseTime: 2.1,
      },
      {
        id: 'youtube-seo',
        name: 'YouTube SEO Agent',
        description: 'Optimizes YouTube channels and video rankings',
        category: 'video',
        status: 'active',
        enabled: true,
        priority: 3,
        maxConcurrentTasks: 3,
        timeout: 60,
        retryAttempts: 3,
        tasksCompleted: 289,
        successRate: 95.5,
        avgResponseTime: 4.2,
      },
      {
        id: 'ecommerce-seo',
        name: 'E-Commerce SEO Agent',
        description: 'Optimizes product pages and generates schema markup',
        category: 'ecommerce',
        status: 'active',
        enabled: true,
        priority: 2,
        maxConcurrentTasks: 5,
        timeout: 45,
        retryAttempts: 3,
        tasksCompleted: 445,
        successRate: 96.2,
        avgResponseTime: 3.5,
      },
    ];

    agentConfigs.forEach(config => {
      this.agents.set(config.id, config);
    });
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): AgentConfig | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get agents by category
   */
  getAgentsByCategory(category: AgentConfig['category']): AgentConfig[] {
    return this.getAllAgents().filter(agent => agent.category === category);
  }

  /**
   * Get active agents
   */
  getActiveAgents(): AgentConfig[] {
    return this.getAllAgents().filter(agent => agent.status === 'active' && agent.enabled);
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId: string, status: AgentStatus): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      this.logEvent(agentId, status === 'active' ? 'agent_started' : 'agent_stopped', `Agent ${status}`);
      return true;
    }
    return false;
  }

  /**
   * Enable/disable agent
   */
  setAgentEnabled(agentId: string, enabled: boolean): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Create a new task
   */
  createTask(agentId: string, type: string, input: Record<string, unknown>, priority: AgentTask['priority'] = 'medium'): AgentTask {
    const task: AgentTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      type,
      status: 'pending',
      priority,
      input,
      createdAt: new Date(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Start a task
   */
  startTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'pending') {
      task.status = 'running';
      task.startedAt = new Date();
      this.logEvent(task.agentId, 'task_started', `Task ${taskId} started`);
      return true;
    }
    return false;
  }

  /**
   * Complete a task
   */
  completeTask(taskId: string, output: Record<string, unknown>): boolean {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'running') {
      task.status = 'completed';
      task.output = output;
      task.completedAt = new Date();
      task.duration = task.completedAt.getTime() - (task.startedAt?.getTime() || 0);
      
      // Update agent stats
      const agent = this.agents.get(task.agentId);
      if (agent) {
        agent.tasksCompleted++;
        agent.lastRun = new Date();
      }
      
      this.logEvent(task.agentId, 'task_completed', `Task ${taskId} completed in ${task.duration}ms`);
      return true;
    }
    return false;
  }

  /**
   * Fail a task
   */
  failTask(taskId: string, error: string): boolean {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'running') {
      task.status = 'failed';
      task.error = error;
      task.completedAt = new Date();
      task.duration = task.completedAt.getTime() - (task.startedAt?.getTime() || 0);
      
      this.logEvent(task.agentId, 'task_failed', `Task ${taskId} failed: ${error}`);
      return true;
    }
    return false;
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get tasks by agent
   */
  getTasksByAgent(agentId: string): AgentTask[] {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }

  /**
   * Get recent tasks
   */
  getRecentTasks(limit: number = 10): AgentTask[] {
    return Array.from(this.tasks.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Log an event
   */
  private logEvent(agentId: string, type: AgentEvent['type'], message: string, data?: Record<string, unknown>): void {
    const event: AgentEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      type,
      message,
      data,
      timestamp: new Date(),
    };
    this.events.push(event);
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 50): AgentEvent[] {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Get events by agent
   */
  getEventsByAgent(agentId: string, limit: number = 20): AgentEvent[] {
    return this.events
      .filter(event => event.agentId === agentId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Create automation rule
   */
  createAutomation(rule: Omit<AutomationRule, 'id' | 'runsCompleted'>): AutomationRule {
    const automation: AutomationRule = {
      ...rule,
      id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      runsCompleted: 0,
    };
    this.automations.set(automation.id, automation);
    return automation;
  }

  /**
   * Get all automations
   */
  getAllAutomations(): AutomationRule[] {
    return Array.from(this.automations.values());
  }

  /**
   * Get automations by agent
   */
  getAutomationsByAgent(agentId: string): AutomationRule[] {
    return this.getAllAutomations().filter(auto => auto.agentId === agentId);
  }

  /**
   * Enable/disable automation
   */
  setAutomationEnabled(automationId: string, enabled: boolean): boolean {
    const automation = this.automations.get(automationId);
    if (automation) {
      automation.enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Get agent statistics
   */
  getAgentStats(): {
    totalAgents: number;
    activeAgents: number;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgSuccessRate: number;
    totalAutomations: number;
    activeAutomations: number;
  } {
    const agents = this.getAllAgents();
    const tasks = Array.from(this.tasks.values());
    const automations = this.getAllAutomations();

    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active' && a.enabled).length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      failedTasks: tasks.filter(t => t.status === 'failed').length,
      avgSuccessRate: agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length,
      totalAutomations: automations.length,
      activeAutomations: automations.filter(a => a.enabled).length,
    };
  }

  /**
   * Get agent instance by ID
   */
  getAgentInstance(agentId: string): TechnicalSEOAgent | CompetitiveIntelAgent | ContentIntelAgent | ReviewResponseAgent | YouTubeSEOAgent | EcommerceSEOAgent | null {
    switch (agentId) {
      case 'technical-seo':
        return technicalSEOAgent;
      case 'competitive-intel':
        return competitiveIntelAgent;
      case 'content-intel':
        return contentIntelAgent;
      case 'review-response':
        return reviewResponseAgent;
      case 'youtube-seo':
        return youtubeSEOAgent;
      case 'ecommerce-seo':
        return ecommerceSEOAgent;
      default:
        return null;
    }
  }
}

// Export singleton instance
export const agentRegistry = new AgentRegistry();

// Re-export all agents
export { technicalSEOAgent, TechnicalSEOAgent } from './technical-seo-agent';
export { competitiveIntelAgent, CompetitiveIntelAgent } from './competitive-intel-agent';
export { contentIntelAgent, ContentIntelAgent } from './content-intel-agent';
export { reviewResponseAgent, ReviewResponseAgent } from './review-response-agent';
export { youtubeSEOAgent, YouTubeSEOAgent } from './youtube-seo-agent';
export { ecommerceSEOAgent, EcommerceSEOAgent } from './ecommerce-seo-agent';

// Export convenience functions
export const getAllAgents = () => agentRegistry.getAllAgents();
export const getAgent = (id: string) => agentRegistry.getAgent(id);
export const getActiveAgents = () => agentRegistry.getActiveAgents();
export const getAgentStats = () => agentRegistry.getAgentStats();
export const createTask = (agentId: string, type: string, input: Record<string, unknown>) => agentRegistry.createTask(agentId, type, input);
export const getRecentTasks = (limit?: number) => agentRegistry.getRecentTasks(limit);
export const getRecentEvents = (limit?: number) => agentRegistry.getRecentEvents(limit);
