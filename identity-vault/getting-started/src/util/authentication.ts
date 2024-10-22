import { clearSession, restoreSession, storeSession } from './session-vault';

export const login = (): Promise<void> =>
  storeSession({
    email: 'test@ionic.io',
    firstName: 'Tessa',
    lastName: 'Testsmith',
    accessToken: '4abf1d79-143c-4b89-b478-19607eb5ce97',
    refreshToken: '565111b6-66c3-4527-9238-6ea2cc017126',
  });

export const logout = (): Promise<void> => clearSession();

export const isAuthenticated = async (): Promise<boolean> => {
  return !!(await restoreSession());
};
