import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type {
  // AuthMiddlewareOptions,
  Client,
  HttpMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// Type checking of environment variables
export const getEnvVariable = (name: string): string => {
  const value = import.meta.env[name] as string;
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing or invalid environment variable: ${name}`);
  }
  return value;
};

// Get and check variables
const projectKey = getEnvVariable('VITE_PROJECT_KEY');
const clientId = getEnvVariable('VITE_CLIENT_ID');
const clientSecret = getEnvVariable('VITE_CLIENT_SECRET');
const authUrl = getEnvVariable('VITE_AUTH_URL');
const apiUrl = getEnvVariable('VITE_API_URL');
const scopes = getEnvVariable('VITE_SCOPES').split(' ');

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
    .withLoggerMiddleware()
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
    fetch: window.fetch.bind(window),
  };

  return new ClientBuilder()
    .withPasswordFlow(passOptions)
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}

export function apiRootBuilder(client: Client) {
  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}
