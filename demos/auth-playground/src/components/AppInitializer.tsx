import { usePinDialog } from '@/hooks/usePinDialog';
import { useSplashScreen } from '@/hooks/useSplashScreen';
import { initializeAuthService, isAuthenticated } from '@/utils/authentication';
import { canUnlock, initializeVault } from '@/utils/session-storage/session-vault';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { ReactNode, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

let didInit = false;
const AppInitializer = ({ children }: Props) => {
  const history = useHistory();
  const onPasscodeRequested = usePinDialog();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, hideSplashScreen] = useSplashScreen();
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

    PrivacyScreen.enable({ android: { privacyModeOnActivityHidden: 'dim' } });

    hideSplashScreen();

    setIsReady(true);
  };

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      init();
    }
  }, []);

  return isReady ? children : null;
};
export default AppInitializer;
