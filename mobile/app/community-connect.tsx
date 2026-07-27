import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme, Portal, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  MOCK_TRUSTED_MEMBERS,
  MOCK_COMMUNITY_GROUPS,
  MOCK_SAFETY_VOLUNTEERS,
  MOCK_COMMUNITY_ACTIVITIES,
  MOCK_REPUTATION_STATS,
  TrustedMember,
  CommunityGroup,
} from '@/src/constants/communityConnectData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CommunityConnectScreen() {
  const theme = useTheme();

  // --- Opt-in Status (Privacy First) ---
  const [optedIn, setOptedIn] = useState(true);

  // --- Visibility Status ---
  const [privacyStatus, setPrivacyStatus] = useState<'AVAILABLE' | 'BUSY' | 'INVISIBLE' | 'EMERGENCY_ONLY'>('AVAILABLE');

  // --- Visibility Radius Selection ---
  const [selectedRadius, setSelectedRadius] = useState<'100m' | '300m' | '500m' | '1km' | '2km'>('500m');

  // --- Interactive Group list ---
  const [groups, setGroups] = useState<CommunityGroup[]>(MOCK_COMMUNITY_GROUPS);

  // --- Bottom Sheet Controls ---
  const [showRulesSheet, setShowRulesSheet] = useState(false);
  const rulesSheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const rulesBackdropOpacity = useSharedValue(0);

  // --- Animations ---
  const pulseScale = useSharedValue(1);

  // Pulsing ring animation for "Emergency Only" status
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 600 }),
        withTiming(1.0, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  const emergencyPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: privacyStatus === 'EMERGENCY_ONLY' ? pulseScale.value : 1 }],
      borderColor: privacyStatus === 'EMERGENCY_ONLY' ? theme.colors.error : 'transparent',
      borderWidth: privacyStatus === 'EMERGENCY_ONLY' ? 1.5 : 0,
    };
  });

  // Bottom Sheet slide configurations
  useEffect(() => {
    if (showRulesSheet) {
      rulesBackdropOpacity.value = withTiming(0.4, { duration: 250 });
      rulesSheetTranslateY.value = withSpring(0, { damping: 18, stiffness: 120 });
    } else {
      rulesBackdropOpacity.value = withTiming(0, { duration: 200 });
      rulesSheetTranslateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 });
    }
  }, [showRulesSheet]);

  const animatedRulesSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: rulesSheetTranslateY.value }],
    };
  });

  const animatedRulesBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: rulesBackdropOpacity.value,
    };
  });

  const handleCloseRules = () => {
    rulesBackdropOpacity.value = withTiming(0, { duration: 200 });
    rulesSheetTranslateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 }, (finished) => {
      if (finished) {
        runOnJS(setShowRulesSheet)(false);
      }
    });
  };

  const handleToggleGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const isJoining = g.status === 'NOT_JOINED';
          return {
            ...g,
            status: isJoining ? 'JOINED' : 'NOT_JOINED',
            membersCount: isJoining ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
  };

  const showComingSoon = (action: string) => {
    Alert.alert(
      '🔒 Security Link Active',
      `Connecting to this resident via ${action} is secure. Direct connection and VoIP features are coming soon in the next release.`
    );
  };

  const requestHelp = (helpType: string) => {
    Alert.alert(
      '📢 Crisis Alert Broadcast',
      `Simulating help request broadcast: "${helpType}" is being flagged to nearby volunteers within ${selectedRadius}.`
    );
  };

  // Filter neighbors based on selected status & radius (mock representation)
  const getRadiusNeighborsCount = () => {
    switch (selectedRadius) {
      case '100m': return 2;
      case '300m': return 3;
      case '500m': return 4;
      case '1km': return 5;
      case '2km': return MOCK_TRUSTED_MEMBERS.length;
    }
  };

  const filteredMembers = MOCK_TRUSTED_MEMBERS.slice(0, getRadiusNeighborsCount()).filter((m) => {
    // If user status is invisible, show other users.
    // If active status is Emergency Only, highlight emergency responders.
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#2E7D32'; // Green
      case 'BUSY': return '#FB8C00'; // Orange
      case 'INVISIBLE': return '#757575'; // Grey
      case 'EMERGENCY_ONLY': return '#D32F2F'; // Red
      default: return 'gray';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* SECTION 1: Header */}
      <AppHeader
        title="Community Connect"
        showBackButton={true}
        actions={[
          {
            icon: 'magnify',
            onPress: () => Alert.alert('Search', 'Search for nearby volunteers or groups.'),
          },
          {
            icon: 'bell-outline',
            onPress: () => Alert.alert('Community Alerts', 'No active local emergencies reported.'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Subtitle intro */}
        <View style={styles.introHeader}>
          <AppText variant="bodyLarge" style={styles.italic} textColor={theme.colors.onSurfaceVariant}>
            "You're never alone."
          </AppText>
        </View>

        {/* SECTION 2: Welcome Card (Opt-in Control) */}
        <AppCard style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeInfo}>
              <AppText variant="titleMedium" style={styles.bold} textColor={theme.colors.primary}>
                Emergency Safe Circle
              </AppText>
              <AppText variant="bodySmall" style={styles.welcomeDesc} textColor={theme.colors.onSurfaceVariant}>
                Connect with verified nearby residents during crises. Only users who opt in become discoverable to the safety mesh.
              </AppText>
            </View>
            <View style={styles.optInToggleColumn}>
              <AppText variant="caption" style={styles.bold}>
                {optedIn ? 'ACTIVE' : 'OFFLINE'}
              </AppText>
              <Switch
                value={optedIn}
                onValueChange={setOptedIn}
                thumbColor={optedIn ? theme.colors.primary : '#F4F3F4'}
                trackColor={{ false: '#767577', true: theme.colors.primaryContainer }}
              />
            </View>
          </View>
        </AppCard>

        {/* Outer check: If not opted in, show locked state blur */}
        {!optedIn ? (
          <AppCard style={styles.lockedStateCard}>
            <MaterialCommunityIcons name="shield-lock-outline" size={48} color={theme.colors.primary} />
            <AppText variant="titleLarge" style={[styles.bold, styles.lockedTitle]}>
              Join Safe Mesh
            </AppText>
            <AppText variant="bodyMedium" style={styles.lockedDesc} textColor={theme.colors.onSurfaceVariant}>
              Toggle the opt-in switch above to discover verified neighbors and volunteers near you. Your privacy and phone number are fully protected.
            </AppText>
            <AppButton mode="contained" onPress={() => setOptedIn(true)}>
              OPT IN NOW
            </AppButton>
          </AppCard>
        ) : (
          <View>
            {/* SECTION 3: Privacy Status Cards */}
            <View style={styles.sectionContainer}>
              <AppText variant="titleMedium" style={styles.sectionTitle}>
                My Privacy Status
              </AppText>
              <View style={styles.privacyGrid}>
                {[
                  { id: 'AVAILABLE', label: 'Available', icon: 'check-circle', color: '#2E7D32' },
                  { id: 'BUSY', label: 'Busy', icon: 'minus-circle', color: '#FB8C00' },
                  { id: 'INVISIBLE', label: 'Invisible', icon: 'eye-off-outline', color: '#757575' },
                  { id: 'EMERGENCY_ONLY', label: 'Emergency Only', icon: 'alert-octagon', color: '#D32F2F' },
                ].map((status) => {
                  const isActive = privacyStatus === status.id;
                  const isEmergency = status.id === 'EMERGENCY_ONLY';

                  if (isEmergency && isActive) {
                    return (
                      <Animated.View
                        key={status.id}
                        style={[styles.privacyCardWrapper, emergencyPulseStyle]}
                      >
                        <TouchableOpacity
                          onPress={() => setPrivacyStatus(status.id as any)}
                          style={[
                            styles.privacyCard,
                            {
                              backgroundColor: '#FFEBEE',
                              borderColor: '#C62828',
                              borderWidth: 1,
                            },
                          ]}
                        >
                          <MaterialCommunityIcons name={status.icon as any} size={22} color="#C62828" />
                          <AppText variant="bodyMedium" style={[styles.privacyLabel, { color: '#C62828' }]}>
                            {status.label}
                          </AppText>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  }

                  return (
                    <View key={status.id} style={styles.privacyCardWrapper}>
                      <TouchableOpacity
                        onPress={() => setPrivacyStatus(status.id as any)}
                        style={[
                          styles.privacyCard,
                          {
                            backgroundColor: isActive ? `${status.color}15` : theme.colors.surface,
                            borderColor: isActive ? status.color : theme.colors.outline,
                            borderWidth: isActive ? 1.5 : 1,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={status.icon as any}
                          size={22}
                          color={isActive ? status.color : theme.colors.onSurfaceVariant}
                        />
                        <AppText
                          variant="bodyMedium"
                          style={[
                            styles.privacyLabel,
                            { color: isActive ? status.color : theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {status.label}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* SECTION 4: Visibility Radius */}
            <View style={styles.sectionContainer}>
              <View style={styles.radiusHeaderRow}>
                <AppText variant="titleMedium" style={styles.sectionTitle}>
                  Visibility Radius
                </AppText>
                <AppText variant="bodyMedium" style={styles.bold} textColor={theme.colors.primary}>
                  {selectedRadius} ({getRadiusNeighborsCount()} neighbors found)
                </AppText>
              </View>
              
              <View style={styles.radiusPillsRow}>
                {(['100m', '300m', '500m', '1km', '2km'] as const).map((r) => {
                  const isActive = selectedRadius === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setSelectedRadius(r)}
                      style={[
                        styles.radiusPill,
                        {
                          backgroundColor: isActive ? theme.colors.primary : theme.colors.elevation.level2,
                        },
                      ]}
                    >
                      <AppText variant="button" style={[styles.radiusPillText, { color: isActive ? '#FFF' : theme.colors.onSurface }]}>
                        {r}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* SECTION 5: Nearby Trusted Members */}
            <View style={styles.sectionContainer}>
              <AppText variant="titleMedium" style={styles.sectionTitle}>
                Trusted Neighbors Nearby
              </AppText>
              {filteredMembers.map((member) => (
                <AppCard key={member.id} style={styles.memberCard}>
                  <View style={styles.memberHeader}>
                    {/* Initials Avatar */}
                    <View style={[styles.avatarCircle, { backgroundColor: member.bgColor }]}>
                      <AppText variant="titleMedium" style={[styles.bold, { color: '#333' }]}>
                        {member.initials}
                      </AppText>
                    </View>
                    
                    {/* Member Meta */}
                    <View style={styles.memberMeta}>
                      <View style={styles.memberNameRow}>
                        <AppText variant="titleMedium" style={styles.bold}>
                          {member.name}
                        </AppText>
                        {member.isVerified && (
                          <MaterialCommunityIcons
                            name="shield-check"
                            size={16}
                            color={theme.colors.primary}
                            style={styles.verifyIcon}
                          />
                        )}
                      </View>
                      
                      <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                        {member.occupation} • {member.distance}
                      </AppText>
                    </View>

                    {/* Trust Rating & Status indicator */}
                    <View style={styles.memberBadgeCol}>
                      <View style={[styles.trustBadge, { backgroundColor: '#E8F5E9' }]}>
                        <AppText variant="caption" style={[styles.bold, { color: '#2E7D32' }]}>
                          🛡 {member.trustScore}% Trust
                        </AppText>
                      </View>
                      <View style={styles.statusIndicatorRow}>
                        <View style={[styles.statusPoint, { backgroundColor: getStatusColor(member.status) }]} />
                        <AppText variant="caption" style={styles.statusText}>
                          {member.status.replace('_', ' ')}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  {/* Actions Grid */}
                  <View style={styles.memberActions}>
                    <TouchableOpacity onPress={() => showComingSoon('Message')} style={styles.actionLinkBtn}>
                      <MaterialCommunityIcons name="message-text-outline" size={16} color={theme.colors.primary} />
                      <AppText variant="button" style={[styles.actionLinkText, { color: theme.colors.primary }]}>
                        Message
                      </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => showComingSoon('Call')} style={styles.actionLinkBtn}>
                      <MaterialCommunityIcons name="phone-outline" size={16} color={theme.colors.primary} />
                      <AppText variant="button" style={[styles.actionLinkText, { color: theme.colors.primary }]}>
                        Secure Call
                      </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => showComingSoon('Profile')} style={styles.actionLinkBtn}>
                      <MaterialCommunityIcons name="account-search-outline" size={16} color={theme.colors.primary} />
                      <AppText variant="button" style={[styles.actionLinkText, { color: theme.colors.primary }]}>
                        View Trust Log
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </AppCard>
              ))}
            </View>

            {/* SECTION 6: Community Reputation */}
            <View style={styles.sectionContainer}>
              <AppText variant="titleMedium" style={styles.sectionTitle}>
                My Community Reputation
              </AppText>
              <AppCard style={styles.reputationCard}>
                <View style={styles.reputationGrid}>
                  <View style={styles.repCol}>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Trust Score</AppText>
                    <AppText variant="titleLarge" style={[styles.bold, { color: theme.colors.primary }]}>
                      {MOCK_REPUTATION_STATS.trustScore}%
                    </AppText>
                  </View>
                  
                  <View style={styles.repDivider} />

                  <View style={styles.repCol}>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Community Rating</AppText>
                    <AppText variant="titleLarge" style={[styles.bold, { color: '#FB8C00' }]}>
                      ⭐ {MOCK_REPUTATION_STATS.rating}
                    </AppText>
                  </View>

                  <View style={styles.repDivider} />

                  <View style={styles.repCol}>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Helped / Hours</AppText>
                    <AppText variant="titleLarge" style={styles.bold}>
                      {MOCK_REPUTATION_STATS.peopleHelped} people
                    </AppText>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                      {MOCK_REPUTATION_STATS.volunteerHours} hours
                    </AppText>
                  </View>
                </View>
              </AppCard>
            </View>

            {/* SECTION 7: Need Help? Request Cards */}
            <View style={styles.sectionContainer}>
              <AppText variant="titleMedium" style={styles.sectionTitle}>
                Request Community Assistance
              </AppText>
              <View style={styles.helpGrid}>
                {[
                  { name: 'Medical Help', icon: 'medical-bag', color: '#D32F2F' },
                  { name: 'Vehicle Breakdown', icon: 'car-wrench', color: '#FB8C00' },
                  { name: 'Lost Child Alert', icon: 'account-child-outline', color: '#0D47A1' },
                  { name: 'Senior Citizen Aid', icon: 'human-cane', color: '#00897B' },
                  { name: 'Lost Pet Search', icon: 'dog-side', color: '#8D6E63' },
                  { name: 'Safe Escort / Directions', icon: 'map-marker-path', color: '#8E24AA' },
                ].map((help, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => requestHelp(help.name)}
                    style={styles.helpGridItem}
                  >
                    <AppCard style={styles.helpCardInner}>
                      <View style={[styles.helpIconCircle, { backgroundColor: `${help.color}15` }]}>
                        <MaterialCommunityIcons name={help.icon as any} size={24} color={help.color} />
                      </View>
                      <AppText variant="titleSmall" style={[styles.bold, styles.helpLabel]} numberOfLines={1}>
                        {help.name}
                      </AppText>
                    </AppCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* SECTION 8: Community Groups */}
            <View style={styles.sectionContainer}>
              <AppText variant="titleMedium" style={styles.sectionTitle}>
                Community Safe Circles
              </AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groupsScroll}
              >
                {groups.map((group) => {
                  const isJoined = group.status === 'JOINED';
                  return (
                    <AppCard key={group.id} style={styles.groupCard}>
                      <View style={styles.groupHeader}>
                        <MaterialCommunityIcons name={group.icon as any} size={24} color={theme.colors.primary} />
                        <Chip style={styles.groupBadge} textStyle={styles.groupBadgeText}>
                          {group.membersCount} members
                        </Chip>
                      </View>
                      
                      <AppText variant="titleSmall" style={[styles.bold, styles.groupTitle]} numberOfLines={1}>
                        {group.name}
                      </AppText>
                      
                      <AppButton
                        mode={isJoined ? 'outlined' : 'contained'}
                        onPress={() => handleToggleGroup(group.id)}
                        style={styles.groupJoinBtn}
                        textColor={isJoined ? theme.colors.primary : '#FFF'}
                      >
                        {isJoined ? 'Leave' : 'Join'}
                      </AppButton>
                    </AppCard>
                  );
                })}
              </ScrollView>
            </View>

            {/* SECTION 9: Safety Volunteers */}
            <View style={styles.sectionContainer}>
              <AppText variant="titleMedium" style={styles.sectionTitle}>
                Nearby Safety Volunteers
              </AppText>
              <View style={styles.volunteersGrid}>
                {MOCK_SAFETY_VOLUNTEERS.map((v) => (
                  <View key={v.id} style={[styles.volunteerCard, { borderColor: theme.colors.outline }]}>
                    <View style={[styles.volIconWrapper, { backgroundColor: `${v.color}15` }]}>
                      <MaterialCommunityIcons name={v.icon as any} size={18} color={v.color} />
                    </View>
                    <View style={styles.volInfo}>
                      <AppText variant="titleSmall" style={styles.bold}>
                        {v.name}
                      </AppText>
                      <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                        {v.badge} • {v.distance} away
                      </AppText>
                    </View>
                    <View style={styles.volBadge}>
                      <AppText variant="caption" style={styles.volBadgeText}>Certified</AppText>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* SECTION 10: Recent Community Activity (Timeline) */}
            <View style={styles.sectionContainer}>
              <AppText variant="titleMedium" style={styles.sectionTitle}>
                Recent Safe-Mesh Achievements
              </AppText>
              <AppCard style={styles.timelineCard}>
                {MOCK_COMMUNITY_ACTIVITIES.map((act, index) => (
                  <View key={act.id} style={styles.timelineItem}>
                    <View style={styles.timelineLineCol}>
                      <View style={[styles.timelineNode, { backgroundColor: act.color }]} />
                      {index < MOCK_COMMUNITY_ACTIVITIES.length - 1 && (
                        <View style={[styles.timelineLine, { backgroundColor: theme.colors.outline }]} />
                      )}
                    </View>
                    <View style={styles.timelineContentCol}>
                      <View style={styles.timelineItemHeader}>
                        <AppText variant="titleSmall" style={styles.bold}>
                          {act.title}
                        </AppText>
                        <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                          {act.time}
                        </AppText>
                      </View>
                      <AppText variant="bodySmall" style={styles.timelineDetail} textColor={theme.colors.onSurfaceVariant}>
                        {act.detail}
                      </AppText>
                    </View>
                  </View>
                ))}
              </AppCard>
            </View>

            {/* SECTION 11: Emergency Broadcast Card */}
            <View style={styles.sectionContainer}>
              <AppCard style={[styles.broadcastCard, { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' }]}>
                <View style={styles.broadcastHeader}>
                  <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#C62828" />
                  <AppText variant="titleMedium" style={[styles.bold, styles.broadcastTitle]} textColor="#C62828">
                    Need Immediate Help?
                  </AppText>
                </View>
                <AppText variant="bodySmall" style={styles.broadcastDesc} textColor="#C62828">
                  Initiate emergency broadcast to raise visual alarm alerts to all discoverable neighbors within {selectedRadius}.
                </AppText>
                <AppButton
                  mode="contained"
                  onPress={() => Alert.alert('Broadcast Alert', 'Emergency broadcasting channels will boot in the next sync.')}
                  buttonColor="#D32F2F"
                  style={styles.broadcastBtn}
                >
                  Broadcast Alarm
                </AppButton>
              </AppCard>
            </View>

            {/* SECTION 12: Community Guidelines */}
            <View style={styles.sectionContainer}>
              <AppCard style={styles.guidelinesCard}>
                <View style={styles.guidelinesHeader}>
                  <MaterialCommunityIcons name="alert-box-outline" size={20} color={theme.colors.primary} />
                  <AppText variant="titleMedium" style={[styles.bold, styles.guidelinesTitle]}>
                    Neighborhood Watch Code
                  </AppText>
                </View>
                <View style={styles.guidelineBullet}>
                  <AppText variant="bodySmall">🔒  Phone numbers are never visible. Connect via encrypted channels.</AppText>
                </View>
                <View style={styles.guidelineBullet}>
                  <AppText variant="bodySmall">🚫  No spam or solicitation. Strict safety & rescue alerts only.</AppText>
                </View>
                <View style={styles.guidelineBullet}>
                  <AppText variant="bodySmall">🛡  False reporting or harassment leads to permanent mesh suspension.</AppText>
                </View>
                
                <AppButton
                  mode="outlined"
                  onPress={() => setShowRulesSheet(true)}
                  style={styles.rulesBtn}
                >
                  View Verification Rules
                </AppButton>
              </AppCard>
            </View>
          </View>
        )}
      </ScrollView>

      {/* SECTION 13: Rules & Verification Bottom Sheet */}
      <Portal>
        <View style={StyleSheet.absoluteFillObject} pointerEvents={showRulesSheet ? 'auto' : 'none'}>
          {/* Backdrop overlay */}
          <Animated.View style={[styles.sheetBackdrop, animatedRulesBackdropStyle]}>
            <TouchableOpacity style={styles.flex} onPress={handleCloseRules} />
          </Animated.View>

          {/* Rules Sheet Card */}
          <Animated.View
            style={[
              styles.sheetCard,
              { backgroundColor: theme.colors.elevation.level3 },
              animatedRulesSheetStyle,
            ]}
          >
            {/* Drag Handle Bar */}
            <View style={styles.dragContainer}>
              <View style={[styles.dragHandle, { backgroundColor: theme.colors.outlineVariant || '#CCCCCC' }]} />
            </View>

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color={theme.colors.primary} />
              <View style={styles.sheetHeaderTitleCol}>
                <AppText variant="titleMedium" style={styles.bold}>
                  Trust & Verification Guide
                </AppText>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                  How GoSafe validates community safety
                </AppText>
              </View>
              <TouchableOpacity onPress={handleCloseRules} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={20} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>

            {/* Content list */}
            <ScrollView contentContainerStyle={styles.rulesList}>
              <View style={styles.ruleSection}>
                <AppText variant="titleSmall" style={styles.bold}>
                  1. How Verification Works
                </AppText>
                <AppText variant="bodySmall" style={styles.ruleText} textColor={theme.colors.onSurfaceVariant}>
                  Residents upload a local utility bill or student ID to verify address radius accuracy. Government officers or certified medical profiles require Aadhaar/Medical licensing verification.
                </AppText>
              </View>

              <View style={styles.ruleSection}>
                <AppText variant="titleSmall" style={styles.bold}>
                  2. Trust Score Calculations
                </AppText>
                <AppText variant="bodySmall" style={styles.ruleText} textColor={theme.colors.onSurfaceVariant}>
                  Your trust index starts at 90% and increases based on successful helps logged, community upvotes, and verification status. It falls immediately on user blocks or spam tags.
                </AppText>
              </View>

              <View style={styles.ruleSection}>
                <AppText variant="titleSmall" style={styles.bold}>
                  3. Reporting Abuse & Safety
                </AppText>
                <AppText variant="bodySmall" style={styles.ruleText} textColor={theme.colors.onSurfaceVariant}>
                  If any member violates community code (e.g. sends spam messages or makes fake emergency calls), report their profile. GoSafe moderators review reports within 15 minutes.
                </AppText>
              </View>
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
    paddingBottom: Spacing.huge,
  },
  introHeader: {
    marginBottom: Spacing.sm,
  },
  italic: {
    fontStyle: 'italic',
  },
  welcomeCard: {
    padding: Spacing.md,
    backgroundColor: '#E1F5FE', // Tinted Light Blue
    borderWidth: 1.5,
    borderColor: 'rgba(3, 155, 229, 0.12)',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  welcomeDesc: {
    lineHeight: 16,
    marginTop: 4,
  },
  optInToggleColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  bold: {
    fontWeight: 'bold',
  },
  lockedStateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    marginVertical: Spacing.xl,
    elevation: 4,
  },
  lockedTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  lockedDesc: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  sectionContainer: {
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  privacyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  privacyCardWrapper: {
    width: '48%',
    marginVertical: Spacing.xs,
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  privacyCard: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.large,
    elevation: 2,
  },
  privacyLabel: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 12,
  },
  radiusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  radiusPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  radiusPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.circular,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusPillText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  memberCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    elevation: 1,
  },
  memberMeta: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyIcon: {
    marginLeft: 4,
  },
  memberBadgeCol: {
    alignItems: 'flex-end',
  },
  trustBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.small,
    marginBottom: 4,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPoint: {
    width: 8,
    height: 8,
    borderRadius: Radius.circular,
    marginRight: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  memberActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },
  actionLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionLinkText: {
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 12,
  },
  reputationCard: {
    padding: Spacing.md,
  },
  reputationGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  repCol: {
    flex: 1,
    alignItems: 'center',
  },
  repDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  helpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  helpGridItem: {
    width: '48%',
    marginBottom: Spacing.sm,
  },
  helpCardInner: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  helpIconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  helpLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  groupsScroll: {
    paddingVertical: Spacing.xs,
  },
  groupCard: {
    width: 170,
    padding: Spacing.md,
    marginRight: Spacing.md,
    borderRadius: Radius.large,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  groupBadge: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupBadgeText: {
    fontSize: 8,
    marginHorizontal: 4,
  },
  groupTitle: {
    marginBottom: Spacing.md,
  },
  groupJoinBtn: {
    height: 36,
    justifyContent: 'center',
  },
  volunteersGrid: {
    flexDirection: 'column',
  },
  volunteerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    backgroundColor: '#FFF',
  },
  volIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  volInfo: {
    flex: 1,
  },
  volBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.small,
  },
  volBadgeText: {
    color: '#00796B',
    fontSize: 9,
    fontWeight: 'bold',
  },
  timelineCard: {
    padding: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 65,
  },
  timelineLineCol: {
    alignItems: 'center',
    width: 20,
    marginRight: Spacing.md,
  },
  timelineNode: {
    width: 10,
    height: 10,
    borderRadius: Radius.circular,
    zIndex: 1,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  timelineContentCol: {
    flex: 1,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineDetail: {
    marginTop: 2,
    lineHeight: 16,
  },
  broadcastCard: {
    padding: Spacing.md,
    borderWidth: 1,
  },
  broadcastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  broadcastTitle: {
    marginLeft: Spacing.sm,
  },
  broadcastDesc: {
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  broadcastBtn: {
    height: 44,
  },
  guidelinesCard: {
    padding: Spacing.md,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  guidelinesTitle: {
    marginLeft: Spacing.sm,
  },
  guidelineBullet: {
    marginBottom: Spacing.sm,
  },
  rulesBtn: {
    marginTop: Spacing.md,
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
  sheetHeaderTitleCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  closeBtn: {
    padding: 4,
  },
  rulesList: {
    paddingTop: Spacing.md,
  },
  ruleText: {
    marginTop: 4,
    lineHeight: 18,
  },
  ruleSection: {
    marginBottom: Spacing.md,
  },
});
