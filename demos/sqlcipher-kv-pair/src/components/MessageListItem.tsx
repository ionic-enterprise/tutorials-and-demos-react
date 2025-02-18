import { IonItem, IonLabel, IonNote } from '@ionic/react';
import { EmailMessage } from '../utils/email-messages';
import './MessageListItem.css';

interface MessageListItemProps {
  message: EmailMessage;
  index: number;
}

const MessageListItem = ({ message, index }: MessageListItemProps) => {
  return (
    <IonItem id="message-list-item" routerLink={`/message/${index}`} detail={false}>
      <div slot="start" className={`dot${message.isUnread ? ' dot-unread' : ''}`}></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {message.fromName}
          <span className="date">
            <IonNote>{message.date}</IonNote>
          </span>
        </h2>
        <h3>{message.subject}</h3>
        <p>{message.message}</p>
      </IonLabel>
    </IonItem>
  );
};

export default MessageListItem;
