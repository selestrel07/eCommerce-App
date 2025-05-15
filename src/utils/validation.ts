import { FieldValidationObject } from '../interfaces/interfaces.ts';

const PASSWORD_MIN_LENGTH = 8;

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) return null;

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

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return null;

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
