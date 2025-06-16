import { FC, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useCart } from '@contexts';
import { clearCart } from '@services';
import { ClearShoppingCartButtonProps } from '@interfaces';

export const ClearShoppingCartButton: FC<ClearShoppingCartButtonProps> = ({ client }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setCart } = useCart();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const updatedCart = await clearCart(client);
      setCart(updatedCart);
      message.success('Your cart has been cleared.');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      message.error('Failed to clear the cart. Please try again.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      <Button
        className="clear-cart-button"
        type="primary"
        onClick={() => setModalVisible(true)}
        loading={loading}
      >
        Clear Shopping Cart
      </Button>

      <Modal
        title="Are you sure?"
        open={isModalVisible}
        onOk={() => {
          void handleConfirm();
        }}
        onCancel={() => setModalVisible(false)}
        okText="Yes, Clear Cart"
        okType="danger"
        cancelText="Cancel"
      >
        <p>This will remove all items from your cart.</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};
