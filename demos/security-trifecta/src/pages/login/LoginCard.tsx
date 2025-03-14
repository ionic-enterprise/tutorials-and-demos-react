import { Device } from '@ionic-enterprise/identity-vault';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UnlockMode } from '../../models/UnlockMode';
import { login } from '../../utils/auth';
import { canUseLocking, setUnlockMode } from '../../utils/session-vault';

interface UnlockOption {
  mode: UnlockMode;
  label: string;
}

const LoginCard: React.FC = () => {
  const history = useHistory();
  const [displayLockOptions, setLockOptions] = useState<boolean>(false);
  const [unlockModes, setUnlockModes] = useState<UnlockOption[]>([]);
  const [selectedMode, setSelectedMode] = useState<UnlockMode | undefined>(undefined);

  useEffect(() => {
    setLockOptions(canUseLocking);
    initialize();
  }, []);

  const initialize = async () => {
    const newUnlockOptions: UnlockOption[] = [
      {
        mode: 'SecureStorage',
        label: 'Never Lock Session',
      },
      {
        mode: 'CustomPasscode',
        label: 'Session PIN Unlock',
      },
    ];

    Device.isBiometricsEnabled().then((enabled: boolean) => {
      if (enabled) {
        newUnlockOptions.push({
          mode: 'Biometrics',
          label: 'Biometric Unlock',
        });
      }

      setUnlockModes(newUnlockOptions);
    });

    //initialize to secure storage
    setSelectedMode('SecureStorage');
  };

  const updateUnlockMode = async (mode: UnlockMode) => {
    setSelectedMode(mode);
  };

  const handleLogin = async () => {
    try {
      await login();
      if (selectedMode != undefined) {
        setUnlockMode(selectedMode);
      }
      history.replace('/teas');
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
        {displayLockOptions && unlockModes.length > 0 && (
          <IonSelect
            label="Locking Options"
            name="lockOptions"
            value={selectedMode != undefined ? selectedMode : unlockModes[0].mode}
            onIonChange={(e) => updateUnlockMode(e.detail.value)}
          >
            {unlockModes.map((m) => {
              return (
                <IonSelectOption key={m.mode} value={m.mode}>
                  {m.label}
                </IonSelectOption>
              );
            })}
          </IonSelect>
        )}
        <IonButton expand="full" color="primary" onClick={handleLogin}>
          <IonIcon slot="end" icon={logInOutline} />
          Sign in
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginCard;
