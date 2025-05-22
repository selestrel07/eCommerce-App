import { ProductProjection } from '@commercetools/platform-sdk';
import { PriceInfo } from '../interfaces/interfaces';

export const getProductPrice = (product: ProductProjection): PriceInfo | null => {
  const price = product.masterVariant.prices?.[0];
  if (!price) return null;

  const amount = price.value.centAmount / 100;
  const currency = price.value.currencyCode;

  return { amount, currency };
};
