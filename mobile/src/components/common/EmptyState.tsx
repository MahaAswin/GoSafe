import React from 'react';
import { View, StyleSheet, Image, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { AppText } from './AppText';
import { Spacing } from '../../theme/spacing';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: string;
  imageSource?: any;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon = 'clipboard-text-off-outline',
  imageSource,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : (
        <MaterialCommunityIcons name={icon as any} size={64} color={theme.colors.onSurfaceVariant} />
      )}
      <AppText variant="titleMedium" style={styles.title}>
        {title}
      </AppText>
      {subtitle && (
        <AppText variant="bodyMedium" style={styles.subtitle} textColor={theme.colors.onSurfaceVariant}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: Spacing.lg,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
