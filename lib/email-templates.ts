export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function generateTeamInviteEmail(
  organizationName: string,
  organizationType: "agency" | "supplier",
  inviterName: string,
  inviteToken: string,
  role: string
): EmailTemplate {
  const roleDisplay = role.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())
  const orgTypeDisplay = organizationType === "agency" ? "Agency" : "Supplier"
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/accept?token=${inviteToken}`
  
  const subject = `You're invited to join ${organizationName} on Quote Portal`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Quote Portal!</h1>
          <p>You've been invited to join a team</p>
        </div>
        
        <div class="content">
          <h2>You're invited to join ${organizationName}</h2>
          
          <p>Hello!</p>
          
          <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> as a <strong>${roleDisplay}</strong> on Quote Portal.</p>
          
          <div class="highlight">
            <h3>What is Quote Portal?</h3>
            <p>Quote Portal is the complete B2B platform for event professionals. ${orgTypeDisplay === "Agency" ? "Agencies can send RFQs to multiple suppliers, streamline cost estimation, and generate qualified leads." : "Suppliers can receive qualified RFQ invitations, submit quotations, and manage their service profiles."}</p>
          </div>
          
          <p>As a <strong>${roleDisplay}</strong>, you'll be able to:</p>
          <ul>
            ${orgTypeDisplay === "Agency" ? `
              <li>Browse supplier directory</li>
              <li>Create and send RFQs</li>
              <li>Manage cost estimates</li>
              <li>Collaborate with your team</li>
            ` : `
              <li>Receive RFQ invitations</li>
              <li>Submit PDF quotations</li>
              <li>Manage your service profile</li>
              <li>Collaborate with your team</li>
            `}
          </ul>
          
          <div style="text-align: center;">
            <a href="${inviteUrl}" class="button">Accept Invitation</a>
          </div>
          
          <p><strong>Important:</strong> This invitation will expire in 7 days. If you don't have an account yet, you'll be able to create one when you accept the invitation.</p>
          
          <p>If you have any questions, feel free to reach out to ${inviterName} or contact our support team.</p>
          
          <p>Best regards,<br>The Quote Portal Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by Quote Portal. If you didn't expect this invitation, you can safely ignore this email.</p>
          <p>© 2024 Quote Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
Welcome to Quote Portal!

You've been invited to join ${organizationName}

Hello!

${inviterName} has invited you to join ${organizationName} as a ${roleDisplay} on Quote Portal.

What is Quote Portal?
Quote Portal is the complete B2B platform for event professionals. ${orgTypeDisplay === "Agency" ? "Agencies can send RFQs to multiple suppliers, streamline cost estimation, and generate qualified leads." : "Suppliers can receive qualified RFQ invitations, submit quotations, and manage their service profiles."}

As a ${roleDisplay}, you'll be able to:
${orgTypeDisplay === "Agency" ? `
- Browse supplier directory
- Create and send RFQs
- Manage cost estimates
- Collaborate with your team
` : `
- Receive RFQ invitations
- Submit PDF quotations
- Manage your service profile
- Collaborate with your team
`}

Accept your invitation: ${inviteUrl}

Important: This invitation will expire in 7 days. If you don't have an account yet, you'll be able to create one when you accept the invitation.

If you have any questions, feel free to reach out to ${inviterName} or contact our support team.

Best regards,
The Quote Portal Team

---
This email was sent by Quote Portal. If you didn't expect this invitation, you can safely ignore this email.
© 2024 Quote Portal. All rights reserved.
  `
  
  return { subject, html, text }
}

export function generateWelcomeEmail(
  organizationName: string,
  organizationType: "agency" | "supplier",
  userName: string
): EmailTemplate {
  const orgTypeDisplay = organizationType === "agency" ? "Agency" : "Supplier"
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`
  
  const subject = `Welcome to Quote Portal - Your ${orgTypeDisplay} is ready!`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .highlight { background: #d1fae5; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Quote Portal!</h1>
          <p>Your ${orgTypeDisplay} is ready to go</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName}!</h2>
          
          <p>Congratulations! Your ${orgTypeDisplay} <strong>${organizationName}</strong> has been successfully created on Quote Portal.</p>
          
          <div class="highlight">
            <h3>What's Next?</h3>
            <p>You're now ready to start using Quote Portal to ${organizationType === "agency" ? "connect with suppliers and manage your event procurement process" : "receive RFQ invitations and grow your business"}.</p>
          </div>
          
          <p>Here's what you can do now:</p>
          <ul>
            ${organizationType === "agency" ? `
              <li>Browse our supplier directory</li>
              <li>Create your first RFQ</li>
              <li>Invite team members to collaborate</li>
              <li>Manage your agency profile</li>
            ` : `
              <li>Complete your service profile</li>
              <li>Upload your business documents</li>
              <li>Invite team members to help</li>
              <li>Start receiving RFQ invitations</li>
            `}
          </ul>
          
          <div style="text-align: center;">
            <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
          </div>
          
          <p>Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/help">help center</a> or contact our support team.</p>
          
          <p>We're excited to have you on board!</p>
          
          <p>Best regards,<br>The Quote Portal Team</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Quote Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
🎉 Welcome to Quote Portal!

Hello ${userName}!

Congratulations! Your ${orgTypeDisplay} ${organizationName} has been successfully created on Quote Portal.

What's Next?
You're now ready to start using Quote Portal to ${organizationType === "agency" ? "connect with suppliers and manage your event procurement process" : "receive RFQ invitations and grow your business"}.

Here's what you can do now:
${organizationType === "agency" ? `
- Browse our supplier directory
- Create your first RFQ
- Invite team members to collaborate
- Manage your agency profile
` : `
- Complete your service profile
- Upload your business documents
- Invite team members to help
- Start receiving RFQ invitations
`}

Go to your dashboard: ${dashboardUrl}

Need help getting started? Check out our help center or contact our support team.

We're excited to have you on board!

Best regards,
The Quote Portal Team

---
© 2024 Quote Portal. All rights reserved.
  `
  
  return { subject, html, text }
}
