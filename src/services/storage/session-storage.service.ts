import { tokenCache } from './storage.service.ts';
import { TokenStore } from '@commercetools/ts-client';

const TOKEN_KEY = 'ecommerce-customer-token';

export const saveCustomerToken = (): void => {
  const tokenStore: TokenStore = tokenCache.get();
  if (tokenStore.token.length > 0) {
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokenStore));
  }
};

export const loadCustomerToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const deleteCustomerToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};
