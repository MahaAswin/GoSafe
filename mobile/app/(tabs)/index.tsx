import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useTheme, Avatar, IconButton, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring } from 'react-native-reanimated';

// Custom reusable components and assets
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { AppButton } from '@/src/components/common/AppButton';
import { ProfilePlaceholder } from '@/src/assets';
import { Spacing } from '@/src/theme/spacing';
import { Radius } from '@/src/theme/radius';
import { AppIcons } from '@/src/constants';

export default function HomeScreen() {
  const theme = useTheme();

  // SOS States
  const [sosStatus, setSosStatus] = useState<'ready' | 'holding' | 'activated'>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [isRefreshingLoc, setIsRefreshingLoc] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const safetyTips = [
    'Stay aware of your surroundings.',
    'Share your live location with trusted contacts.',
    'Avoid isolated roads at night.',
  ];

  // Mock data for nearby emergency services
  const emergencyServices = [
    { id: '1', name: 'City General Hospital', type: '🏥 Hospital', dist: '450m away', availability: 'Beds Available', color: '#EF5350' },
    { id: '2', name: 'District HQ Police Station', type: '🚓 Police', dist: '1.2km away', availability: '24/7 Active', color: '#42A5F5' },
    { id: '3', name: 'Fire Rescue Station 4', type: '🚒 Fire Station', dist: '2.5km away', availability: 'On Standby', color: '#FF7043' },
    { id: '4', name: 'Safe Shelter Hall', type: '🛡 Shelter', dist: '3.1km away', availability: '12 Slots Open', color: '#AB47BC' },
  ];

  // Mock data for recent safety alerts
  const recentAlerts = [
    { id: '1', title: 'Road Accident', desc: 'Accident reported on NH-8. Expect traffic delays.', time: '10m ago', severity: 'High', color: '#D32F2F', icon: AppIcons.accident },
    { id: '2', title: 'Street Light Failure', desc: 'Dark segment in Sector 4 residential corridor.', time: '1h ago', severity: 'Medium', color: '#EF6C00', icon: AppIcons.lightFailure },
    { id: '3', title: 'Flood Warning', desc: 'Heavy rains are causing waterlogging in low tunnels.', time: '3h ago', severity: 'High', color: '#D32F2F', icon: AppIcons.flood },
    { id: '4', title: 'Suspicious Activity', desc: 'Suspicious gathering reported near municipal park.', time: '5h ago', severity: 'Low', color: '#0D47A1', icon: AppIcons.suspicious },
  ];

  // Pulsing SOS effect
  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.35, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  // Safety tips interval rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % safetyTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSosPressIn = () => {
    if (sosStatus === 'activated') return;

    setSosStatus('holding');
    setCountdown(3);
    buttonScale.value = withSpring(0.9);

    let count = 3;
    timerRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timerRef.current!);
        setSosStatus('activated');
        buttonScale.value = withSpring(1.05);
        Alert.alert('Emergency Activated', 'Mock SOS signals broadcasted successfully.');
      }
    }, 1000);
  };

  const handleSosPressOut = () => {
    if (sosStatus === 'activated') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSosStatus('ready');
    setCountdown(3);
    buttonScale.value = withSpring(1);
  };

  const handleCancelSos = () => {
    setSosStatus('ready');
    setCountdown(3);
    buttonScale.value = withSpring(1);
    Alert.alert('SOS Cancelled', 'Alert states reset to standby.');
  };

  const handleRefreshLocation = () => {
    setIsRefreshingLoc(true);
    setTimeout(() => {
      setIsRefreshingLoc(false);
      Alert.alert('Location Synchronized', 'GPS coordinate matrices updated.');
    }, 1500);
  };

  const animatedRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: 1.35 - pulseScale.value,
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Header Navigation */}
      <AppHeader
        title="GoSafe Dashboard"
        actions={[
          {
            icon: AppIcons.bell,
            onPress: () => Alert.alert('Notifications', 'System notification center is empty.'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: Greeting & Avatar */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.greetingSection}>
          <View style={styles.greetingTextWrapper}>
            <AppText variant="bodyMedium" textColor={theme.colors.onSurfaceVariant}>
              Good Morning,
            </AppText>
            <AppText variant="headlineSmall" style={styles.bold}>
              John Doe
            </AppText>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.8}>
            <Avatar.Image size={56} source={ProfilePlaceholder} style={styles.avatar} />
          </TouchableOpacity>
        </Animated.View>

        {/* SECTION 2: Current Location Card with Safety Score */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <AppCard style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationLeft}>
                <MaterialCommunityIcons name={AppIcons.gps as any} size={24} color={theme.colors.primary} />
                <View style={styles.locationText}>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant} style={styles.bold}>
                    CURRENT ADDRESS
                  </AppText>
                  <AppText variant="bodyMedium" style={[styles.bold, styles.addressText]}>
                    Connaught Place, New Delhi, India
                  </AppText>
                </View>
              </View>
              <IconButton
                icon={AppIcons.refresh}
                size={22}
                iconColor={theme.colors.primary}
                loading={isRefreshingLoc}
                onPress={handleRefreshLocation}
              />
            </View>

            <View style={styles.scoreContainer}>
              <View style={[styles.scoreBadge, { backgroundColor: '#2E7D3215' }]}>
                <MaterialCommunityIcons name={AppIcons.shieldCheck as any} size={20} color="#2E7D32" />
                <AppText variant="bodyMedium" style={[styles.bold, styles.scoreText]}>
                  Safety Score: 87 / 100
                </AppText>
              </View>
              <AppText variant="caption" textColor="#2E7D32" style={styles.bold}>
                SECURE ZONE
              </AppText>
            </View>
          </AppCard>
        </Animated.View>

        {/* SECTION 3: Large Emergency SOS Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <AppCard style={[styles.sosCard, { backgroundColor: '#D32F2F' }]}>
            <View style={styles.sosCardContent}>
              <View style={styles.sosTextInfo}>
                <AppText variant="titleLarge" style={[styles.bold, styles.whiteText]}>
                  {sosStatus === 'activated' ? 'EMERGENCY ACTIVE' : 'SMART SOS DISPATCH'}
                </AppText>
                <AppText variant="bodySmall" style={styles.sosCardDesc}>
                  {sosStatus === 'activated'
                    ? 'Help signal broadcasted. First responders notified.'
                    : 'Hold for 3 seconds to activate emergency.'}
                </AppText>
                {sosStatus === 'activated' && (
                  <AppButton mode="contained" onPress={handleCancelSos} style={styles.cancelSosBtn} textColor="#D32F2F" buttonColor="#ffffff">
                    CANCEL SIGNAL
                  </AppButton>
                )}
              </View>

              <View style={styles.sosButtonContainer}>
                {sosStatus !== 'activated' && (
                  <Animated.View style={[styles.sosPulseRing, animatedRingStyle]} />
                )}
                <Animated.View style={animatedButtonStyle}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPressIn={handleSosPressIn}
                    onPressOut={handleSosPressOut}
                    style={styles.sosTriggerBtn}
                  >
                    <AppText style={styles.sosTriggerText}>
                      {sosStatus === 'activated' ? 'SOS' : sosStatus === 'holding' ? `${countdown}s` : 'SOS'}
                    </AppText>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </AppCard>
        </Animated.View>

        {/* SECTION 4: Quick Actions Grid */}
        <AppText variant="titleMedium" style={[styles.sectionTitle, styles.bold]}>
          Quick Actions
        </AppText>
        <View style={styles.grid}>
          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.gridItem}>
            <AppCard style={styles.gridCard}>
              <TouchableRipple
                onPress={() => router.push('/(tabs)/heatmap')}
                rippleColor="rgba(13, 71, 161, 0.1)"
                style={styles.gridRipple}
              >
                <View>
                  <MaterialCommunityIcons name={AppIcons.heatmap as any} size={28} color={theme.colors.primary} />
                  <AppText variant="titleSmall" style={[styles.bold, styles.gridTitle]}>
                    Safety Heatmap
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                    Threat hotspot zones
                  </AppText>
                </View>
              </TouchableRipple>
            </AppCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.gridItem}>
            <AppCard style={styles.gridCard}>
              <TouchableRipple
                onPress={() => Alert.alert('Live Tracking', 'Companion share path initiated.')}
                rippleColor="rgba(13, 71, 161, 0.1)"
                style={styles.gridRipple}
              >
                <View>
                  <MaterialCommunityIcons name={AppIcons.tracking as any} size={28} color="#2E7D32" />
                  <AppText variant="titleSmall" style={[styles.bold, styles.gridTitle]}>
                    Live Tracking
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                    Track journeys
                  </AppText>
                </View>
              </TouchableRipple>
            </AppCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.gridItem}>
            <AppCard style={styles.gridCard}>
              <TouchableRipple
                onPress={() => router.push('/(tabs)/complaint')}
                rippleColor="rgba(13, 71, 161, 0.1)"
                style={styles.gridRipple}
              >
                <View>
                  <MaterialCommunityIcons name={AppIcons.report as any} size={28} color="#EF6C00" />
                  <AppText variant="titleSmall" style={[styles.bold, styles.gridTitle]}>
                    Report Hazard
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                    File area concerns
                  </AppText>
                </View>
              </TouchableRipple>
            </AppCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.gridItem}>
            <AppCard style={styles.gridCard}>
              <TouchableRipple
                onPress={() => Alert.alert('Safe Route', 'Finding hazard-free path routes.')}
                rippleColor="rgba(13, 71, 161, 0.1)"
                style={styles.gridRipple}
              >
                <View>
                  <MaterialCommunityIcons name={AppIcons.route as any} size={28} color="#8E24AA" />
                  <AppText variant="titleSmall" style={[styles.bold, styles.gridTitle]}>
                    Safe Route
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                    Avoid alert corridors
                  </AppText>
                </View>
              </TouchableRipple>
            </AppCard>
          </Animated.View>
        </View>

        {/* SECTION 5: Nearby Emergency Services */}
        <AppText variant="titleMedium" style={[styles.sectionTitle, styles.bold]}>
          Nearby Rescue Services
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {emergencyServices.map((service, index) => (
            <Animated.View key={service.id} entering={FadeInRight.duration(300).delay(100 * index)}>
              <AppCard style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <View style={[styles.serviceIconWrapper, { backgroundColor: service.color + '15' }]}>
                    <AppText style={{ fontSize: 20 }}>
                      {service.type.split(' ')[0]}
                    </AppText>
                  </View>
                  <View style={styles.serviceMeta}>
                    <AppText variant="titleSmall" style={[styles.bold, styles.serviceName]} numberOfLines={1}>
                      {service.name}
                    </AppText>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                      {service.dist} • {service.availability}
                    </AppText>
                  </View>
                </View>
                <AppButton
                  mode="outlined"
                  onPress={() => Alert.alert('Navigation Route', `Plotting route directions to ${service.name}`)}
                  style={styles.navigateBtn}
                >
                  NAVIGATE
                </AppButton>
              </AppCard>
            </Animated.View>
          ))}
        </ScrollView>

        {/* SECTION 6: Recent Safety Alerts */}
        <AppText variant="titleMedium" style={[styles.sectionTitle, styles.bold]}>
          Recent Local Threat Feeds
        </AppText>
        <View style={styles.alertsList}>
          {recentAlerts.map((alert, index) => (
            <Animated.View key={alert.id} entering={FadeInDown.duration(400).delay(400 + index * 50)}>
              <AppCard style={[styles.alertCard, { borderLeftWidth: 4, borderLeftColor: alert.color }]}>
                <View style={styles.alertRow}>
                  <View style={[styles.alertIconBg, { backgroundColor: alert.color + '15' }]}>
                    <MaterialCommunityIcons name={alert.icon as any} size={22} color={alert.color} />
                  </View>
                  <View style={styles.alertContent}>
                    <AppText variant="titleSmall" style={styles.bold}>
                      {alert.title}
                    </AppText>
                    <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                      {alert.desc}
                    </AppText>
                  </View>
                  <View style={styles.alertMeta}>
                    <AppText variant="caption" style={[styles.alertBadge, { color: alert.color, backgroundColor: alert.color + '15' }]}>
                      {alert.severity.toUpperCase()}
                    </AppText>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant} style={styles.alertTime}>
                      {alert.time}
                    </AppText>
                  </View>
                </View>
              </AppCard>
            </Animated.View>
          ))}
        </View>

        {/* SECTION 7: Rotating Safety Tip Banner */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)}>
          <AppCard style={styles.tipsCard}>
            <View style={styles.tipsRow}>
              <MaterialCommunityIcons name={AppIcons.shieldSearch as any} size={24} color={theme.colors.primary} />
              <View style={styles.tipsText}>
                <AppText variant="titleSmall" style={styles.bold}>
                  SAFETY RECOMMENDATION
                </AppText>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant} numberOfLines={2}>
                  {safetyTips[currentTipIndex]}
                </AppText>
              </View>
            </View>
          </AppCard>
        </Animated.View>

        <View style={{ height: Spacing.huge }} />
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
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  greetingTextWrapper: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  avatar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  locationCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.xs,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  addressText: {
    marginTop: Spacing.xs,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.circular,
  },
  scoreText: {
    marginLeft: Spacing.sm,
    color: '#2E7D32',
  },
  sosCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.xs,
    elevation: 6,
  },
  sosCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sosTextInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  whiteText: {
    color: '#ffffff',
  },
  sosCardDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    marginVertical: Spacing.sm,
  },
  cancelSosBtn: {
    marginVertical: 0,
    marginTop: Spacing.xs,
  },
  sosButtonContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sosPulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  sosTriggerBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  sosTriggerText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionTitle: {
    marginVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  gridCard: {
    marginVertical: 0,
    height: 120,
    overflow: 'hidden',
  },
  gridRipple: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  gridTitle: {
    marginTop: Spacing.sm,
  },
  carousel: {
    paddingRight: Spacing.lg,
  },
  serviceCard: {
    width: 220,
    marginRight: Spacing.md,
    padding: Spacing.xs,
    marginVertical: 0,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  serviceMeta: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
  },
  navigateBtn: {
    marginTop: Spacing.md,
    marginVertical: 0,
  },
  alertsList: {
    marginTop: Spacing.xs,
  },
  alertCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.xs,
    marginVertical: 0,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIconBg: {
    width: 40,
    height: 40,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  alertContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  alertMeta: {
    alignItems: 'flex-end',
  },
  alertBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.small,
    fontSize: 9,
    fontWeight: 'bold',
  },
  alertTime: {
    marginTop: Spacing.xs,
  },
  tipsCard: {
    marginTop: Spacing.lg,
    padding: Spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: '#0D47A1',
  },
  tipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
