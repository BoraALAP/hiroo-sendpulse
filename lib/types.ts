// Centralized type definitions for the project

export interface ContactData {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  companyname?: string;
  message?: string;
  numberofemployees?: string;
  [key: string]: unknown;
}

export interface WebflowFormData {
  // Standard field names - use these exact names in your forms
  email?: string;
  firstname?: string;
  lastname?: string;
  companyname?: string;
  phone?: string;
  messages?: string;
  numberofemployees?: string;
  privacypolicy?: string | boolean;
  marketing?: string | boolean;
  
  // Webflow payload structure
  payload?: {
    data?: Record<string, unknown>;
    formId?: string;
    [key: string]: unknown;
  };
  
  // Allow any additional custom fields
  [key: string]: unknown;
}

export interface SendPulseToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AddressBookMapping {
  title: string;
  id: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
} 