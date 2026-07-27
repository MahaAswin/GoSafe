import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Checkbox, MD3Theme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// Custom imports
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { AppButton } from '@/src/components/common/AppButton';
import { BottomTipsSheet } from '@/src/components/common/BottomTipsSheet';
import { SuccessDialog } from '@/src/components/common/SuccessDialog';
import { Spacing } from '@/src/theme/spacing';
import { Radius } from '@/src/theme/radius';
import { Colors } from '@/src/theme/colors';
import { StorageKeys } from '@/src/constants/storage';
import { INCIDENT_TYPES, IncidentTypeConfig } from '@/src/constants/incidentTypes';

const MOCK_LOCATIONS = [
  { address: 'Connaught Place, Block E, New Delhi, DL 110001, India', latitude: 28.6304, longitude: 77.2177 },
  { address: 'Sector 62, Block C, Noida, UP 201301, India', latitude: 28.6219, longitude: 77.3794 },
  { address: 'Indiranagar, 12th Main Rd, Bengaluru, KA 560038, India', latitude: 12.9718, longitude: 77.6412 },
  { address: 'Marine Drive, Netaji Subhash Chandra Bose Rd, Mumbai, MH 400021, India', latitude: 18.9433, longitude: 72.8235 },
  { address: 'Salt Lake Sector V, Kolkata, WB 700091, India', latitude: 22.5735, longitude: 88.4331 },
];

