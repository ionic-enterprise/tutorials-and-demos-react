import { useHistory } from 'react-router-dom';
import { isAuthenticated } from '../util/authentication';

const Start = () => {
  const history = useHistory();

  const performNavigation = async () => {
    if (await isAuthenticated()) {
      history.replace('/tabs/tab1');
    } else {
      history.replace('/login');
    }
  };

  performNavigation().catch(() => history.replace('/unlock'));

  return <></>;
};

export default Start;
