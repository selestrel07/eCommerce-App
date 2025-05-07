import { ReactElement } from 'react';

export default function SignIn({
  setSignedIn,
}: {
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  setSignedIn(false); //TODO: remove after the page implementation
  return <></>;
}
