import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
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
  MOCK_AI_INSIGHTS,
  MOCK_AI_PREDICTIONS,
  MOCK_NEIGHBORHOOD_INTEL,
  MOCK_RISK_TIMELINE,
  MOCK_HISTORICAL_TRENDS,
  AiInsightCard,
} from '@/src/constants/aiIntelligenceData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AiIntelligenceScreen() {
  const theme = useTheme();

  // Selected Insight/Prediction state for explainability details
  const [selectedInsight, setSelectedInsight] = useState<AiInsightCard | null>(MOCK_AI_INSIGHTS[0]);
  const [safetyPeriodFilter, setSafetyPeriodFilter] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');

  // Animation shared values
  const aiLogoRotation = useSharedValue(0);
  const neuralPulse = useSharedValue(1);
  const circularRingProgress = useSharedValue(0);

  useEffect(() => {
    // Rotating neural matrix
    aiLogoRotation.value = withRepeat(withTiming(360, { duration: 10000 }), -1, false);

    // Neural nodes pulsing
    neuralPulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000 }),
        withTiming(1.0, { duration: 2000 })
      ),
      -1,
      false
    );

    // Score circular meter fill in
    circularRingProgress.value = withTiming(0.92, { duration: 1500 });
  }, []);

  // Animated styles
  const rotatingMatrixStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${aiLogoRotation.value}deg` }],
  }));

  const neuralPulsingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: neuralPulse.value }],
    opacity: 1.4 - neuralPulse.value,
  }));

  const handleActionClick = (actionName: string) => {
    Alert.alert(
      '🤖 AI Assist Lock',
      `Smart path optimization action for "${actionName}" will be calculated in real time when navigation starts.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <AppHeader
        title="GoSafe AI"
        showBackButton={true}
        actions={[
          {
            icon: 'share-variant-outline',
            onPress: () => Alert.alert('Share Report', 'AI Safety diagnostics scorecard copy generated.'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SECTION 1: Subtitle & Pulsing AI Neural Network Graphic */}
        <View style={styles.aiGraphicContainer}>
          <View style={styles.graphicLayout}>
            <View style={styles.graphicMeta}>
              <AppText variant="headlineSmall" style={styles.bold} textColor={theme.colors.primary}>
                Safety Intelligence
              </AppText>
              <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                Your Personal Safety Intelligence Engine
              </AppText>
            </View>

            {/* Neural network animation rings */}
            <View style={styles.neuralCircleContainer}>
              <Animated.View style={[styles.pulseOuterRing, neuralPulsingStyle]} />
              <Animated.View style={[styles.pulseInnerRing, rotatingMatrixStyle]}>
                <MaterialCommunityIcons name="brain" size={28} color={theme.colors.primary} />
              </Animated.View>
            </View>
          </View>
        </View>

        {/* SECTION 2: Overall Safety Score Circular Meter */}
        <AppCard style={styles.scoreCard}>
          <View style={styles.scoreContainer}>
            <View style={styles.meterCol}>
              <View style={styles.meterBorderRing}>
                <AppText variant="displayMedium" style={styles.bold} textColor={theme.colors.primary}>
                  92
                </AppText>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                  / 100
                </AppText>
              </View>
            </View>
            
            <View style={styles.scoreMetaCol}>
              <View style={[styles.scoreTag, { backgroundColor: '#E8F5E9' }]}>
                <AppText variant="button" style={[styles.bold, { color: '#2E7D32' }]}>
                  🛡 EXCELLENT SAFETY SCORE
                </AppText>
              </View>
              <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant} style={styles.scoreDesc}>
                Safety vectors in Delhi/NCR are optimal. No immediate nearby threats logged in the last 15 minutes.
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* SECTION 3: Today's AI Insights Carousel */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Today's Safety Forecasts
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.insightsScroll}>
            {MOCK_AI_INSIGHTS.map((insight) => {
              const isSelected = selectedInsight?.id === insight.id;
              return (
                <TouchableOpacity
                  key={insight.id}
                  onPress={() => setSelectedInsight(insight)}
                  style={[
                    styles.insightCard,
                    {
                      borderColor: isSelected ? insight.color : theme.colors.outline,
                      backgroundColor: isSelected ? `${insight.color}10` : theme.colors.surface,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.insightHeader}>
                    <MaterialCommunityIcons name={insight.icon as any} size={22} color={insight.color} />
                    <View style={[styles.insightSeverityTag, { backgroundColor: `${insight.color}15` }]}>
                      <AppText variant="caption" style={[styles.bold, { color: insight.color, fontSize: 8 }]}>
                        {insight.severity}
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="titleSmall" style={[styles.bold, styles.insightTitle]}>
                    {insight.title}
                  </AppText>
                  <AppText variant="bodySmall" numberOfLines={2} textColor={theme.colors.onSurfaceVariant}>
                    {insight.desc}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTION 12: AI Explainability (Why did AI recommend this?) */}
        {selectedInsight && (
          <View style={styles.sectionContainer}>
            <AppCard style={[styles.explainCard, { borderLeftColor: selectedInsight.color }]}>
              <View style={styles.explainHeader}>
                <MaterialCommunityIcons name="comment-question-outline" size={20} color={selectedInsight.color} />
                <AppText variant="titleSmall" style={[styles.bold, { color: selectedInsight.color, marginLeft: Spacing.sm }]}>
                  Why does AI forecast "{selectedInsight.title}"?
                </AppText>
              </View>
              
              <View style={styles.explainGrid}>
                <View style={styles.explainItem}>
                  <MaterialCommunityIcons name="history" size={16} color={theme.colors.onSurfaceVariant} />
                  <AppText variant="bodySmall" style={styles.explainText}>
                    Historical incidents: <AppText variant="bodySmall" style={styles.bold}>Frequent snatched assets</AppText>
                  </AppText>
                </View>
                <View style={styles.explainItem}>
                  <MaterialCommunityIcons name="weather-partly-cloudy" size={16} color={theme.colors.onSurfaceVariant} />
                  <AppText variant="bodySmall" style={styles.explainText}>
                    Atmospheric index: <AppText variant="bodySmall" style={styles.bold}>Heavy downpour gauges active</AppText>
                  </AppText>
                </View>
                <View style={styles.explainItem}>
                  <MaterialCommunityIcons name="account-group-outline" size={16} color={theme.colors.onSurfaceVariant} />
                  <AppText variant="bodySmall" style={styles.explainText}>
                    Crowd density rating: <AppText variant="bodySmall" style={styles.bold}>Moderate local mesh presence</AppText>
                  </AppText>
                </View>
                <View style={styles.explainItem}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={theme.colors.onSurfaceVariant} />
                  <AppText variant="bodySmall" style={styles.explainText}>
                    Street illumination level: <AppText variant="bodySmall" style={styles.bold}>Sufficient lit highways</AppText>
                  </AppText>
                </View>
              </View>
            </AppCard>
          </View>
        )}

        {/* SECTION 4: AI Prediction Cards Grid */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            AI Danger Diagnostics
          </AppText>
          <GridList />
        </View>

        {/* SECTION 5: Personal Safety Analysis */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Personal Safety Diagnosis
          </AppText>
          <AppCard style={styles.personalAnalysisCard}>
            <View style={styles.analysisRow}>
              <View style={styles.analysisItem}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>TRAVEL PATTERN</AppText>
                <AppText variant="bodySmall" style={styles.bold}>Daily Commuter</AppText>
              </View>
              <View style={styles.analysisDivider} />
              <View style={styles.analysisItem}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>NIGHT TRAVEL</AppText>
                <AppText variant="bodySmall" style={styles.bold}>Low (12%)</AppText>
              </View>
              <View style={styles.analysisDivider} />
              <View style={styles.analysisItem}>
                <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>TRAVEL INDEX</AppText>
                <AppText variant="bodySmall" style={[styles.bold, { color: '#2E7D32' }]}>94/100</AppText>
              </View>
            </View>
            <View style={styles.analysisAlertRow}>
              <MaterialCommunityIcons name="shield-check" size={18} color="#2E7D32" />
              <AppText variant="bodySmall" style={styles.analysisAlertText} textColor={theme.colors.onSurfaceVariant}>
                Your travel behavior matches safe zones index patterns. Night trips remain secure.
              </AppText>
            </View>
          </AppCard>
        </View>

        {/* SECTION 6: Neighborhood Intelligence */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Local Neighborhood Intel
          </AppText>
          <AppCard style={styles.neighborCard}>
            <View style={styles.neighborHeader}>
              <MaterialCommunityIcons name="city" size={20} color={theme.colors.primary} />
              <AppText variant="titleSmall" style={[styles.bold, { marginLeft: Spacing.sm }]}>
                {MOCK_NEIGHBORHOOD_INTEL.areaName}
              </AppText>
            </View>
            
            <View style={styles.neighborGrid}>
              <View style={styles.neighborItem}>
                <MaterialCommunityIcons name="security" size={16} color={theme.colors.onSurfaceVariant} />
                <AppText variant="bodySmall" style={styles.neighborItemText}>
                  Police patrol density: <AppText variant="bodySmall" style={styles.bold}>{MOCK_NEIGHBORHOOD_INTEL.policePresence}</AppText>
                </AppText>
              </View>
              
              <View style={styles.neighborItem}>
                <MaterialCommunityIcons name="account-group" size={16} color={theme.colors.onSurfaceVariant} />
                <AppText variant="bodySmall" style={styles.neighborItemText}>
                  Online safety mesh volunteers: <AppText variant="bodySmall" style={styles.bold}>{MOCK_NEIGHBORHOOD_INTEL.volunteersCount} active</AppText>
                </AppText>
              </View>
              
              <View style={styles.neighborItem}>
                <MaterialCommunityIcons name="alert-circle-outline" size={16} color={theme.colors.onSurfaceVariant} />
                <AppText variant="bodySmall" style={styles.neighborItemText}>
                  Recent incidents: <AppText variant="bodySmall" style={styles.bold}>{MOCK_NEIGHBORHOOD_INTEL.recentIncidentsCount} (Resolved)</AppText>
                </AppText>
              </View>
            </View>
          </AppCard>
        </View>

        {/* SECTION 7: AI Recommended Actions */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            AI Recommended Actions
          </AppText>
          <AppCard style={styles.actionsCard}>
            {[
              { text: 'Avoid Tunnel Route A (Mayur Vihar) after dusk', icon: 'transit-connection-horizontal', label: 'Route Blocked' },
              { text: 'Complete Sector 4 outdoor activities before 7 PM', icon: 'weather-sunset', label: 'Recommended' },
              { text: 'Carry fully charged power kit (low battery warning area)', icon: 'battery-alert', label: 'Alert' },
            ].map((action, idx) => (
              <View key={idx}>
                <View style={styles.actionRow}>
                  <View style={styles.actionMeta}>
                    <MaterialCommunityIcons name={action.icon as any} size={20} color={theme.colors.primary} />
                    <AppText variant="bodySmall" style={styles.actionText}>
                      {action.text}
                    </AppText>
                  </View>
                  <TouchableOpacity onPress={() => handleActionClick(action.text)} style={styles.actionPill}>
                    <AppText variant="caption" style={[styles.bold, { color: theme.colors.primary }]}>
                      Resolve
                    </AppText>
                  </TouchableOpacity>
                </View>
                {idx < 2 && <View style={styles.actionDivider} />}
              </View>
            ))}
          </AppCard>
        </View>

        {/* SECTION 8: Incident Prediction Timeline */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Risk Exposure Timeline
          </AppText>
          <AppCard style={styles.timelineCard}>
            {MOCK_RISK_TIMELINE.map((item, idx) => (
              <View key={item.period} style={styles.timelineRow}>
                <View style={styles.timelineIndicators}>
                  <View style={[styles.timelineNode, { backgroundColor: item.color }]} />
                  {idx < 3 && <View style={[styles.timelineLine, { backgroundColor: theme.colors.outline }]} />}
                </View>
                
                <View style={styles.timelineContent}>
                  <View style={styles.timelineMeta}>
                    <AppText variant="titleSmall" style={styles.bold}>
                      {item.period}
                    </AppText>
                    <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                      {item.time}
                    </AppText>
                  </View>
                  <View style={styles.timelineProgressRow}>
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: `${item.score}%`, backgroundColor: item.color }]} />
                    </View>
                    <AppText variant="caption" style={[styles.bold, { color: item.color, marginLeft: Spacing.sm }]}>
                      {item.score}% Risk
                    </AppText>
                  </View>
                </View>
              </View>
            ))}
          </AppCard>
        </View>

        {/* SECTION 9: Emergency Preparedness Tracker */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Emergency Preparedness Tracker
          </AppText>
          <AppCard style={styles.preparednessCard}>
            <View style={styles.preparednessMeterRow}>
              <View style={styles.preparednessProgressContainer}>
                <View style={[styles.preparednessProgressBar, { width: '95%', backgroundColor: '#2E7D32' }]} />
              </View>
              <AppText variant="titleSmall" style={[styles.bold, { color: '#2E7D32', marginLeft: Spacing.sm }]}>
                95% Ready
              </AppText>
            </View>
            <View style={styles.preparednessGrid}>
              {[
                { label: 'Medical Kit', val: 'Packed', ok: true },
                { label: 'Emergency Contacts', val: 'Synced (5)', ok: true },
                { label: 'Battery Reserve', val: '82%', ok: true },
                { label: 'Network Coverage', val: 'Excellent', ok: true },
                { label: 'GPS Coordinates', val: 'Locked', ok: true },
              ].map((item, index) => (
                <View key={index} style={styles.preparednessItem}>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#2E7D32" />
                  <AppText variant="bodySmall" style={styles.preparednessItemText}>
                    {item.label}: <AppText variant="bodySmall" style={styles.bold}>{item.val}</AppText>
                  </AppText>
                </View>
              ))}
            </View>
          </AppCard>
        </View>

        {/* SECTION 10: AI Community Analysis */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            AI Community Activity Mesh
          </AppText>
          <AppCard style={styles.communityCard}>
            <View style={styles.communityItem}>
              <MaterialCommunityIcons name="star-outline" size={18} color="#F57C00" />
              <AppText variant="bodySmall" style={styles.communityText}>
                Most active volunteer helper: <AppText variant="bodySmall" style={styles.bold}>Dr. Priya Nair (Medical Unit)</AppText>
              </AppText>
            </View>
            <View style={styles.communityDivider} />
            <View style={styles.communityItem}>
              <MaterialCommunityIcons name="map-marker-radius" size={18} color="#D32F2F" />
              <AppText variant="bodySmall" style={styles.communityText}>
                Most reported incident corridor: <AppText variant="bodySmall" style={styles.bold}>NH-8 Expressway Bypass</AppText>
              </AppText>
            </View>
          </AppCard>
        </View>

        {/* SECTION 11: Safety Trends Graphs (Visual layout representation) */}
        <View style={styles.sectionContainer}>
          <View style={styles.trendsHeader}>
            <AppText variant="titleMedium" style={styles.bold}>
              Safety Score Trends
            </AppText>
            <View style={styles.trendsFilters}>
              {['WEEKLY', 'MONTHLY'].map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setSafetyPeriodFilter(f as any)}
                  style={[
                    styles.trendFilterBtn,
                    safetyPeriodFilter === f && { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <AppText
                    variant="caption"
                    style={[styles.bold, { color: safetyPeriodFilter === f ? '#FFF' : theme.colors.onSurface }]}
                  >
                    {f}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <AppCard style={styles.trendsCard}>
            <View style={styles.chartContainer}>
              {MOCK_HISTORICAL_TRENDS.map((t) => (
                <View key={t.day} style={styles.chartBarCol}>
                  <View style={styles.chartBarWrapper}>
                    <View style={[styles.chartBar, { height: `${t.score - 40}%`, backgroundColor: theme.colors.primary }]} />
                  </View>
                  <AppText variant="caption" style={styles.chartBarLabel}>
                    {t.day}
                  </AppText>
                </View>
              ))}
            </View>
          </AppCard>
        </View>

        {/* SECTION 13: Future AI Modules Grid Map */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Upcoming AI Systems Preview
          </AppText>
          <View style={styles.upcomingGrid}>
            {[
              { name: 'Road Risk AI', icon: 'road-variant', badge: 'Q3' },
              { name: 'Crime Forecast AI', icon: 'shield-lock', badge: 'Q3' },
              { name: 'Flood Flow AI', icon: 'water-percent', badge: 'Q4' },
              { name: 'Medical Assist AI', icon: 'ambulance', badge: 'Q4' },
              { name: 'Women Safeguard AI', icon: 'gender-female', badge: 'Beta' },
              { name: 'Child Patrol AI', icon: 'account-child-outline', badge: 'Beta' },
            ].map((module, idx) => (
              <View key={idx} style={styles.upcomingItem}>
                <MaterialCommunityIcons name={module.icon as any} size={22} color={theme.colors.onSurfaceVariant} />
                <AppText variant="caption" style={[styles.bold, styles.upcomingLabel]}>
                  {module.name}
                </AppText>
                <View style={styles.upcomingBadge}>
                  <AppText variant="caption" style={{ fontSize: 8, color: '#FFF', fontWeight: 'bold' }}>
                    {module.badge}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// Prediction sub-grid layout helper
function GridList() {
  const theme = useTheme();
  return (
    <View style={styles.predictionsGrid}>
      {MOCK_AI_PREDICTIONS.map((pred) => (
        <AppCard key={pred.id} style={styles.predCard}>
          <View style={styles.predHeader}>
            <View style={[styles.predIconBg, { backgroundColor: `${pred.color}15` }]}>
              <MaterialCommunityIcons name={pred.icon as any} size={22} color={pred.color} />
            </View>
            <View style={styles.predHeaderMeta}>
              <AppText variant="titleSmall" style={styles.bold} numberOfLines={1}>
                {pred.category}
              </AppText>
              <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                Confidence: {pred.confidence}%
              </AppText>
            </View>
          </View>
          
          <View style={styles.predProgressBarRow}>
            <View style={styles.predProgressContainer}>
              <View style={[styles.predProgressBar, { width: `${pred.riskProbability}%`, backgroundColor: pred.color }]} />
            </View>
            <AppText variant="caption" style={[styles.bold, { color: pred.color, marginLeft: Spacing.sm }]}>
              {pred.riskProbability}%
            </AppText>
          </View>
          
          <AppText variant="caption" style={styles.predRecommendText} textColor={theme.colors.onSurfaceVariant}>
            Advice: {pred.recommendation}
          </AppText>
        </AppCard>
      ))}
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
  aiGraphicContainer: {
    marginBottom: Spacing.md,
  },
  graphicLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECEFF150',
    padding: Spacing.md,
    borderRadius: Radius.medium,
  },
  graphicMeta: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  neuralCircleContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseOuterRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(13, 71, 161, 0.15)',
  },
  pulseInnerRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meterCol: {
    marginRight: Spacing.md,
  },
  meterBorderRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#0D47A1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreMetaCol: {
    flex: 1,
  },
  scoreTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.small,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  scoreDesc: {
    lineHeight: 15,
  },
  sectionContainer: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  insightsScroll: {
    paddingVertical: Spacing.xs,
  },
  insightCard: {
    width: 220,
    padding: Spacing.md,
    borderRadius: Radius.medium,
    marginRight: Spacing.sm,
    borderWidth: 1,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  insightSeverityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.small,
  },
  insightTitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  explainCard: {
    padding: Spacing.md,
    borderLeftWidth: 4,
  },
  explainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  explainGrid: {
    gap: Spacing.sm,
  },
  explainItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  explainText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  predictionsGrid: {
    gap: Spacing.sm,
  },
  predCard: {
    padding: Spacing.md,
    elevation: 1,
  },
  predHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  predIconBg: {
    width: 36,
    height: 36,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  predHeaderMeta: {
    flex: 1,
  },
  predProgressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  predProgressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.circular,
    overflow: 'hidden',
  },
  predProgressBar: {
    height: '100%',
    borderRadius: Radius.circular,
  },
  predRecommendText: {
    lineHeight: 14,
  },
  personalAnalysisCard: {
    padding: Spacing.md,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  analysisItem: {
    alignItems: 'center',
  },
  analysisDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  analysisAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    padding: Spacing.sm,
    borderRadius: Radius.small,
  },
  analysisAlertText: {
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 14,
  },
  neighborCard: {
    padding: Spacing.md,
  },
  neighborHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  neighborGrid: {
    gap: Spacing.sm,
  },
  neighborItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  neighborItemText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  actionsCard: {
    padding: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  actionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.sm,
  },
  actionText: {
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 15,
  },
  actionPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.circular,
    backgroundColor: '#E1F5FE',
  },
  actionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: Spacing.sm,
  },
  timelineCard: {
    padding: Spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 65,
  },
  timelineIndicators: {
    alignItems: 'center',
    width: 20,
    marginRight: Spacing.md,
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.circular,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: Radius.circular,
  },
  preparednessCard: {
    padding: Spacing.md,
  },
  preparednessMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  preparednessProgressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.circular,
    overflow: 'hidden',
  },
  preparednessProgressBar: {
    height: '100%',
    borderRadius: Radius.circular,
  },
  preparednessGrid: {
    gap: Spacing.sm,
  },
  preparednessItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preparednessItemText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  communityCard: {
    padding: Spacing.md,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  communityDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: Spacing.sm,
  },
  trendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  trendsFilters: {
    flexDirection: 'row',
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.circular,
    padding: 2,
  },
  trendFilterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.circular,
  },
  trendsCard: {
    padding: Spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  chartBarCol: {
    alignItems: 'center',
    width: '12%',
  },
  chartBarWrapper: {
    height: '80%',
    width: 8,
    backgroundColor: '#ECEFF1',
    borderRadius: Radius.circular,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: Radius.circular,
  },
  chartBarLabel: {
    marginTop: 4,
    fontSize: 9,
  },
  upcomingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  upcomingItem: {
    width: '31%',
    backgroundColor: '#ECEFF150',
    padding: Spacing.sm,
    borderRadius: Radius.medium,
    alignItems: 'center',
    marginVertical: Spacing.xs,
    position: 'relative',
  },
  upcomingLabel: {
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
  upcomingBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0D47A1',
    borderRadius: Radius.circular,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
});
