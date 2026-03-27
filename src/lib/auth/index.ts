/**
 * Better Auth Configuration
 * 
 * This module configures authentication for Optimus SEO using Better Auth.
 * Supports:
 * - Magic link (passwordless) authentication via Nodemailer
 * - Email/Password authentication
 * - Google OAuth
 * - Organization-based multi-tenancy
 * - Role-based access control
 * - Demo bypass mode for testing
 * 
 * @see https://www.better-auth.com/docs
 */

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { organization, magicLink } from 'better-auth/plugins'
import { prisma } from '@/lib/db'
import nodemailer from 'nodemailer'

// Check if demo mode is enabled
export const DEMO_MODE = process.env.DEMO_MODE === 'true'
export const DEMO_EMAIL = 'demo@optimus-seo.com'
export const DEMO_PASSWORD = 'demo123!@#Secure'

// Create Nodemailer transporter
const createTransporter = () => {
  // Use SMTP settings from environment
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  
  // Use Gmail if configured
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }
  
  // Fallback: Use Ethereal for testing (emails go to ethereal.email)
  return null
}

const transporter = createTransporter()

// Send email function
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!transporter) {
    console.log(`\n📧 Email would be sent to: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Content: ${html}\n`)
    return
  }
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Optimus SEO <noreply@optimus-seo.com>',
    to,
    subject,
    html,
  })
}

export const auth = betterAuth({
  // Database adapter
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  
  // Email & Password enabled for demo mode and regular signup
  emailAndPassword: {
    enabled: true,
    // Auto sign-in after signup
    autoSignIn: true,
    // Enable password reset flow
    sendResetPassword: async ({ user, url }) => {
      console.log(`\n🔑 Password Reset for ${user.email}:\n${url}\n`)
      if (!transporter) return
      try {
        await sendEmail({
          to: user.email,
          subject: 'Reset your Optimus SEO password',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #FD8C73;">Optimus SEO</h2>
              <p>Click the button below to reset your password:</p>
              <a href="${url}" style="display: inline-block; background: #FD8C73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                Reset Password
              </a>
              <p style="color: #666; font-size: 14px;">
                This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        })
      } catch (err) {
        console.error(`[Auth] Failed to send password reset email to ${user.email}:`, err)
      }
    },
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
        // Always log the magic link for debugging (visible in Vercel logs)
        console.log(`\n🔗 Magic Link for ${email}:\n${url}\n`)

        // If no transporter, skip email silently (demo/dev mode)
        if (!transporter) {
          return
        }

        // Attempt to send via Nodemailer — never throw (graceful degradation)
        try {
          await sendEmail({
            to: email,
            subject: 'Sign in to Optimus SEO',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FD8C73;">Optimus SEO</h2>
                <p>Click the button below to sign in to your account:</p>
                <a href="${url}" style="display: inline-block; background: #FD8C73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                  Sign In
                </a>
                <p style="color: #666; font-size: 14px;">
                  This link expires in 10 minutes. If you didn't request this, you can safely ignore this email.
                </p>
                <p style="color: #666; font-size: 14px;">
                  Or copy this link: ${url}
                </p>
              </div>
            `,
          })
        } catch (err) {
          // Log but don't throw — prevents 500 when SMTP fails
          console.error(`[Auth] Failed to send magic link email to ${email}:`, err)
        }
      },
    }),
    
    // Organization plugin for multi-tenancy
    organization({
      // Allow users to create organizations
      allowUserToCreateOrganization: true,
    }),
  ],
  
  // User fields mapping
  // NOTE: 'role' is NOT listed here — it's a PostgreSQL enum on the DB with a
  // default value of 'executive'. Including it in additionalFields causes
  // Better Auth to attempt a raw string insert which fails the enum cast.
  user: {
    // Map Better Auth's 'image' field to our schema's 'avatarUrl' column.
    // Without this, Better Auth tries to INSERT an 'image' column that doesn't
    // exist in our Prisma schema, causing a silent FAILED_TO_CREATE_USER error.
    fields: {
      image: 'avatarUrl',
    },
    additionalFields: {
      avatarUrl: {
        type: 'string',
        required: false,
      },
    },
  },

  // Enable verbose logging so Prisma errors are visible in Vercel logs
  logger: {
    level: 'error',
    disabled: false,
  },
  
  // Rate limiting
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },
  
  // Auto-create organization for new users
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // Check if user already has an org (e.g., demo user)
            const existingUser = await prisma.user.findUnique({
              where: { id: user.id },
              select: { organizationId: true },
            })
            if (existingUser?.organizationId) return

            // Create a personal organization
            const org = await prisma.organization.create({
              data: {
                name: `${user.name || 'My'}'s Organization`,
                slug: `org-${user.id.slice(0, 8)}`,
              },
            })
            // Link user to the organization
            await prisma.user.update({
              where: { id: user.id },
              data: { organizationId: org.id },
            })
          } catch (error) {
            console.error('Failed to auto-create organization:', error)
          }
        },
      },
    },
  },

  // Advanced options
  advanced: {
    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === 'production',

    // Cookie prefix
    cookiePrefix: 'optimus',

    // Generate UUID-format IDs — required because Prisma schema uses @db.Uuid
    // Without this, Better Auth generates short alphanumeric IDs that fail PostgreSQL UUID cast
    generateId: ({ model: _model, size: _size }: { model: string; size?: number }) => {
      return crypto.randomUUID()
    },

    // Also tell the database adapter to use UUIDs
    database: {
      generateId: 'uuid' as const,
    },

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
