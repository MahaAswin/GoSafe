import React from 'react';
import { Divider as PaperDivider } from 'react-native-paper';
import { ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Spacing } from '../../theme/spacing';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  return <PaperDivider style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    marginVertical: Spacing.sm,
  },
});
