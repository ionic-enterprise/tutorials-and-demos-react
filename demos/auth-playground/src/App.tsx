import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import '@/theme/variables.css';
import '@/theme/global.css';
import '@/theme/custom-colors.css';

import StartPage from '@/pages/start/StartPage';
import LoginPage from '@/pages/login/LoginPage';
import AuthActionCompletePage from '@/pages/auth-action-complete/AuthActionCompletePage';
import UnlockPage from '@/pages/unlock/UnlockPage';
import Tabs from '@/routes/Tabs';
import PrivateRoute from '@/routes/PrivateRoute';
import AppInitializer from '@/components/AppInitializer';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppInitializer>
        <IonRouterOutlet>
          <Route exact path="/">
            <StartPage />
          </Route>
          <Route exact path="/unlock">
            <UnlockPage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/auth-action-complete">
            <AuthActionCompletePage />
          </Route>
          <PrivateRoute path="/tabs" redirectPath="/login">
            <Tabs />
          </PrivateRoute>
        </IonRouterOutlet>
      </AppInitializer>
    </IonReactRouter>
  </IonApp>
);

export default App;
