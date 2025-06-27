# Form to Address Book Mapping Guide

## Overview
This system allows you to map different Webflow forms to different SendPulse address books (mailing lists).

## How it Works
1. **Webflow sends form data** with a `formId` in the payload
2. **The webhook looks up** the corresponding SendPulse address book ID
3. **The contact is added** to the specific mailing list

## Configuration File
Edit `lib/form-mapping.ts` to add your mappings:

```typescript
export const FORM_TO_ADDRESSBOOK_MAPPING: Record<string, string> = {
  '685dad7fa611bbb426f190c8': '961879', // Current form -> "My emails" list
  
  // Add more mappings here:
  'your-form-id-1': 'your-addressbook-id-1',
  'your-form-id-2': 'your-addressbook-id-2',
};
```

## Finding Your IDs

### Webflow Form ID
You can find this in the webhook payload logs. Look for:
```json
{
  "payload": {
    "formId": "685dad7fa611bbb426f190c8"  // ← This is your form ID
  }
}
```

### SendPulse Address Book ID
1. Go to your SendPulse dashboard
2. Navigate to Email → Mailing Lists
3. Click on a mailing list
4. The ID is in the URL: `https://sendpulse.com/addressbooks/961879` (961879 is the ID)

## Default Behavior
- If no mapping is found, contacts go to the default address book (`961879`)
- The system logs warnings when using the default

## Example Setup
```typescript
export const FORM_TO_ADDRESSBOOK_MAPPING: Record<string, string> = {
  // Contact form on homepage
  'contact-form-homepage': '961879',
  
  // Newsletter signup
  'newsletter-signup': '123456',
  
  // Product demo request
  'demo-request-form': '789012',
};
```

## Testing
After adding new mappings:
1. Submit a test form from Webflow
2. Check the webhook logs for the form ID
3. Verify the contact appears in the correct SendPulse list 