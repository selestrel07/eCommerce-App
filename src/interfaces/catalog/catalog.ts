import { ProductVariantWithPriceAndName } from '@interfaces';
import { ProductProjection } from '@commercetools/platform-sdk';

export interface CatalogItem {
  productId: string;
  variant: ProductVariantWithPriceAndName;
}

export interface ProductResponse {
  results: ProductProjection[];
  total: number;
}
