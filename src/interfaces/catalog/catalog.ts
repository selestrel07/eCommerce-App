import { ProductVariantWithPriceAndName } from '@interfaces';

export interface CatalogItem {
  productId: string;
  variant: ProductVariantWithPriceAndName;
}
