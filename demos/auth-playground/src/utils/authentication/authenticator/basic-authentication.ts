import { Authenticator } from '@/utils/authentication/authenticator';
import { client } from '@/utils/backend-api';
import { getValue, setValue, clear } from '@/utils/session-storage/session-vault';
import { Session } from '@/models';

type BasicAuthResult = { success: boolean } & Session;

export class BasicAuthenticationService implements Authenticator {
  private key = 'session';

  async login(email: string, password: string): Promise<void> {
    const response = await client.post<BasicAuthResult>('/login', { username: email, password });
    const { success, ...session } = response.data;

    if (success) {
      await setValue<Session>(this.key, session);
    } else {
      return Promise.reject(new Error('Login Failed'));
    }
  }

  async logout(): Promise<void> {
    await client.post('/logout', {});
    await clear();
  }

  async removeSession(): Promise<void> {
    await clear();
  }

  async getAccessToken(): Promise<string | undefined> {
    const session = await getValue<Session>(this.key);
    return session?.token;
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.getAccessToken());
  }
}
