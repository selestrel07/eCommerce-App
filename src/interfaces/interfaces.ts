export interface AppHeaderProps {
  isSignedIn: boolean;
}

export interface ApiErrorBody {
  statusCode?: number;
  message?: string;
  errors?: { code?: string; message?: string }[];
}

export interface RawApiError extends Error {
  statusCode?: number;
  body?: ApiErrorBody;
}

export interface FieldValidationObject {
  value: string;
  validationFunction: (value: string) => string | null;
  errorSetter: (error: string) => void;
}
