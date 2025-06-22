import { MyCustomerDraft } from '@commercetools/platform-sdk';

export interface AppCustomerDraft extends MyCustomerDraft {
  shippingAddresses: number[];
  billingAddresses: number[];
}
