import { ServerClient } from 'postmark';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);
    
    // Test basic email sending
    const response = await client.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL || 'invites@qouteportal.com',
      To: 'bereket.demeke89@gmail.com', // Try Gmail
      Subject: 'Test Email from Quote Portal',
      HtmlBody: '<h1>Test Email</h1><p>This is a test email to verify Postmark is working.</p>',
      TextBody: 'Test Email - This is a test email to verify Postmark is working.'
    });

    return NextResponse.json({ 
      success: true, 
      message: "Direct Postmark test email sent",
      messageId: response.MessageID,
      to: response.To
    });
  } catch (error) {
    console.error("Postmark test error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
