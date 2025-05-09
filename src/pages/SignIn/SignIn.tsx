import { ReactElement } from 'react';
import { Input } from '../../components/Input/Input';

export default function SignIn({
  setSignedIn,
}: {
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  setSignedIn(false); //TODO: remove after the page implementation
  return (
    <>
      <Input />
      <Input isPassword errorMessage="Error" />
    </>
  );
}
