import { Paths } from '@enums';
import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@contexts';
import { CartDiscountCode, CartItem, ClearShoppingCartButton } from '@components';
import { Flex } from 'antd';
import { Client } from '@commercetools/sdk-client-v2';

export const Cart: FC<{
  client: Client;
}> = ({ client }): ReactElement => {
  const { cart } = useCart();
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
              <CartItem client={client} key={item.id} lineItem={item} />
            ))}
            <CartDiscountCode client={client} />
            <ClearShoppingCartButton client={client} />
          </Flex>
        </>
      )}
    </>
  );
};
