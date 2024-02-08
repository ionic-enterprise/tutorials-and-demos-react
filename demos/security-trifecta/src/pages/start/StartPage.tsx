import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { canUnlock, restoreSession } from '../../utils/session-vault';

const StartPage: React.FC = () => {
  const history = useHistory();

  const startup = async () => {
    const isUnlockable = await canUnlock();
    if (isUnlockable) {
      history.replace('/unlock');
    } else {
      const s = await restoreSession();
      if (s != undefined) history.replace('/teas');
      else history.replace('/login');
    }
  };

  const startupForceUnlock = async () => {
    await restoreSession();
    history.replace('/teas');
  };

  useEffect(() => {
    startup();
  }, []);

  return <></>;
};

export default StartPage;
