/**
 * Super Admin Dashboard Stats API
 *
 * GET /api/super-admin/stats - Platform-wide overview stats
 */

import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/api/super-admin'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await requireSuperAdmin()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
      totalOrgs,
      totalUsers,
      activeUsers,
      totalProjects,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      orgsByPlan,
      recentSessions,
    ] = await Promise.all([
      prisma.organization.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({
        where: { deletedAt: null, isActive: true, lastLoginAt: { gte: sevenDaysAgo } },
      }),
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { createdAt: { gte: today }, deletedAt: null } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo }, deletedAt: null } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null } }),
      prisma.organization.groupBy({
        by: ['subscriptionStatus'],
        _count: { id: true },
        where: { deletedAt: null },
      }),
      prisma.session.count({ where: { createdAt: { gte: today } } }),
    ])

    const planDistribution = orgsByPlan.map((p) => ({
      status: p.subscriptionStatus,
      count: p._count.id,
    }))

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalOrganizations: totalOrgs,
          totalUsers,
          activeUsersLast7Days: activeUsers,
          totalProjects,
          sessionsToday: recentSessions,
        },
        growth: {
          newUsersToday,
          newUsersThisWeek: newUsersWeek,
          newUsersThisMonth: newUsersMonth,
        },
        planDistribution,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Super admin stats error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
