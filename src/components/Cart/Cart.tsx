import { Paths } from '@enums';
import { FC, use } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '@contexts';
import { CartItem } from '@components';
import { Flex } from 'antd';
import { CartProps } from '../../interfaces/cart-props/cart-props';
import { ClearShoppingCartButton } from '../ClearShoppingCartButton.tsx/ClearShoppingCartButton';

export const Cart: FC<CartProps> = ({ onCartUpdate, client }) => {
  const { cart } = use(CartContext);

  if (!client) {
    return <p>Client is not available.</p>;
  }

  if (cart === null || cart.lineItems.length === 0) {
    return (
      <h2>
        There are no items in your cart. Please proceed with <Link to={Paths.CATALOG}>Catalog</Link>{' '}
        to add items.
      </h2>
    );
  }

  return (
    <div className="cart-page">
      <ClearShoppingCartButton client={client} />
      <Flex gap="middle" vertical align="center">
        {cart.lineItems.map((item) => (
          <CartItem key={item.id} lineItem={item} client={client} onCartUpdate={onCartUpdate} />
        ))}
      </Flex>
    </div>
  );
};
