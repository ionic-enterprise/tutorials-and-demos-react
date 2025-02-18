import { KeyValuePair, KeyValueKey, KeyValueCollection } from './kv-types';

const initialize = (): Promise<IDBDatabase> => {
  const request = indexedDB.open('web-kv-store', 1);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event as any).target.result as IDBDatabase;
    db.onerror = (evt: unknown) => console.error('Error in indexDB KV store', evt);
    db.createObjectStore('inbox', { keyPath: 'key' });
  };

  return new Promise((resolve, reject) => {
    request.onerror = (evt: unknown) => reject(evt);
    request.onsuccess = (evt: any) => {
      resolve(evt.target.result as IDBDatabase);
    };
  });
};

const dbInstance = initialize();

export const clear = async (collection: KeyValueCollection): Promise<void> => {
  const db = await dbInstance;
  return new Promise((resolve) => {
    const dataObjectStore = db.transaction(collection, 'readwrite').objectStore(collection);
    const req = dataObjectStore.clear();
    req.onsuccess = () => resolve();
  });
};

export const getAll = async (collection: KeyValueCollection): Promise<KeyValuePair[]> => {
  const db = await dbInstance;
  return new Promise((resolve) => {
    const dataObjectStore = db.transaction(collection, 'readonly').objectStore(collection);
    const req = dataObjectStore.getAll();
    req.onsuccess = (evt: any) => resolve(evt.target.result || []);
  });
};

export const getValue = async (collection: KeyValueCollection, key: KeyValueKey): Promise<any | undefined> => {
  const db = await dbInstance;
  return new Promise((resolve) => {
    const dataObjectStore = db.transaction(collection, 'readonly').objectStore(collection);
    const req = dataObjectStore.get(key);
    req.onsuccess = (evt: any) => resolve(evt.target.result?.value);
  });
};

export const removeValue = async (collection: KeyValueCollection, key: KeyValueKey): Promise<void> => {
  const db = await dbInstance;
  return new Promise((resolve) => {
    const dataObjectStore = db.transaction(collection, 'readwrite').objectStore(collection);
    const req = dataObjectStore.delete(key);
    req.onsuccess = () => resolve();
  });
};

export const setValue = async (collection: KeyValueCollection, key: KeyValueKey, value: any): Promise<void> => {
  const db = await dbInstance;
  return new Promise((resolve) => {
    const dataObjectStore = db.transaction(collection, 'readwrite').objectStore(collection);
    const req = dataObjectStore.put({ key, value });
    req.onsuccess = () => resolve();
  });
};

export const getKeys = async (collection: KeyValueCollection): Promise<KeyValueKey[]> => {
  const db = await dbInstance;
  return new Promise((resolve) => {
    const dataObjectStore = db.transaction(collection, 'readonly').objectStore(collection);
    const req = dataObjectStore.getAllKeys();
    req.onsuccess = (evt: any) => resolve(evt.target.result);
  });
};
