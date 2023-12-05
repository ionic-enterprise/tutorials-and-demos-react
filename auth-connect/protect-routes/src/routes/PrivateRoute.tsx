import { ReactNode, useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from '../utils/session-store';
import { Redirect } from 'react-router-dom';

type Props = { children?: ReactNode };

export const PrivateRoute = ({ children }: Props) => {
  const session = useSyncExternalStore(subscribe, getSnapshot);

  // If there is no session, redirect the user to the login page.
  if (!session) return <Redirect to="/login" />;

  // Otherwise, return the route
  return <>{children}</>;
};
