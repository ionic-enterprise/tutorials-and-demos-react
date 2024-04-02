import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Tea } from '@/models';
import { useTea } from '@/providers/TeaProvider';

import './TeaListPage.css';

const listToMatrix = (teas: Tea[]): Tea[][] => {
  const teaMatrix: Tea[][] = [];

  for (let i = 0; i < teas.length; i += 4) {
    teaMatrix.push(teas.slice(i, i + 4));
  }

  return teaMatrix;
};

const TeaListPage: React.FC = () => {
  const { teas } = useTea();

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Tea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="tea-list-page">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tea</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid className="tea-grid">
          {listToMatrix(teas).map((row, idx) => (
            <IonRow key={idx} className="ion-align-items-stretch">
              {row.map((tea) => (
                <IonCol size="12" sizeMd="6" sizeXl="3" key={tea.id}>
                  <IonCard>
                    <IonImg src={tea.image} />
                    <IonCardHeader>
                      <IonCardTitle>{tea.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>{tea.description}</IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TeaListPage;
