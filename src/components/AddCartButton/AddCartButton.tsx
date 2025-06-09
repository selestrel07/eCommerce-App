import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

export const AddCartButton: React.FC = () => {
  const [count, setCount] = useState(5);

  const increase = () => {
    setCount(count + 1);
  };

  return (
    <Space direction="vertical">
      <Space.Compact>
        <Button onClick={increase} icon={<PlusOutlined />} />
      </Space.Compact>
    </Space>
  );
};

export default AddCartButton;
