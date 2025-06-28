import { WebflowFormData, ContactData } from './types';

/**
 * Extracts and normalizes form data from Webflow payload
 */
export class FieldExtractor {
  /**
   * Extracts email from standardized field name
   */
  static extractEmail(formData: WebflowFormData): string | null {
    const value = formData['email'];
    return value && typeof value === 'string' ? value : null;
  }

  /**
   * Extracts first name from standardized field name
   */
  static extractFirstName(formData: WebflowFormData): string | null {
    const value = formData['firstname'];
    return value && typeof value === 'string' ? value : null;
  }

  /**
   * Extracts last name from standardized field name
   */
  static extractLastName(formData: WebflowFormData): string | null {
    const value = formData['lastname'];
    return value && typeof value === 'string' ? value : null;
  }

  /**
   * Extracts phone number from standardized field name
   */
  static extractPhone(formData: WebflowFormData): string | null {
    const value = formData['phone'];
    return value ? String(value) : null;
  }

  /**
   * Extracts company name from standardized field name
   */
  static extractCompany(formData: WebflowFormData): string | null {
    const value = formData['companyname'];
    return value && typeof value === 'string' ? value : null;
  }

  /**
   * Extracts messages from standardized field name
   */
  static extractMessages(formData: WebflowFormData): string | null {
    const value = formData['messages'];
    return value && typeof value === 'string' ? value : null;
  }

  /**
   * Extracts number of employees from standardized field name
   */
  static extractNumberOfEmployees(formData: WebflowFormData): string | null {
    const value = formData['numberofemployees'];
    return value ? String(value) : null;
  }

  /**
   * Converts field name to snake_case for SendPulse
   */
  static normalizeFieldName(fieldName: string): string {
    return fieldName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  /**
   * Extracts all form data and converts to ContactData format
   */
  static extractContactData(formData: WebflowFormData): ContactData {
    const email = this.extractEmail(formData);
    if (!email) {
      throw new Error(`Email is required but not found in form data. Available fields: ${Object.keys(formData).join(', ')}`);
    }

    const contactData: ContactData = { email };

    // Add optional standard fields
    const firstName = this.extractFirstName(formData);
    if (firstName) contactData.firstname = firstName;
    
    const lastName = this.extractLastName(formData);
    if (lastName) contactData.lastname = lastName;

    const phone = this.extractPhone(formData);
    if (phone) contactData.phone = phone;

    const companyname = this.extractCompany(formData);
    if (companyname) contactData.companyname = companyname;

    const messages = this.extractMessages(formData);
    if (messages) contactData.message = messages;

    const numberOfEmployees = this.extractNumberOfEmployees(formData);
    if (numberOfEmployees) contactData.numberofemployees = numberOfEmployees;

    // Add all form fields as custom variables (including the extracted ones for completeness)
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value !== undefined && value !== null && value !== '') {
        const normalizedKey = this.normalizeFieldName(key);
        contactData[normalizedKey] = String(value);
      }
    });

    return contactData;
  }
} 