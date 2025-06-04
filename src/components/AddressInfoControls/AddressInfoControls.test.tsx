import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddressInfoControls } from './AddressInfoControls.tsx';
import { emptyAddressData } from '../../data/component-states/address-info-states.ts';
import { ProfileContextEditMode } from '../../contexts/profile-context/ProfileContexts.tsx';

const handleUpdate = vi.fn();
const setAddressData = vi.fn();
const setTagValues = vi.fn();
const setAddressErrors = vi.fn();
const setResponseError = vi.fn();
const openModal = vi.fn();
const setProfileEditMode = vi.fn();
const setEditComponent = vi.fn();
const editComponent = '';

const renderComponent = (
  addressId: string,
  profileEditMode: boolean,
  editComponent: string
): void => {
  render(
    <ProfileContextEditMode.Provider
      value={{
        profileEditMode,
        setProfileEditMode,
        editComponent,
        setEditComponent,
      }}
    >
      <AddressInfoControls
        addressId={addressId}
        handleUpdate={handleUpdate}
        initialAddressData={emptyAddressData}
        setAddressData={setAddressData}
        initialTagValues={[]}
        setTagValues={setTagValues}
        setAddressErrors={setAddressErrors}
        setResponseError={setResponseError}
        openModal={openModal}
      />
    </ProfileContextEditMode.Provider>
  );
};

describe('Address Info Control Tests', () => {
  it('Should switch on edit mode', async () => {
    const addressId = 'someAddressId';
    renderComponent(addressId, false, editComponent);
    const editButton = (await screen.findAllByRole('img'))[0];
    editButton.click();

    expect(setProfileEditMode).toBeCalledWith(true);
    expect(setEditComponent).toBeCalledWith(addressId);
  });

  it('Should call changes handler on save changes button click', async () => {
    const addressId = 'someAddressId';
    renderComponent(addressId, true, addressId);
    const saveButton = (await screen.findAllByRole('img'))[0];
    saveButton.click();

    expect(handleUpdate).toBeCalled();
  });

  it('Should switch off edit mode on discard changes button click', async () => {
    const addressId = 'someAddressId';
    renderComponent(addressId, true, addressId);
    const saveButton = (await screen.findAllByRole('img'))[1];
    saveButton.click();

    expect(setProfileEditMode).toBeCalledWith(false);
    expect(setEditComponent).toBeCalledWith('');
  });

  it('Should open modal on delete button click', async () => {
    renderComponent('', false, '');
    const deleteButton = (await screen.findAllByRole('img'))[1];
    deleteButton.click();

    expect(openModal).toBeCalled();
  });
});
