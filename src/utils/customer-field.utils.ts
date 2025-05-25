import { Address, Customer } from '@commercetools/platform-sdk';
import { CustomerFields } from '../enums/customer-fields/customer-fields.ts';

const isArrayOfStrings = (array: unknown[]): array is string[] => {
  return array.length > 0 && array.every((value) => typeof value === 'string');
};

export const getCustomerFieldString = (
  customerData: Customer | null,
  fieldName: CustomerFields
): string => {
  const customerField = customerData ? customerData[fieldName] : customerData;
  if (!customerField || typeof customerField !== 'string') {
    return '';
  }

  return customerField;
};

export const getCustomerAddresses = (customerData: Customer | null): Address[] => {
  return customerData ? customerData[CustomerFields.ADDRESSES] : [];
};

export const getCustomerFieldAddressIds = (
  customerData: Customer | null,
  fieldName: CustomerFields
): string[] => {
  const customerField = customerData ? customerData[fieldName] : customerData;
  if (!customerField || !(customerField instanceof Array) || !isArrayOfStrings(customerField)) {
    return [];
  }

  return customerField;
};

export const addressComparator = (
  address1: Address,
  address2: Address,
  defaultBillingAddress: string,
  defaultShippingAddress: string
): number => {
  if (defaultBillingAddress.length === 0 && defaultShippingAddress.length === 0) {
    return 0;
  } else if (address1.id === defaultBillingAddress) {
    return -1;
  } else if (address1.id === defaultShippingAddress) {
    return -1;
  } else if (address2.id === defaultShippingAddress) {
    return 1;
  } else {
    return 1;
  }
};
