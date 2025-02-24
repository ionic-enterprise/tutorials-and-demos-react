import { useVault } from '@/hooks/useVault';
import { isAuthenticated } from '@/utils/authentication';
import { clear, getConfig, lock, setUnlockMode, UnlockMode } from '@/utils/session-storage/session-vault';
import { Capacitor } from '@capacitor/core';
import { Device, VaultType } from '@ionic-enterprise/identity-vault';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { ellipsisVerticalOutline, hardwareChipOutline, listOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './VaultControlPage.css';

const isNativePlatform = Capacitor.isNativePlatform();

const VaultControlPage: React.FC = () => {
  const history = useHistory();
  const { getVaultTypeLabel } = useVault();
  const [vaultTypeLabel, setVaultTypeLabel] = useState(getVaultTypeLabel);
  const [disableCustomPasscode] = useState(isNativePlatform ? false : true);
  const [disableInMemory] = useState(isNativePlatform ? false : true);
  const [disableSystemPasscode, setDisableSystemPasscode] = useState(true);
  const [disableDeviceUnlock, setDisableDeviceUnlock] = useState(true);
  const [disableLock, setDisableLock] = useState(true);

  const openDevicePage = async (): Promise<void> => {
    history.push('/tabs/vault-control/device-info');
  };
  const openValuesPage = async (): Promise<void> => {
    history.push('/tabs/vault-control/values');
  };
  const setMode = async (mode: UnlockMode) => {
    setDisableLock(mode === 'NeverLock');
    await setUnlockMode(mode);
    setVaultTypeLabel(getVaultTypeLabel());
  };
  const clearVault = async () => {
    await clear();
    await isAuthenticated();
  };

  useEffect(() => {
    setDisableLock(getConfig().type === VaultType.SecureStorage);
    Device.isSystemPasscodeSet().then((x) => setDisableSystemPasscode(!x));
    Device.isBiometricsEnabled().then((x) => setDisableDeviceUnlock(!x));
  });

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Vault Control</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="vault-control-page">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Vault Control</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonLabel>Vault Type</IonLabel>
            <IonNote slot="end">{vaultTypeLabel}</IonNote>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton
                expand="block"
                disabled={disableDeviceUnlock}
                onClick={() => setMode('Device')}
                data-testid="use-device-button"
              >
                Use Biometrics (System PIN Backup)
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton
                expand="block"
                disabled={disableSystemPasscode}
                onClick={() => setMode('SystemPIN')}
                data-testid="use-system-passcode-button"
              >
                Use System PIN (No Biometrics)
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton
                expand="block"
                disabled={disableCustomPasscode}
                onClick={() => setMode('SessionPIN')}
                data-testid="use-custom-passcode-button"
              >
                Use Custom Passcode (Session PIN)
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton expand="block" onClick={() => setMode('NeverLock')} data-testid="never-lock-button">
                Never Lock (Secure Storage)
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton
                expand="block"
                disabled={disableInMemory}
                onClick={() => setMode('ForceLogin')}
                data-testid="clear-on-lock-button"
              >
                Clear on Lock (In Memory)
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton expand="block" disabled={disableLock} onClick={() => lock()} data-testid="lock-vault-button">
                Lock the Vault
              </IonButton>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonButton expand="block" onClick={clearVault} data-testid="clear-vault-button">
                Clear the Vault
              </IonButton>
            </IonLabel>
          </IonItem>
        </IonList>

        <div className="commentary ion-padding">
          <h1>Expected Results</h1>
          <h2>On Mobile</h2>
          <p>
            On a mobile device, the vault will be created in the keystore (Android) or key chain (iOS). The following
            vault types are available:
          </p>
          <dl>
            <dt>Device</dt>
            <dd>
              The system passcode needs to be set on the device in order to use this option. This option will use
              biometrics as the primary unlocking mechanism if the devices supports it and the user has registered their
              fingerprint (or face). The system passcode is used as a fallback.
            </dd>
            <dt>Custom Passcode</dt>
            <dd>
              This option will use a custom passcode that is defined for the session. Once the vault is cleared, the
              passcode must be re-entered for the next session. The passcode itself is never stored. Rather, it is used
              to generate the key used to lock and unlock the vault. If the passcode entered to unlock the vault is no
              the same as the passcode used to lock the vault, they generated key will not work. This option is always
              available, even if the system passcode is not set up.
            </dd>
            <dt>Secure Storage</dt>
            <dd>
              The data is stored in the vault but it is never locked. This type of vault is used when the token needs to
              be protected, but device being unlocked is &quot;good enough&quot; in order to access the application.
            </dd>
            <dt>In Memory</dt>
            <dd>
              This is the safest option, but probably also the most annoying for the user. All data is stored in memory
              and is destroyed when the vault locks. As a result, the authentication tokens are never stored, and the
              user needs to log in each time they restart the app or put the app in the background long enough to cause
              a timeout.
            </dd>
          </dl>

          <p>This page also allows the following actions to be performed on the vault:</p>

          <dl>
            <dt>Lock</dt>
            <dd>
              This option is not available with the &quot;Secure Storage&quot; vault. For &quot;Device&quot; and
              &quot;Custom Passcode&quot;, the vault will lock and the app will redirect to the &quot;unlock&quot; page.
              For &quot;In Memory&quot;, the data stored by the vault is cleared and will behave in a similar manner to
              clearing the vault.
            </dd>
            <dt>Clear</dt>
            <dd>
              All data stored by the vault is cleared. If you open the values page you will not see any values. If you
              go to the tea list page, the HTTP request to get the teas will result in a 401 error and you will be
              redirected to the login page. The actual login may or may not ask for credentials as the OIDC provider may
              still technically be in a logged in state.
            </dd>
          </dl>

          <h2>On Web</h2>
          <p>
            The web does not have a secure storage area. As such, there is no vault but we create a fake one for
            development purposes. It behaves like a &quot;Secure Storage&quot; vault, but is <strong>not</strong>{' '}
            secure. As such, the only action you can take is to clear the vault.
          </p>
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton data-testid="fab-menu-button">
            <IonIcon icon={ellipsisVerticalOutline}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton data-testid="device-page-button">
              <IonIcon icon={hardwareChipOutline} onClick={openDevicePage}></IonIcon>
            </IonFabButton>
            <IonFabButton data-testid="values-page-button">
              <IonIcon icon={listOutline} onClick={openValuesPage}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};
export default VaultControlPage;
