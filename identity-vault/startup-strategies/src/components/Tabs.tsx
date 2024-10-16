import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { ellipse, square, triangle } from 'ionicons/icons';
import { useEffect } from 'react';
import { Redirect, Route, useHistory, useRouteMatch } from 'react-router-dom';
import Tab1 from '../pages/Tab1';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';
import { useSession } from '../util/session-store';
import { restoreSession, sessionIsLocked } from '../util/session-vault';

const Tabs = () => {
  const { url } = useRouteMatch();

  const history = useHistory();
  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      sessionIsLocked()
        .then((x) => (x ? restoreSession() : undefined))
        .catch(() => history.replace('/unlock'));
    }
  }, [session, history]);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={`${url}/tab1`}>
          <Tab1 />
        </Route>
        <Route exact path={`${url}/tab2`}>
          <Tab2 />
        </Route>
        <Route path={`${url}/tab3`}>
          <Tab3 />
        </Route>
        <Route exact path="/">
          <Redirect to={`${url}/tab1`} />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href={`${url}/tab1`}>
          <IonIcon aria-hidden="true" icon={triangle} />
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href={`${url}/tab2`}>
          <IonIcon aria-hidden="true" icon={ellipse} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href={`${url}/tab3`}>
          <IonIcon aria-hidden="true" icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
