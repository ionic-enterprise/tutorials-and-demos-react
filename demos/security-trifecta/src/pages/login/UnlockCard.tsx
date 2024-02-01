import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { login } from '../../utils/auth';

const UnlockCard: React.FC = () => {
  const history = useHistory();

  useEffect(() => {}, []);

  const unlock = async () => {
    try {
      await login();
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
