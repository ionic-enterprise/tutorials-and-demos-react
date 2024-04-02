// NOTE: Helper methods to store data for use with useSyncExternalStore hook
//       This should be replaced by the specific state management strategy used within your own application
//       https://react.dev/reference/react/useSyncExternalStore
interface AuthenticationState {
  isAuthenticated?: boolean;
}

let data: AuthenticationState = {};
const subscribers = new Set<() => void>();

export const setState = (update: Partial<AuthenticationState>): void => {
  data = Object.freeze({ ...data, ...update });
  subscribers.forEach((notify) => notify());
};

export const getSnapshot = (): AuthenticationState => data;
export const subscribe = (notify: () => void): (() => void) => {
  subscribers.add(notify);
  return () => subscribers.delete(notify);
};
