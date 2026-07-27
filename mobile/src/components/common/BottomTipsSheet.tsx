import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { Portal, useTheme, IconButton } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Spacing } from '../../theme/spacing';
import { Radius } from '../../theme/radius';
import { IncidentTypeConfig } from '../../constants/incidentTypes';

interface BottomTipsSheetProps {
  visible: boolean;
  onClose: () => void;
  incidentType: IncidentTypeConfig | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.45;

export const BottomTipsSheet: React.FC<BottomTipsSheetProps> = ({
  visible,
  onClose,
  incidentType,
}) => {
  const theme = useTheme();
  
  // Animation shared values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animate in
      backdropOpacity.value = withTiming(0.4, { duration: 250 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
    } else {
      // Animate out
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 }, (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      });
    }
  }, [visible]);

  // Back button or swipe down close handling
  const handleDismiss = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  if (!visible && translateY.value === SCREEN_HEIGHT) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFillObject} pointerEvents={visible ? 'auto' : 'none'}>
        {/* Backdrop overlay */}
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
          <Pressable style={styles.flex} onPress={handleDismiss} />
        </Animated.View>

        {/* Bottom Sheet Container */}
        <Animated.View
          style={[
            styles.sheetContainer,
            { backgroundColor: theme.colors.elevation.level3 },
            animatedSheetStyle,
          ]}
        >
          {/* Drag Handle Bar */}
          <View style={styles.dragHandleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: theme.colors.outlineVariant || '#CCCCCC' }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={24}
                color={incidentType?.color || theme.colors.primary}
                style={styles.headerIcon}
              />
              <View>
                <AppText variant="titleMedium" style={styles.title}>
                  Safety Guidelines
                </AppText>
                {incidentType && (
                  <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
                    Emergency Action for {incidentType.emoji} {incidentType.label}
                  </AppText>
                )}
              </View>
            </View>
            <IconButton
              icon="close"
              size={20}
              onPress={handleDismiss}
              style={styles.closeButton}
            />
          </View>

          {/* Content List */}
          <View style={styles.content}>
            {incidentType?.safetyTips ? (
              incidentType.safetyTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View
                    style={[
                      styles.bulletPoint,
                      { backgroundColor: (incidentType.color || theme.colors.primary) + '20' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="check-bold"
                      size={14}
                      color={incidentType.color || theme.colors.primary}
                    />
                  </View>
                  <AppText variant="bodyMedium" style={styles.tipText}>
                    {tip}
                  </AppText>
                </View>
              ))
            ) : (
              <AppText variant="bodyMedium" style={styles.emptyText}>
                No specific instructions available for this category. Stay alert and follow authorities.
              </AppText>
            )}
          </View>
        </Animated.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: Radius.extraLarge * 1.5,
    borderTopRightRadius: Radius.extraLarge * 1.5,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: Radius.circular,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    marginRight: Spacing.md,
  },
  title: {
    fontWeight: 'bold',
  },
  closeButton: {
    margin: 0,
  },
  content: {
    marginTop: Spacing.lg,
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bulletPoint: {
    width: 24,
    height: 24,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: Spacing.xxl,
  },
});
