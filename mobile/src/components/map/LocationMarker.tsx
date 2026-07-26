import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius } from '../../theme/radius';
import { Spacing } from '../../theme/spacing';

interface LocationMarkerProps {
  icon: string;
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  icon,
  color,
  size = 24,
  style,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: color + '20', borderColor: color }, style]}>
      <MaterialCommunityIcons name={icon as any} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: Radius.circular,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xs,
  },
});
