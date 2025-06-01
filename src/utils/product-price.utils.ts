import { ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import { PriceInfo } from '../interfaces/interfaces';

export const getProductPrice = (
  product: ProductProjection,
  variant: ProductVariant = product.masterVariant
): PriceInfo | null => {
  const price = variant.prices?.[0];
  if (!price) return null;

  const amount = price.discounted
    ? price.discounted.value.centAmount / 100
    : price.value.centAmount / 100;
  const currency = price.value.currencyCode;

  const originalAmount = price.discounted ? price.value.centAmount / 100 : null;

  return {
    amount,
    currency,
    originalAmount,
  };
};
