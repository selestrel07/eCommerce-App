import { ChangeEvent } from 'react';
import { AddressErrorData } from '../../types/address/address-types.ts';

export interface AddressProps {
  addressErrors: AddressErrorData;
  onChange: <K extends keyof AddressData>(
    field: K
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (value: string) => void;
}

export interface AddressData {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
}
