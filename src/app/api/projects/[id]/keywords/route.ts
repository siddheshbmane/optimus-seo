/**
 * Project Keywords API Routes
 *
 * GET    /api/projects/[id]/keywords - List tracked keywords for project
 * POST   /api/projects/[id]/keywords - Add keyword(s) to tracking
 * DELETE /api/projects/[id]/keywords - Remove keyword from tracking
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import type { KeywordType, KeywordIntent } from '@/generated/prisma'
import { requireProjectAccess } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/projects/[id]/keywords
 * List all tracked keywords for a project
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    await requireProjectAccess(projectId)

    const keywords = await prisma.keyword.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })

    return success(keywords)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to list keywords:', error)
    return errors.internalError()
  }
}

/**
 * POST /api/projects/[id]/keywords
 * Add one or more keywords to tracking.
 *
 * Body (single):  { keyword, searchVolume?, difficulty?, cpc?, intent?, ... }
 * Body (batch):   { keywords: [{ keyword, searchVolume?, ... }] }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    const session = await requireProjectAccess(projectId)

    const body = await request.json()

    // Support both single and batch creation
    const items: Record<string, unknown>[] = body.keywords
      ? body.keywords
      : [body]

    if (!items.length || !items.every((i) => typeof i.keyword === 'string' && i.keyword.trim())) {
      return errors.badRequest('Each keyword entry must include a non-empty "keyword" string')
    }

    const created = await prisma.keyword.createManyAndReturn({
      data: items.map((item) => ({
        projectId,
        organizationId: session.organizationId,
        keyword: String(item.keyword).trim(),
        searchVolume: item.searchVolume != null ? Number(item.searchVolume) : null,
        difficulty: item.difficulty != null ? Number(item.difficulty) : null,
        cpc: item.cpc != null ? Number(item.cpc) : null,
        competition: item.competition != null ? Number(item.competition) : null,
        keywordType: (item.keywordType as KeywordType) ?? null,
        intent: (item.intent as KeywordIntent) ?? null,
        funnelStage: item.funnelStage != null ? String(item.funnelStage) : null,
        priorityScore: item.priorityScore != null ? Number(item.priorityScore) : null,
        currentPosition: item.currentPosition != null ? Number(item.currentPosition) : null,
        isTarget: item.isTarget === true,
      })),
    })

    return success(created)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to create keyword(s):', error)
    return errors.internalError()
  }
}

/**
 * DELETE /api/projects/[id]/keywords
 * Remove a keyword from tracking.
 *
 * Query param: ?keywordId=<uuid>
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params
    await requireProjectAccess(projectId)

    const { searchParams } = new URL(request.url)
    const keywordId = searchParams.get('keywordId')

    if (!keywordId) {
      return errors.badRequest('Missing required query parameter: keywordId')
    }

    // Ensure keyword belongs to this project before deleting
    const keyword = await prisma.keyword.findFirst({
      where: { id: keywordId, projectId },
      select: { id: true },
    })

    if (!keyword) {
      return errors.notFound('Keyword')
    }

    await prisma.keyword.delete({
      where: { id: keywordId },
    })

    return success({ deleted: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Failed to delete keyword:', error)
    return errors.internalError()
  }
}
