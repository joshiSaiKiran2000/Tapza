import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../theme';
import { AppText } from '../common';

interface UnknownSectionFallbackProps {
  sectionId: string;
  sectionType: string;
}

export const UnknownSectionFallback: React.FC<UnknownSectionFallbackProps> = ({
  sectionId,
  sectionType,
}) => {
  const theme = useTheme();

  // In production, we gracefully render nothing to avoid jarring UX.
  // In development, we render an informational warning box for developers.
  if (!__DEV__) {
    return null;
  }

  return (
    <View
      style={[
        styles.fallbackContainer,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.border,
          margin: theme.spacing.md,
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
        },
      ]}
    >
      <View style={styles.row}>
        <AlertCircle size={16} color={theme.colors.warning} />
        <AppText variant="xs" color={theme.colors.textMuted} style={{ marginLeft: 6 }}>
          [Dev Note] Unsupported section type &quot;{sectionType}&quot; (ID: {sectionId}) gracefully skipped.
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
