# 🚀 Deployment Guide - Webflow to SendPulse Integration

## 📋 Current Status
- ✅ **Domain:** `hiroo.co` (Already deployed)
- ✅ **SendPulse Integration:** Ready and tested
- 🔄 **Action Required:** Update Webflow webhook URL

## 🎯 Required Changes

### **Step 1: Update Webflow Webhook Settings**

In your Webflow Designer:

1. **Go to your form settings:**
   - Select the form you want to integrate
   - Go to **Form Settings** → **Actions** → **Webhook**

2. **Update the webhook URL:**
   - **Current URL:** `https://hiroo.co/webhooks/formSubmissions`
   - **New URL:** `https://hiroo.co/api/webhooks/form` ⬅️ **CHANGE TO THIS**

3. **Keep the webhook secret the same:**
   - **Secret:** `26aae62288c2083514a95731b70afe3b748e8feb7b6c3c454b407a037108d145`
   - ✅ **Do NOT change this** - it's already configured correctly

### **Step 2: Deploy Updated Code**

Deploy your updated Next.js application to `hiroo.co` with the new integration:

```bash
# If using Vercel
vercel --prod

# If using other platforms, follow your deployment process
```

### **Step 3: Test the Integration**

After deployment, test the webhook:

```bash
# Test the production webhook endpoint
curl -X POST https://hiroo.co/api/webhooks/form \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Contact added to SendPulse successfully",
  "sendpulse_result": {"result": true}
}
```

## 🔍 Verification Steps

### **1. Check the New Endpoint**
- Visit: `https://hiroo.co/api/test-sendpulse`
- Should return: SendPulse connection successful

### **2. Submit a Test Form**
- Fill out your Webflow form
- Check your SendPulse "My emails" list for the new contact
- Monitor server logs for success messages

### **3. Monitor Logs**
Look for these log messages in your deployment platform:
- 🔔 `Webhook received from Webflow`
- ✅ `Webflow signature verified`
- 📤 `Adding contact to SendPulse via HTTP API`
- ✅ `Contact successfully added to SendPulse`

## 🔧 Environment Variables for Production

Make sure these are set in your production environment:

```env
SENDPULSE_API_USER_ID=2f43787f38f3cc09dc516d25a88131e2
SENDPULSE_API_SECRET=085ebffbad2784d8b6e9042925381941
SENDPULSE_ADDRESS_BOOK_ID=961879
WEBFLOW_WEBHOOK_SECRET_LOCAL=26aae62288c2083514a95731b70afe3b748e8feb7b6c3c454b407a037108d145
```

## 📊 What Happens After Deployment

### **Webflow Form Submission Flow:**
1. User submits form on `hiroo.co` website
2. Webflow sends webhook to `https://hiroo.co/api/webhooks/form`
3. Your Next.js app verifies the webhook signature
4. App extracts form data (email, name, phone, custom fields)
5. App adds contact to SendPulse "My emails" list
6. App returns success response to Webflow

### **Form Field Mapping:**
- `email` → SendPulse email (required)
- `name` → SendPulse name variable
- `phone` → SendPulse phone variable
- Any other fields → SendPulse custom variables

## 🛠 Troubleshooting

### **If webhook fails:**
1. Check production logs for error messages
2. Verify environment variables are set correctly
3. Test the endpoint manually with curl
4. Ensure webhook secret matches between Webflow and your app

### **If contacts aren't appearing in SendPulse:**
1. Check the SendPulse "My emails" address book
2. Verify the address book ID (961879) is correct
3. Check for API rate limits or errors in logs

## 🎉 Success Indicators

✅ **Integration is working when:**
- Form submissions appear in SendPulse within seconds
- Webhook endpoint returns 200 status
- Logs show successful contact additions
- No error messages in production logs

---

**Next Action:** Update the Webflow webhook URL from `/webhooks/formSubmissions` to `/api/webhooks/form` 