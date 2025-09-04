import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon } from '@ionic/react';
import { lockOpenOutline, arrowRedoOutline } from 'ionicons/icons';
import { isAuthenticated, logout } from '@/utils/authentication';
import { canUnlock, unlock, clear, setUnlockMode } from '@/utils/session-storage/session-vault';

import './UnlockPage.css';
import { VaultErrorCodes } from '@ionic-enterprise/identity-vault';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === VaultErrorCodes.InvalidatedCredential) {
        await setUnlockMode('NeverLock');
        await logout();
        history.replace('/login');
      } else {
        console.log(err);
      }
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
