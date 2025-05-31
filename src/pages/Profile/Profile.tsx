import './Profile.scss';
import { ReactElement, useEffect, useState } from 'react';
import { PersonalInfoSection } from '../../components/ProfileSection/PersonalInfoSection.tsx';
import { loadCustomerData } from '../../services/api.service.ts';
import { Customer } from '@commercetools/platform-sdk';
import { Divider, Spin } from 'antd';
import { CustomerFields } from '../../enums/customer-fields/customer-fields.ts';
import { PasswordSection } from '../../components/ProfileSection/PasswordSection.tsx';
import { AddressSection } from '../../components/ProfileSection/AddressSection.tsx';
import { getCustomerFieldString } from '../../utils/customer-field.utils.ts';
import {
  ProfileContextData,
  ProfileProviderEditMode,
} from '../../contexts/profile-context/ProfileContexts.tsx';
import { ProfileProps } from '../../interfaces/component-props/component-props.ts';

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
              <PersonalInfoSection
                client={client}
                version={customerData?.version ?? 0}
                email={getCustomerFieldString(customerData, CustomerFields.EMAIL)}
                firstName={getCustomerFieldString(customerData, CustomerFields.FIRST_NAME)}
                lastName={getCustomerFieldString(customerData, CustomerFields.LAST_NAME)}
                dateOfBirth={getCustomerFieldString(customerData, CustomerFields.DATE_OF_BIRTH)}
                onUpdate={setReload}
                openNotification={() => successfulNotification(openNotification)}
              />
              <Divider />
              <PasswordSection
                client={client}
                version={customerData?.version ?? 0}
                password={getCustomerFieldString(customerData, CustomerFields.PASSWORD)}
                email={customerData?.email ?? ''}
                onUpdate={setReload}
                openNotification={() => successfulNotification(openNotification)}
                setApiClient={setApiClient}
              />
              <Divider />
              <AddressSection />
            </>
          )}
        </div>
      </ProfileContextData>
    </ProfileProviderEditMode>
  );
}
