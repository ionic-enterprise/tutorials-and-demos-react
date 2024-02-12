import { Capacitor } from '@capacitor/core';
import { BrowserVault, Vault } from '@ionic-enterprise/identity-vault';

export const createVault = (): Vault | BrowserVault => {
  return Capacitor.isNativePlatform() ? new Vault() : new BrowserVault();
};