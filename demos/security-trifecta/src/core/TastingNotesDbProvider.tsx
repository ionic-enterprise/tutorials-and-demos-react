/* eslint @typescript-eslint/no-explicit-any: off, @typescript-eslint/no-empty-function: off */
import { ReactNode, createContext, useContext } from 'react';
import { useDatabase } from './DatabaseProvider';
import { getUserEmail } from '../utils/auth';
import { Tea } from '../models/Tea';

interface Props {
  children?: ReactNode;
}
interface Context {
  getAll: (includeDeleted?: boolean) => Promise<Tea[]>;
  reset: () => Promise<void>;
  remove: (note: Tea) => Promise<void>;
  trim: (idsToKeep: number[]) => Promise<void>;
  save: (note: Tea) => Promise<Tea>;
  upsert: (note: Tea) => Promise<void>;
}

const TastingNotesDbContext = createContext<Context | undefined>(undefined);

const TastingNotesDbProvider = ({ children }: Props) => {
  const { getDb } = useDatabase();

  const getAll = async (includeDeleted = false): Promise<Tea[]> => {
    const notes: Tea[] = [];
    const handle = await getDb();
    if (handle) {
      const email = await getUserEmail();
      if (email) {
        const predicate = includeDeleted
          ? 'userEmail = ? ORDER BY brand, name'
          : "coalesce(syncStatus, '') != 'DELETE' AND userEmail = ? ORDER BY brand, name";
        await handle.transaction((tx) =>
          tx.executeSql(
            `SELECT id, name, brand, notes, rating, teaCategoryId, syncStatus FROM TastingNotes WHERE ${predicate}`,
            [email],
            (_t: any, r: any) => {
              for (let i = 0; i < r.rows.length; i++) {
                notes.push(r.rows.item(i));
              }
            },
          ),
        );
      }
    }
    return notes;
  };

  const reset = async (): Promise<void> => {
    const handle = await getDb();
    if (handle) {
      const email = await getUserEmail();
      if (email) {
        try {
          await handle.transaction((tx) => {
            tx.executeSql(
              "UPDATE TastingNotes SET syncStatus = null WHERE syncStatus = 'UPDATE' AND userEmail = ?",
              [email],
              () => {},
            );
            tx.executeSql(
              "DELETE FROM TastingNotes WHERE syncStatus in ('DELETE', 'INSERT') AND userEmail = ?",
              [email],
              () => {},
            );
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const remove = async (note: Tea): Promise<void> => {
    const handle = await getDb();
    if (handle) {
      const email = await getUserEmail();
      if (email) {
        try {
          await handle.transaction((tx) => {
            tx.executeSql(
              "UPDATE TastingNotes SET syncStatus = 'DELETE' WHERE userEmail = ? AND id = ?",
              [email, note.id],
              () => {},
            );
          });
        } catch (e) {
          console.log(e);
        }
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

  const trim = async (idsToKeep: number[]): Promise<void> => {
    const handle = await getDb();
    if (handle) {
      const email = await getUserEmail();
      if (email) {
        try {
          await handle.transaction((tx) => {
            tx.executeSql(
              `DELETE FROM TastingNotes WHERE userEmail = ? AND id not in (${params(idsToKeep.length)})`,
              [email, ...idsToKeep],
              () => {},
            );
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const add = async (note: Tea): Promise<Tea | undefined> => {
    const handle = await getDb();
    if (handle) {
      const email = await getUserEmail();
      if (email) {
        await handle.transaction((tx) => {
          console.log('tx', tx);
          tx.executeSql('SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM TastingNotes', [], (_t: any, r: any) => {
            note.id = r.rows.item(0).newId;
            tx.executeSql(
              'INSERT INTO TastingNotes (id, name, brand, notes, rating, teaCategoryId, userEmail, syncStatus)' +
                " VALUES (?, ?, ?, ?, ?, ?, ?, 'INSERT')",
              [note.id, note.name, note.brand, note.notes, note.rating, note.teaCategoryId, email],
              () => {},
            );
          });
        });
      }
      note.syncStatus = 'INSERT';
      return note;
    }
  };

  const update = async (note: Tea): Promise<Tea | undefined> => {
    const handle = await getDb();
    if (handle) {
      const email = await getUserEmail();
      if (email) {
        await handle.transaction((tx) => {
          tx.executeSql(
            'UPDATE TastingNotes SET name = ?, brand = ?, notes = ?, rating = ?, teaCategoryId = ?,' +
              " syncStatus = CASE syncStatus WHEN 'INSERT' THEN 'INSERT' else 'UPDATE' end" +
              ' WHERE userEmail = ? AND id = ?',
            [note.name, note.brand, note.notes, note.rating, note.teaCategoryId, email, note.id],
            () => {},
          );
        });
      }
      return note;
    }
  };

  const save = async (note: Tea): Promise<Tea> => {
    return (await (note.id ? update(note) : add(note))) || note;
  };

  const upsert = async (note: Tea): Promise<void> => {
    const handle = await getDb();
    if (handle) {
      const email = await getUserEmail();
      if (email) {
        try {
          await handle.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO TastingNotes (id, name, brand, notes, rating, teaCategoryId, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?)' +
                ' ON CONFLICT(id) DO' +
                ' UPDATE SET name = ?, brand = ?, notes = ?, rating = ?, teaCategoryId = ?' +
                ' WHERE syncStatus is NULL AND userEmail = ? AND id = ?',
              [
                note.id,
                note.name,
                note.brand,
                note.notes,
                note.rating,
                note.teaCategoryId,
                email,
                note.name,
                note.brand,
                note.notes,
                note.rating,
                note.teaCategoryId,
                email,
                note.id,
              ],
              () => {},
            );
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  return (
    <TastingNotesDbContext.Provider value={{ getAll, reset, remove, trim, save, upsert }}>
      {children}
    </TastingNotesDbContext.Provider>
  );
};

export const useTastingNotesDatabase = () => {
  const context = useContext(TastingNotesDbContext);
  if (context === undefined) throw new Error('useTastingNotesDatabase must be used withing a TastingNotesDbProvider');
  return context;
};

export default TastingNotesDbProvider;
