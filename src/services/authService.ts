import { v4 as uuidv4 } from 'uuid';
import type { CustomerSignInResult } from '@commercetools/platform-sdk';
import { createAnonymousClient, createCustomerClient, apiRootBuilder } from './clientBuilder';
import { handleApiError } from './errorHandler';

//Generate or get a permanent anonymousId from localStorage
let anonIdCache: string | null = null;

export function getAnonymousId(): string {
  anonIdCache ??= uuidv4();
  return anonIdCache;
}

//Function for get Anonymous client
let anonApiRoot = null as ReturnType<typeof apiRootBuilder> | null;

export function getAnonymousApi() {
  if (!anonApiRoot) {
    const client = createAnonymousClient(getAnonymousId());
    anonApiRoot = apiRootBuilder(client);
  }
  return anonApiRoot;
}

//Login customer with Email + password
export async function loginCustomer(
  email: string,
  password: string
): Promise<CustomerSignInResult> {
  const client = createCustomerClient(email, password);
  const apiRoot = apiRootBuilder(client);

  try {
    const httpResponse = await apiRoot.me().login().post({ body: { email, password } }).execute();
    //Here response.body contains CustomerSignInResult with accessToken, refreshToken and customer
    return httpResponse.body;
  } catch (rawError: unknown) {
    // Convert CommerceTools errors to readable ones
    const humanReadbleMsg = handleApiError(rawError);
    throw mapAuthError(humanReadbleMsg);
  }
}

//Mapping authentication errors into human-readable messages

function mapAuthError(error: unknown): Error {
  // If it is Error, we get its text
  const errMessage = error instanceof Error ? error.message : String(error);

  const err = error as { body?: { errors: { code: string; message: string }[] } };
  const first = err.body?.errors?.[0];
  if (first) {
    if (first.code === 'InvalidCredentials') {
      return new Error('Incorrect email or password');
    }
    return new Error(first.message);
  }

  // If the body has not arrived, but the message contains text about "credentials not found"
  if (errMessage.includes('credentials not found') || errMessage.includes('InvalidCredentials')) {
    return new Error('Incorrect email or password');
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Unknown error during authentication');
}
