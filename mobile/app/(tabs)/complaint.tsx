import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reusable components & constants
import { AppHeader } from '@/src/components/common/AppHeader';
import { AppCard } from '@/src/components/common/AppCard';
import { AppText } from '@/src/components/common/AppText';
import { AppButton } from '@/src/components/common/AppButton';
import { Spacing } from '@/src/theme/spacing';
import { Radius } from '@/src/theme/radius';
import { StorageKeys } from '@/src/constants/storage';
import { MOCK_CASE_REPORTS, CaseReport } from '@/src/constants/caseManagementData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ComplaintScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  // --- Search & Filters ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED' | 'REJECTED'>('ALL');

  // --- Dynamic Case Data ---
  const [cases, setCases] = useState<CaseReport[]>(MOCK_CASE_REPORTS);
  const [selectedCase, setSelectedCase] = useState<CaseReport | null>(MOCK_CASE_REPORTS[0]);

  // --- Feedback Card rating state ---
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  // --- Load cache (Sync reported incident mock) ---
  const loadCachedReports = async () => {
    try {
      const cached = await AsyncStorage.getItem(StorageKeys.cachedComplaints);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Format parsed complaints into CaseReport objects
        const mappedCached: CaseReport[] = parsed.map((item: any, idx: number) => ({
          id: `INC-200${idx}`,
          title: item.title || 'User Incident Report',
          category: item.type || 'General Hazard',
          severity: (item.severity || 'MEDIUM').toUpperCase() as any,
          location: item.location || 'Current Coordinates',
          datetime: 'Just Now',
          status: 'REPORTED',
          description: item.description || 'Reported by citizen using GoSafe incident portal.',
          reporter: 'John Doe',
          assignedAuthority: 'Awaiting local control room verify',
          eta: 'Pending dispatch',
          progress: 10,
          confirmedCount: 1,
          disputedCount: 0,
          confidenceScore: 50,
          timeline: [
            { title: 'Incident Created', time: 'Just Now', desc: 'Alert published via client app.' }
          ]
        }));
        // Merge cached with initial mock
        setCases([...mappedCached, ...MOCK_CASE_REPORTS]);
      } else {
        setCases(MOCK_CASE_REPORTS);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCachedReports();
    });
    loadCachedReports();
    return unsubscribe;
  }, [navigation]);

  // --- Helpers ---
  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'LOW': return '#2E7D32';
      case 'MEDIUM': return '#EF6C00';
      case 'HIGH': return '#E65100';
      case 'CRITICAL': return '#D32F2F';
      default: return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return '#9E9E9E';
      case 'VERIFIED': return '#0288D1';
      case 'ASSIGNED': return '#3F51B5';
      case 'IN_PROGRESS': return '#F57C00';
      case 'RESOLVED': return '#2E7D32';
      case 'REJECTED': return '#D32F2F';
      default: return '#757575';
    }
  };

  const handleClearCache = async () => {
    await AsyncStorage.removeItem(StorageKeys.cachedComplaints);
    loadCachedReports();
    Alert.alert('Cache Reset', 'User incident cache cleared.');
  };

  // --- Filtering logic ---
  const filteredCases = cases.filter((c) => {
    // Search query matches
    if (searchQuery.trim()) {
      const matchQuery = searchQuery.toLowerCase();
      if (!c.title.toLowerCase().includes(matchQuery) &&
          !c.id.toLowerCase().includes(matchQuery) &&
          !c.category.toLowerCase().includes(matchQuery)) {
        return false;
      }
    }
    // Severity filter
    if (selectedSeverityFilter !== 'ALL' && c.severity !== selectedSeverityFilter) {
      return false;
    }
    // Status filter
    if (selectedStatusFilter === 'ACTIVE') {
      return ['REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status);
    }
    if (selectedStatusFilter === 'RESOLVED' && c.status !== 'RESOLVED') {
      return false;
    }
    if (selectedStatusFilter === 'REJECTED' && c.status !== 'REJECTED') {
      return false;
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    total: cases.length,
    pending: cases.filter((c) => c.status === 'REPORTED').length,
    verified: cases.filter((c) => c.status === 'VERIFIED').length,
    assigned: cases.filter((c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length,
    resolved: cases.filter((c) => c.status === 'RESOLVED').length,
    rejected: cases.filter((c) => c.status === 'REJECTED').length,
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0) {
      Alert.alert('Error', 'Please choose a rating first.');
      return;
    }
    Alert.alert(
      'Feedback Logged',
      `Thank you! You rated the resolution: ${feedbackRating}/5 stars.`
    );
    setFeedbackRating(0);
    setFeedbackText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <AppHeader
        title="Incident Logs"
        actions={[
          {
            icon: 'delete-sweep-outline',
            onPress: handleClearCache,
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 2: Statistics Grid Cards */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Total', count: stats.total, color: theme.colors.primary },
            { label: 'Reported', count: stats.pending, color: '#9E9E9E' },
            { label: 'Verified', count: stats.verified, color: '#0288D1' },
            { label: 'Assigned', count: stats.assigned, color: '#F57C00' },
            { label: 'Resolved', count: stats.resolved, color: '#2E7D32' },
            { label: 'Rejected', count: stats.rejected, color: '#D32F2F' },
          ].map((stat, idx) => (
            <View key={idx} style={styles.statItem}>
              <AppCard style={[styles.statCard, { borderTopColor: stat.color, borderTopWidth: 3 }]}>
                <AppText variant="titleMedium" style={styles.bold} textColor={stat.color}>
                  {stat.count}
                </AppText>
                <AppText variant="caption" style={{ fontSize: 9 }} textColor={theme.colors.onSurfaceVariant}>
                  {stat.label}
                </AppText>
              </AppCard>
            </View>
          ))}
        </View>

        {/* SECTION 10: Search & Filters Bar */}
        <View style={styles.filtersContainer}>
          <View style={styles.searchBarRow}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.onSurfaceVariant} style={{ marginRight: Spacing.sm }} />
            <TextInput
              placeholder="Search by ID, Category, Title..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filtersScrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
              {/* Severity chips */}
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                <TouchableOpacity
                  key={sev}
                  onPress={() => setSelectedSeverityFilter(sev as any)}
                  style={[
                    styles.filterChip,
                    selectedSeverityFilter === sev && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <AppText
                    variant="caption"
                    style={[styles.bold, { color: selectedSeverityFilter === sev ? '#FFF' : theme.colors.onSurface }]}
                  >
                    {sev} Severity
                  </AppText>
                </TouchableOpacity>
              ))}
              
              <View style={styles.chipDivider} />

              {/* Status chips */}
              {['ALL', 'ACTIVE', 'RESOLVED', 'REJECTED'].map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setSelectedStatusFilter(st as any)}
                  style={[
                    styles.filterChip,
                    selectedStatusFilter === st && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <AppText
                    variant="caption"
                    style={[styles.bold, { color: selectedStatusFilter === st ? '#FFF' : theme.colors.onSurface }]}
                  >
                    {st} Status
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* SECTION 3: Incident Timeline / Reports list */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Report Logs Timeline
          </AppText>
          
          {filteredCases.length === 0 ? (
            <AppCard style={styles.emptyCard}>
              <MaterialCommunityIcons name="clipboard-alert-outline" size={32} color={theme.colors.onSurfaceVariant} />
              <AppText variant="bodySmall" style={{ marginTop: 6 }} textColor={theme.colors.onSurfaceVariant}>
                No incidents match filter settings.
              </AppText>
            </AppCard>
          ) : (
            filteredCases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelectedCase(c)}
                  style={[
                    styles.caseItemCard,
                    {
                      borderColor: isSelected ? theme.colors.primary : 'rgba(0,0,0,0.05)',
                      borderWidth: isSelected ? 1.5 : 1,
                    },
                  ]}
                >
                  <View style={styles.caseItemHeader}>
                    <View style={styles.caseItemMeta}>
                      <AppText variant="titleSmall" style={styles.bold} numberOfLines={1}>
                        {c.title}
                      </AppText>
                      <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                        ID: {c.id} • {c.category}
                      </AppText>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(c.status)}15` }]}>
                      <AppText variant="caption" style={[styles.bold, { color: getStatusColor(c.status), fontSize: 8 }]}>
                        {c.status}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.caseItemBody}>
                    <View style={styles.caseItemRow}>
                      <MaterialCommunityIcons name="map-marker-outline" size={14} color={theme.colors.onSurfaceVariant} />
                      <AppText variant="caption" style={styles.caseItemText} textColor={theme.colors.onSurfaceVariant} numberOfLines={1}>
                        {c.location}
                      </AppText>
                    </View>
                    <View style={styles.caseItemRow}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.onSurfaceVariant} />
                      <AppText variant="caption" style={styles.caseItemText} textColor={theme.colors.onSurfaceVariant}>
                        {c.datetime}
                      </AppText>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* DETAILS PANEL & LIFECYCLE TRACKING */}
        {selectedCase && (
          <View style={styles.detailsPanel}>
            <AppText variant="titleMedium" style={styles.sectionTitle}>
              Lifecycle Diagnostics: {selectedCase.id}
            </AppText>

            {/* SECTION 4: Incident Details Card */}
            <AppCard style={styles.detailsCard}>
              <View style={styles.detailsRow}>
                <View style={styles.detailsCol}>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>REPORTER</AppText>
                  <AppText variant="bodySmall" style={styles.bold}>{selectedCase.reporter}</AppText>
                </View>
                <View style={styles.detailsCol}>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>EST. RESOLUTION</AppText>
                  <AppText variant="bodySmall" style={styles.bold}>{selectedCase.eta}</AppText>
                </View>
                <View style={styles.detailsCol}>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>SEVERITY</AppText>
                  <AppText variant="bodySmall" style={[styles.bold, { color: getSeverityColor(selectedCase.severity) }]}>
                    {selectedCase.severity}
                  </AppText>
                </View>
              </View>

              <AppText variant="caption" style={{ marginTop: Spacing.sm }} textColor={theme.colors.onSurfaceVariant}>
                DESCRIPTION
              </AppText>
              <AppText variant="bodySmall" style={styles.descText}>
                {selectedCase.description}
              </AppText>

              <AppText variant="caption" style={{ marginTop: Spacing.sm }} textColor={theme.colors.onSurfaceVariant}>
                ASSIGNED OFFICER / AGENCY
              </AppText>
              <AppText variant="bodySmall" style={styles.bold}>
                {selectedCase.assignedAuthority}
              </AppText>

              <View style={styles.progressRow}>
                <View style={styles.progressHeader}>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>RESOLUTION PROGRESS</AppText>
                  <AppText variant="caption" style={styles.bold}>{selectedCase.progress}%</AppText>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${selectedCase.progress}%`, backgroundColor: theme.colors.primary }]} />
                </View>
              </View>
            </AppCard>

            {/* SECTION 5: Status Tracker timeline animation representation */}
            <AppCard style={styles.trackerCard}>
              <AppText variant="titleSmall" style={[styles.bold, { marginBottom: Spacing.md }]}>
                Lifecycle Status Path
              </AppText>
              <View style={styles.trackerRow}>
                {[
                  { label: 'Reported', val: 'REPORTED', index: 1 },
                  { label: 'Verified', val: 'VERIFIED', index: 2 },
                  { label: 'Assigned', val: 'ASSIGNED', index: 3 },
                  { label: 'In Progress', val: 'IN_PROGRESS', index: 4 },
                  { label: 'Resolved', val: 'RESOLVED', index: 5 },
                ].map((step, idx) => {
                  const getStepActiveIndex = (status: string) => {
                    if (status === 'REPORTED') return 1;
                    if (status === 'VERIFIED') return 2;
                    if (status === 'ASSIGNED') return 3;
                    if (status === 'IN_PROGRESS') return 4;
                    if (status === 'RESOLVED') return 5;
                    return 0; // rejected
                  };
                  const activeIdx = getStepActiveIndex(selectedCase.status);
                  const isDone = step.index <= activeIdx;
                  return (
                    <View key={step.index} style={styles.trackerStep}>
                      <View style={[styles.trackerNode, { backgroundColor: isDone ? theme.colors.primary : '#ECEFF1' }]}>
                        {isDone && <MaterialCommunityIcons name="check" size={10} color="#FFF" />}
                      </View>
                      <AppText variant="caption" style={[styles.trackerStepLabel, isDone && styles.bold]}>
                        {step.label}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            </AppCard>

            {/* SECTION 6: Authority Updates Feed */}
            <AppCard style={styles.updatesCard}>
              <AppText variant="titleSmall" style={[styles.bold, { marginBottom: Spacing.md }]}>
                Dispatch Log Activity
              </AppText>
              
              {selectedCase.timeline.map((item, idx) => (
                <View key={idx} style={styles.updateRow}>
                  <View style={styles.updateIndicatorCol}>
                    <View style={[styles.updateNode, { backgroundColor: theme.colors.primary }]} />
                    {idx < selectedCase.timeline.length - 1 && <View style={styles.updateLine} />}
                  </View>
                  <View style={styles.updateContentCol}>
                    <View style={styles.updateHeaderRow}>
                      <AppText variant="titleSmall" style={styles.bold}>{item.title}</AppText>
                      <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>{item.time}</AppText>
                    </View>
                    <AppText variant="bodySmall" style={{ marginTop: 2 }} textColor={theme.colors.onSurfaceVariant}>
                      {item.desc}
                    </AppText>
                  </View>
                </View>
              ))}
            </AppCard>

            {/* SECTION 7: Community Verification Mock */}
            <AppCard style={styles.verificationCard}>
              <AppText variant="titleSmall" style={[styles.bold, { marginBottom: Spacing.sm }]}>
                Community Validation Mesh
              </AppText>
              <View style={styles.verificationStats}>
                <View style={styles.vCol}>
                  <AppText variant="titleMedium" style={styles.bold} textColor="#2E7D32">
                    {selectedCase.confirmedCount}
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Confirmed Alert</AppText>
                </View>
                <View style={styles.vDivider} />
                <View style={styles.vCol}>
                  <AppText variant="titleMedium" style={styles.bold} textColor="#D32F2F">
                    {selectedCase.disputedCount}
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>Disputed</AppText>
                </View>
                <View style={styles.vDivider} />
                <View style={styles.vCol}>
                  <AppText variant="titleMedium" style={styles.bold} textColor="#0D47A1">
                    {selectedCase.confidenceScore}%
                  </AppText>
                  <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>AI Trust Level</AppText>
                </View>
              </View>
            </AppCard>

            {/* SECTION 8: Evidence Gallery */}
            <AppCard style={styles.evidenceCard}>
              <AppText variant="titleSmall" style={[styles.bold, { marginBottom: Spacing.sm }]}>
                Evidence Attachment files
              </AppText>
              <View style={styles.evidenceGrid}>
                <View style={styles.evidenceItem}>
                  <MaterialCommunityIcons name="image" size={24} color="#757575" />
                  <AppText variant="caption" style={{ marginTop: 4 }}>photo_01.jpg</AppText>
                </View>
                <View style={styles.evidenceItem}>
                  <MaterialCommunityIcons name="microphone" size={24} color="#757575" />
                  <AppText variant="caption" style={{ marginTop: 4 }}>audio_rec.wav</AppText>
                </View>
                <View style={styles.evidenceItem}>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color="#757575" />
                  <AppText variant="caption" style={{ marginTop: 4 }}>witness_sig.pdf</AppText>
                </View>
              </View>
            </AppCard>

            {/* SECTION 9: Response Feedback Rating Sheet */}
            {selectedCase.status === 'RESOLVED' && (
              <AppCard style={styles.feedbackCard}>
                <AppText variant="titleSmall" style={[styles.bold, { marginBottom: Spacing.xs }]}>
                  Rate Resolution Officer
                </AppText>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                  Help us evaluate our dynamic mesh volunteer response teams.
                </AppText>

                {/* Stars select row */}
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setFeedbackRating(star)}>
                      <MaterialCommunityIcons
                        name={star <= feedbackRating ? 'star' : 'star-outline'}
                        size={28}
                        color={star <= feedbackRating ? '#FBC02D' : '#B0BEC5'}
                        style={{ marginRight: Spacing.sm }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  placeholder="Suggestions, professionalism feedback..."
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  style={styles.feedbackInput}
                  multiline
                  numberOfLines={2}
                />

                <AppButton mode="contained" onPress={handleFeedbackSubmit} style={{ marginTop: Spacing.sm }}>
                  Submit Officer Rating
                </AppButton>
              </AppCard>
            )}

          </View>
        )}

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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statItem: {
    width: '31%',
    marginVertical: Spacing.xs,
  },
  statCard: {
    padding: Spacing.sm,
    alignItems: 'center',
    elevation: 2,
  },
  filtersContainer: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: Spacing.md,
    height: 40,
    borderRadius: Radius.medium,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },
  filtersScrollContainer: {
    height: 32,
  },
  filtersRow: {
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    height: 28,
    borderRadius: Radius.circular,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  chipDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginHorizontal: Spacing.sm,
  },
  sectionContainer: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  emptyCard: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  caseItemCard: {
    backgroundColor: '#FFF',
    padding: Spacing.md,
    borderRadius: Radius.medium,
    marginBottom: Spacing.sm,
    elevation: 1,
  },
  caseItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  caseItemMeta: {
    flex: 1,
    marginRight: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.small,
  },
  caseItemBody: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECEFF1',
    paddingTop: Spacing.sm,
    gap: 4,
  },
  caseItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caseItemText: {
    marginLeft: 6,
    flex: 1,
    fontSize: 11,
  },
  detailsPanel: {
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  detailsCard: {
    padding: Spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECEFF1',
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  detailsCol: {
    alignItems: 'center',
    width: '30%',
  },
  descText: {
    lineHeight: 16,
    marginVertical: 4,
  },
  progressRow: {
    marginTop: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.circular,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: Radius.circular,
  },
  trackerCard: {
    padding: Spacing.md,
  },
  trackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackerStep: {
    alignItems: 'center',
    width: '18%',
  },
  trackerNode: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  trackerStepLabel: {
    fontSize: 8,
    textAlign: 'center',
  },
  updatesCard: {
    padding: Spacing.md,
  },
  updateRow: {
    flexDirection: 'row',
    minHeight: 50,
  },
  updateIndicatorCol: {
    width: 16,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  updateNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    zIndex: 1,
  },
  updateLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  updateContentCol: {
    flex: 1,
  },
  updateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verificationCard: {
    padding: Spacing.md,
  },
  verificationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  vCol: {
    alignItems: 'center',
    width: '30%',
  },
  vDivider: {
    width: StyleSheet.hairlineWidth,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  evidenceCard: {
    padding: Spacing.md,
  },
  evidenceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xs,
  },
  evidenceItem: {
    alignItems: 'center',
    width: '30%',
    padding: Spacing.sm,
    borderColor: '#ECEFF1',
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  feedbackCard: {
    padding: Spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: Spacing.sm,
  },
  feedbackInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: Radius.medium,
    padding: Spacing.sm,
    fontSize: 12,
    color: '#000',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  bold: {
    fontWeight: 'bold',
  },
});
