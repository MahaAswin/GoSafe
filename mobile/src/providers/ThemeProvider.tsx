import React, { ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';
import { GoSafeTheme } from '../theme/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <PaperProvider theme={GoSafeTheme}>
      {children}
    </PaperProvider>
  );
};
