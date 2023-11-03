import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import './AuthActionCompletePage.css';

const AuthActionCompletePage: React.FC = () => (
  <IonPage>
    <IonContent className="main-content auth-action-complete">
      <div className="container">
        <IonSpinner name="dots" />
      </div>
    </IonContent>
  </IonPage>
);

export default AuthActionCompletePage;
