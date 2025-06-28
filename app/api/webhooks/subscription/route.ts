
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log('🔔 Webflow subscription webhook received');
  
  try {
    const rawBody = await request.text();
    
    const payload = JSON.parse(rawBody);
 
    
    return Response.json(payload, { status: 200 });
    
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    
    return Response.json({ error: "Webhook processing failed" }, { status: 200 }); // Return 200 to prevent retries
  }
}