// Scheduled Reports API Route
// Manages report schedules stored in OrgSetting (DB-backed, persists across restarts)

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { prisma } from '@/lib/db';
import type { Prisma } from '@/generated/prisma';
import { calculateNextRun, type ScheduledReport, type ReportFrequency } from '@/lib/reports/scheduler';

const REPORT_SCHEDULES_KEY = 'report_schedules';

async function getSchedules(organizationId: string): Promise<ScheduledReport[]> {
  try {
    const setting = await prisma.orgSetting.findUnique({
      where: { organizationId_key: { organizationId, key: REPORT_SCHEDULES_KEY } },
    });
    if (!setting) return [];
    const value = setting.value as unknown;
    return Array.isArray(value) ? (value as ScheduledReport[]) : [];
  } catch {
    return [];
  }
}

async function saveSchedules(organizationId: string, schedules: ScheduledReport[]): Promise<void> {
  await prisma.orgSetting.upsert({
    where: { organizationId_key: { organizationId, key: REPORT_SCHEDULES_KEY } },
    create: { organizationId, key: REPORT_SCHEDULES_KEY, value: schedules as unknown as Prisma.JsonArray },
    update: { value: schedules as unknown as Prisma.JsonArray },
  });
}

// GET - List all scheduled reports
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const reportId = searchParams.get('reportId');
    const organizationId = session.organizationId;

    let reports = await getSchedules(organizationId);

    if (reportId) {
      const report = reports.find(r => r.id === reportId);
      if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      return NextResponse.json({ report, executions: [] });
    }

    if (projectId) {
      reports = reports.filter(r => r.projectId === projectId);
    }

    return NextResponse.json({ reports, total: reports.length });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new scheduled report
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const organizationId = session.organizationId;

    const newReport: ScheduledReport = {
      id: `report-${Date.now()}`,
      name: body.name,
      projectId: body.projectId,
      type: body.type,
      frequency: body.frequency as ReportFrequency,
      format: body.format || 'pdf',
      recipients: body.recipients || [],
      enabled: body.enabled ?? true,
      nextRun: calculateNextRun(body.frequency, body.customSchedule).toISOString(),
      customSchedule: body.customSchedule,
      filters: body.filters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const reports = await getSchedules(organizationId);
    reports.push(newReport);
    await saveSchedules(organizationId, reports);

    return NextResponse.json({ report: newReport }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create report' },
      { status: 400 }
    );
  }
}

// PUT - Update scheduled report
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { id, ...updates } = body;
    const organizationId = session.organizationId;

    const reports = await getSchedules(organizationId);
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    const updatedReport: ScheduledReport = {
      ...reports[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.frequency || updates.customSchedule) {
      updatedReport.nextRun = calculateNextRun(updatedReport.frequency, updatedReport.customSchedule).toISOString();
    }

    reports[index] = updatedReport;
    await saveSchedules(organizationId, reports);

    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update report' }, { status: 400 });
  }
}

// DELETE - Delete scheduled report
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const organizationId = session.organizationId;

    if (!id) return NextResponse.json({ error: 'Report ID required' }, { status: 400 });

    const reports = await getSchedules(organizationId);
    const filtered = reports.filter(r => r.id !== id);
    if (filtered.length === reports.length) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    await saveSchedules(organizationId, filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
