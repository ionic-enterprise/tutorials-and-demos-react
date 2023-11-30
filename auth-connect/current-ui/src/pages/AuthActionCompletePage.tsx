import { Capacitor } from '@capacitor/core';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { handleAuthCallback } from '../utils/authentication';
import './AuthActionCompletePage.css';

const AuthActionCompletePage: React.FC = () => {
  const history = useHistory();

  if (!Capacitor.isNativePlatform()) {
    handleAuthCallback().then(() => history.replace('/'));
  }

  return (
    <IonPage>
      <IonContent className="main-content auth-action-complete">
        <div className="container">
          <IonSpinner name="dots" />
        </div>
      </IonContent>
    </IonPage>
  );
};
export default AuthActionCompletePage;
