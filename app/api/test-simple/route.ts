import { ServerClient } from 'postmark';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);
    
    // Very simple test email
    const response = await client.sendEmail({
      From: "invite@qouteportal.com",
      To: "bereket@elenjicalsolutions.com",
      Subject: "Simple Test",
      TextBody: "This is a simple test email.",
      MessageStream: "outbound"
    });

    return NextResponse.json({
      success: true,
      messageId: response.MessageID,
      to: response.To,
      submittedAt: response.SubmittedAt
    });
  } catch (error) {
    console.error("Simple test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code
    }, { status: 500 });
  }
}
