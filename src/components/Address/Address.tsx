import { Input } from '../Input/Input.tsx';
import { CountrySelect } from '../CountrySelect/CountrySelect.tsx';
import { FC } from 'react';
import { AddressFields } from '../../enums/address-fields/address-fields.ts';
import './Address.scss';
import { AddressProps } from '../../interfaces/address/address.ts';

export const Address: FC<AddressProps> = ({ addressErrors, onChange, onCountryChange }) => {
  const handleCityChange = onChange(AddressFields.CITY);
  const handleStreetChange = onChange(AddressFields.STREET);
  const handlePostalCodeChange = onChange(AddressFields.POSTAL_CODE);

  return (
    <div className="address">
      <div className="address-row">
        <CountrySelect onChange={onCountryChange} />
        <Input
          placeholder="City"
          errorMessage={addressErrors.city ?? undefined}
          onChange={handleCityChange}
        />
      </div>
      <div className="address-row">
        <Input
          placeholder="Street"
          errorMessage={addressErrors.streetName ?? undefined}
          onChange={handleStreetChange}
        />
        <Input
          placeholder="Postal code"
          errorMessage={addressErrors.postalCode ?? undefined}
          onChange={handlePostalCodeChange}
        />
      </div>
    </div>
  );
};
