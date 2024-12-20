import { AuthResult } from '@ionic-enterprise/auth';
import { Preferences } from '@capacitor/preferences';

let session: AuthResult | null = null;
let listeners: (() => void)[] = [];

const subscribe = (listener: () => void) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = (): AuthResult | null => {
  return session;
};

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const setSession = async (newSession: AuthResult | null) => {
  session = newSession;
  await Preferences.set({ key: 'session', value: JSON.stringify(newSession) });
  emitChange();
};

const initialize = async (): Promise<void> => {
  const { value } = await Preferences.get({ key: 'session' });
  if (value) {
    session = JSON.parse(value);
  }
};

export { initialize, subscribe, getSnapshot, setSession };
