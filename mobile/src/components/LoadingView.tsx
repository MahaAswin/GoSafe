import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GoSafeLogo } from '@/src/assets';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = 'Loading safety systems...' }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image source={GoSafeLogo} style={styles.logo} />
      <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
      <Text variant="titleMedium" style={[styles.text, { color: theme.colors.onBackground }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
