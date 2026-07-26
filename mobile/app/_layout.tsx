import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppProviders } from '../src/providers/AppProviders';

// Instruct the native app wrapper to retain the splash view during bootstrap
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Root Router layout.
 * Wraps children with StatusBars, AppProviders (React Query, Paper Material 3),
 * and dismisses splash overlays on mount.
 */
export default function RootLayout() {
  useEffect(() => {
    // Dismiss the splash screen once root components mount successfully
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
    </AppProviders>
  );
}
