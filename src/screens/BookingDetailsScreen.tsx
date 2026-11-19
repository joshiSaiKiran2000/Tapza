import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, User, CheckCircle, Phone, FileText } from 'lucide-react-native';
import { useTheme } from '../theme';
import { AppText, AppButton, AppCard, AppBadge, AppHeader } from '../components/common';
import type { RootStackScreenProps } from '../types/navigation';

export const BookingDetailsScreen: React.FC<RootStackScreenProps<'BookingDetails'>> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { bookingId } = route.params;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        title="Booking Details"
        subtitle={`Reference #${bookingId}`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.statusRow}>
            <View>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Appointment Status
              </AppText>
              <AppText variant="lg" weight="bold" color={theme.colors.success}>
                Confirmed (पुष्टि की गई)
              </AppText>
            </View>
            <AppBadge label="Paid Online" variant="success" />
          </View>
        </AppCard>

        {/* Doctor and Clinic */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="md" weight="bold">
            Doctor & Hospital
          </AppText>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <AppText variant="md" weight="semibold">
            Dr. Ramesh Reddy
          </AppText>
          <AppText variant="sm" color={theme.colors.textSecondary}>
            Interventional Cardiologist
          </AppText>
          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <MapPin size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <AppText variant="xs" color={theme.colors.textSecondary} style={{ flex: 1 }}>
              Care Hospitals, Banjara Hills, Hyderabad
            </AppText>
          </View>
        </AppCard>

        {/* Schedule */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="md" weight="bold">
            Slot Schedule
          </AppText>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.infoRow}>
            <Calendar size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <AppText variant="sm" weight="semibold">
              Tomorrow, 20 Nov 2026
            </AppText>
          </View>
          <View style={[styles.infoRow, { marginTop: 8 }]}>
            <Clock size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <AppText variant="sm" weight="semibold">
              10:30 AM IST (Slot duration: 20 mins)
            </AppText>
          </View>
        </AppCard>

        {/* Patient Details */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="md" weight="bold">
            Patient Information
          </AppText>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.patientRow}>
            <AppText variant="sm" color={theme.colors.textSecondary}>
              Name:
            </AppText>
            <AppText variant="sm" weight="semibold">
              Aarav Sharma (Male, 34 Yrs)
            </AppText>
          </View>
          <View style={styles.patientRow}>
            <AppText variant="sm" color={theme.colors.textSecondary}>
              Consultation Fee:
            </AppText>
            <AppText variant="sm" weight="bold" color={theme.colors.primary}>
              ₹800 (Incl. GST)
            </AppText>
          </View>
        </AppCard>

        <AppButton
          title="Back to All Bookings"
          variant="outline"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Bookings' })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
