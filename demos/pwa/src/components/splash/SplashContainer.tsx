import { SplashScreen } from '@capacitor/splash-screen';
import { isPlatform } from '@ionic/react';
import { ReactNode, useEffect } from 'react';

interface Props {
  children?: ReactNode;
}

const SplashContainer = ({ children }: Props) => {
  useEffect(() => {
    if (isPlatform('hybrid')) SplashScreen.hide();
  }, []);

  return <>{children}</>;
};
export default SplashContainer;
