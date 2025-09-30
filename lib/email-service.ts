import { ServerClient } from 'postmark';
import { generateTeamInviteEmail, generateRfqInviteEmail, generateQuotationReceivedEmail } from './email-templates';

const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);

interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
  textBody,
}: SendEmailParams) {
  try {
    const response = await client.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL || 'noreply@quoteportal.com',
      To: to,
      Subject: subject,
      HtmlBody: htmlBody,
      TextBody: textBody,
    });
    
    console.log(`Email sent successfully to ${to}:`, response.MessageID);
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
