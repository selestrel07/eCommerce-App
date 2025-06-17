import { Paths } from '@enums';
import { FC, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@contexts';
import { CartDiscountCode, CartItem } from '@components';
import { Flex } from 'antd';
import { Client } from '@commercetools/sdk-client-v2';
import { formatPrice } from '@utils';

export const Cart: FC<{
  client: Client;
}> = ({ client }): ReactElement => {
  const { cart, cartTotal } = useCart();
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
              <CartItem key={item.id} lineItem={item} />
            ))}
            <CartDiscountCode client={client} />
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
