import React, { useState, use } from 'react';
import { Button, message } from 'antd';
import { addToCart } from '@services';
import { CartContext } from '@contexts';
import { AddCartButtonProps } from '@interfaces';
import { loadCart } from '@services';

export const AddCartButton: React.FC<AddCartButtonProps> = ({ client, productId, variantId }) => {
  const { cart, setCart, setCartItemsCount } = use(CartContext);
  const [saving, setSaving] = useState(false);

  const alreadyInCart =
    cart?.lineItems.some((li) => li.productId === productId && li.variant.id === variantId) ??
    false;

  const handleClick = async () => {
    if (!cart) {
      try {
        const fresh = await loadCart(client);
        setCart(fresh);
        setCartItemsCount(fresh.lineItems.length);
      } catch (loadErr) {
        console.error('Failed to load cart:', loadErr);
        message.error('Failed to load cart. Please try again.');
      }
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
