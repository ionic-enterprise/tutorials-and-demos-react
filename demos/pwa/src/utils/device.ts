import { Preferences } from '@capacitor/preferences';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { BiometricPermissionState, Device } from '@ionic-enterprise/identity-vault';
import { isPlatform } from '@ionic/react';

const key = 'hide-in-background';

const canUseBiometrics = async (): Promise<boolean> => isPlatform('hybrid') && (await Device.isBiometricsEnabled());
const canUseSystemPasscode = async (): Promise<boolean> => isPlatform('hybrid') && (await Device.isSystemPasscodeSet());
const canUseCustomPasscode = (): boolean => isPlatform('hybrid');
const canHideContentsInBackground = (): boolean => isPlatform('hybrid');

const hideContentsInBackground = async (value: boolean): Promise<void> => {
  if (value) {
    await PrivacyScreen.enable({ android: { dimBackground: true } });
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
