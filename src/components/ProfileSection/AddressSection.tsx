import { Context, ReactElement, use, useState } from 'react';
import { Address as AddressSdk } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { Button } from 'antd';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import { addressComparator } from '../../utils/customer-field.utils.ts';
import { AddressInfo } from '../AddressInfo/AddressInfo.tsx';
import { emptyAddressData } from '../../data/component-states/address-info-states.ts';
import {
  ProfileContextData,
  ProfileContextEditMode,
} from '../../contexts/profile-context/ProfileContexts.tsx';
import {
  ProfileContextDataType,
  ProfileContextEditModeType,
} from '../../interfaces/context/profile-context.ts';
import { Customer } from '@commercetools/platform-sdk';
import { getAddressTags } from '../../utils/profile.utils.tsx';

const composeAddressInfoComponents = (customerData: Customer | null): ReactElement[] => {
  return customerData
    ? customerData.addresses
        .sort((address1, address2) =>
          addressComparator(
            address1,
            address2,
            customerData.defaultShippingAddressId ?? '',
            customerData.defaultBillingAddressId ?? ''
          )
        )
        .map((address: AddressSdk): ReactElement => {
          const tags = getAddressTags(
            address,
            customerData.shippingAddressIds ?? [],
            customerData.billingAddressIds ?? [],
            customerData.defaultShippingAddressId,
            customerData.defaultBillingAddressId
          );
          return (
            <div key={address.id} className="address-container">
              <AddressInfo address={address} tags={tags} />
            </div>
          );
        })
    : [];
};

export const AddressSection = (): ReactElement => {
  const { customerData } = use(ProfileContextData as Context<ProfileContextDataType>);
  const [addressInfoComponents, setAddressInfoComponents] = useState<ReactElement[]>(
    composeAddressInfoComponents(customerData)
  );
  const { profileEditMode, setProfileEditMode } = use(
    ProfileContextEditMode as Context<ProfileContextEditModeType>
  );

  const newAddressAbort = () => {
    setAddressInfoComponents(addressInfoComponents.slice(0, addressInfoComponents.length));
  };

  return (
    <section className="address-section">
      <h2>{ProfileSectionNames.ADDRESSES}</h2>
      <div className="address-list">{...addressInfoComponents}</div>
      <Button
        type="primary"
        onClick={() => {
          setProfileEditMode(true);
          setAddressInfoComponents(
            addressInfoComponents.concat(
              <div className="address-container">
                <AddressInfo
                  address={emptyAddressData}
                  tags={[]}
                  onNewAddressAbort={() => newAddressAbort()}
                />
              </div>
            )
          );
        }}
        disabled={profileEditMode}
      >
        Add New Address
      </Button>
    </section>
  );
};
