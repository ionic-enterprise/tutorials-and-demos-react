import { Preferences } from '@capacitor/preferences';
import { AuthVendor } from '@/models/AuthVendor';
import {
  Authenticator,
  BasicAuthenticationService,
  OIDCAuthenticationService,
} from '@/utils/authentication/authenticator';
import { setState } from '@/utils/authentication/store';

const key = 'AuthVendor';
let authService: Authenticator | undefined;
let oidcAuthService: OIDCAuthenticationService | undefined;
let basicAuthService: BasicAuthenticationService | undefined;

const setupAuthService = (vendor: AuthVendor): void => {
  switch (vendor) {
    case 'Basic': {
      if (!basicAuthService) {
        basicAuthService = new BasicAuthenticationService();
      }
      authService = basicAuthService;
      break;
    }

    case 'Auth0':
    case 'AWS':
    case 'Azure': {
      if (!oidcAuthService) {
        oidcAuthService = new OIDCAuthenticationService();
      }
      oidcAuthService.setAuthProvider(vendor);
      authService = oidcAuthService;
      break;
    }

    default: {
      console.error(`Invalid auth provider: ${vendor}`);
      break;
    }
  }
};

export const initializeAuthService = async (): Promise<void> => {
  if (!authService) {
    const { value } = await Preferences.get({ key });
    if (value) {
      setupAuthService(value as AuthVendor);
    }
  }
};

export const login = async (provider: AuthVendor, username?: string, password?: string): Promise<void> => {
  setupAuthService(provider);
  await Preferences.set({ key, value: provider });
  await authService?.login(username, password);
  setState({ isAuthenticated: true });
};

export const logout = async (): Promise<void> => {
  await authService?.logout();
  setState({ isAuthenticated: false });
  authService = undefined;
};

export const getAccessToken = async (): Promise<string | undefined> => {
  return authService?.getAccessToken();
};

export const removeSession = async (): Promise<void> => {
  await authService?.removeSession();
  setState({ isAuthenticated: false });
  authService = undefined;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const result = authService ? await authService.isAuthenticated() : false;
  setState({ isAuthenticated: result });
  return result;
};
