import { AddressData } from '@interfaces';

export type AddressErrorData = {
  [key in keyof AddressData]: string | null;
};
