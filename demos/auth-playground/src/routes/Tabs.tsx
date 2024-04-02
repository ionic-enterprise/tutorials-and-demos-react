import React from 'react';
import { Redirect, Route, useRouteMatch } from 'react-router-dom';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { leafOutline, settingsOutline, informationCircleOutline } from 'ionicons/icons';
import AboutPage from '@/pages/about/AboutPage';
import TeaListPage from '@/pages/tea-list/TeaListPage';
import VaultControlPage from '@/pages/vault-control/VaultControlPage';
import DeviceInfoPage from '@/pages/device-info/DeviceInfoPage';
import ValueListPage from '@/pages/value-list/ValueListPage';
import TeaProvider from '@/providers/TeaProvider';

const Tabs: React.FC = () => {
  const { url } = useRouteMatch();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path={url} to={`${url}/teas`} />
        <Route exact path={`${url}/teas`}>
          <TeaProvider>
            <TeaListPage />
          </TeaProvider>
        </Route>
        <Route exact path={`${url}/vault-control`}>
          <VaultControlPage />
        </Route>
        <Route exact path={`${url}/vault-control/device-info`}>
          <DeviceInfoPage />
        </Route>
        <Route exact path={`${url}/vault-control/values`}>
          <ValueListPage />
        </Route>
        <Route exact path={`${url}/about`}>
          <AboutPage />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" color="tertiary">
        <IonTabButton tab="teas" href={`${url}/teas`}>
          <IonIcon icon={leafOutline} />
          <IonLabel>Teas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="vault-control" href={`${url}/vault-control`}>
          <IonIcon icon={settingsOutline} />
          <IonLabel>Vault Control</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href={`${url}/about`}>
          <IonIcon icon={informationCircleOutline} />
          <IonLabel>About</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
export default Tabs;
