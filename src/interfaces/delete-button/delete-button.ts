import { Client } from '@commercetools/sdk-client-v2';

export interface DeleteFromCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  lineItemId: string;
  client: Client;
  onCartUpdate?: () => void;
}
