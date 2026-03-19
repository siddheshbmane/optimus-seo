// Scheduled Reports API Route
// Manages report schedules and executions

import { NextRequest, NextResponse } from 'next/server';
import { 
  mockScheduledReports, 
  mockReportExecutions,
  calculateNextRun,
  type ScheduledReport,
  type ReportExecution,
} from '@/lib/reports/scheduler';

// In-memory storage (would be database in production)
let scheduledReports = [...mockScheduledReports];
let reportExecutions = [...mockReportExecutions];

// GET - List all scheduled reports
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const reportId = searchParams.get('reportId');

  // Get specific report
  if (reportId) {
    const report = scheduledReports.find(r => r.id === reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    const executions = reportExecutions.filter(e => e.reportId === reportId);
    return NextResponse.json({ report, executions });
  }

  // Filter by project
  let reports = scheduledReports;
  if (projectId) {
    reports = reports.filter(r => r.projectId === projectId);
  }

  return NextResponse.json({ 
    reports,
    total: reports.length,
  });
}

// POST - Create new scheduled report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newReport: ScheduledReport = {
      id: `report-${Date.now()}`,
      name: body.name,
      projectId: body.projectId,
      type: body.type,
      frequency: body.frequency,
      format: body.format || 'pdf',
      recipients: body.recipients || [],
      enabled: body.enabled ?? true,
      nextRun: calculateNextRun(body.frequency, body.customSchedule).toISOString(),
      customSchedule: body.customSchedule,
      filters: body.filters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    scheduledReports.push(newReport);

    return NextResponse.json({ report: newReport }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create report' },
      { status: 400 }
    );
  }
}

// PUT - Update scheduled report
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = scheduledReports.findIndex(r => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const updatedReport: ScheduledReport = {
      ...scheduledReports[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate next run if frequency changed
    if (updates.frequency || updates.customSchedule) {
      updatedReport.nextRun = calculateNextRun(
        updatedReport.frequency,
        updatedReport.customSchedule
      ).toISOString();
    }

    scheduledReports[index] = updatedReport;

    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update report' },
      { status: 400 }
    );
  }
}

// DELETE - Delete scheduled report
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
  }

  const index = scheduledReports.findIndex(r => r.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  scheduledReports.splice(index, 1);
  // Also remove executions
  reportExecutions = reportExecutions.filter(e => e.reportId !== id);

  return NextResponse.json({ success: true });
}
