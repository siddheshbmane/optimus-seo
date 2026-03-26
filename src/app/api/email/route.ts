/**
 * Email API Route
 *
 * POST /api/email
 * Sends transactional emails (invitations, reports, audit notifications).
 * Requires authentication.
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/api/auth'
import { validateBody } from '@/lib/api/validation'
import { success, errors } from '@/lib/api/response'
import { sendEmail } from '@/lib/email/service'
import {
  teamInviteEmail,
  reportReadyEmail,
  auditCompleteEmail,
} from '@/lib/email/templates'

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const inviteParamsSchema = z.object({
  to: z.string().email(),
  inviterName: z.string().min(1),
  projectName: z.string().min(1),
  role: z.string().min(1),
  inviteUrl: z.string().url(),
})

const reportParamsSchema = z.object({
  to: z.string().email(),
  reportName: z.string().min(1),
  reportType: z.string().min(1),
  downloadUrl: z.string().url(),
})

const auditParamsSchema = z.object({
  to: z.string().email(),
  projectName: z.string().min(1),
  healthScore: z.number().int().min(0).max(100),
  issuesFound: z.number().int().min(0),
  auditUrl: z.string().url(),
})

const emailRequestSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('invite'), params: inviteParamsSchema }),
  z.object({ type: z.literal('report'), params: reportParamsSchema }),
  z.object({ type: z.literal('audit'), params: auditParamsSchema }),
])

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    // Validate body
    const body = await validateBody(request, emailRequestSchema)

    let template: { subject: string; html: string; text: string }
    let to: string

    switch (body.type) {
      case 'invite': {
        const { to: recipient, ...templateParams } = body.params
        to = recipient
        template = teamInviteEmail(templateParams)
        break
      }
      case 'report': {
        const { to: recipient, ...templateParams } = body.params
        to = recipient
        template = reportReadyEmail(templateParams)
        break
      }
      case 'audit': {
        const { to: recipient, ...templateParams } = body.params
        to = recipient
        template = auditCompleteEmail(templateParams)
        break
      }
    }

    const result = await sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    return success(result)
  } catch (error) {
    if (error instanceof Response) {
      return error
    }
    console.error('Failed to send email:', error)
    return errors.internalError('Failed to send email')
  }
}
