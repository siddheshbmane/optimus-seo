/**
 * Single Project API Routes
 * 
 * GET /api/projects/[id] - Get project details
 * PATCH /api/projects/[id] - Update project
 * DELETE /api/projects/[id] - Delete project (soft delete)
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireProjectAccess, requirePermission } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'
import { validateBody, updateProjectSchema } from '@/lib/api/validation'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/projects/[id]
 * Get detailed project information
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    await requireProjectAccess(id)
    
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        clientUrl: true,
        industry: true,
        description: true,
        status: true,
        healthScore: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        locations: {
          select: {
            isPrimary: true,
            location: {
              select: {
                id: true,
                locationCode: true,
                locationName: true,
                locationType: true,
                countryCode: true,
                countryName: true,
              },
            },
          },
        },
        competitors: {
          select: {
            id: true,
            url: true,
            name: true,
            domainAuthority: true,
            organicTraffic: true,
            isAutoDiscovered: true,
          },
        },
        _count: {
          select: {
            keywords: true,
            keywordClusters: true,
            contents: true,
            siteAudits: true,
            backlinkOpportunities: true,
            backlinkSubmissions: true,
            rankTrackings: true,
            clientReports: true,
          },
        },
      },
    })
    
    if (!project) {
      return errors.notFound('Project')
    }
    
    return success(project)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to get project:', error)
    return errors.internalError()
  }
}

/**
 * PATCH /api/projects/[id]
 * Update project details
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireProjectAccess(id)
    
    // Check permission
    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      await requirePermission('project:update')
    }
    
    // Validate request body
    const data = await validateBody(request, updateProjectSchema)
    
    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        clientUrl: true,
        industry: true,
        description: true,
        status: true,
        healthScore: true,
        updatedAt: true,
      },
    })
    
    return success(project)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to update project:', error)
    return errors.internalError()
  }
}

/**
 * DELETE /api/projects/[id]
 * Soft delete a project
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireProjectAccess(id)
    
    // Only owners and admins can delete projects
    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return errors.forbidden()
    }
    
    // Soft delete the project
    await prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'archived',
      },
    })
    
    return success({ deleted: true })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to delete project:', error)
    return errors.internalError()
  }
}
