import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  MOCK_FIRST_AID,
  MOCK_IMAGE_ANALYSIS,
  MOCK_QUICK_ACTIONS,
  FirstAidGuide,
  ImageAnalysisMock,
} from '@/src/constants/aiAssistantData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function AiAssistantScreen() {
  const theme = useTheme();

  // --- Voice Mode state ---
  // ready: idle standby, listening: voice record wave, thinking: loader, speaking: replies
  const [voiceState, setVoiceState] = useState<'ready' | 'listening' | 'thinking' | 'speaking'>('ready');
  
  // --- Chat console log ---
  const [textInput, setTextInput] = useState('');
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello John! I am your safety copilot. I analyze crowd density, water levels, and local crime watch records to assist you. Ask me anything or trigger a quick action below.', time: '19:30' },
  ]);

  // --- Vision AI mock state ---
  const [selectedScanImage, setSelectedScanImage] = useState<ImageAnalysisMock | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // --- First aid states ---
  const [expandedFirstAid, setExpandedFirstAid] = useState<string | null>(null);

  // --- Emergency SOS active state override ---
  const [emergencyOverride, setEmergencyOverride] = useState(false);

  // --- Animations ---
  const wave1Height = useSharedValue(10);
  const wave2Height = useSharedValue(25);
  const wave3Height = useSharedValue(15);
  const wave4Height = useSharedValue(30);

  useEffect(() => {
    // Continuous animation wave heights when voice state is active
    if (voiceState === 'listening' || voiceState === 'speaking') {
      wave1Height.value = withRepeat(
        withSequence(withTiming(45, { duration: 400 }), withTiming(10, { duration: 400 })),
        -1,
        true
      );
      wave2Height.value = withRepeat(
        withSequence(withTiming(60, { duration: 300 }), withTiming(15, { duration: 300 })),
        -1,
        true
      );
      wave3Height.value = withRepeat(
        withSequence(withTiming(50, { duration: 500 }), withTiming(12, { duration: 500 })),
        -1,
        true
      );
      wave4Height.value = withRepeat(
        withSequence(withTiming(40, { duration: 350 }), withTiming(8, { duration: 350 })),
        -1,
        true
      );
    } else {
      wave1Height.value = withSpring(8);
      wave2Height.value = withSpring(12);
      wave3Height.value = withSpring(10);
      wave4Height.value = withSpring(14);
    }
  }, [voiceState]);

  // Animated styles for voice wave lines
  const wave1Style = useAnimatedStyle(() => ({ height: wave1Height.value }));
  const wave2Style = useAnimatedStyle(() => ({ height: wave2Height.value }));
  const wave3Style = useAnimatedStyle(() => ({ height: wave3Height.value }));
  const wave4Style = useAnimatedStyle(() => ({ height: wave4Height.value }));

  // --- Actions ---
  const handleToggleVoice = () => {
    if (voiceState === 'ready') {
      setVoiceState('listening');
      // Simulate speaking reply after 3s listening
      setTimeout(() => {
        setVoiceState('thinking');
        setTimeout(() => {
          setVoiceState('speaking');
          // Add custom chat reply
          const newAiLog: ChatMessage = {
            id: Math.random().toString(),
            sender: 'ai',
            text: 'I detected rain accumulation on your route to Sector 4. Recommend walking via CP Bypass elevated corridor.',
            time: '19:31',
          };
          setChatLogs((prev) => [...prev, newAiLog]);
        }, 1200);
      }, 3000);
    } else {
      setVoiceState('ready');
    }
  };

  const handleSendTextMessage = () => {
    if (!textInput.trim()) return;

    const userLog: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textInput,
      time: '19:31',
    };

    setChatLogs((prev) => [...prev, userLog]);
    setTextInput('');

    // Simulate thinking loader and AI response
    setTimeout(() => {
      let replyText = 'I have logged this update in the safety database. No immediate action required.';
      if (textInput.toLowerCase().includes('fire')) {
        replyText = '🔥 ALERT: Transformer fire logged. Local fire dispatcher station notified. Recommended Action: Evacuate immediately.';
      } else if (textInput.toLowerCase().includes('route') || textInput.toLowerCase().includes('path')) {
        replyText = '🗺 AI ROUTING: Balanced path has 12% lower danger index compared to NH-8 Expressway.';
      }

      const aiLog: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: replyText,
        time: '19:31',
      };
      setChatLogs((prev) => [...prev, aiLog]);
    }, 1500);
  };

  const handleScanImageMock = (scan: ImageAnalysisMock) => {
    setIsScanning(true);
    setSelectedScanImage(null);

    setTimeout(() => {
      setIsScanning(false);
      setSelectedScanImage(scan);
    }, 1500);
  };

  const handleSuggestionPress = (action: string) => {
    if (action === 'first_aid') {
      setExpandedFirstAid('1'); // open CPR guide
    } else {
      Alert.alert(
        '🤖 Copilot Routing',
        `Navigating or preparing files for "${action}" is coming in the next release.`
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <AppHeader
        title="AI Copilot"
        showBackButton={true}
        actions={[
          {
            icon: 'lifebuoy',
            onPress: () => setEmergencyOverride(!emergencyOverride),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* EMERGENCY OVERRIDE BANNER */}
        {emergencyOverride && (
          <AppCard style={[styles.emergencyBanner, { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' }]}>
            <View style={styles.emergencyHeader}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#D32F2F" />
              <AppText variant="titleMedium" style={[styles.bold, { color: '#D32F2F', marginLeft: Spacing.sm }]}>
                Distress Signal Active
              </AppText>
            </View>
            <AppText variant="bodySmall" style={styles.emergencyDesc} textColor="#C62828">
              Stay calm. Help is on the way. Keep your phone unlocked and move to a safe, populated area immediately. Nearest safety volunteer doctor Priya Nair has been notified.
            </AppText>
            <AppButton mode="contained" buttonColor="#D32F2F" onPress={() => setEmergencyOverride(false)}>
              Dismiss Threat Panel
            </AppButton>
          </AppCard>
        )}

        {/* SECTION 1: AI Avatar & Wave Animation */}
        <AppCard style={styles.avatarCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarGraphicBg}>
              <MaterialCommunityIcons name="brain" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.avatarMeta}>
              <AppText variant="titleMedium" style={styles.bold}>GoSafe AI Copilot</AppText>
              <AppText variant="caption" textColor={theme.colors.onSurfaceVariant}>
                {voiceState === 'listening' ? 'Listening...' : voiceState === 'thinking' ? 'Analyzing vectors...' : 'Safety standby'}
              </AppText>
            </View>
          </View>

          {/* Voice Wave Animation Bars */}
          <View style={styles.waveContainer}>
            <Animated.View style={[styles.waveLine, { backgroundColor: theme.colors.primary }, wave1Style]} />
            <Animated.View style={[styles.waveLine, { backgroundColor: theme.colors.primary }, wave2Style]} />
            <Animated.View style={[styles.waveLine, { backgroundColor: theme.colors.primary }, wave3Style]} />
            <Animated.View style={[styles.waveLine, { backgroundColor: theme.colors.primary }, wave4Style]} />
          </View>

          {/* Microphone control button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleVoice}
            style={[
              styles.micButton,
              { backgroundColor: voiceState === 'listening' ? '#D32F2F' : theme.colors.primary },
            ]}
          >
            {voiceState === 'thinking' ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <MaterialCommunityIcons
                name={voiceState === 'listening' ? 'microphone-off' : 'microphone'}
                size={28}
                color="#FFF"
              />
            )}
          </TouchableOpacity>
        </AppCard>

        {/* SECTION 2: Conversation Logs Console */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Emergency Dialogue Console
          </AppText>
          <AppCard style={styles.chatConsole}>
            {chatLogs.map((log) => {
              const isAi = log.sender === 'ai';
              return (
                <View
                  key={log.id}
                  style={[
                    styles.chatBubble,
                    isAi ? styles.chatBubbleAi : styles.chatBubbleUser,
                  ]}
                >
                  <AppText variant="bodySmall" style={{ color: isAi ? '#000' : '#FFF' }}>
                    {log.text}
                  </AppText>
                  <AppText
                    variant="caption"
                    style={[styles.chatTime, { color: isAi ? 'gray' : 'rgba(255,255,255,0.7)' }]}
                  >
                    {log.time}
                  </AppText>
                </View>
              );
            })}
          </AppCard>

          {/* Text Input Row */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Report fire, request routing index..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={textInput}
              onChangeText={setTextInput}
              style={styles.chatInput}
            />
            <TouchableOpacity onPress={handleSendTextMessage} style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: Image Analysis Scan (Vision AI mock) */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            AI Vision Scanner Preview
          </AppText>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scanScroll}>
            {MOCK_IMAGE_ANALYSIS.map((scan) => (
              <TouchableOpacity
                key={scan.key}
                onPress={() => handleScanImageMock(scan)}
                style={styles.scanBtn}
              >
                <MaterialCommunityIcons name="image" size={18} color={theme.colors.primary} />
                <AppText variant="caption" style={[styles.bold, { marginLeft: 4 }]}>
                  {scan.title}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {isScanning && (
            <AppCard style={styles.scanningCard}>
              <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: Spacing.sm }} />
              <AppText variant="bodySmall">AI Vision Scanner analyzing pixels...</AppText>
            </AppCard>
          )}

          {selectedScanImage && !isScanning && (
            <AppCard style={styles.visionCard}>
              <View style={styles.visionHeader}>
                <AppText variant="titleSmall" style={styles.bold}>
                  {selectedScanImage.category}
                </AppText>
                <View style={[styles.severityBadge, { backgroundColor: '#FFEBEE' }]}>
                  <AppText variant="caption" style={[styles.bold, { color: '#D32F2F', fontSize: 8 }]}>
                    {selectedScanImage.severity}
                  </AppText>
                </View>
              </View>
              
              <AppText variant="bodySmall" style={styles.visionDesc} textColor={theme.colors.onSurfaceVariant}>
                {selectedScanImage.action}
              </AppText>
            </AppCard>
          )}
        </View>

        {/* SECTION 3: Quick Action Suggestion Chips */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Quick Assist Tasks
          </AppText>
          <View style={styles.suggestionsGrid}>
            {MOCK_QUICK_ACTIONS.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSuggestionPress(action.action)}
                style={styles.suggestionChip}
              >
                <MaterialCommunityIcons name={action.icon as any} size={18} color={theme.colors.primary} />
                <AppText variant="caption" style={[styles.bold, { marginLeft: 6 }]}>
                  {action.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SECTION 8: Interactive First Aid Guide */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            First Aid Guide Catalog
          </AppText>
          
          {MOCK_FIRST_AID.map((guide) => {
            const isExpanded = expandedFirstAid === guide.id;
            return (
              <AppCard key={guide.id} style={styles.guideCard}>
                <TouchableOpacity
                  onPress={() => setExpandedFirstAid(isExpanded ? null : guide.id)}
                  style={styles.guideHeader}
                >
                  <View style={styles.guideTitleRow}>
                    <MaterialCommunityIcons name={guide.icon as any} size={20} color={theme.colors.primary} />
                    <AppText variant="titleSmall" style={[styles.bold, { marginLeft: Spacing.sm }]}>
                      {guide.title}
                    </AppText>
                  </View>
                  <MaterialCommunityIcons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.guideStepsContainer}>
                    {guide.steps.map((step, sIdx) => (
                      <View key={sIdx} style={styles.stepRow}>
                        <View style={[styles.stepNumberCircle, { backgroundColor: theme.colors.primary }]}>
                          <AppText variant="caption" style={[styles.bold, { color: '#FFF', fontSize: 9 }]}>
                            {sIdx + 1}
                          </AppText>
                        </View>
                        <AppText variant="bodySmall" style={styles.stepText}>
                          {step}
                        </AppText>
                      </View>
                    ))}
                  </View>
                )}
              </AppCard>
            );
          })}
        </View>

        {/* SECTION 11: AI Explainability (Why AI recommended this?) */}
        <View style={styles.sectionContainer}>
          <AppText variant="titleMedium" style={styles.sectionTitle}>
            Copilot Safety Criteria Map
          </AppText>
          <AppCard style={styles.criteriaCard}>
            <AppText variant="bodySmall" style={{ lineHeight: 16 }} textColor={theme.colors.onSurfaceVariant}>
              AI Copilot decisions are driven by dynamic correlations of:
            </AppText>
            <View style={styles.criteriaGrid}>
              {[
                { label: 'Real-time rainfall gauges', icon: 'weather-pouring' },
                { label: 'Crime reports tally', icon: 'shield-alert' },
                { label: 'Crowd density sensors', icon: 'account-multiple' },
                { label: 'Nearby volunteer presence', icon: 'account-group' },
              ].map((item, index) => (
                <View key={index} style={styles.criteriaItem}>
                  <MaterialCommunityIcons name={item.icon as any} size={16} color={theme.colors.primary} />
                  <AppText variant="caption" style={{ marginLeft: 6, flex: 1 }}>{item.label}</AppText>
                </View>
              ))}
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
  emergencyBanner: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  emergencyDesc: {
    lineHeight: 15,
    marginBottom: Spacing.md,
  },
  avatarCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: Spacing.md,
  },
  avatarGraphicBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E1F5FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarMeta: {
    flex: 1,
  },
  waveContainer: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
    marginBottom: Spacing.md,
  },
  waveLine: {
    width: 6,
    borderRadius: Radius.circular,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionContainer: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  chatConsole: {
    padding: Spacing.md,
    maxHeight: 220,
    minHeight: 120,
    backgroundColor: '#ECEFF150',
    marginBottom: Spacing.sm,
  },
  chatBubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.medium,
    marginVertical: 4,
    maxWidth: '85%',
  },
  chatBubbleAi: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  chatBubbleUser: {
    backgroundColor: '#0D47A1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  chatTime: {
    fontSize: 8,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  chatInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFF',
    borderColor: '#CFD8DC',
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: Spacing.md,
    fontSize: 12,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanScroll: {
    paddingVertical: Spacing.xs,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 32,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: '#CFD8DC',
    backgroundColor: '#FFF',
    marginRight: Spacing.sm,
  },
  scanningCard: {
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  visionCard: {
    padding: Spacing.md,
    borderColor: '#B0BEC5',
    borderWidth: 1,
    marginTop: Spacing.xs,
  },
  visionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.small,
  },
  visionDesc: {
    lineHeight: 15,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 36,
    borderRadius: Radius.circular,
    backgroundColor: '#ECEFF1',
  },
  guideCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideStepsContainer: {
    marginTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CFD8DC',
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    lineHeight: 15,
  },
  criteriaCard: {
    padding: Spacing.md,
  },
  criteriaGrid: {
    marginTop: Spacing.sm,
    gap: 6,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});
