import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Drawer } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

// Reusable components & constants
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { AppButton } from '@/src/components/common/AppButton';
import { Spacing } from '@/src/theme/spacing';
import { Radius } from '@/src/theme/radius';
import {
  MOCK_MAP_MARKERS,
  MOCK_HEATMAP_ZONES,
  MapMarker,
} from '@/src/constants/digitalTwinData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HeatmapScreen() {
  const theme = useTheme();

  // --- Search & Search Filters ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'today' | 'hour' | 'week' | 'priority'>('today');

  // --- Active Modes ---
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [communityMode, setCommunityMode] = useState(false);

  // --- Active Map Heatmap Layer ---
  const [activeHeatmap, setActiveHeatmap] = useState<'none' | 'crime' | 'flood' | 'traffic'>('none');

  // --- Layers Toggles ---
  const [layers, setLayers] = useState({
    crime: true,
    flood: true,
    accidents: true,
    streetLights: true,
    police: true,
    hospitals: true,
    volunteers: true,
    shelters: true,
  });

  // --- Layer Selector Menu state ---
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // --- Animations ---
  const pulseScale = useSharedValue(1);
  const sosSirenPulse = useSharedValue(0.1);
  const bottomSheetHeight = useSharedValue(100);

  useEffect(() => {
    // Normal marker pulsing
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200 }),
        withTiming(1.0, { duration: 1200 })
      ),
      -1,
      false
    );

    // Emergency red border flashing
    sosSirenPulse.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedMarkerPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 1.3 - pulseScale.value,
  }));

  const animatedSirenStyle = useAnimatedStyle(() => ({
    opacity: sosSirenPulse.value,
  }));

  // --- Helpers ---
  const getMarkerIcon = (type: string, category?: string) => {
    if (type === 'Police') return 'police-badge';
    if (type === 'Hospital') return 'hospital-building';
    if (type === 'Fire Station') return 'fire-truck';
    if (type === 'Volunteer') return 'account-heart';
    if (type === 'Safe Shelter') return 'shield-home';
    
    // Incident categories
    if (category === 'Crime') return 'shield-alert';
    if (category === 'Flood') return 'water-alert';
    if (category === 'Accident') return 'car-emergency';
    return 'alert-octagon';
  };

  const getMarkerColor = (type: string, category?: string) => {
    if (type === 'Police') return '#0D47A1';
    if (type === 'Hospital') return '#2E7D32';
    if (type === 'Fire Station') return '#F4511E';
    if (type === 'Volunteer') return '#7B1FA2';
    if (type === 'Safe Shelter') return '#00897B';
    
    // Incident categories
    if (category === 'Crime') return '#D32F2F';
    if (category === 'Flood') return '#0288D1';
    if (category === 'Accident') return '#E53935';
    return '#E53935';
  };

  const filteredMarkers = MOCK_MAP_MARKERS.filter((marker) => {
    // If Emergency/SOS Mode is active, restrict visibility to nearest critical helpers only
    if (emergencyMode) {
      return ['Police', 'Hospital', 'Fire Station', 'Safe Shelter'].includes(marker.type);
    }

    // Community Mode isolates volunteers
    if (communityMode) {
      return marker.type === 'Volunteer' || marker.type === 'Safe Shelter';
    }

    // Otherwise apply standard layer filters
    if (marker.type === 'Police' && !layers.police) return false;
    if (marker.type === 'Hospital' && !layers.hospitals) return false;
    if (marker.type === 'Volunteer' && !layers.volunteers) return false;
    if (marker.type === 'Safe Shelter' && !layers.shelters) return false;
    
    if (marker.type === 'Incident') {
      if (marker.category === 'Crime' && !layers.crime) return false;
      if (marker.category === 'Flood' && !layers.flood) return false;
      if (marker.category === 'Accident' && !layers.accidents) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      return marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             marker.type.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* SECTION 1: Header */}
      <AppHeader
        title="City Digital Twin"
        showBackButton={true}
        actions={[
          {
            icon: 'layers-outline',
            onPress: () => setLayersMenuOpen(!layersMenuOpen),
          },
        ]}
      />

      {/* EMERGENCY MODE FLASHER */}
      {emergencyMode && (
        <Animated.View style={[styles.sirenOverlay, animatedSirenStyle]} pointerEvents="none" />
      )}

      {/* MAP CANVAS (Interactive Public Safety grid mockup) */}
      <View style={styles.mapContainer}>
        
        {/* Streets mockup layout */}
        <View style={styles.streetGridHorizontal} />
        <View style={[styles.streetGridHorizontal, { top: '35%' }]} />
        <View style={[styles.streetGridHorizontal, { top: '70%' }]} />
        <View style={styles.streetGridVertical} />
        <View style={[styles.streetGridVertical, { left: '35%' }]} />
        <View style={[styles.streetGridVertical, { left: '70%' }]} />

        {/* Heatmap overlay circles based on filter selections */}
        {activeHeatmap === 'crime' && (
          <View style={[styles.heatmapGlow, { top: '15%', left: '50%', backgroundColor: 'rgba(211, 47, 47, 0.25)', borderColor: '#D32F2F' }]} />
        )}
        {activeHeatmap === 'flood' && (
          <View style={[styles.heatmapGlow, { top: '50%', left: '45%', backgroundColor: 'rgba(2, 136, 209, 0.25)', borderColor: '#0288D1' }]} />
        )}
        {activeHeatmap === 'traffic' && (
          <View style={[styles.heatmapGlow, { top: '35%', left: '30%', backgroundColor: 'rgba(245, 124, 0, 0.25)', borderColor: '#F57C00' }]} />
        )}

        {/* Center User Location Pin */}
        <View style={[styles.userMarkerPin, { top: '48%', left: '48%' }]}>
          <View style={styles.userPinCore} />
          <Animated.View style={[styles.userPulseRing, animatedMarkerPulseStyle]} />
        </View>

        {/* Emergency lines tracing if active */}
        {emergencyMode && (
          <View style={styles.tracingContainer} pointerEvents="none">
            {/* Draw quick lines connecting user to helper stations */}
            <View style={[styles.traceLine, { top: '30%', left: '20%', width: 120, height: 2, transform: [{ rotate: '45deg' }] }]} />
            <View style={[styles.traceLine, { top: '65%', left: '22%', width: 100, height: 2, transform: [{ rotate: '-30deg' }] }]} />
          </View>
        )}

        {/* Filtered Active Marker Pins */}
        {filteredMarkers.map((marker) => {
          const pinColor = getMarkerColor(marker.type, marker.category);
          return (
            <TouchableOpacity
              key={marker.id}
              onPress={() => setSelectedMarker(marker)}
              style={[styles.markerPin, { top: `${marker.lat}%`, left: `${marker.lng}%` }]}
            >
              <View style={[styles.pinIconCircle, { backgroundColor: pinColor }]}>
                <MaterialCommunityIcons name={getMarkerIcon(marker.type, marker.category) as any} size={14} color="#FFF" />
              </View>
              {marker.type === 'Incident' && (
                <Animated.View style={[styles.pinPulseRing, { backgroundColor: `${pinColor}25` }, animatedMarkerPulseStyle]} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* FLOATING: Search & Modes widgets */}
        <View style={styles.floatingControls}>
          <View style={styles.searchBarRow}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.onSurfaceVariant} style={{ marginRight: Spacing.sm }} />
            <TextInput
              placeholder="Search Police, Hospital, landmark..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            {searchQuery.trim().length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Modes Toggles Row */}
          <View style={styles.quickModesRow}>
            <TouchableOpacity
              onPress={() => {
                setEmergencyMode(!emergencyMode);
                setCommunityMode(false);
              }}
              style={[
                styles.modeBtn,
                { backgroundColor: emergencyMode ? '#D32F2F' : '#FFF', borderColor: '#D32F2F' },
              ]}
            >
              <MaterialCommunityIcons name="alert-octagon" size={18} color={emergencyMode ? '#FFF' : '#D32F2F'} />
              <AppText variant="caption" style={[styles.bold, { color: emergencyMode ? '#FFF' : '#D32F2F', marginLeft: 4 }]}>
                SOS MODE
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCommunityMode(!communityMode);
                setEmergencyMode(false);
              }}
              style={[
                styles.modeBtn,
                { backgroundColor: communityMode ? '#7B1FA2' : '#FFF', borderColor: '#7B1FA2' },
              ]}
            >
              <MaterialCommunityIcons name="account-group" size={18} color={communityMode ? '#FFF' : '#7B1FA2'} />
              <AppText variant="caption" style={[styles.bold, { color: communityMode ? '#FFF' : '#7B1FA2', marginLeft: 4 }]}>
                COMMUNITY
              </AppText>
            </TouchableOpacity>
          </View>

          {/* AI Info Floating Card */}
          <AppCard style={styles.floatingAiCard}>
            <View style={styles.aiHeader}>
              <MaterialCommunityIcons name="brain" size={18} color="#0D47A1" />
              <AppText variant="caption" style={[styles.bold, { color: '#0D47A1', marginLeft: 4 }]}>
                AI Safety Index
              </AppText>
            </View>
            <View style={styles.aiRow}>
              <AppText variant="titleSmall" style={styles.bold}>Delhi CP: 92/100</AppText>
              <View style={[styles.aiStatusBadge, { backgroundColor: '#E8F5E9' }]}>
                <AppText variant="caption" style={[styles.bold, { color: '#2E7D32', fontSize: 8 }]}>EXCELLENT</AppText>
              </View>
            </View>
            <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
              Active Volunteers: 24 • Police: 3 Active
            </AppText>
          </AppCard>
        </View>

        {/* FLOATING: Layers Side Selector Menu */}
        {layersMenuOpen && (
          <AppCard style={styles.layersMenuCard}>
            <View style={styles.layersMenuHeader}>
              <AppText variant="titleSmall" style={styles.bold}>Map Layers</AppText>
              <TouchableOpacity onPress={() => setLayersMenuOpen(false)}>
                <MaterialCommunityIcons name="close" size={18} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>
              {[
                { key: 'police', label: 'Police Stations', icon: 'police-badge' },
                { key: 'hospitals', label: 'Hospitals', icon: 'hospital-building' },
                { key: 'volunteers', label: 'Volunteers', icon: 'account-heart' },
                { key: 'shelters', label: 'Safe Shelters', icon: 'shield-home' },
                { key: 'crime', label: 'Crime Hotspots', icon: 'shield-alert' },
                { key: 'flood', label: 'Flood Risks', icon: 'water-alert' },
                { key: 'accidents', label: 'Traffic Accidents', icon: 'car-emergency' },
              ].map((layer) => {
                const isActive = (layers as any)[layer.key];
                return (
                  <TouchableOpacity
                    key={layer.key}
                    onPress={() => setLayers((prev) => ({ ...prev, [layer.key]: !isActive }))}
                    style={[styles.layerToggleRow, isActive && { backgroundColor: theme.colors.primaryContainer }]}
                  >
                    <MaterialCommunityIcons name={layer.icon as any} size={18} color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant} />
                    <AppText variant="caption" style={[styles.layerLabel, isActive && styles.bold]}>
                      {layer.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </AppCard>
        )}

        {/* FLOATING: Selected Marker Detail overlay */}
        {selectedMarker && (
          <AppCard style={styles.detailPopupCard}>
            <View style={styles.detailPopupHeader}>
              <View style={styles.detailPopupHeaderLeft}>
                <MaterialCommunityIcons
                  name={getMarkerIcon(selectedMarker.type, selectedMarker.category) as any}
                  size={20}
                  color={getMarkerColor(selectedMarker.type, selectedMarker.category)}
                />
                <AppText variant="titleSmall" style={[styles.bold, { marginLeft: 6 }]} numberOfLines={1}>
                  {selectedMarker.title}
                </AppText>
              </View>
              <TouchableOpacity onPress={() => setSelectedMarker(null)}>
                <MaterialCommunityIcons name="close" size={18} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>

            <AppText variant="bodySmall" style={styles.detailPopupDesc} textColor={theme.colors.onSurfaceVariant}>
              {selectedMarker.details}
            </AppText>
            
            <View style={styles.detailPopupStatsRow}>
              <View style={styles.detailStatBox}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>STATUS</AppText>
                <AppText variant="bodySmall" style={styles.bold}>{selectedMarker.status}</AppText>
              </View>
              <View style={styles.detailStatDivider} />
              <View style={styles.detailStatBox}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>DISTANCE</AppText>
                <AppText variant="bodySmall" style={styles.bold}>180 meters</AppText>
              </View>
            </View>

            <AppButton
              mode="contained"
              onPress={() => Alert.alert('Secure Route Locked', 'Initiating safe path tracking overlays...')}
              style={styles.detailPopupBtn}
            >
              Route to Location
            </AppButton>
          </AppCard>
        )}
      </View>

      {/* SECTION 5: Heatmap Category Filters Bar */}
      <View style={styles.heatmapBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heatmapsScroll}>
          {[
            { key: 'none', label: 'Standard Map', icon: 'map-outline', color: theme.colors.primary },
            { key: 'crime', label: 'Crime Hotspots', icon: 'shield-alert', color: '#D32F2F' },
            { key: 'flood', label: 'Flood Risks', icon: 'water-percent', color: '#0288D1' },
            { key: 'traffic', label: 'Traffic Congestion', icon: 'car-multiple', color: '#F57C00' },
          ].map((item) => {
            const isActive = activeHeatmap === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setActiveHeatmap(item.key as any)}
                style={[
                  styles.heatmapFilterBtn,
                  {
                    borderColor: isActive ? item.color : theme.colors.outline,
                    backgroundColor: isActive ? `${item.color}15` : '#FFF',
                    borderWidth: isActive ? 2 : 1,
                  },
                ]}
              >
                <MaterialCommunityIcons name={item.icon as any} size={18} color={item.color} />
                <AppText variant="caption" style={[styles.bold, { color: item.color, marginLeft: 4 }]}>
                  {item.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* SECTION 9: Live Dashboard Bottom Sheet Info */}
      <AppCard style={styles.bottomSheetCard}>
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetHeaderLeft}>
            <View style={styles.liveIndicatorDot} />
            <AppText variant="titleSmall" style={styles.bold}>Delhi Smart City Monitor</AppText>
          </View>
          <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Today</AppText>
        </View>

        <View style={styles.bottomGrid}>
          <View style={styles.bottomGridItem}>
            <AppText variant="titleMedium" style={styles.bold} textColor="#D32F2F">14</AppText>
            <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Active Incidents</AppText>
          </View>
          <View style={styles.bottomGridItem}>
            <AppText variant="titleMedium" style={styles.bold} textColor="#0D47A1">3</AppText>
            <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Road Closures</AppText>
          </View>
          <View style={styles.bottomGridItem}>
            <AppText variant="titleMedium" style={styles.bold} textColor="#EF6C00">Heavy</AppText>
            <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Rain Warnings</AppText>
          </View>
          <View style={styles.bottomGridItem}>
            <AppText variant="titleMedium" style={styles.bold} textColor="#2E7D32">Online</AppText>
            <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Mesh Safety</AppText>
          </View>
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    position: 'relative',
    overflow: 'hidden',
  },
  streetGridHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#CFD8DC',
    top: '15%',
  },
  streetGridVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#CFD8DC',
    left: '15%',
  },
  heatmapGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderStyle: 'dashed',
    transform: [{ translateX: -70 }, { translateY: -70 }],
  },
  userMarkerPin: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    zIndex: 12,
  },
  userPinCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0D47A1',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userPulseRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(13, 71, 161, 0.18)',
  },
  markerPin: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 10,
  },
  pinIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pinPulseRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  tracingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  traceLine: {
    position: 'absolute',
    backgroundColor: '#D32F2F',
    height: 2,
    borderStyle: 'dashed',
    opacity: 0.8,
  },
  sirenOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderColor: '#D32F2F',
    borderWidth: 6,
    zIndex: 99,
  },
  floatingControls: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    gap: Spacing.xs,
    zIndex: 20,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: Radius.medium,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  },
  quickModesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 36,
    borderRadius: Radius.circular,
    borderWidth: 1,
    elevation: 3,
  },
  floatingAiCard: {
    padding: Spacing.sm,
    elevation: 4,
    width: 220,
    backgroundColor: '#FFF',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  aiStatusBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: Radius.small,
  },
  layersMenuCard: {
    position: 'absolute',
    top: 50,
    right: Spacing.sm,
    width: 170,
    maxHeight: 280,
    padding: Spacing.sm,
    zIndex: 30,
    elevation: 6,
  },
  layersMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  layerToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: Radius.small,
    marginBottom: 2,
  },
  layerLabel: {
    marginLeft: 6,
    fontSize: 10,
  },
  detailPopupCard: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.md,
    elevation: 6,
    zIndex: 40,
    backgroundColor: '#FFF',
  },
  detailPopupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailPopupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.md,
  },
  detailPopupDesc: {
    lineHeight: 15,
    marginBottom: Spacing.md,
  },
  detailPopupStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailStatBox: {
    alignItems: 'center',
    flex: 1,
  },
  detailStatDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  detailPopupBtn: {
    height: 38,
    justifyContent: 'center',
  },
  heatmapBarContainer: {
    paddingVertical: Spacing.sm,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  heatmapsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  heatmapFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 32,
    borderRadius: Radius.circular,
    borderWidth: 1,
  },
  bottomSheetCard: {
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    elevation: 4,
    backgroundColor: '#FFF',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bottomSheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginRight: 6,
  },
  bottomGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomGridItem: {
    alignItems: 'center',
    width: '23%',
  },
  bold: {
    fontWeight: 'bold',
  },
});
