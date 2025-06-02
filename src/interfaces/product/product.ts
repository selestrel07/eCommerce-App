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
}

export interface ProductWithPrice {
  id: string;
  key: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  image?: string;
  price?: PriceInfo;
  masterVariant: ProductVariantWithPrice;
  variants: ProductVariantWithPrice[];
}

export interface ProductAttribute {
  name: string;
  value: string | Record<string, string>;
}

export interface DiscountedPrice {
  value: TypedMoney;
}

export interface Price {
  value: TypedMoney;
  discounted?: DiscountedPrice;
}

export interface TypedMoney {
  type: 'centPrecision';
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

export interface Props {
  variant: ProductVariantWithPrice;
  name: string;
}
