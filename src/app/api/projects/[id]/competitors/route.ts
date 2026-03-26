/**
 * Project Competitors API Routes
 *
 * GET    /api/projects/[id]/competitors - List competitors for project
 * POST   /api/projects/[id]/competitors - Add a competitor
 * DELETE /api/projects/[id]/competitors - Remove a competitor
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireProjectAccess } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/projects/[id]/competitors
 * List all competitors for a project
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    await requireProjectAccess(projectId)

    const competitors = await prisma.competitor.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })

    return success(competitors)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to list competitors:', error)
    return errors.internalError()
  }
}

/**
 * POST /api/projects/[id]/competitors
 * Add a competitor to the project.
 *
 * Body: { url, name?, domainAuthority?, organicTraffic?, isAutoDiscovered? }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    await requireProjectAccess(projectId)

    const body = await request.json()

    if (!body.url || typeof body.url !== 'string' || !body.url.trim()) {
      return errors.badRequest('A non-empty "url" is required')
    }

    const url = body.url.trim()

    // Prevent duplicate competitor URLs within the same project
    const existing = await prisma.competitor.findFirst({
      where: { projectId, url },
      select: { id: true },
    })

    if (existing) {
      return errors.conflict('A competitor with this URL already exists in the project')
    }

    const competitor = await prisma.competitor.create({
      data: {
        projectId,
        url,
        name: body.name != null ? String(body.name).trim() : null,
        domainAuthority: body.domainAuthority != null ? Number(body.domainAuthority) : null,
        organicTraffic: body.organicTraffic != null ? Number(body.organicTraffic) : null,
        isAutoDiscovered: body.isAutoDiscovered === true,
      },
    })

    return success(competitor)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to create competitor:', error)
    return errors.internalError()
  }
}

/**
 * DELETE /api/projects/[id]/competitors
 * Remove a competitor from the project.
 *
 * Query param: ?competitorId=<uuid>
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    await requireProjectAccess(projectId)

    const { searchParams } = new URL(request.url)
    const competitorId = searchParams.get('competitorId')

    if (!competitorId) {
      return errors.badRequest('Missing required query parameter: competitorId')
    }

    // Ensure competitor belongs to this project
    const competitor = await prisma.competitor.findFirst({
      where: { id: competitorId, projectId },
      select: { id: true },
    })

    if (!competitor) {
      return errors.notFound('Competitor')
    }

    await prisma.competitor.delete({
      where: { id: competitorId },
    })

    return success({ deleted: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to delete competitor:', error)
    return errors.internalError()
  }
}
