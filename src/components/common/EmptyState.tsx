import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon, Inbox } from 'lucide-react-native';
import { useTheme } from '../../theme';
import { AppText } from './Text';
import { AppButton } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon size={44} color={theme.colors.textMuted} />
      </View>

      <AppText variant="lg" weight="bold" align="center" style={{ marginTop: 16 }}>
        {title}
      </AppText>

      {description ? (
        <AppText
          variant="sm"
          color={theme.colors.textSecondary}
          align="center"
          style={[styles.description, { marginTop: 6 }]}
        >
          {description}
        </AppText>
      ) : null}

      {actionTitle && onAction ? (
        <AppButton
          title={actionTitle}
          variant="primary"
          size="md"
          onPress={onAction}
          style={{ marginTop: 20 }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    maxWidth: 280,
    lineHeight: 20,
  },
});
