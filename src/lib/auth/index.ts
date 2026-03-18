/**
 * Better Auth Configuration
 * 
 * This module configures authentication for Optimus SEO using Better Auth.
 * Supports:
 * - Magic link (passwordless) authentication
 * - Google OAuth
 * - Organization-based multi-tenancy
 * - Role-based access control
 * 
 * @see https://www.better-auth.com/docs
 */

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { organization, magicLink } from 'better-auth/plugins'
import { prisma } from '@/lib/db'

export const auth = betterAuth({
  // Database adapter
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  
  // Email & Password disabled - we use magic links
  emailAndPassword: {
    enabled: false,
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  
  // Plugins
  plugins: [
    // Magic link authentication
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // In development, log the magic link
        if (process.env.NODE_ENV === 'development') {
          console.log(`\n🔗 Magic Link for ${email}:\n${url}\n`)
          return
        }
        
        // In production, send via Resend
        // TODO: Implement Resend integration
        console.log(`Sending magic link to ${email}`)
      },
    }),
    
    // Organization plugin for multi-tenancy
    organization({
      // Allow users to create organizations
      allowUserToCreateOrganization: true,
    }),
  ],
  
  // User fields mapping
  user: {
    additionalFields: {
      avatarUrl: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'executive',
      },
    },
  },
  
  // Rate limiting
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },
  
  // Advanced options
  advanced: {
    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === 'production',
    
    // Cookie prefix
    cookiePrefix: 'optimus',
    
    // Generate session token
    generateSessionToken: () => {
      return crypto.randomUUID()
    },
  },
})

// Export auth types
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

/**
 * Role-based permissions (handled at application level)
 * 
 * These are checked in API routes and middleware, not in Better Auth.
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ['*'],
  admin: [
    'project:*',
    'user:read',
    'user:invite',
    'user:remove',
    'settings:read',
    'settings:update',
    'agent:*',
    'content:*',
    'report:*',
  ],
  strategist: [
    'project:*',
    'content:approve',
    'content:read',
    'agent:read',
    'agent:run',
    'report:*',
  ],
  executive: [
    'project:read',
    'content:*',
    'agent:read',
    'agent:run',
    'report:read',
  ],
  sales: [
    'project:read',
    'project:create',
    'audit:run',
    'pitch:*',
    'proposal:*',
    'report:read',
  ],
  viewer: [
    'project:read',
    'content:read',
    'report:read',
  ],
}

export type Role = 'owner' | 'admin' | 'strategist' | 'executive' | 'sales' | 'viewer'

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || []
  
  // Owner has all permissions
  if (permissions.includes('*')) return true
  
  // Check exact match
  if (permissions.includes(permission)) return true
  
  // Check wildcard match (e.g., 'project:*' matches 'project:read')
  const [resource] = permission.split(':')
  const wildcardPermission = `${resource}:*`
  if (permissions.includes(wildcardPermission)) return true
  
  return false
}
