import { IonPage, IonContent, IonSpinner } from '@ionic/react';

import './AuthActionCompletePage.css';

const AuthActionCompletePage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="auth-action-complete-page">
        <div className="container">
          <IonSpinner name="dots"></IonSpinner>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default AuthActionCompletePage;
