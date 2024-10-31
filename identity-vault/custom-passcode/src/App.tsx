import { IonApp, IonModal, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import { useEffect, useRef, useState } from 'react';
import { Route } from 'react-router-dom';
import PinDialog from './components/PinDialog';
import Tabs from './components/Tabs';
import Login from './pages/Login';
import Start from './pages/Start';
import Unlock from './pages/Unlock';
import './theme/variables.css';
import { addOnPasscodeRequested, removeOnPasscodeRequested } from './util/session-vault';

setupIonicReact();

const App: React.FC = () => {
  const [showPinDialog, setShowPinDialog] = useState<boolean>(false);
  const passcodeSetRequest = useRef<boolean>(true);
  const passcodeCallback = useRef<((code: string) => void) | null>(null);

  useEffect(() => {
    const onPasscodeRequested = (isPasscodeSetRequest: boolean, onComplete: (code: string) => void) => {
      passcodeSetRequest.current = isPasscodeSetRequest;
      passcodeCallback.current = onComplete;
      setShowPinDialog(true);
    };
    addOnPasscodeRequested(onPasscodeRequested);
    return removeOnPasscodeRequested;
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonModal isOpen={showPinDialog} backdropDismiss={false}>
          <PinDialog
            setPasscodeMode={passcodeSetRequest.current}
            onDismiss={(code: string | null) => {
              if (passcodeCallback.current) {
                passcodeCallback.current(code || '');
              }
              setShowPinDialog(false);
            }}
          />
        </IonModal>

        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Start />
          </Route>
          <Route exact path="/unlock">
            <Unlock />
          </Route>
          <Route path="/tabs">
            <Tabs />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
