import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
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
  MOCK_EMERGENCY_CONTACTS,
  MOCK_EMERGENCY_OPTIONS,
  MOCK_NEARBY_RESPONDERS,
  MOCK_SOS_HISTORY,
  EmergencyOption,
} from '@/src/constants/sosMockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SosScreen() {
  const theme = useTheme();

  // --- SOS Status States ---
  // ready: standby, holding: user pressing down, activated: emergency broadcast triggered
  const [status, setStatus] = useState<'ready' | 'holding' | 'activated'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [selectedOption, setSelectedOption] = useState<EmergencyOption | null>(null);

  // --- Evidence Recorders Mock States ---
  const [recordingMic, setRecordingMic] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [capturingPhoto, setCapturingPhoto] = useState(false);

  // --- Setting parameters ---
  const [countdownTime, setCountdownTime] = useState(3); // default 3s
  const [autoLocationShare, setAutoLocationShare] = useState(true);
  const [communityAlertsEnabled, setCommunityAlertsEnabled] = useState(true);

  // --- Animations ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  // SOS pulse rings
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1500 }),
        withTiming(1.0, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

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

  // --- Actions ---
  const handlePressIn = () => {
    if (status === 'activated') return;

    setStatus('holding');
    setCountdown(countdownTime);
    buttonScale.value = withSpring(0.9);

    let count = countdownTime;
    timerRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timerRef.current!);
        setStatus('activated');
        buttonScale.value = withSpring(1.05);
        Alert.alert(
          '🚨 SOS Active',
          'Emergency distress broadcast successfully activated. Nearest responder and trusted guardians notified.'
        );
      }
    }, 1000);
  };

  const handlePressOut = () => {
    if (status === 'activated') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setStatus('ready');
    setCountdown(countdownTime);
    buttonScale.value = withSpring(1);
  };

  const handleCancelEmergency = () => {
    setStatus('ready');
    setCountdown(countdownTime);
    buttonScale.value = withSpring(1);
    Alert.alert('SOS Deactivated', 'Emergency broadcast revoked. Coords cleared from dispatch network.');
  };

  const handleQuickContactAction = (name: string, actionType: 'Call' | 'Message') => {
    Alert.alert(
      '🔒 Secure Link Active',
      `Connecting to ${name} via secure VoIP ${actionType} is coming soon in the next release.`
    );
  };

  const handleEvidenceAction = (type: 'mic' | 'video' | 'photo') => {
    if (type === 'mic') {
      setRecordingMic(!recordingMic);
    } else if (type === 'video') {
      setRecordingVideo(!recordingVideo);
    } else if (type === 'photo') {
      setCapturingPhoto(true);
      setTimeout(() => {
        setCapturingPhoto(false);
        Alert.alert('Evidence Captured', 'Snapshot logged in local crisis registry.');
      }, 800);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'holding': return '#EF6C00'; // Orange
      case 'activated': return '#D32F2F'; // Red
      default: return '#2E7D32'; // Green
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* SECTION 1: Header */}
      <AppHeader
        title="Smart SOS"
        showBackButton={true}
        actions={[
          {
            icon: 'cog-outline',
            onPress: () => Alert.alert('Settings Panel', 'Configure automatic emergency dispatch criteria.'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.introHeader}>
          <AppText variant="bodyLarge" textColor={theme.colors.onSurfaceVariant}>
            Emergency assistance in seconds. Tap & hold the button to raise an alarm.
          </AppText>
        </View>

        {/* SECTION 2: Current Status Card */}
        <AppCard style={styles.statusCard}>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
              <View style={styles.statusItemTextCol}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>CURRENT LOCATION</AppText>
                <AppText variant="bodySmall" style={styles.bold} numberOfLines={1}>Connaught Place, New Delhi</AppText>
              </View>
            </View>

            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <View style={styles.statusItemTextCol}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>SAFETY STATUS</AppText>
                <AppText variant="bodySmall" style={[styles.bold, { color: getStatusColor() }]}>
                  {status === 'activated' ? 'DISTRESS ON' : status === 'holding' ? 'HOLD TIGHT' : 'SECURE STANDBY'}
                </AppText>
              </View>
            </View>

            <View style={styles.statusItem}>
              <MaterialCommunityIcons name="wifi" size={16} color="#4CAF50" />
              <View style={styles.statusItemTextCol}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>MESH NETWORK</AppText>
                <AppText variant="bodySmall" style={styles.bold}>Active (4G LTE)</AppText>
              </View>
            </View>

            <View style={styles.statusItem}>
              <MaterialCommunityIcons name="battery-80" size={16} color="#4CAF50" />
              <View style={styles.statusItemTextCol}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>BATTERY LEVEL</AppText>
                <AppText variant="bodySmall" style={styles.bold}>82% Charged</AppText>
              </View>
            </View>
          </View>
        </AppCard>

        {/* SECTION 3: Emergency Countdown Button */}
        <View style={styles.triggerContainer}>
          {status !== 'activated' && (
            <Animated.View
              style={[
                styles.pulseRing,
                { backgroundColor: status === 'holding' ? '#EF6C0018' : '#D32F2F12' },
                animatedRingStyle,
              ]}
            />
          )}

          <Animated.View style={[styles.sosButtonWrapper, animatedButtonStyle]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[
                styles.sosButton,
                {
                  backgroundColor:
                    status === 'activated'
                      ? '#D32F2F'
                      : status === 'holding'
                      ? '#EF6C00'
                      : '#C62828',
                },
              ]}
            >
              <MaterialCommunityIcons
                name={status === 'activated' ? 'shield-check-outline' : 'alert-octagon'}
                size={44}
                color="#FFF"
              />
              <AppText variant="titleMedium" style={styles.sosButtonText}>
                {status === 'activated' ? 'EMERGENCY ON' : status === 'holding' ? `${countdown}s` : 'HOLD FOR SOS'}
              </AppText>
              <AppText variant="caption" style={styles.sosSubtext}>
                {status === 'activated' ? 'Release to Cancel' : status === 'holding' ? 'KEEP HOLDING' : 'Hold 3 Seconds'}
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* SECTION 7: Active Live Tracking Card (Only displays when SOS is active) */}
        {status === 'activated' && (
          <Animated.View style={styles.sectionContainer}>
            <AppCard style={[styles.activeTrackingCard, { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' }]}>
              <View style={styles.activeHeader}>
                <ActivityIndicator size="small" color="#D32F2F" style={styles.activeLoader} />
                <AppText variant="titleMedium" style={[styles.bold, { color: '#D32F2F' }]}>
                  Live Tracking Activated
                </AppText>
              </View>
              <AppText variant="bodySmall" style={styles.activeDesc} textColor="#C62828">
                Your coordinates are actively broadcasting to guardians, local volunteers, and nearest police dispatchers.
              </AppText>

              <View style={styles.activeStatsRow}>
                <View style={styles.statBox}>
                  <AppText variant="caption" textColor="#D32F2F">POLICE ETA</AppText>
                  <AppText variant="titleSmall" style={styles.bold} textColor="#C62828">4 mins</AppText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <AppText variant="caption" textColor="#D32F2F">VOLUNTEERS</AppText>
                  <AppText variant="titleSmall" style={styles.bold} textColor="#C62828">3 Nearby</AppText>
                </View>
              </View>

              <AppButton
                mode="contained"
                buttonColor="#D32F2F"
                onPress={handleCancelEmergency}
                style={styles.cancelBtn}
              >
                Cancel SOS Signal
              </AppButton>
            </AppCard>
          </Animated.View>
        )}

        {/* SECTION 8: Emergency Evidence Recorders */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Emergency Evidence Recorders
          </AppText>
          <View style={styles.evidenceGrid}>
            <TouchableOpacity
              onPress={() => handleEvidenceAction('mic')}
              style={[
                styles.evidenceCard,
                { borderColor: recordingMic ? '#C62828' : theme.colors.outline, backgroundColor: recordingMic ? '#FFEBEE' : theme.colors.surface },
              ]}
            >
              <MaterialCommunityIcons name="microphone" size={24} color={recordingMic ? '#C62828' : theme.colors.primary} />
              <AppText variant="button" style={[styles.evidenceLabel, { color: recordingMic ? '#C62828' : theme.colors.onSurface }]}>
                {recordingMic ? 'Recording Mic...' : 'Record Audio'}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleEvidenceAction('video')}
              style={[
                styles.evidenceCard,
                { borderColor: recordingVideo ? '#C62828' : theme.colors.outline, backgroundColor: recordingVideo ? '#FFEBEE' : theme.colors.surface },
              ]}
            >
              <MaterialCommunityIcons name="video" size={24} color={recordingVideo ? '#C62828' : theme.colors.primary} />
              <AppText variant="button" style={[styles.evidenceLabel, { color: recordingVideo ? '#C62828' : theme.colors.onSurface }]}>
                {recordingVideo ? 'Recording Video...' : 'Record Video'}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleEvidenceAction('photo')}
              disabled={capturingPhoto}
              style={[
                styles.evidenceCard,
                { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface },
              ]}
            >
              {capturingPhoto ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <MaterialCommunityIcons name="camera" size={24} color={theme.colors.primary} />
              )}
              <AppText variant="button" style={styles.evidenceLabel}>Take Snapshot</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: Emergency Options (Category Tagging) */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Select Threat Type
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsScroll}>
            {MOCK_EMERGENCY_OPTIONS.map((option) => {
              const isActive = selectedOption?.id === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedOption(isActive ? null : option)}
                  style={[
                    styles.optionBtn,
                    {
                      borderColor: isActive ? option.color : theme.colors.outline,
                      backgroundColor: isActive ? `${option.color}15` : theme.colors.surface,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={22}
                    color={isActive ? option.color : theme.colors.onSurfaceVariant}
                  />
                  <AppText
                    variant="button"
                    style={[styles.optionLabel, { color: isActive ? option.color : theme.colors.onSurface }]}
                  >
                    {option.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTION 11: Safety Tips (Context-Aware based on selected option) */}
        {selectedOption && (
          <View style={styles.sectionContainer}>
            <AppCard style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={selectedOption.color} />
                <AppText variant="titleMedium" style={[styles.bold, { color: selectedOption.color, marginLeft: 6 }]}>
                  {selectedOption.name} Safety tips
                </AppText>
              </View>
              {selectedOption.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={[styles.tipPoint, { backgroundColor: selectedOption.color }]} />
                  <AppText variant="bodySmall" style={styles.tipText}>
                    {tip}
                  </AppText>
                </View>
              ))}
            </AppCard>
          </View>
        )}

        {/* SECTION 5: Emergency Contacts */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Emergency Guardian Contacts
          </AppText>
          {MOCK_EMERGENCY_CONTACTS.map((contact) => (
            <AppCard key={contact.id} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={[styles.avatarCircle, { backgroundColor: contact.bgColor }]}>
                  <AppText variant="titleMedium" style={[styles.bold, { color: '#333' }]}>
                    {contact.initials}
                  </AppText>
                </View>
                <View style={styles.contactMeta}>
                  <AppText variant="titleSmall" style={styles.bold}>
                    {contact.name}
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                    {contact.relation} • {contact.phone}
                  </AppText>
                </View>

                {/* Call / SMS Coming Soon links */}
                <View style={styles.contactActions}>
                  <TouchableOpacity
                    onPress={() => handleQuickContactAction(contact.name, 'Call')}
                    style={styles.contactActionBtn}
                  >
                    <MaterialCommunityIcons name="phone" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleQuickContactAction(contact.name, 'Message')}
                    style={styles.contactActionBtn}
                  >
                    <MaterialCommunityIcons name="message-text" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </AppCard>
          ))}
        </View>

        {/* SECTION 6: Emergency Workflow Visualizer */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Crisis Dispatch Hierarchy
          </AppText>
          <AppCard style={styles.workflowCard}>
            <View style={styles.workflowRow}>
              {[
                { name: 'GPS Coords', icon: 'map-marker-radius' },
                { name: 'Guardians', icon: 'account-multiple' },
                { name: 'Community', icon: 'account-group' },
                { name: 'Police', icon: 'police-badge' },
                { name: 'Hospital', icon: 'hospital-building' },
                { name: 'Fire Dept', icon: 'fire-truck' },
              ].map((step, index) => (
                <View key={index} style={styles.workflowStep}>
                  <View style={[styles.stepIconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
                    <MaterialCommunityIcons name={step.icon as any} size={18} color={theme.colors.primary} />
                  </View>
                  <AppText variant="caption" style={styles.stepLabel} numberOfLines={1}>
                    {step.name}
                  </AppText>
                  {index < 5 && (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={14}
                      color={theme.colors.outline}
                      style={styles.workflowConnector}
                    />
                  )}
                </View>
              ))}
            </View>
          </AppCard>
        </View>

        {/* SECTION 9: Nearby Emergency Services */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Nearest Emergency Responders
          </AppText>
          {MOCK_NEARBY_RESPONDERS.map((responder) => (
            <AppCard key={responder.id} style={styles.responderCard}>
              <View style={styles.responderRow}>
                <View style={[styles.responderIconBg, { backgroundColor: theme.colors.primaryContainer }]}>
                  <MaterialCommunityIcons name={responder.icon as any} size={22} color={theme.colors.primary} />
                </View>
                <View style={styles.responderMeta}>
                  <AppText variant="titleSmall" style={styles.bold}>
                    {responder.name}
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                    {responder.type} • {responder.distance}
                  </AppText>
                </View>
                <View style={[styles.etaBadge, { backgroundColor: '#E0F2F1' }]}>
                  <AppText variant="caption" style={[styles.bold, { color: '#00796B' }]}>
                    ETA {responder.eta}
                  </AppText>
                </View>
              </View>
            </AppCard>
          ))}
        </View>

        {/* SECTION 10: Emergency History */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            My SOS Dispatch Logs
          </AppText>
          <AppCard style={styles.historyCard}>
            {MOCK_SOS_HISTORY.map((item, index) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyLineCol}>
                  <View style={[styles.historyNode, { backgroundColor: item.color }]} />
                  {index < MOCK_SOS_HISTORY.length - 1 && (
                    <View style={[styles.historyLine, { backgroundColor: theme.colors.outline }]} />
                  )}
                </View>
                <View style={styles.historyContentCol}>
                  <View style={styles.historyItemHeader}>
                    <AppText variant="titleSmall" style={styles.bold}>
                      {item.type}
                    </AppText>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                      {item.time}
                    </AppText>
                  </View>
                  <AppText variant="bodySmall" style={styles.historyDetail} textColor={theme.colors.onSurfaceVariant}>
                    {item.detail}
                  </AppText>
                </View>
              </View>
            ))}
          </AppCard>
        </View>

        {/* SECTION 12: Emergency Settings */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Emergency SOS Preferences
          </AppText>
          <AppCard style={styles.settingsCard}>
            <View style={styles.sliderRow}>
              <View style={styles.sliderLabels}>
                <AppText variant="titleSmall" style={styles.bold}>Countdown Delay</AppText>
                <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                  {countdownTime} seconds
                </AppText>
              </View>
              <View style={styles.sliderButtonsRow}>
                {[3, 5, 10].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setCountdownTime(t)}
                    style={[
                      styles.sliderButtonPill,
                      countdownTime === t && { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <AppText
                      variant="button"
                      style={[styles.sliderPillText, { color: countdownTime === t ? '#FFF' : theme.colors.onSurface }]}
                    >
                      {t}s
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleText}>
                <AppText variant="titleSmall" style={styles.bold}>Auto Location Share</AppText>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                  Share active live path coords immediately when SOS activates.
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setAutoLocationShare(!autoLocationShare)}
                style={styles.toggleTouch}
              >
                <MaterialCommunityIcons
                  name={autoLocationShare ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={autoLocationShare ? theme.colors.primary : theme.colors.outline}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleText}>
                <AppText variant="titleSmall" style={styles.bold}>Community Mesh Alerts</AppText>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                  Alert trusted residents within radius of active crisis.
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setCommunityAlertsEnabled(!communityAlertsEnabled)}
                style={styles.toggleTouch}
              >
                <MaterialCommunityIcons
                  name={communityAlertsEnabled ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={communityAlertsEnabled ? theme.colors.primary : theme.colors.outline}
                />
              </TouchableOpacity>
            </View>
          </AppCard>
        </View>

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
    paddingBottom: Spacing.massive,
  },
  introHeader: {
    marginBottom: Spacing.md,
  },
  statusCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  statusItemTextCol: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.circular,
    marginHorizontal: 3,
  },
  bold: {
    fontWeight: 'bold',
  },
  triggerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    marginVertical: Spacing.md,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  sosButtonWrapper: {
    zIndex: 2,
  },
  sosButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  sosButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  sosSubtext: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    marginTop: 2,
  },
  sectionContainer: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  activeTrackingCard: {
    padding: Spacing.md,
    borderWidth: 1.5,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  activeLoader: {
    marginRight: Spacing.sm,
  },
  activeDesc: {
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  activeStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(211, 47, 47, 0.15)',
    marginBottom: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(211, 47, 47, 0.15)',
  },
  cancelBtn: {
    height: 40,
    justifyContent: 'center',
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  evidenceCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    elevation: 1,
  },
  evidenceLabel: {
    marginLeft: Spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  optionsScroll: {
    paddingVertical: Spacing.xs,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.circular,
    borderWidth: 1,
    marginRight: Spacing.sm,
    elevation: 1,
  },
  optionLabel: {
    marginLeft: 6,
    fontWeight: 'bold',
  },
  tipsCard: {
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  tipPoint: {
    width: 6,
    height: 6,
    borderRadius: Radius.circular,
    marginRight: Spacing.sm,
  },
  tipText: {
    flex: 1,
    lineHeight: 16,
  },
  contactCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  contactMeta: {
    flex: 1,
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactActionBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECEFF1',
    marginLeft: Spacing.sm,
  },
  workflowCard: {
    padding: Spacing.md,
  },
  workflowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workflowStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepIconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  workflowConnector: {
    position: 'absolute',
    top: 10,
    right: -10,
    zIndex: 1,
  },
  responderCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 2,
  },
  responderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responderIconBg: {
    width: 40,
    height: 40,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  responderMeta: {
    flex: 1,
  },
  etaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.small,
  },
  historyCard: {
    padding: Spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    minHeight: 65,
  },
  historyLineCol: {
    alignItems: 'center',
    width: 20,
    marginRight: Spacing.md,
  },
  historyNode: {
    width: 10,
    height: 10,
    borderRadius: Radius.circular,
    marginTop: 4,
    zIndex: 1,
  },
  historyLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  historyContentCol: {
    flex: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDetail: {
    marginTop: 2,
    lineHeight: 16,
  },
  settingsCard: {
    padding: Spacing.md,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  sliderLabels: {
    flex: 1,
  },
  sliderButtonsRow: {
    flexDirection: 'row',
  },
  sliderButtonPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.circular,
    marginLeft: 6,
  },
  sliderPillText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: Spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  toggleTouch: {
    padding: 4,
  },
});
