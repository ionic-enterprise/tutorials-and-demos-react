import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.gettingstartediv',
  appName: 'iv-device-api',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
