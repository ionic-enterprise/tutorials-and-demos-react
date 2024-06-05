import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from './session-vault';

const useSession = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};

export default useSession;
