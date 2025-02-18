import { getHandle } from './database';
import { KeyValuePair, KeyValueKey, KeyValueCollection } from './kv-types';

export const clear = async (collection: KeyValueCollection): Promise<void> => {
  const handle = await getHandle();
  if (handle) {
    await handle.transaction((tx) => {
      tx.executeSql('DELETE FROM KeyValuePairs WHERE collection = ?', [collection], () => {});
    });
  }
};

export const getAll = async (collection: KeyValueCollection): Promise<KeyValuePair[]> => {
  const kvPairs: { key: any; value: any }[] = [];
  const handle = await getHandle();
  if (handle) {
    await handle.transaction((tx) =>
      tx.executeSql(
        `SELECT id, value FROM KeyValuePairs WHERE collection = ? ORDER BY id`,
        [collection],
        (_t: any, r: any) => {
          for (let i = 0; i < r.rows.length; i++) {
            const { id, value } = r.rows.item(i);
            kvPairs.push({ key: JSON.parse(id), value: JSON.parse(value) });
          }
        },
      ),
    );
  }
  return kvPairs;
};

export const getValue = async (collection: KeyValueCollection, key: KeyValueKey): Promise<any | undefined> => {
  let value: any = undefined;
  const handle = await getHandle();
  if (handle) {
    await handle.transaction((tx) =>
      tx.executeSql(
        `SELECT value FROM KeyValuePairs WHERE id = ? AND collection = ?`,
        [JSON.stringify(key), collection],
        (_t: any, r: any) => {
          if (r.rows.length) {
            value = JSON.parse(r.rows.item(0).value);
          }
        },
      ),
    );
  }
  return value;
};

export const removeValue = async (collection: KeyValueCollection, key: KeyValueKey): Promise<void> => {
  const handle = await getHandle();
  if (handle) {
    await handle.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM KeyValuePairs WHERE id = ? AND collection = ?',
        [JSON.stringify(key), collection],
        () => {},
      );
    });
  }
};

export const setValue = async (collection: KeyValueCollection, key: KeyValueKey, value: any): Promise<void> => {
  const handle = await getHandle();
  if (handle) {
    await handle.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO KeyValuePairs (id, collection, value) VALUES (?, ?, ?)' +
          ' ON CONFLICT(id, collection) DO' +
          ' UPDATE SET value = ?' +
          ' WHERE id = ?' +
          ' AND collection = ?',
        [
          JSON.stringify(key),
          collection,
          JSON.stringify(value),
          JSON.stringify(value),
          JSON.stringify(key),
          collection,
        ],
        () => {},
      );
    });
  }
};

export const getKeys = async (collection: KeyValueCollection): Promise<KeyValueKey[]> => {
  const keys: KeyValueKey[] = [];
  const handle = await getHandle();
  if (handle) {
    await handle.transaction((tx) =>
      tx.executeSql(
        `SELECT id FROM KeyValuePairs WHERE collection = ? ORDER BY id`,
        [collection],
        (_t: any, r: any) => {
          for (let i = 0; i < r.rows.length; i++) {
            const { id } = r.rows.item(i);
            keys.push(JSON.parse(id));
          }
        },
      ),
    );
  }
  return keys;
};
