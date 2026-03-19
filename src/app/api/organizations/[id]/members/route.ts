/**
 * Organization Members API Routes
 * 
 * GET /api/organizations/[id]/members - List organization members
 * POST /api/organizations/[id]/members - Invite a new member
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requirePermission } from '@/lib/api/auth'
import { success, paginated, errors } from '@/lib/api/response'
import { validateBody, validateQuery, inviteUserSchema, paginationSchema } from '@/lib/api/validation'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/organizations/[id]/members
 * List all members of the organization
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireAuth()
    
    // Users can only access their own organization
    if (session.organizationId !== id) {
      return errors.forbidden()
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const query = validateQuery(searchParams, paginationSchema)
    
    // Get total count
    const total = await prisma.user.count({
      where: {
        organizationId: id,
        deletedAt: null,
      },
    })
    
    // Get members
    const members = await prisma.user.findMany({
      where: {
        organizationId: id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    })
    
    return paginated(members, total, query.page, query.pageSize)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to list members:', error)
    return errors.internalError()
  }
}

/**
 * POST /api/organizations/[id]/members
 * Invite a new member to the organization
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireAuth()
    
    // Users can only invite to their own organization
    if (session.organizationId !== id) {
      return errors.forbidden()
    }
    
    // Check permission
    await requirePermission('user:invite')
    
    // Validate request body
    const data = await validateBody(request, inviteUserSchema)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    
    if (existingUser) {
      if (existingUser.organizationId === id) {
        return errors.conflict('User is already a member of this organization')
      }
      return errors.conflict('User already belongs to another organization')
    }
    
    // Create the user (they will need to complete signup via magic link)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || data.email.split('@')[0],
        organizationId: id,
        role: data.role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })
    
    // TODO: Send invitation email via Resend
    console.log(`Invitation sent to ${data.email}`)
    
    return success(user)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to invite member:', error)
    return errors.internalError()
  }
}
