import { Context, FC, use } from 'react';
import { CheckOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { ProfileContextEditMode } from '@contexts';
import { ProfileContextEditModeType, AddressInfoControlsProps } from '@interfaces';
import { emptyAddressErrors } from '@data';

export const AddressInfoControls: FC<AddressInfoControlsProps> = ({
  addressId,
  handleUpdate,
  onNewAddressAbort,
  setAddressData,
  initialAddressData,
  initialTagValues,
  setTagValues,
  setAddressErrors,
  setResponseError,
  openModal,
}) => {
  const { profileEditMode, setProfileEditMode, editComponent, setEditComponent } = use(
    ProfileContextEditMode as Context<ProfileContextEditModeType>
  );
  return (
    <div
      className={`address-container-controls${profileEditMode && editComponent !== addressId ? ' disabled' : ''}`}
    >
      {profileEditMode && editComponent === addressId ? (
        <>
          <CheckOutlined
            onClick={() => {
              handleUpdate();
            }}
          />
          <StopOutlined
            onClick={() => {
              setProfileEditMode(false);
              setEditComponent('');
              if (onNewAddressAbort) {
                onNewAddressAbort();
              } else {
                setAddressData({ ...initialAddressData });
                setTagValues([...initialTagValues]);
                setAddressErrors(emptyAddressErrors);
                setResponseError(null);
              }
            }}
          />
        </>
      ) : (
        <>
          <EditOutlined
            onClick={() => {
              setProfileEditMode(true);
              setEditComponent(addressId);
            }}
          />
          <DeleteOutlined onClick={openModal} />
        </>
      )}
    </div>
  );
};
