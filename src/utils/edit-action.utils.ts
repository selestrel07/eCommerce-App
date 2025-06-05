import { EditAction, AddressType } from '@enums';
import {
  Address,
  Address as AddressSdk,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';

export const composeAction = (
  action: EditAction,
  ...params: (undefined | string | Address)[]
): MyCustomerUpdateAction | undefined => {
  if (typeof params[0] === 'string') {
    switch (action) {
      case EditAction.SET_FIRST_NAME: {
        return {
          action,
          firstName: params[0],
        };
      }
      case EditAction.SET_LAST_NAME: {
        return {
          action,
          lastName: params[0],
        };
      }
      case EditAction.CHANGE_EMAIL: {
        return {
          action,
          email: params[0],
        };
      }
      case EditAction.SET_DATE_OF_BIRTH: {
        return {
          action,
          dateOfBirth: params[0],
        };
      }
      case EditAction.SET_DEFAULT_SHIPPING_ADDRESS:
      case EditAction.SET_DEFAULT_BILLING_ADDRESS:
      case EditAction.ADD_BILLING_ADDRESS_ID:
      case EditAction.ADD_SHIPPING_ADDRESS_ID:
      case EditAction.REMOVE_BILLING_ADDRESS_ID:
      case EditAction.REMOVE_SHIPPING_ADDRESS_ID:
      case EditAction.REMOVE_ADDRESS: {
        return {
          action,
          addressId: params[0],
        };
      }
    }
  } else if (params[0] === undefined) {
    return undefined;
  } else {
    switch (action) {
      case EditAction.ADD_ADDRESS: {
        return {
          action,
          address: params[0],
        };
      }
      case EditAction.CHANGE_ADDRESS: {
        return {
          action,
          addressId: params[0].id,
          address: params[0],
        };
      }
    }
  }
};

export const composeAddressActions = (
  initialAddress: AddressSdk,
  updatedAddress: AddressSdk
): MyCustomerUpdateAction[] => {
  const actions: (MyCustomerUpdateAction | undefined)[] = [];
  actions.push(
    composeAction(
      EditAction.CHANGE_ADDRESS,
      initialAddress.city &&
        (initialAddress.country !== updatedAddress.country ||
          initialAddress.city !== updatedAddress.city ||
          initialAddress.streetName !== updatedAddress.streetName ||
          initialAddress.postalCode !== updatedAddress.postalCode)
        ? updatedAddress
        : undefined
    )
  );
  actions.push(
    composeAction(EditAction.ADD_ADDRESS, !initialAddress.city ? updatedAddress : undefined)
  );
  return actions.filter((action) => action !== undefined);
};

export const composeAddressTypeActions = (
  initialAddressTypes: AddressType[],
  updatedAddressTypes: AddressType[],
  addressId: string
): MyCustomerUpdateAction[] => {
  const actions: (MyCustomerUpdateAction | undefined)[] = [];
  actions.push(
    composeAction(
      EditAction.SET_DEFAULT_SHIPPING_ADDRESS,
      !initialAddressTypes.includes(AddressType.DEFAULT_SHIPPING) &&
        updatedAddressTypes.includes(AddressType.DEFAULT_SHIPPING)
        ? addressId
        : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.SET_DEFAULT_BILLING_ADDRESS,
      !initialAddressTypes.includes(AddressType.DEFAULT_BILLING) &&
        updatedAddressTypes.includes(AddressType.DEFAULT_BILLING)
        ? addressId
        : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.ADD_SHIPPING_ADDRESS_ID,
      !initialAddressTypes.includes(AddressType.SHIPPING) &&
        updatedAddressTypes.includes(AddressType.SHIPPING)
        ? addressId
        : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.ADD_BILLING_ADDRESS_ID,
      !initialAddressTypes.includes(AddressType.BILLING) &&
        updatedAddressTypes.includes(AddressType.BILLING)
        ? addressId
        : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.REMOVE_SHIPPING_ADDRESS_ID,
      initialAddressTypes.includes(AddressType.SHIPPING) &&
        !updatedAddressTypes.includes(AddressType.SHIPPING)
        ? addressId
        : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.REMOVE_BILLING_ADDRESS_ID,
      initialAddressTypes.includes(AddressType.BILLING) &&
        !updatedAddressTypes.includes(AddressType.BILLING)
        ? addressId
        : undefined
    )
  );
  return actions.filter((action) => action !== undefined);
};
