import { FC } from 'react';
import { Select } from 'antd';
import { CountriesData } from '@data';
import { CountrySelectProps } from '@interfaces';
import './CountrySelect.scss';

export const CountrySelect: FC<CountrySelectProps> = ({ value, onChange, disabled, fieldName }) => {
  const countries = Object.keys(CountriesData);
  return (
    <div className="input-country">
      {fieldName ? <p>{fieldName}</p> : undefined}
      <Select
        value={value}
        onChange={onChange}
        defaultValue={countries[0]}
        options={countries.map((country) => {
          return {
            value: country,
            label: country,
          };
        })}
        disabled={disabled}
      />
    </div>
  );
};
