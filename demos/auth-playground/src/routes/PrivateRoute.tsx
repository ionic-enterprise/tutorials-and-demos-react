import { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthentication } from '@/hooks/useAuthentication';

type Props = { children?: ReactNode };

const PrivateRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuthentication();

  return isAuthenticated ? children : <Redirect to="/login" />;
};
export default PrivateRoute;
