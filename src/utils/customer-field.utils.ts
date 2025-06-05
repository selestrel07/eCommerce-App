import { Address } from '@commercetools/platform-sdk';

export const addressComparator = (
  address1: Address,
  address2: Address,
  defaultShippingAddress: string,
  defaultBillingAddress: string
): number => {
  if (defaultBillingAddress.length === 0 && defaultShippingAddress.length === 0) {
    return 0;
  } else if (address1.id === defaultShippingAddress) {
    return -1;
  } else if (address2.id === defaultShippingAddress) {
    return 1;
  } else if (address1.id === defaultBillingAddress) {
    return -1;
  } else {
    return 1;
  }
};
