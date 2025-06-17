import { apiRootBuilder } from './clientBuilder';
import { handleApiError } from './errorHandler';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService';
import {
  Cart,
  Customer,
  MyCartAddLineItemAction,
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

function isNotFoundError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const status = (error as { statusCode?: unknown }).statusCode;
    return typeof status === 'number' && status === 404;
  }
  return false;
}

export const loadCart = async (client: Client) => {
  const apiRoot = apiRootBuilder(client);
  try {
    const httpResponse = await apiRoot
      .me()
      .activeCart()
      .get({
        queryArgs: {
          expand: ['lineItems[*].variant.availability'],
        },
      })
      .execute();
    return httpResponse.body;
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return createCart(client);
    }
    if (error instanceof Error && error.message.includes('active-cart')) {
      return createCart(client);
    }
    throw error;
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

// export async function addToCart(
//   client: Client,
//   productId: string,
//   variantId: number
// ): Promise<Cart> {
//   const apiRoot = apiRootBuilder(client);

//   try {
//     const cartResponse = await apiRoot.me().activeCart().get().execute();
//     const cart = cartResponse.body;

//     if (!cart.id || !cart.version) {
//       throw new Error('No active cart found. Please reload the app or sign in again.');
//     }

//     const updatedCartResponse = await apiRoot
//       .me()
//       .carts()
//       .withId({ ID: cart.id })
//       .post({
//         body: {
//           version: cart.version,
//           actions: [
//             {
//               action: 'addLineItem',
//               productId,
//               variantId,
//               quantity: 1,
//             },
//           ],
//         },
//       })
//       .execute();

//     return updatedCartResponse.body;
//   } catch (rawError) {
//     console.error('Failed to add product to cart:', rawError);
//     throw new Error(handleApiError(rawError));
//   }
// }

export async function clearCart(client: Client): Promise<Cart> {
  const apiRoot = apiRootBuilder(client);

  try {
    const cartResponse = await apiRoot.me().activeCart().get().execute();
    const cart = cartResponse.body;

    const actions = cart.lineItems.map((item) => ({
      action: 'removeLineItem' as const,
      lineItemId: item.id,
    }));

    const updatedCartResponse = await apiRoot
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions,
        },
      })
      .execute();
    return updatedCartResponse.body;
  } catch (rawError) {
    console.error('Failed to clear cart', rawError);
    throw new Error('Failed to clear the cart');
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

export async function updateCart(
  client: Client,
  cartId: string,
  cartVersion: number,
  actions: MyCartUpdateAction[]
) {
  const apiRoot = apiRootBuilder(client);
  try {
    const resp = await apiRoot
      .me()
      .carts()
      .withId({ ID: cartId })
      .post({ body: { version: cartVersion, actions } })
      .execute();
    return resp.body;
  } catch (err: unknown) {
    console.error('Cart update failed', err);
    throw new Error(handleApiError(err));
  }
}

export async function addToCart(
  client: Client,
  cartId: string,
  cartVersion: number,
  productId: string,
  variantId: number
) {
  const action: MyCartAddLineItemAction = {
    action: 'addLineItem',
    productId,
    variantId,
    quantity: 1,
  };

  return updateCart(client, cartId, cartVersion, [action]);
}
