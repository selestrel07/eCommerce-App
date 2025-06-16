import { Client } from '@commercetools/sdk-client-v2';
import './CartPage.scss';
import { Cart } from '@components';

export default function CartPage({ client }: { client: Client }) {
  return (
    <div className="cart-page-container">
      <Cart onCartUpdate={undefined} client={client} />
    </div>
  );
}
