import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { AuthResult } from '@ionic-enterprise/auth';
import { DeviceSecurityType, IdentityVaultConfig, VaultType } from '@ionic-enterprise/identity-vault';
import { UnlockMode } from '../models/UnlockMode';
import { provisionBiometricPermission } from './device';
import { createVault } from './vault-factory';

type VaultUnlockType = Pick<IdentityVaultConfig, 'type' | 'deviceSecurityType'>;

interface CallbackMap {
  onVaultLock?: () => void;
  onPasscodeRequested?: (isPasscodeSetRequest: boolean, onComplete: (code: string) => void) => void;
}

const keys = { session: 'session', mode: 'last-unlock-mode' };
const vault = createVault();

let session: AuthResult | undefined;
let listeners: (() => void)[] = [];

const callbackMap: CallbackMap = {};

const subscribe = (listener: () => void) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = (): AuthResult | undefined => {
  return session;
};

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const setSession = async (newSession: AuthResult | undefined) => {
  session = newSession;
  await vault.setValue(keys.session, session);
  emitChange();
};

const initializeVault = async (): Promise<void> => {
  try {
    vault.initialize({
      key: 'io.ionic.teatastereact',
      type: VaultType.SecureStorage,
      deviceSecurityType: DeviceSecurityType.None,
      lockAfterBackgrounded: 5000,
      shouldClearVaultAfterTooManyFailedAttempts: true,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    });
  } catch {
    await vault.clear();
    await setUnlockMode('SecureStorage');
  }

  vault.onLock(async () => {
    session = undefined;
    if (callbackMap.onVaultLock) await callbackMap.onVaultLock();
    emitChange();
  });

  vault.onPasscodeRequested((isPasscodeSetRequest, onComplete) => {
    if (callbackMap.onPasscodeRequested) callbackMap.onPasscodeRequested(isPasscodeSetRequest, onComplete);
  });
};

const clearSession = async (): Promise<void> => {
  session = undefined;
  await vault.clear();
  await setUnlockMode('SecureStorage');
  emitChange();
};

const getSession = async (): Promise<void> => {
  if (!session) session = (await vault.getValue<AuthResult>(keys.session)) || undefined;
  emitChange();
};

const restoreSession = async (): Promise<AuthResult | undefined> => {
  const s = (await vault.getValue<AuthResult>(keys.session)) || undefined;
  session = s;
  emitChange();
  return session;
};

const getUnlockModeConfig = async (unlockMode: UnlockMode): Promise<VaultUnlockType> => {
  switch (unlockMode) {
    case 'Biometrics':
      await provisionBiometricPermission();
      return { type: VaultType.DeviceSecurity, deviceSecurityType: DeviceSecurityType.Biometrics };
    case 'BiometricsWithPasscode':
      await provisionBiometricPermission();
      return { type: VaultType.DeviceSecurity, deviceSecurityType: DeviceSecurityType.Both };
    case 'SystemPasscode':
      return { type: VaultType.DeviceSecurity, deviceSecurityType: DeviceSecurityType.SystemPasscode };
    case 'CustomPasscode':
      return { type: VaultType.CustomPasscode, deviceSecurityType: DeviceSecurityType.None };
    case 'SecureStorage':
    default:
      return { type: VaultType.SecureStorage, deviceSecurityType: DeviceSecurityType.None };
  }
};

const canUseLocking = (): boolean => Capacitor.isNativePlatform();

const canUnlock = async (): Promise<boolean> => {
  const { value } = await Preferences.get({ key: keys.mode });
  return (value || 'SecureStorage') !== 'SecureStorage' && !(await vault.isEmpty()) && (await vault.isLocked());
};

const setUnlockMode = async (unlockMode: UnlockMode) => {
  const { type, deviceSecurityType } = await getUnlockModeConfig(unlockMode);
  await vault.updateConfig({ ...vault.config!, type, deviceSecurityType });
  await Preferences.set({ key: keys.mode, value: unlockMode });
};

const getUnlockMode = async (): Promise<UnlockMode> => {
  const { value } = await Preferences.get({ key: keys.mode });
  return (value as UnlockMode | null) || 'SecureStorage';
};

const registerCallback = <T extends keyof CallbackMap>(topic: T, cb: CallbackMap[T]): void => {
  callbackMap[topic] = cb;
};

const unregisterCallback = <T extends keyof CallbackMap>(topic: T): void => {
  callbackMap[topic] = undefined;
};

export {
  canUnlock,
  canUseLocking,
  clearSession,
  getSession,
  getSnapshot,
  getUnlockMode,
  initializeVault,
  registerCallback,
  restoreSession,
  setSession,
  setUnlockMode,
  subscribe,
  unregisterCallback,
};
