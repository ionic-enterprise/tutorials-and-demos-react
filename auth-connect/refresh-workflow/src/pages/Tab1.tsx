import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useContext } from 'react';
import { AuthenticationContext } from '../providers/AuthenticationProvider';
import { login, logout } from '../utils/authentication';
import './Tab1.css';

const Tab1: React.FC = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);

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
        {isAuthenticated ? (
          <IonButton onClick={logout}>Logout</IonButton>
        ) : (
          <IonButton onClick={login}>Login</IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
