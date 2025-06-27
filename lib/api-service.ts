import { NextRequest } from 'next/server';
import { sendPulseHttpService } from './sendpulse-http';
import { ContactData, ApiResponse } from './types';
import { CONFIG } from './config';

interface EmailRequest {
  addressBookId: string;
  emails: Array<{
    email: string;
    variables?: Record<string, unknown>;
  }>;
}

export class ApiService {
  /**
   * Validates API key from request headers
   */
  static validateApiKey(request: NextRequest): boolean {
    const apiKey = request.headers.get('x-api-key');
    return apiKey === CONFIG.API.AUTH_KEY;
  }

  /**
   * Subscribes emails to an address book
   */
  static async subscribeEmails(requestBody: EmailRequest): Promise<ApiResponse> {
    try {
      const { emails, addressBookId } = requestBody;

      if (!emails || emails.length === 0) {
        return {
          success: false,
          error: 'addressBookId and emails are required'
        };
      }

      // Convert to ContactData format and add each email
      const results = [];
      for (const emailData of emails) {
        const contactData: ContactData = {
          email: emailData.email,
          ...emailData.variables
        };
        
        const result = await sendPulseHttpService.addContact(contactData, addressBookId);
        results.push(result);
      }

      return {
        success: true,
        message: `Successfully added ${emails.length} email(s)`,
        data: results
      };

    } catch (error) {
      console.error('❌ Subscribe error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Unsubscribes emails from an address book
   */
  static async unsubscribeEmails(requestBody: EmailRequest): Promise<ApiResponse> {
    try {
      const { emails, addressBookId } = requestBody;

      if (!emails || emails.length === 0) {
        return {
          success: false,
          error: 'addressBookId and emails are required'
        };
      }

      // First add the emails, then unsubscribe them (SendPulse requirement)
      const subscribeResult = await this.subscribeEmails(requestBody);
      
      if (!subscribeResult.success) {
        return subscribeResult;
      }

      // Now unsubscribe the emails
      const unsubscribeResults = [];
      for (const emailData of emails) {
        const contactData: ContactData = {
          email: emailData.email,
          ...emailData.variables
        };
        
        const result = await sendPulseHttpService.unsubscribeContact(contactData, addressBookId);
        unsubscribeResults.push(result);
      }

      return {
        success: true,
        message: `Successfully unsubscribed ${emails.length} email(s)`,
        data: unsubscribeResults
      };

    } catch (error) {
      console.error('❌ Unsubscribe error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
} 