import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

export type TextVariant =
  | 'hero'
  | 'xxl'
  | 'xl'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs'
  | 'caption';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface AppTextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle | TextStyle[];
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'md',
  weight = 'regular',
  color,
  align = 'left',
  style,
  children,
  allowFontScaling = true,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case 'hero':
        return {
          fontSize: theme.typography.fontSize.hero,
          lineHeight: theme.typography.lineHeight.hero,
        };
      case 'xxl':
        return {
          fontSize: theme.typography.fontSize.xxl,
          lineHeight: theme.typography.lineHeight.xxl,
        };
      case 'xl':
        return {
          fontSize: theme.typography.fontSize.xl,
          lineHeight: theme.typography.lineHeight.xl,
        };
      case 'lg':
        return {
          fontSize: theme.typography.fontSize.lg,
          lineHeight: theme.typography.lineHeight.lg,
        };
      case 'md':
        return {
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
        };
      case 'sm':
        return {
          fontSize: theme.typography.fontSize.sm,
          lineHeight: theme.typography.lineHeight.sm,
        };
      case 'xs':
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.xs,
          lineHeight: theme.typography.lineHeight.xs,
        };
      default:
        return {
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
        };
    }
  };

  const getWeightStyle = (): TextStyle => {
    return {
      fontWeight: theme.typography.fontWeight[weight],
    };
  };

  const resolvedColor = color || theme.colors.text;

  return (
    <RNText
      allowFontScaling={allowFontScaling}
      style={[
        getVariantStyles(),
        getWeightStyle(),
        { color: resolvedColor, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
