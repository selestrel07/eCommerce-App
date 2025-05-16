export interface ApiErrorBody {
  statusCode?: number;
  message?: string;
  errors?: { code?: string; message?: string }[];
}

export interface RawApiError extends Error {
  statusCode?: number;
  body?: ApiErrorBody;
}

export interface SignInProps {
  setSignedIn: (value: boolean) => void;
}

export interface SignUpProps {
  setSignedIn: (value: boolean) => void;
}

export interface Fields {
  email: string;
  password: string;
}
