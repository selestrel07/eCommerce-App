import { ProfileContextData, ProfileContextEditMode } from '@contexts';
import { render, screen } from '@testing-library/react';
import { PersonalInfoSection } from '@components';
import { getAnonymousClient } from '@services';
import { describe, it, vi, expect } from 'vitest';
import { ProfileSectionNames } from '@enums';

const client = getAnonymousClient()!;
const setCustomerData = vi.fn();
const showNotification = vi.fn();
const setReload = vi.fn();
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

const renderPersonalInfoSection = (profileEditMode = false, editComponent = '') => {
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
        <PersonalInfoSection />
      </ProfileContextData>
    </ProfileContextEditMode.Provider>
  );
};

describe('Test Password Section content', () => {
  it('Should contain section name, First Name, Last Name, Email and Date of Birth fields and Edit button', async () => {
    renderPersonalInfoSection();
    expect(await screen.findByText(ProfileSectionNames.PERSONAL_INFORMATION)).toBeInTheDocument();
    expect(await screen.findByText('First Name:')).toBeInTheDocument();
    expect(await screen.findByText('Last Name:')).toBeInTheDocument();
    expect(await screen.findByText('Email:')).toBeInTheDocument();
    expect(await screen.findByText('Date of Birth:')).toBeInTheDocument();
  });

  it('Should enable edit mode after Edit button click', async () => {
    renderPersonalInfoSection();
    const editButton = await screen.findByText('Edit');
    editButton.click();

    expect(setProfileEditMode).toBeCalledWith(true);
    expect(setEditComponent).toBeCalledWith(ProfileSectionNames.PERSONAL_INFORMATION);
  });

  it('Should contain Save and Cancel buttons if in edit mode', async () => {
    renderPersonalInfoSection(true, ProfileSectionNames.PERSONAL_INFORMATION);

    expect(await screen.findByText('Save')).toBeInTheDocument();
    expect(await screen.findByText('Cancel')).toBeInTheDocument();
  });

  it('Should close edit mode after Cancel button click', async () => {
    renderPersonalInfoSection(true, ProfileSectionNames.PERSONAL_INFORMATION);
    const cancelButton = await screen.findByText('Cancel');
    cancelButton.click();

    expect(setProfileEditMode).toBeCalledWith(false);
    expect(setEditComponent).toBeCalledWith('');
  });
});
