import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddressSection } from './AddressSection.tsx';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import {
  ProfileContextData,
  ProfileProviderEditMode,
} from '../../contexts/profile-context/ProfileContexts.tsx';
import { getAnonymousClient } from '../../services/storage/storage.service.ts';

const client = getAnonymousClient()!;
const setCustomerData = vi.fn();
const showNotification = vi.fn();
const setReload = vi.fn();
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

const renderAddressSection = () => {
  render(
    <ProfileProviderEditMode>
      <ProfileContextData
        value={{
          client,
          customerData,
          setCustomerData,
          showNotification,
          setReload,
        }}
      >
        <AddressSection />
      </ProfileContextData>
    </ProfileProviderEditMode>
  );
};

describe('Test Address Section content', () => {
  it('Should contain section name and Edit button', async () => {
    renderAddressSection();
    expect(await screen.findByText(ProfileSectionNames.ADDRESSES)).toBeInTheDocument();
    expect(await screen.findByText('Add New Address')).toBeInTheDocument();
  });
});
