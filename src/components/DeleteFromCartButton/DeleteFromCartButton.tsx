import React, { useState } from 'react';
import TrashImg from '../../assets/trash.png';
import { message } from 'antd';
import { removeLineItem } from '../../services/cart.service';
import { DeleteFromCartButtonProps } from '../../interfaces/delete-button/delete-button';

export const DeleteFromCartButton: React.FC<DeleteFromCartButtonProps> = ({
  lineItemId,
  client,
  onCartUpdate,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || props.disabled) return;

    setLoading(true);
    try {
      await removeLineItem(client, lineItemId);
      message.success('Product removed');
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Failed to remove product:', error);
      message.error('Failed to remove product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      {...props}
      className="delete-from-cart-button"
      type="button"
      onClick={() => void handleClick()}
      disabled={props.disabled ?? loading}
    >
      <img className="delete-image" src={TrashImg} alt="Delete" />
    </button>
  );
};
