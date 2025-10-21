import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MiUbicacionApp',
  webDir: 'www',
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Filesystem: {
      iosIsDocumentPickerEnabled: true,
      androidIsDocumentPickerEnabled: true
    }
  }
};

export default config;
