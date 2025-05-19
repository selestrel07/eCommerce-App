import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type {
  Client,
  HttpMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { EnvKey } from '../enums/env-keys';
import { TokenCache, TokenStore } from '@commercetools/ts-client';
import { tokenCache } from './storage/storage.service.ts';

// Type checking of environment variables
export const getEnvVariable = (key: EnvKey): string => {
  const value: unknown = import.meta.env[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing or invalid environment variable: ${key}`);
  }
  return value;
};

// Get and check variables
export const projectKey = getEnvVariable(EnvKey.PROJECT_KEY);
export const clientId = getEnvVariable(EnvKey.CLIENT_ID);
const clientSecret = getEnvVariable(EnvKey.CLIENT_SECRET);
export const authUrl = getEnvVariable(EnvKey.AUTH_URL);
const apiUrl = getEnvVariable(EnvKey.API_URL);
const scopes = getEnvVariable(EnvKey.SCOPES).split(' ');

// HTTP-setting for all clients
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  includeRequestInErrorResponse: true, // Include request in error responses
  includeOriginalRequest: true, // Include request in successful responses
  // fetch,
  fetch: window.fetch.bind(window),
};

//Anonymous client
export function createAnonymousClient(anonymousId?: string): Client {
  const anonOptions: AnonymousAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
      anonymousId,
    },
    scopes,
    fetch: window.fetch.bind(window),
  };

  return new ClientBuilder()
    .withAnonymousSessionFlow(anonOptions)
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
}

// Client for customer (password flow)
export function createCustomerClient(username: string, password: string): Client {
  const passOptions: PasswordAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
      user: { username, password },
    },
    scopes,
    tokenCache,
    fetch: window.fetch.bind(window),
  };

  return new ClientBuilder()
    .withPasswordFlow(passOptions)
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
}

// Client for customer (refresh token flow)
export function createRefreshTokenClient(tokenCache: TokenCache): Client {
  const tokenStore: TokenStore = tokenCache.get();
  const refreshToken = tokenStore.refreshToken ?? '';
  const options: RefreshAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
    },
    refreshToken,
    tokenCache,
    fetch,
  };

  return new ClientBuilder()
    .withRefreshTokenFlow(options)
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
}

export function apiRootBuilder(client: Client) {
  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}
