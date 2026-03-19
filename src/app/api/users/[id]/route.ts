/**
 * Single User API Routes
 * 
 * GET /api/users/[id] - Get user details (admin only)
 * PATCH /api/users/[id] - Update user (admin only)
 * DELETE /api/users/[id] - Remove user from organization (admin only)
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requirePermission } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'
import { validateBody, updateUserSchema } from '@/lib/api/validation'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/users/[id]
 * Get user details (admin only)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireAuth()
    
    // Users can view their own profile, admins can view anyone in their org
    if (id !== session.user.id) {
      await requirePermission('user:read')
    }
    
    const user = await prisma.user.findFirst({
      where: {
        id,
        organizationId: session.organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    if (!user) {
      return errors.notFound('User')
    }
    
    return success(user)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to get user:', error)
    return errors.internalError()
  }
}

/**
 * PATCH /api/users/[id]
 * Update user (admin only, or self for limited fields)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireAuth()
    
    // Check if user exists in same organization
    const targetUser = await prisma.user.findFirst({
      where: {
        id,
        organizationId: session.organizationId,
        deletedAt: null,
      },
    })
    
    if (!targetUser) {
      return errors.notFound('User')
    }
    
    // Validate request body
    const data = await validateBody(request, updateUserSchema)
    
    // Permission checks
    if (id !== session.user.id) {
      // Updating another user requires admin permission
      await requirePermission('user:read')
      
      // Can't change owner's role
      if (targetUser.role === 'owner' && data.role) {
        return errors.forbidden()
      }
      
      // Only owner can promote to admin
      if (data.role === 'admin' && session.user.role !== 'owner') {
        return errors.forbidden()
      }
    } else {
      // Users can only update their own name, not role
      if (data.role || data.isActive !== undefined) {
        return errors.forbidden()
      }
    }
    
    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    })
    
    return success(user)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to update user:', error)
    return errors.internalError()
  }
}

/**
 * DELETE /api/users/[id]
 * Remove user from organization (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireAuth()
    
    // Can't delete yourself
    if (id === session.user.id) {
      return errors.badRequest('Cannot remove yourself from the organization')
    }
    
    // Check permission
    await requirePermission('user:remove')
    
    // Check if user exists in same organization
    const targetUser = await prisma.user.findFirst({
      where: {
        id,
        organizationId: session.organizationId,
        deletedAt: null,
      },
    })
    
    if (!targetUser) {
      return errors.notFound('User')
    }
    
    // Can't remove the owner
    if (targetUser.role === 'owner') {
      return errors.forbidden()
    }
    
    // Soft delete the user
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    })
    
    return success({ deleted: true })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to delete user:', error)
    return errors.internalError()
  }
}
