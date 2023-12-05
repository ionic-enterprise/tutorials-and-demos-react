import { Capacitor } from '@capacitor/core';
import { Auth0Provider, AuthConnect, ProviderOptions } from '@ionic-enterprise/auth';
import { getSnapshot, setSession } from './session-store';

const isNative = Capacitor.isNativePlatform();
const provider = new Auth0Provider();

const authOptions: ProviderOptions = {
  audience: 'https://io.ionic.demo.ac',
  clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
  discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
  logoutUrl: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
  redirectUri: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
  scope: 'openid offline_access email picture profile',
};

const setupAuthConnect = async (): Promise<void> => {
  return AuthConnect.setup({
    platform: isNative ? 'capacitor' : 'web',
    logLevel: 'DEBUG',
    ios: { webView: 'private' },
    web: { uiMode: 'popup', authFlow: 'PKCE' },
  });
};

const login = async (): Promise<void> => {
  const authResult = await AuthConnect.login(provider, authOptions);
  setSession(authResult);
};

const logout = async (): Promise<void> => {
  const authResult = getSnapshot();
  if (authResult) {
    await AuthConnect.logout(provider, authResult);
    setSession(null);
  }
};

export { login, logout, setupAuthConnect };
