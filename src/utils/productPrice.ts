import { ProductProjection } from '@commercetools/platform-sdk';
import { PriceInfo } from '../interfaces/product/product';

export const getProductPrice = (product: ProductProjection, currency: string): PriceInfo | null => {
  let price;

  price = product.masterVariant.prices?.find((p) =>
    currency ? p.value.currencyCode === currency : true
  );

  if (!price && product.variants?.length) {
    for (const variant of product.variants) {
      price = variant.prices?.find((p) => (currency ? p.value.currencyCode === currency : true));
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
