import { ServerClient } from 'postmark';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);
    
    // Test server connection first
    const serverInfo = await client.getServer();
    
    // Then try to send email
    const response = await client.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL || 'invite@qouteportal.com',
      To: 'bereket@gmail.com',
      Subject: 'Direct Postmark Test',
      HtmlBody: '<h1>Test</h1><p>Direct test</p>',
      TextBody: 'Test - Direct test'
    });

    return NextResponse.json({
      success: true,
      serverInfo: {
        id: serverInfo.ID,
        name: serverInfo.Name,
        apiTokens: serverInfo.ApiTokens?.length || 0
      },
      emailResponse: {
        messageId: response.MessageID,
        to: response.To,
        submittedAt: response.SubmittedAt
      }
    });
  } catch (error) {
    console.error("Direct Postmark error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code,
      errorDetails: error
    }, { status: 500 });
  }
}
