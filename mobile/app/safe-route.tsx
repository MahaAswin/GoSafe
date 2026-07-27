import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

// Custom imports
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { AppButton } from '@/src/components/common/AppButton';
import { Spacing } from '@/src/theme/spacing';
import { Radius } from '@/src/theme/radius';
import {
  MOCK_DESTINATIONS,
  MOCK_SAFE_PLACES,
  RouteDetail,
  DestinationConfig,
} from '@/src/constants/safeRouteData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SafeRouteScreen() {
  const theme = useTheme();

  // --- States ---
  const [selectedDest, setSelectedDest] = useState<DestinationConfig>(MOCK_DESTINATIONS[0]);
  const [activeRouteId, setActiveRouteId] = useState<'A' | 'B' | 'C'>('A');
  const [showDestPicker, setShowDestPicker] = useState(false);
  const [showTimelineSheet, setShowTimelineSheet] = useState(false);

  // Active route details derived from selection
  const activeRoute: RouteDetail = selectedDest.routes.find((r) => r.id === activeRouteId) || selectedDest.routes[0];

  // --- Animation Shared Values ---
  const scorePulse = useSharedValue(1);
  const mapDotsTranslate = useSharedValue(0);
  const timelineSheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const timelineBackdropOpacity = useSharedValue(0);

  // Pulse effect for Safety Score
  useEffect(() => {
    scorePulse.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 600 }),
        withTiming(1.0, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  // Moving dot flow animation on the mockup map
  useEffect(() => {
    mapDotsTranslate.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  const animatedScoreStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scorePulse.value }],
    };
  });

  // Timeline bottom sheet animation controllers
  useEffect(() => {
    if (showTimelineSheet) {
      timelineBackdropOpacity.value = withTiming(0.4, { duration: 250 });
      timelineSheetTranslateY.value = withSpring(0, { damping: 18, stiffness: 120 });
    } else {
      timelineBackdropOpacity.value = withTiming(0, { duration: 200 });
      timelineSheetTranslateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 });
    }
  }, [showTimelineSheet]);

  const animatedTimelineSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: timelineSheetTranslateY.value }],
    };
  });

  const animatedTimelineBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: timelineBackdropOpacity.value,
    };
  });

  const handleCloseTimeline = () => {
    timelineBackdropOpacity.value = withTiming(0, { duration: 200 });
    timelineSheetTranslateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 }, (finished) => {
      if (finished) {
        runOnJS(setShowTimelineSheet)(false);
      }
    });
  };

  // SOS quick triggers
  const triggerQuickSos = () => {
    Alert.alert(
      '🚨 Quick SOS Triggered',
      'Broadcasting your safety coords to guardians & emergency patrol. Dispatching nearest intercept car.'
    );
  };

  const shareLiveLocation = () => {
    Alert.alert(
      '📍 Sharing Live Path',
      'Secure companion tracking link sent to your trusted guardian network.'
    );
  };

  const callGuardian = () => {
    Alert.alert(
      '📞 Connecting SafeLine',
      'Dialing priority emergency dispatcher & direct supervisor line.'
    );
  };

  // Color mappings for threat tags
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'LOW': return '#4CAF50';
      case 'MEDIUM': return '#FF9800';
      case 'HIGH': return '#E64A19';
      case 'CRITICAL': return '#D32F2F';
      default: return 'gray';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* SECTION 1: Header */}
      <AppHeader
        title="Safe Route"
        showBackButton={true}
        actions={[
          {
            icon: 'share-variant-outline',
            onPress: shareLiveLocation,
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro header */}
        <View style={styles.introHeader}>
          <AppText variant="bodyLarge" textColor={theme.colors.onSurfaceVariant}>
            Travel with confidence. GoSafe AI analyzes community reports & risk indexes to plot secure paths.
          </AppText>
        </View>

        {/* SECTION 2: Search Cards */}
        <AppCard style={styles.searchCard}>
          <View style={styles.searchRow}>
            <View style={styles.searchIconColumn}>
              <MaterialCommunityIcons name="circle-double" size={18} color={theme.colors.primary} />
              <View style={[styles.searchConnectorDot, { backgroundColor: theme.colors.outline }]} />
              <View style={[styles.searchConnectorDot, { backgroundColor: theme.colors.outline }]} />
              <View style={[styles.searchConnectorDot, { backgroundColor: theme.colors.outline }]} />
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#D32F2F" />
            </View>
            <View style={styles.searchTextColumn}>
              <View style={styles.inputBox}>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>From</AppText>
                <AppText variant="titleSmall" style={styles.bold}>Current Location (Connaught Place)</AppText>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity
                onPress={() => setShowDestPicker(true)}
                style={styles.inputBox}
              >
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>To</AppText>
                <View style={styles.destPickerRow}>
                  <AppText variant="titleSmall" style={[styles.bold, { color: theme.colors.primary }]}>
                    {selectedDest.name}
                  </AppText>
                  <MaterialCommunityIcons name="chevron-down" size={18} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Simple Dropdown list simulator for Destinations */}
          {showDestPicker && (
            <View style={[styles.pickerDropdown, { borderColor: theme.colors.outline }]}>
              {MOCK_DESTINATIONS.map((dest) => (
                <TouchableOpacity
                  key={dest.id}
                  onPress={() => {
                    setSelectedDest(dest);
                    setActiveRouteId('A'); // Reset to Route A for new destination
                    setShowDestPicker(false);
                  }}
                  style={styles.pickerItem}
                >
                  <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.onSurfaceVariant} style={styles.pickerIcon} />
                  <AppText variant="bodyMedium" style={selectedDest.id === dest.id ? styles.bold : {}}>
                    {dest.name}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </AppCard>

        {/* SECTION 4: Mock Route Preview (Large Map Placeholder) */}
        <View style={styles.mapContainer}>
          <AppCard style={styles.mapCard}>
            {/* Styled Map Background Grid */}
            <View style={styles.mapGridCanvas}>
              {/* Decorative Street Blocks */}
              <View style={styles.blockRow}>
                <View style={styles.blockSquare} />
                <View style={styles.blockSquare} />
                <View style={styles.blockSquare} />
              </View>
              <View style={styles.blockRow}>
                <View style={styles.blockSquare} />
                <View style={styles.blockSquare} />
                <View style={styles.blockSquare} />
              </View>

              {/* Start & End Pin Visuals */}
              <View style={[styles.mapPin, { top: '75%', left: '15%' }]}>
                <View style={[styles.pinIndicator, { backgroundColor: theme.colors.primary }]} />
                <AppText variant="caption" style={styles.pinLabel}>START</AppText>
              </View>

              <View style={[styles.mapPin, { top: '20%', left: '80%' }]}>
                <View style={[styles.pinIndicator, { backgroundColor: '#D32F2F' }]} />
                <AppText variant="caption" style={styles.pinLabel}>{selectedDest.name.split(',')[0]}</AppText>
              </View>

              {/* Vector representation: Stylized lines for Route A, B, and C */}
              {/* Route A: Safest (Green line running along Akshardham Toll) */}
              <TouchableOpacity
                onPress={() => setActiveRouteId('A')}
                activeOpacity={0.8}
                style={[
                  styles.routeVectorPath,
                  styles.routePathGreen,
                  activeRouteId === 'A' && styles.activeVectorPath,
                ]}
              >
                <View style={styles.pathInnerLine} />
              </TouchableOpacity>
              <View style={[styles.routeLabelTag, { top: '48%', left: '30%', backgroundColor: '#2E7D32' }]}>
                <AppText variant="caption" style={styles.routeTagText}>Route A (Safest)</AppText>
              </View>

              {/* Route B: Balanced (Yellow path) */}
              <TouchableOpacity
                onPress={() => setActiveRouteId('B')}
                activeOpacity={0.8}
                style={[
                  styles.routeVectorPath,
                  styles.routePathYellow,
                  activeRouteId === 'B' && styles.activeVectorPath,
                ]}
              >
                <View style={styles.pathInnerLine} />
              </TouchableOpacity>
              <View style={[styles.routeLabelTag, { top: '35%', left: '45%', backgroundColor: '#FBC02D' }]}>
                <AppText variant="caption" style={[styles.routeTagText, { color: '#212121' }]}>Route B (Balanced)</AppText>
              </View>

              {/* Route C: Risky (Red path running through Mayur Vihar Tunnel) */}
              <TouchableOpacity
                onPress={() => setActiveRouteId('C')}
                activeOpacity={0.8}
                style={[
                  styles.routeVectorPath,
                  styles.routePathRed,
                  activeRouteId === 'C' && styles.activeVectorPath,
                ]}
              >
                <View style={styles.pathInnerLine} />
              </TouchableOpacity>
              <View style={[styles.routeLabelTag, { top: '65%', left: '50%', backgroundColor: '#D32F2F' }]}>
                <AppText variant="caption" style={styles.routeTagText}>Route C (Risky)</AppText>
              </View>
            </View>

            {/* Map Legend Row */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#2E7D32' }]} />
                <AppText variant="caption">Safest</AppText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#FBC02D' }]} />
                <AppText variant="caption">Balanced</AppText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: '#D32F2F' }]} />
                <AppText variant="caption">Risky (Fastest)</AppText>
              </View>
            </View>
          </AppCard>
        </View>

        {/* SECTION 3: AI Route Analysis Card */}
        <Animated.View style={[styles.scoreCardWrapper, animatedScoreStyle]}>
          <AppCard style={styles.scoreCard}>
            <View style={styles.scoreGrid}>
              <View style={styles.scoreItemColumn}>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>Safety Score</AppText>
                <AppText variant="headlineMedium" style={[styles.bold, { color: activeRoute.color }]}>
                  {activeRoute.safetyScore} / 100
                </AppText>
              </View>
              
              <View style={styles.scoreDivider} />

              <View style={styles.scoreItemColumn}>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>Risk Level</AppText>
                <AppText variant="titleLarge" style={[styles.bold, { color: activeRoute.color }]}>
                  {activeRoute.riskLevel}
                </AppText>
              </View>

              <View style={styles.scoreDivider} />

              <View style={styles.scoreItemColumn}>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>ETA & Dist</AppText>
                <AppText variant="titleMedium" style={styles.bold}>
                  {activeRoute.duration} min
                </AppText>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                  {activeRoute.distance} km
                </AppText>
              </View>
            </View>
          </AppCard>
        </Animated.View>

        {/* SECTION 5: Route Comparison Cards */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Compare Routes
          </AppText>
          <View style={styles.compareContainer}>
            {selectedDest.routes.map((route) => {
              const isActive = route.id === activeRouteId;
              return (
                <TouchableOpacity
                  key={route.id}
                  onPress={() => setActiveRouteId(route.id)}
                  style={[
                    styles.compareCard,
                    {
                      borderColor: isActive ? route.color : theme.colors.outline,
                      backgroundColor: isActive ? `${route.color}10` : theme.colors.surface,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.compareHeader}>
                    <AppText variant="titleSmall" style={styles.bold} textColor={isActive ? route.color : theme.colors.onSurface}>
                      Route {route.id}
                    </AppText>
                    <View style={[styles.compareScoreBadge, { backgroundColor: route.color }]}>
                      <AppText variant="caption" style={styles.whiteText}>
                        {route.safetyScore}% Safe
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.compareBody}>
                    <AppText variant="bodySmall" style={styles.bold}>
                      🕒 {route.duration} min
                    </AppText>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                      📏 {route.distance} km
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Timeline Access Button */}
          <AppButton
            mode="outlined"
            onPress={() => setShowTimelineSheet(true)}
            icon="timetable"
            style={styles.timelineButton}
          >
            View Complete Safety Timeline
          </AppButton>
        </View>

        {/* SECTION 6: Risk Analysis Cards */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Risk Indicators Along Selected Route
          </AppText>
          {activeRoute.risks.length > 0 ? (
            <View style={styles.risksGrid}>
              {activeRoute.risks.map((risk) => {
                const sevColor = getSeverityColor(risk.severity);
                return (
                  <View key={risk.id} style={[styles.riskCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                    <View style={[styles.riskIconCircle, { backgroundColor: `${sevColor}15` }]}>
                      <MaterialCommunityIcons name={risk.icon as any} size={20} color={sevColor} />
                    </View>
                    <View style={styles.riskInfo}>
                      <AppText variant="titleSmall" style={styles.bold}>
                        {risk.name}
                      </AppText>
                      <View style={[styles.riskSeverityTag, { backgroundColor: sevColor }]}>
                        <AppText variant="caption" style={styles.whiteText}>
                          {risk.severity} RISK
                        </AppText>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <AppCard style={styles.noRisksCard}>
              <MaterialCommunityIcons name="shield-check" size={32} color="#2E7D32" />
              <AppText variant="bodyMedium" style={[styles.bold, styles.noRisksText]}>
                Zero Critical Safety Risks Identified
              </AppText>
              <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                Secure corridor, fully monitored by local dispatch squads.
              </AppText>
            </AppCard>
          )}
        </View>

        {/* SECTION 7: Nearby Safe Places */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Nearby Safe Places
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.safePlacesScroll}
          >
            {MOCK_SAFE_PLACES.map((place) => (
              <AppCard key={place.id} style={styles.safePlaceCard}>
                <View style={styles.safePlaceHeader}>
                  <MaterialCommunityIcons name={place.icon as any} size={24} color={theme.colors.primary} />
                  <AppText variant="caption" style={[styles.bold, styles.safePlaceDist]}>
                    {place.distance}
                  </AppText>
                </View>
                <AppText variant="titleSmall" style={styles.bold} numberOfLines={1}>
                  {place.name}
                </AppText>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                  {place.type}
                </AppText>
                {place.contact !== '-' && (
                  <TouchableOpacity
                    onPress={() => Alert.alert('Dial Dispatcher', `Calling emergency line: ${place.contact}`)}
                    style={[styles.safePlaceDial, { backgroundColor: theme.colors.primaryContainer }]}
                  >
                    <MaterialCommunityIcons name="phone" size={12} color={theme.colors.primary} />
                    <AppText variant="caption" style={[styles.bold, { color: theme.colors.primary, marginLeft: 2 }]}>
                      Call {place.contact}
                    </AppText>
                  </TouchableOpacity>
                )}
              </AppCard>
            ))}
          </ScrollView>
        </View>

        {/* SECTION 8: Travel Recommendations */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Travel Guidance
          </AppText>
          <AppCard style={styles.recommendationsCard}>
            {activeRoute.recommendations.map((rec, index) => (
              <View key={index} style={styles.recItem}>
                <MaterialCommunityIcons name="alert-box-outline" size={16} color={activeRoute.color} style={styles.recIcon} />
                <AppText variant="bodyMedium" style={styles.recText}>
                  {rec}
                </AppText>
              </View>
            ))}
          </AppCard>
        </View>

        {/* SECTION 9: AI Explanation Card */}
        <View style={styles.sectionContainer}>
          <AppCard style={[styles.aiCard, { borderColor: theme.colors.outline }]}>
            <View style={styles.aiHeader}>
              <MaterialCommunityIcons name="robot" size={20} color="#5E35B1" />
              <AppText variant="titleMedium" style={[styles.bold, styles.aiTitle]}>
                GoSafe AI Recommendation
              </AppText>
            </View>
            <AppText variant="bodyMedium" style={styles.aiBody} textColor={theme.colors.onSurfaceVariant}>
              "{activeRoute.explanation}"
            </AppText>
          </AppCard>
        </View>

        {/* SECTION 10: Emergency Button Group */}
        <View style={styles.sectionContainer}>
          <AppCard style={[styles.emergencyCard, { backgroundColor: '#FFEBEE' }]}>
            <AppText variant="titleMedium" style={[styles.bold, { color: '#C62828' }]}>
              Feeling Unsafe Along Your Route?
            </AppText>
            <AppText variant="bodySmall" style={styles.emergencyCardSub} textColor="#C62828">
              Trigger rapid-alert systems to contact law enforcement or guardians immediately.
            </AppText>
            <View style={styles.emergencyBtnRow}>
              <TouchableOpacity onPress={triggerQuickSos} style={[styles.emergencyBtn, { backgroundColor: '#D32F2F' }]}>
                <MaterialCommunityIcons name="alert-octagon" size={18} color="#FFF" />
                <AppText variant="caption" style={styles.emergencyBtnText}>Quick SOS</AppText>
              </TouchableOpacity>

              <TouchableOpacity onPress={shareLiveLocation} style={[styles.emergencyBtn, { backgroundColor: '#C62828' }]}>
                <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#FFF" />
                <AppText variant="caption" style={styles.emergencyBtnText}>Share Path</AppText>
              </TouchableOpacity>

              <TouchableOpacity onPress={callGuardian} style={[styles.emergencyBtn, { backgroundColor: '#E53935' }]}>
                <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
                <AppText variant="caption" style={styles.emergencyBtnText}>Call SafeLine</AppText>
              </TouchableOpacity>
            </View>
          </AppCard>
        </View>
      </ScrollView>

      {/* SECTION 11: Route Timeline Bottom Sheet */}
      <Portal>
        <View style={StyleSheet.absoluteFillObject} pointerEvents={showTimelineSheet ? 'auto' : 'none'}>
          {/* Backdrop overlay */}
          <Animated.View style={[styles.sheetBackdrop, animatedTimelineBackdropStyle]}>
            <TouchableOpacity style={styles.flex} onPress={handleCloseTimeline} />
          </Animated.View>

          {/* Bottom Sheet Card */}
          <Animated.View
            style={[
              styles.sheetCard,
              { backgroundColor: theme.colors.elevation.level3 },
              animatedTimelineSheetStyle,
            ]}
          >
            {/* Drag Bar */}
            <View style={styles.dragContainer}>
              <View style={[styles.dragHandle, { backgroundColor: theme.colors.outlineVariant || '#CCCCCC' }]} />
            </View>

            {/* Title */}
            <View style={styles.sheetHeader}>
              <MaterialCommunityIcons name="routes" size={24} color={activeRoute.color} />
              <View style={styles.sheetHeaderTitle}>
                <AppText variant="titleMedium" style={styles.bold}>
                  Route {activeRouteId} Timeline
                </AppText>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                  Segment safety parameters and safe houses
                </AppText>
              </View>
              <TouchableOpacity onPress={handleCloseTimeline} style={styles.sheetCloseBtn}>
                <MaterialCommunityIcons name="close" size={20} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>

            {/* Timeline scroll */}
            <ScrollView contentContainerStyle={styles.timelineList}>
              {activeRoute.timeline.map((step, index) => {
                const stepColor =
                  step.status === 'safe'
                    ? '#2E7D32'
                    : step.status === 'warning'
                    ? '#FBC02D'
                    : '#D32F2F';

                return (
                  <View key={index} style={styles.timelineItem}>
                    {/* Visual Segment Line */}
                    <View style={styles.timelineLineColumn}>
                      <View style={[styles.timelineNodeCircle, { backgroundColor: stepColor }]} />
                      {index < activeRoute.timeline.length - 1 && (
                        <View style={[styles.timelineVerticalLine, { backgroundColor: theme.colors.outline }]} />
                      )}
                    </View>

                    <View style={styles.timelineInfoColumn}>
                      <View style={styles.timelineItemHeader}>
                        <AppText variant="titleSmall" style={styles.bold}>
                          {step.location}
                        </AppText>
                        <AppText variant="caption" style={[styles.timelineTimeText, { backgroundColor: `${stepColor}15`, color: stepColor }]}>
                          {step.time}
                        </AppText>
                      </View>
                      <AppText variant="bodySmall" style={styles.timelineItemDetail}>
                        {step.detail}
                      </AppText>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.massive,
  },
  introHeader: {
    marginBottom: Spacing.md,
  },
  searchCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 3,
  },
  searchRow: {
    flexDirection: 'row',
  },
  searchIconColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    width: 24,
    marginRight: Spacing.sm,
  },
  searchConnectorDot: {
    width: 3,
    height: 3,
    borderRadius: Radius.circular,
  },
  searchTextColumn: {
    flex: 1,
  },
  inputBox: {
    paddingVertical: Spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: Spacing.xs,
  },
  bold: {
    fontWeight: 'bold',
  },
  destPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  pickerDropdown: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.medium,
    padding: Spacing.sm,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  pickerIcon: {
    marginRight: Spacing.sm,
  },
  mapContainer: {
    marginVertical: Spacing.xs,
  },
  mapCard: {
    padding: Spacing.md,
  },
  mapGridCanvas: {
    height: 200,
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.large,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  blockRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Spacing.lg,
    opacity: 0.15,
  },
  blockSquare: {
    width: 70,
    height: 50,
    borderWidth: 2,
    borderColor: '#78909C',
    borderStyle: 'dashed',
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pinIndicator: {
    width: 14,
    height: 14,
    borderRadius: Radius.circular,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 3,
  },
  pinLabel: {
    fontWeight: 'bold',
    fontSize: 9,
    marginTop: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 4,
    borderRadius: Radius.small,
  },
  routeVectorPath: {
    position: 'absolute',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routePathGreen: {
    top: '40%',
    left: '20%',
    width: '62%',
    height: 60,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    borderColor: '#2E7D32',
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    opacity: 0.55,
  },
  routePathYellow: {
    top: '30%',
    left: '20%',
    width: '62%',
    height: 80,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderColor: '#FBC02D',
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 20,
    opacity: 0.55,
  },
  routePathRed: {
    top: '60%',
    left: '20%',
    width: '62%',
    height: 35,
    borderBottomWidth: 6,
    borderColor: '#D32F2F',
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 5,
    opacity: 0.55,
  },
  activeVectorPath: {
    borderTopWidth: 9,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 9,
    opacity: 1.0,
    zIndex: 5,
  },
  pathInnerLine: {
    // Spacer representation
  },
  routeLabelTag: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.small,
    elevation: 2,
  },
  routeTagText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: Radius.circular,
    marginRight: 6,
  },
  scoreCardWrapper: {
    marginVertical: Spacing.sm,
  },
  scoreCard: {
    padding: Spacing.md,
    elevation: 4,
  },
  scoreGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreItemColumn: {
    flex: 1,
    alignItems: 'center',
  },
  scoreDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sectionContainer: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  compareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  compareCard: {
    width: '32%',
    padding: Spacing.sm,
    borderRadius: Radius.medium,
    borderWidth: 1,
  },
  compareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compareScoreBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: Radius.small,
  },
  compareBody: {
    marginTop: 4,
  },
  whiteText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  timelineButton: {
    marginTop: Spacing.xs,
  },
  risksGrid: {
    flexDirection: 'column',
  },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    elevation: 1,
  },
  riskIconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  riskInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskSeverityTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.small,
  },
  noRisksCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRisksText: {
    color: '#2E7D32',
    marginTop: Spacing.sm,
    marginBottom: 2,
  },
  safePlacesScroll: {
    paddingVertical: Spacing.xs,
  },
  safePlaceCard: {
    width: 140,
    padding: Spacing.md,
    marginRight: Spacing.md,
    borderRadius: Radius.large,
    elevation: 2,
  },
  safePlaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  safePlaceDist: {
    color: 'gray',
  },
  safePlaceDial: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: Radius.small,
    marginTop: Spacing.sm,
  },
  recommendationsCard: {
    padding: Spacing.md,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  recIcon: {
    marginRight: Spacing.sm,
  },
  recText: {
    flex: 1,
    lineHeight: 18,
  },
  aiCard: {
    padding: Spacing.md,
    borderWidth: 1.5,
    backgroundColor: '#F5F3FF',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  aiTitle: {
    color: '#4A148C',
    marginLeft: Spacing.sm,
  },
  aiBody: {
    fontStyle: 'italic',
    lineHeight: 20,
    color: '#5E35B1',
  },
  emergencyCard: {
    padding: Spacing.md,
  },
  emergencyCardSub: {
    lineHeight: 16,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  emergencyBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.medium,
    marginHorizontal: 3,
    elevation: 3,
  },
  emergencyBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheetCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.45,
    borderTopLeftRadius: Radius.extraLarge * 1.5,
    borderTopRightRadius: Radius.extraLarge * 1.5,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  dragContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: Radius.circular,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  sheetHeaderTitle: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  sheetCloseBtn: {
    padding: 4,
  },
  timelineList: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 65,
  },
  timelineLineColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: Spacing.md,
  },
  timelineNodeCircle: {
    width: 14,
    height: 14,
    borderRadius: Radius.circular,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 2,
    zIndex: 1,
  },
  timelineVerticalLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  timelineInfoColumn: {
    flex: 1,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTimeText: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.small,
    fontSize: 9,
    fontWeight: 'bold',
  },
  timelineItemDetail: {
    lineHeight: 16,
    color: 'gray',
    marginTop: 2,
  },
});
