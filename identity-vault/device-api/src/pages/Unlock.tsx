import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logout } from '../util/authentication';
import { useHistory } from 'react-router';
import { restoreSession } from '../util/session-vault';

const Unlock = () => {
  const history = useHistory();

  const unlock = async () => {
    try {
      await restoreSession();
      history.replace('/tabs/tab1');
    } catch (err: unknown) {
      null;
    }
  };

  const redoLogin = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Unlock</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel>
              <IonButton expand="block" onClick={unlock}>
                Unlock
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonButton expand="block" onClick={redoLogin}>
                Login
              </IonButton>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Unlock;
