import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppIcons } from '@/src/constants';

/**
 * Bottom Tabs layout coordinating index, heatmap, complaint, sos, and profile routes.
 */
export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
          borderTopWidth: 0,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false, // We use custom AppHeader components on each tab screen
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={AppIcons.home as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          title: 'Heatmap',
          tabBarLabel: 'Heatmap',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={AppIcons.heatmap as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'Emergency SOS',
          tabBarLabel: 'SOS',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={AppIcons.emergencyTab as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaint"
        options={{
          title: 'Complaints',
          tabBarLabel: 'Complaints',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={AppIcons.complaintTab as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={AppIcons.profileTab as any} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
