import { Capacitor } from '@capacitor/core';
import { DbTransaction, SQLite, SQLiteObject } from '@ionic-enterprise/secure-storage';
import { ReactNode, createContext, useContext, useState } from 'react';
import { getDatabaseKey } from '../utils/encryption';

interface Props {
  children?: ReactNode;
}
interface Context {
  db: SQLiteObject | undefined;
  getDb: () => Promise<SQLiteObject | undefined>;
}

interface Column {
  name: string;
  type: string;
}

const DatabaseContext = createContext<Context | undefined>(undefined);

const DatabaseProvider = ({ children }: Props) => {
  const [db, setDb] = useState<SQLiteObject>();

  const initializeDB = async (): Promise<SQLiteObject | undefined> => {
    if (Capacitor.isNativePlatform()) {
      const key = await getDatabaseKey();
      if (key) {
        try {
          const newDb = await SQLite.create({
            name: 'teaisforme.db',
            location: 'default',
            key,
          });
          setDb(newDb);

          await newDb.transaction((tx) => createTables(tx));
          return newDb;
        } catch (e) {
          console.log(e);
          return undefined;
        }
      }
    }
  };

  const createTableSql = (name: string, columns: Column[]): string => {
    let cols = '';
    columns.forEach((c, i) => {
      cols += `${i ? ', ' : ''}${c.name} ${c.type}`;
    });

    return `CREATE TABLE IF NOT EXISTS ${name} (${cols})`;
  };

  const createTables = (transaction: DbTransaction): void => {
    const id = { name: 'id', type: 'INTEGER PRIMARY KEY' };
    const name = { name: 'name', type: 'TEXT' };
    const description = { name: 'description', type: 'TEXT' };
    const syncStatus = { name: 'syncStatus', type: 'TEXT' };
    try {
      transaction.executeSql(createTableSql('TeaCategories', [id, name, description]));
      transaction.executeSql(
        createTableSql('TastingNotes', [
          id,
          name,
          { name: 'brand', type: 'TEXT' },
          { name: 'notes', type: 'TEXT' },
          { name: 'rating', type: 'INTEGER' },
          { name: 'teaCategoryId', type: 'INTEGER' },
          { name: 'userEmail', type: 'TEXT' },
          syncStatus,
        ]),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getDb = async (): Promise<SQLiteObject | undefined> => {
    if (db == undefined) {
      const newDb = await initializeDB();
      if (newDb !== undefined) return newDb;
    }
    return db;
  };

  return <DatabaseContext.Provider value={{ db, getDb }}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) throw new Error('useDatabase must be used within DatabaseProvider');
  return context;
};

export default DatabaseProvider;
