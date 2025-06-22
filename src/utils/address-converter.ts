import { AddressData } from '@interfaces';
import { Address } from '@commercetools/platform-sdk';

export const addressToAddressData = (address: Address): AddressData => {
  return {
    city: address.city ?? '',
    country: address.country ?? '',
    streetName: address.streetName ?? '',
    postalCode: address.postalCode ?? '',
  };
};

export const updateAddressWithData = (address: Address, addressData: AddressData): Address => {
  return {
    ...address,
    country: addressData.country,
    city: addressData.city,
    streetName: addressData.streetName,
    postalCode: addressData.postalCode,
  };
};
