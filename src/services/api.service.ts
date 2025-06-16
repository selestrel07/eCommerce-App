import { apiRootBuilder } from './clientBuilder';
import { handleApiError } from './errorHandler';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService';
import {
  Cart,
  Customer,
  MyCartUpdateAction,
  MyCustomerUpdateAction,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { QueryParams } from '@interfaces';
import { ProductResponse } from '@interfaces';

export const loadProducts = async (
  client: Client,
  currency = 'EUR',
  filters: QueryParams,
  country?: string,
  customerGroupId?: string,
  channelId?: string,
  sort?: string,
  filterQueries?: string[],
  searchQuery?: string,
  limit?: number,
  offset?: number
): Promise<ProductResponse> => {
  const apiRoot = apiRootBuilder(client);

  try {
    const filterExpressions: string[] = [];

    if (filters.color) {
      filterExpressions.push(`variants.attributes.color:"${filters.color}"`);
    }

    if (filters.scopedPriceDiscounted) {
      filterExpressions.push(`variants.scopedPriceDiscounted:"${filters.scopedPriceDiscounted}"`);
    }

    if (filters.sex) {
      filterExpressions.push(`variants.attributes.sex.key:"${filters.sex}"`);
    }

    const requestBuilder = apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          ...(searchQuery && { ['text.en-US']: searchQuery }),
          priceCurrency: currency,
          markMatchingVariants: true,
          staged: false,
          limit,
          offset,
          variantFilter: [
            filters.color ? `attributes.color:"${filters.color}"` : null,
            filters.sex ? `attributes.sex.key:"${filters.sex}"` : null,
          ].filter((item): item is string => Boolean(item)),
          ...(filterExpressions.length > 0 && { filter: filterExpressions }),
          ...(country && { priceCountry: country }),
          ...(customerGroupId && { priceCustomerGroup: customerGroupId }),
          ...(channelId && { priceChannel: channelId }),
          ...(sort && { sort: [sort] }),
          ...(filterQueries && { 'filter.query': filterQueries }),
          expand: ['masterVariant.attributes', 'variants.attributes'],
        },
      });

    const httpResponse = await requestBuilder.execute();

    return {
      results: httpResponse.body.results,
      total: httpResponse.body.total ?? 0,
    };
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
    throw new Error(humanReadableMsg);
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

export const loadCart = async (client: Client) => {
  const apiRoot = apiRootBuilder(client);
  try {
    const httpResponse = await apiRoot.me().activeCart().get().execute();
    return httpResponse.body;
  } catch (rawError: unknown) {
    if (rawError instanceof Error && rawError.message === 'URI not found: /yagni/me/active-cart') {
      return createCart(client);
    } else {
      throw new Error(handleApiError(rawError));
    }
  }
};

export const createCart = async (client: Client) => {
  const apiRoot = apiRootBuilder(client);
  try {
    const httpResponse = await apiRoot
      .me()
      .carts()
      .post({
        body: {
          currency: 'EUR',
        },
      })
      .execute();
    return httpResponse.body;
  } catch (rawError: unknown) {
    throw new Error(handleApiError(rawError));
  }
};

export async function removeLineItem(client: Client, lineItemId: string): Promise<Cart> {
  const apiRoot = apiRootBuilder(client);

  try {
    const cartResponse = await apiRoot.me().activeCart().get().execute();
    const cart = cartResponse.body;

    const updatedCartResponse = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
      })
      .execute();

    return updatedCartResponse.body;
  } catch (rawError) {
    console.error('Failed to remove line item:', rawError);
    throw new Error(handleApiError(rawError));
  }
}

export async function addToCart(
  client: Client,
  productId: string,
  variantId: number
): Promise<Cart> {
  const apiRoot = apiRootBuilder(client);

  try {
    const cartResponse = await apiRoot.me().activeCart().get().execute();
    const cart = cartResponse.body;

    if (!cart.id || !cart.version) {
      throw new Error('No active cart found. Please reload the app or sign in again.');
    }

    const updatedCartResponse = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              variantId,
              quantity: 1,
            },
          ],
        },
      })
      .execute();

    return updatedCartResponse.body;
  } catch (rawError) {
    console.error('Failed to add product to cart:', rawError);
    throw new Error(handleApiError(rawError));
  }
}
export const loadDiscountCodes = async (client: Client) => {
  const apiRoot = apiRootBuilder(client);
  try {
    const httpResponse = await apiRoot.discountCodes().get().execute();
    return httpResponse.body;
  } catch (rawError: unknown) {
    throw new Error(handleApiError(rawError));
  }
};

export const updateCart = async (
  client: Client,
  ID: string,
  version: number,
  actions: MyCartUpdateAction[]
) => {
  const apiRoot = apiRootBuilder(client);
  try {
    const httpResponse = await apiRoot
      .me()
      .carts()
      .withId({
        ID,
      })
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();
    return httpResponse.body;
  } catch (rawError: unknown) {
    throw new Error(handleApiError(rawError));
  }
};
