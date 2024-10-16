import {
  BrowserVault,
  Vault,
  VaultType,
  DeviceSecurityType,
  IdentityVaultConfig,
} from '@ionic-enterprise/identity-vault';
import { createVault } from './vault-factory';
import { Session } from '../models/Session';
import { setState } from './session-store';

export type UnlockMode = 'BiometricsWithPasscode' | 'InMemory' | 'SecureStorage';

const vault: Vault | BrowserVault = createVault();

export const initializeVault = async (): Promise<void> => {
  try {
    await vault.initialize({
      key: 'io.ionic.gettingstartedivreact',
      type: VaultType.SecureStorage,
      deviceSecurityType: DeviceSecurityType.None,
      lockAfterBackgrounded: 2000,
    });
  } catch (e: unknown) {
    await vault.clear();
    await updateUnlockMode('SecureStorage');
  }

  vault.onLock(() => {
    setState({ session: null });
  });

  await restoreSession();
};

export const storeSession = async (session: Session): Promise<void> => {
  vault.setValue('session', session);
  setState({ session });
};

export const restoreSession = async (): Promise<void> => {
  let session: Session | null = null;
  if (!(await vault.isEmpty())) {
    session = await vault.getValue<Session>('session');
  }
  setState({ session });
};

export const clearSession = async (): Promise<void> => {
  await vault.clear();
  setState({ session: null });
};

export const updateUnlockMode = async (mode: UnlockMode): Promise<void> => {
  const newConfig = { ...(vault.config as IdentityVaultConfig) };

  switch (mode) {
    case 'BiometricsWithPasscode': {
      newConfig.type = VaultType.DeviceSecurity;
      newConfig.deviceSecurityType = DeviceSecurityType.Both;
      break;
    }
    case 'InMemory': {
      newConfig.type = VaultType.InMemory;
      newConfig.deviceSecurityType = DeviceSecurityType.None;
      break;
    }
    default: {
      newConfig.type = VaultType.SecureStorage;
      newConfig.deviceSecurityType = DeviceSecurityType.None;
      break;
    }
  }

  await vault.updateConfig(newConfig);
};

export const lockSession = async (): Promise<void> => {
  await vault.lock();
  setState({ session: null });
};
