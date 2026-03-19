/**
 * Organizations API Routes
 * 
 * GET /api/organizations - Get current user's organization
 * POST /api/organizations - Create a new organization (for new users)
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/api/auth'
import { success, errors } from '@/lib/api/response'
import { validateBody, createOrganizationSchema } from '@/lib/api/validation'

/**
 * GET /api/organizations
 * Get the current user's organization
 */
export async function GET() {
  try {
    const session = await requireAuth()
    
    const organization = await prisma.organization.findUnique({
      where: { id: session.organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        createdAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
            features: true,
          },
        },
        _count: {
          select: {
            users: true,
            projects: true,
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
 * POST /api/organizations
 * Create a new organization
 * This is typically called during onboarding for new users
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    // Check if user already has an organization
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    })
    
    if (existingUser?.organizationId) {
      return errors.conflict('User already belongs to an organization')
    }
    
    // Validate request body
    const data = await validateBody(request, createOrganizationSchema)
    
    // Check if slug is available
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: data.slug },
    })
    
    if (existingOrg) {
      return errors.conflict('Organization slug is already taken')
    }
    
    // Create organization and update user
    const organization = await prisma.$transaction(async (tx) => {
      // Create the organization
      const newOrg = await tx.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
          subscriptionStatus: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
        select: {
          id: true,
          name: true,
          slug: true,
          subscriptionStatus: true,
          trialEndsAt: true,
        },
      })
      
      // Update user to belong to this organization as owner
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          organizationId: newOrg.id,
          role: 'owner',
        },
      })
      
      return newOrg
    })
    
    return success(organization)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to create organization:', error)
    return errors.internalError()
  }
}
