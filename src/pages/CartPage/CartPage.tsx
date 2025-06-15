import { Cart } from '@components';
import { use, useEffect } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadCart } from '@services';
import { CartContext } from '@contexts';
import './CartPage.scss';

export default function CartPage({ client }: { client: Client }) {
  const { cart, cartTotal, setCart, setCartItemsCount } = use(CartContext);
  useEffect(() => {
    loadCart(client)
      .then((response) => {
        setCart(response);
        setCartItemsCount(response.lineItems.length);
      })
      .catch((error) => console.error(error));
  }, [client, setCart, setCartItemsCount]);

  const currency = cart?.totalPrice?.currencyCode ?? 'EUR';

  const formattedTotal = (cartTotal / 100).toFixed(2);

  return (
    <div className="cart-page-container">
      <Cart client={client} />
      <div className="cart-page-total">
        <h3 className="title-total-cost">Total:</h3> {formattedTotal} {currency}
      </div>
    </div>
  );
}
