import dayjs from 'dayjs';
import { FieldValidationObject } from '../interfaces/interfaces.ts';
import { CountriesData } from '../data/countries/countries.ts';

const PASSWORD_MIN_LENGTH = 8;
const MINIMUM_AGE = 13;

export const validatePassword = (password: string): string | null => {
  if (!password) return 'The password is required.';

  if (!password.trim()) {
    return 'The password must not consist only of spaces.';
  }

  if (password !== password.trim()) {
    return 'The password must not contain spaces at the beginning or end.';
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return 'The password must be at least 8 characters long.';
  }

  if (!/[A-Z]/.test(password)) {
    return 'The password must contain at least one capital letter.';
  }

  if (!/[a-z]/.test(password)) {
    return 'The password must contain at least one lowercase letter.';
  }

  if (!/\d/.test(password)) {
    return 'The password must contain at least one digit.';
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return 'The password must contain at least one special character (!@#$%$%^&*).';
  }

  return null;
};

export const validateRepeatPassword = (
  repeatPassword: string,
  originalPassword: string
): string | null => {
  if (repeatPassword !== originalPassword) {
    return 'Passwords do not match.';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required.';

  if (!email.trim()) {
    return 'Email must not consist only of spaces.';
  }

  if (email !== email.trim()) {
    return 'The Email must not contain spaces at the beginning or end.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Enter a valid email address.';
  }

  const [localPart, domain] = email.split('@');
  if (localPart) {
    if (!domain.includes('.')) {
      return 'The domain name must contain a dot (e.g., example.com).';
    }
  }

  const domainParts = domain.split('.');
  if (domainParts.some((part) => part.length === 0)) {
    return 'The domain name contains invalid empty parts.';
  }

  return null;
};
export const validateStringField = (
  value: string,
  fieldName: 'first name' | 'last name' | 'city' | 'street'
): string | null => {
  if (!value) return `The ${fieldName} is required.`;

  if (!value.trim()) {
    return `The ${fieldName} must not consist only of spaces.`;
  }

  if (value.trim() !== value) {
    return `The ${fieldName} must not contain spaces at the beginning or end.`;
  }

  if (value.length < 1) {
    return `The ${fieldName} must be at least 1 character long.`;
  }

  if (/[!@#$%^&*]/.test(value)) {
    return `The ${fieldName} must not contain special characters (!@#$%^&*).`;
  }

  if (/\d/.test(value)) {
    return `The ${fieldName} must not contain digits.`;
  }

  return null;
};

export function validateDate(date: string | undefined): string | null {
  if (!date) {
    return 'Date is required';
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return 'Invalid date format. Use YYYY-MM-DD.';
  }

  const selectedDate = dayjs(date);
  const thirteenYearsAgo = dayjs().subtract(MINIMUM_AGE, 'years');

  if (selectedDate.isAfter(thirteenYearsAgo)) {
    return 'You must be at least 13 years old.';
  }

  return null;
}

export const validatePostalCode = (value: string, country: string): string | null => {
  const regex = Object.entries(CountriesData).find((key) => key[0] === country);
  if (regex && !new RegExp(regex[1]).test(value)) {
    return 'Invalid postal code format.';
  }

  return null;
};

export const composeFieldValidationObject = (
  value: string,
  validationFunction: (value: string) => string | null,
  errorSetter: (error: string) => void
): FieldValidationObject => {
  return {
    value,
    validationFunction,
    errorSetter,
  };
};

export const validateFields = (fieldValidationObjects: FieldValidationObject[]): string[] => {
  const validationErrors = [];
  for (const validationObject of fieldValidationObjects) {
    const error = validationObject.validationFunction(validationObject.value);
    if (error) {
      validationObject.errorSetter(error);
      validationErrors.push(error);
    }
  }

  return validationErrors;
};
