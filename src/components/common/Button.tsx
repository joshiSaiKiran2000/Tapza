import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityRole = 'button',
  accessibilityLabel,
  ...props
}) => {
  const theme = useTheme();

  const getContainerStyles = (): ViewStyle => {
    // Ensuring minimum 44pt touch target
    const baseHeight = size === 'sm' ? 44 : size === 'lg' ? 54 : 48;
    const paddingHorizontal =
      size === 'sm' ? theme.spacing.md : size === 'lg' ? theme.spacing.xl : theme.spacing.lg;

    let backgroundColor: string = theme.colors.primary;
    let borderColor: string = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'primary':
        backgroundColor = theme.colors.primary;
        break;
      case 'secondary':
        backgroundColor = theme.colors.secondary;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderColor = theme.colors.primary;
        borderWidth = 1.5;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        break;
      case 'danger':
        backgroundColor = theme.colors.error;
        break;
    }

    if (disabled || loading) {
      backgroundColor =
        variant === 'outline' || variant === 'ghost'
          ? 'transparent'
          : theme.colors.surfaceVariant;
      if (variant === 'outline') {
        borderColor = theme.colors.border;
      }
    }

    return {
      minHeight: 44,
      height: baseHeight,
      paddingHorizontal,
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextColor = (): string => {
    if (disabled) {
      return theme.colors.textMuted;
    }
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return theme.colors.white;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.white;
    }
  };

  const getTextVariant = () => {
    if (size === 'sm') return 'sm';
    if (size === 'lg') return 'lg';
    return 'md';
  };

  return (
    <TouchableOpacity
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      activeOpacity={0.75}
      disabled={disabled || loading}
      style={[getContainerStyles(), style]}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' ? <View style={{ marginRight: theme.spacing.sm }}>{icon}</View> : null}
          <AppText
            variant={getTextVariant()}
            weight="semibold"
            color={getTextColor()}
            style={textStyle}
          >
            {title}
          </AppText>
          {icon && iconPosition === 'right' ? <View style={{ marginLeft: theme.spacing.sm }}>{icon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
