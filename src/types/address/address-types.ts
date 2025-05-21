import { AddressData } from '../../interfaces/address/address.ts';

export type AddressErrorData = {
  [key in keyof AddressData]: string | null;
};
