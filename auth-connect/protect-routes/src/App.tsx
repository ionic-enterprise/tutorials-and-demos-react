import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import AuthActionCompletePage from './pages/AuthActionCompletePage';
import { AuthenticationProvider } from './providers/AuthenticationProvider';

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

/* Theme variables */
import LoginPage from './pages/LoginPage';
import Tabs from './routes/Tabs';
import './theme/variables.css';
import { PrivateRoute } from './routes/PrivateRoute';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthenticationProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/tabs">
            <PrivateRoute>
              <Tabs />
            </PrivateRoute>
          </Route>
          <Route path="/auth-action-complete">
            <AuthActionCompletePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/tabs" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthenticationProvider>
  </IonApp>
);

export default App;
