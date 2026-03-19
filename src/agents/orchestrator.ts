// Agent Orchestrator
// Coordinates multiple agents for complex SEO workflows

import { 
  agentRegistry, 
  AgentConfig, 
  AgentTask, 
  AgentEvent,
  AutomationRule 
} from './index';

// Workflow Types
export interface WorkflowStep {
  id: string;
  agentId: string;
  taskType: string;
  input: Record<string, unknown> | ((previousResults: Record<string, unknown>) => Record<string, unknown>);
  dependsOn?: string[]; // IDs of steps that must complete first
  condition?: (previousResults: Record<string, unknown>) => boolean;
  onSuccess?: (result: Record<string, unknown>) => void;
  onFailure?: (error: string) => void;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  results: Record<string, unknown>;
  errors: string[];
}

export interface OrchestratorConfig {
  maxConcurrentWorkflows: number;
  maxConcurrentTasks: number;
  defaultTimeout: number;
  retryOnFailure: boolean;
  maxRetries: number;
}

// Predefined Workflow Templates
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'audit' | 'optimization' | 'monitoring' | 'reporting';
  steps: Omit<WorkflowStep, 'id'>[];
}

// Agent Orchestrator Implementation
export class AgentOrchestrator {
  private config: OrchestratorConfig;
  private workflows: Map<string, Workflow> = new Map();
  private runningWorkflows: Set<string> = new Set();

  constructor(config?: Partial<OrchestratorConfig>) {
    this.config = {
      maxConcurrentWorkflows: 3,
      maxConcurrentTasks: 10,
      defaultTimeout: 300, // 5 minutes
      retryOnFailure: true,
      maxRetries: 3,
      ...config,
    };
  }

  /**
   * Create a new workflow
   */
  createWorkflow(name: string, description: string, steps: Omit<WorkflowStep, 'id'>[]): Workflow {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      steps: steps.map((step, index) => ({
        ...step,
        id: `step-${index + 1}`,
      })),
      status: 'pending',
      createdAt: new Date(),
      results: {},
      errors: [],
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  /**
   * Start a workflow
   */
  async startWorkflow(workflowId: string): Promise<Workflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (this.runningWorkflows.size >= this.config.maxConcurrentWorkflows) {
      throw new Error('Maximum concurrent workflows reached');
    }

    workflow.status = 'running';
    workflow.startedAt = new Date();
    this.runningWorkflows.add(workflowId);

    try {
      await this.executeWorkflow(workflow);
      workflow.status = 'completed';
    } catch (error) {
      workflow.status = 'failed';
      workflow.errors.push(error instanceof Error ? error.message : String(error));
    } finally {
      workflow.completedAt = new Date();
      this.runningWorkflows.delete(workflowId);
    }

    return workflow;
  }

