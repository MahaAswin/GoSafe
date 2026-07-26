import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Text, Button, useTheme, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Home dashboard displaying welcome card, quick actions, recent alerts, and emergency banners.
 */
export default function HomeScreen() {
  const theme = useTheme();

  // Mock list of recent alerts
  const mockAlerts = [
    { id: '1', type: 'ROAD_DAMAGE', desc: 'Pothole on Main St causing traffic slow-down.', time: '10m ago' },
    { id: '2', type: 'STREET_LIGHT', desc: 'Broken streetlamp in Park Lane Alley.', time: '1h ago' },
    { id: '3', type: 'GARBAGE', desc: 'Overflowing dump bins near Central Station.', time: '4h ago' }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Welcome Header Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.row}>
          <View style={styles.textContainer}>
            <Text variant="headlineSmall" style={styles.bold}>GoSafe</Text>
            <Text variant="bodyMedium">React Native + Expo is running successfully.</Text>
          </View>
          <Avatar.Icon size={48} icon="shield-check" style={{ backgroundColor: theme.colors.primary }} />
        </Card.Content>
      </Card>

      {/* 2. Emergency SOS Banner */}
      <Card style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onErrorContainer, fontWeight: 'bold' }}>
            EMERGENCY ALERT SYSTEM
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onErrorContainer, marginVertical: 8 }}>
            If you are in immediate danger, use the SOS tab to trigger emergency dispatch alerts.
          </Text>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            textColor="white"
            onPress={() => router.push('/sos')}
          >
            TRIGGER SOS
          </Button>
        </Card.Content>
      </Card>

      {/* 3. Quick Actions Grid */}
      <Text variant="titleMedium" style={styles.sectionHeader}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <Card style={styles.actionCard} onPress={() => router.push('/map')}>
          <Card.Content style={styles.center}>
            <MaterialCommunityIcons name="map-marker-radius" size={32} color={theme.colors.primary} />
            <Text variant="labelLarge" style={styles.actionLabel}>View Map</Text>
          </Card.Content>
        </Card>
        <Card style={styles.actionCard} onPress={() => router.push('/complaint')}>
          <Card.Content style={styles.center}>
            <MaterialCommunityIcons name="alert-circle-outline" size={32} color="orange" />
            <Text variant="labelLarge" style={styles.actionLabel}>File Report</Text>
          </Card.Content>
        </Card>
      </View>

      {/* 4. Recent Alerts Feed */}
      <Text variant="titleMedium" style={styles.sectionHeader}>Recent Local Alerts</Text>
      {mockAlerts.map((alert) => (
        <Card key={alert.id} style={styles.alertCard}>
          <Card.Content style={styles.alertRow}>
            <MaterialCommunityIcons name="alert-decagram" size={24} color={theme.colors.secondary} />
            <View style={styles.alertTextContainer}>
              <Text variant="titleSmall" style={styles.bold}>{alert.type.replaceAll('_', ' ')}</Text>
              <Text variant="bodySmall" numberOfLines={2}>{alert.desc}</Text>
            </View>
            <Text variant="labelSmall" style={styles.time}>{alert.time}</Text>
          </Card.Content>
        </Card>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginVertical: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    flex: 0.48,
    borderRadius: 8,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  alertCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  time: {
    color: 'gray',
  },
});
