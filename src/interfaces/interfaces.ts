import { Client } from '@commercetools/sdk-client-v2';

export interface AppHeaderProps {
  isSignedIn: boolean;
  setSignedIn: (value: boolean) => void;
  setApiClient: (client: Client) => void;
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

export interface PriceInfo {
  amount: number;
  currency: string;
  originalAmount?: number | null;
}

export interface ProductAttribute {
  name: string;
  value: string | Record<string, string>;
}
