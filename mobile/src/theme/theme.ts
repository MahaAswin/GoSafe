import { MD3LightTheme } from 'react-native-paper';
import { Colors } from './colors';

export const GoSafeTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    primaryContainer: 'rgba(13, 71, 161, 0.1)',
    secondary: Colors.success,
    error: Colors.emergency,
    background: Colors.background,
    surface: Colors.surface,
    onBackground: Colors.textPrimary,
    onSurface: Colors.textPrimary,
    onSurfaceVariant: Colors.textSecondary,
    outline: Colors.border,
  },
};
