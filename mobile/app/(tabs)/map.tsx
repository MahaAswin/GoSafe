import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, Text, useTheme, Card } from 'react-native-paper';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Map screen showing current location coordinates and local safety landmark markers.
 */
export default function MapScreen() {
  const theme = useTheme();
  
  // Default coordinates (New Delhi)
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Mock markers representing smart city rescue points
  const mockMarkers = [
    { id: '1', title: 'City Hospital', type: 'HOSPITAL', lat: 28.6120, lng: 77.2080, icon: 'hospital-building', color: 'red' },
    { id: '2', title: 'Police HQ', type: 'POLICE', lat: 28.6150, lng: 77.2090, icon: 'shield-account', color: 'blue' },
    { id: '3', title: 'Pothole Report', type: 'COMPLAINT', lat: 28.6130, lng: 77.2110, icon: 'alert', color: 'orange' }
  ];

  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        });
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. Map Canvas View */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {mockMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            title={marker.title}
            description={marker.type}
          />
        ))}
      </MapView>

      {/* 2. Floating Incident Reporting Trigger */}
      <View style={styles.fabContainer}>
        <Button
          mode="contained"
          buttonColor={theme.colors.primary}
          textColor="white"
          elevation={4}
          contentStyle={styles.fabContent}
          onPress={() => router.push('/complaint')}
          icon={() => <MaterialCommunityIcons name="alert-box" size={24} color="white" />}
        >
          REPORT INCIDENT
        </Button>
      </View>

      {/* 3. Zone Protection Status Banner */}
      <Card style={styles.banner}>
        <Card.Content style={styles.bannerRow}>
          <MaterialCommunityIcons name="security" size={20} color={theme.colors.primary} />
          <Text variant="labelLarge" style={styles.bannerText}>Zone Protection is Active</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  fabContent: {
    height: 52,
    justifyContent: 'center',
  },
  banner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  bannerText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
