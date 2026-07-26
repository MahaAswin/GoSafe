import React from 'react';
import { ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { Radius } from '../../theme/radius';
import { Spacing } from '../../theme/spacing';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  mode?: 'contained' | 'outlined' | 'elevated';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  onPress,
  style,
  contentStyle,
  mode = 'contained',
}) => {
  return (
    <PaperCard
      onPress={onPress}
      mode={mode}
      style={[
        styles.card,
        { borderRadius: Radius.large },
        style,
      ]}
    >
      <PaperCard.Content style={contentStyle}>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.sm,
    overflow: 'hidden',
  },
});
