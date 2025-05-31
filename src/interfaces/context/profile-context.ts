import { Client } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';

export interface ProfileContextEditModeType {
  profileEditMode: boolean;
  setProfileEditMode: (mode: boolean) => void;
  editComponent: string;
  setEditComponent: (editComponent: string) => void;
}

export interface ProfileContextDataType {
  client: Client;
  showNotification: () => void;
  customerData: Customer | null;
  setCustomerData: (customer: Customer) => void;
  setReload: (value: boolean) => void;
}