  /**
   * Execute workflow steps
   */
  private async executeWorkflow(workflow: Workflow): Promise<void> {
    const completedSteps = new Set<string>();
    const stepResults: Record<string, unknown> = {};

    // Get steps that can be executed (no dependencies or all dependencies met)
    const getExecutableSteps = (): WorkflowStep[] => {
      return workflow.steps.filter(step => {
        if (completedSteps.has(step.id)) return false;
        if (!step.dependsOn || step.dependsOn.length === 0) return true;
        return step.dependsOn.every(depId => completedSteps.has(depId));
      });
    };

    while (completedSteps.size < workflow.steps.length) {
      const executableSteps = getExecutableSteps();
      
      if (executableSteps.length === 0) {
        throw new Error('Workflow deadlock: no executable steps available');
      }

      // Execute steps in parallel (respecting max concurrent tasks)
      const batchSize = Math.min(executableSteps.length, this.config.maxConcurrentTasks);
      const batch = executableSteps.slice(0, batchSize);

      await Promise.all(batch.map(async (step) => {
        try {
          // Check condition if present
          if (step.condition && !step.condition(stepResults)) {
            completedSteps.add(step.id);
            return;
          }

          // Resolve input
          const input = typeof step.input === 'function' 
            ? step.input(stepResults) 
            : step.input;

          // Create and execute task
          const task = agentRegistry.createTask(step.agentId, step.taskType, input);
          agentRegistry.startTask(task.id);

          // Simulate task execution (in production, this would call the actual agent)
          const result = await this.executeAgentTask(step.agentId, step.taskType, input);
          
          agentRegistry.completeTask(task.id, result);
          stepResults[step.id] = result;
          
          if (step.onSuccess) {
            step.onSuccess(result);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          workflow.errors.push(`Step ${step.id} failed: ${errorMessage}`);
          
          if (step.onFailure) {
            step.onFailure(errorMessage);
          }

          if (!this.config.retryOnFailure) {
            throw error;
          }
        }

        completedSteps.add(step.id);
      }));
    }

    workflow.results = stepResults;
  }

  /**
   * Execute an agent task
   */
  private async executeAgentTask(
    agentId: string, 
    taskType: string, 
    input: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // In production, this would call the actual agent methods
    // For now, return mock results based on agent and task type
    
    const mockResults: Record<string, Record<string, unknown>> = {
      'technical-seo': {
        'site-audit': { healthScore: 78, issues: 23, recommendations: 15 },
        'crawl': { pagesFound: 1247, indexable: 1052, errors: 45 },
        'schema-check': { valid: 85, warnings: 12, missing: 8 },
      },
      'competitive-intel': {
        'competitor-analysis': { competitors: 5, gaps: 23, opportunities: 15 },
        'keyword-gap': { yourKeywords: 450, competitorKeywords: 680, gaps: 230 },
        'backlink-gap': { yourBacklinks: 1200, competitorBacklinks: 3500, gaps: 2300 },
      },
      'content-intel': {
        'content-brief': { topics: 5, wordCount: 2500, keywords: 15 },
        'content-audit': { pages: 156, thin: 23, duplicate: 8 },
        'competitor-content': { articles: 45, avgWordCount: 1800, topTopics: 10 },
      },
      'youtube-seo': {
        'channel-analysis': { subscribers: 45200, videos: 156, avgViews: 18269 },
        'video-optimization': { recommendations: 8, potentialViews: 25000 },
        'keyword-research': { keywords: 25, avgVolume: 12000 },
      },
      'ecommerce-seo': {
        'store-analysis': { products: 1247, indexed: 1189, schemaIssues: 58 },
        'product-optimization': { recommendations: 12, potentialTraffic: 15000 },
        'schema-generation': { generated: 58, validated: 58 },
      },
    };

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = mockResults[agentId]?.[taskType];
    if (result) {
      return result as Record<string, unknown>;
    }
    return { success: true, taskType, agentId } as Record<string, unknown>;
  }

  /**
   * Cancel a workflow
   */
  cancelWorkflow(workflowId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (workflow && workflow.status === 'running') {
      workflow.status = 'cancelled';
      workflow.completedAt = new Date();
      this.runningWorkflows.delete(workflowId);
      return true;
    }
    return false;
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get running workflows
   */
  getRunningWorkflows(): Workflow[] {
    return Array.from(this.runningWorkflows)
      .map(id => this.workflows.get(id))
      .filter((w): w is Workflow => w !== undefined);
  }

  /**
   * Get workflow templates
   */
  getWorkflowTemplates(): WorkflowTemplate[] {
    return [
      {
        id: 'full-site-audit',
        name: 'Full Site Audit',
        description: 'Comprehensive technical SEO audit with competitive analysis',
        category: 'audit',
        steps: [
          {
            agentId: 'technical-seo',
            taskType: 'crawl',
            input: { depth: 'full' },
          },
          {
            agentId: 'technical-seo',
            taskType: 'site-audit',
            input: {},
            dependsOn: ['step-1'],
          },
          {
            agentId: 'competitive-intel',
            taskType: 'competitor-analysis',
            input: { competitors: 5 },
          },
          {
            agentId: 'content-intel',
            taskType: 'content-audit',
            input: {},
            dependsOn: ['step-1'],
          },
        ],
      },
      {
        id: 'content-optimization',
        name: 'Content Optimization',
        description: 'Analyze and optimize content based on competitor insights',
        category: 'optimization',
        steps: [
          {
            agentId: 'competitive-intel',
            taskType: 'competitor-content',
            input: { limit: 10 },
          },
          {
            agentId: 'content-intel',
            taskType: 'content-brief',
            input: (results) => ({ competitorData: results['step-1'] }),
            dependsOn: ['step-1'],
          },
        ],
      },
      {
        id: 'ecommerce-optimization',
        name: 'E-Commerce Optimization',
        description: 'Optimize product pages and generate schema markup',
        category: 'optimization',
        steps: [
          {
            agentId: 'ecommerce-seo',
            taskType: 'store-analysis',
            input: {},
          },
          {
            agentId: 'ecommerce-seo',
            taskType: 'schema-generation',
            input: (results) => ({ issues: results['step-1'] }),
            dependsOn: ['step-1'],
          },
          {
            agentId: 'ecommerce-seo',
            taskType: 'product-optimization',
            input: {},
            dependsOn: ['step-2'],
          },
        ],
      },
      {
        id: 'youtube-channel-audit',
        name: 'YouTube Channel Audit',
        description: 'Comprehensive YouTube channel analysis and optimization',
        category: 'audit',
        steps: [
          {
            agentId: 'youtube-seo',
            taskType: 'channel-analysis',
            input: {},
          },
          {
            agentId: 'youtube-seo',
            taskType: 'keyword-research',
            input: {},
          },
          {
            agentId: 'youtube-seo',
            taskType: 'video-optimization',
            input: (results) => ({ channelData: results['step-1'], keywords: results['step-2'] }),
            dependsOn: ['step-1', 'step-2'],
          },
        ],
      },
      {
        id: 'competitive-monitoring',
        name: 'Competitive Monitoring',
        description: 'Monitor competitors and identify opportunities',
        category: 'monitoring',
        steps: [
          {
            agentId: 'competitive-intel',
            taskType: 'competitor-analysis',
            input: { competitors: 5 },
          },
          {
            agentId: 'competitive-intel',
            taskType: 'keyword-gap',
            input: {},
            dependsOn: ['step-1'],
          },
          {
            agentId: 'competitive-intel',
            taskType: 'backlink-gap',
            input: {},
            dependsOn: ['step-1'],
          },
        ],
      },
    ];
  }

  /**
   * Create workflow from template
   */
  createWorkflowFromTemplate(templateId: string, customInput?: Record<string, unknown>): Workflow {
    const template = this.getWorkflowTemplates().find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const steps = template.steps.map(step => ({
      ...step,
      input: customInput ? { ...step.input as Record<string, unknown>, ...customInput } : step.input,
    }));

    return this.createWorkflow(template.name, template.description, steps);
  }

  /**
   * Get orchestrator statistics
   */
  getStats(): {
    totalWorkflows: number;
    runningWorkflows: number;
    completedWorkflows: number;
    failedWorkflows: number;
    avgWorkflowDuration: number;
  } {
    const workflows = this.getAllWorkflows();
    const completed = workflows.filter(w => w.status === 'completed');
    const failed = workflows.filter(w => w.status === 'failed');

    const avgDuration = completed.length > 0
      ? completed.reduce((sum, w) => {
          const duration = w.completedAt && w.startedAt
            ? w.completedAt.getTime() - w.startedAt.getTime()
            : 0;
          return sum + duration;
        }, 0) / completed.length
      : 0;

    return {
      totalWorkflows: workflows.length,
      runningWorkflows: this.runningWorkflows.size,
      completedWorkflows: completed.length,
      failedWorkflows: failed.length,
      avgWorkflowDuration: avgDuration,
    };
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator();

// Export convenience functions
export const createWorkflow = (name: string, description: string, steps: Omit<WorkflowStep, 'id'>[]) => 
  agentOrchestrator.createWorkflow(name, description, steps);
export const startWorkflow = (workflowId: string) => agentOrchestrator.startWorkflow(workflowId);
export const cancelWorkflow = (workflowId: string) => agentOrchestrator.cancelWorkflow(workflowId);
export const getWorkflow = (workflowId: string) => agentOrchestrator.getWorkflow(workflowId);
export const getAllWorkflows = () => agentOrchestrator.getAllWorkflows();
export const getWorkflowTemplates = () => agentOrchestrator.getWorkflowTemplates();
export const createWorkflowFromTemplate = (templateId: string, customInput?: Record<string, unknown>) => 
  agentOrchestrator.createWorkflowFromTemplate(templateId, customInput);
export const getOrchestratorStats = () => agentOrchestrator.getStats();
