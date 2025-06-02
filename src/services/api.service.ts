import { apiRootBuilder } from './clientBuilder';
import { handleApiError } from './errorHandler';
import { Client } from '@commercetools/sdk-client-v2';
import { mapAuthError } from './authService';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductWithPrice } from '../interfaces/product/product';
import { getProductPrice } from '../utils/productPrice';
import { extractAttributes } from '../utils/extractAttributes';

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
          expand: ['masterVariant.attributes', 'variants.attributes'],
        },
      })
      .execute();

    const products: ProductProjection[] = httpResponse.body.results;

    return products.map((product) => {
      const masterVariant = product.masterVariant;

      const getVariantPrice = (variant: typeof masterVariant) =>
        getProductPrice(
          {
            ...product,
            masterVariant: variant,
          },
          currency
        );

      const masterPrice = getVariantPrice(masterVariant);
      const image =
        masterVariant?.images?.find((img) => img.label === 'Main')?.url ??
        masterVariant?.images?.[0]?.url;

      return {
        id: product.id,
        key: product.key!,
        name: product.name,
        description: product.description,
        image,
        price: masterPrice,
        masterVariant: {
          id: masterVariant.id,
          key: masterVariant.key ?? undefined,
          sku: masterVariant.sku ?? undefined,
          price: masterPrice,
          images: masterVariant.images ?? [],
          attributes: extractAttributes(product, masterVariant),
        },
        variants: (product.variants || []).map((variant) => {
          const variantPrice = getProductPrice({
            ...product,
            masterVariant: variant,
          });

          return {
            id: variant.id,
            key: variant.key ?? undefined,
            sku: variant.sku ?? undefined,
            price: variantPrice ?? undefined,
            images: variant.images ?? [],
            attributes: extractAttributes(product, variant),
          };
        }),
      };
    });
  } catch (rawError: unknown) {
    const humanReadableMsg = handleApiError(rawError);
    throw mapAuthError(humanReadableMsg);
  }
};
