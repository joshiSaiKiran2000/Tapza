import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Award,
  Clock,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Languages,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  AppButton,
  AppCard,
  AppBadge,
  AppHeader,
  DoctorDetailsSkeleton,
  ErrorState,
} from '../components/common';
import { SlotSelectionBottomSheet, DateSelectorStrip } from '../components/booking';
import { defaultDoctorImages } from '../components/home/DoctorCarouselSection';
import { useBookingFlow } from '../hooks/useBookingFlow';
import type { RootStackScreenProps } from '../types/navigation';
import { Slot } from '../types/booking';

export const DoctorDetailsScreen: React.FC<RootStackScreenProps<'DoctorDetails'>> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { doctorId } = route.params;

  const {
    doctor,
    loadingDoctor,
    doctorError,
    selectedDate,
    setSelectedDate,
    slots,
    loadingSlots,
    slotsError,
    retryFetchSlots,
    selectedSlot,
    setSelectedSlot,
    isBooking,
    bookingError,
    optimisticBooking,
    bottomSheetRef,
    openSlotSheet,
    closeSlotSheet,
    confirmBooking,
  } = useBookingFlow({ doctorId });

  const handleBookingConfirmed = async (slot: Slot, patientName: string) => {
    const booking = await confirmBooking(slot, patientName);
    if (booking) {
      navigation.navigate('BookingSuccess', {
        bookingId: booking.id,
        doctorId: booking.doctorId,
        doctorName: booking.doctorName,
        speciality: booking.speciality,
        clinicName: booking.clinicName,
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        consultationFee: booking.consultationFee,
        patientName: booking.patientName,
      });
    }
  };

  if (loadingDoctor) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <AppHeader title="Doctor Profile" showBack onBack={() => navigation.goBack()} />
        <DoctorDetailsSkeleton />
      </SafeAreaView>
    );
  }

  if (doctorError || !doctor) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <AppHeader title="Doctor Profile" showBack onBack={() => navigation.goBack()} />
        <ErrorState
          title="Unable to Load Doctor Profile"
          message={doctorError || 'Doctor not found'}
          onRetry={retryFetchSlots}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        title={doctor.name}
        subtitle={`${doctor.speciality} • ${doctor.clinicName}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor Header Card */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.topRow}>
            <View style={[styles.avatarBox, { backgroundColor: theme.colors.primaryLight }]}>
              <Image
                source={{ uri: defaultDoctorImages[doctor.id] || defaultDoctorImages['doc-1'] }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <AppText variant="lg" weight="bold">
                {doctor.name}
              </AppText>
              <AppText variant="sm" color={theme.colors.textSecondary}>
                {doctor.speciality}
              </AppText>
              {doctor.specialityHindi ? (
                <AppText variant="xs" color={theme.colors.textMuted} style={{ fontStyle: 'italic' }}>
                  {doctor.specialityHindi}
                </AppText>
              ) : null}

              <View style={styles.ratingRow}>
                <Star size={16} color="#EAB308" fill="#EAB308" />
                <AppText variant="sm" weight="semibold" style={{ marginLeft: 4 }}>
                  {doctor.rating} ({doctor.reviewsCount}+ verified reviews)
                </AppText>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Experience
              </AppText>
              <AppText variant="md" weight="bold" color={theme.colors.primary}>
                {doctor.experienceYears}+ Years
              </AppText>
            </View>
            <View style={styles.metricItem}>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Consultation Fee
              </AppText>
              <AppText variant="md" weight="bold" color={theme.colors.primary}>
                ₹{doctor.fee}
              </AppText>
            </View>
            <View style={styles.metricItem}>
              <AppText variant="xs" color={theme.colors.textMuted}>
                City
              </AppText>
              <AppText variant="md" weight="bold" color={theme.colors.primary}>
                {doctor.city}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Date Selector Strip */}
        <DateSelectorStrip
          dates={doctor.availableDates}
          selectedDate={selectedDate}
          onSelectDate={(newDate) => setSelectedDate(newDate)}
        />

        {/* Clinic & Location Card */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.sectionTitleRow}>
            <MapPin size={20} color={theme.colors.primary} />
            <AppText variant="md" weight="bold" style={{ marginLeft: 8 }}>
              Clinic Address (हैदराबाद)
            </AppText>
          </View>
          <AppText variant="sm" weight="semibold" style={{ marginTop: 8 }}>
            {doctor.clinicName}
          </AppText>
          <AppText variant="sm" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
            {doctor.clinicAddress}
          </AppText>
          <AppText variant="xs" color={theme.colors.textMuted} style={{ marginTop: 6 }}>
            Wheelchair Accessible • Valet Parking • Pharmacy On-site
          </AppText>
        </AppCard>

        {/* Qualifications and About */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.sectionTitleRow}>
            <Award size={20} color={theme.colors.secondary} />
            <AppText variant="md" weight="bold" style={{ marginLeft: 8 }}>
              Qualifications & Credentials
            </AppText>
          </View>
          <AppText variant="sm" color={theme.colors.textSecondary} style={{ marginTop: 6 }}>
            {doctor.degrees}
          </AppText>

          <View style={[styles.divider, { backgroundColor: theme.colors.divider, marginVertical: 12 }]} />

          <AppText variant="sm" color={theme.colors.textSecondary} style={{ lineHeight: 20 }}>
            {doctor.about}
          </AppText>
          {doctor.aboutHindi ? (
            <AppText variant="xs" color={theme.colors.textMuted} style={{ marginTop: 6, fontStyle: 'italic', lineHeight: 18 }}>
              {doctor.aboutHindi}
            </AppText>
          ) : null}

          <View style={[styles.languagesRow, { marginTop: 12 }]}>
            <Languages size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {doctor.languages.map((lang) => (
                <AppBadge key={lang} label={lang} variant="info" />
              ))}
            </View>
          </View>
        </AppCard>

        {/* Optimistic Booking Indicator if in progress */}
        {optimisticBooking && (
          <AppCard style={{ marginBottom: theme.spacing.md, backgroundColor: theme.colors.primaryLight }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <AppText variant="sm" weight="bold" color={theme.colors.primary}>
                  Confirming your appointment...
                </AppText>
                <AppText variant="xs" color={theme.colors.textSecondary}>
                  Reserving slot for {optimisticBooking.patientName} on {optimisticBooking.appointmentDate}
                </AppText>
              </View>
            </View>
          </AppCard>
        )}

        {/* Primary Booking Trigger CTA */}
        <AppButton
          title={`Select Slot & Book (₹${doctor.fee})`}
          size="lg"
          icon={<Calendar size={18} color={theme.colors.white} />}
          onPress={openSlotSheet}
          style={{ marginBottom: 24 }}
        />
      </ScrollView>

      {/* Gesture-driven Slot Selection Bottom Sheet */}
      <SlotSelectionBottomSheet
        ref={bottomSheetRef}
        doctor={doctor}
        selectedDate={selectedDate}
        selectedDateFormatted={selectedDate}
        slots={slots}
        loadingSlots={loadingSlots}
        slotsError={slotsError}
        onRetrySlots={retryFetchSlots}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
        onConfirmBooking={handleBookingConfirmed}
        isBooking={isBooking}
        bookingError={bookingError}
        onClose={closeSlotSheet}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
