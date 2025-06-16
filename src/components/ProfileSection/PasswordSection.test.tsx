import { render, screen } from '@testing-library/react';
import { ProfileContextData, ProfileContextEditMode } from '@contexts';
import { PasswordSection } from '@components';
import { getAnonymousClient } from '@services';
import { vi, describe, it, expect } from 'vitest';
import { ProfileSectionNames } from '@enums';

const client = getAnonymousClient()!;
const setCustomerData = vi.fn();
const showNotification = vi.fn();
const setReload = vi.fn();
const setApiClient = vi.fn();
const setProfileEditMode = vi.fn();
const setEditComponent = vi.fn();
const customerData = {
  id: '1',
  version: 1,
  addresses: [],
  email: '',
  createdAt: '',
  lastModifiedAt: '',
  isEmailVerified: false,
  stores: [],
  authenticationMode: 'none',
};

const renderPasswordSection = (profileEditMode = false, editComponent = '') => {
  render(
    <ProfileContextEditMode.Provider
      value={{
        setProfileEditMode,
        setEditComponent,
        profileEditMode,
        editComponent,
      }}
    >
      <ProfileContextData
        value={{
          client,
          customerData,
          setCustomerData,
          showNotification,
          setReload,
        }}
      >
        <PasswordSection setApiClient={setApiClient} />
      </ProfileContextData>
    </ProfileContextEditMode.Provider>
  );
};

describe('Test Password Section content', () => {
  it('Should contain section name, Current Password field and Edit button', async () => {
    renderPasswordSection();
    expect(await screen.findByText(ProfileSectionNames.PASSWORD)).toBeInTheDocument();
    expect(await screen.findByText('Current Password:')).toBeInTheDocument();
    expect(await screen.findByText('Edit')).toBeInTheDocument();
  });

  it('Should enable edit mode after Edit button click', async () => {
    renderPasswordSection();
    const editButton = await screen.findByText('Edit');
    editButton.click();

    expect(setProfileEditMode).toBeCalledWith(true);
    expect(setEditComponent).toBeCalledWith(ProfileSectionNames.PASSWORD);
  });

  it('Should show Update Password and Cancel buttons and Current Password, New Password and Confirm Password fields if in edit mode', async () => {
    renderPasswordSection(true, ProfileSectionNames.PASSWORD);

    expect(await screen.findByText('Update Password')).toBeInTheDocument();
    expect(await screen.findByText('Cancel')).toBeInTheDocument();
    expect(await screen.findByText('Current Password:')).toBeInTheDocument();
    expect(await screen.findByText('New Password:')).toBeInTheDocument();
    expect(await screen.findByText('Confirm Password:')).toBeInTheDocument();
  });

  it('Should close edit mode after Cancel button click', async () => {
    renderPasswordSection(true, ProfileSectionNames.PASSWORD);
    const cancelButton = await screen.findByText('Cancel');
    cancelButton.click();

    expect(setEditComponent).toBeCalledWith('');
    expect(setProfileEditMode).toBeCalledWith(false);
  });
});
