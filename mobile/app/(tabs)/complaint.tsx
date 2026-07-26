import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Card, Text, FAB, useTheme, ActivityIndicator, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Screen displaying registered complaints.
 * Contains loading, empty, and loaded states with a FAB placeholder.
 */
export default function ComplaintScreen() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState<any[]>([]);

  // Simulated backend fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setComplaints([
        { id: '1', title: 'Major Road Pothole', desc: 'Outer highway pothole causing tire damage.', status: 'IN_PROGRESS', date: '2026-07-25' },
        { id: '2', title: 'Broken Streetlamp', desc: 'No light in the corner alley, unsafe passage.', status: 'PENDING', date: '2026-07-26' },
        { id: '3', title: 'Garbage Dump Overflow', desc: 'Waste piling up in municipal park.', status: 'RESOLVED', date: '2026-07-24' }
      ]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Helper to choose status indicator colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'green';
      case 'IN_PROGRESS': return 'blue';
      default: return 'orange';
    }
  };

  // Render when loading is active
  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Fetching local complaints...</Text>
      </View>
    );
  }

  // Render when list is empty
  if (complaints.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="clipboard-text-off-outline" size={64} color="gray" />
        <Text variant="titleMedium" style={styles.emptyTitle}>No Complaints Logged</Text>
        <Text style={styles.emptySubtitle}>Tap the floating button below to report local issues.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <Text variant="titleMedium" style={styles.bold}>{item.title}</Text>
                <Text
                  variant="labelSmall"
                  style={[styles.status, { color: getStatusColor(item.status), backgroundColor: getStatusColor(item.status) + '15' }]}
                >
                  {item.status}
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.desc}>{item.desc}</Text>
              <List.Item
                title="Municipal Zone 5"
                description={item.date}
                left={(props) => <List.Icon {...props} icon="map-marker-outline" />}
                style={styles.listItem}
              />
            </Card.Content>
          </Card>
        )}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        label="File Report"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={() => {
          // Placeholder implementation trigger
          alert('Filing reporting forms will open a new ticket workflow.');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listPadding: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  desc: {
    marginVertical: 8,
    color: '#666',
  },
  listItem: {
    paddingLeft: 0,
    paddingVertical: 0,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: 'gray',
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
