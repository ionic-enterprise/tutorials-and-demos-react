import { useHistory } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { canUnlock, restoreSession } from '../../utils/session-vault';

const StartPage: React.FC = () => {
  const history = useHistory();
  // const {getSession, canUnlock} = useContext(SessionVaultContext);
  // const {saveAuthResult} = useContext(AuthContext);

  const startup = async () => {
    const isUnlockable = await canUnlock();
    if (isUnlockable) {
      // will take you to /unlock
      // however not currently implemented
      // so return to /login instead
      history.replace('/login');
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
