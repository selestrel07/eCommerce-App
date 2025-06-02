import { AddressData } from '../../interfaces/address/address.ts';

export const emptyAddressData: AddressData = {
  id: '',
  country: 'US',
  city: '',
  streetName: '',
  postalCode: '',
};

export const emptyAddressErrors = {
  country: null,
  city: null,
  streetName: null,
  postalCode: null,
};
