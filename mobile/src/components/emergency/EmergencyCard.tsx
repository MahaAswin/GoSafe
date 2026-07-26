import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { AppCard } from '../common/AppCard';
import { AppText } from '../common/AppText';
import { AppButton } from '../common/AppButton';
import { Spacing } from '../../theme/spacing';

interface EmergencyCardProps {
  name: string;
  phone: string;
  onCallPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  name,
  phone,
  onCallPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <AppCard style={style}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Avatar.Icon
            size={40}
            icon="phone"
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.primary}
          />
          <View style={styles.textContainer}>
            <AppText variant="titleSmall" style={styles.name}>
              {name}
            </AppText>
            <AppText variant="bodySmall" textColor={theme.colors.onSurfaceVariant}>
              {phone}
            </AppText>
          </View>
        </View>
        <AppButton mode="outlined" onPress={onCallPress} style={styles.button}>
          CALL
        </AppButton>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 0,
  },
});
