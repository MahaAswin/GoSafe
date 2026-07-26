import React from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { Avatar, List, useTheme } from 'react-native-paper';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { Divider } from '@/src/components/common/Divider';
import { ProfilePlaceholder } from '@/src/assets';
import { Spacing } from '@/src/theme/spacing';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppHeader title="User Profile" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User panel */}
        <View style={styles.header}>
          <Avatar.Image size={80} source={ProfilePlaceholder} style={{ backgroundColor: 'transparent' }} />
          <AppText variant="titleLarge" style={styles.name}>
            John Doe
          </AppText>
          <AppText variant="bodyMedium" textColor={theme.colors.onSurfaceVariant}>
            john.doe@example.com
          </AppText>
        </View>

        {/* Profile Settings */}
        <AppCard style={styles.card}>
          <List.Section style={styles.listSection}>
            <List.Subheader>Account Settings</List.Subheader>
            <List.Item
              title="Notification Settings"
              description="Configure area warning alerts triggers"
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              onPress={() => Alert.alert('Account Settings', 'Routing to notification panels in Phase 2.')}
            />
            <Divider />
            <List.Item
              title="Trusted Guardians"
              description="Manage priority emergency contact links"
              left={(props) => <List.Icon {...props} icon="account-group-outline" />}
              onPress={() => Alert.alert('Guardians', 'Guardian listings will load in Phase 2.')}
            />
          </List.Section>
        </AppCard>

        <AppCard style={styles.card}>
          <List.Section style={styles.listSection}>
            <List.Subheader>App Metadata</List.Subheader>
            <List.Item
              title="Software Version"
              description="1.0.0 (Foundation Build)"
              left={(props) => <List.Icon {...props} icon="information-outline" />}
            />
          </List.Section>
        </AppCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  name: {
    fontWeight: 'bold',
    marginTop: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  listSection: {
    marginVertical: 0,
  },
});
