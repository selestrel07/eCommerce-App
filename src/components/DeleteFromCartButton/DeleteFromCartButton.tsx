import { FC, useState } from 'react';
import TrashImg from '../../assets/trash.png';
import { message } from 'antd';
import { DeleteFromCartButtonProps } from '@interfaces';
import { removeLineItem } from '@services';
import { use } from 'react';
import { CartContext } from '@contexts';

export const DeleteFromCartButton: FC<DeleteFromCartButtonProps> = ({
  lineItemId,
  client,
  onCartUpdate,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const { setCart } = use(CartContext);

  const handleClick = async () => {
    if (loading || props.disabled) return;

    setLoading(true);
    try {
      const updatedCart = await removeLineItem(client, lineItemId);

      setCart(updatedCart);

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
