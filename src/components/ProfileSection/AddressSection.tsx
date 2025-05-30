import { FC, ReactElement } from 'react';
import { Address as AddressSdk } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { Button, Tag } from 'antd';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import { addressComparator } from '../../utils/customer-field.utils.ts';
import { AddressSectionProps } from '../../interfaces/component-props/component-props.ts';
import { AddressInfo } from '../AddressInfo/AddressInfo.tsx';
import { AddressType } from '../../enums/address-types/address-types.ts';

const getAddressTags = (
  address: AddressSdk,
  shippingAddressIds: string[],
  billingAddressIds: string[],
  defaultShippingAddress?: string,
  defaultBillingAddress?: string
): ReactElement[] => {
  const tags: ReactElement[] = [];
  if (defaultShippingAddress === address.id) {
    tags.push(<Tag color="processing">{AddressType.DEFAULT_SHIPPING}</Tag>);
  }
  if (defaultBillingAddress === address.id) {
    tags.push(<Tag color="processing">{AddressType.DEFAULT_BILLING}</Tag>);
  }
  if (address.id && shippingAddressIds.includes(address.id)) {
    tags.push(<Tag>{AddressType.SHIPPING}</Tag>);
  }
  if (address.id && billingAddressIds.includes(address.id)) {
    tags.push(<Tag>{AddressType.BILLING}</Tag>);
  }
  return tags;
};

export const AddressSection: FC<AddressSectionProps> = ({
  client,
  version,
  addresses,
  billingAddressIds,
  shippingAddressIds,
  defaultShippingAddress,
  defaultBillingAddress,
  onUpdate,
  openNotification,
}: AddressSectionProps): ReactElement => {
  return (
    <section className="address-section">
      <h2>{ProfileSectionNames.ADDRESSES}</h2>
      <div className="address-list">
        {addresses
          .sort((address1, address2) =>
            addressComparator(
              address1,
              address2,
              defaultShippingAddress ?? '',
              defaultBillingAddress ?? ''
            )
          )
          .map((address: AddressSdk): ReactElement => {
            const tags = getAddressTags(
              address,
              shippingAddressIds,
              billingAddressIds,
              defaultShippingAddress,
              defaultBillingAddress
            );
            return (
              <div className="address-container" key={address.id}>
                <AddressInfo
                  client={client}
                  version={version}
                  address={address}
                  tags={tags}
                  onUpdate={onUpdate}
                  openNotification={openNotification}
                />
              </div>
            );
          })}
      </div>
      <Button type="primary">Add New Address</Button>
    </section>
  );
};
