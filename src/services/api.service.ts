import { apiRootBuilder } from './clientBuilder.ts';
import { handleApiError } from './errorHandler.ts';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService.ts';
import { ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';

export const loadProducts = async (client: Client) => {
  const apiRoot = apiRootBuilder(client);

  try {
    const httpResponse = await apiRoot
      .productProjections()
      .get({ queryArgs: { limit: 1 } })
      .execute();
    //Here response.body contains CustomerSignInResult with accessToken, refreshToken and customer
    return httpResponse.body;
  } catch (rawError: unknown) {
    // Convert CommerceTools errors to readable ones
    const humanReadableMsg = handleApiError(rawError);
    throw mapAuthError(humanReadableMsg);
  }
};

export const getApiRoot = (client: Client) => apiRootBuilder(client);

export const getProductByKey = async (
  client: Client,
  key: string
): Promise<ProductProjectionPagedQueryResponse> => {
  const apiRoot = getApiRoot(client);

  try {
    const response = await apiRoot
      .productProjections()
      .get({
        queryArgs: {
          where: `masterVariant(key="${key}") or variants(key="${key}") or key="${key}"`,
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    console.error('Failed to fetch product data:', error);
    throw error;
  }
};
