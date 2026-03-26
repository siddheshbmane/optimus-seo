/**
 * Email Templates
 *
 * Professional HTML email templates for Optimus SEO.
 * All templates use inline styles for maximum email-client compatibility.
 * Brand color: #FD8C73
 */

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------

const APP_NAME = 'Optimus SEO'
const BRAND_COLOR = '#FD8C73'
const BRAND_COLOR_DARK = '#e5775f'

function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background-color:${BRAND_COLOR};padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">${APP_NAME}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e4e4e7;text-align:center;">
            <p style="margin:0;color:#a1a1aa;font-size:13px;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function button(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;mso-padding-alt:0;text-align:center;" target="_blank">${text}</a>`
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

/**
 * Team invitation email.
 */
export function teamInviteEmail(params: {
  inviterName: string
  projectName: string
  role: string
  inviteUrl: string
}): EmailTemplate {
  const { inviterName, projectName, role, inviteUrl } = params

  const subject = `${inviterName} invited you to ${projectName} on ${APP_NAME}`

  const html = layout(`
    <h2 style="margin:0 0 16px;color:#18181b;font-size:20px;font-weight:600;">You've been invited</h2>
    <p style="margin:0 0 8px;color:#3f3f46;font-size:15px;line-height:1.6;">
      <strong>${inviterName}</strong> has invited you to join <strong>${projectName}</strong> as a <strong style="color:${BRAND_COLOR};">${role}</strong>.
    </p>
    <p style="margin:0 0 24px;color:#71717a;font-size:14px;line-height:1.6;">
      Accept the invitation below to get started with your SEO workspace.
    </p>
    <p style="margin:0 0 24px;">${button('Accept Invitation', inviteUrl)}</p>
    <p style="margin:0;color:#a1a1aa;font-size:13px;line-height:1.5;">
      Or copy this link: <a href="${inviteUrl}" style="color:${BRAND_COLOR_DARK};word-break:break-all;">${inviteUrl}</a>
    </p>
    <p style="margin:16px 0 0;color:#a1a1aa;font-size:13px;">
      If you weren't expecting this invitation, you can safely ignore this email.
    </p>
  `)

  const text = [
    `${inviterName} invited you to ${projectName} on ${APP_NAME}`,
    '',
    `Role: ${role}`,
    '',
    `Accept the invitation: ${inviteUrl}`,
    '',
    'If you were not expecting this invitation, you can safely ignore this email.',
  ].join('\n')

  return { subject, html, text }
}

/**
 * Report ready for download email.
 */
export function reportReadyEmail(params: {
  reportName: string
  reportType: string
  downloadUrl: string
}): EmailTemplate {
  const { reportName, reportType, downloadUrl } = params

  const subject = `Your ${reportType} report is ready - ${APP_NAME}`

  const html = layout(`
    <h2 style="margin:0 0 16px;color:#18181b;font-size:20px;font-weight:600;">Report Ready</h2>
    <p style="margin:0 0 8px;color:#3f3f46;font-size:15px;line-height:1.6;">
      Your <strong>${reportType}</strong> report <strong>"${reportName}"</strong> has been generated and is ready to download.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 24px;background-color:#fafafa;border-radius:8px;border:1px solid #e4e4e7;width:100%;">
      <tr>
        <td style="padding:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#71717a;font-size:13px;padding-right:12px;vertical-align:top;">Report:</td>
              <td style="color:#18181b;font-size:14px;font-weight:500;">${reportName}</td>
            </tr>
            <tr>
              <td style="color:#71717a;font-size:13px;padding-right:12px;padding-top:8px;vertical-align:top;">Type:</td>
              <td style="color:#18181b;font-size:14px;font-weight:500;padding-top:8px;">${reportType}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;">${button('Download Report', downloadUrl)}</p>
    <p style="margin:0;color:#a1a1aa;font-size:13px;">
      Or copy this link: <a href="${downloadUrl}" style="color:${BRAND_COLOR_DARK};word-break:break-all;">${downloadUrl}</a>
    </p>
  `)

  const text = [
    `Your ${reportType} report "${reportName}" is ready.`,
    '',
    `Download it here: ${downloadUrl}`,
  ].join('\n')

  return { subject, html, text }
}

/**
 * SEO audit complete email.
 */
export function auditCompleteEmail(params: {
  projectName: string
  healthScore: number
  issuesFound: number
  auditUrl: string
}): EmailTemplate {
  const { projectName, healthScore, issuesFound, auditUrl } = params

  const scoreColor = healthScore >= 80 ? '#22c55e' : healthScore >= 50 ? '#eab308' : '#ef4444'
  const subject = `Audit complete for ${projectName} - Score: ${healthScore}/100`

  const html = layout(`
    <h2 style="margin:0 0 16px;color:#18181b;font-size:20px;font-weight:600;">SEO Audit Complete</h2>
    <p style="margin:0 0 16px;color:#3f3f46;font-size:15px;line-height:1.6;">
      The SEO audit for <strong>${projectName}</strong> has finished. Here is a quick summary:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
      <tr>
        <!-- Health Score -->
        <td style="width:50%;padding:0 8px 0 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#fafafa;border-radius:8px;border:1px solid #e4e4e7;">
            <tr><td style="padding:20px;text-align:center;">
              <p style="margin:0 0 4px;color:#71717a;font-size:13px;">Health Score</p>
              <p style="margin:0;font-size:36px;font-weight:700;color:${scoreColor};">${healthScore}</p>
              <p style="margin:0;color:#a1a1aa;font-size:12px;">out of 100</p>
            </td></tr>
          </table>
        </td>
        <!-- Issues Found -->
        <td style="width:50%;padding:0 0 0 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#fafafa;border-radius:8px;border:1px solid #e4e4e7;">
            <tr><td style="padding:20px;text-align:center;">
              <p style="margin:0 0 4px;color:#71717a;font-size:13px;">Issues Found</p>
              <p style="margin:0;font-size:36px;font-weight:700;color:#18181b;">${issuesFound}</p>
              <p style="margin:0;color:#a1a1aa;font-size:12px;">to review</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;">${button('View Full Audit', auditUrl)}</p>
    <p style="margin:0;color:#a1a1aa;font-size:13px;">
      Or copy this link: <a href="${auditUrl}" style="color:${BRAND_COLOR_DARK};word-break:break-all;">${auditUrl}</a>
    </p>
  `)

  const text = [
    `SEO Audit Complete for ${projectName}`,
    '',
    `Health Score: ${healthScore}/100`,
    `Issues Found: ${issuesFound}`,
    '',
    `View the full audit: ${auditUrl}`,
  ].join('\n')

  return { subject, html, text }
}
