/**
 * API Authentication Utilities
 * 
 * Helpers for authenticating API requests and checking permissions.
 * In development mode, provides a mock session for testing without auth.
 */

import { headers } from 'next/headers'
import { auth, hasPermission, type Role } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { errors } from './response'

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Session with user and organization info
export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    role: Role
    organizationId: string
    isSuperAdmin?: boolean
  }
  organizationId: string
}

// Mock session for development (UUIDs must match prisma/seed.ts)
const MOCK_DEV_SESSION: AuthSession = {
  user: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'dev@optimus-seo.local',
    name: 'Development User',
    role: 'owner' as Role,
    organizationId: '00000000-0000-0000-0000-000000000001',
    isSuperAdmin: true,
  },
  organizationId: '00000000-0000-0000-0000-000000000001',
}

/**
 * Get the current authenticated session from the request
 * Returns null if not authenticated
 * In development mode, returns a mock session if no real session exists
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      // In development, return mock session for easier testing
      if (isDevelopment) {
        console.log('[Dev Mode] Using mock session for API request')
        return MOCK_DEV_SESSION
      }
      // In demo mode, try direct DB session lookup as fallback
      if (process.env.DEMO_MODE === 'true') {
        try {
          const headersList = await headers()
          const cookieHeader = headersList.get('cookie') || ''
          // Look for Better Auth's cookie format
          const sessionToken = cookieHeader
            .split(';')
            .map(c => c.trim())
            .find(c => c.startsWith('optimus.session_token='))
            ?.split('=')[1]

          if (sessionToken) {
            const dbSession = await prisma.session.findUnique({
              where: { token: sessionToken },
              include: { user: true },
            })
            if (dbSession && dbSession.expiresAt > new Date() && dbSession.user) {
              return {
                user: {
                  id: dbSession.user.id,
                  email: dbSession.user.email,
                  name: dbSession.user.name,
                  role: (dbSession.user.role || 'executive') as Role,
                  organizationId: dbSession.user.organizationId || '',
                },
                organizationId: dbSession.user.organizationId || '',
              }
            }
          }
        } catch (demoError) {
          console.error('[Demo Mode] Direct session lookup failed:', demoError)
        }
      }

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
        isSuperAdmin: true,
      },
    })

    if (!user) {
      // In development, return mock session if user not found in DB
      if (isDevelopment) {
        console.log('[Dev Mode] User not found in DB, using mock session')
        return MOCK_DEV_SESSION
      }
      return null
    }

    if (!user.organizationId) {
      // User exists but has no org yet (signup hook may not have completed)
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        organizationId: user.organizationId,
        isSuperAdmin: user.isSuperAdmin,
      },
      organizationId: user.organizationId,
    }
  } catch (error) {
    console.error('Failed to get session:', error)
    // In development, return mock session on error
    if (isDevelopment) {
      console.log('[Dev Mode] Auth error, using mock session:', error)
      return MOCK_DEV_SESSION
    }
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
