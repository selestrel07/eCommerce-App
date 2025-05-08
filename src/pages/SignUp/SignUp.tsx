import { ReactElement } from 'react';

export default function SignUp({
  setSignedIn,
}: {
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  setSignedIn(false); //TODO: remove after the page implementation
  return <></>;
}
