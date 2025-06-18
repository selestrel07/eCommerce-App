import { Cart } from '@components';
import { use, useEffect } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadCart } from '@services';
import { CartContext } from '@contexts';
import './CartPage.scss';

export default function CartPage({ client }: { client: Client }) {
  const { setCart } = use(CartContext);
  useEffect(() => {
    loadCart(client)
      .then((response) => setCart(response))
      .catch((error) => console.error(error));
  }, [client]);

  return (
    <div className="cart-page-container">
      <Cart client={client} />
    </div>
  );
}
