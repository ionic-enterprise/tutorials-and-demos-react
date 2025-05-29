import { Capacitor } from '@capacitor/core';
import { Auth0Provider, AuthConnect, AzureProvider, ProviderOptions } from '@ionic-enterprise/auth';
import { getSnapshot, setSession } from './session-store';

const isNative = Capacitor.isNativePlatform();
// const provider = new Auth0Provider();

// const authOptions: ProviderOptions = {
//   audience: 'https://io.ionic.demo.ac',
//   clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
//   discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
//   logoutUrl: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
//   redirectUri: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
//   scope: 'openid offline_access email picture profile',
// };

const provider = new AzureProvider();
const authOptions: ProviderOptions = {
  clientId: 'ed8cb65d-7bb2-4107-bc36-557fb680b994',
  scope:
    'openid offline_access email profile https://dtjacdemo.onmicrosoft.com/ed8cb65d-7bb2-4107-bc36-557fb680b994/demo.read',
  discoveryUrl:
    'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_acdemo2',
  redirectUri: isNative
    ? 'msauth://com.ionic.acprovider/O5m5Gtd2Xt8UNkW3wk7DWyKGfv8%3D'
    : 'http://localhost:8100/auth-action-complete',
  logoutUrl: isNative
    ? 'msauth://com.ionic.acprovider/O5m5Gtd2Xt8UNkW3wk7DWyKGfv8%3D'
    : 'http://localhost:8100/auth-action-complete',
  audience: '',
};

const setupAuthConnect = async (): Promise<void> => {
  return AuthConnect.setup({
    platform: isNative ? 'capacitor' : 'web',
    logLevel: 'DEBUG',
    ios: { webView: 'private' },
    web: { uiMode: 'current', authFlow: 'PKCE' },
  });
};

const handleAuthCallback = async (): Promise<void> => {
  const params = new URLSearchParams(window.location.search);
  if (params.size > 0) {
    const queryEntries = Object.fromEntries(params.entries());
    const authResult = await AuthConnect.handleLoginCallback(queryEntries, authOptions);
    setSession(authResult);
  } else {
    setSession(null);
  }
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

export { handleAuthCallback, login, logout, setupAuthConnect };
