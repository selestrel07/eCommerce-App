import { Cart } from '@components';
import { useEffect, useState } from 'react';
import { CartContext } from '@contexts';
import { Client } from '@commercetools/sdk-client-v2';
import { loadCart } from '@services';
import { Cart as CartApi } from '@commercetools/platform-sdk';
import './CartPage.scss';

export default function CartPage({ client }: { client: Client }) {
  const [cart, setCart] = useState<CartApi | null>(null);
  useEffect(() => {
    loadCart(client)
      .then((response) => setCart(response))
      .catch((error) => console.error(error));
  }, [client]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
      }}
    >
      <div className="cart-page-container">
        <Cart />
      </div>
    </CartContext.Provider>
  );
}
