import './Profile.scss';
import { useEffect, useState } from 'react';
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

export default function Profile({ client }: { client: Client }) {
  const [customerData, setCustomerData] = useState<null | Customer>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCustomerData(client)
      .then((data) => {
        setCustomerData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="profile-container">
      {isLoading ? (
        <Spin></Spin>
      ) : (
        <>
          <PersonalInfoSection
            email={getCustomerFieldString(customerData, CustomerFields.EMAIL)}
            firstName={getCustomerFieldString(customerData, CustomerFields.FIRST_NAME)}
            lastName={getCustomerFieldString(customerData, CustomerFields.LAST_NAME)}
            dateOfBirth={getCustomerFieldString(customerData, CustomerFields.DATE_OF_BIRTH)}
          />
          <Divider />
          <PasswordSection
            password={getCustomerFieldString(customerData, CustomerFields.PASSWORD)}
          />
          <Divider />
          <AddressSection
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
          />
        </>
      )}
    </div>
  );
}
