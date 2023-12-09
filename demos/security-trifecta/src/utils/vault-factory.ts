import { BrowserVault, Vault } from '@ionic-enterprise/identity-vault';
import { isPlatform } from '@ionic/react';

export const createVault = (): Vault | BrowserVault => {
  return isPlatform('hybrid') ? new Vault() : new BrowserVault();
};
