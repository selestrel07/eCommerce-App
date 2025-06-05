import { Context, FC, ReactElement, use, useState } from 'react';
import { Checkbox } from 'antd';
import { AddressType, EditAction } from '@enums';
import {
  AddressData,
  AddressInfoProps,
  ProfileContextDataType,
  ProfileContextEditModeType,
} from '@interfaces';
import { AddressErrorData } from '@types';
import Alert from 'antd/es/alert/Alert';
import {
  validateAddressTypes,
  validatePostalCode,
  validateStringField,
  composeAction,
  composeAddressActions,
  composeAddressTypeActions,
  addressToAddressData,
  updateAddressWithData,
  getAddressTagValues,
} from '@utils';
import { updateCustomer } from '@services';
import { ProfileContextData, ProfileContextEditMode } from '@contexts';
import { ProfileModal, AddressInfoControls, Address } from '@components';
import { emptyAddressErrors } from '@data';

const CheckboxGroup = Checkbox.Group;

const addressTypes = Object.values(AddressType);

export const AddressInfo: FC<AddressInfoProps> = ({
  address,
  tags,
  onNewAddressAbort,
}: AddressInfoProps): ReactElement => {
  const initialAddressData = addressToAddressData(address);
  const initialTagValues = addressTypes.filter((tag) => getAddressTagValues(tags).includes(tag));
  const [tagValues, setTagValues] = useState<AddressType[]>([...initialTagValues]);
  const [addressData, setAddressData] = useState<AddressData>({ ...initialAddressData });
  const [addressErrors, setAddressErrors] = useState<AddressErrorData>(emptyAddressErrors);
  const [responseError, setResponseError] = useState<string | null>(null);
  const { setProfileEditMode, editComponent, setEditComponent } = use(
    ProfileContextEditMode as Context<ProfileContextEditModeType>
  );
  const { client, customerData, showNotification, setReload } = use(
    ProfileContextData as Context<ProfileContextDataType>
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleRemove = () => {
    const action = composeAction(EditAction.REMOVE_ADDRESS, address.id);
    if (action) {
      updateCustomer(client, customerData?.version ?? 0, [action])
        .then(() => {
          setReload(true);
          setIsModalOpen(false);
          showNotification();
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
      const actions = composeAddressActions(address, updateAddressWithData(address, addressData));
      const mainActions = [...actions];
      if (actions.length === 0) {
        actions.push(...composeAddressTypeActions(initialTagValues, tagValues, address.id ?? ''));
      }
      if (actions.length > 0) {
        updateCustomer(client, customerData?.version ?? 0, actions)
          .then(async (response) => {
            if (mainActions.length > 0) {
              const addressId: string =
                address.id === ''
                  ? (response.addresses[response.addresses.length - 1].id ?? '')
                  : (address.id ?? '');
              const typeActions = composeAddressTypeActions(initialTagValues, tagValues, addressId);
              await updateCustomer(client, response.version, typeActions);
            }
          })
          .then(() => {
            setReload(true);
            setProfileEditMode(false);
            setEditComponent('');
            showNotification();
          })
          .catch((error: Error) => setResponseError(error.message));
      } else {
        setResponseError('There is no changes');
      }
    }
  };

  return (
    <>
      <AddressInfoControls
        addressId={address.id ?? ''}
        handleUpdate={handleUpdate}
        initialAddressData={initialAddressData}
        setAddressData={setAddressData}
        initialTagValues={initialTagValues}
        setTagValues={setTagValues}
        setAddressErrors={setAddressErrors}
        setResponseError={setResponseError}
        openModal={openModal}
        onNewAddressAbort={onNewAddressAbort}
      />
      {editComponent === address.id ? (
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
        disabled={address.id !== editComponent}
        fieldNames={true}
      />
      {responseError ? <Alert type="error" message={responseError} /> : undefined}
      <ProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleRemove={handleRemove}
      />
    </>
  );
};
