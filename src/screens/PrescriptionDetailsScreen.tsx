import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Stethoscope,
  MapPin,
  Calendar,
  AlertCircle,
  Apple,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { AppText, AppButton, AppCard, AppBadge, AppHeader } from '../components/common';
import { MedicineCard } from '../components/prescriptions';
import { usePrescriptionDetails } from '../hooks/usePrescriptionDetails';
import type { RootStackScreenProps } from '../types/navigation';

export const PrescriptionDetailsScreen: React.FC<RootStackScreenProps<'PrescriptionDetails'>> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { prescriptionId } = route.params;
  const { prescription, loading, error, refresh, toggleDose } =
    usePrescriptionDetails(prescriptionId);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <AppHeader title="Prescription Details" showBack onBack={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <AppText variant="sm" color={theme.colors.textSecondary} style={{ marginTop: 12 }}>
            Loading electronic prescription...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !prescription) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <AppHeader title="Prescription Details" showBack onBack={() => navigation.goBack()} />
        <View style={[styles.centerContainer, { padding: theme.spacing.lg }]}>
          <AlertCircle size={44} color={theme.colors.error} />
          <AppText variant="md" weight="bold" style={{ marginTop: 12 }}>
            Unable to Load Prescription
          </AppText>
          <AppText variant="sm" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
            {error || 'Prescription not found'}
          </AppText>
          <AppButton
            title="Go Back"
            variant="outline"
            style={{ marginTop: 16 }}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isActive = prescription.status === 'active';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        title={prescription.diagnosis}
        subtitle={`Prescribed by ${prescription.doctorName}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Prescription Header / Clinic & Doctor info */}
        <AppCard style={{ marginBottom: theme.spacing.md }}>
          <View style={styles.doctorHeader}>
            <View style={[styles.avatarBox, { backgroundColor: theme.colors.primaryLight }]}>
              <Stethoscope size={22} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <AppText variant="md" weight="bold">
                  {prescription.doctorName}
                </AppText>
                <AppBadge
                  label={isActive ? 'Active Course' : 'Completed'}
                  variant={isActive ? 'success' : 'info'}
                />
              </View>

              <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 1 }}>
                {prescription.doctorSpeciality} • {prescription.doctorDegrees}
              </AppText>

              <View style={[styles.clinicRow, { marginTop: 4 }]}>
                <MapPin size={13} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
                <AppText variant="xs" color={theme.colors.textMuted} numberOfLines={1}>
                  {prescription.clinicName}, {prescription.clinicAddress}
                </AppText>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

          <View style={styles.metaRow}>
            <View>
              <AppText variant="xs" color={theme.colors.textMuted}>
                Prescribed Date
              </AppText>
              <AppText variant="sm" weight="semibold">
                {prescription.prescribedDate}
              </AppText>
            </View>

            {prescription.nextFollowUpDate ? (
              <View style={{ alignItems: 'flex-end' }}>
                <AppText variant="xs" color={theme.colors.textMuted}>
                  Next Follow-up
                </AppText>
                <AppText variant="sm" weight="semibold" color={theme.colors.primary}>
                  {prescription.nextFollowUpDate}
                </AppText>
              </View>
            ) : null}
          </View>
        </AppCard>

        {/* Dietary Advice & Precautions */}
        {prescription.dietaryAdvice ? (
          <AppCard style={[styles.dietCard, { backgroundColor: theme.colors.surfaceVariant, marginBottom: theme.spacing.md }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Apple size={18} color={theme.colors.secondary} />
              <AppText variant="sm" weight="bold" style={{ marginLeft: 6 }}>
                Doctor&apos;s Lifestyle & Dietary Advice
              </AppText>
            </View>
            <AppText variant="xs" color={theme.colors.textSecondary} style={{ marginTop: 6, lineHeight: 18 }}>
              {prescription.dietaryAdvice}
            </AppText>
            {prescription.dietaryAdviceHindi ? (
              <AppText
                variant="xs"
                color={theme.colors.textMuted}
                style={{ fontStyle: 'italic', marginTop: 4, lineHeight: 18 }}
              >
                {prescription.dietaryAdviceHindi}
              </AppText>
            ) : null}
          </AppCard>
        ) : null}

        {/* Prescribed Medicines with Morning/Afternoon/Night Dose Tracker */}
        <AppText variant="md" weight="bold" style={{ marginBottom: theme.spacing.sm }}>
          Prescribed Medicines ({prescription.medicines.length})
        </AppText>

        {prescription.medicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            onToggleDose={(medId, timing) => toggleDose(medId, timing)}
          />
        ))}

        <AppButton
          title="Back to All Prescriptions"
          variant="outline"
          style={{ marginTop: 8, marginBottom: 24 }}
          onPress={() => navigation.goBack()}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dietCard: {
    borderWidth: 0,
  },
});
