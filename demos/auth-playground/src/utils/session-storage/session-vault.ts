import { isPlatform } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import {
  Device,
  VaultType,
  DeviceSecurityType,
  IdentityVaultConfig,
  BiometricPermissionState,
} from '@ionic-enterprise/identity-vault';
import { createVault } from '@/utils/vault-factory';

interface InitializeOptions {
  onPasscodeRequested: (isPasscodeSetRequest: boolean) => Promise<string>;
  onLock: () => void;
}

const isNativePlatform = isPlatform('hybrid');

export type UnlockMode = 'Device' | 'SystemPIN' | 'SessionPIN' | 'NeverLock' | 'ForceLogin';

const modeKey = 'LastUnlockMode';
const vault = createVault();

export const initializeVault = async ({ onPasscodeRequested, onLock }: InitializeOptions): Promise<void> => {
  try {
    await vault.initialize({
      key: 'io.ionic.auth-playground-react',
      type: VaultType.SecureStorage,
      deviceSecurityType: DeviceSecurityType.None,
      lockAfterBackgrounded: 5000,
      shouldClearVaultAfterTooManyFailedAttempts: true,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    });
  } catch {
    await vault.clear();
    await setUnlockMode('NeverLock');
  }

  vault.onPasscodeRequested(async (isPasscodeSetRequest) => {
    const passcode = await onPasscodeRequested(isPasscodeSetRequest);
    vault.setCustomPasscode(passcode);
  });

  vault.onLock(() => {
    onLock();
  });
};

const provision = async (): Promise<void> => {
  if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
    try {
      await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Please authenticate to continue' });
    } catch (e: unknown) {
      console.error(e);
    }
  }
};

export const setUnlockMode = async (unlockMode: UnlockMode): Promise<void> => {
  const newConfig: IdentityVaultConfig = { ...(vault.config as IdentityVaultConfig) };

  switch (unlockMode) {
    case 'Device':
      await provision();
      newConfig.type = VaultType.DeviceSecurity;
      newConfig.deviceSecurityType = DeviceSecurityType.Both;
      break;

    case 'SystemPIN':
      newConfig.type = VaultType.DeviceSecurity;
      newConfig.deviceSecurityType = DeviceSecurityType.SystemPasscode;
      break;

    case 'SessionPIN':
      newConfig.type = VaultType.CustomPasscode;
      newConfig.deviceSecurityType = DeviceSecurityType.None;
      break;

    case 'ForceLogin':
      newConfig.type = VaultType.InMemory;
      newConfig.deviceSecurityType = DeviceSecurityType.None;
      break;

    case 'NeverLock':
      newConfig.type = VaultType.SecureStorage;
      newConfig.deviceSecurityType = DeviceSecurityType.None;
      break;

    default:
      newConfig.type = VaultType.SecureStorage;
      newConfig.deviceSecurityType = DeviceSecurityType.None;
  }

  await vault.updateConfig(newConfig);
  await Preferences.set({ key: modeKey, value: unlockMode });
};

export const initializeUnlockMode = async (): Promise<void> => {
  if (isNativePlatform) {
    if (await Device.isSystemPasscodeSet()) {
      if (await Device.isBiometricsEnabled()) {
        await setUnlockMode('Device');
      } else {
        await setUnlockMode('SystemPIN');
      }
    } else {
      await setUnlockMode('SessionPIN');
    }
  } else {
    await setUnlockMode('NeverLock');
  }
};

export const canUnlock = async (): Promise<boolean> => {
  const { value } = await Preferences.get({ key: modeKey });
  return value !== 'NeverLock' && !(await vault.isEmpty()) && (await vault.isLocked());
};

export const getConfig = (): IdentityVaultConfig => vault.config as IdentityVaultConfig;
export const getKeys = (): Promise<string[]> => vault.getKeys();

export const getValue = <T>(key: string): Promise<T | null | undefined> => vault.getValue(key);
export const setValue = <T>(key: string, value: T): Promise<void> => vault.setValue(key, value);
export const clear = (): Promise<void> => vault.clear();

export const lock = (): Promise<void> => vault.lock();
export const unlock = (): Promise<void> => vault.unlock();
