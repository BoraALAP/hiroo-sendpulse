// pages/api/sendpulse.js
import axios, { AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Interface for the response received when getting an access token from SendPulse
interface SendPulseTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
}

// Interface defining the structure of an email entry
interface Email {
  email: string;
  variables?: Record<string, unknown>;  // Optional key-value pairs for custom fields
}

// Interface for the expected request body when adding emails
interface AddEmailsRequestBody {
  addressBookId: string;
  emails: Email[];
}

// Environment variables for SendPulse API authentication
const CLIENT_ID = process.env.SENDPULSE_CLIENT_ID;
const CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET;
const API_AUTH_KEY = process.env.API_AUTH_KEY;  // Custom API key for this endpoint's security

// Validate that required environment variables are set
if (!CLIENT_ID || !CLIENT_SECRET || !API_AUTH_KEY) {
  throw new Error('SENDPULSE_CLIENT_ID and SENDPULSE_CLIENT_SECRET must be set in environment variables');
}

/**
 * Retrieves an access token from SendPulse API using client credentials
 * @returns Promise<string> Access token for API requests
 * @throws Error if token retrieval fails
 */
async function getAccessToken(): Promise<string> {
  try {
    const response: AxiosResponse<SendPulseTokenResponse> = await axios.post(
      'https://api.sendpulse.com/oauth/access_token',
      {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }
    );

    return response.data.access_token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error obtaining access token:', error.message);
    } else {
      console.error('Unknown error obtaining access token');
    }
    throw error;
  }
}

/**
 * POST endpoint handler for adding emails to SendPulse address book
 * @param request NextRequest object containing the request details
 * @returns NextResponse with appropriate status and data
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key for endpoint security
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey || apiKey !== API_AUTH_KEY) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get SendPulse access token
    const accessToken = await getAccessToken();

    // Parse request body
    const requestBody: AddEmailsRequestBody = await request.json();
    const { emails, addressBookId } = requestBody;

    // Validate request data
    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { message: 'addressBookId and emails are required in the request body' },
        { status: 400 }
      );
    }

    console.log(emails, addressBookId);

    // Note: Commented out code below is for checking existing emails and updating variables
    // Uncomment and modify as needed for your use case

    // Make request to SendPulse API to add emails
    const endpoint = `https://api.sendpulse.com/addressbooks/${addressBookId}/emails`;
    const sendpulseResponse: AxiosResponse = await axios.post(
      endpoint,
      { emails },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return SendPulse API response to client
    return NextResponse.json(sendpulseResponse.data, { status: sendpulseResponse.status });

  } catch (error: unknown) {
    // Comprehensive error handling with specific error types
    if (error instanceof Error) {
      console.error('Error making API call to SendPulse:', error.message);
    } else if (axios.isAxiosError(error) && error.response) {
      console.error('Error making API call to SendPulse:', error.response.data);
    } else {
      console.error('Unknown error making API call to SendPulse');
    }

    // Determine appropriate error response
    let status = 500;
    let message = { message: 'An unknown error occurred' };

    if (axios.isAxiosError(error) && error.response) {
      status = error.response.status || 500;
      message = error.response.data || message;
    } else if (error instanceof Error) {
      message = { message: error.message };
    }

    return NextResponse.json(message, { status });
  }
}