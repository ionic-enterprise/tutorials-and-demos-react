import { IonPage, IonContent } from '@ionic/react';

import './Splashscreen.css';

const Splashscreen: React.FC = () => {
  return (
    <IonPage className="splash-screen">
      <IonContent fullscreen>
        <div className="logo-container">
          <img alt="Auth Playground App Icon" src="/assets/icons/icon-256.webp" />
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Splashscreen;
