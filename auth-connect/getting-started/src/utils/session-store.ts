import { AuthResult } from '@ionic-enterprise/auth';
import { Preferences } from '@capacitor/preferences';

let session: AuthResult | null = null;
let listeners: any[] = [];

const subscribe = (listener: any) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = (): AuthResult | null => {
  return session;
};

const emitChange = () => {
  for (let listener of listeners) {
    listener();
  }
};

const setSession = async (newSession: AuthResult | null) => {
  session = newSession;
  await Preferences.set({ key: 'session', value: JSON.stringify(newSession) });
  emitChange();
};

Preferences.get({ key: 'session' }).then((result) => {
  if (result.value) {
    session = JSON.parse(result.value);
    emitChange();
  }
});

export { subscribe, getSnapshot, setSession };
