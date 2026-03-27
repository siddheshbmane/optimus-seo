/**
 * Super Admin Tenants (Organizations) API
 *
 * GET /api/super-admin/tenants - List all organizations with pagination/search
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/api/super-admin'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const where: Record<string, unknown> = { deletedAt: null }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) {
      where.subscriptionStatus = status
    }

    const [tenants, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        include: {
          _count: { select: { users: true, projects: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.organization.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: tenants.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        logoUrl: t.logoUrl,
        subscriptionStatus: t.subscriptionStatus,
        createdAt: t.createdAt,
        userCount: t._count.users,
        projectCount: t._count.projects,
      })),
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
