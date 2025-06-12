import React, { useState } from 'react';
import { Button, message } from 'antd';
import { Client } from '@commercetools/sdk-client-v2';
import { addToCart } from '../../services/cart.service';

interface AddCartButtonProps {
  client: Client;
  productId: string;
  variantId: number;
}

export const AddCartButton: React.FC<AddCartButtonProps> = ({ client, productId, variantId }) => {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (added) return;

    setLoading(true);
    try {
      await addToCart(client, productId, variantId);
      setAdded(true);
      message.success('Product added to cart!');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      message.error('Failed to add product to cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="primary" onClick={() => void handleClick()} loading={loading} disabled={added}>
      {added ? 'Added to Cart' : 'Add to Cart'}
    </Button>
  );
};
