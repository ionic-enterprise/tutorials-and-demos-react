import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonModal,
} from '@ionic/react';
import { add, logOutOutline, sync } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useTea } from '../../core/TeaProvider';
import { Tea } from '../../models/Tea';
import { logout } from '../../utils/auth';
import TeaEditorPage from './TeaEditorPage';
import './TeaListPage.css';

const TeaListPage = () => {
  const { teas, refresh, teaCategories, saveTea, remove, syncTeas, refreshTastingNotes } = useTea();
  const history = useHistory();
  const [tea, setTea] = useState<Tea | undefined>(undefined);
  const [syncComplete, setSyncComplete] = useState<boolean>(false);
  const [present, dismiss] = useIonModal(TeaEditorPage, {
    tea,
    teaCategories,
    onDismiss: () => refresh().then(dismiss),
    saveTea: (tea: Tea) => saveTea(tea),
  });

  useEffect(() => {
    refresh();
    handleSync();
  }, []);

  const handleLogout = async () => {
    await logout();
    history.replace('/');
  };

  const presentEditor = (tea: Tea | undefined) => {
    setTea(tea);
    present();
  };

  const deleteTea = (tea: Tea) => {
    remove(tea);
  };

  const handleSync = async () => {
    await syncTeas();
    setSyncComplete(true);
    await refreshTastingNotes();
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Tasting Notes</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={handleSync}>
              <IonIcon slot="end" icon={sync} />
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon slot="end" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="main-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tea</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {teas.map((tea) => {
            return (
              <IonItemSliding key={tea.id}>
                <IonItem onClick={() => presentEditor(tea)}>
                  <IonLabel>
                    <div>{tea.brand}</div>
                    <div>{tea.name}</div>
                  </IonLabel>
                </IonItem>
                <IonItemOptions onIonSwipe={() => deleteTea(tea)}>
                  <IonItemOption color="danger">Delete</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => presentEditor(undefined)}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
      <IonToast
        isOpen={syncComplete}
        message={'Sync is complete!'}
        color={'success'}
        duration={2000}
        position="top"
        onDidDismiss={() => setSyncComplete(false)}
      ></IonToast>
    </IonPage>
  );
};

export default TeaListPage;
