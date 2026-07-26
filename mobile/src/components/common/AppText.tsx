import React from 'react';
import { Text as PaperText, useTheme } from 'react-native-paper';
import { TextStyle, StyleProp } from 'react-native';
import { Typography, TypographyVariant } from '../../theme/typography';

interface AppTextProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  textColor?: string;
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'bodyMedium',
  style,
  numberOfLines,
  textColor,
}) => {
  const theme = useTheme();
  const baseStyle = Typography[variant];

  return (
    <PaperText
      numberOfLines={numberOfLines}
      style={[
        baseStyle,
        { color: textColor || theme.colors.onBackground },
        style,
      ]}
    >
      {children}
    </PaperText>
  );
};
