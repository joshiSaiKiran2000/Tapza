import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../theme';
import { AppText, AppCard } from '../common';

interface DoseProgressBarProps {
  totalDoses: number;
  completedDoses: number;
}

export const DoseProgressBar: React.FC<DoseProgressBarProps> = ({
  totalDoses,
  completedDoses,
}) => {
  const theme = useTheme();
  const percentage = totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;
  const isAllDone = totalDoses > 0 && completedDoses === totalDoses;

  return (
    <AppCard
      style={[
        styles.card,
        {
          backgroundColor: isAllDone ? theme.colors.successLight : theme.colors.surface,
          borderColor: isAllDone ? theme.colors.success : theme.colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          {isAllDone ? (
            <CheckCircle2 size={20} color={theme.colors.success} />
          ) : (
            <Clock size={20} color={theme.colors.primary} />
          )}
          <AppText
            variant="md"
            weight="bold"
            color={isAllDone ? theme.colors.success : theme.colors.text}
            style={{ marginLeft: 8 }}
          >
            {isAllDone ? 'All Doses Completed Today! 🎉' : "Today's Medicine Tracker"}
          </AppText>
        </View>

        <AppText
          variant="md"
          weight="bold"
          color={isAllDone ? theme.colors.success : theme.colors.primary}
        >
          {completedDoses}/{totalDoses} Doses
        </AppText>
      </View>

      {/* Progress Track */}
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceVariant, marginTop: 10 }]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isAllDone ? theme.colors.success : theme.colors.primary,
            },
          ]}
        />
      </View>

      <View style={[styles.bottomRow, { marginTop: 8 }]}>
        <AppText variant="xs" color={theme.colors.textSecondary}>
          {isAllDone
            ? 'Great job adhering to your healthcare course.'
            : `${totalDoses - completedDoses} more dose${totalDoses - completedDoses === 1 ? '' : 's'} remaining today.`}
        </AppText>
        <AppText variant="xs" weight="bold" color={theme.colors.text}>
          {percentage}%
        </AppText>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
