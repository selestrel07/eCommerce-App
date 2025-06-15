import { ProductProjection } from '@commercetools/platform-sdk';

export interface ProductResponse {
  results: ProductProjection[];
  total: number;
}
