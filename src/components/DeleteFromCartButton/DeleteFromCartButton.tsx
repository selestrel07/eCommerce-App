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

  const { cart, setCart, setCartItemsCount } = use(CartContext);

  const handleClick = async () => {
    if (!cart || loading) return;
    setLoading(true);
    try {
      const updated = await removeLineItem(client, cart.id, cart.version, lineItemId);
      setCart(updated);
      setCartItemsCount(updated.lineItems.reduce((sum, li) => sum + li.quantity, 0));
      onCartUpdate?.();
      message.success('Product removed from cart');
    } catch (err) {
      console.error('Failed to remove product:', err);
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
