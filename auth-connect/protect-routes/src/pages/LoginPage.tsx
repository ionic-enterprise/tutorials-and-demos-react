import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { login } from '../utils/authentication';
import { useHistory } from 'react-router';

const LoginPage: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton
          onClick={async () => {
            await login();
            history.push('tabs/tab1');
          }}
        >
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
