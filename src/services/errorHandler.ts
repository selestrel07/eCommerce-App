import { RawApiError } from '../interfaces/interfaces';
import { HttpStatus } from '@enums';

export function handleApiError(error: unknown): string {
  const apiError = error as RawApiError;
  const status = apiError.statusCode ?? apiError.body?.statusCode;
  const bodyMessage = apiError.body?.message;
  const firstCode = apiError.body?.errors?.[0]?.code;

  if (!status) {
    return 'An unexpected error occurred. Please try again..';
  }

  switch (status as HttpStatus) {
    case HttpStatus.BAD_REQUEST:
      // First, let's look at the code from body.errors
      if (firstCode === 'InvalidCredentials') {
        return 'Incorrect email or password.';
      }
      // If there is a message in the body, we use it
      return bodyMessage
        ? `Invalid request: ${bodyMessage}`
        : 'Invalid request. Check your input..';
    case HttpStatus.UNAUTHORIZED:
      return 'Unauthorized. Please log in again.';
    case HttpStatus.FORBIDDEN:
      return 'Access Denied. You do not have permission to perform this action.';
    case HttpStatus.NOT_FOUND:
      return 'Not found. The requested resource is missing.';
    case HttpStatus.CONFLICT:
      return 'Conflict. Resource already exists.';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'Server error. Please try again later.';
    default:
      return `Unknown error (code: ${status}).`;
  }
}
