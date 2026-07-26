import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Animated as RNAnimated, Easing } from 'react-native';
import { useTheme, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring } from 'react-native-reanimated';

// Custom reusable components and constants
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { AppButton } from '@/src/components/common/AppButton';
import { ProfilePlaceholder } from '@/src/assets';
import { Spacing } from '@/src/theme/spacing';
import { Radius } from '@/src/theme/radius';
import { AppIcons } from '@/src/constants';

export default function SosScreen() {
  const theme = useTheme();
  const [status, setStatus] = useState<'ready' | 'holding' | 'activated'>('ready');
  const [countdown, setCountdown] = useState<number>(3);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Interval and animation references
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const safetyTips = [
    'Stay calm & take deep, slow breaths.',
    'Move to a populated, well-lit safety zone if possible.',
    'Keep your phone battery saved; dim screen brightness.',
    'Share your live tracking links with trusted guardians.',
    'Do not confront the threat directly; seek public help.',
  ];

  const mockContacts = [
    { id: '1', name: 'Mother', phone: '+1 234-567-8901', relation: 'Family Link', icon: AppIcons.mother },
    { id: '2', name: 'Father', phone: '+1 234-567-8902', relation: 'Family Link', icon: AppIcons.father },
    { id: '3', name: 'Best Friend', phone: '+1 234-567-8903', relation: 'Trusted Buddy', icon: AppIcons.friend },
  ];

  const mockHistory = [
    { id: '1', time: 'Yesterday, 8:45 PM', location: 'Sector 4 Metro Station', status: 'Resolved' },
    { id: '2', time: '3 days ago, 11:20 AM', location: 'Connaught Place Center', status: 'Cancelled' },
  ];

  // Initialize pulsing ring animation
  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.35, { duration: 1600 }),
      -1,
      false
    );
  }, []);

  // Rotate safety tips every 5 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % safetyTips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  const handlePressIn = () => {
    if (status === 'activated') return;

    setStatus('holding');
    setCountdown(3);
    buttonScale.value = withSpring(0.9);

    // Start 3 second countdown timer
    let count = 3;
    timerRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timerRef.current!);
        setStatus('activated');
        buttonScale.value = withSpring(1.05);
        Alert.alert(
          'Emergency SOS Triggered!',
          'Your current GPS location and crisis reports have been broadcasted to guardians & local dispatch networks.'
        );
      }
    }, 1000);
  };

  const handlePressOut = () => {
    if (status === 'activated') return;

    // Reset hold state if released early
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setStatus('ready');
    setCountdown(3);
    buttonScale.value = withSpring(1);
  };

  const cancelEmergency = () => {
    setStatus('ready');
    setCountdown(3);
    buttonScale.value = withSpring(1);
    Alert.alert('SOS Cancelled', 'Broadcast channels closed and safety alerts revoked.');
  };

  // Reanimated style bindings
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

  const getStatusMessage = () => {
    switch (status) {
      case 'holding':
        return 'Hold tight! Sending...';
      case 'activated':
        return 'CRISIS SIGNAL ACTIVE';
      default:
        return 'SOS Protection Standby';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'holding':
        return '#EF6C00'; // Warning Orange
      case 'activated':
        return '#D32F2F'; // Emergency Red
      default:
        return '#2E7D32'; // Success Green
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 1. Header Navigation */}
      <AppHeader
        title="Emergency SOS"
        showBackButton={true}
        actions={[
          {
            icon: AppIcons.settings,
            onPress: () => Alert.alert('SOS Settings', 'Emergency contacts and dispatch ranges can be configured here.'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. Large pulsing SOS Button Section */}
        <View style={styles.triggerContainer}>
          {status !== 'activated' && (
            <Animated.View
              style={[
                styles.pulseRing,
                { backgroundColor: status === 'holding' ? '#EF6C0020' : '#D32F2F15' },
                animatedRingStyle,
              ]}
            />
          )}
          <Animated.View style={[styles.sosButtonWrapper, animatedButtonStyle]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onLongPress={() => {}} // Standard triggers handled by PressIn/PressOut
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[
                styles.sosButton,
                { backgroundColor: status === 'activated' ? '#D32F2F' : status === 'holding' ? '#EF6C00' : '#B00020' },
              ]}
            >
              <MaterialCommunityIcons
                name={status === 'activated' ? AppIcons.sosActive as any : AppIcons.sosStandby as any}
                size={44}
                color="white"
              />
              <AppText variant="titleMedium" style={styles.sosBtnText}>
                {status === 'activated' ? 'ACTIVE' : status === 'holding' ? `${countdown}s` : 'HOLD FOR SOS'}
              </AppText>
              <AppText variant="caption" style={styles.sosSubtext}>
                {status === 'activated' ? 'Tap to Cancel' : status === 'holding' ? 'KEEP HOLDING' : 'Hold 3 Seconds'}
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* 3. Emergency Status Card */}
        <AppCard style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <View style={styles.statusTextWrapper}>
              <AppText variant="titleSmall" style={styles.bold}>
                {getStatusMessage()}
              </AppText>
              <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                {status === 'activated'
                  ? 'Responders & guardians have been alerted.'
                  : 'Coordinates will sync instantly on activation.'}
              </AppText>
            </View>
            {status === 'activated' && (
              <AppButton mode="contained" onPress={cancelEmergency} buttonColor={theme.colors.primary} style={styles.cancelBtn}>
                CANCEL
              </AppButton>
            )}
          </View>
        </AppCard>

        {/* 4. Rotating Safety Tips Banner */}
        <AppCard style={styles.tipsCard}>
          <View style={styles.tipsRow}>
            <MaterialCommunityIcons name={AppIcons.tipIdea as any} size={24} color="#FBC02D" style={styles.tipIcon} />
            <View style={styles.tipTextWrapper}>
              <AppText variant="titleSmall" style={styles.bold}>
                SAFETY TIP
              </AppText>
              <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant} numberOfLines={2}>
                {safetyTips[currentTipIndex]}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* 5. Quick Emergency Actions */}
        <AppText variant="titleMedium" style={[styles.sectionTitle, styles.bold]}>
          Quick Assistance
        </AppText>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Calling Police', 'Dialing local Smart Police Dispatch...')}
          >
            <AppCard style={styles.actionCard}>
              <MaterialCommunityIcons name={AppIcons.police as any} size={32} color="#0D47A1" />
              <AppText variant="titleSmall" style={[styles.bold, styles.actionLabel]}>
                Police
              </AppText>
            </AppCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Calling Ambulance', 'Dialing nearest Emergency Trauma Center...')}
          >
            <AppCard style={styles.actionCard}>
              <MaterialCommunityIcons name={AppIcons.ambulance as any} size={32} color="#D32F2F" />
              <AppText variant="titleSmall" style={[styles.bold, styles.actionLabel]}>
                Ambulance
              </AppText>
            </AppCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Calling Fire Department', 'Dialing local Fire Rescue HQ...')}
          >
            <AppCard style={styles.actionCard}>
              <MaterialCommunityIcons name={AppIcons.fire as any} size={32} color="#EF6C00" />
              <AppText variant="titleSmall" style={[styles.bold, styles.actionLabel]}>
                Fire
              </AppText>
            </AppCard>
          </TouchableOpacity>
        </View>

        {/* 6. Emergency Contacts */}
        <AppText variant="titleMedium" style={[styles.sectionTitle, styles.bold]}>
          Priority Guardians
        </AppText>
        {mockContacts.map((contact) => (
          <AppCard key={contact.id} style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Avatar.Icon
                size={40}
                icon={contact.icon}
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.primary}
              />
              <View style={styles.contactDetails}>
                <AppText variant="titleSmall" style={styles.bold}>
                  {contact.name}
                </AppText>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                  {contact.phone} • {contact.relation}
                </AppText>
              </View>
              <AppButton
                mode="outlined"
                onPress={() => Alert.alert('Dialing Guardian', `Connecting call to ${contact.name}`)}
                style={styles.callBtn}
              >
                CALL
              </AppButton>
            </View>
          </AppCard>
        ))}

        {/* 7. Emergency History */}
        <AppText variant="titleMedium" style={[styles.sectionTitle, styles.bold]}>
          Recent Activations Log
        </AppText>
        {mockHistory.map((history) => (
          <AppCard key={history.id} style={styles.historyCard}>
            <View style={styles.historyRow}>
              <View>
                <AppText variant="titleSmall" style={styles.bold}>
                  {history.location}
                </AppText>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                  {history.time}
                </AppText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: history.status === 'Resolved' ? '#2E7D3215' : '#75757515' }]}>
                <AppText
                  variant="caption"
                  style={[styles.bold, { color: history.status === 'Resolved' ? '#2E7D32' : '#757575' }]}
                >
                  {history.status.toUpperCase()}
                </AppText>
              </View>
            </View>
          </AppCard>
        ))}

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
  triggerContainer: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  sosButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sosButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sosBtnText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: Spacing.sm,
    fontSize: 18,
    textAlign: 'center',
  },
  sosSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xs,
    fontSize: 11,
    textAlign: 'center',
  },
  statusCard: {
    marginBottom: Spacing.md,
    padding: Spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.circular,
    marginRight: Spacing.md,
  },
  statusTextWrapper: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  cancelBtn: {
    marginVertical: 0,
    marginLeft: Spacing.sm,
  },
  tipsCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  tipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    marginRight: Spacing.md,
  },
  tipTextWrapper: {
    flex: 1,
  },
  sectionTitle: {
    marginVertical: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionItem: {
    flex: 0.31,
  },
  actionCard: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  actionLabel: {
    marginTop: Spacing.sm,
  },
  contactCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.xs,
    marginVertical: 0,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  callBtn: {
    marginVertical: 0,
  },
  historyCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.xs,
    marginVertical: 0,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.small,
  },
});
