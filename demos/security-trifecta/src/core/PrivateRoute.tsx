import { ReactNode } from 'react';
import { Redirect, Route, useLocation } from 'react-router';
import { useAuth } from './AuthProvider';
import { getSnapshot } from '../utils/session-vault';

type Props = { children?: ReactNode };

export const PrivateRoute = ({ children }: Props) => {
  const session = getSnapshot();

  // If there is no session, redirect the user to the login page.
  if (!session) return <Redirect to="/" />;

  // Otherwise, return the route
  return <>{children}</>;
};
