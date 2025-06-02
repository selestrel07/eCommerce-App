import { EditAction } from '../enums/edit-actions/edit-actions.ts';
import { Address, MyCustomerUpdateAction } from '@commercetools/platform-sdk';

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
          address: params[0],
        };
      }
    }
  }
};
