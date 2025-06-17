import { Client } from '@commercetools/sdk-client-v2';

export interface PriceInfo {
  amount: number;
  currency: string;
  originalAmount: number;
  discountedValue: number | null;
}

export interface Image {
  url: string;
  label?: string;
}

export interface ProductVariantWithPrice {
  id: number;
  key?: string;
  sku?: string;
  price?: PriceInfo;
  images: Image[];
  attributes: Record<string, string>;
  isMatchingVariant?: boolean;
}

export interface ProductAttribute {
  name: string;
  value: string | Record<string, string>;
}

export interface DiscountedPrice {
  value: TypedMoney;
}

export interface TypedMoney {
  type: 'centPrecision';
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

export interface ProductVariantWithPriceAndName extends ProductVariantWithPrice {
  productName: Record<string, string>;
}

export interface Props {
  variant: ProductVariantWithPrice;
  name: string;
  client: Client;
  productId: string;
}
