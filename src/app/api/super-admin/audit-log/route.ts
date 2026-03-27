/**
 * Super Admin Audit Log API
 *
 * GET /api/super-admin/audit-log - Browse agent task logs (closest audit trail)
 *
 * NOTE: The schema does not have a dedicated AuditLog model. This route uses
 * AgentTask + AgentLog as the platform's operational audit trail. A full
 * AuditLog model can be added later and this route updated accordingly.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/api/super-admin'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const action = searchParams.get('action') || ''
    const status = searchParams.get('status') || ''
    const agentName = searchParams.get('agentName') || ''

    const where: Record<string, unknown> = {}
    if (action) where.action = { contains: action, mode: 'insensitive' }
    if (status) where.status = status
    if (agentName) where.agentName = { contains: agentName, mode: 'insensitive' }

    const [logs, total] = await Promise.all([
      prisma.agentTask.findMany({
        where,
        include: {
          project: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.agentTask.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: logs.map((log) => ({
        id: log.id,
        agentName: log.agentName,
        action: log.action,
        status: log.status,
        priority: log.priority,
        tokensUsed: log.tokensUsed,
        apiCost: log.apiCost,
        durationMs: log.durationMs,
        errorMessage: log.errorMessage,
        project: log.project,
        organizationId: log.organizationId,
        startedAt: log.startedAt,
        completedAt: log.completedAt,
        createdAt: log.createdAt,
      })),
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
