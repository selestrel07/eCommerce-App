import { Address as AddressSdk } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { AddressErrorData } from '../../types/address/address-types.ts';
import { AddressData } from '../address/address.ts';
import { ChangeEvent, ReactElement } from 'react';
import { Client } from '@commercetools/sdk-client-v2';

export interface DatePickerInputProps {
  fieldName?: string;
  value?: string | null;
  onChange?: (date: string | undefined) => void;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface AddressSectionProps {
  client: Client;
  version: number;
  fieldName?: string;
  addresses: AddressSdk[];
  billingAddressIds: string[];
  shippingAddressIds: string[];
  defaultBillingAddress?: string;
  defaultShippingAddress?: string;
  onUpdate: (value: boolean) => void;
  openNotification: () => void;
}

export interface PasswordSectionProps {
  client: Client;
  version: number;
  password: string;
  email: string;
  onUpdate: (value: boolean) => void;
  openNotification: () => void;
  setApiClient: (client: Client) => void;
}

export interface PersonalInfoSectionProps {
  client: Client;
  version: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | undefined;
  onUpdate: (value: boolean) => void;
  openNotification: () => void;
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

export interface AddressInfoProps {
  client: Client;
  version: number;
  address: AddressSdk;
  tags: ReactElement[];
  onUpdate: (value: boolean) => void;
  openNotification: () => void;
}
