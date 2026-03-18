/**
 * Database Utilities
 * 
 * Common database operations with multi-tenancy support.
 * All queries should use these utilities to ensure proper tenant isolation.
 */

import { prisma } from './index'
import type { Prisma } from '@/generated/prisma'

/**
 * Get organization context for multi-tenant queries
 */
export function withOrganization(organizationId: string) {
  return {
    organizationId,
  }
}

/**
 * Soft delete helper - sets deletedAt timestamp
 */
export function softDelete() {
  return {
    deletedAt: new Date(),
  }
}

/**
 * Filter out soft-deleted records
 */
export function notDeleted() {
  return {
    deletedAt: null,
  }
}

/**
 * Pagination helper
 */
export function paginate(page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize
  return {
    skip,
    take: pageSize,
  }
}

/**
 * Calculate pagination metadata
 */
export function paginationMeta(total: number, page: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize)
  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * Common select fields for User (excludes sensitive data)
 */
export const userSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
} satisfies Prisma.UserSelect

/**
 * Common select fields for Project list view
 */
export const projectListSelect = {
  id: true,
  name: true,
  clientUrl: true,
  industry: true,
  status: true,
  healthScore: true,
  createdAt: true,
  updatedAt: true,
  locations: {
    include: {
      location: true,
    },
  },
} satisfies Prisma.ProjectSelect

/**
 * Common select fields for Organization
 */
export const organizationSelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  primaryColor: true,
  subscriptionStatus: true,
  trialEndsAt: true,
  createdAt: true,
} satisfies Prisma.OrganizationSelect

/**
 * Transaction helper with automatic rollback on error
 */
export async function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(fn)
}

/**
 * Check if user has access to organization
 */
export async function hasOrgAccess(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      organizationId,
      isActive: true,
      deletedAt: null,
    },
  })
  return !!user
}

/**
 * Check if user has access to project
 */
export async function hasProjectAccess(
  userId: string,
  projectId: string
): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isActive: true,
      deletedAt: null,
      organization: {
        projects: {
          some: {
            id: projectId,
            deletedAt: null,
          },
        },
      },
    },
  })
  return !!user
}

/**
 * Get user's organization ID
 */
export async function getUserOrganizationId(
  userId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}
