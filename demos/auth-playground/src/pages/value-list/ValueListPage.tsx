import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewWillEnter,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useVault } from '@/hooks/useVault';
import { setValue } from '@/utils/session-storage/session-vault';

const ValueListPage: React.FC = () => {
  const [presentAlert] = useIonAlert();
  const [values, setValues] = useState<{ key: string; value: string }[]>([]);
  const { getValues } = useVault();

  const syncWithVault = async () => {
    const values = await getValues();
    setValues(values);
  };

  const addValue = async () => {
    return presentAlert({
      header: 'Key/Value Pair',
      subHeader: 'Enter a new key for new data or an existing key to supply different data for that key',
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'Key',
        },
        {
          name: 'value',
          id: 'value',
          type: 'textarea',
          placeholder: 'Value',
        },
      ],
      backdropDismiss: false,
      buttons: ['Cancel', 'OK'],
      onDidDismiss: async (event) => {
        const { data, role } = event.detail;
        if (role !== 'cancel' && data.values.key && data.values.value) {
          await setValue(data.values.key, data.values.value);
          await syncWithVault();
        }
      },
    });
  };

  useIonViewWillEnter(() => {
    syncWithVault();
  });

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Stored Values</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/vault-control"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent class="main-content" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Stored Values</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList data-testid="value-list">
          {values.map(({ key, value }) => (
            <IonItem key={key}>
              <IonLabel>
                <div>
                  <strong>{key}</strong>
                </div>
                <div>
                  <pre>{value}</pre>
                </div>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={addValue} data-testid="add-value-button">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};
export default ValueListPage;
