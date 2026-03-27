/**
 * Super Admin Auth Check API
 *
 * GET /api/super-admin/auth/check - Verify current user is a super admin
 */

import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/api/super-admin'

export async function GET() {
  try {
    const session = await requireSuperAdmin()
    return NextResponse.json({ success: true, data: { user: session.user } })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
}
