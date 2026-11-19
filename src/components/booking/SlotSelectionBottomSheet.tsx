import React, { useState, useMemo, forwardRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  User,
  ShieldAlert,
} from 'lucide-react-native';
import { Doctor, Slot, SlotPeriod } from '../../types/booking';
import { useTheme } from '../../theme';
import { AppText, AppButton, AppCard, AppBadge } from '../common';

export interface SlotSelectionBottomSheetProps {
  doctor: Doctor;
  selectedDate: string;
  selectedDateFormatted: string;
  slots: Slot[];
  loadingSlots: boolean;
  slotsError: string | null;
  onRetrySlots: () => void;
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot) => void;
  onConfirmBooking: (slot: Slot, patientName: string) => Promise<void>;
  isBooking: boolean;
  bookingError: string | null;
  onClose: () => void;
}

export const SlotSelectionBottomSheet = forwardRef<BottomSheet, SlotSelectionBottomSheetProps>(
  (
    {
      doctor,
      selectedDateFormatted,
      slots,
      loadingSlots,
      slotsError,
      onRetrySlots,
      selectedSlot,
      onSelectSlot,
      onConfirmBooking,
      isBooking,
      bookingError,
      onClose,
    },
    ref
  ) => {
    const theme = useTheme();
    const [patientName, setPatientName] = useState('Aarav Sharma');

    // 65% and 90% snap points for gesture-driven height expansion
    const snapPoints = useMemo(() => ['65%', '90%'], []);

    const morningSlots = useMemo(
      () => slots.filter((s) => s.period === 'morning'),
      [slots]
    );
    const afternoonSlots = useMemo(
      () => slots.filter((s) => s.period === 'afternoon'),
      [slots]
    );
    const eveningSlots = useMemo(
      () => slots.filter((s) => s.period === 'evening'),
      [slots]
    );

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );

    const renderSlotSection = (
      title: string,
      periodIcon: React.ReactNode,
      periodSlots: Slot[]
    ) => {
      if (periodSlots.length === 0) return null;

      return (
        <View style={styles.periodGroup}>
          <View style={styles.periodHeader}>
            {periodIcon}
            <AppText variant="sm" weight="bold" style={{ marginLeft: 6 }}>
              {title}
            </AppText>
            <AppText variant="xs" color={theme.colors.textMuted} style={{ marginLeft: 6 }}>
              ({periodSlots.filter((s) => s.isAvailable).length} available)
            </AppText>
          </View>

          <View style={styles.slotsGrid}>
            {periodSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isAvailable = slot.isAvailable && !slot.isBooked;

              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={!isAvailable || isBooking}
                  accessibilityRole="button"
                  accessibilityLabel={`Time slot ${slot.time}, ${isAvailable ? 'available' : 'already booked'}`}
                  accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
                  onPress={() => onSelectSlot(slot)}
                  style={[
                    styles.slotPill,
                    {
                      borderColor: isSelected
                        ? theme.colors.primary
                        : isAvailable
                        ? theme.colors.border
                        : theme.colors.surfaceVariant,
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : isAvailable
                        ? theme.colors.surface
                        : theme.colors.surfaceVariant,
                      minHeight: 44,
                      minWidth: 80,
                    },
                  ]}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                >
                  <AppText
                    variant="xs"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={
                      isSelected
                        ? theme.colors.white
                        : isAvailable
                        ? theme.colors.text
                        : theme.colors.textMuted
                    }
                  >
                    {slot.time}
                  </AppText>
                  {!isAvailable && (
                    <AppText
                      variant="xs"
                      color={theme.colors.textMuted}
                      style={{ fontSize: 9, lineHeight: 11 }}
                    >
                      Booked
                    </AppText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
      >
        <BottomSheetScrollView contentContainerStyle={[styles.container, { padding: theme.spacing.md }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="lg" weight="bold">
                Select Consultation Slot
              </AppText>
              <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                {doctor.name} • {doctor.clinicName}
              </AppText>
            </View>
            <AppBadge label={selectedDateFormatted} variant="primary" />
          </View>

          {/* Conflict or Booking Error Banner */}
          {bookingError ? (
            <View
              style={[
                styles.errorBanner,
                {
                  backgroundColor: theme.colors.errorLight,
                  borderColor: theme.colors.error,
                  marginTop: theme.spacing.sm,
                },
              ]}
            >
              <ShieldAlert size={20} color={theme.colors.error} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <AppText variant="sm" weight="bold" color={theme.colors.error}>
                  Booking Conflict / Error
                </AppText>
                <AppText variant="xs" color={theme.colors.error} style={{ marginTop: 2 }}>
                  {bookingError}
                </AppText>
              </View>
            </View>
          ) : null}

          {/* Loading Slots Indicator */}
          {loadingSlots ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <AppText variant="sm" color={theme.colors.textSecondary} style={{ marginTop: 10 }}>
                Fetching live slots from {doctor.clinicName}...
              </AppText>
            </View>
          ) : slotsError ? (
            /* Error state with retry */
            <View style={styles.errorContainer}>
              <AlertCircle size={36} color={theme.colors.error} />
              <AppText variant="md" weight="bold" style={{ marginTop: 8 }}>
                Could not load slots
              </AppText>
              <AppText variant="xs" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
                {slotsError}
              </AppText>
              <AppButton
                title="Retry Fetching Slots"
                size="sm"
                variant="outline"
                icon={<RefreshCw size={14} color={theme.colors.primary} />}
                style={{ marginTop: 12 }}
                onPress={onRetrySlots}
              />
            </View>
          ) : slots.length === 0 ? (
            /* Empty state */
            <View style={styles.emptyContainer}>
              <Clock size={36} color={theme.colors.textMuted} />
              <AppText variant="md" weight="bold" style={{ marginTop: 8 }}>
                No Slots Available for this Date
              </AppText>
              <AppText variant="xs" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
                Please select another date above to view available appointments.
              </AppText>
            </View>
          ) : (
            <>
              {/* Slot Sections */}
              {renderSlotSection(
                'Morning Slots',
                <Sun size={16} color="#F59E0B" />,
                morningSlots
              )}
              {renderSlotSection(
                'Afternoon Slots',
                <Sunset size={16} color="#EA580C" />,
                afternoonSlots
              )}
              {renderSlotSection(
                'Evening Slots',
                <Moon size={16} color="#6366F1" />,
                eveningSlots
              )}

              {/* Patient Details Input */}
              <AppCard style={{ marginTop: theme.spacing.md, backgroundColor: theme.colors.surfaceVariant }}>
                <View style={styles.patientRow}>
                  <User size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <AppText variant="sm" weight="semibold">
                    Patient Name
                  </AppText>
                </View>
                <TextInput
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholder="Enter patient name"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                      borderRadius: theme.borderRadius.md,
                    },
                  ]}
                />

                <View style={[styles.feeRow, { marginTop: 10 }]}>
                  <AppText variant="xs" color={theme.colors.textMuted}>
                    Consultation Fee
                  </AppText>
                  <AppText variant="md" weight="bold" color={theme.colors.primary}>
                    ₹{doctor.fee}
                  </AppText>
                </View>
              </AppCard>

              {/* Confirmation Button */}
              <AppButton
                title={
                  selectedSlot
                    ? `Confirm Booking for ${selectedSlot.time}`
                    : 'Select a Slot Above'
                }
                size="lg"
                variant="primary"
                loading={isBooking}
                disabled={!selectedSlot || isBooking || !patientName.trim()}
                icon={<CheckCircle size={18} color={theme.colors.white} />}
                style={{ marginTop: theme.spacing.md, marginBottom: 20 }}
                onPress={() => {
                  if (selectedSlot) {
                    onConfirmBooking(selectedSlot, patientName.trim());
                  }
                }}
              />
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

SlotSelectionBottomSheet.displayName = 'SlotSelectionBottomSheet';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  loadingContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodGroup: {
    marginBottom: 14,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotPill: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
