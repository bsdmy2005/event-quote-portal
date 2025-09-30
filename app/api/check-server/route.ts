import { ServerClient } from 'postmark';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);
    
    // Get server info
    const serverInfo = await client.getServer();
    
    return NextResponse.json({
      success: true,
      serverInfo: {
        id: serverInfo.ID,
        name: serverInfo.Name,
        color: serverInfo.Color,
        bounceHookUrl: serverInfo.BounceHookUrl,
        inboundHookUrl: serverInfo.InboundHookUrl,
        postFirstOpenOnly: serverInfo.PostFirstOpenOnly,
        trackOpens: serverInfo.TrackOpens,
        trackLinks: serverInfo.TrackLinks,
        includeBounceContentInHook: serverInfo.IncludeBounceContentInHook,
        enableSmtpApiErrorHooks: serverInfo.EnableSmtpApiErrorHooks,
        inboundSpamThreshold: serverInfo.InboundSpamThreshold
      }
    });
  } catch (error) {
    console.error("Server check error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code
    }, { status: 500 });
  }
}
