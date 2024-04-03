// NOTE: Simple and generic data store for React application to be notified of AuthenticationState changes
//       This should be replaced by a state management strategy specific to your own application

import { useSyncExternalStore } from 'react';

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
