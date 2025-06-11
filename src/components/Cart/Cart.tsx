import { Paths } from '@enums';
import { Context, FC, ReactElement, use } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '@contexts';
import { CartContextType } from '@interfaces';
import { CartItem } from '@components';
import { Flex } from 'antd';

export const Cart: FC = (): ReactElement => {
  const { cart } = use(CartContext as Context<CartContextType>);
  return (
    <>
      {cart === null || cart?.lineItems.length === 0 ? (
        <h2>
          There are no items in your cart. Please proceed with{' '}
          <Link to={Paths.CATALOG}>Catalog</Link> to add items.
        </h2>
      ) : (
        <Flex gap="middle" vertical align="center">
          {cart.lineItems.map((item) => (
            <CartItem key={item.key} lineItem={item} />
          ))}
        </Flex>
      )}
    </>
  );
};
