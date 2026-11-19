import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { AppText, AppButton, AppCard, AppBadge } from '../components/common';
import type { RootStackScreenProps } from '../types/navigation';

export const BookingSuccessScreen: React.FC<RootStackScreenProps<'BookingSuccess'>> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const {
    bookingId,
    doctorName,
    speciality,
    clinicName,
    appointmentDate,
    appointmentTime,
    consultationFee,
    patientName,
  } = route.params;

  // Animation values for success badge
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Success Banner */}
        <AppCard style={[styles.successBanner, { backgroundColor: theme.colors.successLight }]}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <CheckCircle size={56} color={theme.colors.success} />
          </Animated.View>

          <AppText
            variant="xl"
            weight="bold"
            color={theme.colors.success}
            style={{ marginTop: 12, textAlign: 'center' }}
          >
            Appointment Confirmed!
          </AppText>

          <AppText
            variant="sm"
            color={theme.colors.textSecondary}
            style={{ marginTop: 4, textAlign: 'center' }}
          >
            अपॉइंटमेंट सफलतापूर्वक बुक हो गया है
          </AppText>

          <AppBadge
            label={`Booking ID: #${bookingId}`}
            variant="success"
            style={{ marginTop: 8 }}
          />
        </AppCard>

        {/* Appointment Information Card */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.cardHeader}>
            <AppText variant="md" weight="bold">
              Appointment Summary
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ShieldCheck size={16} color={theme.colors.success} />
              <AppText variant="xs" weight="semibold" color={theme.colors.success} style={{ marginLeft: 4 }}>
                Instant Confirmation
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

          <View style={styles.infoRow}>
            <User size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Doctor
              </AppText>
              <AppText variant="md" weight="semibold">
                {doctorName}
              </AppText>
              <AppText variant="xs" color={theme.colors.textSecondary}>
                {speciality}
              </AppText>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <Calendar size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Date & Time
              </AppText>
              <AppText variant="md" weight="semibold">
                {appointmentDate} at {appointmentTime}
              </AppText>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <MapPin size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Clinic Address
              </AppText>
              <AppText variant="sm" weight="medium">
                {clinicName}
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.divider, marginVertical: 12 }]} />

          <View style={styles.feeRow}>
            <View>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Patient
              </AppText>
              <AppText variant="sm" weight="semibold">
                {patientName}
              </AppText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Consultation Fee
              </AppText>
              <AppText variant="md" weight="bold" color={theme.colors.primary}>
                ₹{consultationFee}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Action Buttons */}
        <AppButton
          title="View in My Bookings"
          size="lg"
          icon={<ArrowRight size={18} color={theme.colors.white} />}
          iconPosition="right"
          style={{ marginBottom: theme.spacing.sm }}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Bookings' })}
        />

        <AppButton
          title="Back to Home"
          variant="outline"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
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
  successBanner: {
    alignItems: 'center',
    paddingVertical: 24,
    borderWidth: 0,
    marginBottom: 16,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
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
    alignItems: 'flex-start',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
