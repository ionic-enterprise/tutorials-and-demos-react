import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { handleAuthCallback } from '../utils/authentication';
import './AuthActionCompletePage.css';

const AuthActionCompletePage: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      handleAuthCallback().then(() => history.replace('/'));
    }
  }, [handleAuthCallback]);

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
