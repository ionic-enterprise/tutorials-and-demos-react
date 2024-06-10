import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import packageInfo from '../../../package.json';
import { logout } from '@/utils/authentication';

const { author, name, version, dependencies } = packageInfo;
const authConnectVersion = dependencies['@ionic-enterprise/auth'];
const identityVaultVersion = dependencies['@ionic-enterprise/identity-vault'];

const AboutPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About Auth Playground</IonTitle>
          <IonButtons slot="end">
            <IonButton data-testid="logout-button" onClick={() => logout()}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>About</IonListHeader>
          <IonItem>
            <IonLabel>Name</IonLabel>
            <IonNote slot="end">{name}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Author</IonLabel>
            <IonNote slot="end">{author}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Version</IonLabel>
            <IonNote slot="end">{version}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Auth Connect</IonLabel>
            <IonNote slot="end">{authConnectVersion}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Identity Vault</IonLabel>
            <IonNote slot="end">{identityVaultVersion}</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default AboutPage;
