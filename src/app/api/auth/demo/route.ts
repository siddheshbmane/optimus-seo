/**
 * Demo Login API Route
 * 
 * Provides a bypass authentication for demo/testing purposes.
 * Only works when DEMO_MODE=true in environment variables.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth, DEMO_MODE, DEMO_EMAIL } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Check if demo mode is enabled
  if (!DEMO_MODE) {
    return NextResponse.json(
      { error: 'Demo mode is not enabled' },
      { status: 403 }
    )
  }

  try {
    // Find or create demo organization first
    let demoOrg = await prisma.organization.findUnique({
      where: { slug: 'demo-org' },
    })

    if (!demoOrg) {
      demoOrg = await prisma.organization.create({
        data: {
          name: 'Demo Organization',
          slug: 'demo-org',
        },
      })
    }

    // Find or create demo user
    let demoUser = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
    })

    if (!demoUser) {
      // Create demo user with organization (role 'admin' maps to owner-level access)
      demoUser = await prisma.user.create({
        data: {
          email: DEMO_EMAIL,
          name: 'Demo User',
          role: 'admin',
          organizationId: demoOrg.id,
        },
      })

      // Create a demo project
      await prisma.project.create({
        data: {
          name: 'Demo Website',
          clientUrl: 'https://demo-website.com',
          organizationId: demoOrg.id,
          createdById: demoUser.id,
          status: 'created',
        },
      })
    }

    // Create session manually
    const session = await prisma.session.create({
      data: {
        userId: demoUser.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
      },
      redirectTo: '/dashboard',
    })

    // Set the session cookie
    response.cookies.set('optimus.session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { error: 'Failed to create demo session' },
      { status: 500 }
    )
  }
}
