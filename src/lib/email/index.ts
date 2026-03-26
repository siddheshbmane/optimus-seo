/**
 * Email module barrel export.
 */

export { sendEmail, type SendEmailOptions, type SendEmailResult } from './service'
export {
  teamInviteEmail,
  reportReadyEmail,
  auditCompleteEmail,
  type EmailTemplate,
} from './templates'
