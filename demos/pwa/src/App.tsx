import { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, useIonAlert } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { hideContentsInBackground, isHidingContentsInBackground } from './utils/device';

import SplashContainer from './components/splash/SplashContainer';
import AuthProvider from './providers/AuthProvider';
import TeaProvider from './providers/TeaProvider';

import { PrivateRoute } from './routes/PrivateRoute';
import Tabs from './routes/Tabs';
import AuthActionCompletePage from './pages/auth-action-complete/AuthActionCompletePage';
import LoginPage from './pages/login/LoginPage';
import StartPage from './pages/start/StartPage';
import UnlockPage from './pages/unlock/UnlockPage';

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
import './theme/variables.css';
import './theme/global.css';

setupIonicReact();

isHidingContentsInBackground().then((hide) => hideContentsInBackground(hide));

const App: React.FC = () => {
  const [presentAlert] = useIonAlert();
  const interval = 3600 * 1000;
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered: (r) => r && setInterval(() => r.update(), interval),
  });

  const presentRefreshAlert = async () => {
    await presentAlert({
      header: 'Update Available',
      message:
        'An update is available for this application. Would you like to refresh this application to get the update?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => updateServiceWorker(),
        },
      ],
    });
  };

  useEffect(() => {
    if (needRefresh) presentRefreshAlert();
  }, [needRefresh]);

  return (
    <IonApp>
      <IonReactRouter>
        <AuthProvider>
          <SplashContainer>
            <IonRouterOutlet>
              <Route exact path="/auth-action-complete">
                <AuthActionCompletePage />
              </Route>
              <Route exact path="/unlock">
                <UnlockPage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route path="/tabs">
                <PrivateRoute>
                  <TeaProvider>
                    <Tabs />
                  </TeaProvider>
                </PrivateRoute>
              </Route>
              <Route exact path="/">
                <StartPage />
              </Route>
            </IonRouterOutlet>
          </SplashContainer>
        </AuthProvider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
