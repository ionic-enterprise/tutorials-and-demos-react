import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { logoAmazon, logOut, cafeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { login, logout, isAuthenticated, getAccessToken } from '../../utils/auth';
import { UnlockMode } from '../../models/UnlockMode';
import { getUnlockMode, setUnlockMode, canUseLocking } from '../../utils/session-vault';
import { Device } from '@ionic-enterprise/identity-vault';

const UnlockCard: React.FC = () => {
  const history = useHistory();
  const [displayLockOptions, setLockOptions] = useState<boolean>(false);
  const [unlockModes, setUnlockModes] = useState<Array<{ mode: UnlockMode; label: string }>>([]);

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
