import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppProviders } from '../src/providers/AppProviders';
import { LoadingView } from '../src/components/LoadingView';

// Instruct the native app wrapper to retain the splash view during bootstrap
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Root Router layout.
 * Wraps children with StatusBars, AppProviders (React Query, Paper Material 3),
 * and dismisses splash overlays on mount.
 */
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Hide the native splash screen immediately to bypass any caching issues
    SplashScreen.hideAsync().catch(() => {});

    // Simulate initial application setup / buffering
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProviders>
      <StatusBar style="auto" />
      {!isReady ? (
        <LoadingView message="Initializing GoSafe protection..." />
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      )}
    </AppProviders>
  );
}
