import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth, DEMO_MODE, DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Check if demo mode is enabled
  if (!DEMO_MODE) {
    return NextResponse.json(
      { error: 'Demo mode is not enabled' },
      { status: 403 }
    )
  }

  try {
    // Ensure demo organization exists
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

    // Check if demo user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
    })

    if (!existingUser) {
      // Create demo user through Better Auth's signUp (creates User + Account properly)
      try {
        await auth.api.signUpEmail({
          body: {
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
            name: 'Demo User',
          },
        })
      } catch (signupError) {
        console.log('Demo user signup attempt:', signupError)
      }

      // Link demo user to demo org
      const newUser = await prisma.user.findUnique({
        where: { email: DEMO_EMAIL },
      })
      if (newUser) {
        await prisma.user.update({
          where: { id: newUser.id },
          data: { organizationId: demoOrg.id, role: 'admin' },
        })
      }

      // Create a demo project
      if (newUser) {
        const existingProject = await prisma.project.findFirst({
          where: { organizationId: demoOrg.id },
        })
        if (!existingProject) {
          await prisma.project.create({
            data: {
              name: 'Demo Website',
              clientUrl: 'https://demo-website.com',
              organizationId: demoOrg.id,
              createdById: newUser.id,
              status: 'created',
            },
          })
        }
      }
    }

    // Sign in through Better Auth with asResponse to get proper Set-Cookie headers
    const signInResponse = await auth.api.signInEmail({
      body: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
      asResponse: true,
    })

    // Clone the response to read body while preserving headers
    const authData = await signInResponse.json()

    const response = NextResponse.json({
      success: true,
      user: authData.user || { email: DEMO_EMAIL, name: 'Demo User' },
      redirectTo: '/dashboard',
    })

    // Forward all Set-Cookie headers from Better Auth's response
    const setCookies = signInResponse.headers.getSetCookie?.() || []
    for (const cookie of setCookies) {
      response.headers.append('Set-Cookie', cookie)
    }

    return response
  } catch (error) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { error: 'Failed to create demo session' },
      { status: 500 }
    )
  }
}
