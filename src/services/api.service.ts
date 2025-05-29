import { apiRootBuilder } from './clientBuilder.ts';
import { handleApiError } from './errorHandler.ts';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService.ts';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductWithPrice } from '../interfaces/product/product.ts';
import { getProductPrice } from '../utils/productPrice.ts';
import { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';

export const loadProducts = async (
  client: Client,
  currency = 'EUR',
  country?: string,
  customerGroupId?: string,
  channelId?: string
): Promise<ProductWithPrice[]> => {
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
        },
      })
      .execute();

    const products: ProductProjection[] = httpResponse.body.results;

    const mappedProducts = products.map((product) => {
      const priceInfo = getProductPrice(product, currency);

      return {
        id: product.id,
        name: product.name,
        price: priceInfo
          ? {
              value: priceInfo.amount,
              currency: priceInfo.currency,
              discountedValue: priceInfo.discountedAmount,
            }
          : undefined,
      };
    });

    products.forEach((product) => {
      console.log(`Product ID: ${product.id}`);
      console.log('Published:', product.published);
      console.log('Name:', product.name);
      console.log('Master Variant Prices:', product.masterVariant.prices);
      console.log('First Variant Prices:', product.variants?.[0]?.prices);
    }); // I leave it for testing purposes only, when you run the next shuffle, delete this code and comments
    return mappedProducts;
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
