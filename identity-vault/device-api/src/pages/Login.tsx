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
import { useHistory } from 'react-router-dom';
import { login } from '../util/authentication';
import { enhanceVault } from '../util/session-vault';

const Login = () => {
  const history = useHistory();

  const loginClicked = async (): Promise<void> => {
    try {
      await login();
      await enhanceVault();
      history.replace('/tabs/tab1');
    } catch (error: unknown) {
      console.error('Failed to log in', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <IonButton expand="block" onClick={loginClicked}>
                Login
              </IonButton>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Login;
