import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.gettingstartediv',
  appName: 'iv-startup-strategies',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;
