import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useRef, useState } from 'react';
import { backspace } from 'ionicons/icons';
import './PinDialog.css';

interface PinDialogProperties {
  setPasscodeMode: boolean;
  onDismiss: (data: string | null) => void;
}

const PinDialog = ({ setPasscodeMode, onDismiss }: PinDialogProperties) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [pin, setPin] = useState('');

  const disableDelete = !pin.length;
  const disableEnter = !(pin.length > 2);
  const disableInput = pin.length > 8;

  const verifyPin = useRef<string>('');
  const displayPin = '*********'.slice(0, pin.length);
  const title = setPasscodeMode ? 'Create PIN' : 'Unlock';
  const prompt = verifyPin.current ? 'Verify PIN' : setPasscodeMode ? 'Create Session PIN' : 'Enter PIN to Unlock';

  const handleGetPasscodeFlow = () => {
    onDismiss(pin);
  };

  const handleSetPasscodeFlow = () => {
    if (!verifyPin.current) {
      verifyPin.current = pin;
      setPin('');
    } else if (verifyPin.current === pin) {
      onDismiss(pin);
    } else {
      setErrorMessage('PINs do not match');
      verifyPin.current = '';
      setPin('');
    }
  };

  const append = (n: number) => {
    setErrorMessage('');
    setPin(pin.concat(n.toString()));
  };

  const remove = () => {
    if (pin) {
      setPin(pin.slice(0, pin.length - 1));
    }
  };

  const cancel = () => {
    onDismiss(null);
  };

  const submit = () => {
    if (setPasscodeMode) {
      handleSetPasscodeFlow();
    } else {
      handleGetPasscodeFlow();
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {setPasscodeMode ? undefined : (
            <IonButtons slot="start">
              <IonButton onClick={cancel}> Cancel </IonButton>
            </IonButtons>
          )}
          <IonButtons slot="end">
            <IonButton strong={true} onClick={submit} disabled={disableEnter}>
              Enter
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="pin-dialog-content ion-padding ion-text-center">
        <IonLabel>
          <div className="prompt">{prompt}</div>
        </IonLabel>
        <IonLabel>
          <div className="pin">{displayPin}</div>
        </IonLabel>
        <IonLabel color="danger">
          <div className="error">{errorMessage}</div>
        </IonLabel>
      </IonContent>

      <IonFooter className="pin-dialog-footer">
        <IonGrid>
          <IonRow>
            {[1, 2, 3].map((n) => (
              <IonCol key={n}>
                <IonButton expand="block" fill="outline" onClick={() => append(n)} disabled={disableInput}>
                  {n}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            {[4, 5, 6].map((n) => (
              <IonCol key={n}>
                <IonButton expand="block" fill="outline" onClick={() => append(n)} disabled={disableInput}>
                  {n}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            {[7, 8, 9].map((n) => (
              <IonCol key={n}>
                <IonButton expand="block" fill="outline" onClick={() => append(n)} disabled={disableInput}>
                  {n}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            <IonCol> </IonCol>
            <IonCol>
              <IonButton expand="block" fill="outline" onClick={() => append(0)} disabled={disableInput}>
                0
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton icon-only color="tertiary" expand="block" onClick={remove} disabled={disableDelete}>
                <IonIcon icon={backspace}></IonIcon>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </>
  );
};

export default PinDialog;
