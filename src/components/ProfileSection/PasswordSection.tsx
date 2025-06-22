import { Context, FC, ReactElement, use, useState } from 'react';
import { Button } from 'antd';
import { ProfileSectionNames } from '@enums';
import { Input } from '@components';
import {
  PasswordSectionProps,
  ProfileContextDataType,
  ProfileContextEditModeType,
} from '@interfaces';
import { emptyPasswordErrorMessages, emptyPasswords } from '@data';
import { validatePassword, validateRepeatPassword } from '@utils';
import {
  changePassword,
  loginCustomer,
  emptyTokenStore,
  tokenCache,
  createCustomerClient,
} from '@services';
import Alert from 'antd/es/alert/Alert';
import { ProfileContextData, ProfileContextEditMode } from '@contexts';

export const PasswordSection: FC<PasswordSectionProps> = ({
  setApiClient,
}: PasswordSectionProps): ReactElement => {
  const { profileEditMode, setProfileEditMode, editComponent, setEditComponent } = use(
    ProfileContextEditMode as Context<ProfileContextEditModeType>
  );
  const { client, customerData, showNotification, setReload } = use(
    ProfileContextData as Context<ProfileContextDataType>
  );
  const [passwordData, setPasswordData] = useState(emptyPasswords);
  const [errorMessages, setErrorMessages] = useState<{
    [K in keyof typeof emptyPasswordErrorMessages]: string | null;
  }>(emptyPasswordErrorMessages);
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleChange = <K extends keyof typeof emptyPasswords>(
    field: K,
    value: string | undefined
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setErrorMessages((prev) => ({ ...prev, [field]: null }));
    setResponseError(null);
  };

  const handleSubmit = () => {
    const validationErrors = {
      currentPassword: validatePassword(passwordData.currentPassword),
      newPassword: validatePassword(passwordData.newPassword),
      confirmPassword: validateRepeatPassword(
        passwordData.confirmPassword,
        passwordData.newPassword
      ),
    };

    setErrorMessages(validationErrors);

    if (Object.values(validationErrors).every((errorMessage) => errorMessage === null)) {
      if (passwordData.newPassword === passwordData.currentPassword) {
        setResponseError('Current and new passwords are the same');
      } else {
        changePassword(
          client,
          customerData?.version ?? 0,
          passwordData.currentPassword,
          passwordData.newPassword
        )
          .then(async () => {
            tokenCache.set(emptyTokenStore);
            const newApiClient = createCustomerClient(
              customerData?.email ?? '',
              passwordData.newPassword
            );
            await loginCustomer(
              customerData?.email ?? '',
              passwordData.newPassword,
              newApiClient
            ).then(() => setApiClient(newApiClient));
          })
          .then(() => {
            setReload(true);
            setEditComponent('');
            setProfileEditMode(false);
            showNotification();
          })
          .catch((error: Error): void => {
            setResponseError(error.message);
          });
      }
    }
  };

  return (
    <section>
      <h2>{ProfileSectionNames.PASSWORD}</h2>
      <div className="password-info-fields">
        {profileEditMode && editComponent === ProfileSectionNames.PASSWORD.toString() ? (
          <>
            <Input
              fieldName="Current Password:"
              errorMessage={errorMessages.currentPassword ?? undefined}
              onChange={(e): void => handleChange('currentPassword', e.target.value)}
              isPassword
            />
            <Input
              fieldName="New Password:"
              errorMessage={errorMessages.newPassword ?? undefined}
              onChange={(e): void => handleChange('newPassword', e.target.value)}
              isPassword
            />
            <Input
              fieldName="Confirm Password:"
              errorMessage={errorMessages.confirmPassword ?? undefined}
              onChange={(e): void => handleChange('confirmPassword', e.target.value)}
              isPassword
            />
          </>
        ) : (
          <Input
            fieldName="Current Password:"
            value={customerData?.password ?? ''}
            isPassword
            disabled
          />
        )}
      </div>
      {responseError ? <Alert type="error" message={responseError} /> : undefined}
      <div className="profile-buttons">
        {profileEditMode && editComponent === ProfileSectionNames.PASSWORD.toString() ? (
          <>
            <Button type="primary" onClick={() => handleSubmit()}>
              Update Password
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setProfileEditMode(false);
                setEditComponent('');
                setPasswordData(emptyPasswords);
                setErrorMessages(emptyPasswordErrorMessages);
                setResponseError(null);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setProfileEditMode(true);
              setEditComponent(ProfileSectionNames.PASSWORD);
            }}
            disabled={profileEditMode && editComponent !== ProfileSectionNames.PASSWORD.toString()}
          >
            Edit
          </Button>
        )}
      </div>
    </section>
  );
};
