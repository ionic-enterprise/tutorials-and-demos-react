import { useSyncExternalStore } from 'react';
import { Session } from '../models/Session';

interface SessionState {
  session?: Session | null;
}

let data: SessionState = {};
const getSnapshot = (): SessionState => data;

const subscribers = new Set<() => void>();
const subscribe = (notify: () => void): (() => void) => {
  subscribers.add(notify);
  return () => subscribers.delete(notify);
};

export const setState = (update: Partial<SessionState>): void => {
  data = Object.freeze({ ...data, ...update });
  subscribers.forEach((notify) => notify());
};

export const useSession = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};
