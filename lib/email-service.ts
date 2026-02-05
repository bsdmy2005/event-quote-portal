import { ServerClient } from 'postmark';
import { generateTeamInviteEmail, generateRfqInviteEmail, generateQuotationReceivedEmail } from './email-templates';

const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);

interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}

/**
 * Validate email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize email address - remove any potentially dangerous characters
 */
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validate and sanitize email parameters before sending
 */
function validateEmailParams(params: SendEmailParams): { valid: boolean; error?: string } {
  // Validate email address
  const sanitizedEmail = sanitizeEmail(params.to);
  if (!isValidEmail(sanitizedEmail)) {
    return { valid: false, error: 'Invalid email address format' };
  }

  // Validate subject
  if (!params.subject || params.subject.trim().length === 0) {
    return { valid: false, error: 'Email subject is required' };
  }

  if (params.subject.length > 200) {
    return { valid: false, error: 'Email subject is too long (max 200 characters)' };
  }

  // Validate body content
  if (!params.htmlBody || params.htmlBody.trim().length === 0) {
    return { valid: false, error: 'Email HTML body is required' };
  }

  if (!params.textBody || params.textBody.trim().length === 0) {
    return { valid: false, error: 'Email text body is required' };
  }

  // Check for suspicious content patterns (basic check)
  // Only match actual HTML event handler attributes (preceded by space/tag, followed by quote)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /\s+on(click|error|load|mouseover|mouseout|focus|blur|change|submit|keydown|keyup|keypress)\s*=/i,
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(params.htmlBody))) {
    return { valid: false, error: 'Email contains potentially unsafe content' };
  }

  return { valid: true };
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
  textBody,
}: SendEmailParams) {
  // Validate all parameters before sending
  const validation = validateEmailParams({ to, subject, htmlBody, textBody });
  if (!validation.valid) {
    throw new Error(`Email validation failed: ${validation.error}`);
  }

  // Sanitize email address
  const sanitizedEmail = sanitizeEmail(to);

  try {
    const response = await client.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL || 'noreply@quoteportal.com',
      To: sanitizedEmail,
      Subject: subject.trim(),
      HtmlBody: htmlBody,
      TextBody: textBody,
    });
    
    console.log(`Email sent successfully to ${sanitizedEmail}:`, response.MessageID);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendTeamInviteEmail({
  to,
  organizationName,
  organizationType,
  inviterName,
  role,
}: {
  to: string;
  organizationName: string;
  organizationType: "agency" | "supplier";
  inviterName: string;
  role: string;
}) {
  const emailTemplate = generateTeamInviteEmail(
    organizationName,
    organizationType,
    inviterName,
    '', // No token needed
    role
  );

  return sendEmail({
    to,
    subject: emailTemplate.subject,
    htmlBody: emailTemplate.html,
    textBody: emailTemplate.text,
  });
}

// RFQ Email Functions
export async function sendRfqInviteEmail({
  to,
  rfqTitle,
  clientName,
  agencyName,
  deadline,
  rfqUrl,
}: {
  to: string;
  rfqTitle: string;
  clientName: string;
  agencyName: string;
  deadline: string;
  rfqUrl: string;
}) {
  const emailTemplate = generateRfqInviteEmail(
    rfqTitle,
    clientName,
    agencyName,
    deadline,
    rfqUrl
  );

  return sendEmail({
    to,
    subject: emailTemplate.subject,
    htmlBody: emailTemplate.html,
    textBody: emailTemplate.text,
  });
}

export async function sendQuotationReceivedEmail({
  to,
  rfqTitle,
  supplierName,
  agencyName,
  quotationUrl,
}: {
  to: string;
  rfqTitle: string;
  supplierName: string;
  agencyName: string;
  quotationUrl: string;
}) {
  const emailTemplate = generateQuotationReceivedEmail(
    rfqTitle,
    supplierName,
    agencyName,
    quotationUrl
  );

  return sendEmail({
    to,
    subject: emailTemplate.subject,
    htmlBody: emailTemplate.html,
    textBody: emailTemplate.text,
  });
}
