import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { logoAmazon, logOut, cafeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { login, logout, isAuthenticated, getAccessToken } from '../../utils/auth';

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
          <IonIcon slot="end" icon={logoAmazon} />
          Sign in with AWS
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginCard;
