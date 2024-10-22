import { Device } from '@ionic-enterprise/identity-vault';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import './Tab2.css';

const Tab2: React.FC = () => {
  const [hasSecureHardware, setHasSecureHardware] = useState(false);
  const [isBiometricsSupported, setIsBiometricsSupported] = useState(false);
  const [availableHardware, setAvailableHardware] = useState<Array<string>>([]);
  const [biometricStrengthLevel, setBiometricStrengthLevel] = useState('');
  const [isBiometricsAllowed, setIsBiometricsAllowed] = useState('');
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isHideScreenOnBackgroundEnabled, setIsHideScreenOnBackgroundEnabled] = useState(false);
  const [isLockedOutOfBiometrics, setIsLockedOutOfBiometrics] = useState(false);
  const [isSystemPasscodeSet, setIsSystemPasscodeSet] = useState(false);

  useEffect(() => {
    (async () => {
      setHasSecureHardware(await Device.hasSecureHardware());
      setIsBiometricsSupported(await Device.isBiometricsSupported());
      setAvailableHardware(await Device.getAvailableHardware());
      setBiometricStrengthLevel(await Device.getBiometricStrengthLevel());
      setIsBiometricsAllowed(await Device.isBiometricsAllowed());
      setIsBiometricsEnabled(await Device.isBiometricsEnabled());
      setIsHideScreenOnBackgroundEnabled(await Device.isHideScreenOnBackgroundEnabled());
      setIsLockedOutOfBiometrics(await Device.isLockedOutOfBiometrics());
      setIsSystemPasscodeSet(await Device.isSystemPasscodeSet());
    })();
  }, []);

  const toggleHideScreenOnBackground = async (): Promise<void> => {
    await Device.setHideScreenOnBackground(!isHideScreenOnBackgroundEnabled);
    setIsHideScreenOnBackgroundEnabled(await Device.isHideScreenOnBackgroundEnabled());
  };

  const showBiometricPrompt = async (): Promise<void> => {
    try {
      await Device.showBiometricPrompt({
        iosBiometricsLocalizedReason: 'Just to show you how this works',
      });
    } catch (e) {
      // This is the most likely scenario
      alert('user cancelled biometrics prompt');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonListHeader>
            <IonLabel>Capabilities</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Secure Hardware</IonLabel>
            <IonNote slot="end">{hasSecureHardware?.toString()}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Biometrics Supported</IonLabel>
            <IonNote slot="end">{isBiometricsSupported?.toString()}</IonNote>
          </IonItem>
          <IonItem>
            <div>
              <p>Available Biometric Hardware:</p>
              <ul>{availableHardware?.length ? availableHardware.map((h) => <li key={h}>{h}</li>) : <li>None</li>}</ul>
            </div>
          </IonItem>
          <IonListHeader>
            <IonLabel>Configuration and Status</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Biometric Strength Level</IonLabel>
            <IonNote slot="end">{biometricStrengthLevel}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Biometric Allowed</IonLabel>
            <IonNote slot="end">{isBiometricsAllowed}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Biometrics Enabled</IonLabel>
            <IonNote slot="end">{isBiometricsEnabled.toString()}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Hide Screen Enabled</IonLabel>
            <IonNote slot="end">{isHideScreenOnBackgroundEnabled.toString()}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Locked Out of Biometrics</IonLabel>
            <IonNote slot="end">{isLockedOutOfBiometrics.toString()}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>System Passcode Set</IonLabel>
            <IonNote slot="end">{isSystemPasscodeSet.toString()}</IonNote>
          </IonItem>
          <IonListHeader>
            <IonLabel>Actions</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>
              <IonButton expand="block" disabled={!isBiometricsEnabled} onClick={showBiometricPrompt}>
                Show Biometric Prompt
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonButton expand="block" onClick={toggleHideScreenOnBackground}>
                {isHideScreenOnBackgroundEnabled ? 'Disable' : 'Enable'} Security Screen
              </IonButton>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
