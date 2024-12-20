import { IonContent, IonPage } from '@ionic/react';
import LoginCard from './LoginCard';

const LoginPage = () => {
  return (
    <IonPage>
      <IonContent>
        <LoginCard />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
