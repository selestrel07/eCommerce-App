import { FC, ReactElement, useState } from 'react';
import { CheckOutlined, DeleteTwoTone, EditTwoTone, StopTwoTone } from '@ant-design/icons';
import { Address } from '../Address/Address.tsx';
import { AddressInfoProps } from '../../interfaces/component-props/component-props.ts';
import { Checkbox, Modal } from 'antd';
import { AddressType } from '../../enums/address-types/address-types.ts';
import { AddressData } from '../../interfaces/address/address.ts';
import { AddressErrorData } from '../../types/address/address-types.ts';
import Alert from 'antd/es/alert/Alert';
import {
  validateAddressTypes,
  validatePostalCode,
  validateStringField,
} from '../../utils/validation.ts';
import { composeAction, composeAddressActions } from '../../utils/edit-action.utils.ts';
import { updateCustomer } from '../../services/api.service.ts';
import { addressToAddressData, updateAddressWithData } from '../../utils/address-converter.ts';
import { EditAction } from '../../enums/edit-actions/edit-actions.ts';

const CheckboxGroup = Checkbox.Group;

const addressTypes = Object.values(AddressType);

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

const emptyAddressErrors = {
  country: null,
  city: null,
  streetName: null,
  postalCode: null,
};

export const AddressInfo: FC<AddressInfoProps> = ({
  client,
  version,
  address,
  tags,
  onUpdate,
  openNotification,
}: AddressInfoProps): ReactElement => {
  const initialAddressData = addressToAddressData(address);
  const initialTagValues = addressTypes.filter((tag) => getTagValues(tags).includes(tag));
  const [isEdit, setEdit] = useState(false);
  const [tagValues, setTagValues] = useState<AddressType[]>([...initialTagValues]);
  const [addressData, setAddressData] = useState<AddressData>({ ...initialAddressData });
  const [addressErrors, setAddressErrors] = useState<AddressErrorData>(emptyAddressErrors);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    const action = composeAction(EditAction.REMOVE_ADDRESS, address.id);
    if (action) {
      updateCustomer(client, version, [action])
        .then(() => {
          setIsModalOpen(false);
          onUpdate(true);
          openNotification();
        })
        .catch((error: Error) => setResponseError(error.message));
    }
  };

  const handleChange = <K extends keyof AddressData>(field: K, value: string | undefined) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
    setAddressErrors((prev) => ({ ...prev, [field]: null }));
    setResponseError(null);
  };

  const onAddressTypeChange = (value: AddressType[]) => {
    setTagValues(value);
  };

  const handleUpdate = () => {
    const addressDataErrors: AddressErrorData = {
      country: null,
      city: validateStringField(addressData.city, 'city'),
      streetName: validateStringField(addressData.streetName, 'street'),
      postalCode: validatePostalCode(addressData.postalCode, addressData.country),
    };

    const addressTypeError = validateAddressTypes(initialTagValues, tagValues);

    setAddressErrors(addressDataErrors);
    setResponseError(addressTypeError);

    if (
      Object.values(addressDataErrors).every((value) => value === null) &&
      addressTypeError === null
    ) {
      const actions = composeAddressActions(
        address,
        updateAddressWithData(address, addressData),
        initialTagValues,
        tagValues
      );
      if (actions.length > 0) {
        updateCustomer(client, version, actions)
          .then(() => {
            onUpdate(true);
            openNotification();
          })
          .catch((error: Error) => setResponseError(error.message));
      } else {
        setResponseError('There is no changes');
      }
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
                setTagValues([...initialTagValues]);
                setAddressErrors(emptyAddressErrors);
                setResponseError(null);
                setEdit(false);
              }}
            />
          </>
        ) : (
          <>
            <EditTwoTone onClick={() => setEdit(true)} />
            <DeleteTwoTone onClick={openModal} />
          </>
        )}
      </div>
      {isEdit ? (
        <>
          <CheckboxGroup
            options={addressTypes}
            value={tagValues}
            onChange={onAddressTypeChange}
          ></CheckboxGroup>
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
      <Modal
        title="Address deletion"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>You will not be able to undo address deletion</p>
        <p>Do you really want to delete the address?</p>
      </Modal>
    </>
  );
};
