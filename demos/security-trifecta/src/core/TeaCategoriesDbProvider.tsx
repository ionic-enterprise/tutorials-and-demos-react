/* eslint @typescript-eslint/no-explicit-any: off, @typescript-eslint/no-empty-function: off */
import { ReactNode, createContext, useContext } from 'react';
import { useDatabase } from './DatabaseProvider';
import { Tea } from '../models/Tea';

interface Props {
  children?: ReactNode;
}
interface Context {
  getAllCategories: () => Promise<Tea[]>;
  upsertCategory: (cat: Tea) => Promise<void>;
  trimCategory: (idsToKeep: number[]) => Promise<void>;
}

const TeaCategoriesContext = createContext<Context | undefined>(undefined);

const TeaCategoriesDbProvider = ({ children }: Props) => {
  const { getDb } = useDatabase();

  const getAllCategories = async (): Promise<Tea[]> => {
    const cats: Tea[] = [];
    const handle = await getDb();
    if (handle) {
      try {
        await handle.transaction((tx) =>
          tx.executeSql('SELECT id, name, description FROM TeaCategories ORDER BY name', [], (_t: any, r: any) => {
            for (let i = 0; i < r.rows.length; i++) {
              cats.push(r.rows.item(i));
            }
          }),
        );
      } catch (e) {
        console.log(e);
      }
    }
    return cats;
  };

  const upsertCategory = async (cat: Tea): Promise<void> => {
    const handle = await getDb();
    if (handle) {
      try {
        await handle.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO TeaCategories (id, name, description) VALUES (?, ?, ?)' +
              ' ON CONFLICT(id) DO' +
              ' UPDATE SET name = ?, description = ? where id = ?',
            [cat.id, cat.name, cat.description, cat.name, cat.description, cat.id],
            () => {},
          );
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const params = (length: number): string => {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += `${i ? ', ' : ''}?`;
    }
    return str;
  };

  const trimCategory = async (idsToKeep: number[]): Promise<void> => {
    const handle = await getDb();
    if (handle) {
      try {
        await handle.transaction((tx) => {
          tx.executeSql(
            `DELETE FROM TeaCategories WHERE id not in (${params(idsToKeep.length)})`,
            [...idsToKeep],
            () => {},
          );
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <TeaCategoriesContext.Provider value={{ getAllCategories, upsertCategory, trimCategory }}>
      {children}
    </TeaCategoriesContext.Provider>
  );
};

export const useTeaCategoriesDatabase = () => {
  const context = useContext(TeaCategoriesContext);
  if (context === undefined) throw new Error('useTeaCategoriesDatabase must be used withing a TastingNotesDbProvider');
  return context;
};

export default TeaCategoriesDbProvider;
