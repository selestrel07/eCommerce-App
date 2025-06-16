import { Client } from '@commercetools/sdk-client-v2';

export interface AddCartButtonProps {
  client: Client;
  productId: string;
  variantId: number;
}
