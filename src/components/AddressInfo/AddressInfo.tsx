import { FC, ReactElement } from 'react';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Address } from '../Address/Address.tsx';
import { AddressInfoProps } from '../../interfaces/component-props/component-props.ts';

export const AddressInfo: FC<AddressInfoProps> = ({
  address,
  tags,
}: AddressInfoProps): ReactElement => {
  return (
    <>
      <div className="address-container-controls">
        <EditTwoTone />
        <DeleteTwoTone />
      </div>
      <div className="tags">{...tags}</div>
      <Address
        value={{
          city: address.city ?? '',
          streetName: address.streetName ?? '',
          postalCode: address.postalCode ?? '',
          country: address.country,
        }}
        addressErrors={{
          streetName: null,
          country: null,
          city: null,
          postalCode: null,
        }}
        onChange={(field: string) => (e) => {
          console.log(e, field);
        }}
        onCountryChange={(value: string) => {
          console.log(value);
        }}
        disabled
        fieldNames={true}
      />
    </>
  );
};
