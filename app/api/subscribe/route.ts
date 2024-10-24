// pages/api/sendpulse.js
import axios, { AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SendPulseTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
}

interface Email {
  email: string;
  variables?: Record<string, unknown>;
}

interface AddEmailsRequestBody {
  addressBookId: string;
  emails: Email[];
}

const CLIENT_ID = process.env.SENDPULSE_CLIENT_ID;
const CLIENT_SECRET = process.env.SENDPULSE_CLIENT_SECRET;
const API_AUTH_KEY = process.env.API_AUTH_KEY;


if (!CLIENT_ID || !CLIENT_SECRET || !API_AUTH_KEY) {
  throw new Error('SENDPULSE_CLIENT_ID and SENDPULSE_CLIENT_SECRET must be set in environment variables');
}



// Function to get a new access token
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
      console.error(
        'Error obtaining access token:',
        error.message
      );
    } else {
      console.error('Unknown error obtaining access token');
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    console.log(apiKey, API_AUTH_KEY, !apiKey, apiKey !== API_AUTH_KEY);
    
    if (!apiKey || apiKey !== API_AUTH_KEY) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // Obtain a new access token
    const accessToken = await getAccessToken();

    const requestBody: AddEmailsRequestBody = await request.json();

      // Extract data from the request body
      const { emails, addressBookId } = requestBody;

      if ( !emails || emails.length === 0) {
        return NextResponse.json(
          { message: 'addressBookId and emails are required in the request body' },
          { status: 400 }
        );
      }

      console.log(emails);
      

    // check if the email is already in the address book
    // https://api.sendpulse.com/addressbooks/{id}/emails/{email}

    // const checkEmailResponse: AxiosResponse = await axios.get(
    //   `https://api.sendpulse.com/addressbooks/${addressBookId}/emails/${emails[0].email}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

    // if (checkEmailResponse.data) {   
    //   const newVariables = Object.entries(emails[0].variables || {}).map(([key, value]) => ({
    //     "name": key,
    //     "value": value as string
    //   }));

    //   const existingVariables = checkEmailResponse.data.variables.map((item:{name:string, value:string}) => ({
    //     "name": item.name,
    //     "value": item.value
    //   }));

    //   // const allVariables = [...existingVariables, ...newVariables];
    //   const allVariables = [{name:"test", value:"test"}, {name:"test2", value:"test2"}];
      
        
    //   console.log("all",allVariables);
      
      
    //   // https://api.sendpulse.com/addressbooks/{addressBookId}/emails/variable
    //   const updateEmailResponse: AxiosResponse = await axios.post(
    //     `https://api.sendpulse.com/addressbooks/${addressBookId}/emails/variable`,
    //     { "email": checkEmailResponse.data.email, "variables": allVariables},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   );

    //   console.log("update",updateEmailResponse.data);
      
    //   return NextResponse.json(updateEmailResponse.data, { status: updateEmailResponse.status });
    // } else {
      const endpoint = `https://api.sendpulse.com/addressbooks/${addressBookId}/emails`; // Replace with the actual endpoint

      // Make the API call to SendPulse using the access token
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
  
      
      
  
      // Return the response from SendPulse to the client
      return NextResponse.json(sendpulseResponse.data, { status: sendpulseResponse.status });
    // }



    // Adjust the endpoint based on your requirements
  
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        'Error making API call to SendPulse:',
        error.message
      );
    } else if (axios.isAxiosError(error) && error.response) {
      console.error(
        'Error making API call to SendPulse:',
        error.response.data
      );
    } else {
      console.error(
        'Unknown error making API call to SendPulse'
      );
    }

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