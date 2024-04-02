import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon } from '@ionic/react';
import { lockOpenOutline, arrowRedoOutline } from 'ionicons/icons';
import { isAuthenticated, logout } from '@/utils/authentication';
import { canUnlock, unlock, clear } from '@/utils/session-storage/session-vault';

import './UnlockPage.css';

const UnlockPage: React.FC = () => {
  const history = useHistory();

  const handleRedo = async (): Promise<void> => {
    await logout();
    await clear();
    history.replace('/login');
  };

  const tryUnlock = async (): Promise<void> => {
    try {
      await unlock();
      await isAuthenticated();
      await history.replace('/');
    } catch (err) {
      // NOTE: You could alert or otherwise set an error message
      //       The most common failure is the user cancelling, so we just don't navigate
    }
  };

  const handleUnlock = async (): Promise<void> => {
    if (await canUnlock()) {
      await tryUnlock();
    } else {
      await history.replace('/login');
    }
  };

  return (
    <IonPage>
      <IonContent className="unlock-page ion-text-center">
        <IonCard>
          <IonCardContent>
            <IonCardTitle>The Playground is Locked</IonCardTitle>
            <IonButton className="unlock-button" expand="full" fill="clear" onClick={() => handleUnlock()}>
              <IonIcon slot="end" icon={lockOpenOutline} />
              Unlock
            </IonButton>
            <IonButton expand="full" color="secondary" onClick={() => handleRedo()}>
              <IonIcon slot="end" icon={arrowRedoOutline} />
              Redo Sign In
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default UnlockPage;
