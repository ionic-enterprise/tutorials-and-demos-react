import { IonSpinner, IonPage, IonContent } from '@ionic/react';

import './Splashscreen.css';

const Splashscreen: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="splashscreen-container">
          <h1>Auth Playground</h1>
          <IonSpinner />
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Splashscreen;
