/**
 * Project Site Audits API Routes
 *
 * GET  /api/projects/[id]/audits - List audit history for project
 * POST /api/projects/[id]/audits - Create a new audit entry
 * PUT  /api/projects/[id]/audits - Update audit status (complete/fail)
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireProjectAccess } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/projects/[id]/audits
 * List all site audits for a project, most recent first.
 * Includes issue counts by severity.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    await requireProjectAccess(projectId)

    const audits = await prisma.siteAudit.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { issues: true },
        },
      },
    })

    return success(audits)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to list audits:', error)
    return errors.internalError()
  }
}

/**
 * POST /api/projects/[id]/audits
 * Create a new site audit entry.
 *
 * Body: {
 *   healthScore?, pagesCrawled?, lighthousePerformance?, lighthouseAccessibility?,
 *   lighthouseSeo?, lighthouseBestPractices?, coreWebVitals?, mobileScore?,
 *   desktopScore?, schemaMarkupFound?, toxicBacklinksCount?, rawData?,
 *   summaryNarrative?, agentTaskId?
 * }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    const session = await requireProjectAccess(projectId)

    const body = await request.json()

    const audit = await prisma.siteAudit.create({
      data: {
        projectId,
        organizationId: session.organizationId,
        healthScore: body.healthScore != null ? Number(body.healthScore) : null,
        pagesCrawled: body.pagesCrawled != null ? Number(body.pagesCrawled) : 0,
        lighthousePerformance: body.lighthousePerformance != null ? Number(body.lighthousePerformance) : null,
        lighthouseAccessibility: body.lighthouseAccessibility != null ? Number(body.lighthouseAccessibility) : null,
        lighthouseSeo: body.lighthouseSeo != null ? Number(body.lighthouseSeo) : null,
        lighthouseBestPractices: body.lighthouseBestPractices != null ? Number(body.lighthouseBestPractices) : null,
        coreWebVitals: body.coreWebVitals ?? undefined,
        mobileScore: body.mobileScore != null ? Number(body.mobileScore) : null,
        desktopScore: body.desktopScore != null ? Number(body.desktopScore) : null,
        schemaMarkupFound: body.schemaMarkupFound ?? undefined,
        toxicBacklinksCount: body.toxicBacklinksCount != null ? Number(body.toxicBacklinksCount) : null,
        rawData: body.rawData ?? undefined,
        summaryNarrative: body.summaryNarrative != null ? String(body.summaryNarrative) : null,
        agentTaskId: body.agentTaskId ?? null,
      },
    })

    return success(audit)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to create audit:', error)
    return errors.internalError()
  }
}

/**
 * PUT /api/projects/[id]/audits
 * Update an existing audit entry (e.g. mark complete, update scores).
 *
 * Body: { auditId, healthScore?, pagesCrawled?, summaryNarrative?, rawData?, ... }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    await requireProjectAccess(projectId)

    const body = await request.json()

    if (!body.auditId || typeof body.auditId !== 'string') {
      return errors.badRequest('Missing required field: auditId')
    }

    // Ensure audit belongs to this project
    const existing = await prisma.siteAudit.findFirst({
      where: { id: body.auditId, projectId },
      select: { id: true },
    })

    if (!existing) {
      return errors.notFound('SiteAudit')
    }

    // Build update payload -- only include fields that were sent
    const updateData: Record<string, unknown> = {}

    if (body.healthScore !== undefined) updateData.healthScore = body.healthScore != null ? Number(body.healthScore) : null
    if (body.pagesCrawled !== undefined) updateData.pagesCrawled = Number(body.pagesCrawled)
    if (body.lighthousePerformance !== undefined) updateData.lighthousePerformance = body.lighthousePerformance != null ? Number(body.lighthousePerformance) : null
    if (body.lighthouseAccessibility !== undefined) updateData.lighthouseAccessibility = body.lighthouseAccessibility != null ? Number(body.lighthouseAccessibility) : null
    if (body.lighthouseSeo !== undefined) updateData.lighthouseSeo = body.lighthouseSeo != null ? Number(body.lighthouseSeo) : null
    if (body.lighthouseBestPractices !== undefined) updateData.lighthouseBestPractices = body.lighthouseBestPractices != null ? Number(body.lighthouseBestPractices) : null
    if (body.coreWebVitals !== undefined) updateData.coreWebVitals = body.coreWebVitals
    if (body.mobileScore !== undefined) updateData.mobileScore = body.mobileScore != null ? Number(body.mobileScore) : null
    if (body.desktopScore !== undefined) updateData.desktopScore = body.desktopScore != null ? Number(body.desktopScore) : null
    if (body.schemaMarkupFound !== undefined) updateData.schemaMarkupFound = body.schemaMarkupFound
    if (body.toxicBacklinksCount !== undefined) updateData.toxicBacklinksCount = body.toxicBacklinksCount != null ? Number(body.toxicBacklinksCount) : null
    if (body.rawData !== undefined) updateData.rawData = body.rawData
    if (body.summaryNarrative !== undefined) updateData.summaryNarrative = body.summaryNarrative != null ? String(body.summaryNarrative) : null

    const audit = await prisma.siteAudit.update({
      where: { id: body.auditId },
      data: updateData,
    })

    return success(audit)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to update audit:', error)
    return errors.internalError()
  }
}
