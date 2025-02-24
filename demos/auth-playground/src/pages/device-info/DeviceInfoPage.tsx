import { Capacitor } from '@capacitor/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import {
  BiometricPermissionState,
  BiometricSecurityStrength,
  Device,
  SupportedBiometricType,
} from '@ionic-enterprise/identity-vault';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react';
import { useEffect, useState } from 'react';

const isNativePlatform = Capacitor.isNativePlatform();

const prettyPrintBooleanStatus = (isAvailable: boolean) => (isAvailable ? 'Yes' : 'No');

const HardwareList = ({ hardware }: { hardware: SupportedBiometricType[] }) => {
  return (
    <ul>
      {hardware.length === 0 && <li>None</li>}
      {hardware.map((type, idx) => {
        return <li key={idx}>{type}</li>;
      })}
    </ul>
  );
};

const DeviceInfoPage: React.FC = () => {
  const [presentAlert] = useIonAlert();
  const [hasSecureHardware, setHasSecureHardware] = useState(false);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometricsAllowed, setBiometricsAllowed] = useState(BiometricPermissionState.Denied);
  const [biometricStrength, setBiometricStrength] = useState(BiometricSecurityStrength.Weak);
  const [systemPasscode, setSystemPasscode] = useState(false);
  const [privacyScreen, setPrivacyScreen] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);
  const [availableHardware, setAvailableHardware] = useState<SupportedBiometricType[]>([]);

  const togglePrivacy = async () => {
    if (privacyScreen) {
      await PrivacyScreen.disable();
    } else {
      await PrivacyScreen.enable();
    }
    const { enabled } = await PrivacyScreen.isEnabled();
    setPrivacyScreen(enabled);
  };

  const showBiometricPrompt = async () => {
    try {
      await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'This is only a test' });
      await displayBioResult('Success!!');
    } catch {
      await displayBioResult('Failed. User likely cancelled the operation.');
    }
  };

  const displayBioResult = async (subHeader: string) => {
    return presentAlert({ header: 'Show Biometrics', subHeader, buttons: ['Dismiss'] });
  };

  useEffect(() => {
    Device.hasSecureHardware().then((x) => setHasSecureHardware(x));
    Device.isBiometricsSupported().then((x) => setBiometricsSupported(x));
    Device.isBiometricsEnabled().then((x) => setBiometricsEnabled(x));
    Device.isBiometricsAllowed().then((x) => setBiometricsAllowed(x));
    Device.getBiometricStrengthLevel().then((x) => setBiometricStrength(x));
    Device.isSystemPasscodeSet().then((x) => setSystemPasscode(x));
    PrivacyScreen.isEnabled().then(({ enabled }) => setPrivacyScreen(enabled));
    Device.isLockedOutOfBiometrics().then((x) => setLockedOut(x));
    Device.getAvailableHardware().then((x) => setAvailableHardware(x));
  }, []);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Device Information</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/vault-control"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="device-info-page ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Device Information</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem data-testid="has-secure-hardware">
            <IonLabel>Has Secure Hardware</IonLabel>
            <IonNote slot="end">{prettyPrintBooleanStatus(hasSecureHardware)}</IonNote>
          </IonItem>
          <IonItem data-testid="biometrics-supported">
            <IonLabel>Biometrics Supported</IonLabel>
            <IonNote slot="end">{prettyPrintBooleanStatus(biometricsSupported)}</IonNote>
          </IonItem>
          <IonItem data-testid="biometrics-enabled">
            <IonLabel>Biometrics Enabled</IonLabel>
            <IonNote slot="end">{prettyPrintBooleanStatus(biometricsEnabled)}</IonNote>
          </IonItem>
          <IonItem data-testid="biometrics-allowed">
            <IonLabel>Biometrics Allowed</IonLabel>
            <IonNote slot="end">{biometricsAllowed}</IonNote>
          </IonItem>
          <IonItem data-testid="biometric-security-strength">
            <IonLabel>Biometric Strength</IonLabel>
            <IonNote slot="end">{biometricStrength}</IonNote>
          </IonItem>
          <IonItem data-testid="system-passcode">
            <IonLabel>System Passcode Enabled</IonLabel>
            <IonNote slot="end">{prettyPrintBooleanStatus(systemPasscode)}</IonNote>
          </IonItem>
          <IonItem data-testid="privacy-screen">
            <IonLabel>Privacy Screen Enabled</IonLabel>
            <IonNote slot="end">{prettyPrintBooleanStatus(privacyScreen)}</IonNote>
          </IonItem>
          <IonItem data-testid="locked-out">
            <IonLabel>Locked Out</IonLabel>
            <IonNote slot="end">{prettyPrintBooleanStatus(lockedOut)}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonButton
                data-testid="toggle-privacy-screen-button"
                expand="block"
                disabled={!isNativePlatform}
                onClick={togglePrivacy}
              >
                Toggle Privacy Screen
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonButton
                data-testid="show-biometric-prompt-button"
                expand="block"
                disabled={
                  !(isNativePlatform && biometricsEnabled && biometricsAllowed === BiometricPermissionState.Granted)
                }
                onClick={showBiometricPrompt}
              >
                Show Biometric Prompt
              </IonButton>
            </IonLabel>
          </IonItem>
        </IonList>

        <div data-testid="available-hardware">
          <p>Available Biometric Hardware:</p>
          <HardwareList hardware={availableHardware} />
        </div>
      </IonContent>
    </IonPage>
  );
};
export default DeviceInfoPage;
