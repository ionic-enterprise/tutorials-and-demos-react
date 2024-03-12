import { ReactNode, createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { IonSpinner, useIonModal } from '@ionic/react';
import { AuthResult } from '@ionic-enterprise/auth';
import { getSnapshot, registerCallback, subscribe, unregisterCallback } from '../utils/session-vault';
import { setupAuthConnect } from '../utils/auth';
import { PinDialog } from '../pages/PinDialog/PinDialog';
import { useHistory } from 'react-router';

type Props = { children?: ReactNode };
type Context = { session?: AuthResult };
type CustomPasscodeCallback = (opts: { data: any; role?: string }) => void;

let handlePasscodeRequest: CustomPasscodeCallback = () => {};

const AuthContext = createContext<Context | undefined>(undefined);
const AuthProvider = ({ children }: Props) => {
  const history = useHistory();
  const [isSetup, setIsSetup] = useState<boolean>(false);
  const [isSetPasscodeMode, setIsSetPasscodeMode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [present, dismiss] = useIonModal(PinDialog, {
    setPasscodeMode: isSetPasscodeMode,
    onDismiss: (opts: { data: any; role?: string }) => handlePasscodeRequest(opts),
  });

  const session = useSyncExternalStore(subscribe, getSnapshot);

  const handlePasscodeRequested = (isPasscodeSetRequest: boolean, onComplete: (code: string) => void): void => {
    handlePasscodeRequest = (opts) => {
      onComplete(opts.role === 'cancel' ? '' : opts.data);
      setIsSetPasscodeMode(false);
      setShowModal(false);
    };
    setIsSetPasscodeMode(isPasscodeSetRequest);
    setShowModal(true);
  };

  useEffect(() => {
    setupAuthConnect().then(() => setIsSetup(true));
  }, []);

  useEffect(() => {
    registerCallback('onPasscodeRequested', (isSetPasscodeMode, onComplete) =>
      handlePasscodeRequested(isSetPasscodeMode, onComplete),
    );

    registerCallback('onVaultLock', () => history.replace('/login'));

    return () => {
      unregisterCallback('onPasscodeRequested');
      unregisterCallback('onVaultLock');
    };
  }, []);

  useEffect(() => {
    showModal ? present() : dismiss();
  }, [showModal]);

  return <AuthContext.Provider value={{ session }}>{isSetup ? children : <IonSpinner />}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthProvider;
