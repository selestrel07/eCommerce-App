import { ProductProjection } from '@commercetools/platform-sdk';
import { PriceInfo } from '@interfaces';

export const getProductPrice = (
  product: Pick<ProductProjection, 'masterVariant'>,
  currency?: string
): PriceInfo | undefined => {
  const effectiveCurrency = currency ?? 'EUR';

  const price = product.masterVariant.prices?.find(
    (p) => p.value.currencyCode === effectiveCurrency
  )?.value;

  if (!price || price.type !== 'centPrecision') return undefined;

  let discountedValue: number | null = null;

  const priceWithDiscount = product.masterVariant.prices?.find(
    (p) => p.value.currencyCode === effectiveCurrency && p.discounted
  );

  if (priceWithDiscount?.discounted?.value) {
    const { centAmount, fractionDigits } = priceWithDiscount.discounted.value;
    discountedValue = centAmount / Math.pow(10, fractionDigits);
  }

  const amount = price.centAmount / Math.pow(10, price.fractionDigits);

  return {
    amount,
    currency: price.currencyCode,
    originalAmount: amount,
    discountedValue,
  };
};
