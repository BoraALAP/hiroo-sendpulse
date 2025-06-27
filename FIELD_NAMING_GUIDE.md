# Field Naming Guide

## Overview
This guide helps you maintain consistent field names across different Webflow forms so the system can properly extract and map data to SendPulse.

## Standard Field Names

### **Required Fields**
Use these EXACT field names for core functionality:

| Field Purpose | **Required Field Name** |
|---------------|-------------------------|
| **Email Address** | `email` |
| **Privacy Policy** | `privacy_policy` |
| **Marketing Consent** | `marketing` |

### **Optional Standard Fields**
Use these EXACT field names for consistency:

| Field Purpose | **Standard Field Name** |
|---------------|-------------------------|
| **First Name** | `firstname` |
| **Last Name** | `lastname` |
| **Phone** | `phone` |
| **Company** | `companyname` |
| **Message/Comments** | `messages` |
| **Number of Employees** | `numberofemployees` |

## Custom Fields

### **Form-Specific Questions**
You can add any custom fields for specific forms. They will automatically be sent to SendPulse:

```
project_budget      → project_budget
industry           → industry
how_did_you_hear   → how_did_you_hear
preferred_date     → preferred_date
website_url        → website_url
annual_revenue     → annual_revenue
```

### **Field Name Convention**
All field names should use lowercase letters with underscores (snake_case):

| Field Type | Example Field Name |
|------------|-------------------|
| **Single word** | `budget` |
| **Multiple words** | `project_budget` |
| **Numbers** | `number_of_employees` |
| **Dates** | `preferred_start_date` |


## Form Examples

### **Contact Form**
```
- firstname
- lastname  
- email
- companyname
- phone
- messages
- numberofemployees
- privacy_policy (checkbox)
- marketing (checkbox)
```

### **Demo Request Form**
```
- first_name
- last_name
- email
- company_name
- phone_number
- project_budget
- preferred_start_date
- message
- privacy_policy (checkbox)
- marketing (checkbox)
```

## Best Practices

### ✅ **Do This**
- Use lowercase letters with underscores (snake_case)
- Use the EXACT standard field names listed above
- Keep standard field names consistent across ALL forms
- Use descriptive names for custom fields
- Test forms after creating to verify field mapping

### ❌ **Avoid This**
- Using spaces or capital letters in field names
- Changing standard field names (email, privacy_policy, marketing, etc.)
- Using special characters other than underscores
- Making privacy_policy optional

## Verification

After setting up a form, you can verify the field mapping by:

1. **Submit a test form**
2. **Check the webhook logs** for "All fields being sent to SendPulse"
3. **Verify in SendPulse** that all custom variables appear correctly

## Field Mapping Results

When you submit your example form with:
```json
{
  "firstname": "Bora",
  "lastname": "Alap",
  "companyname": "Company", 
  "email": "bora.alap@artticfox.com",
  "phone": "+31631240006",
  "messages": "testing",
  "numberofemployees": "50",
  "privacy_policy": "true",
  "marketing": "true"
}
```

SendPulse receives:
```json
{
  "email": "bora.alap@artticfox.com",
  "name": "Bora Alap",
  "phone": "+31631240006",
  "company": "Company",
  "message": "testing",
  "firstname": "Bora",
  "lastname": "Alap", 
  "companyname": "Company",
  "phone": "+31631240006",
  "messages": "testing",
  "numberofemployees": "50",
  "privacy_policy": "true",
  "marketing": "true"
}
```

This ensures all your form data is preserved and available in SendPulse for segmentation and personalization! 🎯

## Complete Field Reference

### **All Supported Standard Fields**
Here's the complete list of field names you can use in your Webflow forms:

**Required:**
- `email` (required)
- `privacy_policy` (required checkbox)
- `marketing` (required checkbox)

**Optional Standard:**
- `firstname`
- `lastname`
- `companyname`
- `phone`
- `messages`
- `numberofemployees`

**Common Custom Fields:**
- `project_budget`
- `annual_revenue`
- `industry`
- `website_url`
- `how_did_you_hear`
- `preferred_start_date`
- `preferred_contact_method`
- `job_title`
- `department`
- `company_size`
- `location`
- `country`
- `time_zone`
- `urgent_request`
- `follow_up_date`

Remember: Any field name you use will be automatically sent to SendPulse as a custom variable, so feel free to add any fields that are relevant to your specific forms! 