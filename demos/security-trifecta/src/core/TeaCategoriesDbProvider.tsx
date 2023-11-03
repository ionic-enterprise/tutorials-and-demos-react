import { ReactNode, createContext, useContext } from 'react';
import { useDatabase } from './DatabaseProvider';
import { Tea } from '../models/Tea';

type Props = { children?: ReactNode };
type Context = {
  getAllCategories: () => Promise<Array<Tea>>;
  upsertCategory: (cat: Tea) => Promise<void>;
  trimCategory: (idsToKeep: Array<number>) => Promise<void>;
};

const TeaCategoriesContext = createContext<Context | undefined>(undefined);

const TeaCategoriesDbProvider: React.FC<Props> = ({ children }) => {
  const { db, getDb } = useDatabase();

  const getAllCategories = async (): Promise<Array<Tea>> => {
    const cats: Array<Tea> = [];
    const handle = await getDb();
    if (handle) {
      try {
        await handle.transaction((tx) =>
          tx.executeSql(
            'SELECT id, name, description FROM TeaCategories ORDER BY name',
            [],
            // tslint:disable-next-line:variable-name
            (_t: any, r: any) => {
              for (let i = 0; i < r.rows.length; i++) {
                cats.push(r.rows.item(i));
              }
            },
          ),
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
            () => {
              null;
            },
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

  const trimCategory = async (idsToKeep: Array<number>): Promise<void> => {
    const handle = await getDb();
    if (handle) {
      try {
        await handle.transaction((tx) => {
          tx.executeSql(
            `DELETE FROM TeaCategories WHERE id not in (${params(idsToKeep.length)})`,
            [...idsToKeep],
            () => {
              null;
            },
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
