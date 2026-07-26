import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, Button, useTheme, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * SOS view containing a big emergency trigger, guardian contacts list,
 * and nearby services overview.
 */
export default function SosScreen() {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);

  // Mock safety entities
  const mockContacts = [
    { id: '1', name: 'Mom (Family Contact)', phone: '+12345678902' },
    { id: '2', name: 'Dad (Family Contact)', phone: '+12345678903' }
  ];

  const mockPolice = [
    { id: '1', name: 'District HQ Police Station', dist: '450m away' }
  ];

  const mockHospitals = [
    { id: '1', name: 'City General Hospital', dist: '1.2km away' }
  ];

  const handleSosPress = () => {
    setIsActive(!isActive);
    Alert.alert(
      isActive ? 'SOS Alarm Cancelled' : 'SOS Alarm Activated!',
      isActive 
        ? 'Crisis broadcast services have been halted.'
        : 'Emergency responders and family contacts have been notified of your location.'
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Pulse Alert Trigger Button */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={handleSosPress}
          style={[
            styles.sosButton,
            { 
              backgroundColor: isActive ? theme.colors.primary : theme.colors.error,
              shadowColor: isActive ? theme.colors.primary : theme.colors.error
            }
          ]}
        >
          <MaterialCommunityIcons name="alert-decagram" size={64} color="white" />
          <Text style={styles.sosText}>{isActive ? 'CANCEL ALARM' : 'HELP ME NOW'}</Text>
        </TouchableOpacity>
        <Text variant="bodySmall" style={styles.helperText}>
          {isActive ? 'Emergency alert in progress. Tap to cancel.' : 'Press and hold for 2s to trigger rapid dispatch alert.'}
        </Text>
      </View>

      {/* 2. Guardian Emergency Contacts list */}
      <Text variant="titleMedium" style={styles.sectionHeader}>Emergency Contacts</Text>
      {mockContacts.map((contact) => (
        <Card key={contact.id} style={styles.card}>
          <Card.Content style={styles.row}>
            <View style={styles.rowLeft}>
              <Avatar.Icon size={36} icon="phone" style={{ backgroundColor: theme.colors.primaryContainer }} />
              <View style={styles.textContainer}>
                <Text variant="titleSmall" style={styles.bold}>{contact.name}</Text>
                <Text variant="bodySmall">{contact.phone}</Text>
              </View>
            </View>
            <Button compact mode="outlined" onPress={() => Alert.alert('Dialing Contact', `Connecting call to ${contact.phone}`)}>
              CALL
            </Button>
          </Card.Content>
        </Card>
      ))}

      {/* 3. Nearby Rescue Stations (Police) */}
      <Text variant="titleMedium" style={styles.sectionHeader}>Nearby Police Stations</Text>
      {mockPolice.map((police) => (
        <Card key={police.id} style={styles.card}>
          <Card.Content style={styles.row}>
            <View style={styles.rowLeft}>
              <Avatar.Icon size={36} icon="shield-account" style={{ backgroundColor: 'lightblue' }} />
              <View style={styles.textContainer}>
                <Text variant="titleSmall" style={styles.bold}>{police.name}</Text>
                <Text variant="bodySmall" style={styles.dist}>{police.dist}</Text>
              </View>
            </View>
            <Button compact mode="text" icon="directions" onPress={() => Alert.alert('Plotting Route', 'Showing navigation directions to Police HQ.')}>
              ROUTE
            </Button>
          </Card.Content>
        </Card>
      ))}

      {/* 4. Nearby Hospitals */}
      <Text variant="titleMedium" style={styles.sectionHeader}>Nearby Hospitals</Text>
      {mockHospitals.map((hospital) => (
        <Card key={hospital.id} style={styles.card}>
          <Card.Content style={styles.row}>
            <View style={styles.rowLeft}>
              <Avatar.Icon size={36} icon="hospital-building" style={{ backgroundColor: 'pink' }} />
              <View style={styles.textContainer}>
                <Text variant="titleSmall" style={styles.bold}>{hospital.name}</Text>
                <Text variant="bodySmall" style={styles.dist}>{hospital.dist}</Text>
              </View>
            </View>
            <Button compact mode="text" icon="directions" onPress={() => Alert.alert('Plotting Route', 'Showing navigation directions to Hospital.')}>
              ROUTE
            </Button>
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
  helperText: {
    marginTop: 12,
    color: 'gray',
    textAlign: 'center',
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginVertical: 12,
  },
  card: {
    marginBottom: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  dist: {
    color: 'gray',
  },
});
