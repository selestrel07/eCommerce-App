import { Client } from '@commercetools/sdk-client-v2';
import { apiRootBuilder } from './clientBuilder';
import { handleApiError } from './errorHandler';

export async function addToCart(client: Client, productId: string, variantId: number) {
  const apiRoot = apiRootBuilder(client);

  try {
    let cartResponse;
    try {
      cartResponse = await apiRoot.me().activeCart().get().execute();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'message' in error &&
        typeof error.message === 'string' &&
        error.message.includes('URL not found: /yagni/me/active-cart')
      ) {
        cartResponse = { body: await createCart(client) };
      } else {
        throw error;
      }
    }

    if (!cartResponse?.body?.id) {
      throw new Error('Failed to retrieve or create cart');
    }

    const updatedCart = await apiRoot
      .me()
      .carts()
      .withId({ ID: cartResponse.body.id })
      .post({
        body: {
          version: cartResponse.body.version,
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

    return updatedCart.body;
  } catch (rawError) {
    console.error('Failed to add product to cart:', rawError);
    throw new Error(handleApiError(rawError));
  }
}

async function createCart(client: Client) {
  const apiRoot = apiRootBuilder(client);
  const cart = await apiRoot
    .me()
    .carts()
    .post({
      body: {
        currency: 'EUR',
      },
    })
    .execute();

  return cart.body;
}
