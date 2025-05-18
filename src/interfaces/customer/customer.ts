import { AddressData } from '../address/address.ts';

export interface Customer {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  addresses: AddressData[];
}
