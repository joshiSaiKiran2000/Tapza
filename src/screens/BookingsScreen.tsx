import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  AppButton,
  AppCard,
  AppBadge,
  AppHeader,
  BookingListSkeleton,
  EmptyState,
  ErrorState,
} from '../components/common';
import { doctorService } from '../services/doctorService';
import { Booking } from '../types/booking';
import type { TabScreenProps } from '../types/navigation';

export const BookingsScreen: React.FC<TabScreenProps<'Bookings'>> = ({ navigation }) => {
  const theme = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await doctorService.getBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      >
        <AppHeader
          title="My Bookings"
          subtitle="Upcoming & past doctor consultations across Hyderabad"
        />

        {loading && !refreshing ? (
          <BookingListSkeleton />
        ) : error && bookings.length === 0 ? (
          <ErrorState
            title="Could Not Load Bookings"
            message={error}
            onRetry={() => loadBookings()}
          />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Appointments Yet"
            description="Book appointments with top Hyderabad cardiologists, pediatricians, and general physicians."
            actionTitle="Explore Doctors"
            onAction={() => navigation.navigate('DoctorDetails', { doctorId: 'doc-1' })}
          />
        ) : (
          <ScrollView
            contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadBookings(true)}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          >
            {bookings.map((b) => {
              const isConfirmed = b.status === 'confirmed';
              return (
                <AppCard key={b.id} style={{ marginBottom: theme.spacing.md }}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="md" weight="bold">
                        {b.doctorName}
                      </AppText>
                      <AppText variant="xs" color={theme.colors.textSecondary}>
                        {b.speciality}
                      </AppText>
                    </View>
                    <AppBadge
                      label={isConfirmed ? 'Confirmed' : 'Pending'}
                      variant={isConfirmed ? 'success' : 'warning'}
                    />
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

                  <View style={styles.detailRow}>
                    <Clock size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                    <AppText variant="sm" weight="medium" color={theme.colors.text}>
                      {b.appointmentDate} • {b.appointmentTime}
                    </AppText>
                  </View>

                  <View style={[styles.detailRow, { marginTop: 6 }]}>
                    <MapPin size={16} color={theme.colors.textMuted} style={{ marginRight: 6 }} />
                    <AppText variant="xs" color={theme.colors.textSecondary} numberOfLines={1}>
                      {b.clinicName}, {b.clinicAddress}
                    </AppText>
                  </View>

                  <View style={[styles.actionRow, { marginTop: theme.spacing.md }]}>
                    <View>
                      <AppText variant="xs" color={theme.colors.textMuted}>
                        Consultation Fee
                      </AppText>
                      <AppText variant="sm" weight="bold" color={theme.colors.primary}>
                        ₹{b.consultationFee} (Paid)
                      </AppText>
                    </View>

                    <AppButton
                      title="View Slip"
                      variant="outline"
                      size="sm"
                      icon={<ChevronRight size={16} color={theme.colors.primary} />}
                      iconPosition="right"
                      onPress={() => navigation.navigate('BookingDetails', { bookingId: b.id })}
                    />
                  </View>
                </AppCard>
              );
            })}
          </ScrollView>
        )
        }
      </SafeAreaView >
      );
};

      const styles = StyleSheet.create({
        safeArea: {
        flex: 1,
  },
      content: {
        paddingBottom: 24,
  },
      cardHeader: {
        flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
      divider: {
        height: 1,
      marginVertical: 10,
  },
      detailRow: {
        flexDirection: 'row',
      alignItems: 'center',
  },
      actionRow: {
        flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
});
