import React from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { Card, Text, Avatar, List, useTheme, Divider } from 'react-native-paper';

/**
 * Profile screen displaying user metadata settings, policies, and system support info.
 */
export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Header User Profile Metadata Panel */}
      <View style={styles.header}>
        <Avatar.Text size={72} label="JD" style={{ backgroundColor: theme.colors.primary }} />
        <Text variant="titleLarge" style={styles.name}>John Doe</Text>
        <Text variant="bodyMedium" style={styles.email}>john.doe@example.com</Text>
      </View>

      {/* 2. Settings Category Options List */}
      <Card style={styles.card}>
        <List.Section>
          <List.Subheader>Account Settings</List.Subheader>
          <List.Item
            title="Notification Preferences"
            description="Manage mobile push trigger schedules"
            left={(props) => <List.Icon {...props} icon="bell-ring-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Notifications', 'Preferences config is not implemented.')}
          />
          <Divider />
          <List.Item
            title="Trusted Contacts List"
            description="Edit priority numbers of family links"
            left={(props) => <List.Icon {...props} icon="account-multiple-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Trusted Contacts', 'Contacts management is not implemented.')}
          />
          <Divider />
          <List.Item
            title="Privacy and Security"
            description="Permissions settings control"
            left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Security', 'Security settings dashboard is not implemented.')}
          />
        </List.Section>
      </Card>

      {/* 3. About Specifications Panel */}
      <Card style={styles.card}>
        <List.Section>
          <List.Subheader>About Application</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0 (Build 124)"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
          <Divider />
          <List.Item
            title="Help & Safety Center"
            description="Access safety manual lists and guides"
            left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Support Hub', 'Connecting safety support catalog.')}
          />
        </List.Section>
      </Card>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  email: {
    color: 'gray',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
