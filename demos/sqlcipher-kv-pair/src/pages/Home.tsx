import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useState } from 'react';
import MessageListItem from '../components/MessageListItem';
import { EmailMessage, getMessages, addMessage, removeAllMessages, removeMessage } from '../utils/email-messages';
import { addCircleOutline, removeCircleOutline, trashOutline } from 'ionicons/icons';
import './Home.css';

const Home = () => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);

  useIonViewWillEnter(() => {
    getMessages().then((msgs) => setMessages(msgs));
  });

  const onAddMessage = async () => {
    await addMessage();
    setMessages(await getMessages());
  };

  const onRemoveAll = async () => {
    await removeAllMessages();
    setMessages(await getMessages());
  };

  const onRemoveMessage = async () => {
    await removeMessage();
    setMessages(await getMessages());
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inbox</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onRemoveAll}>
              <IonIcon slot="icon-only" icon={trashOutline}></IonIcon>
            </IonButton>
            <IonButton onClick={onRemoveMessage}>
              <IonIcon slot="icon-only" icon={removeCircleOutline}></IonIcon>
            </IonButton>
            <IonButton onClick={onAddMessage}>
              <IonIcon slot="icon-only" icon={addCircleOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {messages.map((m, idx) => (
            <MessageListItem key={idx} message={m} index={idx} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
