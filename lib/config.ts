// Centralized configuration for the application

export const CONFIG = {
  // SendPulse API configuration
  SENDPULSE: {
    BASE_URL: 'https://api.sendpulse.com',
    API_USER_ID: process.env.SENDPULSE_API_USER_ID,
    API_SECRET: process.env.SENDPULSE_API_SECRET,
    DEFAULT_ADDRESS_BOOK_ID: '961879',
    TOKEN_SAFETY_MARGIN: 300, // 5 minutes in seconds
  },

  // Webflow webhook configuration
  WEBFLOW: {
    WEBHOOK_SECRET: process.env.WEBFLOW_WEBHOOK_SECRET_LOCAL,
  },

  // API authentication (for subscribe/unsubscribe endpoints)
  API: {
    AUTH_KEY: process.env.API_AUTH_KEY,
  }
} as const;

// Validation function to ensure required environment variables are set
export function validateConfig(): void {
  const required = [
    { key: 'SENDPULSE_API_USER_ID', value: CONFIG.SENDPULSE.API_USER_ID },
    { key: 'SENDPULSE_API_SECRET', value: CONFIG.SENDPULSE.API_SECRET },
  ];

  const missing = required.filter(({ value }) => !value);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.map(({ key }) => key).join(', ')}`);
  }
} 