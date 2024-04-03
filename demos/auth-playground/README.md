> [!TIP]
> This app is part of a mono-repo containing other demos but can also be [built on its own](../../README.md#build-a-stand-alone-project).

# Auth Playground

This application highlights the use of the Ionic Enterprise [Auth Connect](https://ionic.io/docs/auth-connect) and [Identity Vault](https://ionic.io/docs/identity-vault/) products in an React application. The application runs on both Android and iOS. In addition, it will also run in a web browser, allowing developers to remain in the more comfortable and productive web-based development environments while working on the application. However, since the web does not have a secure biometrically locked key storage mechanism, the full potential of Identity Vault is only accessible through the native platforms.

This application uses [Capacitor](https://capacitorjs.com/docs) to provide the native layer. This is the preferred technology to use for the native layer and the Customer Success team highly suggests using it over Cordova. However, Identity Vault and Auth Connect can both be used with either technology.

The purpose of this application is to show the use of much of the [Vault](https://ionic.io/docs/identity-vault/classes/vault) and [Device](https://ionic.io/docs/identity-vault/classes/device) APIs of Identity Vault as well as how Identity Vault and Auth Connect work together to provide a secure authentication solution.

> [!CAUTION]
> This app may or may not work on an emulator. When working with biometrics it is highly suggested that you test only on actual devices and skip the emulators.

## Significant Architecture

### Session Storage

#### Identity Vault Implementation

Located in `src/utils/session-storage/session-vault.ts`, this module initializes a [Vault](https://ionic.io/docs/identity-vault/classes/vault) that the demo uses to store session data.

When being used in a production application, this area would typically do the following:

- Instantiate the `Vault` object.
- Expose the `Vault` object so it can be used by Auth Connect.
- Expose any functions needed throughout the rest of the system.

Typically, the functions would be ones like:

- `unlock()`
- `canUnlock()`
- `initializeUnlockMode()`
- `setUnlockMode()`

We have gone beyond that with this application so we could allow the user to manually perform some vault operations that would typically be automatically managed by either Auth Connect or Identity Vault ([lock](https://ionic.io/docs/identity-vault/classes/vault#lock), [clear](https://ionic.io/docs/identity-vault/classes/vault#clear), etc).

### Authentication

#### Authentication Service

Located in `src/utils/authentication/authentication.ts`, this module manages which [Authenticator](./README.md#authenticator-interface) implementation is used to authenticate the user. Otherwise it's simply a wrapper that exposes the `Authenticator` API. As the authentication status changes over time [AuthenticationState](./README.md#authentication-state) is updated, which the React application uses to protect views that require authorization.

#### Authentication State

> [!IMPORTANT]
> Because there are many state management approaches available, this demo uses an architecture that is as generic and simple as possible. This is because your team should replace this portion of the implementation with a solution _specific to your own application_, for the particular state management library it's using.

Located in `src/utils/authentication/store.ts` you'll find a simple immutable data store that allows consumers to subscribe and be notified when the data changes. The React application relies on the `useAuthentication` hook which listens for changes to `AuthenticationState` through [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore).

#### Authenticator Interface

The `Authenticator` interface provides a consistent set of methods that are used across our [Basic Authentication Service](./README.md#basic-authentication-service) as well as our [OIDC Authentication Service](./README.md#oidc-authentication-service). This way, no matter which type of authentication we are using the rest of our application can rely on having a simple, well-defined service level API.

#### Basic Authentication Service

The `BasicAuthenticationService` is used to perform a basic HTTP based authentication where the application itself gathers the credentials and then sends them to the backend to be verified. A token is returned by the backend. This is easily the least secure of all of the methods presented because:

- The application obtains the credentials instead of the backend system performing the authentication.
- As a result, those credentials are sent across the wire to the backend that will do the authentication.
- The protocol we have implemented has a single long-lived token rather than short lived tokens with a long lived refresh token.

Obviously, some of this could be solidified from a security standpoint. However, the fact that the user stays in the app in order to enter their credentials is a serious flaw that would take more work to get around. This makes using Auth Connect with the OIDC providers a far better choice for applications where security is important.

This service relies on the [Identity Vault Implementation](./README.md#identity-vault-implementation) to persist the session data returned by the demo authentication backend.

#### OIDC Authentication Service

The `OIDCAuthenticationService` encapsulates the configuration for each of the authentication providers that this application supports:

- Auth0
- AWS Cognito
- Azure

The important thing to notice here is how little actual code is required. Most of the logic here is to support the ability to use different providers in the demo. The remaining code is simply ensuring the token is refreshed as needed, and handling login/logout functionality. Due to a quirk with Azure's password reset functionality, there is some additional logic within `login()` to handle the required procedure specific to Azure.

This service relies on the [Identity Vault Implementation](./README.md#identity-vault-implementation) to persist the [AuthResult](https://ionic.io/docs/auth-connect/interfaces/AuthResult) data used by Auth Connect. Auth Connect is stateless, so requires the developer to handle storage of the `AuthResult` data and provided it to the API when necessary.

#### Backend API

Located in `src/utils/backend-api.ts`, this module creates an Axios client instance used to centralize some high level authentication behavior.

It gets the access token from the [Authentication Implementation](./README.md#authentication-implementation) and appends it to the headers as a bearer token. If an access token cannot be obtained, the request will still be sent, but it will be sent without a bearer token. In such a case, if the API requires a token in order to process the request it should result in a 401 error. When a response has a 401 error code, the locally stored session data will be removed.

### Components

#### AppInitializer

Because Auth Connect and Identity Vault both have asynchronous initialization mechanisms, this component allows the React application to wait until that process is completed to render the full content.

During the initialization it will render the custom `Splashscreen` component which will be visible when running on the web. For iOS/Android the native splashscreen will cover the web content, and then [hide](https://capacitorjs.com/docs/apis/splash-screen#hide) once initialization is completed (revealing the full UI).

Since the [Identity Vault implementation](./README.md#identity-vault-implementation) is outside of React, this component must supply the following callbacks when invoking `initializeVault()`:

- `onLock`
  - This will get invoked exactly like [onLock](https://ionic.io/docs/identity-vault/classes/vault#onlock) from Identity Vault. This approach allows us to use React Router to navigate to the `UnlockPage`.
- `onPasscodeRequested`
  - This is a slightly modified version of [onPasscodeRequested](https://ionic.io/docs/identity-vault/classes/vault#onpasscoderequested) from Identity Vault. The difference being that it should return the passcode value, which our Identity Vault implementation will then use internally to set it.

This component will also attempt to restore previously set session data if `canUnlock` is false. Otherwise the app will rely on the router configuration to appropriately navigate to either the `LoginPage` or `UnlockPage`.

#### AppPinDialog

The `Vault` API contains an [onPasscodeRequested](https://ionic.io/docs/identity-vault/classes/vault#onpasscoderequested) callback that is used to get the passcode when using a [CustomPasscode](https://ionic.io/docs/identity-vault/enums/vaulttype#custompasscode) type of vault. The method and workflow used to obtain the passcode is determined by the application, the only requirement is to call `setCustomPasscode` from within `onPasscodeRequested`.

For example:

```typescript
private async onPasscodeRequested(isPasscodeSetRequest: boolean): Promise<void> {
  const { data } = await someWayOfGettingThePasscode(isPasscodeSetRequest);
  this.vault.setCustomPasscode(data || '');
}
```

For this application, we chose to use a modal dialog to get the custom passcode. Moreover, we chose to use the same component for initially setting the passcode as we use for getting the passcode when unlocking the vault.

Our component implements a different workflow depending on whether `setPasscodeMode` is:

- `true` - Ask the user twice, do not allow a "cancel"
- `false` - Ask once, allow a "cancel"

Because our [Identity Vault implementation](./README.md#identity-vault-implementation) is outside of React, we'll need to pass in a callback method when [AppInitializer](./README.md#appinitializer) invokes `initializeVault()`. This is provided by the hook exported from `AppPinDialog`:

```typescript
export const usePinDialog = () => {
  const [isPasscodeSetRequest, setIsPasscodeSetRequest] = useState(false);
  const [presentPinDialog, dismissPinDialog] = useIonModal(AppPinDialog, {
    setPasscodeMode: isPasscodeSetRequest,
    dismiss: (data?: any, role?: string) => dismissPinDialog(data, role),
  });

  return async (isPasscodeSetRequest: boolean): Promise<string> => {
    setIsPasscodeSetRequest(isPasscodeSetRequest);
    const data = await new Promise<any>((resolve) => {
      presentPinDialog({
        backdropDismiss: false,
        onDidDismiss: (event) => resolve(event.detail.data),
      });
    });
    return data || '';
  };
};
```

#### PrivateRoute

This component simply reacts to changes in [AuthenticationState](./README.md#auth-playground) and will redirect to the `LoginPage` when an unauthenticated user attempts to access a protected route.

### Hooks

#### useAuthentication

This subscribes to changes in [AuthenticationState](./README.md#authentication-state) and provides the current data stored there.

#### useVault

This provides methods for displaying `Vault` information within the UI:

- `getValues`
  - Fetches all the key/value pairs contained within a `Vault`
- `getVaultTypeLabel`
  - Returns a formatted label of the current `Vault` type

#### usePinDialog

> [!TIP]
> Review the [AppPinDialog](./README.md#apppindialog) section for more detail.

This hook is used within the [AppInitializer](./README.md#appinitializer) component to provide a mechanism for the [Identity Vault implementation](./README.md#identity-vault-implementation) to collect the custom passcode from the user.

## Pages

### Login Page

The login page allows the user to authenticate themselves via any of our providers. The AWS and Auth0 providers as well as the "Sign in with email" option use the following credentials:

- **email:** `test@ionic.io`
- **password:** `Ion54321`

The Azure OIDC provider may work with your Google account.

This page will automatically be displayed whenever the application detects that the user is not currently authenticated.

### Unlock Page

The unlock page gives the user two options:

1. Unlock the vault and navigate into the app
1. Perform a logout, which will clear the vault, and navigate to the login page

### The Tabbed Pages

#### Tea List

The Tea List page just shows a list of teas. Every time the user navigates to this page, the backend API will refetch the data (even though it never actually changes). This page simulates the way an actual application would work. That is, the user goes to the page, the correct token is obtained from the vault, and an API call is made using that token.

#### Vault Config

This is not a page you would typically have in an application, but you may use some of the items or ideas from here in various parts of a real application. The Vault Config page allows the user to select various vault locking mechanisms. It also allows the user to lock the vault, clear the vault, or manually show the biometric prompt.

Child pages allow the user to add items to the `Vault` and to have a look at the Device API values as well as manipulate some of the Device settings.

#### About

This page just has some basic information about the app so the user knows what they have installed.

This is also the page that contains the logout button.
