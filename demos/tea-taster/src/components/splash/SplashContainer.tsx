import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { ReactNode, useEffect } from 'react';

interface Props {
  children?: ReactNode;
}

const SplashContainer = ({ children }: Props) => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) SplashScreen.hide();
  }, []);

  return <>{children}</>;
};
export default SplashContainer;
