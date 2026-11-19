import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '../../theme';
import { AppText } from '../common';

export interface DateOption {
  raw: string; // YYYY-MM-DD
  dayName: string; // "Fri", "Sat", "Tomorrow"
  dayNumber: string; // "20", "21"
  month: string; // "Nov"
}

interface DateSelectorStripProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (dateRaw: string) => void;
}

export const DateSelectorStrip: React.FC<DateSelectorStripProps> = ({
  dates,
  selectedDate,
  onSelectDate,
}) => {
  const theme = useTheme();

  // Helper to format date strings for display
  const formatDateOption = (rawDate: string, index: number): DateOption => {
    try {
      const d = new Date(rawDate);
      const dayName =
        index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dayNumber = d.getDate().toString();
      const month = d.toLocaleDateString('en-IN', { month: 'short' });
      return { raw: rawDate, dayName, dayNumber, month };
    } catch {
      return { raw: rawDate, dayName: `Day ${index + 1}`, dayNumber: `${index + 1}`, month: 'Nov' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Calendar size={18} color={theme.colors.primary} />
        <AppText variant="md" weight="bold" style={{ marginLeft: 6 }}>
          Select Appointment Date
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingVertical: theme.spacing.sm }]}
      >
        {dates.map((dateRaw, idx) => {
          const item = formatDateOption(dateRaw, idx);
          const isSelected = selectedDate === dateRaw;

          return (
            <TouchableOpacity
              key={dateRaw}
              accessibilityRole="button"
              accessibilityLabel={`${item.dayName}, ${item.dayNumber} ${item.month}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectDate(dateRaw)}
              style={[
                styles.dateCard,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.borderRadius.lg,
                  minHeight: 64,
                  minWidth: 64,
                },
              ]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <AppText
                variant="xs"
                weight={isSelected ? 'bold' : 'medium'}
                color={isSelected ? 'rgba(255,255,255,0.9)' : theme.colors.textMuted}
              >
                {item.dayName}
              </AppText>
              <AppText
                variant="lg"
                weight="bold"
                color={isSelected ? theme.colors.white : theme.colors.text}
                style={{ marginTop: 2 }}
              >
                {item.dayNumber}
              </AppText>
              <AppText
                variant="xs"
                color={isSelected ? 'rgba(255,255,255,0.85)' : theme.colors.textSecondary}
              >
                {item.month}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 8,
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});
