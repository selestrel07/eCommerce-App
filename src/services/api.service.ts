import { apiRootBuilder } from './clientBuilder';
import { handleApiError } from './errorHandler';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService';
import { Customer, MyCustomerUpdateAction, ProductProjection } from '@commercetools/platform-sdk';
import { QueryParams } from '../interfaces/query-params/query-params.ts';

export const loadProducts = async (
  client: Client,
  currency = 'EUR',
  country?: string,
  customerGroupId?: string,
  channelId?: string
): Promise<ProductProjection[]> => {
  const apiRoot = apiRootBuilder(client);

  try {
    const httpResponse = await apiRoot
      .productProjections()
      .get({
        queryArgs: {
          priceCurrency: currency,
          ...(country && { priceCountry: country }),
          ...(customerGroupId && { priceCustomerGroup: customerGroupId }),
          ...(channelId && { priceChannel: channelId }),
          expand: ['masterVariant.attributes', 'variants.attributes'],
        },
      })
      .execute();

    return httpResponse.body.results;
  } catch (rawError: unknown) {
    const humanReadableMsg = handleApiError(rawError);
    throw mapAuthError(humanReadableMsg);
  }
};

export const loadCustomerData = async (client: Client): Promise<Customer> => {
  const apiRoot = apiRootBuilder(client);

  try {
    const httpResponse = await apiRoot.me().get().execute();
    return httpResponse.body;
  } catch (rawError: unknown) {
    const humanReadableMsg = handleApiError(rawError);
    throw mapAuthError(humanReadableMsg);
  }
};

export const updateCustomer = async (
  client: Client,
  version: number,
  actions: MyCustomerUpdateAction[]
): Promise<Customer> => {
  const apiRoot = apiRootBuilder(client);

  try {
    const httpResponse = await apiRoot
      .me()
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();
    return httpResponse.body;
  } catch (rawError: unknown) {
    const humanReadableMsg = handleApiError(rawError);
    throw mapAuthError(humanReadableMsg);
  }
};

export const changePassword = async (
  client: Client,
  version: number,
  currentPassword: string,
  newPassword: string
): Promise<Customer> => {
  const apiRoot = apiRootBuilder(client);

  try {
    const httpResponse = await apiRoot
      .me()
      .password()
      .post({
        body: {
          version,
          currentPassword,
          newPassword,
        },
      })
      .execute();
    return httpResponse.body;
  } catch (rawError: unknown) {
    const humanReadableMsg = handleApiError(rawError);
    throw new Error(humanReadableMsg);
  }
};

export const loadCategories = async (client: Client) => {
  const apiRoot = apiRootBuilder(client);
  try {
    return await apiRoot.categories().get().execute();
  } catch (rawError: unknown) {
    const humanReadableMsg = handleApiError(rawError);
    throw new Error(humanReadableMsg);
  }
};

export const searchProducts = async (client: Client, args: QueryParams) => {
  const apiRoot = apiRootBuilder(client);
  try {
    const httpResponse = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: args,
      })
      .execute();
    return httpResponse.body.results;
  } catch (rawError: unknown) {
    throw new Error(handleApiError(rawError));
  }
};
