import { Paths } from '@enums';
import { FC, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@contexts';
import { CartDiscountCode, CartItem, ClearShoppingCartButton } from '@components';
import { Flex } from 'antd';
import { Client } from '@commercetools/sdk-client-v2';
import { updateCart, loadCart } from '@services';
import { formatPrice } from '@utils';

export const Cart: FC<{
  client: Client;
}> = ({ client }): ReactElement => {
  const { cart, setCart, cartTotal } = useCart();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const onCartUpdate = async () => {
    // перезагрузим корзину целиком
    try {
      const fresh = await loadCart(client);
      setCart(fresh);
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    }
  };

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

  const [totalItemsCost, setTotalItemsCost] = useState<number>(0);
  useEffect(() => {
    setTotalItemsCost(
      cart?.lineItems.reduce((acc, item) => acc + item.totalPrice.centAmount, 0) ?? 0
    );
  }, [cart]);
  const currency = cart?.totalPrice?.currencyCode ?? 'EUR';
  const formattedTotal = (cartTotal / 100).toFixed(2);
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
                client={client}
                onCartUpdate={() => void onCartUpdate()}
                updating={updatingId === item.id}
                availableStock={item.variant.availability?.availableQuantity ?? 0}
                onQuantityChange={(id, qty) => {
                  void handleQuantityChange(id, qty);
                }}
              />
            ))}
            <CartDiscountCode client={client} />
            <ClearShoppingCartButton client={client} />
            <div className="cart-page-total">
              <h3 className="title-total-cost">Total:</h3>{' '}
              {totalItemsCost > cartTotal ? (
                <span className="discounted-price">
                  <span className="original-price">
                    {formatPrice(totalItemsCost, cart?.totalPrice.fractionDigits)} {currency}
                  </span>{' '}
                  {formattedTotal}
                </span>
              ) : (
                formattedTotal
              )}
            </div>
          </Flex>
        </>
      )}
    </>
  );
};
