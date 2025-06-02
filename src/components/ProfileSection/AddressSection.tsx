import { FC, ReactElement } from 'react';
import { Address } from '../Address/Address.tsx';
import { Address as AddressSdk } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { Button, Tag } from 'antd';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import { addressComparator } from '../../utils/customer-field.utils.ts';
import { AddressSectionProps } from '../../interfaces/component-props/component-props.ts';

export const AddressSection: FC<AddressSectionProps> = ({
  addresses,
  billingAddressIds,
  shippingAddressIds,
  defaultShippingAddress,
  defaultBillingAddress,
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
            const tags: ReactElement[] = [];
            if (defaultShippingAddress === address.id) {
              tags.push(<Tag color="processing">Default shipping</Tag>);
            }
            if (defaultBillingAddress === address.id) {
              tags.push(<Tag color="processing">Default billing</Tag>);
            }
            if (address.id && billingAddressIds.includes(address.id)) {
              tags.push(<Tag>Billing</Tag>);
            }
            if (address.id && shippingAddressIds.includes(address.id)) {
              tags.push(<Tag>Shipping</Tag>);
            }
            return (
              <div className="address-container" key={address.key}>
                <div className="tags">{...tags}</div>
                <Address
                  value={{
                    city: address.city ?? '',
                    streetName: address.streetName ?? '',
                    postalCode: address.postalCode ?? '',
                    country: address.country,
                  }}
                  addressErrors={{
                    streetName: null,
                    country: null,
                    city: null,
                    postalCode: null,
                  }}
                  onChange={(field: string) => (e) => {
                    console.log(e, field);
                  }}
                  onCountryChange={(value: string) => {
                    console.log(value);
                  }}
                  disabled
                  fieldNames={true}
                />
              </div>
            );
          })}
      </div>
      <Button type="primary">Add New Address</Button>
    </section>
  );
};
