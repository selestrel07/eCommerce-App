import { use, useEffect } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadCart } from '@services';
import { CartContext } from '@contexts';
import './CartPage.scss';
import { Cart } from '@components';

export default function CartPage({ client }: { client: Client }) {
  const { setCart, setCartItemsCount } = use(CartContext);

  const refreshCart = async () => {
    try {
      const response = await loadCart(client);
      setCart(response);
      setCartItemsCount(response.lineItems.length);
    } catch (error) {
      console.error('Failed to refresh cart', error);
    }
  };

  useEffect(() => {
    void refreshCart();
  }, [client]);

  return (
    <div className="cart-page-container">
      <Cart onCartUpdate={() => void refreshCart()} client={client} />
    </div>
  );
}
