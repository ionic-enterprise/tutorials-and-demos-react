import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeVault } from './utils/session-vault';
import { initializeEncription } from './utils/encryption';

const container = document.getElementById('root');
const root = createRoot(container!);
Promise.all([initializeEncription(), initializeVault()]).then(() =>
  root.render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>
  ),
);
