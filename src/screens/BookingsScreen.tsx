import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  MapPin,
  Star,
  CheckCircle2,
  ArrowRight,
  Pill,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  AppText,
  BookingListSkeleton,
  EmptyState,
  ErrorState,
} from '../components/common';
import { doctorService } from '../services/doctorService';
import { defaultDoctorImages } from '../components/home/DoctorCarouselSection';
import { Booking } from '../types/booking';
import type { TabScreenProps } from '../types/navigation';

type BookingFilter = 'all' | 'upcoming' | 'completed';

export const BookingsScreen: React.FC<TabScreenProps<'Bookings'>> = ({ navigation }) => {
  const theme = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');

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

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (activeFilter === 'upcoming') {
        return b.status === 'confirmed';
      }
      if (activeFilter === 'completed') {
        return b.status === 'attended' || b.status === 'cancelled';
      }
      return true;
    });
  }, [bookings, activeFilter]);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: '#FFFFFF' }]}
    >
      {/* 1. Clean Modern Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <AppText variant="xxl" weight="bold" color="#0F172A" style={styles.headerMainTitle}>
            My Bookings
          </AppText>

          {/* Quick Action: Book New Doctor */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Book new doctor appointment"
            activeOpacity={0.82}
            onPress={() => navigation.navigate('DoctorSearch', {})}
            style={styles.newBookingBtn}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
            <AppText variant="xs" weight="bold" color="#FFFFFF" style={{ marginLeft: 4 }}>
              Book New
            </AppText>
          </TouchableOpacity>
        </View>

        {/* 2. Interactive Filter Tabs: All, Upcoming, Completed */}
        <View style={styles.filterTabsRow}>
          {(['all', 'upcoming', 'completed'] as const).map((tab) => {
            const isSelected = activeFilter === tab;
            const label =
              tab === 'all' ? 'All' : tab === 'upcoming' ? 'Upcoming' : 'Completed';

            return (
              <TouchableOpacity
                key={tab}
                accessibilityRole="button"
                accessibilityLabel={`Show ${label} bookings`}
                activeOpacity={0.75}
                onPress={() => setActiveFilter(tab)}
                style={[
                  styles.filterTabPill,
                  isSelected ? styles.filterTabPillActive : styles.filterTabPillInactive,
                ]}
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              >
                <AppText
                  variant="xs"
                  weight={isSelected ? 'bold' : 'medium'}
                  color={isSelected ? '#FFFFFF' : '#475569'}
                  style={styles.filterTabText}
                >
                  {label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Main Content List */}
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
          onAction={() => navigation.navigate('DoctorSearch', {})}
        />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeFilter === 'upcoming' ? 'Upcoming' : 'Completed'} Appointments`}
          description={`You do not have any ${activeFilter} appointments right now.`}
          actionTitle="View All Appointments"
          onAction={() => setActiveFilter('all')}
        />
      ) : (
        <ScrollView
          style={{ backgroundColor: '#FFFFFF' }}
          contentContainerStyle={styles.content}
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
          {filteredBookings.map((b) => {
            const isAttended = b.status === 'attended';
            const isCancelled = b.status === 'cancelled';
            const doctorImage =
              b.imageUrl || defaultDoctorImages[b.doctorId] || defaultDoctorImages['doc-1'];
            const rating = b.rating || 4.8;
            const reviewsCount = b.reviewsCountFormatted || '8k reviews';

            return (
              <View key={b.id} style={styles.bookingCard}>
                {/* 1. Top Row: Status Badge (Completed / Upcoming / Cancelled) & View Details link */}
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.topStatusBadge,
                      {
                        backgroundColor: isCancelled
                          ? '#FEE2E2'
                          : isAttended
                            ? '#EEF2FF'
                            : '#E0F2FE',
                      },
                    ]}
                  >
                    <CheckCircle2
                      size={14}
                      color={isCancelled ? '#DC2626' : isAttended ? '#4F46E5' : '#0284C7'}
                    />
                    <AppText
                      variant="xs"
                      weight="bold"
                      color={isCancelled ? '#DC2626' : isAttended ? '#4F46E5' : '#0284C7'}
                      style={{ marginLeft: 5 }}
                    >
                      {isCancelled ? 'Cancelled' : isAttended ? 'Completed' : 'Upcoming'}
                    </AppText>
                  </View>

                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`View details for appointment with ${b.doctorName}`}
                    onPress={() => navigation.navigate('BookingDetails', { bookingId: b.id })}
                    style={styles.viewDetailsBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <AppText variant="xs" weight="bold" color="#0D9488" style={styles.viewDetailsText}>
                      View Details →
                    </AppText>
                  </TouchableOpacity>
                </View>

                {/* 2. Middle Row: Doctor Avatar + Info + Attended/Confirmed Pill */}
                <View style={styles.doctorInfoRow}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: doctorImage }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.doctorTextCol}>
                    <AppText variant="md" weight="bold" color="#0F172A" numberOfLines={1}>
                      {b.doctorName}
                    </AppText>
                    <AppText variant="xs" color="#64748B" style={styles.specialityText} numberOfLines={1}>
                      {b.speciality}
                    </AppText>
                    <View style={styles.ratingRow}>
                      <Star size={13} color="#F59E0B" fill="#F59E0B" />
                      <AppText variant="xs" weight="semibold" color="#334155" style={{ marginLeft: 4 }}>
                        {rating} ({reviewsCount})
                      </AppText>
                    </View>
                  </View>

                  {/* Right Status Pill */}
                  <View
                    style={[
                      styles.rightStatusPill,
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
                    <CheckCircle2
                      size={13}
                      color={isCancelled ? '#DC2626' : isAttended ? '#16A34A' : '#0284C7'}
                    />
                    <AppText
                      variant="xs"
                      weight="bold"
                      color={isCancelled ? '#DC2626' : isAttended ? '#15803D' : '#0284C7'}
                      style={styles.rightStatusText}
                    >
                      {isCancelled ? 'Cancelled' : isAttended ? 'Attended' : 'Confirmed'}
                    </AppText>
                  </View>
                </View>

                {/* Subtle Divider */}
                <View style={styles.cardDivider} />

                {/* 3. Bottom Row: Date & Time | Clinic & Location */}
                <View style={styles.cardBottomRow}>
                  {/* Left Column: Date & Time */}
                  <View style={styles.bottomCol}>
                    <Calendar size={18} color="#64748B" style={styles.bottomIcon} />
                    <View style={styles.bottomColText}>
                      <AppText variant="xs" weight="bold" color="#0F172A">
                        {b.appointmentDate}
                      </AppText>
                      <AppText variant="xs" color="#64748B" style={{ marginTop: 2 }}>
                        {b.appointmentTime}
                      </AppText>
                    </View>
                  </View>

                  {/* Vertical Divider */}
                  <View style={styles.verticalDivider} />

                  {/* Right Column: Clinic & City */}
                  <View style={styles.bottomCol}>
                    <MapPin size={18} color="#0D9488" style={styles.bottomIcon} />
                    <View style={styles.bottomColText}>
                      <AppText variant="xs" weight="bold" color="#0F172A" numberOfLines={1}>
                        {b.clinicName}
                      </AppText>
                      <AppText variant="xs" color="#64748B" style={{ marginTop: 2 }}>
                        {b.city || 'Hyderabad'}
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {/* 4. Never miss your medicines banner matching the mockup */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Never miss your medicines. Set reminders for your next dose"
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Prescriptions')}
            style={styles.medicineBanner}
          >
            {/* Medicine Bottle Graphic */}
            <View style={styles.medIconBox}>
              <View style={styles.medBottle}>
                <View style={styles.medBottleCap} />
                <View style={styles.medBottleBody}>
                  <Pill size={16} color="#0D9488" />
                </View>
                <View style={styles.pillsCluster}>
                  <View style={[styles.pillDot, { backgroundColor: '#F97316' }]} />
                  <View style={[styles.pillDot, { backgroundColor: '#FBBF24', left: 7 }]} />
                </View>
              </View>
            </View>

            {/* Banner Text */}
            <View style={styles.medBannerTextCol}>
              <AppText variant="sm" weight="bold" color="#0F172A">
                Never miss your medicines!
              </AppText>
              <AppText variant="xs" color="#0D9488" style={{ marginTop: 2, fontWeight: '500' }}>
                Set reminders for your next dose
              </AppText>
            </View>

            {/* Round Teal Arrow Button */}
            <View style={styles.medArrowBtn}>
              <ArrowRight size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </ScrollView >
      )}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerMainTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  newBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  filterTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabPillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  filterTabPillInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  filterTabText: {
    fontSize: 13,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 13,
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E0F2FE',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  doctorTextCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  specialityText: {
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rightStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  rightStatusText: {
    marginLeft: 4,
    fontSize: 11,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bottomIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  bottomColText: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  medicineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7F6',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#99F6E4',
    padding: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  medIconBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medBottle: {
    width: 32,
    height: 38,
    alignItems: 'center',
    position: 'relative',
  },
  medBottleCap: {
    width: 16,
    height: 6,
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  medBottleBody: {
    width: 28,
    height: 30,
    backgroundColor: '#0E7490',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0891B2',
  },
  pillsCluster: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    flexDirection: 'row',
  },
  pillDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  medBannerTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  medArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
