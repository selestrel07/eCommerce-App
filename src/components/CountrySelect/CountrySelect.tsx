import { FC } from 'react';
import { Select } from 'antd';
import { CountriesData } from '../../data/countries/countries.ts';

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CountrySelect: FC<Props> = ({ value, onChange, disabled }) => {
  const countries = Object.keys(CountriesData);
  return (
    <>
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
    </>
  );
};
