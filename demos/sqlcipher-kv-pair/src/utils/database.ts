import { getDatabaseKey } from './encryption-keys';
import { DbTransaction, SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { Capacitor } from '@capacitor/core';

let handle: SQLiteObject | null = null;

const openDatabase = async (): Promise<SQLiteObject | null> => {
  if (Capacitor.isNativePlatform()) {
    const key = getDatabaseKey();
    if (key) {
      return SQLite.create({
        name: 'emailcache.db',
        location: 'default',
        key,
      });
    }
  }
  return null;
};

const createTables = (transaction: DbTransaction): void => {
  transaction.executeSql(
    'CREATE TABLE IF NOT EXISTS KeyValuePairs (id TEXT, collection TEXT, value TEXT, PRIMARY KEY (id, collection))',
  );
};

export const getHandle = async (): Promise<SQLiteObject | null> => {
  if (!handle) {
    handle = await openDatabase();
    if (handle) {
      handle.transaction((tx: DbTransaction) => createTables(tx));
    }
  }
  return handle;
};
