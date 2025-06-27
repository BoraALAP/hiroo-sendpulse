# Project Structure

## Overview
Clean, organized Webflow to SendPulse integration with minimal code duplication.

## Directory Structure

```
lib/
├── types.ts              # Centralized TypeScript interfaces
├── config.ts             # Environment configuration & validation
├── field-extractor.ts    # Form field extraction utilities
├── form-mapping.ts       # Webflow form ID to SendPulse address book mapping
├── sendpulse-http.ts     # SendPulse API service
└── api-service.ts        # Shared API utilities for subscribe/unsubscribe

app/api/
├── webhooks/form/        # Webflow webhook handler
├── subscribe/            # Email subscription endpoint
└── unsubscribe/          # Email unsubscription endpoint
```

## Key Features

### ✅ **Clean Architecture**
- **Single responsibility** - each file has one clear purpose
- **No code duplication** - shared utilities and services
- **Centralized configuration** - all settings in one place
- **Type safety** - comprehensive TypeScript interfaces

### ✅ **Robust Error Handling**
- **Graceful fallbacks** - default address book if mapping fails
- **Comprehensive logging** - clear success/error messages
- **Consistent responses** - standardized API response format

### ✅ **Smart Field Extraction**
- **Multiple field name support** - handles various naming conventions
- **Automatic normalization** - converts to snake_case for SendPulse
- **Complete data capture** - all form fields preserved as custom variables

### ✅ **Flexible Form Mapping**
- **Easy configuration** - simple mapping file for form IDs
- **Automatic routing** - forms go to correct mailing lists
- **Default fallback** - ensures no data is lost

## Configuration

### Environment Variables
```bash
SENDPULSE_API_USER_ID=your_user_id
SENDPULSE_API_SECRET=your_secret
WEBFLOW_WEBHOOK_SECRET_LOCAL=your_webhook_secret
API_AUTH_KEY=your_api_key  # For subscribe/unsubscribe endpoints
```

### Form Mapping
Edit `lib/form-mapping.ts` to map Webflow form IDs to SendPulse address books:

```typescript
export const FORM_TO_ADDRESSBOOK_MAPPING = {
  'webflow-form-id': { title: 'List Name', id: 'sendpulse-id' },
  // ... more mappings
};
```

## API Endpoints

### Webhook: `/api/webhooks/form`
- Receives Webflow form submissions
- Extracts contact data automatically
- Routes to appropriate mailing list
- Handles signature verification

### Subscribe: `/api/subscribe`
- Adds emails to address books
- Requires API key authentication
- Batch email processing

### Unsubscribe: `/api/unsubscribe`
- Removes emails from address books
- Requires API key authentication
- Follows SendPulse unsubscribe flow

## Usage

1. **Deploy** the Next.js app
2. **Configure** environment variables
3. **Set up** Webflow webhook to point to `/api/webhooks/form`
4. **Add** form mappings in `lib/form-mapping.ts`
5. **Test** form submissions

## Benefits

- 🚀 **Fast** - minimal processing overhead
- 🛡️ **Reliable** - comprehensive error handling
- 📊 **Maintainable** - clean, organized code
- 🔧 **Flexible** - easy to extend and modify
- 📈 **Scalable** - handles multiple forms and address books 