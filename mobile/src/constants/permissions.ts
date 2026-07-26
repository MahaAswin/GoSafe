import { Platform } from 'react-native';

export const Permissions = {
  location: Platform.select({
    ios: 'Location access is required to track safety zones and send coordinate markers in SOS.',
    android: 'Location access is required to track safety zones and send coordinate markers in SOS.',
    default: 'Location access is required.',
  }),
  camera: 'Camera access is required to take photos for filing reports.',
  notifications: 'Notification permission is required to alert you when threat levels change in your area.',
} as const;
