/**
 * Current User API Routes
 * 
 * GET /api/users/me - Get current user profile
 * PATCH /api/users/me - Update current user profile
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'
import { validateBody } from '@/lib/api/validation'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  avatarUrl: z.string().url().optional().nullable(),
})

/**
 * GET /api/users/me
 * Get the current user's profile
 */
export async function GET() {
  try {
    const session = await requireAuth()
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            primaryColor: true,
            subscriptionStatus: true,
          },
        },
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
 * PATCH /api/users/me
 * Update the current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    // Validate request body
    const data = await validateBody(request, updateProfileSchema)
    
    // Update user
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
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
