import './Profile.scss';
import { ReactElement, useEffect, useState } from 'react';
import { PersonalInfoSection } from '../../components/ProfileSection/PersonalInfoSection.tsx';
import { loadCustomerData } from '../../services/api.service.ts';
import { Client } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';
import { Divider, Spin } from 'antd';
import { CustomerFields } from '../../enums/customer-fields/customer-fields.ts';
import { PasswordSection } from '../../components/ProfileSection/PasswordSection.tsx';
import { AddressSection } from '../../components/ProfileSection/AddressSection.tsx';
import {
  getCustomerAddresses,
  getCustomerFieldAddressIds,
  getCustomerFieldString,
} from '../../utils/customer-field.utils.ts';

const successfulNotification = (
  notificationFunction: (message: string, description: string) => void
): void => notificationFunction('Success', 'Customer was successfully updated');

export default function Profile({
  client,
  openNotification,
  setApiClient,
}: {
  client: Client;
  openNotification: (message: string, description: string) => void;
  setApiClient: (client: Client) => void;
}): ReactElement {
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

  return (
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
          <AddressSection
            client={client}
            version={customerData?.version ?? 0}
            addresses={getCustomerAddresses(customerData)}
            shippingAddressIds={getCustomerFieldAddressIds(
              customerData,
              CustomerFields.SHIPPING_ADDRESS_IDS
            )}
            billingAddressIds={getCustomerFieldAddressIds(
              customerData,
              CustomerFields.BILLING_ADDRESS_IDS
            )}
            defaultBillingAddress={getCustomerFieldString(
              customerData,
              CustomerFields.DEFAULT_BILLING_ADDRESS_ID
            )}
            defaultShippingAddress={getCustomerFieldString(
              customerData,
              CustomerFields.DEFAULT_SHIPPING_ADDRESS_ID
            )}
            onUpdate={setReload}
            openNotification={() => successfulNotification(openNotification)}
          />
        </>
      )}
    </div>
  );
}
