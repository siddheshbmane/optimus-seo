/**
 * Super Admin Usage API
 *
 * GET /api/super-admin/usage - Platform usage metrics
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/api/super-admin'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    let since = new Date()
    if (period === '7d') since.setDate(since.getDate() - 7)
    else if (period === '30d') since.setDate(since.getDate() - 30)
    else since.setDate(since.getDate() - 30)

    const [
      agentTaskCount,
      topAgentsRaw,
      projectsByStatusRaw,
      contentCount,
      keywordCount,
    ] = await Promise.all([
      prisma.agentTask.count({ where: { createdAt: { gte: since } } }),
      prisma.agentTask.groupBy({
        by: ['agentName'],
        where: { createdAt: { gte: since } },
        _count: { id: true },
      }),
      prisma.project.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.content.count(),
      prisma.keyword.count(),
    ])

    // Sort and limit top agents
    const topAgents = topAgentsRaw
      .map(e => ({ agentName: e.agentName, count: e._count.id }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const projectsByStatus = projectsByStatusRaw.map(p => ({
      status: p.status,
      count: p._count.id,
    }))

    return NextResponse.json({
      success: true,
      data: {
        agentTaskCount,
        topAgents,
        projectsByStatus,
        contentCount,
        keywordCount,
        period,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
