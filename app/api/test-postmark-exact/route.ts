import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use the exact code you provided
    const postmark = require("postmark");
    
    // Send an email:
    const client = new postmark.ServerClient("5d6339de-4113-486f-a48c-8f9a2450dd37");

    const response = await client.sendEmail({
      "From": "invite@qouteportal.com",
      "To": "bereket@elenjicalsolutions.com",
      "Subject": "Hello from Postmark",
      "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
      "TextBody": "Hello from Postmark!",
      "MessageStream": "outbound"
    });

    return NextResponse.json({
      success: true,
      messageId: response.MessageID,
      to: response.To,
      submittedAt: response.SubmittedAt
    });
  } catch (error) {
    console.error("Exact Postmark test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code,
      errorDetails: error
    }, { status: 500 });
  }
}
