import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { Spacing } from '../../theme/spacing';
import { Radius } from '../../theme/radius';

interface AppButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  mode?: 'contained' | 'outlined' | 'text' | 'elevated';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  buttonColor?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  onPress,
  children,
  mode = 'contained',
  loading = false,
  disabled = false,
  icon,
  style,
  textColor,
  buttonColor,
}) => {
  return (
    <PaperButton
      onPress={onPress}
      mode={mode}
      loading={loading}
      disabled={disabled}
      icon={icon}
      textColor={textColor}
      buttonColor={buttonColor}
      style={[
        styles.button,
        { borderRadius: Radius.medium },
        style,
      ]}
      contentStyle={styles.content}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: Spacing.sm,
  },
  content: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
