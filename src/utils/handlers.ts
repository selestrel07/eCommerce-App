import { ChangeEvent } from 'react';

export const composeFieldHandler = (
  valueCallback: (value: string) => void,
  resetErrorCallbacks: ((value: null) => void)[]
) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    valueCallback(event.target.value);
    resetErrorCallbacks.forEach((callback) => callback(null));
  };
};
