import React, { useEffect, useState } from 'react';
import { Button, message, Space, Spin } from 'antd';
import { AddCartButtonProps } from '@interfaces';
import { addToCart, isProductInCart, loadCart } from '@services';

export const AddCartButton: React.FC<AddCartButtonProps> = ({ apiClient, variantId }) => {
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const checkCart = async () => {
      setLoading(true);
      try {
        const cart = await loadCart(apiClient);
        const exists = isProductInCart(cart, variantId);
        setDisabled(exists);
      } catch {
        message.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    void checkCart();
  }, [apiClient, variantId]);

  const handleClick = async () => {
    try {
      await addToCart(apiClient, variantId);
      message.success('Product added to cart!');
      setDisabled(true);
    } catch {
      message.error('Failed to add product ro cart');
    }
  };

  return (
    <Space>
      <Space.Compact>
        <Button disabled={disabled || loading} onClick={() => void handleClick()} type="primary">
          {loading ? <Spin size="small" /> : disabled ? 'In Cart' : 'Add to Cart'}
        </Button>
      </Space.Compact>
    </Space>
  );
};

export default AddCartButton;
