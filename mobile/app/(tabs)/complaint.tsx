import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { AppButton } from '@/src/components/common/AppButton';
import { EmptyState } from '@/src/components/common/EmptyState';
import { LoadingIndicator } from '@/src/components/common/LoadingIndicator';
import { EmptyStateIllustration } from '@/src/assets';
import { Spacing } from '@/src/theme/spacing';

export default function ComplaintScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Stub empty list initially to verify empty state display
      setComplaints([]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Complaints Log" />
        <View style={styles.center}>
          <LoadingIndicator />
          <AppText variant="bodyMedium">Fetching local logs...</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Complaints Log" />
      
      {complaints.length === 0 ? (
        <View style={styles.center}>
          <EmptyState
            title="No Complaints Logged"
            subtitle="Tap the button below to report local safety hazards."
            imageSource={EmptyStateIllustration}
          />
          <AppButton
            mode="contained"
            onPress={() => Alert.alert('Report incident forms will mount here.')}
            style={styles.actionButton}
          >
            FILE REPORT
          </AppButton>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <AppCard style={styles.card}>
              <AppText variant="titleSmall" style={styles.bold}>
                {item.title}
              </AppText>
              <AppText variant="bodyMedium" style={styles.desc}>
                {item.desc}
              </AppText>
            </AppCard>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  list: {
    padding: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.sm,
  },
  bold: {
    fontWeight: 'bold',
  },
  desc: {
    marginTop: Spacing.xs,
    color: 'gray',
  },
  actionButton: {
    marginTop: Spacing.lg,
    width: 200,
  },
});
