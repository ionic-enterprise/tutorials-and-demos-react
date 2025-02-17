import { PrivacyScreen } from '@capacitor/privacy-screen';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeVault } from './util/session-vault';

const container = document.getElementById('root');
const root = createRoot(container!);
PrivacyScreen.enable();
initializeVault().then(() =>
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  ),
);
