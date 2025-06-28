import axios from 'axios';
import { ContactData, SendPulseToken } from './types';
import { CONFIG, validateConfig } from './config';

export class SendPulseHttpService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    validateConfig();
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${CONFIG.SENDPULSE.BASE_URL}/oauth/access_token`, {
        grant_type: 'client_credentials',
        client_id: CONFIG.SENDPULSE.API_USER_ID,
        client_secret: CONFIG.SENDPULSE.API_SECRET
      });

      const tokenData: SendPulseToken = response.data;
      this.token = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in - CONFIG.SENDPULSE.TOKEN_SAFETY_MARGIN) * 1000;

      console.log('✅ SendPulse token obtained');
      return this.token;
    } catch (error) {
      console.error('❌ SendPulse authentication failed:', error);
      throw new Error('Failed to authenticate with SendPulse API');
    }
  }

  private async makeRequest(method: string, endpoint: string, data?: unknown): Promise<unknown> {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios({
        method,
        url: `${CONFIG.SENDPULSE.BASE_URL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`SendPulse API error: ${message}`);
      }
      throw error;
    }
  }

  async getAddressBooks(): Promise<unknown> {
    return await this.makeRequest('GET', '/addressbooks');
  }

  async addContact(contactData: ContactData, addressBookId?: string): Promise<unknown> {
    const targetAddressBookId = addressBookId || CONFIG.SENDPULSE.DEFAULT_ADDRESS_BOOK_ID;
    
    console.log(`📋 Adding contact to address book: ${targetAddressBookId}`);
    const variables = this.formatContactVariables(contactData);
    console.log("variables", variables);

    const emails = [{
      email: contactData.email,
      variables: variables
    }];

    try {
      return await this.makeRequest('POST', `/addressbooks/${targetAddressBookId}/emails`, { emails });
    } catch (error) {
      // Log the actual error details
      console.error(`❌ Address book ${targetAddressBookId} error:`, error instanceof Error ? error.message : error);
      
      // Fallback to default address book if the specified one fails
      if (targetAddressBookId !== CONFIG.SENDPULSE.DEFAULT_ADDRESS_BOOK_ID) {
        console.warn(`⚠️ Address book ${targetAddressBookId} failed, using default`);
        return await this.makeRequest('POST', `/addressbooks/${CONFIG.SENDPULSE.DEFAULT_ADDRESS_BOOK_ID}/emails`, { emails });
      }
      throw error;
    }
  }

  private formatContactVariables(contactData: ContactData): Record<string, string> {
    const variables: Record<string, string> = {};
    
    Object.keys(contactData).forEach(key => {
      if (key !== 'email' && key !== 'privacypolicy' && key !== 'marketing' && contactData[key] != null) {
        variables[key] = String(contactData[key]);
      }
    });

    return variables;
  }

  async unsubscribeContact(contactData: ContactData, addressBookId?: string): Promise<unknown> {
    const targetAddressBookId = addressBookId || CONFIG.SENDPULSE.DEFAULT_ADDRESS_BOOK_ID;
    
    console.log(`📧 Unsubscribing contact from address book: ${targetAddressBookId}`);

    const emails = [{
      email: contactData.email
    }];

    try {
      return await this.makeRequest('POST', `/addressbooks/${targetAddressBookId}/emails/unsubscribe`, { emails });
    } catch (error) {
      // Fallback to default address book if the specified one fails
      if (targetAddressBookId !== CONFIG.SENDPULSE.DEFAULT_ADDRESS_BOOK_ID) {
        console.warn(`⚠️ Address book ${targetAddressBookId} failed, using default for unsubscribe`);
        return await this.makeRequest('POST', `/addressbooks/${CONFIG.SENDPULSE.DEFAULT_ADDRESS_BOOK_ID}/emails/unsubscribe`, { emails });
      }
      throw error;
    }
  }

}

// Export a singleton instance
export const sendPulseHttpService = new SendPulseHttpService(); 