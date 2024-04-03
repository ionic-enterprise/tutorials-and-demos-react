// NOTE: Helper methods to store data for use with useSyncExternalStore hook

import { useSyncExternalStore } from 'react';

//       This should be replaced by the specific state management strategy used within your own application
interface AuthenticationState {
  isAuthenticated?: boolean;
}

let data: AuthenticationState = {};
const subscribers = new Set<() => void>();

export const setState = (update: Partial<AuthenticationState>): void => {
  data = Object.freeze({ ...data, ...update });
  subscribers.forEach((notify) => notify());
};

const getSnapshot = (): AuthenticationState => data;
const subscribe = (notify: () => void): (() => void) => {
  subscribers.add(notify);
  return () => subscribers.delete(notify);
};

// https://react.dev/reference/react/useSyncExternalStore
export const useAuthentication = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};
