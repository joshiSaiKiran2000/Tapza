import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export interface AppCardProps extends ViewProps {
  elevated?: boolean;
  bordered?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const AppCard: React.FC<AppCardProps> = ({
  elevated = true,
  bordered = true,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: bordered ? 1 : 0,
    borderColor: theme.colors.border,
    ...(elevated ? theme.shadows.sm : {}),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};
