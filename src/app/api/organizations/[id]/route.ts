/**
 * Single Organization API Routes
 * 
 * GET /api/organizations/[id] - Get organization details
 * PATCH /api/organizations/[id] - Update organization
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'
import { validateBody, updateOrganizationSchema } from '@/lib/api/validation'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/organizations/[id]
 * Get organization details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireAuth()
    
    // Users can only access their own organization
    if (session.organizationId !== id) {
      return errors.forbidden()
    }
    
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        customDomain: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        monthlyApiBudget: true,
        createdAt: true,
        updatedAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
            monthlyPrice: true,
            features: true,
          },
        },
        _count: {
          select: {
            users: true,
            projects: true,
            apiKeys: true,
            integrations: true,
          },
        },
      },
    })
    
    if (!organization) {
      return errors.notFound('Organization')
    }
    
    return success(organization)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to get organization:', error)
    return errors.internalError()
  }
}

/**
 * PATCH /api/organizations/[id]
 * Update organization settings
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await requireAuth()
    
    // Users can only update their own organization
    if (session.organizationId !== id) {
      return errors.forbidden()
    }
    
    // Only owners and admins can update organization
    if (session.user.role !== 'owner' && session.user.role !== 'admin') {
      return errors.forbidden()
    }
    
    // Validate request body
    const data = await validateBody(request, updateOrganizationSchema)
    
    // Update organization
    const organization = await prisma.organization.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        updatedAt: true,
      },
    })
    
    return success(organization)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to update organization:', error)
    return errors.internalError()
  }
}
