import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../common/AppText';
import { AppCard } from '../common/AppCard';
import { Spacing } from '../../theme/spacing';

interface LegendItem {
  label: string;
  color: string;
}

interface MapLegendProps {
  items: LegendItem[];
  style?: StyleProp<ViewStyle>;
}

export const MapLegend: React.FC<MapLegendProps> = ({ items, style }) => {
  const theme = useTheme();

  return (
    <AppCard style={[styles.card, style]}>
      <AppText variant="titleSmall" style={styles.title}>
        Map Legend
      </AppText>
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={[styles.badge, { backgroundColor: item.color }]} />
            <AppText variant="bodySmall" textColor={theme.colors.onSurface}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginBottom: Spacing.xs,
  },
  badge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
});
