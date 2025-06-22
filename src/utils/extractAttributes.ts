import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductAttribute } from '@interfaces';

export const extractAttributes = (
  product: ProductProjection,
  variant = product.masterVariant
): Record<string, string> => {
  const attrs: Record<string, string> = {};
  const locale = 'en-US';

  const attributes = variant.attributes as ProductAttribute[] | undefined;

  attributes?.forEach((attr) => {
    const value = attr.value;

    if (typeof value === 'string') {
      attrs[attr.name] = value;
    } else {
      attrs[attr.name] =
        (value[locale] || Object.values(value).find((v) => typeof v === 'string')) ?? '—';
    }
  });

  return attrs;
};
