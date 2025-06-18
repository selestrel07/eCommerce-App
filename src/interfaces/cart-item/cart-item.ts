import { LineItem } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';

export interface CartItemProps {
  lineItem: LineItem;
  client: Client;
  onCartUpdate?: () => void;
}
