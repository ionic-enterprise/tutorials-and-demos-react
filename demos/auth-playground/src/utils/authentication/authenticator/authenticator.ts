export interface Authenticator {
  login(email?: string, password?: string): Promise<void>;
  logout(): Promise<void>;
  removeSession(): Promise<void>;
  getAccessToken(): Promise<string | undefined>;
  isAuthenticated(): Promise<boolean>;
}
