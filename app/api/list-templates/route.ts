import { ServerClient } from 'postmark';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN as string);
    
    // Get all templates
    const templates = await client.getTemplates();
    
    return NextResponse.json({
      success: true,
      templates: templates.Templates.map(template => ({
        id: template.TemplateId,
        name: template.Name,
        active: template.Active
      }))
    });
  } catch (error) {
    console.error("List templates error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code
    }, { status: 500 });
  }
}
