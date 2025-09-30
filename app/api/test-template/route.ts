import { ServerClient } from 'postmark';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);
    
    // Test using the template
    const response = await client.sendEmailWithTemplate({
      From: "invite@qouteportal.com",
      To: "bereket@elenjicalsolutions.com",
      TemplateId: 41477533,
      TemplateModel: {
        name: "Test User",
        email: "bereket@elenjicalsolutions.com"
      }
    });

    return NextResponse.json({
      success: true,
      messageId: response.MessageID,
      to: response.To,
      submittedAt: response.SubmittedAt,
      templateId: 41477533
    });
  } catch (error) {
    console.error("Template test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code,
      errorDetails: error
    }, { status: 500 });
  }
}
