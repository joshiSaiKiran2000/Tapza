import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Receipt,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  AppButton,
  AppCard,
  AppBadge,
  AppHeader,
  ErrorState,
} from '../components/common';
import { doctorService } from '../services/doctorService';
import { defaultDoctorImages } from '../components/home/DoctorCarouselSection';
import { Booking } from '../types/booking';
import type { RootStackScreenProps } from '../types/navigation';

export const BookingDetailsScreen: React.FC<RootStackScreenProps<'BookingDetails'>> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getBookingById(bookingId);
      if (data) {
        setBooking(data);
      } else {
        setError('Booking not found');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleCancelBooking = () => {
    if (!booking) return;

    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your consultation with ${booking.doctorName} on ${booking.appointmentDate}?`,
      [
        {
          text: 'Keep Appointment',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              const updated = await doctorService.cancelBooking(booking.id);
              if (updated) {
                setBooking(updated);
              } else {
                setBooking((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
              }
              Alert.alert(
                'Appointment Cancelled',
                `Your appointment with ${booking.doctorName} has been cancelled. A full refund of ₹${booking.consultationFee} will be processed within 2-4 business days.`,
                [{ text: 'OK' }]
              );
            } catch (err: any) {
              Alert.alert('Cancellation Error', err?.message || 'Failed to cancel appointment');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8FAFC' }]}>
        <AppHeader
          title="Booking Details"
          subtitle={`Reference #${bookingId}`}
          showBack
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <AppText variant="sm" color={theme.colors.textSecondary} style={{ marginTop: 12 }}>
            Loading appointment details...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8FAFC' }]}>
        <AppHeader
          title="Booking Details"
          subtitle={`Reference #${bookingId}`}
          showBack
          onBack={() => navigation.goBack()}
        />
        <ErrorState
          title="Appointment Not Found"
          message={error || 'Could not find booking details'}
          onRetry={fetchBooking}
        />
      </SafeAreaView>
    );
  }

  const isAttended = booking.status === 'attended';
  const isCancelled = booking.status === 'cancelled';
  const isConfirmed = booking.status === 'confirmed';

  const doctorPhoto =
    booking.imageUrl || defaultDoctorImages[booking.doctorId] || defaultDoctorImages['doc-1'];
  const rating = booking.rating || 4.8;
  const reviewsCount = booking.reviewsCountFormatted || '8k reviews';

  return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F8FAFC' }]}>
        <AppHeader
          title="Booking Details"
          subtitle={`Ref #${booking.id}`}
          showBack
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
                  {/* 1. Status Banner */}
                  <View
                    style={[
                      styles.statusBanner,
                      {
                        backgroundColor: isCancelled
                          ? '#FEE2E2'
                          : isAttended
                            ? '#DCFCE7'
                            : '#E0F2FE',
                        borderColor: isCancelled
                          ? '#FECACA'
                          : isAttended
                            ? '#BBF7D0'
                            : '#BAE6FD',
                      },
                    ]}
                  >
                    {isCancelled ? (
                      <XCircle size={22} color="#DC2626" />
                    ) : (
                      <CheckCircle2
                        size={22}
                        color={isAttended ? '#15803D' : '#0284C7'}
                      />
                    )}

                    <View style={styles.statusBannerText}>
                      <AppText
                        variant="md"
                        weight="bold"
                        color={
                          isCancelled ? '#DC2626' : isAttended ? '#15803D' : '#0284C7'
                        }
                      >
                        {isCancelled
                          ? 'Appointment Cancelled'
                          : isAttended
                            ? 'Consultation Attended & Completed'
                            : 'Appointment Confirmed'}
                      </AppText>
                      <AppText
                        variant="xs"
                        color={
                          isCancelled ? '#B91C1C' : isAttended ? '#166534' : '#0369A1'
                        }
                        style={{ marginTop: 2 }}
                      >
                        {isCancelled
                          ? 'Refund of ₹' + booking.consultationFee + ' has been initiated to your account.'
                          : isAttended
                            ? 'Prescription & medical notes are saved in your Prescriptions tab.'
                            : 'Please arrive 15 minutes before your consultation slot.'}
                      </AppText>
                    </View>
                  </View>

                  {/* 2. Doctor Profile Card with Real Image */}
                  <AppCard style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                      <AppText variant="xs" weight="bold" color="#64748B" style={styles.sectionHeaderTitle}>
                        DOCTOR DETAILS
                      </AppText>
                      <AppBadge
                        label={isAttended ? 'Attended' : isCancelled ? 'Cancelled' : 'Confirmed'}
                        variant={isAttended ? 'success' : isCancelled ? 'error' : 'primary'}
                      />
                    </View>

                    <View style={styles.doctorInfoRow}>
                      {/* Doctor Photo */}
                      <View style={styles.doctorAvatarBox}>
                        <Image
                          source={{ uri: doctorPhoto }}
                          style={styles.doctorAvatarImage}
                          resizeMode="cover"
                        />
                      </View>

                      {/* Doctor Text Info */}
                      <View style={styles.doctorDetailsCol}>
                        <AppText variant="lg" weight="bold" color="#0F172A">
                          {booking.doctorName}
                        </AppText>
                          <AppText variant="sm" color="#64748B" style={{ marginTop: 2 }}>
                            {booking.speciality}
                          </AppText>
                          <View style={styles.ratingRow}>
                            <Star size={14} color="#F59E0B" fill="#F59E0B" />
                            <AppText variant="xs" weight="semibold" color="#334155" style={{ marginLeft: 4 }}>
                              {rating} ({reviewsCount})
                            </AppText>
                          </View>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Hospital Address */}
                    <View style={styles.clinicRow}>
                      <MapPin size={18} color="#0D9488" style={{ marginTop: 2 }} />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <AppText variant="sm" weight="bold" color="#0F172A">
                          {booking.clinicName}
                        </AppText>
                        <AppText variant="xs" color="#64748B" style={{ marginTop: 2 }}>
                          {booking.clinicAddress || 'Road No. 1, Banjara Hills, Hyderabad'}
                        </AppText>
                      </View>
                    </View>
                  </AppCard>

                      {/* 3. Slot Schedule Card */}
                      <AppCard style={styles.card}>
                        <AppText variant="xs" weight="bold" color="#64748B" style={styles.sectionHeaderTitle}>
                          APPOINTMENT SLOT
                        </AppText>

                          <View style={[styles.slotRow, { marginTop: 10 }]}>
                            <View style={styles.slotIconBox}>
                              <Calendar size={20} color="#0D9488" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <AppText variant="xs" color="#64748B">
                                Appointment Date
                              </AppText>
                              <AppText variant="sm" weight="bold" color="#0F172A" style={{ marginTop: 1 }}>
                                {booking.appointmentDate}
                              </AppText>
                            </View>
                          </View>

                          <View style={[styles.slotRow, { marginTop: 12 }]}>
                            <View style={styles.slotIconBox}>
                              <Clock size={20} color="#0D9488" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <AppText variant="xs" color="#64748B">
                                Consultation Time
                              </AppText>
                              <AppText variant="sm" weight="bold" color="#0F172A" style={{ marginTop: 1 }}>
                                {booking.appointmentTime} IST (20 mins slot)
                              </AppText>
                            </View>
                          </View>

                          <View style={[styles.slotRow, { marginTop: 12 }]}>
                            <View style={styles.slotIconBox}>
                              <Receipt size={20} color="#0D9488" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <AppText variant="xs" color="#64748B">
                                Slot Reference Token
                              </AppText>
                              <AppText variant="sm" weight="semibold" color="#475569" style={{ marginTop: 1 }}>
                                {booking.slotId}
                              </AppText>
                            </View>
                          </View>
                      </AppCard>

                          {/* 4. Patient Information & Payment Card */}
                          <AppCard style={styles.card}>
                            <AppText variant="xs" weight="bold" color="#64748B" style={styles.sectionHeaderTitle}>
                              PATIENT & BILLING
                            </AppText>

                                <View style={[styles.detailRow, { marginTop: 10 }]}>
                                  <AppText variant="sm" color="#64748B">
                                    Patient Name:
                                  </AppText>
                                    <AppText variant="sm" weight="bold" color="#0F172A">
                                      {booking.patientName}
                                    </AppText>
                                </View>

                                    <View style={styles.detailRow}>
                                      <AppText variant="sm" color="#64748B">
                                        Contact Phone:
                                      </AppText>
                                        <AppText variant="sm" weight="medium" color="#0F172A">
                                          {booking.patientPhone || '+91 98765 43210'}
                                        </AppText>
                                    </View>

                                        <View style={styles.divider} />

                                        <View style={styles.detailRow}>
                                          <AppText variant="sm" color="#64748B">
                                            Consultation Fee:
                                          </AppText>
                                            <AppText variant="md" weight="bold" color="#0D9488">
                                              ₹{booking.consultationFee}
                                            </AppText>
                                        </View>

                                        <View style={styles.detailRow}>
                                          <AppText variant="sm" color="#64748B">
                                            Payment Status:
                                          </AppText>
                                          <AppBadge
                                            label={isCancelled ? 'Refunded' : 'Paid Online (UPI)'}
                                            variant={isCancelled ? 'warning' : 'success'}
                                          />
                                        </View>
                                      </AppCard>

                                      {/* 5. Cancellation Button & Navigation Action */}
                                      <View style={styles.actionsContainer}>
                                        {isConfirmed && (
                                          <TouchableOpacity
                                            accessibilityRole="button"
                                            accessibilityLabel="Cancel Appointment"
                                            activeOpacity={0.8}
                                            onPress={handleCancelBooking}
                                            disabled={cancelling}
                                            style={styles.cancelButton}
                                          >
                                            {cancelling ? (
                                              <ActivityIndicator size="small" color="#DC2626" />
                                            ) : (
                                              <>
                                                <XCircle size={18} color="#DC2626" style={{ marginRight: 8 }} />
                                                <AppText variant="sm" weight="bold" color="#DC2626">
                                                  Cancel Appointment
                                                </AppText>
                                              </>
                                            )}
                                          </TouchableOpacity>
                                        )}

                                        {isAttended && (
                                          <View style={styles.disabledActionNotice}>
                                            <CheckCircle2 size={16} color="#15803D" style={{ marginRight: 6 }} />
                                            <AppText variant="xs" weight="medium" color="#166534">
                                              Consultation attended. Slot cannot be cancelled.
                                            </AppText>
                                          </View>
                                        )}

                                        {isCancelled && (
                                          <View style={[styles.disabledActionNotice, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}>
                                            <AlertCircle size={16} color="#DC2626" style={{ marginRight: 6 }} />
                                            <AppText variant="xs" weight="medium" color="#B91C1C">
                                              Appointment was cancelled. Full refund initiated.
                                            </AppText>
                                          </View>
                                        )}

                                        <AppButton
                                          title="Back to All Bookings"
                                          variant="outline"
                                          style={{ marginTop: 12 }}
                                          onPress={() => navigation.goBack()}
                                        />
                                      </View>
                                    </ScrollView>
                                  </SafeAreaView>
                                  );
};

                                  const styles = StyleSheet.create({
                                    safeArea: {
                                    flex: 1,
  },
                                  content: {
                                  padding: 16,
                                  paddingBottom: 36,
  },
                                    loadingContainer: {
                                    flex: 1,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 32,
  },
                                  statusBanner: {
                                    flexDirection: 'row',
                                  alignItems: 'center',
                                  padding: 14,
                                  borderRadius: 16,
                                  borderWidth: 1,
                                  marginBottom: 14,
  },
                                  statusBannerText: {
                                    flex: 1,
                                  marginLeft: 12,
  },
                                  card: {
                                    borderRadius: 18,
                                  borderWidth: 1,
                                  borderColor: '#E2E8F0',
                                  padding: 16,
                                  marginBottom: 14,
                                  backgroundColor: '#FFFFFF',
  },
                                  cardHeaderRow: {
                                    flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: 12,
  },
                                  sectionHeaderTitle: {
                                    letterSpacing: 0.8,
  },
                                  doctorInfoRow: {
                                    flexDirection: 'row',
                                  alignItems: 'center',
  },
                                  doctorAvatarBox: {
                                    width: 68,
                                  height: 68,
                                  borderRadius: 18,
                                  overflow: 'hidden',
                                  backgroundColor: '#E0F2FE',
                                  borderWidth: 1,
                                  borderColor: '#BAE6FD',
  },
                                  doctorAvatarImage: {
                                    width: '100%',
                                  height: '100%',
  },
                                  doctorDetailsCol: {
                                    flex: 1,
                                  marginLeft: 14,
  },
                                  ratingRow: {
                                    flexDirection: 'row',
                                  alignItems: 'center',
                                  marginTop: 4,
  },
                                  divider: {
                                    height: 1,
                                  backgroundColor: '#F1F5F9',
                                  marginVertical: 14,
  },
                                    clinicRow: {
                                    flexDirection: 'row',
                                  alignItems: 'flex-start',
  },
                                  slotRow: {
                                    flexDirection: 'row',
                                  alignItems: 'center',
  },
                                    slotIconBox: {
                                    width: 40,
                                  height: 40,
                                  borderRadius: 12,
                                  backgroundColor: '#E0F2FE',
                                  alignItems: 'center',
                                  justifyContent: 'center',
  },
                                  detailRow: {
                                    flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingVertical: 4,
  },
                                  actionsContainer: {
                                    marginTop: 4,
                                  marginBottom: 16,
  },
                                  cancelButton: {
                                    flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#FFF1F2',
                                  borderColor: '#FECDD3',
                                  borderWidth: 1.5,
                                  borderRadius: 14,
                                  height: 48,
                                  paddingHorizontal: 16,
  },
                                  disabledActionNotice: {
                                    flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#DCFCE7',
                                  borderColor: '#BBF7D0',
                                  borderWidth: 1,
                                  borderRadius: 12,
                                  padding: 10,
  },
});
