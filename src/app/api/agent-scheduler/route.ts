import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import {
  createSchedule,
  listSchedules,
  toggleSchedule,
  executeAgent,
  getDueSchedules,
  listRuns,
  initializeDemoSchedules,
  agentTypeMetadata,
  type AgentType,
  type ScheduleFrequency,
} from '@/lib/agent-scheduler/scheduler';

// GET - List schedules, runs, or metadata
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'schedules';
    const organizationId = searchParams.get('organizationId') || session.organizationId;
    const projectId = searchParams.get('projectId') || undefined;
    const scheduleId = searchParams.get('scheduleId') || undefined;

    if (type === 'metadata') {
      return NextResponse.json({ success: true, data: agentTypeMetadata });
    }

    if (type === 'runs') {
      const runs = await listRuns(scheduleId, organizationId);
      return NextResponse.json({ success: true, data: runs });
    }

    if (type === 'due') {
      const due = await getDueSchedules(organizationId);
      return NextResponse.json({ success: true, data: due });
    }

    // Seed demo schedules on first access (idempotent - only runs if org has no schedules)
    await initializeDemoSchedules(organizationId);

    const schedules = await listSchedules(organizationId, projectId);
    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error in agent scheduler API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create schedule, toggle, or execute
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { action } = body;
    const organizationId = body.organizationId || session.organizationId;

    if (action === 'toggle') {
      const { scheduleId } = body;
      if (!scheduleId) {
        return NextResponse.json({ success: false, error: 'scheduleId is required' }, { status: 400 });
      }
      const schedule = await toggleSchedule(scheduleId, organizationId);
      if (!schedule) {
        return NextResponse.json({ success: false, error: 'Schedule not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: schedule });
    }

    if (action === 'execute') {
      const { scheduleId } = body;
      if (!scheduleId) {
        return NextResponse.json({ success: false, error: 'scheduleId is required' }, { status: 400 });
      }
      const run = await executeAgent(scheduleId, organizationId);
      return NextResponse.json({ success: true, data: run });
    }

    // Create new schedule
    const { name, agentType, frequency, cronExpression, timezone, config, projectId, createdBy } = body;

    if (!name || !agentType || !frequency || !projectId) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, agentType, frequency, projectId' }, { status: 400 });
    }

    const validAgentTypes: AgentType[] = ['keyword_research', 'rank_tracker', 'backlink_monitor', 'site_auditor', 'competitor_analyzer', 'content_optimizer', 'report_generator'];
    if (!validAgentTypes.includes(agentType)) {
      return NextResponse.json({ success: false, error: 'Invalid agent type' }, { status: 400 });
    }

    const validFrequencies: ScheduleFrequency[] = ['hourly', 'daily', 'weekly', 'monthly', 'custom'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json({ success: false, error: 'Invalid frequency' }, { status: 400 });
    }

    const schedule = await createSchedule({
      name,
      agentType,
      frequency,
      cronExpression,
      timezone: timezone || 'UTC',
      enabled: true,
      config: config || {},
      projectId,
      organizationId,
      createdBy: createdBy || session.user.id,
    });

    return NextResponse.json({ success: true, data: schedule });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error in agent scheduler API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
