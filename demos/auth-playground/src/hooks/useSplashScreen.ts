import { useEffect, useRef } from 'react';
import { createAnimation, useIonModal } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen, ShowOptions, HideOptions } from '@capacitor/splash-screen';
import WebSplashscreen from '@/components/Splashscreen';

const isNative = Capacitor.isNativePlatform();

let enterDuration = 200;
let leaveDuration = 200;
const enterAnimation = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot || baseEl;

  const backdropAnimation = createAnimation()
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  const wrapperAnimation = createAnimation()
    .addElement(root.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(1)' },
      { offset: 1, opacity: '1', transform: 'scale(1)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(enterDuration)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
const leaveAnimation = (baseEl: HTMLElement) => {
  return enterAnimation(baseEl).duration(leaveDuration).direction('reverse');
};

let didInit = false;
export const useSplashScreen = (minimumTimeVisible = isNative ? 0 : 400) => {
  const start = useRef<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onDidDismiss = useRef(() => {});
  const [showWebSplashscreen, hideWebSplashscreen] = useIonModal(WebSplashscreen);

  const show = async (options?: ShowOptions) => {
    start.current = Date.now();

    if (isNative) {
      return SplashScreen.show(options);
    }

    const { fadeInDuration, fadeOutDuration } = Object.assign({ fadeInDuration: 200, fadeOutDuration: 200 }, options);
    enterDuration = fadeInDuration;
    leaveDuration = fadeOutDuration;

    return new Promise<void>((resolveShow) => {
      showWebSplashscreen({
        cssClass: 'web-splash-screen',
        enterAnimation,
        leaveAnimation,
        canDismiss: async (data, role) => role === 'splashscreen',
        onDidDismiss: () => onDidDismiss.current(),
        onDidPresent: () => resolveShow(),
      });
    });
  };

  const hide = async (options?: HideOptions) => {
    const timeSinceShown = Date.now() - (start.current || 0);

    return new Promise<void>((resolveHide) => {
      setTimeout(
        async () => {
          if (isNative) {
            await SplashScreen.hide(options);
            resolveHide();
          } else {
            const { fadeOutDuration } = Object.assign({ fadeOutDuration: 200 }, options);
            leaveDuration = fadeOutDuration;
            onDidDismiss.current = resolveHide;
            hideWebSplashscreen(undefined, 'splashscreen');
          }
        },
        Math.max(0, minimumTimeVisible - timeSinceShown),
      );
    });
  };

  // Splashscreen should show by default for app startup
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      show({ fadeInDuration: 0 });
    }
  }, []);

  return [show, hide];
};
