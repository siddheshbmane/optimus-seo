/**
 * Super Admin LLM Costs API
 *
 * GET /api/super-admin/llm-costs - LLM/agent cost analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/api/super-admin'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const groupBy = searchParams.get('groupBy') || 'agent'

    let since = new Date()
    if (period === '7d') since.setDate(since.getDate() - 7)
    else if (period === '30d') since.setDate(since.getDate() - 30)
    else if (period === '90d') since.setDate(since.getDate() - 90)
    else if (period === 'today')
      since = new Date(since.getFullYear(), since.getMonth(), since.getDate())
    else since.setDate(since.getDate() - 30)

    const where = { createdAt: { gte: since } }

    // Get aggregate stats from AgentTask
    const aggregate = await prisma.agentTask.aggregate({
      where,
      _sum: { tokensUsed: true, apiCost: true },
      _count: { id: true },
      _avg: { durationMs: true, apiCost: true },
    })

    // Get grouped data — use separate queries for each group-by to avoid TS issues
    let breakdown: Array<Record<string, unknown>> = []

    try {
      if (groupBy === 'agent') {
        const results = await prisma.agentTask.groupBy({
          by: ['agentName'],
          where,
          _sum: { tokensUsed: true, apiCost: true },
          _count: { id: true },
          _avg: { durationMs: true },
        })
        breakdown = results
          .map(r => ({
            group: r.agentName,
            tokens: r._sum.tokensUsed || 0,
            cost: r._sum.apiCost || 0,
            requests: r._count.id,
            avgDuration: Math.round(r._avg.durationMs || 0),
          }))
          .sort((a, b) => (b.cost as number) - (a.cost as number))
      } else if (groupBy === 'status') {
        const results = await prisma.agentTask.groupBy({
          by: ['status'],
          where,
          _sum: { tokensUsed: true, apiCost: true },
          _count: { id: true },
          _avg: { durationMs: true },
        })
        breakdown = results
          .map(r => ({
            group: r.status,
            tokens: r._sum.tokensUsed || 0,
            cost: r._sum.apiCost || 0,
            requests: r._count.id,
            avgDuration: Math.round(r._avg.durationMs || 0),
          }))
          .sort((a, b) => (b.cost as number) - (a.cost as number))
      } else {
        const results = await prisma.agentTask.groupBy({
          by: ['organizationId'],
          where,
          _sum: { tokensUsed: true, apiCost: true },
          _count: { id: true },
          _avg: { durationMs: true },
        })
        breakdown = results
          .map(r => ({
            group: r.organizationId,
            tokens: r._sum.tokensUsed || 0,
            cost: r._sum.apiCost || 0,
            requests: r._count.id,
            avgDuration: Math.round(r._avg.durationMs || 0),
          }))
          .sort((a, b) => (b.cost as number) - (a.cost as number))
      }
    } catch {
      breakdown = []
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRequests: aggregate._count.id,
          totalTokens: aggregate._sum.tokensUsed || 0,
          totalCost: aggregate._sum.apiCost || 0,
          avgDurationMs: Math.round(aggregate._avg.durationMs || 0),
          avgCost: aggregate._avg.apiCost || 0,
        },
        breakdown,
        period,
        groupBy,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
