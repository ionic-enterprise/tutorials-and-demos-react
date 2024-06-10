import { getConfig, getKeys, getValue } from '@/utils/session-storage/session-vault';
import { VaultType } from '@ionic-enterprise/identity-vault';

const getValues = async () => {
  const keys = await getKeys();
  return Promise.all(
    keys.map(async (key: string) => ({
      key,
      value: JSON.stringify(await getValue<any>(key), undefined, 2),
    })),
  );
};

const getVaultTypeLabel = () => {
  switch (getConfig().type) {
    case VaultType.CustomPasscode: {
      return 'Custom Passcode';
    }
    case VaultType.DeviceSecurity: {
      return 'Device Security';
    }
    case VaultType.InMemory: {
      return 'In Memory';
    }
    case VaultType.SecureStorage: {
      return 'Secure Storage';
    }
    default: {
      return '';
    }
  }
};

export const useVault = () => {
  return {
    getVaultTypeLabel,
    getValues,
  };
};
