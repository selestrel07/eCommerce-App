import { FC } from 'react';
import { Select } from 'antd';
import { CountriesData } from '../../data/countries/countries.ts';

interface Props {
  onChange: (value: string) => void;
}

export const CountrySelect: FC<Props> = ({ onChange }) => {
  const countries = Object.keys(CountriesData);
  return (
    <>
      <Select
        onChange={onChange}
        defaultValue={countries[0]}
        options={countries.map((country) => {
          return {
            value: country,
            label: country,
          };
        })}
      />
    </>
  );
};
