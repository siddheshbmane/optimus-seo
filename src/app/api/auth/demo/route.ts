import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { DEMO_MODE } from '@/lib/auth'
import { randomUUID } from 'crypto'

const DEMO_EMAIL = 'demo@optimus-seo.com'
const DEV_ORG_ID = '00000000-0000-0000-0000-000000000001'

export async function POST(request: NextRequest) {
  if (!DEMO_MODE) {
    return NextResponse.json(
      { error: 'Demo mode is not enabled' },
      { status: 403 }
    )
  }

  try {
    // Ensure dev organization exists (matches seed.ts)
    let demoOrg = await prisma.organization.findUnique({
      where: { id: DEV_ORG_ID },
    })

    if (!demoOrg) {
      demoOrg = await prisma.organization.create({
        data: {
          id: DEV_ORG_ID,
          name: 'Development Organization',
          slug: 'dev-org',
        },
      })
    }

    // Find or create demo user
    let demoUser = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
    })

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          email: DEMO_EMAIL,
          name: 'Demo User',
          emailVerified: true,
          organizationId: demoOrg.id,
          role: 'admin',
        },
      })
    }

    // Create a fresh session directly in the database
    const sessionToken = randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: demoUser.id,
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'demo-browser',
      },
    })

    const response = NextResponse.json({
      success: true,
      user: { email: demoUser.email, name: demoUser.name },
      redirectTo: '/dashboard',
    })

    // Set session cookie (matching Better Auth's cookie format: optimus.session_token)
    response.cookies.set('optimus.session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
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
