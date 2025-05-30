import { FC, ReactElement, useState } from 'react';
import { CheckOutlined, DeleteTwoTone, EditTwoTone, StopTwoTone } from '@ant-design/icons';
import { Address } from '../Address/Address.tsx';
import { AddressInfoProps } from '../../interfaces/component-props/component-props.ts';
import { Checkbox } from 'antd';
import { AddressType } from '../../enums/address-types/address-types.ts';

const CheckboxGroup = Checkbox.Group;

const tagValues = Object.values(AddressType);
const getTagValues = (tags: ReactElement[]): string[] => {
  return tags
    .map((tag): unknown => {
      const props = tag.props;
      if (props instanceof Object && 'children' in props) {
        return props.children;
      }
      return '';
    })
    .filter((value) => typeof value === 'string');
};

export const AddressInfo: FC<AddressInfoProps> = ({
  address,
  tags,
}: AddressInfoProps): ReactElement => {
  const [isEdit, setEdit] = useState(false);
  const [checked, setChecked] = useState<string[]>(
    tagValues.filter((tag) => getTagValues(tags).includes(tag))
  );

  const onChange = (value: string[]) => {
    setChecked(value);
  };

  return (
    <>
      <div className="address-container-controls">
        {isEdit ? (
          <>
            <CheckOutlined onClick={() => setEdit(false)} />
            <StopTwoTone onClick={() => setEdit(false)} />
          </>
        ) : (
          <>
            <EditTwoTone onClick={() => setEdit(true)} />
            <DeleteTwoTone />
          </>
        )}
      </div>
      {isEdit ? (
        <>
          <CheckboxGroup options={tagValues} value={checked} onChange={onChange}></CheckboxGroup>
        </>
      ) : (
        <div className="tags">{...tags}</div>
      )}

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
        disabled={!isEdit}
        fieldNames={true}
      />
    </>
  );
};
