import { ReactNode, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Device } from '@ionic-enterprise/identity-vault';
import { SplashScreen } from '@capacitor/splash-screen';
import { initializeAuthService, isAuthenticated } from '@/utils/authentication';
import { initializeVault, canUnlock } from '@/utils/session-storage/session-vault';
import Splashscreen from '@/components/Splashscreen';
import { usePinDialog } from '@/hooks/usePinDialog';

const isNative = Capacitor.isNativePlatform();

interface Props {
  children?: ReactNode;
}

let didInit = false;
const AppInitializer: React.FC<Props> = ({ children }) => {
  const history = useHistory();
  const onPasscodeRequested = usePinDialog();
  const [isReady, setIsReady] = useState(false);

  const init = async () => {
    // TODO: Vault and Auth are tightly coupled maybe add something to ensure Vault is initialized FIRST before you can init Auth
    await initializeVault({
      onPasscodeRequested,
      onLock: () => history.replace('/unlock'),
    });
    await initializeAuthService();

    // NOTE: Check for a previous auth result if it can be accessed without unlocking a Vault
    //       Otherwise the app will navigate to an unlock view, and offer option to unlock or start over
    if (!(await canUnlock())) {
      await isAuthenticated();
    }

    Device.setHideScreenOnBackground(true);
    isNative && SplashScreen.hide();

    setIsReady(true);
  };

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      init();
    }
  }, []);

  return isReady ? children : <Splashscreen />;
};
export default AppInitializer;
