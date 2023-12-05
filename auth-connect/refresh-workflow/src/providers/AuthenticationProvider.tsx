import { PropsWithChildren, createContext, useEffect, useState, useSyncExternalStore } from 'react';
import { setupAuthConnect } from '../utils/authentication';
import { IonSpinner } from '@ionic/react';
import { getSnapshot, subscribe } from '../utils/session-store';

type Context = {
  isAuthenticated: boolean;
};

export const AuthenticationContext = createContext<Context>({
  isAuthenticated: false,
});

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const session = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    setupAuthConnect().then(() => setIsSetup(true));
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!session);
  }, [session]);

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated }}>
      {isSetup ? children : <IonSpinner />}
    </AuthenticationContext.Provider>
  );
};
