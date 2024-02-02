import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { restoreSession } from '../../utils/session-vault';

const UnlockCard: React.FC = () => {
  const history = useHistory();

  const unlock = async () => {
    try {
      await restoreSession();
      history.replace('/');
    } catch (err) {
      console.log('Error logging in:', err);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Unlock</IonCardTitle>
        <IonCardSubtitle>Secure Storage Demo Application (React)</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton onClick={unlock}>Unlock</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default UnlockCard;
