/**
 * Better Auth API Route Handler
 *
 * Handles all authentication endpoints. The POST handler wraps the
 * standard Better Auth handler with a sign-out fallback: if Better Auth
 * throws (e.g. for demo sessions created outside its own session flow),
 * the cookie is cleared and a success response is returned so the client
 * is never stuck with a stale session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const { GET, POST: _POST } = toNextJsHandler(auth)

export { GET }

export async function POST(request: NextRequest) {
  // For sign-out, catch errors and clear cookie regardless
  const url = new URL(request.url)
  if (url.pathname.endsWith('/sign-out')) {
    try {
      return await _POST(request)
    } catch {
      // Better Auth threw (e.g. demo session not in its own session store).
      // Clear the cookie manually and return success so the client signs out.
      const response = NextResponse.json({ success: true })
      response.cookies.set('optimus.session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      return response
    }
  }

  return _POST(request)
}
