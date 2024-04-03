import { useEffect, useRef } from 'react';
import { createAnimation, useIonModal } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import WebSplashscreen from '@/components/Splashscreen';

const isNative = Capacitor.isNativePlatform();

const enterAnimation = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  return createAnimation()
    .addElement(root?.querySelector('.modal-wrapper')!)
    .to('opacity', 1)
    .to('transform', 'scale(1)');
};

const leaveAnimation = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    .addElement(root?.querySelector('ion-backdrop')!)
    .fromTo('opacity', 'var(--backdrop-opacity)', '0.01');

  const wrapperAnimation = createAnimation()
    .addElement(root?.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '0.99' },
      { offset: 1, opacity: '0' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(500)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

let didInit = false;
export const useSplashScreen = (minimumDuration = 400) => {
  const start = useRef<number>();
  const [showWebSplashscreen, hideWebSplashscreen] = useIonModal(WebSplashscreen);

  const showSplashScreen = () => {
    start.current = Date.now();
    if (isNative) {
      SplashScreen.show();
    } else {
      showWebSplashscreen({ cssClass: 'web-splash-screen', enterAnimation, leaveAnimation });
    }
  };

  const hideSplashScreen = () => {
    const timeSinceShown = Date.now() - (start.current || 0);
    setTimeout(() => {
      if (isNative) {
        SplashScreen.hide();
      } else {
        hideWebSplashscreen();
      }
    }, minimumDuration - timeSinceShown);
  };

  // Splashscreen should show by default for app startup
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      showSplashScreen();
    }
  }, []);

  return { showSplashScreen, hideSplashScreen };
};
