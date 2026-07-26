import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import MapView, { Heatmap, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Custom reusable components and constants
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { MapLegend } from '@/src/components/map/MapLegend';
import { Spacing } from '@/src/theme/spacing';
import { Radius } from '@/src/theme/radius';
import { AppIcons } from '@/src/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Custom Google Maps Dark Theme JSON configuration
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] }
];

export default function HeatmapScreen() {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<'today' | 'week' | 'month'>('today');

  // New Delhi mock center coordinates
  const initialRegion = {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  // Mock hotspots for today, week, and month
  const mockHotspots = {
    today: [
      { latitude: 28.6139, longitude: 77.2090, weight: 3 },
      { latitude: 28.6150, longitude: 77.2110, weight: 2 },
      { latitude: 28.6120, longitude: 77.2070, weight: 1 },
      { latitude: 28.6160, longitude: 77.2050, weight: 3 },
    ],
    week: [
      { latitude: 28.6139, longitude: 77.2090, weight: 3 },
      { latitude: 28.6150, longitude: 77.2110, weight: 2 },
      { latitude: 28.6120, longitude: 77.2070, weight: 1 },
      { latitude: 28.6160, longitude: 77.2050, weight: 3 },
      { latitude: 28.6110, longitude: 77.2120, weight: 2 },
      { latitude: 28.6170, longitude: 77.2080, weight: 3 },
    ],
    month: [
      { latitude: 28.6139, longitude: 77.2090, weight: 3 },
      { latitude: 28.6150, longitude: 77.2110, weight: 2 },
      { latitude: 28.6120, longitude: 77.2070, weight: 1 },
      { latitude: 28.6160, longitude: 77.2050, weight: 3 },
      { latitude: 28.6110, longitude: 77.2120, weight: 2 },
      { latitude: 28.6170, longitude: 77.2080, weight: 3 },
      { latitude: 28.6190, longitude: 77.2150, weight: 2 },
      { latitude: 28.6080, longitude: 77.2020, weight: 1 },
    ],
  };

  // Dynamic Safety Diagnostics based on time filter
  const safetyMetrics = {
    today: { score: '82/100', level: 'Low Threat Vector', status: 'Safe', color: '#2E7D32', updated: '10 mins ago' },
    week: { score: '74/100', level: 'Moderate Threat Vector', status: 'Moderate', color: '#FBC02D', updated: '1 hour ago' },
    month: { score: '58/100', level: 'High Threat Vector', status: 'Risky', color: '#EF6C00', updated: '2 hours ago' },
  };

  const currentMetric = safetyMetrics[selectedFilter];

  // 5 Mock incident events
  const mockIncidents = [
    { id: '1', title: 'Street Harassment Event', location: '150m away', time: '15m ago', severity: 'High', color: '#D32F2F' },
    { id: '2', title: 'Severe Waterlogging Hazard', location: '320m away', time: '1h ago', severity: 'Medium', color: '#EF6C00' },
    { id: '3', title: 'Broken Streetlamp Blackout', location: '400m away', time: '2h ago', severity: 'Medium', color: '#EF6C00' },
    { id: '4', title: 'Public Protest Assembly', location: '800m away', time: '3h ago', severity: 'Low', color: '#0D47A1' },
    { id: '5', title: 'Active Pothole Hazard', location: '1.1km away', time: '4h ago', severity: 'Low', color: '#0D47A1' },
  ];

  const legendItems = [
    { label: 'Safe', color: '#2E7D32' },
    { label: 'Moderate', color: '#FBC02D' },
    { label: 'Risky', color: '#EF6C00' },
    { label: 'Danger', color: '#D32F2F' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Header with back button */}
      <AppHeader
        title="Safety Heatmap"
        showBackButton={true}
        actions={[
          {
            icon: AppIcons.dotsVertical,
            onPress: () => {},
          },
        ]}
      />

      {/* 2. Segmented Time Filters */}
      <View style={styles.filterRow}>
        {(['today', 'week', 'month'] as const).map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.outline,
                },
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <AppText
                variant="bodyMedium"
                style={styles.bold}
                textColor={isSelected ? '#ffffff' : theme.colors.onSurface}
              >
                {filter.toUpperCase()}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Interactive Map + 4. Heatmap Overlay */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={initialRegion}
          customMapStyle={darkMapStyle}
          showsUserLocation={false}
          showsMyLocationButton={false}
          scrollEnabled={true}
          zoomEnabled={true}
        >
          <Heatmap
            points={mockHotspots[selectedFilter]}
            radius={40}
            opacity={0.7}
            gradient={{
              colors: ['#2E7D32', '#FBC02D', '#EF6C00', '#D32F2F'],
              startPoints: [0.1, 0.4, 0.7, 0.95],
              colorMapSize: 256,
            }}
          />
        </MapView>

        {/* 5. Map Legend Overlay */}
        <MapLegend items={legendItems} style={styles.legend} />
      </View>

      {/* Scrollable details list */}
      <ScrollView contentContainerStyle={styles.detailsContent} showsVerticalScrollIndicator={false}>
        {/* 6. Safety Summary Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <AppCard style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <AppText variant="titleMedium" style={styles.bold}>
                  Connaught Place Center
                </AppText>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                  Diagnostic zone reports
                </AppText>
              </View>
              <View style={[styles.scoreBadge, { backgroundColor: currentMetric.color + '15' }]}>
                <AppText variant="titleLarge" style={[styles.bold, { color: currentMetric.color }]}>
                  {currentMetric.score}
                </AppText>
                <AppText variant="caption" style={{ color: currentMetric.color, fontWeight: 'bold' }}>
                  SAFETY SCORE
                </AppText>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                 <MaterialCommunityIcons name={AppIcons.shieldAlert as any} size={20} color={currentMetric.color} />
                <AppText variant="bodySmall" style={styles.metricLabel}>
                  {currentMetric.level}
                </AppText>
              </View>
              <View style={styles.metricItem}>
                 <MaterialCommunityIcons name={AppIcons.clock as any} size={20} color={theme.colors.onSurfaceVariant} />
                <AppText variant="bodySmall" style={styles.metricLabel}>
                  Updated {currentMetric.updated}
                </AppText>
              </View>
            </View>
          </AppCard>
        </Animated.View>

        {/* 7. Nearby Incidents list */}
        <AppText variant="titleMedium" style={[styles.sectionTitle, styles.bold]}>
          Recent Area Threats
        </AppText>

        {mockIncidents.map((incident, index) => (
          <Animated.View key={incident.id} entering={FadeInDown.duration(400).delay(200 + index * 50)}>
            <AppCard style={styles.incidentCard}>
              <View style={styles.incidentRow}>
                <View style={[styles.iconWrapper, { backgroundColor: incident.color + '15' }]}>
                   <MaterialCommunityIcons name={AppIcons.generalAlert as any} size={24} color={incident.color} />
                </View>
                <View style={styles.incidentTextContainer}>
                  <AppText variant="titleSmall" style={styles.bold}>
                    {incident.title}
                  </AppText>
                  <View style={styles.incidentSubRow}>
                    <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                      {incident.location}
                    </AppText>
                    <AppText variant="bodySmall" style={styles.dot} textColor={theme.colors.onSurfaceVariant}>
                      •
                    </AppText>
                    <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                      {incident.time}
                    </AppText>
                  </View>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: incident.color + '15' }]}>
                  <AppText variant="caption" style={[styles.bold, { color: incident.color }]}>
                    {incident.severity.toUpperCase()}
                  </AppText>
                </View>
              </View>
            </AppCard>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: '#ffffff',
  },
  filterBtn: {
    flex: 0.31,
    height: 40,
    borderRadius: Radius.medium,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  mapContainer: {
    height: SCREEN_HEIGHT * 0.4,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  legend: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    left: Spacing.md,
    padding: Spacing.sm,
  },
  detailsContent: {
    padding: Spacing.lg,
  },
  summaryCard: {
    marginBottom: Spacing.md,
    padding: Spacing.xs,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.medium,
    minWidth: 90,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLabel: {
    marginLeft: Spacing.sm,
  },
  sectionTitle: {
    marginVertical: Spacing.md,
  },
  incidentCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.xs,
    marginVertical: 0,
  },
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  incidentTextContainer: {
    flex: 1,
  },
  incidentSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  dot: {
    marginHorizontal: Spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.small,
  },
});
