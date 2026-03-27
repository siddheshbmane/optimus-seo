/**
 * Super Admin Analytics API
 *
 * GET /api/super-admin/analytics - Growth, engagement, and retention metrics
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
    else if (period === '90d') since.setDate(since.getDate() - 90)
    else since.setDate(since.getDate() - 30)

    // Growth metrics
    const [
      totalSignups,
      signupsByDay,
      usersByRole,
      orgsByStatus,
      recentLogins,
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: since }, deletedAt: null } }),
      // Get signups grouped by day using raw query for better aggregation
      prisma.$queryRaw`
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM "User"
        WHERE "createdAt" >= ${since} AND "deletedAt" IS NULL
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      ` as Promise<Array<{ date: Date; count: number }>>,
      prisma.user.groupBy({
        by: ['role'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.organization.groupBy({
        by: ['subscriptionStatus'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.user.count({
        where: { lastLoginAt: { gte: since }, deletedAt: null },
      }),
    ])

    // DAU calculation via distinct session users
    const dailyActiveUsers = await prisma.session.findMany({
      where: { createdAt: { gte: since } },
      select: { userId: true },
      distinct: ['userId'],
    })

    return NextResponse.json({
      success: true,
      data: {
        growth: {
          totalNewUsers: totalSignups,
          signupsByDay: signupsByDay || [],
          recentActiveUsers: recentLogins,
        },
        engagement: {
          dailyActiveUsers: dailyActiveUsers.length,
          usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.id })),
        },
        retention: {
          orgsByStatus: orgsByStatus.map((o) => ({
            status: o.subscriptionStatus,
            count: o._count.id,
          })),
        },
        period,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
