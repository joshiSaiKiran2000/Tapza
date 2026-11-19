import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './Text';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';

export interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'primary',
  style,
}) => {
  const theme = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: theme.colors.successLight, text: theme.colors.success };
      case 'warning':
        return { bg: theme.colors.warningLight, text: theme.colors.warning };
      case 'error':
        return { bg: theme.colors.errorLight, text: theme.colors.error };
      case 'info':
        return { bg: theme.colors.infoLight, text: theme.colors.info };
      case 'secondary':
        return { bg: theme.colors.secondaryLight, text: theme.colors.secondary };
      case 'primary':
      default:
        return { bg: theme.colors.primaryLight, text: theme.colors.primary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderRadius: theme.borderRadius.full,
          paddingHorizontal: theme.spacing.sm + 2,
          paddingVertical: theme.spacing.xs,
        },
        style,
      ]}
    >
      <AppText variant="xs" weight="semibold" color={text}>
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
