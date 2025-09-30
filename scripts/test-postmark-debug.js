// Comprehensive Postmark debugging script
// Run with: node scripts/test-postmark-debug.js

const postmark = require("postmark");

async function testMultipleRecipients() {
  const client = new postmark.ServerClient("8980da23-200b-4d90-bfab-622447676857");
  
  // Test with multiple email addresses to see if it's recipient-specific
  const testEmails = [
    "bereket@elenjicalsolutions.com",
    "bereket.demeke89@gmail.com", 
    "bereket@elenjical.com",
  ];

  console.log("🧪 Testing multiple recipients to isolate the issue...\n");

  for (const email of testEmails) {
    try {
      console.log(`📧 Testing: ${email}`);
      
      const response = await client.sendEmail({
        "From": "invites@qouteportal.com",
        "To": email,
        "Subject": `Postmark Test - ${new Date().toISOString()}`,
        "HtmlBody": `
          <h2>Postmark Delivery Test</h2>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>To:</strong> ${email}</p>
          <p><strong>From:</strong> invites@qouteportal.com</p>
          <p>If you receive this email, Postmark delivery is working!</p>
        `,
        "TextBody": `Postmark Delivery Test\nSent at: ${new Date().toISOString()}\nTo: ${email}\nFrom: invites@qouteportal.com\n\nIf you receive this email, Postmark delivery is working!`,
        "MessageStream": "outbound"
      });

      console.log(`✅ Sent to ${email}`);
      console.log(`   Message ID: ${response.MessageID}`);
      console.log(`   Status: ${response.Status || 'Accepted'}`);
      console.log("");
      
    } catch (error) {
      console.log(`❌ Failed to send to ${email}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log("");
    }
  }
}

async function checkServerInfo() {
  try {
    console.log("🔍 Checking Postmark server information...\n");
    
    const client = new postmark.ServerClient("8980da23-200b-4d90-bfab-622447676857");
    
    // Get server info
    const serverInfo = await client.getServer();
    console.log("📊 Server Information:");
    console.log(`   Name: ${serverInfo.Name}`);
    console.log(`   Color: ${serverInfo.Color}`);
    console.log(`   BounceHookUrl: ${serverInfo.BounceHookUrl || 'Not set'}`);
    console.log(`   InboundHookUrl: ${serverInfo.InboundHookUrl || 'Not set'}`);
    console.log(`   PostFirstOpenOnly: ${serverInfo.PostFirstOpenOnly}`);
    console.log(`   TrackOpens: ${serverInfo.TrackOpens}`);
    console.log(`   TrackLinks: ${serverInfo.TrackLinks}`);
    console.log("");
    
    // Get sender signatures
    const signatures = await client.getSenderSignatures();
    console.log("✍️ Sender Signatures:");
    signatures.SenderSignatures.forEach(sig => {
      console.log(`   Email: ${sig.EmailAddress}`);
      console.log(`   Name: ${sig.Name}`);
      console.log(`   Confirmed: ${sig.Confirmed}`);
      console.log(`   SPFVerified: ${sig.SPFVerified}`);
      console.log("");
    });
    
  } catch (error) {
    console.error("❌ Error getting server info:", error.message);
  }
}

async function runDiagnostics() {
  console.log("🚀 Starting Postmark Diagnostics...\n");
  
  await checkServerInfo();
  await testMultipleRecipients();
  
  console.log("📋 Next Steps:");
  console.log("1. Check your Postmark dashboard at https://account.postmarkapp.com/");
  console.log("2. Look at the 'Activity' tab to see email status");
  console.log("3. Check 'Bounces' tab for any delivery failures");
  console.log("4. Verify sender signature is confirmed");
  console.log("5. Check spam/junk folders in your email");
  console.log("6. If using Gmail, check 'All Mail' folder");
  console.log("");
  console.log("🎯 Common Issues:");
  console.log("- Sender email not verified in Postmark");
  console.log("- Emails going to spam folder");
  console.log("- Email provider blocking emails");
  console.log("- DNS/SPF records not properly configured");
}

runDiagnostics()
  .then(() => {
    console.log("🎉 Diagnostics completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Diagnostics failed:", error);
    process.exit(1);
  });
