import { Client } from '@commercetools/sdk-client-v2';

export interface CartProps {
  onCartUpdate?: () => void;
  client?: Client;
}
