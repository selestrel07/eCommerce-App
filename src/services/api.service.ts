import { apiRootBuilder } from './clientBuilder.ts';
import { handleApiError } from './errorHandler.ts';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService.ts';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductWithPrice } from '../interfaces/product/product.ts';
import { getProductPrice } from '../utils/productPrice.ts';

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
      const image =
        product.masterVariant?.images?.find((img) => img.label === 'Main')?.url ??
        product.masterVariant?.images?.[0]?.url;
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
        image,
      };
    });

    return mappedProducts;
  } catch (rawError: unknown) {
    const humanReadableMsg = handleApiError(rawError);
    throw mapAuthError(humanReadableMsg);
  }
};
