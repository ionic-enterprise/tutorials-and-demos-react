import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from './session-vault';

const useAuth = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};

export default useAuth;
