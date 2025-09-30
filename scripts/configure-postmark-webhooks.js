require('dotenv').config({ path: '.env.local' });
const { ServerClient } = require('postmark');

async function configureWebhooks() {
  const client = new ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);
  const webhookUrl = 'https://1ecd1800edd3.ngrok.app/api/webhooks/postmark';
  
  try {
    console.log('Configuring Postmark webhooks...');
    console.log('Webhook URL:', webhookUrl);
    
    // Update server with webhook URLs
    const updateRequest = {
      BounceHookUrl: webhookUrl,
      InboundHookUrl: webhookUrl,
      OpenHookUrl: webhookUrl,
      ClickHookUrl: webhookUrl,
      DeliveryHookUrl: webhookUrl,
      SpamComplaintHookUrl: webhookUrl
    };
    
    const result = await client.editServer(updateRequest);
    
    console.log('✅ Webhooks configured successfully!');
    console.log('Server ID:', result.ID);
    console.log('Server Name:', result.Name);
    console.log('\nConfigured webhook URLs:');
    console.log('- Bounce Hook:', result.BounceHookUrl);
    console.log('- Inbound Hook:', result.InboundHookUrl);
    console.log('- Open Hook:', result.OpenHookUrl);
    console.log('- Click Hook:', result.ClickHookUrl);
    console.log('- Delivery Hook:', result.DeliveryHookUrl);
    console.log('- Spam Complaint Hook:', result.SpamComplaintHookUrl);
    
  } catch (error) {
    console.error('❌ Error configuring webhooks:', error);
  }
}

configureWebhooks();
