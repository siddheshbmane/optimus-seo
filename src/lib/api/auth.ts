/**
 * API Authentication Utilities
 * 
 * Helpers for authenticating API requests and checking permissions.
 */

import { headers } from 'next/headers'
import { auth, hasPermission, type Role } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { errors } from './response'

// Session with user and organization info
export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    role: Role
    organizationId: string
  }
  organizationId: string
}

/**
 * Get the current authenticated session from the request
 * Returns null if not authenticated
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return null
    }

    // Get the user's organization from our database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        organizationId: user.organizationId,
      },
      organizationId: user.organizationId,
    }
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

/**
 * Require authentication for an API route
 * Returns the session or throws an error response
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession()
  
  if (!session) {
    throw errors.unauthorized()
  }
  
  return session
}

/**
 * Require a specific permission for an API route
 */
export async function requirePermission(permission: string): Promise<AuthSession> {
  const session = await requireAuth()
  
  if (!hasPermission(session.user.role, permission)) {
    throw errors.forbidden()
  }
  
  return session
}

/**
 * Check if user has access to a specific project
 */
export async function requireProjectAccess(projectId: string): Promise<AuthSession> {
  const session = await requireAuth()
  
  // Check if project belongs to user's organization
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: session.organizationId,
      deletedAt: null,
    },
    select: { id: true },
  })
  
  if (!project) {
    throw errors.notFound('Project')
  }
  
  return session
}

/**
 * Wrapper for API route handlers with authentication
 */
export function withAuth<T>(
  handler: (session: AuthSession, ...args: T[]) => Promise<Response>
) {
  return async (...args: T[]): Promise<Response> => {
    try {
      const session = await requireAuth()
      return await handler(session, ...args)
    } catch (error) {
      if (error instanceof Response) {
        return error
      }
      console.error('API error:', error)
      return errors.internalError()
    }
  }
}

/**
 * Wrapper for API route handlers with permission check
 */
export function withPermission<T>(
  permission: string,
  handler: (session: AuthSession, ...args: T[]) => Promise<Response>
) {
  return async (...args: T[]): Promise<Response> => {
    try {
      const session = await requirePermission(permission)
      return await handler(session, ...args)
    } catch (error) {
      if (error instanceof Response) {
        return error
      }
      console.error('API error:', error)
      return errors.internalError()
    }
  }
}
