import { getDatabaseKey } from './encryption';
import { isPlatform } from '@ionic/react';
import { useKeyValueStorage } from './key-value-storage';

const storage = useKeyValueStorage();
let isReady: Promise<void>;

const createDatabase = async (): Promise<void> => {
  const key = isPlatform('hybrid') ? await getDatabaseKey() : '';
  await storage.create(key || '');
};

const initialize = async (): Promise<void> => {
  if (!isReady) {
    isReady = createDatabase();
  }
  return isReady;
};

const getValue = async <T>(key: string): Promise<T> => {
  await initialize();
  return storage.get(key);
};

const setValue = async (key: string, value: unknown): Promise<void> => {
  await initialize();
  await storage.set(key, value);
};

export const useStorage = () => ({
  getValue,
  setValue,
});
