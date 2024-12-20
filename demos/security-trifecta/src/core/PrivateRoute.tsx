import { ReactNode } from 'react';
import { Redirect } from 'react-router';
import { getSnapshot } from '../utils/session-vault';

interface Props {
  children?: ReactNode;
}

export const PrivateRoute = ({ children }: Props) => {
  const session = getSnapshot();

  // If there is no session, redirect the user to the login page.
  if (!session) return <Redirect to="/" />;

  // Otherwise, return the route
  return <>{children}</>;
};
