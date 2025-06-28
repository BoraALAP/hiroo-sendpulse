import crypto from "crypto";
import { NextRequest } from "next/server";
import { sendPulseHttpService } from "@/lib/sendpulse-http";
import { getAddressBookId } from "@/lib/form-mapping";
import { FieldExtractor } from "@/lib/field-extractor";
import { WebflowFormData, ApiResponse } from "@/lib/types";
import { CONFIG } from "@/lib/config";

async function handleFormSubmission(data: WebflowFormData): Promise<ApiResponse> {
  console.log("🔔 Processing form submission");
  console.log(data);
  
  
  // Extract form data and form ID from Webflow payload
  const { formData, formId } = extractWebflowData(data);
  
  try {
    // Check privacy policy consent first
    const privacyPolicy = formData['privacypolicy'];
    if (privacyPolicy === 'false' || privacyPolicy === false) {
      console.log('❌ Privacy policy not accepted, not saving contact');
      return {
        success: false,
        error: 'Privacy policy must be accepted to process form submission'
      };
    }

    // Extract and validate contact data
    const contactData = FieldExtractor.extractContactData(formData);
    console.log('✅ Extracted contact data:', { 
      email: contactData.email, 
      firstName: contactData.firstname,
      lastName: contactData.lastName,
      totalFields: Object.keys(contactData).length 
    });
    console.log('📋 All fields being sent to SendPulse:', contactData);

    // Check marketing consent
    const marketingConsent = formData['marketing'];
    const addressBookId = formId ? getAddressBookId(formId).id : undefined;
    
    if (marketingConsent === 'false' || marketingConsent === false) {
      console.log('📧 Marketing consent declined, unsubscribing contact');
      
      // Unsubscribe contact directly
      const result = await sendPulseHttpService.unsubscribeContact(contactData, addressBookId);
      
      return {
        success: true,
        message: 'Contact unsubscribed from marketing communications',
        data: result
      };
    }
    
    // Add contact to SendPulse for marketing
    const result = await sendPulseHttpService.addContact(contactData, addressBookId);
    
    console.log('✅ Contact added to SendPulse successfully');
    
    return {
      success: true,
      message: 'Contact subscribed successfully',
      data: result
    };

  } catch (error) {
    console.error('❌ Form submission error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function extractWebflowData(data: WebflowFormData): { formData: WebflowFormData; formId?: string } {
  if (data.payload?.data && typeof data.payload.data === 'object') {
    console.log("📦 Using payload data");
    return {
      formData: data.payload.data as WebflowFormData,
      formId: data.payload.formId as string
    };
  }
  
  return { formData: data };
}

function verifyWebflowSignature(rawBody: string, request: NextRequest): boolean {
  const secret = CONFIG.WEBFLOW.WEBHOOK_SECRET;
  if (!secret) {
    console.warn("⚠️ Webhook secret not configured");
    return true; // Allow for development
  }

  const timestamp = request.headers.get("x-webflow-timestamp");
  const incomingSig = request.headers.get("x-webflow-signature");
  
  if (!incomingSig) return true; // No signature to verify
  
  const signatureData = timestamp ? `${timestamp}:${rawBody}` : rawBody;
  const expectedSig = crypto.createHmac("sha256", secret).update(signatureData).digest("hex");
  
  const isValid = incomingSig === expectedSig;
  console.log(isValid ? "✅ Signature verified" : "❌ Invalid signature");
  
  return isValid;
}

export async function POST(request: NextRequest) {
  console.log('🔔 Webflow webhook received');
  
  try {
    const rawBody = await request.text();
    
    // Verify webhook signature
    if (!verifyWebflowSignature(rawBody, request)) {
      // In production, uncomment this to enforce signature verification:
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse and handle the webhook
    const payload = JSON.parse(rawBody);
    const result = await handleFormSubmission(payload);
    
    return Response.json(result, { status: 200 });
    
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Webhook processing failed'
    };
    
    return Response.json(errorResponse, { status: 200 }); // Return 200 to prevent retries
  }
}