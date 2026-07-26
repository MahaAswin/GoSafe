import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppIcons } from '../../constants';
import { AppText } from '../common/AppText';
import { Spacing } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface EmergencyButtonProps {
  onPress: () => void;
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onPress,
  isActive = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: isActive ? theme.colors.primary : theme.colors.error,
          shadowColor: isActive ? theme.colors.primary : theme.colors.error,
        },
        Shadows.large,
        style,
      ]}
    >
      <MaterialCommunityIcons name={AppIcons.emergency as any} size={64} color="white" />
      <AppText variant="titleMedium" style={styles.text}>
        {isActive ? 'CANCEL SOS' : 'HELP ME NOW'}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
