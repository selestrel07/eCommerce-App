import { Address as AddressSdk } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { AddressErrorData } from '../../types/address/address-types.ts';
import { AddressData } from '../address/address.ts';
import { ChangeEvent } from 'react';

export interface DatePickerInputProps {
  fieldName?: string;
  value?: string | null;
  onChange?: (date: string | undefined) => void;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface AddressSectionProps {
  addresses: AddressSdk[];
  billingAddressIds: string[];
  shippingAddressIds: string[];
  defaultBillingAddress?: string;
  defaultShippingAddress?: string;
}

export interface PasswordSectionProps {
  password: string;
}

export interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  fieldName?: string;
}

export interface AddressProps {
  addressErrors: AddressErrorData;
  onChange: <K extends keyof AddressData>(
    field: K
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (value: string) => void;
  disabled?: boolean;
  value: AddressData;
  fieldNames: boolean;
}
