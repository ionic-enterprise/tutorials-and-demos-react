import { useRef, useState } from 'react';
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
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { close } from 'ionicons/icons';

import './AppPinDialog.css';

type Props = {
  setPasscodeMode: boolean;
  dismiss: (data?: any, role?: string) => void;
};

const AppPinDialog: React.FC<Props> = ({ setPasscodeMode, dismiss }) => {
  const verifyPin = useRef('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [prompt, setPrompt] = useState('');

  useIonViewWillEnter(() => {
    if (setPasscodeMode) {
      initSetPasscodeMode();
    } else {
      initUnlockMode();
    }
  });

  const disableDelete = !pin.length;
  const disableEnter = !(pin.length > 2);
  const disableInput = pin.length > 8;
  const displayPin = '*********'.slice(0, pin.length);

  const initSetPasscodeMode = () => {
    setPrompt('Create Session PIN');
    verifyPin.current = '';
    setPin('');
  };

  const initUnlockMode = () => {
    setPrompt('Enter PIN to Unlock');
    setPin('');
  };

  const initVerifyMode = () => {
    setPrompt('Verify PIN');
    verifyPin.current = pin;
    setPin('');
  };

  const append = (digit: number) => {
    setErrorMessage('');
    setPin(pin.concat(digit.toString()));
  };

  const cancel = () => {
    dismiss(undefined, 'cancel');
  };

  const enter = () => {
    if (setPasscodeMode) {
      if (!verifyPin.current) {
        initVerifyMode();
      } else if (verifyPin.current === pin) {
        dismiss(pin);
      } else {
        setErrorMessage('PINs do not match');
        initSetPasscodeMode();
      }
    } else {
      dismiss(pin);
    }
  };

  const remove = () => {
    if (pin) {
      setPin(pin.slice(0, pin.length - 1));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{setPasscodeMode ? 'Create PIN' : 'Unlock'}</IonTitle>
          {setPasscodeMode === false && (
            <IonButtons slot="primary">
              <IonButton icon-only onClick={cancel} data-testid="cancel-button">
                <IonIcon icon={close}></IonIcon>
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding ion-text-center">
        <IonLabel data-testid="prompt">
          <div className="prompt">{prompt}</div>
        </IonLabel>
        <IonLabel data-testid="display-pin">
          <div className="pin">{displayPin}</div>
        </IonLabel>
        <IonLabel color="danger" data-testid="error-message">
          <div className="error">{errorMessage}</div>
        </IonLabel>
      </IonContent>

      <IonFooter>
        <IonGrid>
          <IonRow>
            {[1, 2, 3].map((digit) => (
              <IonCol key={digit}>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => append(digit)}
                  disabled={disableInput}
                  data-testclass="number-button"
                >
                  {digit}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            {[4, 5, 6].map((digit) => (
              <IonCol key={digit}>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => append(digit)}
                  disabled={disableInput}
                  data-testclass="number-button"
                >
                  {digit}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            {[7, 8, 9].map((digit) => (
              <IonCol key={digit}>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => append(digit)}
                  disabled={disableInput}
                  data-testclass="number-button"
                >
                  {digit}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                color="tertiary"
                expand="block"
                onClick={remove}
                disabled={disableDelete}
                data-testid="delete-button"
              >
                Delete
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => append(0)}
                disabled={disableInput}
                data-testclass="number-button"
              >
                0
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                color="secondary"
                expand="block"
                onClick={enter}
                disabled={disableEnter}
                data-testid="enter-button"
              >
                Enter
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};
export default AppPinDialog;
