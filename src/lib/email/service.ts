/**
 * Email Service
 *
 * Centralized email delivery for Optimus SEO.
 * Reuses the same SMTP configuration as Better Auth magic links.
 * Falls back to console logging when SMTP is not configured.
 */

import nodemailer from 'nodemailer'

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  mock?: boolean
}

/**
 * Create a Nodemailer transporter from environment variables.
 * Returns null when no SMTP credentials are available.
 */
function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Fallback: Gmail shorthand (matches auth/index.ts pattern)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  return null
}

const transporter = createTransporter()

/**
 * Send an email via SMTP.
 * When no SMTP configuration is present the email is logged to the console
 * so development works without credentials.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  if (!transporter) {
    console.log(`[Email] Would send to ${options.to}: ${options.subject}`)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Email] HTML preview:\n${options.html.slice(0, 500)}...`)
    }
    return { success: true, mock: true }
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || 'Optimus SEO <noreply@optimus-seo.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.text ? { text: options.text } : {}),
    })

    return { success: true, messageId: result.messageId }
  } catch (err) {
    console.error('[Email] Failed to send:', err)
    throw err
  }
}
