import { Client } from '@commercetools/sdk-client-v2';
import { TokenCache, TokenStore } from '@commercetools/ts-client';

export const emptyTokenStore: TokenStore = {
  token: '',
  refreshToken: '',
  expirationTime: 0,
};

export const tokenCache: TokenCache = (function () {
  let myCache: TokenStore = emptyTokenStore;
  return {
    get: () => {
      return myCache;
    },
    set: (cache: TokenStore): void => {
      myCache = cache;
    },
  };
})();
let anonymousClientCache: Client | null = null;

export const getAnonymousClient = () => anonymousClientCache;

export const setAnonymousClient = (anonymousClient: Client) =>
  (anonymousClientCache = anonymousClient);
