import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { addToCart } from '@services';
import { useCart } from '@contexts';
import { AddCartButtonProps } from '@interfaces';

export const AddCartButton: React.FC<AddCartButtonProps> = ({ client, productId, variantId }) => {
  const { cart, setCart, setCartItemsCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    if (!cart?.lineItems) return;

    const isInCart = cart.lineItems.some(
      (item) => item.productId === productId && item.variant.id === variantId
    );

    setInCart(isInCart);
  }, [cart, productId, variantId]);

  const handleClick = async () => {
    if (inCart || loading) return;

    setLoading(true);
    try {
      const updatedCart = await addToCart(client, productId, variantId);

      setCart(updatedCart);

      const totalQuantity = updatedCart.lineItems.reduce((acc, item) => acc + item.quantity, 0);
      setCartItemsCount(totalQuantity);

      setInCart(true);
      message.success('Product added to cart!');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      message.error('Failed to add product to cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      onClick={() => void handleClick()}
      loading={loading}
      disabled={inCart || loading}
    >
      {inCart ? 'Added to Cart' : 'Add to Cart'}
    </Button>
  );
};
