import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuthentication } from '@/hooks/useAuthentication';

type Props = { redirectPath: string } & RouteProps;

const PrivateRoute = ({ redirectPath, ...routeProps }: Props) => {
  const { isAuthenticated } = useAuthentication();

  return isAuthenticated ? <Route {...routeProps} /> : <Redirect to={redirectPath} />;
};
export default PrivateRoute;
