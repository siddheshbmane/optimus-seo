/**
 * Better Auth API Route Handler
 *
 * Handles all authentication endpoints. The POST handler wraps sign-out
 * with a fallback: if Better Auth errors (e.g. for demo sessions created
 * outside its session flow), cookies are cleared and success is returned
 * so the client is never stuck with a stale session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const { GET, POST: _POST } = toNextJsHandler(auth)

export { GET }

export async function POST(request: NextRequest) {
  const url = new URL(request.url)

  if (url.pathname.endsWith('/sign-out')) {
    let response: Response
    try {
      response = await _POST(request)
    } catch {
      response = new Response(null, { status: 500 })
    }

    // If sign-out failed for any reason, clear both possible cookie names
    // and return success so the client clears its session state.
    if (!response.ok) {
      const fallback = NextResponse.json({ success: true })
      const isProduction = process.env.NODE_ENV === 'production'
      // Clear the cookie with __Secure- prefix (used when useSecureCookies=true)
      fallback.cookies.set('__Secure-optimus.session_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      // Also clear without prefix (used in development / demo sessions)
      fallback.cookies.set('optimus.session_token', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      return fallback
    }
    return response
  }

  return _POST(request)
}
