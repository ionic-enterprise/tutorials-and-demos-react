import {
  BrowserVault,
  Vault,
  VaultType,
  DeviceSecurityType,
  IdentityVaultConfig,
} from '@ionic-enterprise/identity-vault';
import { createVault } from './vault-factory';
import { Session } from '../models/Session';

export type UnlockMode = 'BiometricsWithPasscode' | 'InMemory' | 'SecureStorage';

const vault: Vault | BrowserVault = createVault();
let session: Session | null = null;
let listeners: any[] = [];

export const initializeVault = async (): Promise<void> => {
  await vault.initialize({
    key: 'io.ionic.gettingstartedivreact',
    type: VaultType.SecureStorage,
    deviceSecurityType: DeviceSecurityType.None,
    lockAfterBackgrounded: 2000,
  });

  vault.onLock(() => {
    session = null;
    emitChange();
  });

  await getSession();
};

export const getSnapshot = (): Session | null => {
  return session;
};

export const subscribe = (listener: any) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

export const emitChange = () => {
  for (let listener of listeners) {
    listener();
  }
};

export const storeSession = async (newSession: Session): Promise<void> => {
  vault.setValue('session', newSession);
  session = newSession;
  emitChange();
};

export const getSession = async (): Promise<void> => {
  if (session === null) {
    if (await vault.isEmpty()) session = null;
    else session = await vault.getValue<Session>('session');
  }
  emitChange();
};

export const clearSession = async (): Promise<void> => {
  await vault.clear();
  session = null;
  emitChange();
};

export const updateUnlockMode = async (mode: UnlockMode): Promise<void> => {
  const newConfig = { ...(vault.config as IdentityVaultConfig) };

  switch (mode) {
    case 'BiometricsWithPasscode': {
      newConfig.type = VaultType.DeviceSecurity;
      break;
    }
    case 'InMemory': {
      newConfig.type = VaultType.InMemory;
      break;
    }
    default: {
      newConfig.type = VaultType.SecureStorage;
      break;
    }
  }

  await vault.updateConfig(newConfig);
};

export const lockSession = async (): Promise<void> => {
  await vault.lock();
  session = null;
  emitChange();
};
