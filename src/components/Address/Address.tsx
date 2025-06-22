import { Input, CountrySelect } from '@components';
import { FC } from 'react';
import { AddressFields } from '@enums';
import './Address.scss';
import { AddressProps } from '@interfaces';

export const Address: FC<AddressProps> = ({
  value,
  addressErrors,
  onChange,
  onCountryChange,
  disabled = false,
  fieldNames = false,
}) => {
  const handleCityChange = onChange(AddressFields.CITY);
  const handleStreetChange = onChange(AddressFields.STREET);
  const handlePostalCodeChange = onChange(AddressFields.POSTAL_CODE);

  return (
    <div className="address">
      <div className="address-row">
        <CountrySelect
          fieldName={fieldNames ? 'Country:' : undefined}
          value={value.country}
          onChange={onCountryChange}
          disabled={disabled}
        />
        <Input
          fieldName={fieldNames ? 'City:' : undefined}
          value={value.city}
          placeholder="City"
          errorMessage={addressErrors.city ?? undefined}
          onChange={handleCityChange}
          disabled={disabled}
        />
      </div>
      <div className="address-row">
        <Input
          fieldName={fieldNames ? 'Street:' : undefined}
          value={value.streetName}
          placeholder="Street"
          errorMessage={addressErrors.streetName ?? undefined}
          onChange={handleStreetChange}
          disabled={disabled}
        />
        <Input
          fieldName={fieldNames ? 'Postal code:' : undefined}
          value={value.postalCode}
          placeholder="Postal code"
          errorMessage={addressErrors.postalCode ?? undefined}
          onChange={handlePostalCodeChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
