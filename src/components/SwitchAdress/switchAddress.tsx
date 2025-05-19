import { Switch } from 'antd';
import React, { useState } from 'react';
import { SwitchAddressProps } from '../../interfaces/address/switchAdress';
import './switchAddress.scss';

const SwitchAddress: React.FC<SwitchAddressProps> = ({ onChange }) => {
  const [defaultAddresses, setDefaultAddresses] = useState({
    defaultShipping: false,
    defaultBilling: false,
  });

  const handleSwitchChange = (type: 'shipping' | 'billing', checked: boolean) => {
    const newValues = {
      ...defaultAddresses,
      [`default${type.charAt(0).toUpperCase() + type.slice(1)}`]: checked,
    };

    setDefaultAddresses(newValues);
    onChange(newValues);
  };

  return (
    <div className="switch-group">
      <div className="switch-item">
        <span>Set as default address shipping</span>
        <Switch
          aria-label="Default shipping address"
          checked={defaultAddresses.defaultShipping}
          onChange={(checked: boolean) => handleSwitchChange('shipping', checked)}
        />
      </div>
      <div className="switch-item">
        <span>Set as default address billing</span>
        <Switch
          aria-label="Default billing address"
          checked={defaultAddresses.defaultBilling}
          onChange={(checked: boolean) => handleSwitchChange('billing', checked)}
        />
      </div>
    </div>
  );
};

export default SwitchAddress;
