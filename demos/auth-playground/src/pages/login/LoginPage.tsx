import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
} from '@ionic/react';
import { logoAmazon, logoMicrosoft } from 'ionicons/icons';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { AuthVendor } from '@/models';
import { login } from '@/utils/authentication';
import { initializeUnlockMode } from '@/utils/session-storage/session-vault';

import './LoginPage.css';

interface LoginInputs {
  email: string;
  password: string;
}

const validationSchema = yup.object({
  email: yup.string().required().email().label('Email Address'),
  password: yup.string().required().label('Password'),
});

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const {
    handleSubmit,
    control,
    formState: { errors, touchedFields, dirtyFields, isValid, isSubmitting },
  } = useForm<LoginInputs>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const formSubmit = handleSubmit((formData, event) => {
    event?.preventDefault();
    return signIn('Basic', formData);
  });

  const signIn = async (vendor: AuthVendor, formData?: LoginInputs): Promise<void> => {
    try {
      await initializeUnlockMode();
      await login(vendor, formData?.email, formData?.password);
      history.replace('/');
    } catch (e) {
      console.log(e);
      setErrorMessage('Invalid email and/or password');
    }
  };

  // SEE: https://ionicframework.com/docs/api/input#helper--error-text
  const getInputClassNames = (field: keyof LoginInputs) => {
    return [
      errors[field] ? 'ion-invalid' : 'ion-valid',
      touchedFields[field] ? 'ion-touched' : 'ion-untouched',
      dirtyFields[field] ? 'ion-dirty' : 'ion-pristine',
    ].join(' ');
  };

  return (
    <IonPage>
      <IonContent className="login-page ion-text-center">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Login</IonCardTitle>
            <IonCardSubtitle>Welcome to the Ionic Authentication Playground</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <form onSubmit={formSubmit}>
              <IonList>
                <IonItem>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <IonInput
                        data-testid="email-input"
                        label="E-Mail Address"
                        labelPlacement="floating"
                        type="email"
                        enterkeyhint="go"
                        value={value}
                        onIonBlur={onBlur}
                        onIonInput={(e) => onChange(e.detail.value!)}
                        className={getInputClassNames('email')}
                      />
                    )}
                  />
                </IonItem>
                <IonItem>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <IonInput
                        data-testid="password-input"
                        label="Password"
                        labelPlacement="floating"
                        type="password"
                        enterkeyhint="go"
                        value={value}
                        onIonBlur={onBlur}
                        onIonInput={(e) => onChange(e.detail.value!)}
                        className={getInputClassNames('password')}
                      />
                    )}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <IonButton
                      data-testid="basic-signin-button"
                      expand="block"
                      disabled={!isValid || isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? <IonSpinner /> : 'Sign In With Email'}
                    </IonButton>
                  </IonLabel>
                </IonItem>
              </IonList>
            </form>

            <div data-testid="basic-form-error-messsage" className="error-message ion-padding">
              {Object.values(errors).map((error, idx) => (
                <div key={idx}>{error.message}</div>
              ))}
            </div>

            <div className="auth-button-area">
              <div>--OR--</div>
              <IonButton data-testid="auth0-signin-button" expand="block" color="auth0" onClick={() => signIn('Auth0')}>
                <IonIcon slot="end" src="assets/icons/auth0-logo.svg"></IonIcon>
                Sign In with Auth0
              </IonButton>
            </div>

            <div className="auth-button-area">
              <div>--OR--</div>
              <IonButton data-testid="aws-signin-button" expand="block" color="aws" onClick={() => signIn('AWS')}>
                <IonIcon slot="end" icon={logoAmazon}></IonIcon>
                Sign In with AWS
              </IonButton>
            </div>

            <div className="auth-button-area">
              <div>--OR--</div>
              <IonButton data-testid="azure-signin-button" expand="block" color="azure" onClick={() => signIn('Azure')}>
                <IonIcon slot="end" icon={logoMicrosoft}></IonIcon>
                Sign In with Azure
              </IonButton>
            </div>

            <div data-testid="error-message" className="error-message">
              <div>{errorMessage}</div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
