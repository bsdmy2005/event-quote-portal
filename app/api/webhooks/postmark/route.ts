import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log('Postmark webhook received:', JSON.stringify(body, null, 2));
    
    // Handle different webhook types
    switch (body.RecordType) {
      case 'Bounce':
        console.log('Bounce received:', {
          email: body.Email,
          type: body.Type,
          description: body.Description,
          bouncedAt: body.BouncedAt
        });
        // TODO: Update user status in database
        break;
        
      case 'Delivery':
        console.log('Delivery confirmed:', {
          email: body.Email,
          deliveredAt: body.DeliveredAt,
          messageId: body.MessageID
        });
        // TODO: Update delivery status in database
        break;
        
      case 'Open':
        console.log('Email opened:', {
          email: body.Email,
          openedAt: body.ReceivedAt,
          messageId: body.MessageID,
          userAgent: body.UserAgent
        });
        // TODO: Track email opens in database
        break;
        
      case 'Click':
        console.log('Link clicked:', {
          email: body.Email,
          clickedAt: body.ReceivedAt,
          messageId: body.MessageID,
          url: body.OriginalLink
        });
        // TODO: Track link clicks in database
        break;
        
      case 'SpamComplaint':
        console.log('Spam complaint:', {
          email: body.Email,
          complainedAt: body.BouncedAt,
          description: body.Description
        });
        // TODO: Handle spam complaint
        break;
        
      default:
        console.log('Unhandled webhook type:', body.RecordType);
    }
    
    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}















