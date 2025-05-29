export interface ProductWithPrice {
  id: string;
  name: Record<string, string>;
  price?: {
    value: number;
    currency: string;
    discountedValue?: number;
  };
  image?: string;
}

export interface PriceInfo {
  amount: number;
  currency: string;
  discountedAmount?: number;
}
