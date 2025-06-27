import { NextRequest } from 'next/server';
import { sendPulseHttpService } from '@/lib/sendpulse-http';

export async function GET() {
  try {
    console.log('🔍 Testing SendPulse address book access...');
    
    // Get all address books to see what we have access to
    const addressBooks = await sendPulseHttpService.getAddressBooks();
    console.log('📋 Available address books:', addressBooks);
    
    return Response.json({
      success: true,
      message: 'Address books retrieved successfully',
      data: addressBooks
    });
    
  } catch (error) {
    console.error('❌ Address book test failed:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { addressBookId, email } = await request.json();
    
    if (!addressBookId || !email) {
      return Response.json({
        success: false,
        error: 'addressBookId and email are required'
      }, { status: 400 });
    }
    
    console.log(`🧪 Testing contact addition to address book: ${addressBookId}`);
    
    const testContact = {
      email: email,
      name: 'Test Contact',
      source: 'api_test'
    };
    
    const result = await sendPulseHttpService.addContact(testContact, addressBookId);
    
    return Response.json({
      success: true,
      message: `Contact successfully added to address book ${addressBookId}`,
      data: result
    });
    
  } catch (error) {
    console.error('❌ Address book contact test failed:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 