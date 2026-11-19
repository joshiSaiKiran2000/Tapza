import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../../theme';
import { AppText } from './Text';
import { AppButton } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'We could not connect to the healthcare server. Please check your network and try again.',
  onRetry,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.errorLight }]}>
        <AlertCircle size={44} color={theme.colors.error} />
      </View>

      <AppText variant="lg" weight="bold" align="center" style={{ marginTop: 16 }}>
        {title}
      </AppText>

      <AppText
        variant="sm"
        color={theme.colors.textSecondary}
        align="center"
        style={[styles.message, { marginTop: 6 }]}
      >
        {message}
      </AppText>

      {onRetry ? (
        <AppButton
          title="Retry Connection"
          variant="primary"
          size="md"
          icon={<RefreshCw size={16} color={theme.colors.white} />}
          onPress={onRetry}
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
  message: {
    maxWidth: 290,
    lineHeight: 20,
  },
});
