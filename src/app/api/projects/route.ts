/**
 * Projects API Routes
 * 
 * GET /api/projects - List all projects for the organization
 * POST /api/projects - Create a new project
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requirePermission } from '@/lib/api/auth'
import { success, paginated, errors } from '@/lib/api/response'
import { validateBody, validateQuery, createProjectSchema, projectQuerySchema } from '@/lib/api/validation'
import type { Prisma } from '@/generated/prisma'

/**
 * GET /api/projects
 * List all projects for the authenticated user's organization
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const query = validateQuery(searchParams, projectQuerySchema)
    
    // Build where clause
    const where: Prisma.ProjectWhereInput = {
      organizationId: session.organizationId,
      deletedAt: null,
    }
    
    // Filter by status
    if (query.status) {
      where.status = query.status
    }
    
    // Search by name or URL
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { clientUrl: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    
    // Build order by
    const orderBy: Prisma.ProjectOrderByWithRelationInput = {}
    if (query.sortBy) {
      orderBy[query.sortBy as keyof Prisma.ProjectOrderByWithRelationInput] = query.sortOrder
    } else {
      orderBy.updatedAt = 'desc'
    }
    
    // Get total count
    const total = await prisma.project.count({ where })
    
    // Get projects with pagination
    const projects = await prisma.project.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: {
        id: true,
        name: true,
        clientUrl: true,
        industry: true,
        status: true,
        healthScore: true,
        createdAt: true,
        updatedAt: true,
        locations: {
          select: {
            isPrimary: true,
            location: {
              select: {
                locationCode: true,
                locationName: true,
                countryCode: true,
              },
            },
          },
        },
        _count: {
          select: {
            keywords: true,
            contents: true,
            siteAudits: true,
          },
        },
      },
    })
    
    return paginated(projects, total, query.page, query.pageSize)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to list projects:', error)
    return errors.internalError()
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission('project:create')
    
    // Validate request body
    const data = await validateBody(request, createProjectSchema)
    
    // Create project with transaction
    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.project.create({
        data: {
          organizationId: session.organizationId,
          name: data.name,
          clientUrl: data.clientUrl,
          industry: data.industry,
          description: data.description,
          status: 'created',
          createdById: session.user.id,
        },
        select: {
          id: true,
          name: true,
          clientUrl: true,
          industry: true,
          description: true,
          status: true,
          createdAt: true,
        },
      })
      
      // Add locations if provided
      if (data.locationCodes && data.locationCodes.length > 0) {
        // Find or create locations
        for (let i = 0; i < data.locationCodes.length; i++) {
          const locationCode = data.locationCodes[i]
          
          // Find the location
          let location = await tx.location.findUnique({
            where: { locationCode },
          })
          
          // If location doesn't exist, create a placeholder
          // (In production, this would be populated from DataForSEO)
          if (!location) {
            location = await tx.location.create({
              data: {
                locationCode,
                locationName: `Location ${locationCode}`,
                locationType: 'Unknown',
              },
            })
          }
          
          // Create project location
          await tx.projectLocation.create({
            data: {
              projectId: newProject.id,
              locationId: location.id,
              isPrimary: i === 0, // First location is primary
            },
          })
        }
      }
      
      // Add competitors if provided
      if (data.competitorUrls && data.competitorUrls.length > 0) {
        await tx.competitor.createMany({
          data: data.competitorUrls.map((url) => ({
            projectId: newProject.id,
            url,
            isAutoDiscovered: false,
          })),
        })
      }
      
      return newProject
    })
    
    return success(project)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to create project:', error)
    return errors.internalError()
  }
}
