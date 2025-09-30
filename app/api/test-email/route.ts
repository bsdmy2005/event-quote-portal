import { sendTeamInviteEmail } from "@/lib/email-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const hasPostmarkToken = !!process.env.POSTMARK_SERVER_API_TOKEN;
    const hasFromEmail = !!process.env.POSTMARK_FROM_EMAIL;
    
    if (!hasPostmarkToken) {
      return NextResponse.json({ 
        success: false, 
        error: "POSTMARK_SERVER_API_TOKEN not found" 
      }, { status: 500 });
    }
    
    if (!hasFromEmail) {
      return NextResponse.json({ 
        success: false, 
        error: "POSTMARK_FROM_EMAIL not found" 
      }, { status: 500 });
    }

    // Test email sending
    await sendTeamInviteEmail({
      to: "test@qouteportal.com", // Use your domain email for testing
      organizationName: "Test Agency",
      organizationType: "agency",
      inviterName: "Test Admin",
      role: "agency_member"
    });

    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully",
      hasPostmarkToken,
      hasFromEmail
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown stack'
    }, { status: 500 });
  }
}
