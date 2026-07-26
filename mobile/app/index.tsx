import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Root index component redirecting initial launch request directly to (tabs) layout index.
 */
export default function RootIndex() {
  return <Redirect href="/(tabs)" />;
}
