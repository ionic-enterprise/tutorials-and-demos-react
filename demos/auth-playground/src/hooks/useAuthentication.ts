import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from '@/utils/authentication';

export const useAuthentication = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};
