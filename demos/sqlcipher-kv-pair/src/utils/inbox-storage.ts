import { Capacitor } from '@capacitor/core';
import { KeyValueKey, KeyValuePair } from './kv-types';
import * as mobileKVStore from './mobile-kv-store';
import * as webKVStore from './web-kv-store';

const isMobile = Capacitor.isNativePlatform();

export const clear = async (): Promise<void> => (isMobile ? mobileKVStore.clear('inbox') : webKVStore.clear('inbox'));

export const getAll = async (): Promise<KeyValuePair[]> =>
  isMobile ? mobileKVStore.getAll('inbox') : webKVStore.getAll('inbox');

export const getValue = async (key: KeyValueKey): Promise<any | undefined> =>
  isMobile ? mobileKVStore.getValue('inbox', key) : webKVStore.getValue('inbox', key);

export const removeValue = async (key: KeyValueKey): Promise<void> =>
  isMobile ? mobileKVStore.removeValue('inbox', key) : webKVStore.removeValue('inbox', key);

export const setValue = async (key: KeyValueKey, value: any): Promise<void> =>
  isMobile ? mobileKVStore.setValue('inbox', key, value) : webKVStore.setValue('inbox', key, value);

export const getKeys = async (): Promise<KeyValueKey[]> =>
  isMobile ? mobileKVStore.getKeys('inbox') : webKVStore.getKeys('inbox');
