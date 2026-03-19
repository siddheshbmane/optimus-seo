// Custom Dashboard Widget System

export type WidgetType = 
  | 'metric'
  | 'chart'
  | 'table'
  | 'list'
  | 'progress'
  | 'map'
  | 'text';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'donut';

export type DataSource = 
  | 'keywords'
  | 'rankings'
  | 'backlinks'
  | 'traffic'
  | 'competitors'
  | 'agents'
  | 'reports'
  | 'custom';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  dataSource: DataSource;
  chartType?: ChartType;
  metrics?: string[];
  filters?: Record<string, unknown>;
  refreshInterval?: number; // seconds
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
  };
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  layout: 'grid' | 'freeform';
  columns?: number;
  isDefault?: boolean;
  organizationId: string;
  projectId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
const dashboards: Map<string, Dashboard> = new Map();

// Widget templates
export const widgetTemplates: Record<string, Omit<WidgetConfig, 'id' | 'position'>> = {
  keywordOverview: {
    type: 'metric',
    title: 'Total Keywords',
    dataSource: 'keywords',
    metrics: ['count'],
  },
  rankingTrend: {
    type: 'chart',
    title: 'Ranking Trend',
    dataSource: 'rankings',
    chartType: 'line',
    metrics: ['averagePosition', 'top10Count'],
  },
  trafficChart: {
    type: 'chart',
    title: 'Organic Traffic',
    dataSource: 'traffic',
    chartType: 'area',
    metrics: ['sessions', 'pageviews'],
  },
  backlinkGrowth: {
    type: 'chart',
    title: 'Backlink Growth',
    dataSource: 'backlinks',
    chartType: 'bar',
    metrics: ['newLinks', 'lostLinks'],
  },
  topKeywords: {
    type: 'table',
    title: 'Top Keywords',
    dataSource: 'keywords',
    metrics: ['keyword', 'position', 'volume', 'change'],
  },
  competitorComparison: {
    type: 'chart',
    title: 'Competitor Comparison',
    dataSource: 'competitors',
    chartType: 'bar',
    metrics: ['organicTraffic', 'keywords'],
  },
  agentStatus: {
    type: 'list',
    title: 'Agent Activity',
    dataSource: 'agents',
    metrics: ['name', 'status', 'lastRun'],
  },
  domainAuthority: {
    type: 'progress',
    title: 'Domain Authority',
    dataSource: 'backlinks',
    metrics: ['domainRating'],
  },
};

// Create dashboard
export function createDashboard(
  config: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>
): Dashboard {
  const dashboard: Dashboard = {
    ...config,
    id: `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  dashboards.set(dashboard.id, dashboard);
  return dashboard;
}

// Get dashboard
export function getDashboard(id: string): Dashboard | undefined {
  return dashboards.get(id);
}

// List dashboards
export function listDashboards(organizationId?: string, projectId?: string): Dashboard[] {
  let all = Array.from(dashboards.values());
  
  if (organizationId) {
    all = all.filter(d => d.organizationId === organizationId);
  }
  
  if (projectId) {
    all = all.filter(d => !d.projectId || d.projectId === projectId);
  }
  
  return all;
}

// Update dashboard
export function updateDashboard(
  id: string,
  updates: Partial<Omit<Dashboard, 'id' | 'createdAt'>>
): Dashboard | undefined {
  const dashboard = dashboards.get(id);
  if (!dashboard) return undefined;
  
  Object.assign(dashboard, updates, { updatedAt: new Date().toISOString() });
  return dashboard;
}

// Delete dashboard
export function deleteDashboard(id: string): boolean {
  return dashboards.delete(id);
}

// Add widget to dashboard
export function addWidget(
  dashboardId: string,
  widget: Omit<WidgetConfig, 'id'>
): WidgetConfig | undefined {
  const dashboard = dashboards.get(dashboardId);
  if (!dashboard) return undefined;
  
  const newWidget: WidgetConfig = {
    ...widget,
    id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  dashboard.widgets.push(newWidget);
  dashboard.updatedAt = new Date().toISOString();
  
  return newWidget;
}

// Update widget
export function updateWidget(
  dashboardId: string,
  widgetId: string,
  updates: Partial<Omit<WidgetConfig, 'id'>>
): WidgetConfig | undefined {
  const dashboard = dashboards.get(dashboardId);
  if (!dashboard) return undefined;
  
  const widget = dashboard.widgets.find(w => w.id === widgetId);
  if (!widget) return undefined;
  
  Object.assign(widget, updates);
  dashboard.updatedAt = new Date().toISOString();
  
  return widget;
}

// Remove widget
export function removeWidget(dashboardId: string, widgetId: string): boolean {
  const dashboard = dashboards.get(dashboardId);
  if (!dashboard) return false;
  
  const index = dashboard.widgets.findIndex(w => w.id === widgetId);
  if (index === -1) return false;
  
  dashboard.widgets.splice(index, 1);
  dashboard.updatedAt = new Date().toISOString();
  
  return true;
}

// Create widget from template
export function createWidgetFromTemplate(
  templateName: keyof typeof widgetTemplates,
  position: WidgetConfig['position']
): WidgetConfig {
  const template = widgetTemplates[templateName];
  return {
    ...template,
    id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position,
  };
}

// Initialize demo dashboards
export function initializeDemoDashboards(): void {
  createDashboard({
    name: 'SEO Overview',
    description: 'Main SEO metrics and trends',
    layout: 'grid',
    columns: 4,
    isDefault: true,
    organizationId: 'org-1',
    createdBy: 'user-1',
    widgets: [
      createWidgetFromTemplate('keywordOverview', { x: 0, y: 0, width: 1, height: 1 }),
      createWidgetFromTemplate('domainAuthority', { x: 1, y: 0, width: 1, height: 1 }),
      createWidgetFromTemplate('rankingTrend', { x: 2, y: 0, width: 2, height: 2 }),
      createWidgetFromTemplate('trafficChart', { x: 0, y: 1, width: 2, height: 2 }),
      createWidgetFromTemplate('topKeywords', { x: 0, y: 3, width: 4, height: 2 }),
    ],
  });
  
  createDashboard({
    name: 'Competitor Analysis',
    description: 'Track competitor performance',
    layout: 'grid',
    columns: 3,
    organizationId: 'org-1',
    createdBy: 'user-1',
    widgets: [
      createWidgetFromTemplate('competitorComparison', { x: 0, y: 0, width: 3, height: 2 }),
      createWidgetFromTemplate('backlinkGrowth', { x: 0, y: 2, width: 2, height: 2 }),
      createWidgetFromTemplate('agentStatus', { x: 2, y: 2, width: 1, height: 2 }),
    ],
  });
}

// Initialize demo data
initializeDemoDashboards();
