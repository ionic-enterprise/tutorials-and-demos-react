import { IonPage, IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon } from '@ionic/react';
import { lockOpenOutline, arrowRedoOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { logout } from '../../utils/auth';
import { clearSession, restoreSession, setUnlockMode } from '../../utils/session-vault';
import { VaultErrorCodes } from '@ionic-enterprise/identity-vault';

import './UnlockPage.css';

const UnlockPage: React.FC = () => {
  const history = useHistory();

  const handleRedo = async (): Promise<void> => {
    await clearSession();
    await logout();
    history.replace('/login');
  };

  const handleUnlock = async (): Promise<void> => {
    try {
      await restoreSession();
      history.replace('/');
    } catch (err: any) {
      if (err.code === VaultErrorCodes.InvalidatedCredential) {
        await setUnlockMode('SecureStorage');
        await logout();
        history.replace('/login');
      } else {
        console.log(err);
      }
    }
  };

  return (
    <IonPage>
      <IonContent className="unlock-page ion-text-center main-content">
        <IonCard>
          <IonCardContent>
            <IonCardTitle>The Tasting Room is Locked</IonCardTitle>
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
