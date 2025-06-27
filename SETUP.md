# Webflow to SendPulse Integration Setup Guide

## 🎯 Overview
This Next.js project integrates Webflow form submissions with SendPulse email marketing platform. When a form is submitted on your Webflow site, it automatically adds the contact to your SendPulse mailing list.

## 📋 Prerequisites
- Webflow site with forms
- SendPulse account
- Next.js project (this one)
- Domain for hosting the webhook endpoint

## 🔧 Setup Instructions

### 1. Configure SendPulse API
1. Go to [SendPulse API Settings](https://login.sendpulse.com/settings/#api)
2. Get your **API User ID** and **API Secret**
3. Create a mailing list and note the **Address Book ID**

### 2. Set Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# Webflow Webhook Configuration
WEBFLOW_WEBHOOK_SECRET_LOCAL=your_webflow_webhook_secret_here

# SendPulse API Configuration
SENDPULSE_API_USER_ID=your_sendpulse_api_user_id
SENDPULSE_API_SECRET=your_sendpulse_api_secret
SENDPULSE_ADDRESS_BOOK_ID=your_sendpulse_address_book_id

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
yarn install
```

### 4. Test SendPulse Connection
Start the development server:
```bash
yarn dev
```

Test the SendPulse connection:
```bash
# Test connection
curl http://localhost:3000/api/test-sendpulse

# Test adding a contact
curl -X POST http://localhost:3000/api/test-sendpulse \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### 5. Configure Webflow Webhook
1. In Webflow Designer, select your form
2. Go to Form Settings → Actions → Webhook
3. Set webhook URL: `https://yourdomain.com/api/webhooks/form`
4. Set webhook secret (same as `WEBFLOW_WEBHOOK_SECRET_LOCAL`)

### 6. Deploy to Production
Deploy your Next.js app to your preferred platform (Vercel, Netlify, etc.) and update the Webflow webhook URL to your production domain.

## 📊 Form Field Mapping

The integration automatically maps common form fields:

| Webflow Field Names | SendPulse Field |
|-------------------|----------------|
| `email`, `Email`, `email_address` | email |
| `name`, `Name`, `full_name`, `firstName`, `first_name` | name |
| `phone`, `Phone`, `telephone`, `mobile` | phone |
| Any other fields | Custom variables |

## 🔍 Testing & Debugging

### Local Testing with ngrok
For local testing with Webflow webhooks:
```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the ngrok URL in Webflow webhook settings
```

### Check Logs
Monitor the console for detailed logs:
- ✅ Success messages
- ❌ Error messages
- 📤 Data being sent to SendPulse
- 🔔 Webhook received notifications

### API Endpoints
- `GET /api/test-sendpulse` - Test SendPulse connection
- `POST /api/test-sendpulse` - Test adding a contact
- `POST /api/webhooks/form` - Webflow webhook endpoint

## 🛠 Troubleshooting

### Common Issues

**1. SendPulse API Errors**
- Verify API credentials are correct
- Check that the address book ID exists
- Ensure email format is valid

**2. Webhook Signature Verification**
- Verify webhook secret matches in both Webflow and `.env`
- Check that timestamp headers are being sent

**3. Form Field Not Mapping**
- Check the form field names in Webflow
- Add custom field mapping in the webhook handler if needed

### Error Responses
The webhook always returns HTTP 200 to prevent Webflow retries for permanent failures. Check the response body for actual success/error status:

```json
{
  "success": true,
  "message": "Contact added to SendPulse successfully",
  "sendpulse_result": {...}
}
```

## 🔐 Security Notes
- Keep your SendPulse API credentials secure
- Use webhook signature verification in production
- Consider rate limiting for the webhook endpoint

## 📈 Monitoring
Consider adding:
- Database logging for form submissions
- Email notifications for failures
- Analytics tracking for conversion rates
- Dashboard for monitoring submission rates

## 🚀 Advanced Features
You can extend this integration to:
- Send welcome emails via SendPulse
- Segment contacts based on form source
- Trigger automation sequences
- Sync with CRM systems
- Add custom validation rules 