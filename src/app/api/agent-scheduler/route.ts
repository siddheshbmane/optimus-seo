import { NextRequest, NextResponse } from 'next/server';
import {
  createSchedule,
  listSchedules,
  toggleSchedule,
  executeAgent,
  getDueSchedules,
  listRuns,
  agentTypeMetadata,
  type AgentType,
  type ScheduleFrequency,
} from '@/lib/agent-scheduler/scheduler';

// GET - List schedules, runs, or metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'schedules';
    const organizationId = searchParams.get('organizationId') || undefined;
    const projectId = searchParams.get('projectId') || undefined;
    const scheduleId = searchParams.get('scheduleId') || undefined;
    
    if (type === 'metadata') {
      // Return agent type metadata
      return NextResponse.json({
        success: true,
        data: agentTypeMetadata,
      });
    }
    
    if (type === 'runs') {
      // Return runs
      const runs = listRuns(scheduleId);
      return NextResponse.json({
        success: true,
        data: runs,
      });
    }
    
    if (type === 'due') {
      // Return due schedules
      const due = getDueSchedules();
      return NextResponse.json({
        success: true,
        data: due,
      });
    }
    
    // Return schedules
    const schedules = listSchedules(organizationId, projectId);
    
    return NextResponse.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error('Error in agent scheduler API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create schedule, toggle, or execute
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'toggle') {
      // Toggle schedule
      const { scheduleId } = body;
      if (!scheduleId) {
        return NextResponse.json(
          { success: false, error: 'scheduleId is required' },
          { status: 400 }
        );
      }
      
      const schedule = toggleSchedule(scheduleId);
      if (!schedule) {
        return NextResponse.json(
          { success: false, error: 'Schedule not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: schedule,
      });
    }
    
    if (action === 'execute') {
      // Execute agent immediately
      const { scheduleId } = body;
      if (!scheduleId) {
        return NextResponse.json(
          { success: false, error: 'scheduleId is required' },
          { status: 400 }
        );
      }
      
      const run = await executeAgent(scheduleId);
      
      return NextResponse.json({
        success: true,
        data: run,
      });
    }
    
    // Create new schedule
    const { 
      name, 
      agentType, 
      frequency, 
      cronExpression,
      timezone,
      config,
      projectId,
      organizationId,
      createdBy,
    } = body;
    
    if (!name || !agentType || !frequency || !projectId || !organizationId || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate agent type
    const validAgentTypes: AgentType[] = [
      'keyword_research',
      'rank_tracker',
      'backlink_monitor',
      'site_auditor',
      'competitor_analyzer',
      'content_optimizer',
      'report_generator',
    ];
    
    if (!validAgentTypes.includes(agentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid agent type' },
        { status: 400 }
      );
    }
    
    // Validate frequency
    const validFrequencies: ScheduleFrequency[] = ['hourly', 'daily', 'weekly', 'monthly', 'custom'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { success: false, error: 'Invalid frequency' },
        { status: 400 }
      );
    }
    
    const schedule = createSchedule({
      name,
      agentType,
      frequency,
      cronExpression,
      timezone: timezone || 'UTC',
      enabled: true,
      config: config || {},
      projectId,
      organizationId,
      createdBy,
    });
    
    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('Error in agent scheduler API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