export default function ReportIncidentScreen() {
  const theme = useTheme();

  // --- Form States ---
  const [selectedType, setSelectedType] = useState<IncidentTypeConfig>(INCIDENT_TYPES[0]);
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [description, setDescription] = useState('');
  
  // Location States
  const [locationMode, setLocationMode] = useState<'GPS' | 'PIN'>('GPS');
  const [locationIndex, setLocationIndex] = useState(0);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);

  // Evidence States (Mock files)
  const [attachedFiles, setAttachedFiles] = useState<Array<{ id: string; name: string; type: 'image' | 'video'; uri?: string }>>([]);

  // Toggles and Options
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [visibility, setVisibility] = useState<'AUTHORITIES' | 'COMMUNITY' | 'FEED'>('COMMUNITY');

  // Interactive UI / Dialog States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // --- Animation Shared Values ---
  const criticalPulse = useSharedValue(1);
  const submitScale = useSharedValue(1);
  const locationRotate = useSharedValue(0);

  // Pulsing animation for Critical Card
  useEffect(() => {
    criticalPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800, easing: Easing.ease }),
        withTiming(1.0, { duration: 800, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, []);

  const criticalPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: severity === 'CRITICAL' ? criticalPulse.value : 1 }],
      borderColor: severity === 'CRITICAL' ? theme.colors.error : 'transparent',
      borderWidth: severity === 'CRITICAL' ? 1.5 : 0,
    };
  });

  const locationRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${locationRotate.value}deg` }],
    };
  });

  // --- Form Actions ---
  const handleRefreshLocation = () => {
    setIsRefreshingLocation(true);
    locationRotate.value = withTiming(locationRotate.value + 360, { duration: 800 });
    
    setTimeout(() => {
      setLocationIndex((prev) => (prev + 1) % MOCK_LOCATIONS.length);
      setIsRefreshingLocation(false);
    }, 800);
  };

  const handleAddMockFile = (type: 'image' | 'video') => {
    const fileId = Math.random().toString(36).substring(7);
    const index = attachedFiles.length + 1;
    const newFile = {
      id: fileId,
      name: type === 'image' ? `IMG_CRISIS_00${index}.jpg` : `VID_HAZARD_00${index}.mp4`,
      type,
    };
    setAttachedFiles((prev) => [...prev, newFile]);
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = () => {
    if (description.trim().length === 0) {
      alert('Please provide a brief description of the incident.');
      return;
    }

    setIsSubmitting(true);
    submitScale.value = withSpring(0.95);

    setTimeout(async () => {
      // Create new report object matching ComplaintResponseDTO / ComplaintRequestDTO
      const currentLocation = MOCK_LOCATIONS[locationIndex];
      const newReport = {
        id: Math.random().toString(36).substring(2, 9),
        title: `${selectedType.emoji} ${selectedType.label}`,
        desc: description,
        category: selectedType.id,
        severity,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: currentLocation.address,
        isAnonymous,
        isEmergency,
        visibility,
        attachedCount: attachedFiles.length,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      try {
        // Save to AsyncStorage
        const cached = await AsyncStorage.getItem(StorageKeys.cachedComplaints);
        const complaintsList = cached ? JSON.parse(cached) : [];
        const updatedList = [newReport, ...complaintsList];
        await AsyncStorage.setItem(StorageKeys.cachedComplaints, JSON.stringify(updatedList));

        submitScale.value = withSpring(1);
        setIsSubmitting(false);
        setShowSuccess(true);
      } catch (err) {
        console.error('Failed to save incident', err);
        setIsSubmitting(false);
        submitScale.value = withSpring(1);
      }
    }, 1500);
  };

  const handleResetForm = () => {
    setShowSuccess(false);
    setSelectedType(INCIDENT_TYPES[0]);
    setSeverity('MEDIUM');
    setDescription('');
    setAttachedFiles([]);
    setIsAnonymous(false);
    setIsEmergency(false);
    setVisibility('COMMUNITY');
    router.back();
  };

  // Pre-configured custom backgrounds for severity selection
  const getSeverityBgColor = (cardSeverity: string, isActive: boolean) => {
    if (!isActive) return theme.colors.elevation.level1;
    switch (cardSeverity) {
      case 'LOW':
        return '#E8F5E9'; // Success tint
      case 'MEDIUM':
        return '#FFF3E0'; // Warning yellow-orange tint
      case 'HIGH':
        return '#FFE0B2'; // Deep orange tint
      case 'CRITICAL':
        return '#FFEBEE'; // Emergency red tint
    }
    return theme.colors.elevation.level1;
  };

  const getSeverityTextColor = (cardSeverity: string, isActive: boolean) => {
    if (!isActive) return theme.colors.onSurface;
    switch (cardSeverity) {
      case 'LOW':
        return '#2E7D32';
      case 'MEDIUM':
        return '#EF6C00';
      case 'HIGH':
        return '#E65100';
      case 'CRITICAL':
        return '#C62828';
    }
    return theme.colors.onSurface;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* SECTION 1: Header */}
      <AppHeader
        title="Report Incident"
        showBackButton={true}
        actions={[
          {
            icon: 'bell-outline',
            onPress: () => alert('Community Alerts are actively monitoring local safety.'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro Subtitle */}
        <View style={styles.introHeader}>
          <AppText variant="bodyLarge" style={styles.subtitle} textColor={theme.colors.onSurfaceVariant}>
            Help make your community safer. Provide clear details to alert responders & neighbors.
          </AppText>
        </View>

        {/* SECTION 2: Incident Type Chips */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="titleMedium" style={styles.sectionTitle}>
              Incident Type
            </AppText>
            {selectedType && (
              <TouchableOpacity onPress={() => setShowTips(true)} style={styles.tipsTextButton}>
                <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={theme.colors.primary} />
                <AppText variant="button" style={[styles.tipsLink, { color: theme.colors.primary }]}>
                  View Safety Tips
                </AppText>
              </TouchableOpacity>
            )}
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {INCIDENT_TYPES.map((type) => {
              const isActive = selectedType.id === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type)}
                  style={[
                    styles.chipButton,
                    {
                      borderColor: isActive ? type.color : theme.colors.outline,
                      backgroundColor: isActive ? `${type.color}15` : theme.colors.surface,
                    },
                  ]}
                >
                  <AppText variant="bodyMedium" style={styles.chipText}>
                    {type.emoji}  {type.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTION 3: Incident Severity Cards */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Incident Severity
          </AppText>
          <View style={styles.severityGrid}>
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => {
              const isActive = severity === sev;
              const bgColor = getSeverityBgColor(sev, isActive);
              const textColor = getSeverityTextColor(sev, isActive);

              if (sev === 'CRITICAL') {
                return (
                  <Animated.View
                    key={sev}
                    style={[
                      styles.severityCardWrapper,
                      criticalPulseStyle,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => setSeverity(sev)}
                      style={[
                        styles.severityCard,
                        {
                          backgroundColor: bgColor,
                          borderColor: isActive ? theme.colors.error : theme.colors.outline,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="alert-octagon"
                        size={24}
                        color={textColor}
                      />
                      <AppText variant="bodyLarge" style={[styles.severityLabel, { color: textColor }]}>
                        Critical
                      </AppText>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }

              return (
                <View key={sev} style={styles.severityCardWrapper}>
                  <TouchableOpacity
                    onPress={() => setSeverity(sev)}
                    style={[
                      styles.severityCard,
                      {
                        backgroundColor: bgColor,
                        borderColor: isActive ? textColor : 'transparent',
                        borderWidth: isActive ? 1.5 : 0,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        sev === 'LOW'
                          ? 'check-circle-outline'
                          : sev === 'MEDIUM'
                          ? 'alert-circle-outline'
                          : 'alert-outline'
                      }
                      size={24}
                      color={textColor}
                    />
                    <AppText variant="bodyLarge" style={[styles.severityLabel, { color: textColor }]}>
                      {sev.charAt(0) + sev.slice(1).toLowerCase()}
                    </AppText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* SECTION 4: Incident Description */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Incident Description
          </AppText>
          <View style={[styles.inputWrapper, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Describe what happened. Be as specific as possible to guide AI safety heatmaps and response forces."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={description}
              onChangeText={(text) => setDescription(text.slice(0, 500))}
              style={[styles.textArea, { color: theme.colors.onSurface }]}
            />
            <View style={styles.counterRow}>
              <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                {description.length} / 500
              </AppText>
            </View>
          </View>
        </View>

        {/* SECTION 5: Location Details */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Incident Location
          </AppText>
          <AppCard style={styles.locationCard}>
            {/* Toggle GPS Mode */}
            <View style={styles.locationToggleRow}>
              <TouchableOpacity
                onPress={() => setLocationMode('GPS')}
                style={[
                  styles.modeButton,
                  locationMode === 'GPS' && { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={16}
                  color={locationMode === 'GPS' ? theme.colors.primary : theme.colors.onSurfaceVariant}
                />
                <AppText
                  variant="button"
                  style={[styles.modeButtonText, { color: locationMode === 'GPS' ? theme.colors.primary : theme.colors.onSurfaceVariant }]}
                >
                  Current GPS
                </AppText>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setLocationMode('PIN')}
                style={[
                  styles.modeButton,
                  locationMode === 'PIN' && { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={16}
                  color={locationMode === 'PIN' ? theme.colors.primary : theme.colors.onSurfaceVariant}
                />
                <AppText
                  variant="button"
                  style={[styles.modeButtonText, { color: locationMode === 'PIN' ? theme.colors.primary : theme.colors.onSurfaceVariant }]}
                >
                  Pinned Location
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Address Display */}
            <View style={styles.addressContainer}>
              <View style={styles.addressTextColumn}>
                <AppText variant="titleMedium" style={styles.bold}>
                  {locationMode === 'GPS' ? '📍 Live Coordinate Feed' : '📌 Pinned Coordinates'}
                </AppText>
                <AppText variant="bodyMedium" style={styles.addressText}>
                  {MOCK_LOCATIONS[locationIndex].address}
                </AppText>
                <View style={styles.latLngRow}>
                  <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                    Lat: {MOCK_LOCATIONS[locationIndex].latitude.toFixed(4)}
                  </AppText>
                  <AppText variant="bodySmall" style={styles.separator} textColor={theme.colors.onSurfaceVariant}>
                    |
                  </AppText>
                  <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                    Lng: {MOCK_LOCATIONS[locationIndex].longitude.toFixed(4)}
                  </AppText>
                </View>
              </View>

              {/* Refresh Location Button */}
              <TouchableOpacity
                onPress={handleRefreshLocation}
                disabled={isRefreshingLocation}
                style={[styles.refreshBtn, { backgroundColor: theme.colors.surface }]}
              >
                {isRefreshingLocation ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Animated.View style={locationRotateStyle}>
                    <MaterialCommunityIcons name="refresh" size={22} color={theme.colors.primary} />
                  </Animated.View>
                )}
              </TouchableOpacity>
            </View>
          </AppCard>
        </View>

        {/* SECTION 6: Upload Evidence */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Upload Evidence
          </AppText>
          <View style={styles.evidenceGrid}>
            <TouchableOpacity onPress={() => handleAddMockFile('image')} style={[styles.evidenceBtn, { borderColor: theme.colors.outline }]}>
              <MaterialCommunityIcons name="camera" size={20} color={theme.colors.primary} />
              <AppText variant="button" style={styles.evidenceBtnLabel}>Take Photo</AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAddMockFile('image')} style={[styles.evidenceBtn, { borderColor: theme.colors.outline }]}>
              <MaterialCommunityIcons name="image-multiple" size={20} color={theme.colors.primary} />
              <AppText variant="button" style={styles.evidenceBtnLabel}>Choose Image</AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAddMockFile('video')} style={[styles.evidenceBtn, { borderColor: theme.colors.outline }]}>
              <MaterialCommunityIcons name="video" size={20} color={theme.colors.primary} />
              <AppText variant="button" style={styles.evidenceBtnLabel}>Record Video</AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAddMockFile('video')} style={[styles.evidenceBtn, { borderColor: theme.colors.outline }]}>
              <MaterialCommunityIcons name="file-video" size={20} color={theme.colors.primary} />
              <AppText variant="button" style={styles.evidenceBtnLabel}>Choose Video</AppText>
            </TouchableOpacity>
          </View>

          {/* Evidence Previews List */}
          {attachedFiles.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewsScroll}>
              {attachedFiles.map((file) => (
                <View key={file.id} style={[styles.previewCard, { backgroundColor: theme.colors.elevation.level2 }]}>
                  <View style={[styles.previewThumb, { backgroundColor: file.type === 'image' ? '#E1F5FE' : '#FFF3E0' }]}>
                    <MaterialCommunityIcons
                      name={file.type === 'image' ? 'file-image' : 'video-outline'}
                      size={28}
                      color={file.type === 'image' ? '#039BE5' : '#FB8C00'}
                    />
                  </View>
                  <View style={styles.previewMeta}>
                    <AppText variant="bodySmall" numberOfLines={1} style={styles.previewName}>
                      {file.name}
                    </AppText>
                    <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                      {file.type === 'image' ? 'Image File' : 'Video File'}
                    </AppText>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveFile(file.id)}
                    style={[styles.removeFileBtn, { backgroundColor: theme.colors.error }]}
                  >
                    <MaterialCommunityIcons name="close" size={12} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* SECTION 7: Anonymous Reporting */}
        <View style={styles.sectionContainer}>
          <AppCard style={styles.toggleCard}>
            <View style={styles.toggleHeader}>
              <View style={styles.toggleHeaderInfo}>
                <MaterialCommunityIcons name="shield-account" size={24} color={isAnonymous ? theme.colors.primary : 'gray'} />
                <AppText variant="titleMedium" style={styles.toggleTitle}>
                  Report Anonymously
                </AppText>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                thumbColor={isAnonymous ? theme.colors.primary : '#F4F3F4'}
                trackColor={{ false: '#767577', true: theme.colors.primaryContainer }}
              />
            </View>
            <View style={[styles.infoBanner, { backgroundColor: theme.colors.surfaceVariant }]}>
              <MaterialCommunityIcons name="information" size={16} color={theme.colors.onSurfaceVariant} style={styles.bannerIcon} />
              <AppText variant="bodySmall" style={styles.bannerText} textColor={theme.colors.onSurfaceVariant}>
                Anonymous reports hide your account identity from other community members but still help local safety responders.
              </AppText>
            </View>
          </AppCard>
        </View>

        {/* SECTION 8: Emergency Toggle */}
        <View style={styles.sectionContainer}>
          <AppCard style={styles.toggleCard}>
            <View style={styles.toggleHeader}>
              <View style={styles.toggleHeaderInfo}>
                <MaterialCommunityIcons name="alert-octagon" size={24} color={isEmergency ? theme.colors.error : 'gray'} />
                <AppText variant="titleMedium" style={styles.toggleTitle}>
                  Immediate Dispatch
                </AppText>
              </View>
              <Checkbox
                status={isEmergency ? 'checked' : 'unchecked'}
                onPress={() => setIsEmergency(!isEmergency)}
                color={theme.colors.error}
              />
            </View>
            <AppText variant="bodyMedium" style={styles.emergencyDisclaimer} textColor={theme.colors.onSurfaceVariant}>
              Enable this if this requires immediate emergency response from municipal authorities.
            </AppText>

            {/* Responsive Emergency Agency Icons */}
            {isEmergency && (
              <Animated.View style={styles.agenciesContainer}>
                <View style={[styles.agencyIconWrapper, { backgroundColor: '#FFEBEE' }]}>
                  <MaterialCommunityIcons name="police-badge" size={24} color="#C62828" />
                  <AppText variant="bodySmall" style={[styles.agencyLabel, { color: '#C62828' }]}>Police</AppText>
                </View>

                <View style={[styles.agencyIconWrapper, { backgroundColor: '#E0F2F1' }]}>
                  <MaterialCommunityIcons name="ambulance" size={24} color="#00695C" />
                  <AppText variant="bodySmall" style={[styles.agencyLabel, { color: '#00695C' }]}>Hospital</AppText>
                </View>

                <View style={[styles.agencyIconWrapper, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons name="fire-truck" size={24} color="#E65100" />
                  <AppText variant="bodySmall" style={[styles.agencyLabel, { color: '#E65100' }]}>Fire Dept</AppText>
                </View>
              </Animated.View>
            )}
          </AppCard>
        </View>

        {/* SECTION 9: Community Visibility */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Community Visibility
          </AppText>
          <View style={styles.visibilityContainer}>
            {[
              { id: 'AUTHORITIES', label: 'Only Authorities', icon: 'shield-lock' },
              { id: 'COMMUNITY', label: 'Authorities + Nearby', icon: 'account-group' },
              { id: 'FEED', label: 'Public Safety Feed', icon: 'rss' },
            ].map((option) => {
              const isActive = visibility === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setVisibility(option.id as any)}
                  style={[
                    styles.visibilityBtn,
                    {
                      borderColor: isActive ? theme.colors.primary : theme.colors.outline,
                      backgroundColor: isActive ? theme.colors.primaryContainer : theme.colors.surface,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={16}
                    color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
                  />
                  <AppText
                    variant="button"
                    style={[styles.visibilityBtnText, { color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant }]}
                  >
                    {option.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECTION 10: AI Preview Card */}
        <View style={styles.sectionContainer}>
          <AppCard style={[styles.aiCard, { borderColor: theme.colors.outline }]}>
            <View style={styles.aiCardHeader}>
              <MaterialCommunityIcons name="robot" size={22} color="#5E35B1" />
              <AppText variant="titleMedium" style={styles.aiTitle}>
                GoSafe AI Analysis
              </AppText>
              <View style={styles.aiBadge}>
                <AppText variant="caption" style={styles.aiBadgeText}>AI Engine</AppText>
              </View>
            </View>
            <AppText variant="bodySmall" style={styles.aiDesc} textColor={theme.colors.onSurfaceVariant}>
              Your report details will feed into the GoSafe core algorithm. The neural mesh runs:
            </AppText>
            
            <View style={styles.aiGrid}>
              {[
                { name: 'Incident category', icon: 'tag-outline' },
                { name: 'Severity mapping', icon: 'alert-box-outline' },
                { name: 'Nearby risks analysis', icon: 'chart-line' },
                { name: 'Heatmap impacts', icon: 'map-marker-radius' },
                { name: 'Safe route updates', icon: 'routes' },
                { name: 'Duplicate filtering', icon: 'content-copy' },
              ].map((item, index) => (
                <View key={index} style={styles.aiGridItem}>
                  <MaterialCommunityIcons name={item.icon as any} size={14} color="#5E35B1" />
                  <AppText variant="bodySmall" style={styles.aiGridText}>
                    {item.name}
                  </AppText>
                </View>
              ))}
            </View>
          </AppCard>
        </View>

        {/* SECTION 11: Submit Button */}
        <View style={styles.submitContainer}>
          <AppButton
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitBtn}
          >
            {isSubmitting ? 'Verifying Coordinates...' : 'Report Incident'}
          </AppButton>
        </View>
      </ScrollView>

      {/* Safety Tips Bottom Sheet */}
      <BottomTipsSheet
        visible={showTips}
        onClose={() => setShowTips(false)}
        incidentType={selectedType}
      />

      {/* Success Dialog */}
      <SuccessDialog
        visible={showSuccess}
        onDismiss={handleResetForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  introHeader: {
    marginBottom: Spacing.md,
  },
  subtitle: {
    lineHeight: 20,
  },
  sectionContainer: {
    marginVertical: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  tipsTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsLink: {
    fontWeight: '600',
    marginLeft: 4,
  },
  chipsScroll: {
    paddingVertical: Spacing.xs,
  },
  chipButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.circular,
    borderWidth: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  chipText: {
    fontWeight: '600',
  },
  severityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  severityCardWrapper: {
    width: '48%',
    marginVertical: Spacing.xs,
    borderRadius: Radius.large,
    overflow: 'hidden',
  },
  severityCard: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.large,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  severityLabel: {
    marginTop: Spacing.sm,
    fontWeight: 'bold',
  },
  inputWrapper: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  textArea: {
    fontSize: 15,
    fontFamily: 'System',
    textAlignVertical: 'top',
    padding: 0,
    height: 100,
  },
  counterRow: {
    alignItems: 'flex-end',
  },
  locationCard: {
    marginVertical: Spacing.xs,
    padding: Spacing.md,
  },
  locationToggleRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    borderRadius: Radius.medium,
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 3,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.medium,
  },
  modeButtonText: {
    marginLeft: 6,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressTextColumn: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  bold: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressText: {
    lineHeight: 18,
    marginBottom: 4,
  },
  latLngRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: Spacing.xs,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  evidenceBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: Spacing.sm,
    backgroundColor: '#FAFADA',
  },
  evidenceBtnLabel: {
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
  previewsScroll: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
  },
  previewCard: {
    width: 130,
    padding: Spacing.sm,
    borderRadius: Radius.medium,
    marginRight: Spacing.md,
    position: 'relative',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  previewThumb: {
    width: '100%',
    height: 60,
    borderRadius: Radius.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  previewMeta: {
    alignItems: 'flex-start',
  },
  previewName: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  removeFileBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  toggleCard: {
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleTitle: {
    marginLeft: Spacing.md,
    fontWeight: 'bold',
  },
  infoBanner: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    marginTop: Spacing.md,
    alignItems: 'flex-start',
  },
  bannerIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  bannerText: {
    flex: 1,
    lineHeight: 16,
  },
  emergencyDisclaimer: {
    marginTop: Spacing.sm,
    lineHeight: 18,
  },
  agenciesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  agencyIconWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.medium,
    width: '28%',
  },
  agencyLabel: {
    marginTop: Spacing.xs,
    fontWeight: 'bold',
  },
  visibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  visibilityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
    borderRadius: Radius.medium,
    borderWidth: 1,
    marginHorizontal: 3,
  },
  visibilityBtnText: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 11,
  },
  aiCard: {
    padding: Spacing.md,
    borderWidth: 1.5,
    borderStyle: 'solid',
    backgroundColor: '#F5F3FF', // Lavender/purple hue
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  aiTitle: {
    fontWeight: 'bold',
    marginLeft: Spacing.sm,
    color: '#4A148C',
  },
  aiBadge: {
    marginLeft: 'auto',
    backgroundColor: '#7E57C2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.small,
  },
  aiBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  aiDesc: {
    marginBottom: Spacing.md,
  },
  aiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  aiGridItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  aiGridText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#5E35B1',
  },
  submitContainer: {
    marginTop: Spacing.xl,
  },
  submitBtn: {
    height: 52,
    justifyContent: 'center',
  },
});
