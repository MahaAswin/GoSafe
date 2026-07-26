import React, { ReactNode } from 'react';
import { SafeAreaProvider as RNSafeAreaProvider } from 'react-native-safe-area-context';

interface SafeAreaProviderProps {
  children: ReactNode;
}

export const SafeAreaProvider: React.FC<SafeAreaProviderProps> = ({ children }) => {
  return <RNSafeAreaProvider>{children}</RNSafeAreaProvider>;
};
