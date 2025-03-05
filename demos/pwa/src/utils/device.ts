import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { BiometricPermissionState, Device } from '@ionic-enterprise/identity-vault';

const key = 'hide-in-background';

const canUseBiometrics = async (): Promise<boolean> =>
  Capacitor.isNativePlatform() && (await Device.isBiometricsEnabled());
const canUseSystemPasscode = async (): Promise<boolean> =>
  Capacitor.isNativePlatform() && (await Device.isSystemPasscodeSet());
const canUseCustomPasscode = (): boolean => Capacitor.isNativePlatform();
const canHideContentsInBackground = (): boolean => Capacitor.isNativePlatform();

const hideContentsInBackground = async (value: boolean): Promise<void> => {
  if (value) {
    await PrivacyScreen.enable({ android: { dimBackground: true, privacyModeOnActivityHidden: 'dim' } });
  } else {
    await PrivacyScreen.disable();
  }
  return Preferences.set({ key, value: JSON.stringify(value) });
};

const isHidingContentsInBackground = async (): Promise<boolean> => {
  const { value } = await Preferences.get({ key });
  return JSON.parse(value || 'false');
};

const provisionBiometricPermission = async (): Promise<void> => {
  if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
    try {
      await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Please authenticate to continue' });
    } catch (error) {
      console.error(error);
    }
  }
};

export {
  canHideContentsInBackground,
  canUseBiometrics,
  canUseCustomPasscode,
  canUseSystemPasscode,
  hideContentsInBackground,
  isHidingContentsInBackground,
  provisionBiometricPermission,
};
