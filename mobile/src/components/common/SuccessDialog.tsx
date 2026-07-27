import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { Portal, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { Spacing } from '../../theme/spacing';
import { Radius } from '../../theme/radius';

interface SuccessDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  visible,
  onDismiss,
}) => {
  const theme = useTheme();

  // Animation values
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Intro animations
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 120 });
      checkScale.value = withDelay(
        200,
        withSpring(1.2, { damping: 10 }, (finished) => {
          if (finished) {
            checkScale.value = withSpring(1.0);
          }
        })
      );
    } else {
      // Outro animations
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.7, { duration: 150 });
      checkScale.value = withTiming(0, { duration: 100 });
    }
  }, [visible]);

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 150 });
    scale.value = withTiming(0.7, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
  };

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const checkCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
    };
  });

  if (!visible && opacity.value === 0) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFillObject} pointerEvents={visible ? 'auto' : 'none'}>
        {/* Backdrop overlay */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.flex} onPress={handleClose} />
        </Animated.View>

        {/* Success Card Modal */}
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.dialogCard,
              { backgroundColor: theme.colors.elevation.level3 },
              cardStyle,
            ]}
          >
            {/* Animated Checkmark Circle */}
            <View style={styles.iconContainer}>
              <Animated.View
                style={[
                  styles.checkCircle,
                  { backgroundColor: theme.colors.secondary + '20' }, // Success green background tinted
                  checkCircleStyle,
                ]}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={64}
                  color={theme.colors.secondary || '#2E7D32'}
                />
              </Animated.View>
            </View>

            {/* Messages */}
            <AppText variant="titleLarge" style={styles.title}>
              Report Submitted
            </AppText>
            <AppText
              variant="bodyMedium"
              style={styles.subtitle}
              textColor={theme.colors.onSurfaceVariant}
            >
              Thank you for helping your community. Your report has been logged and is queue-ready for AI risk analyses.
            </AppText>

            {/* Close Button */}
            <AppButton
              mode="contained"
              onPress={handleClose}
              buttonColor={theme.colors.secondary}
              style={styles.button}
            >
              Done
            </AppButton>
          </Animated.View>
        </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  dialogCard: {
    width: SCREEN_WIDTH - Spacing.xxl * 2,
    borderRadius: Radius.extraLarge,
    padding: Spacing.xxl,
    alignItems: 'center',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: Radius.circular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  button: {
    width: '100%',
    height: 48,
  },
});
