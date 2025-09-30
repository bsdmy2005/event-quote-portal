// Test script for Postmark email functionality
// Run with: node scripts/test-postmark.js

const postmark = require("postmark");

async function testPostmarkEmail() {
  try {
    console.log("🚀 Starting Postmark email test...");
    
    // Send an email using the exact code provided
    const client = new postmark.ServerClient("8980da23-200b-4d90-bfab-622447676857");

    const response = await client.sendEmail({
      "From": "invites@qouteportal.com",
      "To": "bereket@elenjicalsolutions.com",
      "Subject": "Hello from Postmark",
      "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
      "TextBody": "Hello from Postmark!",
      "MessageStream": "outbound"
    });

    console.log("✅ Email sent successfully!");
    console.log("📧 Message ID:", response.MessageID);
    console.log("📬 To:", response.To);
    console.log("📅 Submitted At:", response.SubmittedAt);
    console.log("📊 Status:", response.Status);
    
    return response;
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
}

// Run the test
testPostmarkEmail()
  .then(() => {
    console.log("🎉 Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test failed!");
    process.exit(1);
  });
