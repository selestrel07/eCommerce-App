import React, { useState } from 'react';
import { Button, Space } from 'antd';

export const AddCartButton: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setDisabled(true);
  };

  return (
    <Space>
      <Space.Compact>
        <Button disabled={disabled} onClick={handleClick} type="primary">
          {disabled ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      </Space.Compact>
    </Space>
  );
};

export default AddCartButton;
