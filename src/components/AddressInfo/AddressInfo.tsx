import { FC, ReactElement, useState } from 'react';
import { CheckOutlined, DeleteTwoTone, EditTwoTone, StopTwoTone } from '@ant-design/icons';
import { Address } from '../Address/Address.tsx';
import { AddressInfoProps } from '../../interfaces/component-props/component-props.ts';
import { Checkbox } from 'antd';
import { AddressType } from '../../enums/address-types/address-types.ts';
import { Address as AddressSdk } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { AddressData } from '../../interfaces/address/address.ts';
import { AddressErrorData } from '../../types/address/address-types.ts';
import Alert from 'antd/es/alert/Alert';
import { validatePostalCode, validateStringField } from '../../utils/validation.ts';

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

const getAddressData = (address: AddressSdk): AddressData => {
  return {
    city: address.city ?? '',
    country: address.country ?? '',
    streetName: address.streetName ?? '',
    postalCode: address.postalCode ?? '',
  };
};

const emptyAddressErrors = {
  country: null,
  city: null,
  streetName: null,
  postalCode: null,
};

export const AddressInfo: FC<AddressInfoProps> = ({
  address,
  tags,
}: AddressInfoProps): ReactElement => {
  const initialAddressData = getAddressData(address);
  const initialTagValues = tagValues.filter((tag) => getTagValues(tags).includes(tag));
  const [isEdit, setEdit] = useState(false);
  const [checked, setChecked] = useState<string[]>([...initialTagValues]);
  const [addressData, setAddressData] = useState<AddressData>({ ...initialAddressData });
  const [addressErrors, setAddressErrors] = useState<AddressErrorData>(emptyAddressErrors);
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleChange = <K extends keyof AddressData>(field: K, value: string | undefined) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
    setAddressErrors((prev) => ({ ...prev, [field]: null }));
    setResponseError(null);
  };

  const onChange = (value: string[]) => {
    setChecked(value);
  };

  const handleUpdate = () => {
    const addressDataErrors: AddressErrorData = {
      country: null,
      city: validateStringField(addressData.city, 'city'),
      streetName: validateStringField(addressData.streetName, 'street'),
      postalCode: validatePostalCode(addressData.postalCode, addressData.country),
    };

    setAddressErrors(addressDataErrors);

    if (Object.values(addressDataErrors).every((value) => value === null)) {
      setEdit(false);
    }
  };

  return (
    <>
      <div className="address-container-controls">
        {isEdit ? (
          <>
            <CheckOutlined
              onClick={() => {
                handleUpdate();
              }}
            />
            <StopTwoTone
              onClick={() => {
                setAddressData({ ...initialAddressData });
                setChecked([...initialTagValues]);
                setAddressErrors(emptyAddressErrors);
                setResponseError(null);
                setEdit(false);
              }}
            />
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
        value={addressData}
        addressErrors={addressErrors}
        onChange={(field) => (e) => {
          handleChange(field, e.target.value);
        }}
        onCountryChange={(value) => {
          setAddressData({ ...addressData, country: value });
          setAddressErrors({ ...addressErrors, country: null });
          setResponseError(null);
        }}
        disabled={!isEdit}
        fieldNames={true}
      />
      {responseError ? <Alert type="error" message={responseError} /> : undefined}
    </>
  );
};
