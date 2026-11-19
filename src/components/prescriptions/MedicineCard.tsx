import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Pill,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Circle,
  Clock,
  Info,
} from 'lucide-react-native';
import { Medicine, DoseTiming } from '../../types/prescription';
import { useTheme } from '../../theme';
import { AppText, AppCard, AppBadge } from '../common';

interface MedicineCardProps {
  medicine: Medicine;
  onToggleDose: (medicineId: string, timing: DoseTiming) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onToggleDose,
}) => {
  const theme = useTheme();

  const renderDoseSchedulePill = (
    timing: DoseTiming,
    title: string,
    icon: React.ReactNode,
    item: Medicine['schedule']['morning']
  ) => {
    if (!item) {
      return (
        <View
          style={[
            styles.dosePill,
            styles.dosePillDisabled,
            { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.pillHeader}>
            <View style={{ opacity: 0.4 }}>{icon}</View>
            <AppText variant="xs" color={theme.colors.textMuted} style={{ marginLeft: 4 }}>
              {title}
            </AppText>
          </View>
          <AppText variant="xs" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
            None
          </AppText>
        </View>
      );
    }

    const isTaken = item.completed;
    const mealLabel =
      item.mealTiming === 'after_meal'
        ? 'After meal'
        : item.mealTiming === 'before_meal'
        ? 'Before meal'
        : 'With meal';

    return (
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityLabel={`${title} dose of ${medicine.name}, ${item.dosage}, ${isTaken ? 'marked as taken' : 'not taken yet'}. Tap to toggle.`}
        accessibilityState={{ checked: isTaken }}
        activeOpacity={0.7}
        onPress={() => onToggleDose(medicine.id, timing)}
        style={[
          styles.dosePill,
          {
            backgroundColor: isTaken ? theme.colors.successLight : theme.colors.surface,
            borderColor: isTaken ? theme.colors.success : theme.colors.border,
            minHeight: 68,
          },
        ]}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <View style={styles.pillHeader}>
          <View style={styles.iconTitleRow}>
            {icon}
            <AppText
              variant="xs"
              weight="bold"
              color={isTaken ? theme.colors.success : theme.colors.text}
              style={{ marginLeft: 4 }}
            >
              {title}
            </AppText>
          </View>
          {isTaken ? (
            <CheckCircle2 size={16} color={theme.colors.success} />
          ) : (
            <Circle size={16} color={theme.colors.textMuted} />
          )}
        </View>

        <AppText
          variant="xs"
          weight="semibold"
          color={isTaken ? theme.colors.success : theme.colors.text}
          style={{ marginTop: 4 }}
        >
          {item.dosage}
        </AppText>

        <AppText
          variant="xs"
          color={isTaken ? theme.colors.success : theme.colors.textSecondary}
          style={{ fontSize: 10, lineHeight: 12, marginTop: 2 }}
        >
          {item.time} • {mealLabel}
        </AppText>

        <View
          style={[
            styles.statusTag,
            {
              backgroundColor: isTaken ? theme.colors.success : theme.colors.primaryLight,
              marginTop: 4,
            },
          ]}
        >
          <AppText
            variant="xs"
            weight="bold"
            color={isTaken ? theme.colors.white : theme.colors.primary}
            style={{ fontSize: 9, lineHeight: 11 }}
          >
            {isTaken ? '✓ Taken' : 'Mark Taken'}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppCard style={{ marginBottom: theme.spacing.md }}>
      <View style={styles.headerRow}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
          <Pill size={22} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <AppText variant="md" weight="bold">
              {medicine.name}
            </AppText>
            <AppBadge label={`${medicine.durationDays} Days`} variant="primary" />
          </View>

          {medicine.nameHindi ? (
            <AppText variant="xs" color={theme.colors.textMuted} style={{ fontStyle: 'italic', marginTop: 1 }}>
              {medicine.nameHindi}
            </AppText>
          ) : null}

          <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
            {medicine.frequency} • {medicine.form.toUpperCase()}
          </AppText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

      <View style={styles.instructionsBox}>
        <Info size={14} color={theme.colors.primary} style={{ marginRight: 6, marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <AppText variant="xs" color={theme.colors.textSecondary}>
            {medicine.instructions}
          </AppText>
          {medicine.instructionsHindi ? (
            <AppText variant="xs" color={theme.colors.textMuted} style={{ fontStyle: 'italic', marginTop: 2 }}>
              {medicine.instructionsHindi}
            </AppText>
          ) : null}
        </View>
      </View>

      {/* Morning, Afternoon, Night Dose Schedules */}
      <AppText variant="xs" weight="bold" color={theme.colors.textMuted} style={{ marginTop: 12, marginBottom: 8 }}>
        DAILY DOSE SCHEDULE (Tap to toggle taken status)
      </AppText>

      <View style={styles.schedulesRow}>
        {renderDoseSchedulePill(
          'morning',
          'Morning',
          <Sun size={15} color="#F59E0B" />,
          medicine.schedule.morning
        )}
        {renderDoseSchedulePill(
          'afternoon',
          'Afternoon',
          <Sunset size={15} color="#EA580C" />,
          medicine.schedule.afternoon
        )}
        {renderDoseSchedulePill(
          'night',
          'Night',
          <Moon size={15} color="#6366F1" />,
          medicine.schedule.night
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  schedulesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dosePill: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  dosePillDisabled: {
    opacity: 0.5,
  },
  pillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTag: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
