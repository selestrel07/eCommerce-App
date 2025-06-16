import { Paths } from '@enums';
import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@contexts';
import { CartDiscountCode, CartItem } from '@components';
import { Flex } from 'antd';
import { Client } from '@commercetools/sdk-client-v2';
import { updateCart } from '@services';
import { useState } from 'react';

export const Cart: FC<{
  client: Client;
}> = ({ client }): ReactElement => {
  // const { cart } = useCart();

  const { cart, setCart } = useCart();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleQuantityChange = async (lineItemId: string, newQty: number) => {
    if (!cart || newQty < 1) return;
    setUpdatingId(lineItemId);
    try {
      const updated = await updateCart(client, cart.id, cart.version, [
        { action: 'changeLineItemQuantity', lineItemId, quantity: newQty },
      ]);
      setCart(updated);
    } catch (err) {
      console.error('Failed to update cart:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {cart === null || cart?.lineItems.length === 0 ? (
        <h2>
          There are no items in your cart. Please proceed with{' '}
          <Link to={Paths.CATALOG}>Catalog</Link> to add items.
        </h2>
      ) : (
        <>
          <Flex gap="middle" vertical align="center">
            {cart.lineItems.map((item) => (
              <CartItem
                key={item.id}
                lineItem={item}
                updating={updatingId === item.id}
                onQuantityChange={(id, qty) => {
                  void handleQuantityChange(id, qty);
                }}
              />
            ))}
            <CartDiscountCode client={client} />
          </Flex>
        </>
      )}
    </>
  );
};
