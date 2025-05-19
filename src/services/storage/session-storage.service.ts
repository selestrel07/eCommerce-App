import { tokenCache } from './storage.service.ts';

const TOKEN_KEY = 'ecommerce-customer-token';

export const saveCustomerToken = (): void => {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokenCache.get()));
};

export const loadCustomerToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const deleteCustomerToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};
