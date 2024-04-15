import { IonPage, useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { canUnlock } from '@/utils/session-storage/session-vault';
//import { isAuthenticated } from '@/utils/authentication';

const StartPage: React.FC = () => {
  const history = useHistory();

  useIonViewDidEnter(() => {
    // This strategy takes you to the unlock page if there is a session to be unlocked.
    // From there, the user can choose to unlock or sign in again.
    startup();
    // If you comment out the above strategy and go with this one, when there is a locked
    // session, the user will be prompted to unlock the Vault automatically when it tries
    // to get the session.
    // startupForceUnlock();
  });

  const startup = async () => {
    if (await canUnlock()) {
      history.replace('/unlock');
    } else {
      history.replace('/tabs/teas');
    }
  };

  // const startupForceUnlock = async () => {
  //   await isAuthenticated();
  //   history.replace('/tabs/teas');
  // };

  return <IonPage></IonPage>;
};
export default StartPage;
