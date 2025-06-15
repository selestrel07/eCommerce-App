import React, { useState, use } from 'react';
import { Button, message } from 'antd';
import { Client } from '@commercetools/sdk-client-v2';
import { addToCart } from '@services';
import { CartContext } from '@contexts';

interface AddCartButtonProps {
  client: Client;
  productId: string;
  variantId: number;
}

export const AddCartButton: React.FC<AddCartButtonProps> = ({ client, productId, variantId }) => {
  const { cart, setCart, setCartItemsCount } = use(CartContext);
  const [saving, setSaving] = useState(false);

  const alreadyInCart =
    cart?.lineItems.some((li) => li.productId === productId && li.variant.id === variantId) ??
    false;

  const handleClick = async () => {
    if (!cart) {
      message.error('Cart is not loaded yet');
      return;
    }
    if (alreadyInCart || saving) return;

    setSaving(true);
    try {
      const updatedCart = await addToCart(client, cart.id, cart.version, productId, variantId);
      setCart(updatedCart);
      setCartItemsCount(updatedCart.lineItems.length);
      message.success('Product added to cart!');
    } catch (err: unknown) {
      console.error('Failed to add product to cart:', err);
      message.error(err instanceof Error ? err.message : 'Failed to add product to cart.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      type="primary"
      onClick={() => void handleClick()}
      loading={saving}
      disabled={alreadyInCart}
    >
      {alreadyInCart ? 'Added to Cart' : 'Add to Cart'}
    </Button>
  );
};
