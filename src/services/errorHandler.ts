interface ApiErrorBody {
  statusCode?: number;
  message?: string;
  errors?: { code?: string; message?: string }[];
}
interface RawApiError extends Error {
  statusCode?: number;
  body?: ApiErrorBody;
}

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export function handleApiError(error: unknown): string {
  const apiError = error as RawApiError;
  const status = apiError.statusCode ?? apiError.body?.statusCode;
  const bodyMessage = apiError.body?.message;
  const firstCode = apiError.body?.errors?.[0]?.code;

  if (!status) {
    return 'An unexpected error occurred. Please try again..';
  }

  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      // First, let's look at the code from body.errors
      if (firstCode === 'InvalidCredentials') {
        return 'Incorrect email or password.';
      }
      // If there is a message in the body, we use it
      return bodyMessage
        ? `Invalid request: ${bodyMessage}`
        : 'Invalid request. Check your input..';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Unauthorized. Please log in again.';
    case HTTP_STATUS.FORBIDDEN:
      return 'Access Denied. You do not have permission to perform this action.';
    case HTTP_STATUS.NOT_FOUND:
      return 'Not found. The requested resource is missing.';
    case HTTP_STATUS.CONFLICT:
      return 'Conflict. Resource already exists.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Server error. Please try again later.';
    default:
      return `Unknown error (code: ${status}).`;
  }
}
