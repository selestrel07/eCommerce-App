import { ProductProjection } from '@commercetools/platform-sdk';
import { getProductPrice } from './productPrice.ts';
import { extractAttributes } from './extractAttributes.ts';
import { ProductVariantWithPriceAndName, QueryParams } from '@interfaces';

export const mapProducts = (products: ProductProjection[]) =>
  products.map((product) => {
    const masterVariant = product.masterVariant;

    const getVariantPrice = (variant: typeof masterVariant) =>
      getProductPrice(
        {
          ...product,
          masterVariant: variant,
        },
        'EUR'
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

export const getVariants = (
  products: ProductProjection[],
  filters: QueryParams
): ProductVariantWithPriceAndName[] => {
  return mapProducts(products)
    .flatMap((product) =>
      [product.masterVariant, ...product.variants].map((variant) => {
        const colorAttr = variant.attributes?.color;
        const sexAttr = variant.attributes?.sex;

        const matchesColor = !filters.color || colorAttr === filters.color;
        const matchesSex = !filters.sex || sexAttr === filters.sex;

        return {
          ...variant,
          productName: product.name,
          isMatchingVariant: !!(matchesColor && matchesSex),
        };
      })
    )
    .filter((v) => v.isMatchingVariant);
};
