import { Capacitor } from '@capacitor/core';
import { Auth0Provider, AuthConnect, AuthResult, ProviderOptions, TokenType } from '@ionic-enterprise/auth';
import { clearSession, getSnapshot, setSession } from './session-vault';

const isMobile = Capacitor.isNativePlatform();
const url = isMobile ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete';
const options: ProviderOptions = {
  audience: 'https://io.ionic.demo.ac',
  clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
  discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
  scope: 'openid email picture profile offline_access',
  logoutUrl: url,
  redirectUri: url,
};
const provider = new Auth0Provider();

const setupAuthConnect = async (): Promise<void> => {
  return AuthConnect.setup({
    platform: isMobile ? 'capacitor' : 'web',
    logLevel: 'DEBUG',
    ios: { webView: 'private' },
    web: { uiMode: 'popup', authFlow: 'implicit' },
  });
};

const performRefresh = async (authResult: AuthResult): Promise<AuthResult | undefined> => {
  let newAuthResult: AuthResult | undefined;
  if (await AuthConnect.isRefreshTokenAvailable(authResult)) {
    try {
      newAuthResult = await AuthConnect.refreshSession(provider, authResult);
      setSession(newAuthResult);
    } catch {
      await clearSession();
    }
  } else {
    await clearSession();
  }

  return newAuthResult;
};

const getAuthResult = async (): Promise<AuthResult | undefined> => {
  let authResult = getSnapshot();
  if (authResult && (await AuthConnect.isAccessTokenExpired(authResult))) {
    authResult = await performRefresh(authResult);
  }

  return authResult;
};

const getAccessToken = async (): Promise<string | void> => {
  const authResult = await getAuthResult();
  return authResult?.accessToken;
};

const isAuthenticated = async (): Promise<boolean> => {
  return !!(await getAuthResult());
};

const login = async (): Promise<void> => {
  const authResult = await AuthConnect.login(provider, options);
  await setSession(authResult);
};

const logout = async (): Promise<void> => {
  const authResult = getSnapshot();
  if (authResult) {
    await AuthConnect.logout(provider, authResult);
    await clearSession();
  }
};

const getUserEmail = async (): Promise<string | void> => {
  const authResult = getSnapshot();
  if (authResult) {
    const { email } = (await AuthConnect.decodeToken(TokenType.id, authResult)) as { email?: string };
    return email;
  }
};

export { getAccessToken, getUserEmail, isAuthenticated, login, logout, setupAuthConnect };
