import { TokenStore } from '@commercetools/ts-client';

export const isTokenStore = (obj: unknown): obj is TokenStore => {
  return obj !== null && typeof obj === 'object' && 'token' in obj && 'expirationTime' in obj;
};
