import { createContext, FC, ReactNode, useState } from 'react';
import {
  ProfileContextEditModeType,
  ProfileContextDataType,
} from '../../interfaces/context/profile-context.ts';

export const ProfileContextEditMode = createContext<ProfileContextEditModeType | null>(null);

export const ProfileProviderEditMode: FC<{ children: ReactNode }> = ({ children }) => {
  const [profileEditMode, setProfileEditMode] = useState<boolean>(false);
  const [editComponent, setEditComponent] = useState<string>('');

  return (
    <ProfileContextEditMode.Provider
      value={{
        profileEditMode,
        setProfileEditMode,
        editComponent,
        setEditComponent,
      }}
    >
      {children}
    </ProfileContextEditMode.Provider>
  );
};

export const ProfileContextData = createContext<ProfileContextDataType | null>(null);
