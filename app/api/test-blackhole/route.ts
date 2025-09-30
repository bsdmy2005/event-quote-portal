import { ServerClient } from 'postmark';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);
    
    // Test with Postmark's blackhole email
    const response = await client.sendEmail({
      From: "invite@qouteportal.com",
      To: "bereket@outlook.com",
      Subject: "Test to Blackhole",
      TextBody: "This is a test email to Postmark's blackhole address.",
      MessageStream: "outbound"
    });

    return NextResponse.json({
      success: true,
      messageId: response.MessageID,
      to: response.To,
      submittedAt: response.SubmittedAt,
      from: "invite@qouteportal.com",
      note: "This email goes to Postmark's blackhole - it will be accepted but not delivered"
    });
  } catch (error) {
    console.error("Blackhole test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code
    }, { status: 500 });
  }
}
