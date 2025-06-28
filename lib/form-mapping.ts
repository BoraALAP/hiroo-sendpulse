import { AddressBookMapping } from './types';
import { CONFIG } from './config';

// Mapping of Webflow form IDs to SendPulse address book IDs
export const FORM_TO_ADDRESSBOOK_MAPPING: Record<string, AddressBookMapping> = {
  '66d84d72633d424869c060b0': { title: 'Demo Request', id: '963387' },
  '676402d3d986b33c56662f7d': { title: 'Ebook Page Sub', id: '963397' },
  '66d84d72633d424869c060d0': { title: 'Ebook Sub', id: '963398' },
  '66d84d72633d424869c060aa': { title: 'Event Sub', id: '963395' },
  '66d84d72633d424869c060bc': { title: 'Blog Sub', id: '963393' },
  '66d84d72633d424869c060e9': { title: 'Contact Us', id: '963390' },
  '66d84d72633d424869c060df': { title: 'Demo Day', id: '963388' },
  '66d84d72633d424869c060d2': { title: 'Pricing', id: '963392' },
};

const DEFAULT_MAPPING: AddressBookMapping = { 
  title: 'My emails', 
  id: CONFIG.SENDPULSE.DEFAULT_ADDRESS_BOOK_ID 
};

export function getAddressBookId(formId: string): AddressBookMapping {
  const mapping = FORM_TO_ADDRESSBOOK_MAPPING[formId];
  
  if (!mapping) {
    console.warn(`⚠️ No mapping found for form ${formId}, using default`);
    return DEFAULT_MAPPING;
  }
  
  console.log(`✅ Form ${formId} -> ${mapping.title} (${mapping.id})`);
  return mapping;
} 