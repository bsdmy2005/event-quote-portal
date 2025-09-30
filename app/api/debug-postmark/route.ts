import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const postmarkToken = process.env.POSTMARK_SERVER_API_TOKEN;
    const fromEmail = process.env.POSTMARK_FROM_EMAIL;
    
    return NextResponse.json({
      hasToken: !!postmarkToken,
      tokenLength: postmarkToken?.length || 0,
      tokenStart: postmarkToken?.substring(0, 8) || 'none',
      hasFromEmail: !!fromEmail,
      fromEmail: fromEmail,
      allEnvVars: {
        POSTMARK_SERVER_API_TOKEN: postmarkToken ? 'SET' : 'NOT SET',
        POSTMARK_FROM_EMAIL: fromEmail || 'NOT SET'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
