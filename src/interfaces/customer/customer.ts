import { AddressData } from '../address/address.ts';
import { MyCustomerDraft } from '@commercetools/platform-sdk';

export interface Customer {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  addresses: AddressData[];
}

export interface AppCustomerDraft extends MyCustomerDraft {
  shippingAddresses: number[];
  billingAddresses: number[];
}
