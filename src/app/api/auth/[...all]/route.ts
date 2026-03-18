/**
 * Better Auth API Route Handler
 * 
 * This catch-all route handles all authentication endpoints:
 * - POST /api/auth/sign-in/magic-link - Send magic link
 * - GET /api/auth/magic-link/verify - Verify magic link
 * - POST /api/auth/sign-in/social - Social sign in
 * - GET /api/auth/callback/:provider - OAuth callback
 * - POST /api/auth/sign-out - Sign out
 * - GET /api/auth/session - Get current session
 * 
 * @see https://www.better-auth.com/docs/integrations/next
 */

import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
