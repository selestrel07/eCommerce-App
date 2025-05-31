import { Address as AddressSdk } from '@commercetools/platform-sdk';
import { AddressErrorData } from '../../types/address/address-types.ts';
import { AddressData } from '../address/address.ts';
import { ChangeEvent, ReactElement } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { AddressType } from '../../enums/address-types/address-types.ts';

export interface DatePickerInputProps {
  fieldName?: string;
  value?: string | null;
  onChange?: (date: string | undefined) => void;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
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

export interface ProfileProps {
  client: Client;
  openNotification: (message: string, description: string) => void;
  setApiClient: (client: Client) => void;
}

export interface AddressInfoProps {
  address: AddressSdk;
  tags: ReactElement[];
  onNewAddressAbort?: () => void;
}

export interface ProfileModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  handleRemove: () => void;
}

export interface AddressInfoControlsProps {
  addressId: string;
  handleUpdate: () => void;
  onNewAddressAbort?: () => void;
  initialAddressData: AddressData;
  setAddressData: (addressData: AddressData) => void;
  initialTagValues: AddressType[];
  setTagValues: (values: AddressType[]) => void;
  setAddressErrors: (errors: AddressErrorData) => void;
  setResponseError: (error: string | null) => void;
  openModal: () => void;
}
