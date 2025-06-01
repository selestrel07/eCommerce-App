import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductAttribute } from '../interfaces/interfaces';

export const extractAttributes = (
  product: ProductProjection,
  variant = product.masterVariant
): Record<string, string> => {
  const attrs: Record<string, string> = {};
  const locale = 'en-US';

  const attributes = variant.attributes as ProductAttribute[] | undefined;

  attributes?.forEach((attr) => {
    if (typeof attr.value === 'string') {
      attrs[attr.name] = attr.value;
    } else {
      const localized = attr.value;
      attrs[attr.name] = localized[locale] ?? Object.values(localized)[0];
    }
  });

  return attrs;
};
