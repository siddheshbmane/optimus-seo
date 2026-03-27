/**
 * Super Admin Authentication Utilities
 */
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { errors } from './response'

export interface SuperAdminSession {
  user: {
    id: string
    email: string
    name: string
    isSuperAdmin: boolean
  }
}

/**
 * Require super admin access for an API route
 */
export async function requireSuperAdmin(): Promise<SuperAdminSession> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      throw errors.unauthorized()
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, isSuperAdmin: true },
    })

    if (!user || !user.isSuperAdmin) {
      throw errors.forbidden()
    }

    return { user }
  } catch (error) {
    if (error instanceof Response) throw error
    console.error('Super admin auth error:', error)
    throw errors.unauthorized()
  }
}
