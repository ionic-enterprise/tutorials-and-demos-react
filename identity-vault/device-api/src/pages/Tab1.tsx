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
import { useHistory } from 'react-router';
import { logout } from '../util/authentication';
import { useSession } from '../util/session-store';
import { updateUnlockMode } from '../util/session-vault';
import './Tab1.css';
import { useEffect, useState } from 'react';
import { BiometricPermissionState, Device } from '@ionic-enterprise/identity-vault';

const Tab1: React.FC = () => {
  const history = useHistory();
  const { session } = useSession();
  const [disableBiometrics, setDisableBiometrics] = useState(false);

  useEffect(() => {
    (async () =>
      setDisableBiometrics(
        !(await Device.isBiometricsEnabled()) ||
          (await Device.isBiometricsAllowed()) !== BiometricPermissionState.Granted,
      ))();
  }, []);

  const logoutClicked = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonLabel>
              <IonButton
                expand="block"
                color="secondary"
                disabled={disableBiometrics}
                onClick={() => updateUnlockMode('BiometricsWithPasscode')}
              >
                Use Biometrics
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton expand="block" color="secondary" onClick={() => updateUnlockMode('InMemory')}>
                Use In Memory
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton expand="block" color="secondary" onClick={() => updateUnlockMode('SecureStorage')}>
                Use Secure Storage
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton expand="block" color="danger" onClick={logoutClicked}>
                Logout
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <div>
              <div>{session?.email}</div>
              <div>
                {session?.firstName} {session?.lastName}
              </div>
              <div>{session?.accessToken}</div>
              <div>{session?.refreshToken}</div>
            </div>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
