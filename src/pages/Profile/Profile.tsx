import './Profile.scss';
import { ReactElement, useEffect, useState } from 'react';
import { PersonalInfoSection, PasswordSection, AddressSection } from '@components';
import { loadCustomerData } from '@services';
import { Customer } from '@commercetools/platform-sdk';
import { Divider, Spin } from 'antd';
import { ProfileContextData, ProfileProviderEditMode } from '@contexts';
import { ProfileProps } from '@interfaces';

const successfulNotification = (
  notificationFunction: (message: string, description: string) => void
): void => notificationFunction('Success', 'Customer was successfully updated');

export default function Profile({
  client,
  openNotification,
  setApiClient,
}: ProfileProps): ReactElement {
  const [customerData, setCustomerData] = useState<null | Customer>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);

  useEffect(() => {
    if (reload) {
      setLoading(true);
      loadCustomerData(client)
        .then((data) => {
          setCustomerData(data);
          setLoading(false);
          setReload(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [reload]);

  const showNotification = () => successfulNotification(openNotification);

  return (
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
        <div className="profile-container">
          {isLoading ? (
            <Spin></Spin>
          ) : (
            <>
              <PersonalInfoSection />
              <Divider />
              <PasswordSection setApiClient={setApiClient} />
              <Divider />
              <AddressSection />
            </>
          )}
        </div>
      </ProfileContextData>
    </ProfileProviderEditMode>
  );
}
