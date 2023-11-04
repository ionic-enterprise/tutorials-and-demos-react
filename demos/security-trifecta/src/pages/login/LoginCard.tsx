import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { login } from '../../utils/auth';

const LoginCard: React.FC = () => {
  const history = useHistory();

  const handleLogin = async () => {
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
        <IonCardTitle>Login</IonCardTitle>
        <IonCardSubtitle>Secure Storage Demo Application (React)</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton expand="full" color="primary" onClick={handleLogin}>
          <IonIcon slot="end" icon={logInOutline} />
          Sign in
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginCard;
