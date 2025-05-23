import { apiRootBuilder } from './clientBuilder.ts';
import { handleApiError } from './errorHandler.ts';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService.ts';
import { ProductProjection } from '@commercetools/platform-sdk';

export interface ProductWithPrice {
  id: string;
  name: Record<string, string>;
  price?: {
    value: number;
    currency: string;
    discountedValue?: number;
  };
}

interface PriceInfo {
  amount: number;
  currency: string;
  discountedAmount?: number;
}

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

    const getProductPrice = (product: ProductProjection): PriceInfo | null => {
      let price;

      price = product.masterVariant.prices?.find((p) =>
        currency ? p.value.currencyCode === currency : true
      );

      if (!price && product.variants?.length) {
        for (const variant of product.variants) {
          price = variant.prices?.find((p) =>
            currency ? p.value.currencyCode === currency : true
          );
          if (price) break;
        }
      }
      if (!price && product.variants?.length) {
        for (const variant of product.variants) {
          price = variant.prices?.[0];
          if (price) break;
        }
      }

      if (!price) return null;

      return {
        amount: price.value.centAmount / 100,
        currency: price.value.currencyCode,
        discountedAmount: price.discounted?.value?.centAmount
          ? price.discounted.value.centAmount / 100
          : undefined,
      };
    };
    const mappedProducts = products.map((product) => {
      const priceInfo = getProductPrice(product);

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
