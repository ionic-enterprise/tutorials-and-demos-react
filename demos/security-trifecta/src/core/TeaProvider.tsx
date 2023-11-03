import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Tea } from '../models/Tea';
import { client } from '../utils/backend-api';
import { isPlatform } from '@ionic/react';
import { useTastingNotesDatabase } from './TastingNotesDbProvider';
import { useCompare } from '../utils/compare';
import { useTeaCategoriesDatabase } from './TeaCategoriesDbProvider';

type Props = { children?: ReactNode };
type Context = {
  teas: Tea[];
  teaCategories: Tea[];
  rate: (id: number, rating: number) => Promise<void>;
  refresh: () => Promise<void>;
  saveTea: (tea: Tea) => Promise<Tea>;
  remove: (tea: Tea) => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshTastingNotes: () => Promise<void>;
  syncTeas: () => Promise<void>;
};

const TeaContext = createContext<Context | undefined>(undefined);

const TeaProvider: React.FC<Props> = ({ children }) => {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [teaCategories, setTeaCategories] = useState<Tea[]>([]);
  const { getAll, trim, upsert, save, reset } = useTastingNotesDatabase();
  const { getAllCategories, upsertCategory } = useTeaCategoriesDatabase();
  const { byBrandAndName, byName } = useCompare();

  const loadCategoriesAPI = async () => {
    const { data } = await client.get('/tea-categories');

    return data.sort(byName);
  };

  const loadCategories = async () => {
    if (isPlatform('hybrid')) {
      const cats = await loadCategoriesAPI();
      setTeaCategories(cats);
      await trim(cats.map((cat: Tea) => cat.id));
      const upserts: Array<Promise<any>> = cats.map((cat: Tea) => upsertCategory(cat));
      await Promise.all(upserts);
    } else {
      const cats = await loadCategoriesAPI();
      setTeaCategories(cats);
    }
  };

  const refreshCategories = async (): Promise<void> => {
    if (isPlatform('hybrid')) {
      const cats = await getAllCategories();
      setTeaCategories(cats);
    } else {
      const cats = await loadCategoriesAPI();
      setTeaCategories(cats);
    }
  };

  const loadTastingNoteAPI = async (): Promise<Tea[]> => {
    const { data } = await client.get('/user-tasting-notes');
    return data.sort(byBrandAndName);
  };

  const loadTastingNotes = async () => {
    const loadedTeas = await loadTastingNoteAPI();

    if (isPlatform('hybrid')) {
      await trim(loadedTeas.map((x: Tea) => x.id as number));
      const upserts: Array<Promise<any>> = loadedTeas.map((tea: Tea) => upsert(tea));
      await Promise.all(upserts);
    }

    setTeas(loadedTeas);
  };

  const rate = async () => {
    throw new Error('Method not implemeneted yet');
  };

  const refresh = async () => {
    await refreshCategories();
    await refreshTastingNotes();
  };

  const refreshTastingNotes = async (): Promise<void> => {
    if (isPlatform('hybrid')) {
      const notes = await getAll();
      setTeas(notes);
    } else {
      const notes = await loadTastingNoteAPI();
      setTeas(notes);
    }
  };

  const saveAPI = async (tea: Tea): Promise<Tea> => {
    const url = '/user-tasting-notes' + (tea.id ? `/${tea.id}` : '');
    const { data } = await client.post(url, tea);
    return data;
  };

  const saveTea = async (tea: Tea): Promise<Tea> => {
    const savedTea = isPlatform('hybrid') ? await save(tea) : await saveAPI(tea);

    const newTeas = teas;
    const index = newTeas.findIndex((t) => t.id === savedTea.id);

    if (index > -1) {
      newTeas[index] = savedTea;
    } else {
      newTeas.push(savedTea);
    }

    setTeas(newTeas);

    return savedTea;
  };

  const syncTeas = async (): Promise<void> => {
    const notes = await getAll(true);
    const calls: Array<Promise<any>> = [];

    notes.forEach((note: Tea) => {
      if (note.syncStatus === 'UPDATE') {
        calls.push(saveAPI(note));
      }
      if (note.syncStatus === 'INSERT') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...n } = note;
        calls.push(saveAPI(n));
      }
      if (note.syncStatus === 'DELETE') {
        calls.push(removeAPI(note));
      }
    });

    await Promise.all(calls);
    await reset();
    await loadTastingNotes();
  };

  const removeAPI = async (tea: Tea) => {
    const url = `/user-tasting-notes/${tea.id}`;
    await client.delete(url);
    loadTastingNotes();
  };

  const remove = async (tea: Tea) => {
    removeAPI(tea);
  };

  const initialize = async () => {
    if (isPlatform('hybrid')) await syncTeas();
    await loadCategories();
    await loadTastingNotes();
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <TeaContext.Provider
      value={{ teas, rate, refresh, teaCategories, saveTea, remove, syncTeas, refreshCategories, refreshTastingNotes }}
    >
      {children}
    </TeaContext.Provider>
  );
};

export const useTea = () => {
  const context = useContext(TeaContext);
  if (context === undefined) throw new Error('useTea must be used within TeaProvider');
  return context;
};

export default TeaProvider;
