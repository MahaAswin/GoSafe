import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

/**
 * Custom application theme definitions following Material Design 3.
 * Merges React Native Paper themes to maintain clean consistency.
 */

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0D47A1', // Navy Blue
    secondary: '#D32F2F', // Alert Orange/Red
    error: '#B00020',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64B5F6', // Lighter Blue for accessibility contrast
    secondary: '#E57373', // Light Red Alert indicator
    error: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
  },
};
