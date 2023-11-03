import { IonItem, IonLabel, IonPage, IonInput, IonContent } from '@ionic/react';
import { useContext, useEffect } from 'react';
import LoginCard from './LoginCard';

const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <LoginCard />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
