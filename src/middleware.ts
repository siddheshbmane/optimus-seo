/**
 * Next.js Middleware
 * 
 * Handles authentication and route protection.
 * 
 * Protected routes:
 * - /dashboard/*
 * - /projects/*
 * - /agents/*
 * - /reports/*
 * - /settings/*
 * 
 * Public routes:
 * - / (marketing)
 * - /login
 * - /signup
 * - /api/auth/*
 * - /(marketing)/*
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/projects',
  '/agents',
  '/reports',
  '/settings',
  '/approvals',
]

// Routes that are always public
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/api/auth',
  '/home',
  '/pricing',
  '/about',
  '/contact',
  '/features',
  '/security',
  '/careers',
  '/blog',
  '/customers',
  '/integrations',
  '/docs',
  '/privacy',
  '/terms',
  '/cookies',
  '/sla',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Allow API routes to pass through (Better Auth handles its own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Allow static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // For protected routes, check authentication
  if (isProtectedRoute) {
    // Get the session cookie
    const sessionCookie = request.cookies.get('optimus.session_token')
    
    if (!sessionCookie) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Session exists, allow access
    // Note: Full session validation happens in the API routes
    return NextResponse.next()
  }
  
  // For public routes, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Default: allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
