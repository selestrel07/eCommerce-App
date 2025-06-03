import { ReactElement } from 'react';
import { Address } from '@commercetools/platform-sdk';
import { Tag } from 'antd';
import { AddressType } from '../enums/address-types/address-types.ts';

export const getAddressTagValues = (tags: ReactElement[]): string[] => {
  return tags
    .map((tag): unknown => {
      const props = tag.props;
      if (props instanceof Object && 'children' in props) {
        return props.children;
      }
      return '';
    })
    .filter((value) => typeof value === 'string');
};

export const getAddressTags = (
  address: Address,
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
