import { describe, expect, it } from 'vitest';
import {
  composeFieldValidationObject,
  validateAddressTypes,
  validateDate,
  validateEmail,
  validateFields,
  validatePassword,
} from './validation.ts';
import { AddressType } from '@enums';

const incorrectEmailData: Record<string, string> = {
  '   test@test.com': 'The Email must not contain spaces at the beginning or end.',
  'test@test.com   ': 'The Email must not contain spaces at the beginning or end.',
  'test@test@test.com': 'Enter a valid email address.',
  'test@test...com': 'The domain name contains invalid empty parts.',
};

const incorrectPasswordData: Record<string, string> = {
  '   password': 'The password must not contain spaces at the beginning or end.',
  'password   ': 'The password must not contain spaces at the beginning or end.',
  pass: 'The password must be at least 8 characters long.',
  password: 'The password must contain at least one capital letter.',
  PASSWORD: 'The password must contain at least one lowercase letter.',
  PASSword: 'The password must contain at least one digit.',
  PASSword1: 'The password must contain at least one special character (!@#$%$%^&*).',
};

const getRandomObjectKey = (fromObject: Record<string, string>) => {
  const keys = Object.keys(fromObject);
  return keys[Math.floor(Math.random() * keys.length)];
};

describe('Test email validation function ', () => {
  it('Should return an error message in case of incorrect email', () => {
    for (const email of Object.keys(incorrectEmailData)) {
      expect(validateEmail(email)).toBe(incorrectEmailData[email]);
    }
  });

  it('Should not return an error message in case of correct email', () => {
    expect(validateEmail('test@test.com')).toBe(null);
  });
});

describe('Test password validation function ', () => {
  it('Should return an error message if case of incorrect password', () => {
    for (const password of Object.keys(incorrectPasswordData)) {
      expect(validatePassword(password)).toBe(incorrectPasswordData[password]);
    }
  });

  it('Should not return an error message in case of correct password', () => {
    expect(validatePassword('Password1#')).toBe(null);
  });
});

describe('Test fields validation function ', () => {
  it('Should return an error message if case of incorrect fields', () => {
    const incorrectEmail = getRandomObjectKey(incorrectEmailData);
    const incorrectPassword = getRandomObjectKey(incorrectPasswordData);
    const validateFieldsResult = validateFields([
      composeFieldValidationObject(incorrectEmail, validateEmail, (error) => console.warn(error)),
      composeFieldValidationObject(incorrectPassword, validatePassword, (error) =>
        console.warn(error)
      ),
    ]);
    expect(validateFieldsResult.length).toBe(2);
    expect(
      validateFieldsResult.includes(incorrectEmailData[incorrectEmail]),
      incorrectPasswordData[incorrectPassword]
    ).toBe(true);
  });

  it('Should not return an error message if case of correct fields', () => {
    const validateFieldsResult = validateFields([
      composeFieldValidationObject('test@test.com', validateEmail, (error) => console.warn(error)),
      composeFieldValidationObject('Password1#', validatePassword, (error) => console.warn(error)),
    ]);
    expect(validateFieldsResult.length).toBe(0);
  });
});

describe('Test address type validation function', () => {
  it('Should return an error message if case of address types Billing and shipping was not chosen at the time', () => {
    expect(
      validateAddressTypes([], [AddressType.DEFAULT_SHIPPING, AddressType.DEFAULT_SHIPPING])
    ).toBe('Address must be marked as Billing or Shipping Address');
  });

  it('Should return an error message if case of address was marked as Default Billing/Shipping address and was not marked as Billing/Shipping address', () => {
    expect(validateAddressTypes([], [AddressType.SHIPPING, AddressType.DEFAULT_BILLING])).toBe(
      'Address must be marked as Billing Address to be the Default Billing Address'
    );
    expect(validateAddressTypes([], [AddressType.BILLING, AddressType.DEFAULT_SHIPPING])).toBe(
      'Address must be marked as Shipping Address to be the Default Shipping Address'
    );
  });

  it('Should return an error message if case of address was unmarked as Default Billing/Shipping address and was not unmarked as Billing/Shipping address', () => {
    expect(
      validateAddressTypes(
        [AddressType.BILLING, AddressType.DEFAULT_BILLING],
        [AddressType.BILLING]
      )
    ).toBe(
      'To unmark the address as Default Billing Address please mark an other address as Default Billing Address or unmark the address as Billing Address'
    );
    expect(
      validateAddressTypes(
        [AddressType.SHIPPING, AddressType.DEFAULT_SHIPPING],
        [AddressType.SHIPPING]
      )
    ).toBe(
      'To unmark the address as Default Shipping Address please mark an other address as Default Shipping Address or unmark the address as Shipping Address'
    );
  });
});

describe('Test date validation function', () => {
  it('Should return an error message if case of undefined date', () => {
    expect(validateDate(undefined)).toBe('Date is required');
  });

  it('Should return an error message if case of date format not equals to YYYY-MM-DD', () => {
    expect(validateDate('20-12-2024')).toBe('Invalid date format. Use YYYY-MM-DD.');
  });

  it('Should return an error message if case of provided date is closer than 13 years to now or is in the future', () => {
    expect(validateDate('2026-12-20')).toBe('You must be at least 13 years old.');
  });
});
